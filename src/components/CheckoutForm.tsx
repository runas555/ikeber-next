'use client';

import React, { useState } from 'react';

const CheckoutForm = () => {
  const [phone, setPhone] = useState('+7');
  const [address, setAddress] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только цифры после "+7" и ограничиваем длину
    if (value.startsWith('+7')) {
      const digits = value.substring(2).replace(/\D/g, ''); // Удаляем все нецифровые символы после +7
      if (digits.length <= 10) {
        setPhone(`+7${digits}`);
      }
    } else if (value === '+' || value === '') { // Позволяем начать ввод с + или очистить поле
      setPhone('+7');
    }
    // Если пользователь пытается удалить "+7", восстанавливаем его
    else if (!value.startsWith('+7') && value.length > 0){
        setPhone('+7' + value.replace(/\D/g, '').substring(0,10));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement order submission logic
    console.log('Order submitted:', { phone, address });
    alert('Заказ оформлен!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Номер телефона
        </label>
        <div className="mt-1">
          <input
            type="tel"
            name="phone"
            id="phone"
            autoComplete="tel"
            value={phone}
            onChange={handlePhoneChange}
            required
            pattern="\+7\d{10}"
            title="Номер телефона должен быть в формате +7XXXXXXXXXX"
            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Адрес доставки
        </label>
        <div className="mt-1">
          <textarea
            id="address"
            name="address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Например: г. Москва, ул. Ленина, д. 10, кв. 5
        </p>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Оформить заказ
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
