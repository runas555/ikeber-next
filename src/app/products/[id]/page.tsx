"use client"; // Добавлена директива для клиентского компонента
import React, { useContext } from 'react'; // Добавлен useContext
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { itemsData, Item } from '@/data/items'; // Предполагается, что данные и тип Item находятся в data/items.ts
import Header from '@/components/Header'; // Импорт Header
import NavigationBar from '@/components/NavigationBar'; // Импорт NavigationBar
import { AppStateContext } from '@/context/AppStateProvider'; // Импорт AppStateContext
import { useRouter } from 'next/navigation'; // Импорт useRouter

// Функция для получения данных о продукте по ID
// В реальном приложении здесь может быть запрос к API
const getProductById = (id: string): Item | undefined => {
  return itemsData.find((item: Item) => item.id === parseInt(id));
};

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const router = useRouter();
  const { setSearchQuery, openSearchOverlay, closeSearchOverlay, setSearchStatusText } = useContext(AppStateContext);
  const product = getProductById(params.id);

  const performLocalSearch = (query: string) => {
    if (!query.trim()) return [];
    const lowerCaseQuery = query.toLowerCase();
    return itemsData.filter(item => 
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item.category.toLowerCase().includes(lowerCaseQuery) ||
      item.provider.toLowerCase().includes(lowerCaseQuery) ||
      item.description.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const handleHeaderSearch = (query: string) => {
    if (!query.trim()) {
      console.warn("Search query is empty");
      return;
    }
    setSearchQuery(query); 

    const localResults = performLocalSearch(query);

    if (localResults.length > 0) {
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

  if (!product) {
    return (
      <>
        <Header onSearch={handleHeaderSearch} showBackButton={true} />
        <main className="container mx-auto p-4 pt-4 pb-20"> {/* Изменен pt-14 на pt-4 */}
          <p>Товар не найден</p>
        </main>
        <NavigationBar />
      </>
    );
  }

  return (
    <>
      <Header onSearch={handleHeaderSearch} showBackButton={true} />
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
        <p className="text-gray-500 text-sm mb-4 text-center">{product.provider}</p>
        <p className="text-blue-600 font-bold text-lg mb-4 text-center">{product.price}</p>
        <button className="w-full max-w-md mx-auto bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
          <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
          Добавить в корзину
        </button>
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
