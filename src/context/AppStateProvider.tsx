"use client";
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { User } from '@/data/users';
import FullPageLoader from '@/components/FullPageLoader';

interface AppState {
  activeTab: string;
  isSearchOverlayOpen: boolean;
  searchStatusText: string;
  searchQuery: string;
  notificationsCount: number;
  favoritesCount: number;
  ordersBadgeCount: number;
  currentUser: User | null;
  isLoading: boolean;
}

interface AppContextValue extends AppState {
  setActiveTab: Dispatch<SetStateAction<string>>;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSearchStatusText: Dispatch<SetStateAction<string>>;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setOrdersBadgeCount: Dispatch<SetStateAction<number>>;
  logout: () => void;
}

const defaultState: AppState = {
  activeTab: 'home',
  isSearchOverlayOpen: false,
  searchStatusText: 'Анализирую ваш запрос...',
  searchQuery: '',
  notificationsCount: 2,
  favoritesCount: 0,
  ordersBadgeCount: 0,
  currentUser: null,
  isLoading: false,
};

export const AppStateContext = createContext<AppContextValue>(null!);

interface AppStateProviderProps {
  children: ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultState.activeTab);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState<boolean>(defaultState.isSearchOverlayOpen);
  const [searchStatusText, setSearchStatusText] = useState<string>(defaultState.searchStatusText);
  const [searchQuery, setSearchQuery] = useState<string>(defaultState.searchQuery);
  const [currentUser, setCurrentUser] = useState<User | null>(defaultState.currentUser);
  const [isLoading, setIsLoading] = useState<boolean>(defaultState.isLoading);

  const [notificationsCount] = useState<number>(defaultState.notificationsCount);
  const [favoritesCount] = useState<number>(defaultState.favoritesCount);
  interface CartItem {
    id: string;
    quantity: number;
  }

  const [ordersBadgeCount, setOrdersBadgeCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    }
    return defaultState.ordersBadgeCount;
  });

  const logout = () => {
    setCurrentUser(null);
  };

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Tab') {
        closeSearchOverlay();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const manageBodyScroll = (shouldLock: boolean) => {
    if (shouldLock) {
      document.body.classList.add('no-scroll');
    } else {
      if (!isSearchOverlayOpen) {
         document.body.classList.remove('no-scroll');
      }
    }
  };
  
  useEffect(() => {
    manageBodyScroll(isSearchOverlayOpen);
  }, [isSearchOverlayOpen]);

  const openSearchOverlay = () => setIsSearchOverlayOpen(true);
  const closeSearchOverlay = () => setIsSearchOverlayOpen(false);

  const handleSetActiveTab: Dispatch<SetStateAction<string>> = (tabId) => {
    closeSearchOverlay();
    setActiveTab(tabId);
    requestAnimationFrame(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) mainElement.scrollTop = 0;
    });
  };

  const value: AppContextValue = {
    activeTab,
    isSearchOverlayOpen,
    searchStatusText,
    searchQuery,
    notificationsCount,
    favoritesCount,
    ordersBadgeCount,
    setOrdersBadgeCount,
    currentUser,
    isLoading,
    setActiveTab: handleSetActiveTab,
    openSearchOverlay,
    closeSearchOverlay,
    setSearchQuery,
    setSearchStatusText,
    setCurrentUser,
    setIsLoading,
    logout,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
      {isLoading && <FullPageLoader />}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
