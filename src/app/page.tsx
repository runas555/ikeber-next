"use client";

import React, { useContext } from 'react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import HomeTab from '@/components/tabs/HomeTab';
import CategoriesTab from '@/components/tabs/CategoriesTab';
import CategoryItemsView from '@/components/CategoryItemsView';
import OrdersTab from '@/components/tabs/OrdersTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import ProductModal from '@/components/ProductModal';
import SearchOverlay from '@/components/SearchOverlay';
import SearchResultsContainer from '@/components/SearchResultsContainer';
import { AppStateContext } from '@/context/AppStateProvider'; // To be created
// import { itemsData } from '@/data/items'; // Удаляем старый импорт

// Определим тип Item здесь, так как он больше не импортируется из items.js
// В идеале, этот тип должен совпадать со структурой данных из БД
// и может быть вынесен в отдельный файл types.ts
export interface Item {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  provider: string;
  description: string;
}

export default function HomePage() {
  const [products, setProducts] = React.useState<Item[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error fetching products:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const {
    activeTab,
    isProductModalOpen,
    selectedProduct,
    isCategoryViewOpen,
    categoryForView,
    isSearchOverlayOpen,
    searchStatusText,
    isSearchResultsOpen,
    searchQuery,
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
            openSearchResults(query); // Pass query to results
        }
    }
    setSearchStatusText('Анализирую ваш запрос: "' + query + '"...');
    setTimeout(nextStep, 1000);
  };


  const renderTabContent = () => {
    if (isLoading) {
      return <div className="p-4 text-center">Загрузка товаров...</div>;
    }
    if (error) {
      return <div className="p-4 text-center text-red-500">Ошибка загрузки товаров: {error}</div>;
    }

    switch (activeTab) {
      case 'home':
        return <HomeTab items={products} onProductClick={openProductModal} onCategoryLinkClick={openCategoryItemsView} />;
      case 'categories':
        // CategoriesTab использует свой внутренний список категорий
        return <CategoriesTab onCategoryClick={openCategoryItemsView} />;
      case 'orders':
        return <OrdersTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab items={products} onProductClick={openProductModal} onCategoryLinkClick={openCategoryItemsView} />;
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="flex-1 overflow-y-auto pb-20"> {/* pb-20 for nav bar */}
        {renderTabContent()}
      </main>
      <NavigationBar />

      {isProductModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={closeProductModal}
        />
      )}

      {isCategoryViewOpen && categoryForView && (
        // console.log('Rendering CategoryItemsView with:', categoryForView,
        //   'Items:', products.filter(item => item.category === categoryForView)),
        <CategoryItemsView
          categoryName={categoryForView}
          items={products.filter(item => item.category === categoryForView)}
          onClose={closeCategoryItemsView}
          onProductClick={openProductModal}
        />
      )}

      {isSearchOverlayOpen && (
        <SearchOverlay isOpen={isSearchOverlayOpen} statusText={searchStatusText} />
      )}

      {isSearchResultsOpen && (
        <SearchResultsContainer
          isOpen={isSearchResultsOpen}
          onClose={closeSearchResults}
          query={searchQuery}
        />
      )}
    </>
  );
}
