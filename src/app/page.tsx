"use client";

import React, { useContext, useState, useEffect } from 'react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import HomeTab from '@/components/tabs/HomeTab';
import CategoriesTab from '@/components/tabs/CategoriesTab';
import OrdersTab from '@/components/tabs/OrdersTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import { AppStateContext } from '@/context/AppStateProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types/item';

export default function HomePage({ searchParams }: { searchParams: { region?: string } }) {
  const router = useRouter();
  const [currentRegion, setCurrentRegion] = useState(searchParams.region || 'Буздяк');
  const [recommendedItems, setRecommendedItems] = useState<Item[]>([]);
  const [promotionItems, setPromotionItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          isLoading={isLoading}
        />;
      case 'categories':
        return <CategoriesTab region={currentRegion} />;
      case 'orders':
        return <OrdersTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab 
          region={currentRegion}
          recommendedItems={recommendedItems}
          promotionItems={promotionItems}
          isLoading={isLoading}
        />;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Загружаем рекомендуемые товары
        const { data: recommendedData } = await supabase
          .from('items')
          .select()
          .eq('region', currentRegion)
          .limit(4);
        
        // Загружаем товары по акции
        const { data: promotionData } = await supabase
          .from('items')
          .select()
          .eq('is_promotion', true)
          .eq('region', currentRegion);

        if (recommendedData) setRecommendedItems(recommendedData);
        if (promotionData) setPromotionItems(promotionData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [currentRegion]);

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
