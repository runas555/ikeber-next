"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faBell } from '@fortawesome/free-regular-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider'; // Assuming context exists
import { useContext } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { notificationsCount, favoritesCount } = useContext(AppStateContext); // Example from context

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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Image src="/ikeber.svg" alt="Local Hub Logo" width={24} height={24} className="text-blue-600" />
          <button className="flex items-center text-xs text-gray-500 hover:text-blue-600 ml-3">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-red-500" />
            <span>Екатеринбург</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-xs ml-1" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-blue-600 relative">
            <FontAwesomeIcon icon={faHeart} className="text-xl" />
            {favoritesCount > 0 && (
              <span className="badge bg-red-500 text-white rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>
          <button className="text-gray-500 hover:text-blue-600 relative">
            <FontAwesomeIcon icon={faBell} className="text-xl" />
            {notificationsCount > 0 && (
               <span className="badge bg-blue-500 text-white rounded-full flex items-center justify-center">
                {notificationsCount}
               </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Найти товар, услугу или мастера..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full py-2.5 px-4 pl-10 pr-3 bg-gray-100 rounded-l-lg border border-r-0 border-gray-200 focus:border-blue-400 search-input text-sm"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 -ml-px"
        >
          Искать
        </button>
      </div>
    </header>
  );
};

export default Header;
