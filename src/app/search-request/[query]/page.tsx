"use client";
import React, { useState, useContext } from 'react'; // Добавлен useContext
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faConciergeBell, faClipboardList, faPaperPlane, faUserClock, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'; // Для закрытия страницы (возврата назад)
import Header from '@/components/Header'; // Импорт Header
import NavigationBar from '@/components/NavigationBar'; // Импорт NavigationBar
import { AppStateContext } from '@/context/AppStateProvider'; // Импорт AppStateContext

interface SearchRequestPageProps {
  params: {
    query: string;
  };
}

const SearchRequestPage: React.FC<SearchRequestPageProps> = ({ params }) => {
  const router = useRouter();
  const { setSearchQuery, openSearchOverlay, closeSearchOverlay, setSearchStatusText } = useContext(AppStateContext);
  const query = decodeURIComponent(params.query); // Декодируем query из URL
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', details: '' });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentFormData = new FormData(event.currentTarget);
    const data = {
      item: query,
      name: currentFormData.get('name') as string,
      contact: currentFormData.get('contact') as string,
      details: currentFormData.get('details') as string,
    };
    console.log("Форма заявки отправлена:", data);
    setFormData({ name: data.name, contact: data.contact, details: data.details });
    setFormSubmitted(true);
    // Здесь, вы бы обычно отправили 'data' на ваш бэкенд
  };

  const handleHeaderSearch = (newQuery: string) => {
    if (!newQuery) {
      console.warn("Search query is empty");
      return;
    }
    setSearchQuery(newQuery); // Обновляем searchQuery в контексте
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
            // Если поиск со страницы заявки, то переходим на новую страницу заявки
            router.push(`/search-request/${encodeURIComponent(newQuery)}`);
        }
    }
    setSearchStatusText('Анализирую ваш запрос: "' + newQuery + '"...');
    setTimeout(nextStep, 1000);
  };

  const handleClosePage = () => { // Переименовано для ясности, что это закрытие страницы
    router.back(); // Возвращаемся на предыдущую страницу
  };

  return (
    <>
      <Header onSearch={handleHeaderSearch} showBackButton={true} />
      <main className="container mx-auto p-4 pt-14 pb-20"> {/* Отступ изменен на pt-14 */}
        <div className="max-w-lg mx-auto bg-white min-h-screen flex flex-col">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {formSubmitted ? "Специалист уже в деле!" : "Нужна помощь в поиске?"}
              </h2>
            </div>
            <div className="space-y-4">
              {!formSubmitted ? (
                <div className="text-center py-5 px-4">
                <FontAwesomeIcon icon={faUserTie} className="text-5xl text-blue-500 mb-4" />
                <p className="text-lg text-gray-700 mb-2">
                  {`Автоматический поиск по запросу `}<strong className="text-blue-600">{`"${query}"`}</strong>{` не дал мгновенных результатов.`}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Но не отчаивайтесь! Попробуйте наш <strong className="text-green-600">бесплатный сервис персонального подбора</strong> — это займет всего минуту.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left mb-6 shadow-sm">
                  <h3 className="text-md font-semibold text-blue-700 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faConciergeBell} className="mr-2" />Как это работает?
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Наш специалист вручную изучит ваш запрос. Он проанализирует актуальные предложения от мастеров и магазинов в вашем городе, тщательно сравнит варианты по цене и качеству, а также ознакомится с отзывами. Мы стремимся найти наилучшее решение именно для вас.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left shadow-sm">
                  <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />Доверьте поиск профессионалу!
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="request_item" className="block text-xs font-medium text-gray-600 mb-1">Что вы ищете? (ваш запрос)</label>
                      <input type="text" id="request_item" name="item" defaultValue={query} className="w-full py-2 px-3 bg-gray-100 rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500" readOnly />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="request_name" className="block text-xs font-medium text-gray-600 mb-1">Ваше имя</label>
                      <input type="text" id="request_name" name="name" placeholder="Например, Иван" className="w-full py-2 px-3 bg-white rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="request_contact" className="block text-xs font-medium text-gray-600 mb-1">Как с вами связаться? (Телефон или Email)</label>
                      <input type="text" id="request_contact" name="contact" placeholder="+7 900 123-45-67 или example@mail.com" className="w-full py-2 px-3 bg-white rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="request_details" className="block text-xs font-medium text-gray-600 mb-1">Дополнительные детали (цвет, размер, бренд и т.п.)</label>
                      <textarea id="request_details" name="details" rows={2} placeholder="Любые уточнения, которые помогут специалисту в поиске..." className="w-full py-2 px-3 bg-white rounded-md border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors">
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />Оставить заявку специалисту
                    </button>
                  </form>
                </div>
                <p className="text-xs text-gray-500 mt-4">Это абсолютно бесплатно и ни к чему вас не обязывает. Мы просто хотим помочь!</p>
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <FontAwesomeIcon icon={faUserClock} className="text-5xl text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {`Спасибо, ${formData.name ? formData.name : 'ваша заявка'} передана специалисту!`}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {`Наш эксперт получил ваш запрос на `}<strong className="text-blue-600">{`"${query}"`}</strong>{` и в ближайшее время приступит к индивидуальному подбору.`}
                </p>
                <p className="text-sm text-gray-600 mt-3 mb-6">
                  {`Мы свяжемся с вами по `}<strong className="text-blue-600">{formData.contact}</strong>{`, как только у специалиста будет информация.`}
                </p>
                <button onClick={handleClosePage} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg text-sm">
                  <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />Отлично, буду ждать!
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </main>
      <NavigationBar />
    </>
  );
};

export default SearchRequestPage;
