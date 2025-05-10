"use client";
import React, { useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import ProductCard from '@/components/ProductCard';
import { itemsData } from '@/data/items'; // Удален Item
import { AppStateContext } from '@/context/AppStateProvider';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const categoryName = params.categoryName ? decodeURIComponent(params.categoryName as string) : null;

  const { setSearchQuery, openSearchOverlay, closeSearchOverlay, setSearchStatusText } = useContext(AppStateContext);

  const handleHeaderSearch = (query: string) => {
    if (!query) {
      console.warn("Search query is empty");
      return;
    }
    setSearchQuery(query);
    openSearchOverlay();
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
        router.push(`/search-request/${encodeURIComponent(query)}`);
      }
    }
    setSearchStatusText('Анализирую ваш запрос: "' + query + '"...');
    setTimeout(nextStep, 1000);
  };

  const categoryItems = categoryName ? itemsData.filter(item => item.category === categoryName) : [];

  return (
    <>
      <Header onSearch={handleHeaderSearch} showBackButton={true} />
      <main className="container mx-auto p-4 pt-24 pb-20">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {categoryName || 'Категория'}
        </h1>
        {categoryItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categoryItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">В этой категории пока нет товаров.</p>
        )}
      </main>
      <NavigationBar />
    </>
  );
};

export default CategoryPage;
