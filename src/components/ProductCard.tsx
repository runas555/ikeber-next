"use client";
import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Item } from '@/data/items'; // Assuming Item type

interface ProductCardProps {
  item: Item;
  onClick?: (item: Item) => void; // For opening modal
  onAddToCart?: (item: Item) => void; // For adding to cart
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onClick, onAddToCart, className }) => {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent click if target is the add to cart button
    if ((e.target as HTMLElement).closest('button.add-to-cart-btn')) {
      return;
    }
    if (onClick) {
      onClick(item);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click event
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      console.log('Add to cart:', item.name);
    }
  };

  return (
    <div
      className={`item-card bg-white rounded-lg overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick ? handleCardClick : undefined}
      data-item-id={item.id}
    >
      <div className="relative w-full h-32"> {/* Container for Image */}
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 200px" // Adjust sizes
          style={{ objectFit: 'cover' }}
          className="transform group-hover:scale-105 transition-transform duration-300" // Example hover effect
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 truncate" title={item.name}>{item.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate" title={item.provider}>{item.provider}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-blue-600">{item.price}</span>
          <button
            className="add-to-cart-btn text-blue-500 hover:text-blue-700 p-1"
            onClick={handleAddToCartClick}
            aria-label={`Добавить ${item.name} в корзину`}
          >
            <FontAwesomeIcon icon={faCartPlus} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
