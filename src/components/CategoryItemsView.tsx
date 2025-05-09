"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Item } from '@/data/items';
import ProductCard from './ProductCard'; // Assuming ProductCard component

interface CategoryItemsViewProps {
  categoryName: string;
  items: Item[];
  onClose: () => void;
  onProductClick: (item: Item) => void;
}

const CategoryItemsView: React.FC<CategoryItemsViewProps> = ({ categoryName, items, onClose, onProductClick }) => {
  // This component is now a modal-like view, not a full tab.
  // Parent (HomePage) controls its visibility via 'isOpen' prop.
  // The 'active' class logic would be managed there.

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 transition-opacity duration-300 ease-in-out border-4 border-red-500">
      <div className="max-w-lg mx-auto bg-white flex flex-col shadow-lg h-full">
        <header className="bg-white py-3 px-4 sticky top-0 z-30 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Товары: {categoryName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 p-2 -mr-2" aria-label="Закрыть просмотр категории">
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </header>
        <main className="flex-1 p-4 overflow-y-auto scrollbar-hide pb-20"> {/* Added pb-20 for potential nav overlap */}
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-10">В этой категории пока нет товаров.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {items.map(item => (
                <ProductCard key={item.id} item={item} onClick={onProductClick} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryItemsView;
