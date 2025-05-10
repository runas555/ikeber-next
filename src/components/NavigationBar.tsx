"use client";
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation'; // Импортируем useRouter
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faThLarge, faListAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider'; 

const tabs = [
  { id: 'home', label: 'Главная', icon: faHome },
  { id: 'categories', label: 'Категории', icon: faThLarge },
  { id: 'orders', label: 'Заказы', icon: faListAlt },
  { id: 'profile', label: 'Профиль', icon: faUser },
];

const NavigationBar: React.FC = () => {
  const router = useRouter(); // Инициализируем useRouter
  const appState = useContext(AppStateContext);

  if (!appState) {
    console.warn("AppStateContext is not available in NavigationBar");
    return null; 
  }

  const { activeTab, setActiveTab, ordersBadgeCount } = appState;

  const handleTabClick = (tabId: string) => {
    // Сначала переходим на главную страницу, если мы не на ней
    // Проверка текущего пути может быть сложной из-за динамических сегментов.
    // Проще всегда пушить '/', а setActiveTab обновит контент.
    router.push('/'); 
    
    // Устанавливаем активную вкладку.
    // Небольшая задержка может помочь, если HomePage не успевает среагировать на изменение activeTab
    // после router.push. Но для начала попробуем без нее.
    // setActiveTab(tabId);
    // Для большей надежности, особенно если HomePage имеет сложный рендер:
    requestAnimationFrame(() => {
        setActiveTab(tabId);
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top z-40">
      <div className="flex justify-around"> {/* Удалены max-w-screen-sm и mx-auto */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)} // Используем новый обработчик
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors duration-200 ease-in-out
                        ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <div className="relative">
              <FontAwesomeIcon icon={tab.icon} className={`text-xl mb-0.5 tab-icon ${activeTab === tab.id ? 'scale-110' : ''}`} />
              {tab.id === 'orders' && ordersBadgeCount > 0 && (
                <span className="absolute top-[-3px] right-[-7px] bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {ordersBadgeCount}
                </span>
              )}
            </div>
            <span className="mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
