"use client";
import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Item } from '@/types/item';

interface ProductModalProps {
  product: Item;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="product-modal active" // 'active' class makes it visible via CSS
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalProductTitle"
    >
      <button className="modal-close" onClick={onClose} aria-label="Закрыть модальное окно">
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className="modal-content scrollbar-hide">
        <Image
          id="modalProductImage"
          src={product.image}
          alt={product.name}
          width={400} // Provide appropriate width/height or use fill with a sized container
          height={300}
          className="modal-image"
          priority // If it's LCP when modal opens
        />
        <h2 id="modalProductTitle" className="text-xl font-bold mb-2">{product.name}</h2>
        <p id="modalProductProvider" className="text-gray-500 text-sm mb-4">{product.provider}</p>
        <p id="modalProductPrice" className="text-blue-600 font-bold text-lg mb-4">{product.price}</p>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
          Добавить в корзину
        </button>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Описание</h3>
          <div className="pr-2"> {/* For potential scrollbar space, if content overflows description box */}
            <p id="modalProductDescription" className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
