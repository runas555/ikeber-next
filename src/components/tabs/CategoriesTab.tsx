"use client";
import React from 'react';
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

interface CategoriesTabProps {
  onCategoryClick: (categoryName: string) => void;
}

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
    color: "text-red-600",
    bgColor: "bg-red-100"
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

const CategoriesTab: React.FC<CategoriesTabProps> = ({ onCategoryClick }) => {
  const [loading, setLoading] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const handleClick = (categoryName: string) => {
    setLoading(true);
    setSelectedCategory(categoryName);
    
    try {
      onCategoryClick(categoryName);
    } catch (error) {
      console.error('Error opening category:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Категории товаров</h1>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            Загружаем товары...
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleClick(category.name)}
            disabled={loading}
            className={`
              flex flex-col items-center p-4 rounded-xl transition-all
              ${category.bgColor} ${category.color}
              hover:scale-105 hover:shadow-md
              ${selectedCategory === category.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
              ${loading ? 'opacity-70' : ''}
            `}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={category.icon} size="2x" />
            </div>
            <span className="font-medium text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
