"use client";

import React, { useContext } from 'react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import HomeTab from '@/components/tabs/HomeTab';
import CategoriesTab from '@/components/tabs/CategoriesTab';
import CategoryItemsView from '@/components/CategoryItemsView';
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
    isCategoryViewOpen,
    categoryForView,
    isSearchOverlayOpen,
    searchStatusText,
    // isSearchResultsOpen, searchQuery, openSearchResults, closeSearchResults больше не нужны для SearchResultsContainer
    // searchQuery и setSearchQuery все еще могут быть нужны для SearchOverlay
    // searchQuery, // Больше не используется в этом файле
    setSearchQuery, // Оставляем для SearchOverlay
    openCategoryItemsView,
    closeCategoryItemsView,
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
        return <HomeTab items={itemsData} onCategoryLinkClick={openCategoryItemsView} />; // Удален onProductClick
      case 'categories':
        return <CategoriesTab onCategoryClick={openCategoryItemsView} />;
      case 'orders':
        return <OrdersTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab items={itemsData} onCategoryLinkClick={openCategoryItemsView} />; // Удален onProductClick
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="flex-1 overflow-y-auto pb-20"> {/* pb-20 for nav bar */}
        {renderTabContent()}
      </main>
      <NavigationBar />

      {/* ProductModal больше не отображается здесь */}

      {isCategoryViewOpen && categoryForView && (
        console.log('Rendering CategoryItemsView with:', categoryForView, 
          'Items:', itemsData.filter(item => item.category === categoryForView)),
        <CategoryItemsView
          categoryName={categoryForView}
          items={itemsData.filter(item => item.category === categoryForView)}
          onClose={closeCategoryItemsView}
          // onProductClick={openProductModal} // Удален onProductClick
        />
      )}

      {isSearchOverlayOpen && (
        <SearchOverlay isOpen={isSearchOverlayOpen} statusText={searchStatusText} />
      )}

      {/* SearchResultsContainer больше не отображается здесь */}
    </>
  );
}
