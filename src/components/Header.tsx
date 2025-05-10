"use client";
import React, { useState, useContext } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons'; // Добавлена faPaperPlane
import { faHeart, faBell } from '@fortawesome/free-regular-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider';
import { useRouter } from 'next/navigation'; // Импорт useRouter

interface HeaderProps {
  onSearch: (query: string) => void;
  showBackButton?: boolean; // Новый опциональный пропс
}

const Header: React.FC<HeaderProps> = ({ onSearch, showBackButton = false }) => { // Значение по умолчанию для showBackButton
  const router = useRouter(); // Инициализация router
  const [searchQuery, setSearchQuery] = useState('');
  const appState = useContext(AppStateContext); // Используем appState, чтобы избежать ошибки, если контекст null
  const notificationsCount = appState ? appState.notificationsCount : 0;
  const favoritesCount = appState ? appState.favoritesCount : 0;

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  return (
    <header className="bg-white py-3 px-4 sticky top-0 z-30 border-b border-gray-200">
      <div className="flex items-center justify-between space-x-2">
        {/* Левая часть: Кнопка назад или логотип */}
        {showBackButton ? (
          <button onClick={() => router.back()} className="text-gray-600 hover:text-blue-600 p-1">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
        ) : (
          <Image src="/ikeber.svg" alt="Local Hub Logo" width={28} height={28} className="text-blue-600" /> // Немного увеличил лого
        )}

        {/* Центральная часть: Поиск */}
        <div className="relative flex-grow mx-2">
          <input
            type="text"
            placeholder="Найти товар, услугу..." // Сократил плейсхолдер
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full py-2 px-3 pl-10 pr-10 bg-gray-100 rounded-lg border border-gray-200 focus:border-blue-400 search-input text-sm" // Добавлен pr-10
          />
          <FontAwesomeIcon
            icon={faSearch} // Лупа слева остается
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 p-1"
              aria-label="Искать"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
            </button>
          )}
        </div>
        
        {/* Правая часть: Только иконки действий */}
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
