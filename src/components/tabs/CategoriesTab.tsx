"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faTools, faPalette, faLaptop, faTshirt, faBookOpen, faHeartbeat, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface CategoriesTabProps {
  onCategoryClick: (categoryName: string) => void;
}

const categories = [
  { name: "Товары для дома", icon: faCouch, color: "blue-600", bgColor: "blue-100" },
  { name: "Ремонт и услуги", icon: faTools, color: "green-600", bgColor: "green-100" },
  { name: "Хендмейд и творчество", icon: faPalette, color: "purple-600", bgColor: "purple-100" },
  { name: "Электроника", icon: faLaptop, color: "yellow-600", bgColor: "yellow-100" },
  { name: "Одежда и аксессуары", icon: faTshirt, color: "red-600", bgColor: "red-100" },
  { name: "Книги и хобби", icon: faBookOpen, color: "indigo-600", bgColor: "indigo-100" },
  { name: "Красота и здоровье", icon: faHeartbeat, color: "pink-600", bgColor: "pink-100" },
];

const CategoriesTab: React.FC<CategoriesTabProps> = ({ onCategoryClick }) => {
  return (
    <div id="categories-tab" className="tab-content p-4"> {/* 'active' class managed by parent */}
      <h1 className="text-xl font-bold text-gray-800 mb-5">Категории</h1>
      <div className="space-y-3">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategoryClick(category.name)}
            className="w-full flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition text-left focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <div className={`w-10 h-10 rounded-md bg-${category.bgColor} flex items-center justify-center mr-4`}>
              <FontAwesomeIcon icon={category.icon} className={`text-${category.color} text-lg`} />
            </div>
            <span className="font-medium text-gray-700 flex-1">{category.name}</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
