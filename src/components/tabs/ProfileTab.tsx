"use client";
import React, { useState, useContext, useEffect } from 'react'; // Добавляем useEffect
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppStateContext } from '@/context/AppStateProvider';
import LoginForm from '@/components/LoginForm';
import RegistrationForm from '@/components/RegistrationForm'; // Импортируем RegistrationForm
import { 
  faMapMarkedAlt, 
  faChevronRight,
  faUserEdit,
  faBell,
  faShieldAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';

const ProfileTab: React.FC = () => {
  const { currentUser, logout } = useContext(AppStateContext);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogin, setShowLogin] = useState(true); // Состояние для переключения форм

  useEffect(() => {
    // Сбрасываем состояние загрузки при изменении пользователя (вход/выход)
    // Это предотвратит "зависание" индикатора после повторного входа.
    setLoading(false);
  }, [currentUser]);

  const profileLinks = [
    { 
      text: "Личные данные", 
      icon: faUserEdit, 
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "#",
      tab: 'profile'
    },
    { 
      text: "Адреса доставки", 
      icon: faMapMarkedAlt, 
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      href: "#",
      tab: 'addresses'
    },
    { 
      text: "Способы оплаты", 
      icon: faCreditCard, 
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "#",
      tab: 'payments'
    },
    { 
      text: "Уведомления", 
      icon: faBell, 
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      href: "#",
      tab: 'notifications',
      badge: "3 новых"
    },
    { 
      text: "Безопасность", 
      icon: faShieldAlt, 
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      href: "#",
      tab: 'security'
    },
  ];

  const handleTabChange = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    // Убираем setTimeout для немедленного скрытия индикатора загрузки,
    // чтобы проверить, решает ли это проблему "зависания".
    setLoading(false); 
  };

  if (!currentUser) {
    if (showLogin) {
      return <LoginForm onSwitchToRegister={() => setShowLogin(false)} />;
    } else {
      return <RegistrationForm onSwitchToLogin={() => setShowLogin(true)} />;
    }
  }

  return (
    <div className="p-4">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            Загружаем данные...
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <Image
            // Используем phoneNumber для генерации аватара или заглушку
            src={currentUser.phoneNumber ? `https://i.pravatar.cc/150?u=${currentUser.phoneNumber}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60"}
            alt="Аватар"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
          />
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition">
            <FontAwesomeIcon icon={faUserEdit} className="w-4 h-4" />
          </button>
        </div>
        {/* Отображаем номер телефона. Можно добавить форматирование или псевдоним, если нужно */}
        <h2 className="text-xl font-bold text-gray-800">{currentUser.phoneNumber}</h2>
        {/* Email больше не отображаем, так как его нет в данных пользователя */}
      </div>

      <div className="space-y-3 mb-6">
        {profileLinks.map(link => (
          <button
            key={link.text}
            onClick={() => handleTabChange(link.tab)}
            className={`w-full flex items-center p-4 rounded-xl transition-all
              ${link.bgColor} hover:shadow-md
              ${activeTab === link.tab ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${link.iconColor} ${link.bgColor} mr-4`}>
              <FontAwesomeIcon icon={link.icon} className="w-5" />
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium text-gray-800">{link.text}</span>
            </div>
            {link.badge && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full mr-2">
                {link.badge}
              </span>
            )}
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Статистика</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Заказов</p>
            <p className="text-xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Покупок</p>
            <p className="text-xl font-bold text-green-600">24</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Отзывов</p>
            <p className="text-xl font-bold text-purple-600">8</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Баллов</p>
            <p className="text-xl font-bold text-yellow-600">1,240</p>
          </div>
        </div>
      </div>

      <button
        className="w-full flex items-center justify-center py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl transition"
        onClick={() => {
          setLoading(true);
          logout(); // Вызываем функцию logout из контекста
          // setLoading(false) // Можно убрать, так как компонент перерисуется
        }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default ProfileTab;
