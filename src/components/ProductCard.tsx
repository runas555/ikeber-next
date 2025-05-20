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
        <div className="relative w-full h-48"> {/* Container for Image - увеличенная высота */}
          <Image
            src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 200px" // Adjust sizes
          style={{ objectFit: 'cover' }}
          className="transform group-hover:scale-105 transition-transform duration-300" // Example hover effect
        />
      </div>
      <div className="p-3 sm:p-4"> {/* Увеличен padding */}
        <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate" title={item.name}>{item.name}</h3> {/* Увеличенный размер шрифта */}
        <div className="flex items-center mt-1">
          <div className="relative w-5 h-5 mr-1"> {/* Контейнер для аватарки */}
            <Image
              src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Временная аватарка с Unsplash
              alt="Provider Avatar"
              fill
              sizes="20px"
              style={{ objectFit: 'cover', borderRadius: '50%' }}
              className="rounded-full" // Tailwind класс для круглого изображения
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 truncate" title={item.provider}>{item.provider}</p> {/* Увеличенный размер шрифта */}
        </div>
        <div className="flex items-baseline mt-2 sm:mt-3"> {/* Увеличенные отступы */}
          <span className="font-bold text-green-600 text-sm sm:text-base">
            {item.is_service ? `от ${item.price} ₽` : `${item.price} ₽`}
          </span> {/* Адаптивный размер шрифта */}
          {item.discount && (
            <>
              <span className="text-gray-500 line-through ml-1.5 sm:ml-2 text-xs sm:text-sm"> {/* Увеличенный размер шрифта */}
                {(() => {
                  try {
                    // Получаем числовое значение цены
                    const priceNum = typeof item.price === 'string' 
                      ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
                      : Number(item.price);

                    // Получаем числовое значение скидки
                    const discountNum = item.discount 
                      ? typeof item.discount === 'string'
                        ? parseFloat(item.discount.replace(/[^\d.]/g, ''))
                        : Number(item.discount)
                      : 0;

                    // Проверяем валидность значений
                    if (!isNaN(discountNum) && !isNaN(priceNum) && 
                        discountNum > 0 && discountNum < 100 && priceNum > 0) {
                      const oldPrice = priceNum / (1 - discountNum / 100);
                      return `${Math.round(oldPrice)}`;
                    }
                  } catch (e) {
                    console.error('Error calculating old price:', e);
                  }
                  return '';
                })()}
              </span>
              <span className="text-red-500 ml-1 sm:ml-1.5 bg-red-100 px-1 rounded text-xs sm:text-sm"> {/* Увеличенный размер шрифта */}
                -{typeof item.discount === 'string' ? item.discount : `${item.discount}%`}
              </span>
            </>
          )}
        </div>
        {/* Кнопка добавления в корзину удалена */}
        <button className="bg-blue-500 text-white rounded p-2 text-xs w-full mt-2">
          Доставка сегодня
        </button>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
