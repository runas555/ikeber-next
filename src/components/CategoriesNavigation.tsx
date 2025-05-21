"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCouch, faTools, faLaptop, faCar
} from '@fortawesome/free-solid-svg-icons';

const categories = [
  { name: "Для дома", icon: faCouch, color: "blue", id: "Товары для дома" },
  { name: "Услуги", icon: faTools, color: "green", id: "Ремонт и услуги" },
  { name: "Электроника", icon: faLaptop, color: "yellow", id: "Электроника" },
  { name: "Красота", icon: faCar, color: "pink", id: "Красота и здоровье" }
];

const CategoriesNavigation: React.FC<{ 
  onSelect: (categoryId: string) => void
}> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-3 pb-4 px-4">
      {categories.map(cat => (
        <button 
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="flex flex-col items-center p-3 rounded-lg bg-white shadow-sm min-w-[80px]"
        >
          <div className={`w-10 h-10 bg-${cat.color}-100 rounded-full flex items-center justify-center mb-2`}>
            <FontAwesomeIcon icon={cat.icon} className={`text-${cat.color}-600`} style={{pointerEvents: 'none'}} />
          </div>
          <span className="text-xs font-medium text-gray-700">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoriesNavigation;
