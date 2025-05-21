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
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function StoreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
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
      <h1 className="text-2xl font-bold mb-6">Заказы магазина</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">Заказ #{order.id.slice(0, 8)}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="mt-2">Адрес: {order.address}</p>
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
