"use client";
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppStateContext } from '@/context/AppStateProvider';
import LoginForm from '@/components/LoginForm';
import RegistrationForm from '@/components/RegistrationForm';
import { 
  faMapMarkedAlt,
  faSignOutAlt,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

const ProfileTab: React.FC = () => {
  const { currentUser, logout } = useContext(AppStateContext);
  const [showLogin, setShowLogin] = useState(true);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(currentUser?.address || '');
  interface Order {
    id: string;
    created_at: string;
    status: 'new' | 'delivered' | 'processing';
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = async () => {
    if (currentUser?.id) {
      setOrdersLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setOrders(data);
      } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
      } finally {
        setOrdersLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser?.id]);

  // Обновляем заказы при изменении пользователя
  useEffect(() => {
    const channel = supabase
      .channel('orders_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id]);

  if (!currentUser) {
    return showLogin 
      ? <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
      : <RegistrationForm onSwitchToLogin={() => setShowLogin(true)} />;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Профиль пользователя */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col items-center mb-4">
          <Image
            src={currentUser.avatar_url || 
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60"}
            alt="Аватар"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">{currentUser.phoneNumber}</h2>
        </div>

        {/* Адрес */}
        <div className="p-3 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faMapMarkedAlt} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Адрес доставки</p>
              {!isEditingAddress ? (
                <p className="font-medium">
                  {currentUser?.address || 'Не указан'}
                </p>
              ) : (
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Введите адрес"
                />
              )}
            </div>
            <button 
              onClick={async () => {
                if (isEditingAddress && currentUser) {
                  try {
                    const { error } = await supabase
                      .from('users')
                      .update({ address: addressInput })
                      .eq('id', currentUser.id);

                    if (error) throw error;

                    // Обновляем локальное состояние
                    currentUser.address = addressInput;
                  } catch (err) {
                    console.error('Ошибка сохранения адреса:', err);
                    alert('Не удалось сохранить адрес');
                  }
                }
                setIsEditingAddress(!isEditingAddress);
                setAddressInput(currentUser?.address || '');
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isEditingAddress ? 'Сохранить' : 'Изменить'}
            </button>
          </div>
          {isEditingAddress && (
            <div className="flex justify-end space-x-2 mt-2">
              <button 
                onClick={() => {
                  setIsEditingAddress(false);
                  setAddressInput(currentUser?.address || '');
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Отмена
              </button>
            </div>
          )}
        </div>

        {/* Кнопка выхода */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Выйти
        </button>
      </div>

      {/* Мои заказы */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FontAwesomeIcon icon={faBoxOpen} className="text-blue-600 mr-2" />
          Мои заказы
        </h3>

        <div className="space-y-3">
          {ordersLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : orders.length > 0 ? (
            orders.map(order => (
              <div key={order.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Заказ №{new Date(order.created_at).getTime().toString().slice(-6)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <span className={`${
                    order.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  } text-xs px-2 py-1 rounded`}>
                    {order.status === 'new' ? 'Новый' : 
                     order.status === 'delivered' ? 'Доставлен' : 'В обработке'}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    {order.items.length} товара на сумму{' '}
                    {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ₽
                  </p>
                  <div className="mt-2 border-t pt-2 space-y-2">
                    {order.items.map((item, index) => (
                      <Link 
                        key={index} 
                        href={`/products/${item.id}`}
                        className="block hover:bg-gray-50 rounded p-2 -mx-2 transition"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-600 hover:text-blue-800">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {item.price * item.quantity} ₽
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">У вас пока нет заказов</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
