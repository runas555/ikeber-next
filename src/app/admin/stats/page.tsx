'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  ordersByStatus: {
    new: number;
    processing: number;
    delivered: number;
    canceled: number;
  };
  recentOrders: {
    id: string;
    total: number;
    date: string;
  }[];
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Получаем общее количество заказов
        const { count: totalOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact' });

        // Получаем общую выручку
        const { data: revenueData } = await supabase
          .from('orders')
          .select('items')
          .eq('status', 'delivered');

        interface OrderItem {
          id: string;
          name: string;
          price: number;
          quantity: number;
        }

        const totalRevenue = revenueData?.reduce((sum, order) => {
          const items = typeof order.items === 'string' 
            ? JSON.parse(order.items) as OrderItem[] 
            : order.items as OrderItem[];
          return sum + items.reduce((itemSum: number, item: OrderItem) => itemSum + (item.price * item.quantity), 0);
        }, 0) || 0;

        // Получаем общее количество пользователей
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact' });

        // Получаем общее количество товаров
        const { count: totalProducts } = await supabase
          .from('items')
          .select('*', { count: 'exact' });

        // Получаем количество заказов по статусам
        const { count: newOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .eq('status', 'new');

        const { count: processingOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .eq('status', 'processing');

        const { count: deliveredOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .eq('status', 'delivered');

        const { count: canceledOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .eq('status', 'canceled');

        // Получаем последние 5 заказов
        const { data: recentOrders } = await supabase
          .from('orders')
          .select('id, items, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalOrders: totalOrders || 0,
          totalRevenue,
          totalUsers: totalUsers || 0,
          totalProducts: totalProducts || 0,
          ordersByStatus: {
            new: newOrders || 0,
            processing: processingOrders || 0,
            delivered: deliveredOrders || 0,
            canceled: canceledOrders || 0
          },
            recentOrders: recentOrders?.map(order => ({
              id: order.id,
              total: typeof order.items === 'string' 
                ? JSON.parse(order.items).reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0)
                : order.items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0),
              date: order.created_at
            })) || []
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="p-4">Загрузка статистики...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Статистика магазина</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Всего заказов</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Общая выручка</h3>
          <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Пользователи</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Товары</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Заказы по статусам</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span>Новые</span>
              <span className="font-medium">{stats.ordersByStatus.new}</span>
            </div>
            <div className="flex justify-between">
              <span>В обработке</span>
              <span className="font-medium">{stats.ordersByStatus.processing}</span>
            </div>
            <div className="flex justify-between">
              <span>Доставлено</span>
              <span className="font-medium">{stats.ordersByStatus.delivered}</span>
            </div>
            <div className="flex justify-between">
              <span>Отменено</span>
              <span className="font-medium">{stats.ordersByStatus.canceled}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Последние заказы</h2>
          <div className="space-y-3">
            {stats.recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center">
                <span className="text-sm">Заказ #{order.id.slice(0, 6)}</span>
                <span className="font-medium">{order.total.toLocaleString()} ₽</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
