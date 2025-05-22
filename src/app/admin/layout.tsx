'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname.split('/').pop() || 'orders');

  const tabs = [
    { id: 'orders', name: 'Заказы' },
    { id: 'products', name: 'Товары' },
    { id: 'users', name: 'Пользователи' },
    { id: 'stats', name: 'Статистика' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Административная панель</h1>
      
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/${tab.id}`}
            className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
