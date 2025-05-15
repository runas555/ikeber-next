"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { AppStateContext } from '@/context/AppStateProvider';
import { Item } from '@/types/item';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const categoryName = params.categoryName ? decodeURIComponent(params.categoryName as string) : null;
  const [categoryItems, setCategoryItems] = useState<Item[]>([]);

  const { setSearchQuery, openSearchOverlay, closeSearchOverlay, setSearchStatusText } = useContext(AppStateContext);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      if (!categoryName) return;
      
      const { data, error } = await supabase
        .from('items')
        .select()
        .eq('category', categoryName);

      if (error) {
        console.error('Error fetching category items:', error);
        return;
      }

      if (data) {
        setCategoryItems(data);
      }
    };

    fetchCategoryItems();
  }, [categoryName]);

  const handleHeaderSearch = async (query: string) => {
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

  return (
    <>
      <Header onSearch={handleHeaderSearch} showBackButton={true} />
      <main className="container mx-auto p-4 pt-4 pb-20"> {/* Изменен pt-14 на pt-4 */}
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
