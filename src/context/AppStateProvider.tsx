"use client";
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
// Item is no longer used here

// Define the shape of your context state
interface AppState {
  activeTab: string;
  // isProductModalOpen and selectedProduct are no longer needed
  isCategoryViewOpen: boolean;
  categoryForView: string | null;
  isSearchOverlayOpen: boolean;
  searchStatusText: string;
  // isSearchResultsOpen and searchQuery are no longer needed for SearchResultsContainer
  // searchQuery is still needed for SearchOverlay
  searchQuery: string; // Оставляем для SearchOverlay
  notificationsCount: number; // Example
  favoritesCount: number;    // Example
  ordersBadgeCount: number;  // Example
}

// Define the shape of your context value (state + setters)
interface AppContextValue extends AppState {
  setActiveTab: Dispatch<SetStateAction<string>>;
  // openProductModal and closeProductModal are no longer needed
  openCategoryItemsView: (categoryName: string) => void;
  closeCategoryItemsView: () => void;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  // openSearchResults and closeSearchResults are no longer needed
  setSearchQuery: Dispatch<SetStateAction<string>>; // Все еще используется для SearchOverlay
  setSearchStatusText: Dispatch<SetStateAction<string>>;
  // Add more setters or actions as needed
}

const defaultState: AppState = {
  activeTab: 'home',
  // isProductModalOpen and selectedProduct are no longer needed
  isCategoryViewOpen: false,
  categoryForView: null,
  isSearchOverlayOpen: false,
  searchStatusText: 'Анализирую ваш запрос...',
  // isSearchResultsOpen: false, // Больше не нужно
  searchQuery: '', // Все еще используется для SearchOverlay
  notificationsCount: 2, // Sample data
  favoritesCount: 0,   // Sample data
  ordersBadgeCount: 0,    // Sample data
};

export const AppStateContext = createContext<AppContextValue>(null!); // null! is okay if Provider always wraps

interface AppStateProviderProps {
  children: ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultState.activeTab);
  // isProductModalOpen and selectedProduct states are no longer needed
  const [isCategoryViewOpen, setIsCategoryViewOpen] = useState<boolean>(defaultState.isCategoryViewOpen);
  const [categoryForView, setCategoryForView] = useState<string | null>(defaultState.categoryForView);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState<boolean>(defaultState.isSearchOverlayOpen);
  const [searchStatusText, setSearchStatusText] = useState<string>(defaultState.searchStatusText);
  // const [isSearchResultsOpen, setIsSearchResultsOpen] = useState<boolean>(defaultState.isSearchResultsOpen); // Больше не нужно
  const [searchQuery, setSearchQuery] = useState<string>(defaultState.searchQuery); // Все еще используется для SearchOverlay
  
  // Example counts
  const [notificationsCount] = useState<number>(defaultState.notificationsCount);
  const [favoritesCount] = useState<number>(defaultState.favoritesCount);
  const [ordersBadgeCount] = useState<number>(defaultState.ordersBadgeCount);

  // Scrollbar width effect
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Tab') { // Tab also closes modals as per original HTML
        // if (isProductModalOpen) closeProductModal(); // No longer needed
        if (isCategoryViewOpen) closeCategoryItemsView();
        // else if (isSearchResultsOpen) closeSearchResults(); // No longer needed
        // Search overlay might not need esc/tab close or handled differently
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCategoryViewOpen]); // Removed isSearchResultsOpen from dependencies

  const manageBodyScroll = (shouldLock: boolean) => {
    if (shouldLock) {
      document.body.classList.add('no-scroll');
    } else {
      // Only remove no-scroll if no other modal is active
      if (!isCategoryViewOpen && !isSearchOverlayOpen) { // Removed isSearchResultsOpen
         document.body.classList.remove('no-scroll');
      }
    }
  };
  
  // Update body scroll whenever a modal's state changes
  useEffect(() => {
    manageBodyScroll(isCategoryViewOpen || isSearchOverlayOpen); // Removed isSearchResultsOpen
  }, [isCategoryViewOpen, isSearchOverlayOpen]); // Removed isSearchResultsOpen


  // openProductModal and closeProductModal are no longer needed

  const openCategoryItemsView = (categoryName: string) => {
    console.log('Opening category view for:', categoryName);
    setCategoryForView(categoryName);
    setIsCategoryViewOpen(true);
  };
  const closeCategoryItemsView = () => {
    setIsCategoryViewOpen(false);
    setCategoryForView(null);
  };

  const openSearchOverlay = () => setIsSearchOverlayOpen(true);
  const closeSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
    // setSearchQuery(''); // Можно очищать searchQuery здесь, если SearchOverlay его меняет и он больше не нужен
  }

  // openSearchResults and closeSearchResults are no longer needed

  const handleSetActiveTab: Dispatch<SetStateAction<string>> = (tabId) => {
    // Close all modals when switching tabs
    // closeProductModal(); // No longer needed
    closeCategoryItemsView();
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
    // isProductModalOpen and selectedProduct are no longer needed
    isCategoryViewOpen,
    categoryForView,
    isSearchOverlayOpen,
    searchStatusText,
    // isSearchResultsOpen is no longer needed
    searchQuery, // Still needed for SearchOverlay
    notificationsCount,
    favoritesCount,
    ordersBadgeCount,
    setActiveTab: handleSetActiveTab, // Use wrapped setter
    // openProductModal and closeProductModal are no longer needed
    openCategoryItemsView,
    closeCategoryItemsView,
    openSearchOverlay,
    closeSearchOverlay,
    // openSearchResults and closeSearchResults are no longer needed
    setSearchQuery, // Still needed for SearchOverlay
    setSearchStatusText,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export default AppStateProvider;
