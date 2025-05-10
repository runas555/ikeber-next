"use client";
import React, { useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import ProductCard from '@/components/ProductCard';
import { itemsData, Item } from '@/data/items';
import { AppStateContext } from '@/context/AppStateProvider';

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchQuery = params.query ? decodeURIComponent(params.query as string) : "";

  const { 
    setSearchQuery: setGlobalSearchQuery, // setSearchQuery из контекста переименован во избежание конфликта
    openSearchOverlay, 
    closeSearchOverlay, 
    setSearchStatusText 
  } = useContext(AppStateContext);

  const performLocalSearch = (query: string): Item[] => {
    if (!query.trim()) return [];
    const lowerCaseQuery = query.toLowerCase();
    return itemsData.filter((item: Item) => 
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item.category.toLowerCase().includes(lowerCaseQuery) ||
      item.provider.toLowerCase().includes(lowerCaseQuery) ||
      item.description.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const handleHeaderSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      console.warn("Search query is empty");
      return;
    }
    setGlobalSearchQuery(newQuery); // Обновляем глобальный searchQuery в AppStateContext

    const localResults = performLocalSearch(newQuery);

    if (localResults.length > 0) {
      router.push(`/search/${encodeURIComponent(newQuery)}`);
    } else {
      openSearchOverlay(); 
      let step = 0;
      const searchSteps = [
          { text: "Проверяю наличие у ближайших продавцов...", delay: 1200 },
          { text: "Ищу похожие товары и услуги в вашем городе...", delay: 1500 },
          { text: "Подбираю лучшие варианты для вас...", delay: 1300 }
      ];
      const nextStep = () => {
          if (step < searchSteps.length) {
              setSearchStatusText(searchSteps[step].text);
              setTimeout(nextStep, searchSteps[step].delay);
              step++;
          } else {
              closeSearchOverlay();
              router.push(`/search-request/${encodeURIComponent(newQuery)}`);
          }
      };
      setSearchStatusText('Анализирую ваш запрос: "' + newQuery + '"...');
      setTimeout(nextStep, 1000);
    }
  };

  const results = performLocalSearch(searchQuery);

  return (
    <>
      <Header onSearch={handleHeaderSearch} showBackButton={true} />
      <main className="container mx-auto p-4 pt-4 pb-20"> {/* Изменен pt-14 на pt-4 */}
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Результаты поиска: <span className="text-blue-600">{searchQuery}</span>
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Найдено товаров/услуг: {results.length}
        </p>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">По вашему запросу ничего не найдено.</p>
            <p className="text-gray-600 mb-6">
              Вы можете попробовать изменить формулировку запроса или <Link href={`/search-request/${encodeURIComponent(searchQuery)}`} className="text-blue-600 hover:underline font-medium">оставить заявку на глобальный поиск</Link>, и наши специалисты помогут вам.
            </p>
          </div>
        )}
      </main>
      <NavigationBar />
    </>
  );
};

export default SearchResultsPage;
