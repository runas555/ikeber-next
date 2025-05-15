"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Импортируем Link
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Удалено
// import { faCartPlus } from '@fortawesome/free-solid-svg-icons'; // Удалено
import { Item } from '@/types/item';

interface ProductCardProps {
  item: Item;
  // onClick больше не нужен, так как мы используем Link
  // onAddToCart?: (item: Item) => void; // For adding to cart - Удалено
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, /* onAddToCart, */ className }) => { // onAddToCart удален из props
  // handleCardClick больше не нужен

  // const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => { // Функция удалена
  //   e.stopPropagation(); // Prevent card click event
  //   // if (onAddToCart) {
  //   //   onAddToCart(item);
  //   // } else {
  //   //   console.log('Add to cart:', item.name);
  //   // }
  // };

  return (
    <Link href={`/products/${item.id}`} passHref>
      <div
        className={`item-card bg-white rounded-lg overflow-hidden cursor-pointer ${className}`} // cursor-pointer теперь всегда
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
      <div className="p-2 sm:p-3"> {/* Уменьшен padding для маленьких экранов */}
        <h3 className="font-semibold text-xs sm:text-sm text-gray-800 truncate" title={item.name}>{item.name}</h3> {/* Адаптивный размер шрифта */}
        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate" title={item.provider}>{item.provider}</p> {/* Адаптивный размер шрифта */}
        <div className="flex items-baseline mt-1 sm:mt-2"> {/* Убрал justify-between, чтобы цена и скидка были вместе */}
          <span className="font-bold text-blue-600 text-[11px] sm:text-sm">{item.price}</span> {/* Адаптивный размер шрифта */}
          {item.discount && (
            <>
              <span className="text-gray-500 line-through ml-1.5 sm:ml-2 text-[9px] sm:text-xs"> {/* Адаптивный размер шрифта и отступ */}
                {(() => {
                  const currentPrice = parseFloat(item.price.replace(/[^0-9.-]+/g,""));
                  const discountPercentage = parseFloat(item.discount.replace(/[^0-9.-]+/g,""));
                  if (!isNaN(currentPrice) && !isNaN(discountPercentage) && discountPercentage > 0 && discountPercentage < 100) {
                    const oldPrice = currentPrice / (1 - discountPercentage / 100);
                    return `${Math.round(oldPrice)} ₽`;
                  }
                  return '';
                })()}
              </span>
              <span className="text-red-500 ml-1 sm:ml-1.5 bg-red-100 px-1 rounded text-[9px] sm:text-xs"> {/* Адаптивный размер шрифта и отступ */}
                -{item.discount}
              </span>
            </>
          )}
        </div>
        {/* Кнопка добавления в корзину удалена */}
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
