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

export default function HomePage({ searchParams }: { searchParams: { region?: string } }) {
  const router = useRouter();
  const [currentRegion, setCurrentRegion] = useState(searchParams.region || 'Буздяк');
  const [loading, setLoading] = useState(true);

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
      .eq('region', currentRegion)
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
          onCategoryLinkClick={(categoryName) => router.push(`/category/${encodeURIComponent(categoryName)}?region=${currentRegion}`)} 
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
          onCategoryLinkClick={(categoryName) => router.push(`/category/${encodeURIComponent(categoryName)}?region=${currentRegion}`)} 
        />;
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
      <Header onSearch={handleSearch} currentRegion={currentRegion} />
      <main className="flex-1 overflow-y-auto pb-20">
        {renderTabContent()}
      </main>
      <NavigationBar />
    </>
  );
}
