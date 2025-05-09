"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAngleRight,
  faCheckCircle,
  faClock,
  faTruck,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

interface Order {
  id: string;
  date: string;
  status: 'Доставлен' | 'В пути' | 'Обработка' | 'Отменен';
  items: {
    image: string;
    name: string;
    price: string;
    quantity: number;
  }[];
  total: string;
  address: string;
}

const sampleOrders: Order[] = [
  {
    id: 'ORD-2024-10583',
    date: '15 мая 2024',
    status: 'Доставлен',
    items: [
      {
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        name: 'Ваза "Лазурь"',
        price: '2 800 ₽',
        quantity: 1
      },
      {
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        name: 'Кроссовки "Urban Run"',
        price: '4 690 ₽',
        quantity: 1
      }
    ],
    total: '7 490 ₽',
    address: 'ул. Ленина, д. 42, кв. 15'
  },
  {
    id: 'ORD-2024-10579',
    date: '18 мая 2024',
    status: 'В пути',
    items: [
      {
        image: 'https://images.unsplash.com/photo-1611117775350-ac3c7099e9c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        name: 'Ремонт холодильника',
        price: '500 ₽',
        quantity: 1
      }
    ],
    total: '500 ₽',
    address: 'ул. Мира, д. 12'
  }
];

const statusIcons = {
  'Доставлен': faCheckCircle,
  'В пути': faTruck,
  'Обработка': faClock,
  'Отменен': faTimesCircle
};

const statusColors = {
  'Доставлен': 'text-green-600 bg-green-100',
  'В пути': 'text-blue-600 bg-blue-100',
  'Обработка': 'text-yellow-600 bg-yellow-100',
  'Отменен': 'text-red-600 bg-red-100'
};

const OrdersTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setLoading(true);
    setTimeout(() => {
      setExpandedOrder(expandedOrder === orderId ? null : orderId);
      setLoading(false);
    }, 300);
  };

  if (sampleOrders.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faTimesCircle} className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Нет заказов</h3>
        <p className="mt-1 text-gray-500">У вас пока нет активных или завершенных заказов.</p>
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Начать покупки
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Мои заказы</h1>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            Загружаем информацию...
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sampleOrders.map((order) => (
          <div 
            key={order.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all
              ${expandedOrder === order.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleOrder(order.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">Заказ #{order.id}</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className={`flex items-center text-sm px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                  <FontAwesomeIcon icon={statusIcons[order.status]} className="mr-2" />
                  {order.status}
                </div>
              </div>

              <div className="mt-3 flex items-center space-x-2">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500">+{order.items.length - 3}</span>
                  </div>
                )}
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Состав заказа:</h4>
                <ul className="space-y-3">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden mr-3">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span>Адрес доставки:</span>
                    <span className="font-medium">{order.address}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Итого:</span>
                    <span>{order.total}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
              <span className="font-bold">{order.total}</span>
              <button 
                className="text-blue-600 hover:text-blue-700 flex items-center"
                onClick={() => toggleOrder(order.id)}
              >
                {expandedOrder === order.id ? 'Свернуть' : 'Подробности'}
                <FontAwesomeIcon icon={faAngleRight} className={`ml-2 transition-transform ${expandedOrder === order.id ? 'transform rotate-90' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;
