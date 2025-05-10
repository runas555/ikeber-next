"use client";
import React, { useState, useContext, useEffect, useRef } from 'react'; // Добавлены useEffect, useRef
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faBell } from '@fortawesome/free-regular-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider';
import { useRouter } from 'next/navigation';
import { itemsData } from '@/data/items'; // Импортируем данные для подсказок

interface HeaderProps {
  onSearch: (query: string) => void;
  showBackButton?: boolean;
}

// Готовим данные для подсказок один раз
const allKeywords = Array.from(
  new Set(
    itemsData.flatMap(item => [
      item.name,
      item.category,
      item.provider,
      // Можно добавить слова из item.description, разбив их, но это усложнит и увеличит массив
      // item.description.split(/\s+/).filter(word => word.length > 3) // Пример
    ]).map(kw => kw.toLowerCase()) // Приводим к нижнему регистру для поиска без учета регистра
  )
);


const Header: React.FC<HeaderProps> = ({ onSearch, showBackButton = false }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null); // Для отслеживания кликов вне

  const appState = useContext(AppStateContext);
  const notificationsCount = appState ? appState.notificationsCount : 0;
  const favoritesCount = appState ? appState.favoritesCount : 0;

  useEffect(() => {
    // Обработчик клика вне области поиска для скрытия подсказок
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) { // Начинаем искать подсказки после 1 символа
      const filtered = allKeywords.filter(kw => kw.includes(query.toLowerCase()));
      // Ограничим количество подсказок для производительности и UI
      setSuggestions(filtered.slice(0, 7)); 
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion); // Сразу выполняем поиск
  };
  
  const handleSearchSubmit = () => {
    setShowSuggestions(false);
    onSearch(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchQuery.trim()) { // Выполняем поиск только если есть текст
        handleSearchSubmit();
      }
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <header className="bg-white py-3 px-4 sticky top-0 z-30 border-b border-gray-200">
      <div className="flex items-center justify-between space-x-2" ref={searchContainerRef}>
        {showBackButton ? (
          <button onClick={() => router.back()} className="text-gray-600 hover:text-blue-600 p-1">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
        ) : (
          <Image src="/ikeber.svg" alt="Local Hub Logo" width={28} height={28} className="text-blue-600" />
        )}

        <div className="relative flex-grow mx-2">
          <input
            type="text"
            placeholder="Найти товар, услугу..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery.length > 1 && suggestions.length > 0 && setShowSuggestions(true)} // Показать при фокусе если есть что показывать
            // onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Задержка чтобы успел сработать onClick на подсказке
            onKeyPress={handleKeyPress}
            className="w-full py-2 px-3 pl-10 pr-10 bg-gray-100 rounded-lg border border-gray-200 focus:border-blue-400 search-input text-sm"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          {searchQuery.length > 0 && ( // Кнопка "отправить" внутри поля
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 p-1"
              aria-label="Искать"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
            </button>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-blue-600 relative p-1">
            <FontAwesomeIcon icon={faHeart} className="text-lg" /> {/* Уменьшен размер иконки */}
            {favoritesCount > 0 && (
              <span className="badge bg-red-500 text-white rounded-full flex items-center justify-center"> {/* Используем класс badge */}
                {favoritesCount}
              </span>
            )}
          </button>
          <button className="text-gray-500 hover:text-blue-600 relative p-1">
            <FontAwesomeIcon icon={faBell} className="text-lg" /> {/* Уменьшен размер иконки */}
            {notificationsCount > 0 && (
               <span className="badge bg-blue-500 text-white rounded-full flex items-center justify-center"> {/* Используем класс badge */}
                {notificationsCount}
               </span>
            )}
          </button>
          {/* Внешняя кнопка поиска удалена */}
        </div>
      </div>
    </header>
  );
};

export default Header;
