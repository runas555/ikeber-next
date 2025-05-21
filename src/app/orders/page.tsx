'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';

interface Order {
  id: string;
  user_id: string;
  address: string;
  items: OrderItem[] | string;
  status: 'new' | 'processing' | 'delivered';
  created_at: string;
  user: {
    phone_number: string;
  };
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function OrdersManagementDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:users(phone_number)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();

    const subscription = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
    } else {
      // Отправляем уведомление пользователю
      await supabase
        .from('notifications')
        .insert({
          user_id: orders.find(o => o.id === orderId)?.user_id,
          message: `Статус вашего заказа изменен на "${newStatus}"`,
          type: 'order_status'
        });
    }
  };

  if (loading) {
    return <div className="p-4">Загрузка заказов...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление заказами</h1>
        <div className="flex space-x-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Новые: {orders.filter(o => o.status === 'new').length}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            В работе: {orders.filter(o => o.status === 'processing').length}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Доставлено: {orders.filter(o => o.status === 'delivered').length}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">Заказ #{new Date(order.created_at).getTime().toString().slice(-6)}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="mt-2">Адрес: {order.address}</p>
                <p>Телефон: {order.user?.phone_number || 'не указан'}</p>
                <p>Статус: {order.status}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => updateOrderStatus(order.id, 'processing')}
                  disabled={order.status === 'processing'}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  В обработке
                </Button>
                <Button 
                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                  disabled={order.status === 'delivered'}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Доставлен
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium">Товары:</h3>
              <ul className="list-disc pl-5 mt-2">
                {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item: OrderItem) => (
                  <li key={item.id}>
                    {item.name} - {item.quantity} шт. × {item.price} ₽
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
