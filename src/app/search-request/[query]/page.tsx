"use client";
import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faThumbsUp, faShieldAlt, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import { AppStateContext } from '@/context/AppStateProvider';
import { itemsData, Item } from '@/data/items'; // Добавлен импорт itemsData и Item

interface SearchRequestPageProps {
  params: {
    query: string;
  };
}

const SearchRequestPage: React.FC<SearchRequestPageProps> = ({ params }) => {
  const router = useRouter();
  // openSearchOverlay, closeSearchOverlay, setSearchStatusText больше не нужны здесь
  const { setSearchQuery } = useContext(AppStateContext); 
  const currentGlobalQuery = decodeURIComponent(params.query); 
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(''); // Новое состояние для телефона

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      item: currentGlobalQuery, // Используем currentGlobalQuery
      phone: phoneNumber,
    };
    console.log("Форма заявки отправлена:", data);
    setFormSubmitted(true);
  };

  const performLocalSearch = (query: string): Item[] => { // Добавлен тип возвращаемого значения Item[]
    if (!query.trim()) return [];
    const lowerCaseQuery = query.toLowerCase();
    return itemsData.filter((item: Item) =>  // Добавлен тип item: Item
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
    setSearchQuery(newQuery); // Обновляем глобальный searchQuery

    const localResults = performLocalSearch(newQuery);

    if (localResults.length > 0) {
      router.push(`/search/${encodeURIComponent(newQuery)}`);
    } else {
      // Если мы уже на странице /search-request и локальных результатов нет,
      // просто обновляем страницу с новым запросом (без SearchOverlay)
      // или показываем SearchOverlay, если хотим сохранить консистентность.
      // Для MVP, чтобы избежать зацикливания SearchOverlay, просто перейдем.
      router.push(`/search-request/${encodeURIComponent(newQuery)}`);
      // Если нужно показать SearchOverlay и здесь:
      // openSearchOverlay();
      // ... (логика с searchSteps)
    }
  };

  const handleClosePage = () => {
    router.back(); // Возвращаемся на предыдущую страницу
  };

  return (
    <>
      <Header onSearch={handleHeaderSearch} showBackButton={true} />
      <main className="container mx-auto p-4 pt-4 pb-20"> {/* Изменен pt-14 на pt-4 */}
        <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
          {!formSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Не нашли то, что искали?</h1>
                <p className="text-lg text-gray-700">Доверьте поиск нам! Наши специалисты подберут лучшие варианты по вашему запросу.</p>
              </div>

              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-700 mb-3 text-center">Как это работает?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faClock} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Вы оставляете заявку – это займет не больше минуты.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Наш эксперт анализирует ваш запрос и подбирает лучшие предложения от проверенных продавцов и мастеров.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faPaperPlane} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span>Мы связываемся с вами по указанному телефону, чтобы предложить найденные варианты.</span>
                  </li>
                </ul>
                <p className="text-center text-sm text-blue-600 mt-4 font-medium">Это абсолютно бесплатно и ни к чему вас не обязывает!</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                  <label htmlFor="request_item" className="block text-sm font-medium text-gray-700 mb-1">Ваш запрос (не редактируется)</label>
                  <input
                    type="text"
                    id="request_item"
                    name="item"
                    defaultValue={currentGlobalQuery} // Используем currentGlobalQuery
                    className="w-full py-2.5 px-4 bg-gray-100 rounded-lg border border-gray-300 text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="request_phone" className="block text-sm font-medium text-gray-700 mb-1">Ваш номер телефона для связи</label>
                  <input
                    type="tel"
                    id="request_phone"
                    name="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  Отправить заявку
                </button>
                <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-1.5 text-gray-400" />
                  Ваши данные в безопасности и будут использованы только для связи по вашему запросу.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-8"> {/* Этот div был незакрыт, но он закрывается ниже */}
              <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Отлично! Ваша заявка в работе.
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                {`Мы получили ваш запрос на `}<strong className="text-blue-600">{`"${currentGlobalQuery}"`}</strong>{` и уже начали поиск.`} {/* Используем currentGlobalQuery */}
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                {`Наш специалист свяжется с вами по номеру `}<strong className="text-blue-600">{phoneNumber}</strong>{` в ближайшее время, чтобы предложить лучшие варианты.`}
              </p>
              <button onClick={handleClosePage} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg text-base">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />Хорошо, буду ждать
              </button>
            </div>
          )}
        </div>
      </main>
      <NavigationBar />
    </>
  );
};

export default SearchRequestPage;
