"use client";

import React, { useContext } from 'react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import HomeTab from '@/components/tabs/HomeTab';
import CategoriesTab from '@/components/tabs/CategoriesTab';
import OrdersTab from '@/components/tabs/OrdersTab';
import ProfileTab from '@/components/tabs/ProfileTab';
// ProductModal больше не нужен здесь
// SearchOverlay будет рендериться в layout.tsx
// SearchResultsContainer больше не нужен здесь
import { AppStateContext } from '@/context/AppStateProvider'; // To be created
import { itemsData } from '@/data/items'; // Example data import
import { useRouter } from 'next/navigation'; // Импортируем useRouter

export default function HomePage() {
  const router = useRouter(); // Инициализируем useRouter
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

  const performLocalSearch = (query: string) => {
    if (!query.trim()) return [];
    const lowerCaseQuery = query.toLowerCase();
    return itemsData.filter(item => 
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item.category.toLowerCase().includes(lowerCaseQuery) ||
      item.provider.toLowerCase().includes(lowerCaseQuery) ||
      item.description.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      console.warn("Search query is empty");
      return;
    }
    setSearchQuery(query); // Обновляем глобальный searchQuery для Header и других компонентов

    const localResults = performLocalSearch(query);

    if (localResults.length > 0) {
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
        return <HomeTab items={itemsData} onCategoryLinkClick={(categoryName) => router.push(`/category/${encodeURIComponent(categoryName)}`)} />;
      case 'categories':
        return <CategoriesTab />; // Больше не передаем onCategoryClick
      case 'orders':
        return <OrdersTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        // Ветка default должна также использовать router.push для категорий
        return <HomeTab items={itemsData} onCategoryLinkClick={(categoryName) => router.push(`/category/${encodeURIComponent(categoryName)}`)} />;
    }
  };

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
