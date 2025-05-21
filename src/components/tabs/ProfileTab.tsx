"use client";
import React, { useState, useContext } from 'react';
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
            src={currentUser.phoneNumber 
              ? `https://i.pravatar.cc/150?u=${currentUser.phoneNumber}` 
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60"}
            alt="Аватар"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">{currentUser.phoneNumber}</h2>
        </div>

        {/* Адрес */}
        <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-4">
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-3">
            <FontAwesomeIcon icon={faMapMarkedAlt} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Адрес доставки</p>
            <p className="font-medium">
              {currentUser?.address || 'Не указан'}
            </p>
          </div>
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
          {/* Пример заказа */}
          <div className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Заказ #12345</p>
                <p className="text-sm text-gray-500">21 мая 2025</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Доставлен
              </span>
            </div>
            <p className="mt-2 text-sm">2 товара на сумму 5 490 ₽</p>
          </div>

          {/* Кнопка "Все заказы" */}
          <button className="w-full text-center text-blue-600 hover:text-blue-800 py-2">
            Показать все заказы →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
