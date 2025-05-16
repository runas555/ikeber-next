"use client";
import React from 'react';
import Link from 'next/link'; // Импортируем Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCouch, 
  faTools, 
  faPalette,
  faLaptop,
  faTshirt,
  faBookOpen,
  faHeartbeat
} from '@fortawesome/free-solid-svg-icons';

// interface CategoriesTabProps больше не нужен, так как onCategoryClick удален
// interface CategoriesTabProps {
// onCategoryClick: (categoryName: string) => void;
// }

const categories = [
  { 
    name: "Товары для дома", 
    icon: faCouch,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  { 
    name: "Ремонт и услуги", 
    icon: faTools,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  { 
    name: "Хендмейд и творчество", 
    icon: faPalette,
    color: "text-purple-600", 
    bgColor: "bg-purple-100"
  },
  { 
    name: "Электроника", 
    icon: faLaptop,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
  { 
    name: "Одежда и аксессуары", 
    icon: faTshirt,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  },
  { 
    name: "Книги и хобби", 
    icon: faBookOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  },
  { 
    name: "Красота и здоровье", 
    icon: faHeartbeat,
    color: "text-pink-600",
    bgColor: "bg-pink-100"
  },
];

interface CategoriesTabProps {
  region: string;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({ region }) => {
  // Состояния loading и selectedCategory больше не нужны

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Категории товаров</h1>
      
      {/* Индикатор загрузки больше не нужен здесь, так как переход на новую страницу */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={{
              pathname: `/category/${encodeURIComponent(category.name)}`,
              query: { region }
            }}
            passHref
            className={`
              flex flex-col items-center p-4 rounded-xl transition-all
              ${category.bgColor} ${category.color}
              hover:scale-105 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 
            `}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={category.icon} size="2x" />
            </div>
            <span className="font-medium text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
