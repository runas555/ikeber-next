"use client";
import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

// Sample order data - replace with actual data fetching
const orders = [
  {
    id: 'LH-10583',
    date: '15 мая 2024',
    status: 'Доставлен',
    statusColor: 'green',
    itemsPreview: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNlcmFtaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&h=60&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&h=60&q=80",
    ],
    additionalItemsCount: 1,
    itemsDescription: 'Ваза ручной работы, Кроссовки "Urban Run", ...',
    total: '7 490 ₽',
  },
  {
    id: 'LH-10579',
    date: '18 мая 2024',
    status: 'В обработке',
    statusColor: 'yellow',
    itemsPreview: [
      "https://images.unsplash.com/photo-1611117775350-ac3c7099e9c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dG9vbCUyMHJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=60&h=60&q=80",
    ],
    additionalItemsCount: 0,
    itemsDescription: 'Услуга: Ремонт бытовой техники',
    total: '500 ₽',
  }
];

const OrdersTab: React.FC = () => {
  if (orders.length === 0) {
    return (
      <div id="orders-tab" className="tab-content p-4 text-center py-12">
        {/* SVG and "Нет заказов" message can be added here if needed */}
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет заказов</h3>
        <p className="mt-1 text-sm text-gray-500">У вас пока нет активных или завершенных заказов.</p>
        <button /* onClick={() => switchTab('home')} */
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Начать покупки
        </button>
      </div>
    );
  }

  return (
    <div id="orders-tab" className="tab-content p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Мои заказы</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-900">Заказ #{order.id}</span>
                  <p className="text-xs text-gray-500">от {order.date}</p>
                </div>
                <span className={`text-xs font-medium bg-${order.statusColor}-100 text-${order.statusColor}-700 px-2.5 py-1 rounded-full`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center space-x-2 my-3">
                {order.itemsPreview.map((imgSrc, index) => (
                  <Image key={index} src={imgSrc} alt="Preview" width={48} height={48} className="w-12 h-12 rounded-md object-cover border border-gray-200" />
                ))}
                {order.additionalItemsCount > 0 && (
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                    <span className="text-xs text-gray-500">+{order.additionalItemsCount}</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {order.itemsDescription}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
              <span className="text-base font-bold text-gray-900">{order.total}</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Детали заказа <FontAwesomeIcon icon={faAngleRight} className="fa-xs ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;
