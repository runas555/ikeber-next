"use client"; // Добавлена директива для клиентского компонента
import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'; // Добавлена иконка faMoneyBillWave
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Импорт иконки WhatsApp
import { supabase } from '@/lib/supabase';
import { Item } from '@/types/item';
import Header from '@/components/Header'; // Импорт Header
import NavigationBar from '@/components/NavigationBar'; // Импорт NavigationBar
import { AppStateContext } from '@/context/AppStateProvider'; // Импорт AppStateContext
import { useRouter } from 'next/navigation'; // Импорт useRouter

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const router = useRouter();
  const { 
    setSearchQuery, 
    openSearchOverlay, 
    closeSearchOverlay, 
    setSearchStatusText,
    addToCart,
    cart
  } = useContext(AppStateContext);
  const [showCartHint, setShowCartHint] = useState(false);
  const [product, setProduct] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('items')
          .select()
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

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

  if (isLoading) {
    return (
      <>
        <Header onSearch={handleHeaderSearch} showBackButton={true} currentRegion={(product as Item)?.region || 'Буздяк'} />
        <main className="container mx-auto p-4 pt-4 pb-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        </main>
        <NavigationBar />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header onSearch={handleHeaderSearch} showBackButton={true} currentRegion={'Буздяк'} />
        <main className="container mx-auto p-4 pt-4 pb-20"> {/* Изменен pt-14 на pt-4 */}
          <p>Товар не найден</p>
        </main>
        <NavigationBar />
      </>
    );
  }

  return (
    <>
      <Header onSearch={handleHeaderSearch} showBackButton={true} currentRegion={product.region || 'Буздяк'} />
      <main className="container mx-auto p-4 pt-4 pb-20"> {/* Изменен pt-14 на pt-4 */}
        <div className="scrollbar-hide"> {/* Удален класс modal-content, его отступы больше не нужны */}
          <Image
            src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="modal-image mx-auto" // Центрируем изображение
          priority
        />
        <h2 className="text-2xl font-bold mb-2 mt-4 text-center">{product.name}</h2>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-4 h-4 mr-1"> {/* Контейнер для аватарки */}
            <Image
              src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Временная аватарка с Unsplash
              alt="Provider Avatar"
              fill
              sizes="16px"
              style={{ objectFit: 'cover', borderRadius: '50%' }}
              className="rounded-full"
            />
          </div>
          <p className="text-gray-500 text-sm text-center mr-2">{product.provider}</p> {/* Добавлен mr-2 для отступа */}
          {/* Иконка WhatsApp рядом с провайдером */}
          <button
            className="text-green-500 hover:text-green-600 transition-colors"
            onClick={() => {
              const phoneNumber = "79177762863";
              const message = encodeURIComponent(`Я хочу "${product?.name}"`);
              window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
            }}
            title="Написать в WhatsApp"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-green-600 font-bold text-lg">
            {product.is_service ? `от ${product.price} ₽` : `${product.price} ₽`}
          </p>
          {product.discount && (
            <>
              <p className="text-gray-500 line-through text-sm ml-2"> 
                {(() => {
                  try {
                    const priceNum = typeof product.price === 'string' 
                      ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
                      : Number(product.price);
                    const discountNum = product.discount 
                      ? typeof product.discount === 'string'
                        ? parseFloat(product.discount.replace(/[^\d.]/g, ''))
                        : Number(product.discount)
                      : 0;

                    if (!isNaN(discountNum) && !isNaN(priceNum) && 
                        discountNum > 0 && discountNum < 100 && priceNum > 0) {
                      const oldPrice = priceNum / (1 - discountNum / 100);
                      return `${Math.round(oldPrice)}`;
                    }
                  } catch (e) {
                    console.error('Error calculating old price:', e);
                  }
                  return '';
                })()}
              </p>
              <p className="text-red-500 bg-red-100 px-2 rounded text-sm">
                -{typeof product.discount === 'string' ? product.discount : `${product.discount}%`}
              </p>
            </>
          )}
          {/* Кнопка "Оплата при получении" */}
          <button
            className="ml-2 flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
            title="Оплата при получении"
          >
            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1 h-3 w-3" />
            Оплата при получении
          </button>
        </div>
        <button 
          className="w-full max-w-md mx-auto bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          onClick={() => {
            addToCart({
              id: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
              quantity: 1
            });
            // Показываем подсказку если корзина была пуста
            if (cart.length === 0) {
              setShowCartHint(true);
              setTimeout(() => setShowCartHint(false), 3000);
            }
          }}
        >
          <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
          Добавить в корзину
        </button>
        
        {showCartHint && (
          <div className="fixed bottom-20 right-12 min-w-[200px] bg-white p-4 rounded-lg shadow-lg z-50 border border-gray-200 animate-bounce sm:right-4">
            <div className="flex flex-col items-center justify-center w-full text-center">
              <span className="mb-1">Товар добавлен в корзину!</span>
              <div className="flex flex-col items-center">
                <span className="mb-1">Смотрите в корзине</span>
                <svg 
                  className="w-6 h-6 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
        {/* Кнопка WhatsApp удалена отсюда, т.к. перемещена к провайдеру */}
        {/* <p className="text-sm text-gray-600 mt-2 text-center max-w-md mx-auto">Оплата при получении</p> Удалено, т.к. перемещено к цене */}
        <div className="mt-6 max-w-md mx-auto">
          <h3 className="font-semibold mb-2 text-xl">Описание</h3>
          <div className="pr-2">
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
          </div>
        </div>
      </main>
      <NavigationBar />
    </>
  );
};

export default ProductPage;
