"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import ProductCard from '@/components/ProductCard';
import { createSupabaseClient } from '@/lib/supabase';
import { Item } from '@/types/item';
import { AppStateContext } from '@/context/AppStateProvider';

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchQuery = params.query ? decodeURIComponent(params.query as string) : "";
  const [results, setResults] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    setSearchQuery: setGlobalSearchQuery,
    openSearchOverlay, 
    closeSearchOverlay, 
    setSearchStatusText,
    setIsLoading: setGlobalLoading
  } = useContext(AppStateContext);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setGlobalLoading(true);
      setIsLoading(true);
      
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

        if (error) throw error;

        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
        setGlobalLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery, setGlobalLoading]);

  const handleHeaderSearch = async (newQuery: string) => {
    if (!newQuery.trim()) return;

    setGlobalSearchQuery(newQuery);
    setGlobalLoading(true);
    
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .or(`name.ilike.%${newQuery}%,category.ilike.%${newQuery}%,description.ilike.%${newQuery}%`);

      if (error) throw error;

      if (data?.length) {
        router.push(`/search/${encodeURIComponent(newQuery)}`);
      } else {
        openSearchOverlay();
        setSearchStatusText(`Поиск "${newQuery}"...`);
        setTimeout(() => {
          closeSearchOverlay();
          router.push(`/search-request/${encodeURIComponent(newQuery)}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header onSearch={handleHeaderSearch} showBackButton={true} />
        <main className="container mx-auto p-4 pt-4 pb-20">
          <p className="text-center py-10">Загрузка результатов...</p>
        </main>
        <NavigationBar />
      </>
    );
  }

  return (
    <>
      <Header onSearch={handleHeaderSearch} showBackButton={true} />
      <main className="container mx-auto p-4 pt-4 pb-20">
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
              Попробуйте изменить запрос или <Link href={`/search-request/${encodeURIComponent(searchQuery)}`} className="text-blue-600 hover:underline font-medium">оставить заявку на поиск</Link>.
            </p>
          </div>
        )}
      </main>
      <NavigationBar />
    </>
  );
};

export default SearchResultsPage;
