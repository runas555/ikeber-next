"use client";
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { User } from '@/data/users';
import FullPageLoader from '@/components/FullPageLoader';
import { Item } from '@/types/item'; // Импорт Item
import { supabase } from '@/lib/supabase'; // Импорт supabase

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
  // Состояния для товаров
  recommendedItems: Item[];
  promotionItems: Item[];
  itemsLoading: boolean;
  itemsPage: number;
  hasMoreItems: boolean;
  currentRegionForItems: string | null;
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: string | number;
  quantity: number;
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
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  // Функции для управления товарами
  fetchInitialItems: (region: string, perPage: number) => Promise<void>;
  loadMoreProviderItems: (region: string, perPage: number) => Promise<void>;
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
  // Начальные значения для состояний товаров
  recommendedItems: [],
  promotionItems: [],
  itemsLoading: true,
  itemsPage: 1,
  hasMoreItems: true,
  currentRegionForItems: null,
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
  const [isLoading, setIsLoading] = useState<boolean>(defaultState.isLoading); // Общий isLoading

  // Состояния для товаров
  const [recommendedItems, setRecommendedItems] = useState<Item[]>(defaultState.recommendedItems);
  const [promotionItems, setPromotionItems] = useState<Item[]>(defaultState.promotionItems);
  const [itemsLoading, setItemsLoading] = useState<boolean>(defaultState.itemsLoading); // isLoading для товаров
  const [itemsPage, setItemsPage] = useState<number>(defaultState.itemsPage);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(defaultState.hasMoreItems);
  const [currentRegionForItems, setCurrentRegionForItems] = useState<string | null>(defaultState.currentRegionForItems);


  const [notificationsCount] = useState<number>(defaultState.notificationsCount);
  const [favoritesCount] = useState<number>(defaultState.favoritesCount);
  // interface CartItem { // Уже определен выше
  //   id: string;
  //   name: string;
  //   image: string;
  //   price: string | number;
  //   quantity: number;
  // }

  const [cart, setCart] = useState<CartItem[]>([]);
  const [ordersBadgeCount, setOrdersBadgeCount] = useState<number>(defaultState.ordersBadgeCount);

  const addToCart = (product: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const newCart = existingItem 
        ? prevCart.map(item => 
            item.id === product.id 
              ? {...item, quantity: item.quantity + 1} 
              : item
          )
        : [...prevCart, product];
      
      setOrdersBadgeCount(newCart.reduce((sum, item) => sum + item.quantity, 0));
      return newCart;
    });
  };

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

  const fetchInitialItems = async (region: string, perPage: number) => {
    if (currentRegionForItems === region && recommendedItems.length > 0 && promotionItems.length > 0) {
      // Данные для этого региона уже загружены
      setItemsLoading(false);
      return;
    }
    setItemsLoading(true);
    setCurrentRegionForItems(region); // Устанавливаем текущий регион для загруженных товаров
    try {
      setItemsPage(1);
      setHasMoreItems(true);

      const { data: recommendedData, error: recError } = await supabase
        .from('items')
        .select()
        .eq('region', region)
        .range(0, perPage - 1);

      if (recError) throw recError;

      const { data: promotionData, error: promoError } = await supabase
        .from('items')
        .select()
        .eq('is_promotion', true)
        .eq('region', region);
      
      if (promoError) throw promoError;

      if (recommendedData) {
        setRecommendedItems(recommendedData);
        setHasMoreItems(recommendedData.length >= perPage);
      } else {
        setRecommendedItems([]);
        setHasMoreItems(false);
      }
      if (promotionData) {
        setPromotionItems(promotionData);
      } else {
        setPromotionItems([]);
      }
    } catch (error) {
      console.error('Error fetching initial items in provider:', error);
      setRecommendedItems([]);
      setPromotionItems([]);
      setHasMoreItems(false);
    } finally {
      setItemsLoading(false);
    }
  };

  const loadMoreProviderItems = async (region: string, perPage: number) => {
    if (!hasMoreItems || itemsLoading) return;

    setItemsLoading(true);
    try {
      const nextPage = itemsPage + 1;
      const { data: newItems, error } = await supabase
        .from('items')
        .select()
        .eq('region', region) // Убедимся, что грузим для правильного региона
        .range((nextPage - 1) * perPage, nextPage * perPage - 1);

      if (error) throw error;

      if (newItems && newItems.length > 0) {
        setRecommendedItems(prev => [...prev, ...newItems]);
        setItemsPage(nextPage);
        setHasMoreItems(newItems.length >= perPage);
      } else {
        setHasMoreItems(false);
      }
    } catch (error) {
      console.error('Error loading more items in provider:', error);
    } finally {
      setItemsLoading(false);
    }
  };


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
    cart,
    addToCart,
    setCart,
    currentUser,
    isLoading, // Общий isLoading
    // Передаем состояния и функции товаров
    recommendedItems,
    promotionItems,
    itemsLoading, // isLoading для товаров
    itemsPage,
    hasMoreItems,
    fetchInitialItems,
    loadMoreProviderItems,
    currentRegionForItems, // Передаем, чтобы page.tsx мог проверить
    setActiveTab: handleSetActiveTab,
    openSearchOverlay,
    closeSearchOverlay,
    setSearchQuery,
    setSearchStatusText,
    setCurrentUser,
    setIsLoading, // Общий setIsLoading
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
