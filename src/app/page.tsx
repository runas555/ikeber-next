"use client";

import React, { useContext, useState, useEffect } from 'react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import HomeTab from '@/components/tabs/HomeTab';
import CategoriesTab from '@/components/tabs/CategoriesTab';
import OrdersTab from '@/components/tabs/OrdersTab';
import ProfileTab from '@/components/tabs/ProfileTab';
// ProductModal больше не нужен здесь
// SearchOverlay будет рендериться в layout.tsx
// SearchResultsContainer больше не нужен здесь
import { AppStateContext } from '@/context/AppStateProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const {
    activeTab,
    // isProductModalOpen, selectedProduct, openProductModal, closeProductModal больше не нужны
    // isCategoryViewOpen, categoryForView, openCategoryItemsView, closeCategoryItemsView больше не нужны
    // isSearchOverlayOpen, // Больше не используется в этом файле
    // searchStatusText, // Больше не используется в этом файле
    setSearchQuery, 
    openSearchOverlay,
    closeSearchOverlay,
    setSearchStatusText,
  } = useContext(AppStateContext);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      console.warn("Search query is empty");
      return;
    }
    setSearchQuery(query);

    // Проверяем наличие товаров в Supabase
    const { data, error } = await supabase
      .from('items')
      .select()
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,provider.ilike.%${query}%`);

    if (error) {
      console.error('Search error:', error);
      return;
    }

    if (data && data.length > 0) {
      router.push(`/search/${encodeURIComponent(query)}`);
    } else {
      const searchSteps = [
        { text: "Проверяю наличие у ближайших продавцов...", delay: 1200 },
        { text: "Ищу похожие товары и услуги в вашем городе...", delay: 1500 },
        { text: "Подбираю лучшие варианты для вас...", delay: 1300 }
      ];
      let step = 0;

      const nextStep = () => { // Изменено на стрелочную функцию, объявленную до вызова
        if (step < searchSteps.length) {
          setSearchStatusText(searchSteps[step].text);
          setTimeout(nextStep, searchSteps[step].delay);
          step++;
        } else {
          closeSearchOverlay();
          router.push(`/search-request/${encodeURIComponent(query)}`);
        }
      };
      
      openSearchOverlay();
      setSearchStatusText('Анализирую ваш запрос: "' + query + '"...');
      setTimeout(nextStep, 1000);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        // onCategoryLinkClick для HomeTab теперь должен вести на страницу категории, если это необходимо,
        // либо эта логика должна быть пересмотрена. Пока что HomeTab не будет открывать категории.
        // Если нужно, чтобы "Быстрые категории" на HomeTab вели на страницы категорий,
        // HomeTab также нужно будет обновить для использования Link.
        // Для MVP я оставлю HomeTab без этой функциональности, чтобы сфокусироваться на CategoriesTab.
        // Если потребуется, можно будет добавить onCategoryLinkClick={(categoryName) => router.push(`/category/${encodeURIComponent(categoryName)}`)}
        return <HomeTab onCategoryLinkClick={(categoryName) => router.push(`/category/${encodeURIComponent(categoryName)}`)} />;
      case 'categories':
        return <CategoriesTab />; // Больше не передаем onCategoryClick
      case 'orders':
        return <OrdersTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        // Ветка default должна также использовать router.push для категорий
        return <HomeTab onCategoryLinkClick={(categoryName) => router.push(`/category/${encodeURIComponent(categoryName)}`)} />;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="flex-1 overflow-y-auto pb-20"> {/* pb-20 for nav bar */}
        {renderTabContent()}
      </main>
      <NavigationBar />

      {/* ProductModal и CategoryItemsView больше не отображаются здесь */}
      {/* SearchOverlay теперь будет рендериться в layout.tsx */}
      {/* SearchResultsContainer больше не отображается здесь */}
    </>
  );
}
