"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faThLarge, faListAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider';

const tabs = [
  { id: 'home', label: 'Главная', icon: faHome },
  { id: 'categories', label: 'Категории', icon: faThLarge },
  { id: 'cart', label: 'Корзина', icon: faListAlt },
  { id: 'profile', label: 'Профиль', icon: faUser },
];

const NavigationBar: React.FC = () => {
  const router = useRouter();
  const appState = useContext(AppStateContext);
  const [isSwitching, setIsSwitching] = useState(false);

  interface CartItem {
    id: string;
    quantity: number;
  }

  const { activeTab, setActiveTab, ordersBadgeCount, setOrdersBadgeCount } = appState || {
    activeTab: 'home',
    setActiveTab: () => {},
    ordersBadgeCount: 0,
    setOrdersBadgeCount: () => {}
  };

  useEffect(() => {
    if (!appState) return;

    const updateCartCount = () => {
      const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      setOrdersBadgeCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, [appState, setOrdersBadgeCount]);

  const handleTabClick = async (tabId: string) => {
    if (isSwitching || tabId === activeTab) return;
    
    setIsSwitching(true);
    
    try {
      const currentRegion = new URLSearchParams(window.location.search).get('region') || 'Буздяк';
      await router.push(`/?region=${currentRegion}`);
      
      requestAnimationFrame(() => {
        setActiveTab(tabId);
        setTimeout(() => setIsSwitching(false), 300);
      });
    } catch {
      setIsSwitching(false);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top z-40">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors duration-200 ease-in-out
                        ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}
                        ${isSwitching ? 'opacity-70 pointer-events-none' : ''}`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <div className="relative">
              <FontAwesomeIcon icon={tab.icon} className={`text-xl mb-0.5 tab-icon ${activeTab === tab.id ? 'scale-110' : ''}`} />
              {tab.id === 'cart' && typeof window !== 'undefined' && ordersBadgeCount > 0 && (
                <span 
                  suppressHydrationWarning
                  className="absolute top-[-3px] right-[-7px] bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                >
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
