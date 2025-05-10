"use client";
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { User } from '@/data/users'; // Импортируем User

// Define the shape of your context state
interface AppState {
  activeTab: string;
  isSearchOverlayOpen: boolean;
  searchStatusText: string;
  searchQuery: string;
  notificationsCount: number;
  favoritesCount: number;
  ordersBadgeCount: number;
  currentUser: User | null; // Добавляем текущего пользователя
}

// Define the shape of your context value (state + setters)
interface AppContextValue extends AppState {
  setActiveTab: Dispatch<SetStateAction<string>>;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSearchStatusText: Dispatch<SetStateAction<string>>;
  setCurrentUser: Dispatch<SetStateAction<User | null>>; // Сеттер для пользователя
  logout: () => void; // Функция для выхода
}

const defaultState: AppState = {
  activeTab: 'home',
  isSearchOverlayOpen: false,
  searchStatusText: 'Анализирую ваш запрос...',
  searchQuery: '',
  notificationsCount: 2,
  favoritesCount: 0,
  ordersBadgeCount: 0,
  currentUser: null, // Изначально пользователь не авторизован
};

export const AppStateContext = createContext<AppContextValue>(null!); // null! is okay if Provider always wraps

interface AppStateProviderProps {
  children: ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultState.activeTab);
  // isProductModalOpen and selectedProduct states are no longer needed
  // const [isCategoryViewOpen, setIsCategoryViewOpen] = useState<boolean>(defaultState.isCategoryViewOpen); // Больше не нужно
  // const [categoryForView, setCategoryForView] = useState<string | null>(defaultState.categoryForView); // Больше не нужно
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState<boolean>(defaultState.isSearchOverlayOpen);
  const [searchStatusText, setSearchStatusText] = useState<string>(defaultState.searchStatusText);
  // const [isSearchResultsOpen, setIsSearchResultsOpen] = useState<boolean>(defaultState.isSearchResultsOpen); // Больше не нужно
  const [searchQuery, setSearchQuery] = useState<string>(defaultState.searchQuery);
  const [currentUser, setCurrentUser] = useState<User | null>(defaultState.currentUser); // Состояние для пользователя

  // Example counts
  const [notificationsCount] = useState<number>(defaultState.notificationsCount);
  const [favoritesCount] = useState<number>(defaultState.favoritesCount);
  const [ordersBadgeCount] = useState<number>(defaultState.ordersBadgeCount);

  const logout = () => {
    setCurrentUser(null);
    // Можно добавить здесь дополнительную логику, например, очистку localStorage
  };

  // Scrollbar width effect
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Tab') { // Tab also closes modals as per original HTML
        // if (isProductModalOpen) closeProductModal(); // No longer needed
        // if (isCategoryViewOpen) closeCategoryItemsView(); // No longer needed
        // else if (isSearchResultsOpen) closeSearchResults(); // No longer needed
        // Search overlay might not need esc/tab close or handled differently
        // Если SearchOverlay должен закрываться по Esc/Tab, нужно добавить его состояние в зависимости и вызов closeSearchOverlay()
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []); // Зависимости теперь пустые, если SearchOverlay не управляется Esc/Tab

  const manageBodyScroll = (shouldLock: boolean) => {
    if (shouldLock) {
      document.body.classList.add('no-scroll');
    } else {
      // Only remove no-scroll if no other modal is active
      if (!isSearchOverlayOpen) { // Остался только SearchOverlay
         document.body.classList.remove('no-scroll');
      }
    }
  };
  
  // Update body scroll whenever a modal's state changes
  useEffect(() => {
    manageBodyScroll(isSearchOverlayOpen); // Остался только SearchOverlay
  }, [isSearchOverlayOpen]); // Остался только SearchOverlay


  // openProductModal and closeProductModal are no longer needed
  // openCategoryItemsView and closeCategoryItemsView are no longer needed

  const openSearchOverlay = () => setIsSearchOverlayOpen(true);
  const closeSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
    // setSearchQuery(''); // Можно очищать searchQuery здесь, если SearchOverlay его меняет и он больше не нужен
  }

  // openSearchResults and closeSearchResults are no longer needed

  const handleSetActiveTab: Dispatch<SetStateAction<string>> = (tabId) => {
    // Close all modals when switching tabs
    // closeProductModal(); // No longer needed
    // closeCategoryItemsView(); // No longer needed
    closeSearchOverlay(); // Also close search processing
    // closeSearchResults(); // No longer needed
    setActiveTab(tabId);
    // Scroll to top of new tab content
    // This is tricky from context, page.tsx might handle its own main scroll area
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
    currentUser, // Передаем пользователя в контекст
    setActiveTab: handleSetActiveTab,
    openSearchOverlay,
    closeSearchOverlay,
    setSearchQuery,
    setSearchStatusText,
    setCurrentUser, // Передаем сеттер
    logout, // Передаем функцию выхода
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export default AppStateProvider;
