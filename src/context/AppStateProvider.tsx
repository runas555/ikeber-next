"use client";
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { Item } from '@/data/items'; // Ensure Item type is defined

// Define the shape of your context state
interface AppState {
  activeTab: string;
  isProductModalOpen: boolean;
  selectedProduct: Item | null;
  isCategoryViewOpen: boolean;
  categoryForView: string | null;
  isSearchOverlayOpen: boolean;
  searchStatusText: string;
  isSearchResultsOpen: boolean;
  searchQuery: string;
  notificationsCount: number; // Example
  favoritesCount: number;    // Example
  ordersBadgeCount: number;  // Example
}

// Define the shape of your context value (state + setters)
interface AppContextValue extends AppState {
  setActiveTab: Dispatch<SetStateAction<string>>;
  openProductModal: (item: Item) => void;
  closeProductModal: () => void;
  openCategoryItemsView: (categoryName: string) => void;
  closeCategoryItemsView: () => void;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  openSearchResults: (query: string) => void;
  closeSearchResults: () => void;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSearchStatusText: Dispatch<SetStateAction<string>>;
  // Add more setters or actions as needed
}

const defaultState: AppState = {
  activeTab: 'home',
  isProductModalOpen: false,
  selectedProduct: null,
  isCategoryViewOpen: false,
  categoryForView: null,
  isSearchOverlayOpen: false,
  searchStatusText: 'Анализирую ваш запрос...',
  isSearchResultsOpen: false,
  searchQuery: '',
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
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(defaultState.isProductModalOpen);
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(defaultState.selectedProduct);
  const [isCategoryViewOpen, setIsCategoryViewOpen] = useState<boolean>(defaultState.isCategoryViewOpen);
  const [categoryForView, setCategoryForView] = useState<string | null>(defaultState.categoryForView);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState<boolean>(defaultState.isSearchOverlayOpen);
  const [searchStatusText, setSearchStatusText] = useState<string>(defaultState.searchStatusText);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState<boolean>(defaultState.isSearchResultsOpen);
  const [searchQuery, setSearchQuery] = useState<string>(defaultState.searchQuery);
  
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
        if (isProductModalOpen) closeProductModal();
        else if (isCategoryViewOpen) closeCategoryItemsView();
        else if (isSearchResultsOpen) closeSearchResults();
        // Search overlay might not need esc/tab close or handled differently
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isProductModalOpen, isCategoryViewOpen, isSearchResultsOpen]); // Re-add listener if dependencies change

  const manageBodyScroll = (shouldLock: boolean) => {
    if (shouldLock) {
      document.body.classList.add('no-scroll');
    } else {
      // Only remove no-scroll if no other modal is active
      if (!isProductModalOpen && !isCategoryViewOpen && !isSearchResultsOpen && !isSearchOverlayOpen) {
         document.body.classList.remove('no-scroll');
      }
    }
  };
  
  // Update body scroll whenever a modal's state changes
  useEffect(() => {
    manageBodyScroll(isProductModalOpen || isCategoryViewOpen || isSearchResultsOpen || isSearchOverlayOpen);
  }, [isProductModalOpen, isCategoryViewOpen, isSearchResultsOpen, isSearchOverlayOpen]);


  const openProductModal = (item: Item) => {
    // Close other modals if necessary
    if (isCategoryViewOpen) setIsCategoryViewOpen(false); // Example: Close category view if opening product from it
    setSelectedProduct(item);
    setIsProductModalOpen(true);
  };
  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

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
  const closeSearchOverlay = () => setIsSearchOverlayOpen(false);

  const openSearchResults = (query: string) => {
    setSearchQuery(query); // Ensure query is set for the results container
    setIsSearchResultsOpen(true);
    closeSearchOverlay(); // Close loading overlay when results are ready
  };
  const closeSearchResults = () => {
    setIsSearchResultsOpen(false);
    setSearchQuery(''); // Clear query on close
  };

  const handleSetActiveTab: Dispatch<SetStateAction<string>> = (tabId) => {
    // Close all modals when switching tabs
    closeProductModal();
    closeCategoryItemsView();
    closeSearchOverlay(); // Also close search processing
    closeSearchResults();
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
    isProductModalOpen,
    selectedProduct,
    isCategoryViewOpen,
    categoryForView,
    isSearchOverlayOpen,
    searchStatusText,
    isSearchResultsOpen,
    searchQuery,
    notificationsCount,
    favoritesCount,
    ordersBadgeCount,
    setActiveTab: handleSetActiveTab, // Use wrapped setter
    openProductModal,
    closeProductModal,
    openCategoryItemsView,
    closeCategoryItemsView,
    openSearchOverlay,
    closeSearchOverlay,
    openSearchResults,
    closeSearchResults,
    setSearchQuery,
    setSearchStatusText,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export default AppStateProvider;
