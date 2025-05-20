"use client";
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faTrash,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';
import { AppStateContext } from '@/context/AppStateProvider';

const CartTab: React.FC = () => {
  const { cart, setCart, setOrdersBadgeCount } = useContext(AppStateContext) || {
    cart: [],
    setCart: () => {},
    setOrdersBadgeCount: () => {}
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === itemId ? {...item, quantity: newQuantity} : item
    );
    setCart(updatedCart);
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    setOrdersBadgeCount(updatedCart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const totalSum = cart.reduce((sum, item) => {
    const price = typeof item.price === 'number' 
      ? item.price 
      : parseFloat(item.price.toString().replace(/[^\d.]/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faTimesCircle} className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Корзина пуста</h3>
        <p className="mt-1 text-gray-500">Добавьте товары в корзину</p>
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Начать покупки
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24"> {/* Добавлен отступ снизу для фиксированной панели */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Корзина</h1>
      

      <div className="space-y-4 mb-6">
        {cart.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">Количество: {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-gray-600" />
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>


            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <span className="font-bold">
                {typeof item.price === 'number' 
                  ? item.price * item.quantity 
                  : parseFloat(item.price.toString().replace(/[^\d.]/g, '')) * item.quantity} ₽
              </span>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Общая сумма</p>
              <p className="text-xl font-bold">{totalSum} ₽</p>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTab;
