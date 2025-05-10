"use client";

import React, { useContext } from 'react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import HomeTab from '@/components/tabs/HomeTab';
import CategoriesTab from '@/components/tabs/CategoriesTab';
import OrdersTab from '@/components/tabs/OrdersTab';
import ProfileTab from '@/components/tabs/ProfileTab';
// ProductModal больше не нужен здесь
import SearchOverlay from '@/components/SearchOverlay';
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
    isSearchOverlayOpen,
    searchStatusText,
    setSearchQuery, 
    openSearchOverlay,
    closeSearchOverlay,
    // openSearchResults, closeSearchResults удалены
    setSearchStatusText,
  } = useContext(AppStateContext);

  const handleSearch = (query: string) => {
    if (!query) {
      // Add some visual feedback for empty search if desired
      console.warn("Search query is empty");
      return;
    }
    setSearchQuery(query);
    openSearchOverlay();
    // Simulate search steps (logic moved to AppStateProvider or a hook)
    let step = 0;
    const searchSteps = [
        { text: "Проверяю наличие у ближайших продавцов...", delay: 1200 },
        { text: "Ищу похожие товары и услуги в вашем городе...", delay: 1500 },
        { text: "Подбираю лучшие варианты для вас...", delay: 1300 }
    ];
    function nextStep() {
        if (step < searchSteps.length) {
            setSearchStatusText(searchSteps[step].text);
            setTimeout(nextStep, searchSteps[step].delay);
            step++;
        } else {
            closeSearchOverlay();
            // openSearchResults(query); // Больше не открываем модальное окно
            router.push(`/search-request/${encodeURIComponent(query)}`); // Переходим на новую страницу
        }
    }
    setSearchStatusText('Анализирую ваш запрос: "' + query + '"...');
    setTimeout(nextStep, 1000);
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

      {isSearchOverlayOpen && (
        <SearchOverlay isOpen={isSearchOverlayOpen} statusText={searchStatusText} />
      )}

      {/* SearchResultsContainer больше не отображается здесь */}
    </>
  );
}
