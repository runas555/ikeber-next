"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Or use AppStateContext to switch tabs/views
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import CategoriesNavigation from '@/components/CategoriesNavigation';
import { Item } from '@/types/item';
import ProductCard from '@/components/ProductCard'; // Reusable ProductCard

interface HomeTabProps {
  region: string;
  recommendedItems: Item[];
  promotionItems: Item[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}


// const promotions = [
//   { id: 'promo1', title: "Обед со скидкой", provider: 'Кафе "Вкусняшка"', image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60", discount: "20%", expiry: "до 31 мая" },
//   { id: 'promo2', title: "Гаджет недели", provider: 'Магазин "ТехноМир"', image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60", discount: "15%", expiry: "до 25 мая" },
// ];


const HomeTab: React.FC<HomeTabProps> = ({ 
  region,
  recommendedItems,
  promotionItems,
  isLoading,
  onLoadMore,
  hasMore
}) => {
  const loading = isLoading; // Используем переданное состояние загрузки
  const router = useRouter();
  const loaderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div id="home-tab" className="tab-content active"> {/* 'active' class can be removed if parent controls visibility */}
      {/* Промо-баннер */}
      <div className="m-4 rounded-lg overflow-hidden gradient-banner text-white p-5">
        <h2 className="text-lg font-semibold">Доставка по городу - Быстро и Выгодно!</h2>
        <p className="text-sm mt-1 opacity-90">Выберите удобный тариф при оформлении заказа.</p>
        {/* This link should ideally use context/router to switch tab and scroll */}
        <a href="#delivery-info" onClick={(e) => { e.preventDefault(); /* switchTab('profile'); setTimeout(() => document.getElementById('delivery-info')?.scrollIntoView(), 100); */ console.log("Navigate to delivery info in profile tab");}}
           className="mt-3 inline-block bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-50 transition">
          Тарифы доставки
        </a>
      </div>

      {/* Быстрые категории */}
      <div className="pt-2">
        <h3 className="text-base font-semibold mb-1 px-4 text-gray-700">Что ищем сегодня?</h3>
        <CategoriesNavigation 
          onSelect={(categoryId) => router.push(`/category/${categoryId}?region=${region}`)}
        />
      </div>

      {/* Акции и скидки */}
      <div className="px-4 py-4 bg-amber-50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-amber-700">Акции и скидки <FontAwesomeIcon icon={faTags} className="ml-1 text-amber-600" /></h2>
          <button className="text-amber-600 text-sm font-medium hover:text-amber-700">Все акции →</button>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-2"> {/* Changed to flex container for horizontal scroll */}
          {loading ? (
            <div className="w-full flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : promotionItems.length > 0 ? (
            promotionItems.map(promo => (
            // Added width for two items visible by default, and flex-none to prevent shrinking
              <div key={promo.id} className="bg-white rounded-lg overflow-hidden border border-amber-300 relative cursor-pointer w-[calc(50%-0.375rem)] flex-none" onClick={() => router.push(`/products/${promo.id}`)}>
              <Image src={promo.image} alt={promo.name} width={200} height={112} className="w-full h-28 object-cover" />
              {promo.discount && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-md font-semibold absolute top-2 left-2">-{promo.discount}</span>}
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 truncate mt-1">{promo.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{promo.provider}</p>
                {promo.expiry && <p className="text-xs text-red-600 font-medium mt-1">{promo.expiry}</p>}
              </div>
            </div>
            ))
          ) : (
            <div className="w-full text-center text-gray-500 py-4">
              Нет акционных товаров
            </div>
          )}
        </div>
      </div>

      {/* Рекомендуемые товары и услуги */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Рекомендуем вам</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Все →</button>
        </div>
        <div className="grid grid-cols-2 gap-3" style={{ perspective: '1000px' }}>
          {loading && recommendedItems.length === 0 ? (
            <div className="col-span-2 flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recommendedItems.length > 0 ? (
            <>
              {recommendedItems.map((item: Item) => (
                <ProductCard key={item.id} item={item} />
              ))}
              {hasMore && (
                <div className="col-span-2 flex justify-center py-4" ref={loaderRef}>
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  ) : (
                    <button 
                      onClick={onLoadMore}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      Загрузить еще
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="col-span-2 text-center text-gray-500 py-4">
              Нет рекомендуемых товаров
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default HomeTab;
