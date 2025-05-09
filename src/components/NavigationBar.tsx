"use client";
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faThLarge, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider';
import clsx from 'clsx';

const navItems = [
  { id: 'home', label: 'Главная', icon: faHome },
  { id: 'categories', label: 'Категории', icon: faThLarge },
  { id: 'orders', label: 'Заказы', icon: faReceipt /* badgeCount: 1 */ }, // Example badge
  { id: 'profile', label: 'Профиль', icon: faUserCircle },
];

const NavigationBar: React.FC = () => {
  const { activeTab, setActiveTab, ordersBadgeCount } = useContext(AppStateContext);

  const handleTabChange = (tabId: string) => {
    // Logic to close any open modals/views before switching tabs
    // This should ideally be centralized in AppStateProvider or a custom hook
    // For now, just switch tab
    setActiveTab(tabId);
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full py-1.5 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={clsx(
              'tab-button flex-1 flex flex-col items-center px-3 py-1 transition-colors duration-200',
              activeTab === item.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
            )}
            onClick={() => handleTabChange(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} className="tab-icon text-xl" />
            {item.id === 'orders' && ordersBadgeCount > 0 && (
                 <span className="badge bg-orange-500 text-white rounded-full flex items-center justify-center" style={{top: '-4px', right: 'calc(50% - 22px)'}}>
                    {ordersBadgeCount}
                 </span>
            )}
            <span className={clsx("text-xs mt-0.5", activeTab === item.id && "font-medium")}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
