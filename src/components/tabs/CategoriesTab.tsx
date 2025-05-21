"use client";
import React from 'react';
import Link from 'next/link';
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
  return (
    <div className="p-3">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Категории</h1>
      
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={{
              pathname: `/category/${encodeURIComponent(category.name)}`,
              query: { region }
            }}
            passHref
            className={`
              flex flex-col items-center p-2 rounded-lg
              ${category.bgColor} ${category.color}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
            `}
          >
            <div className="w-8 h-8 flex items-center justify-center mb-1">
              <FontAwesomeIcon icon={category.icon} size="lg" />
            </div>
            <span className="text-xs font-medium text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
