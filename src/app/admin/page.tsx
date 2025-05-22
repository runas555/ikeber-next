'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Административная панель</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Заказы</h2>
          <p className="text-gray-600">Управление заказами клиентов</p>
        </Link>

        <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Товары</h2>
          <p className="text-gray-600">Управление товарами и услугами</p>
        </Link>

        <Link href="/admin/users" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Пользователи</h2>
          <p className="text-gray-600">Управление пользователями и ролями</p>
        </Link>

        <Link href="/admin/stats" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Статистика</h2>
          <p className="text-gray-600">Аналитика и отчеты</p>
        </Link>
      </div>
    </div>
  );
}
