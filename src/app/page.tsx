"use client";

import React, { useContext, useState, useEffect } from 'react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import HomeTab from '@/components/tabs/HomeTab';
import CategoriesTab from '@/components/tabs/CategoriesTab';
import CartTab from '@/components/tabs/CartTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import { AppStateContext } from '@/context/AppStateProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// import { Item } from '@/types/item'; // Удалено, так как типы приходят из контекста

export default function HomePage({ searchParams }: { searchParams: { region?: string } }) {
  const router = useRouter();
  const [currentRegion, setCurrentRegion] = useState(searchParams.region || 'Буздяк');
  // const [recommendedItems, setRecommendedItems] = useState<Item[]>([]); // Удалено, будет из контекста
  // const [promotionItems, setPromotionItems] = useState<Item[]>([]); // Удалено, будет из контекста
  // const [isLoading, setIsLoading] = useState(true); // Удалено, будет itemsLoading из контекста
  // const [page, setPage] = useState(1); // Удалено, будет itemsPage из контекста
  // const [hasMore, setHasMore] = useState(true); // Удалено, будет hasMoreItems из контекста
  const perPage = 4; // Количество товаров за одну загрузку

  useEffect(() => {
    if (searchParams.region) {
      setCurrentRegion(searchParams.region);
    }
  }, [searchParams.region]);

  const {
    activeTab,
    setSearchQuery,
    openSearchOverlay,
    closeSearchOverlay,
    setSearchStatusText,
    // Состояния и функции для товаров из контекста
    recommendedItems,
    promotionItems,
    itemsLoading,
    hasMoreItems,
    fetchInitialItems,
    loadMoreProviderItems,
    currentRegionForItems, // Для проверки, нужно ли перезагружать данные
  } = useContext(AppStateContext);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      console.warn("Search query is empty");
      return;
    }
    setSearchQuery(query);

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

      const nextStep = () => {
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
        return <HomeTab 
          region={currentRegion}
          recommendedItems={recommendedItems}
          promotionItems={promotionItems}
          isLoading={itemsLoading} // Используем itemsLoading из контекста
          onLoadMore={loadMoreItems}
          hasMore={hasMoreItems} // Используем hasMoreItems из контекста
        />;
      case 'categories':
        return <CategoriesTab region={currentRegion} />;
      case 'cart':
        return <CartTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab 
          region={currentRegion}
          recommendedItems={recommendedItems}
          promotionItems={promotionItems}
          isLoading={itemsLoading} // Используем itemsLoading из контекста
          onLoadMore={loadMoreItems}
          hasMore={hasMoreItems} // Используем hasMoreItems из контекста
        />;
    }
  };

  const loadMoreItems = async () => {
    // Вызываем функцию из контекста
    if (currentRegion) { // Убедимся, что регион определен
      await loadMoreProviderItems(currentRegion, perPage);
    }
  };

  useEffect(() => {
    // Вызываем функцию из контекста для начальной загрузки,
    // только если регион изменился или данные еще не загружены для текущего региона
    if (currentRegion && (currentRegionForItems !== currentRegion || recommendedItems.length === 0)) {
      fetchInitialItems(currentRegion, perPage);
    }
  }, [currentRegion, fetchInitialItems, currentRegionForItems, recommendedItems.length, perPage]);

  return (
    <>
      <Header onSearch={handleSearch} currentRegion={currentRegion} />
      <main className="flex-1 overflow-y-auto pb-20">
        {renderTabContent()}
      </main>
      <NavigationBar />
    </>
  );
}
