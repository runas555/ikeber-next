'use client';

import React, { useState } from 'react';
import { YMaps } from '@pbe/react-yandex-maps';


const CheckoutForm = () => {
  const [phone, setPhone] = useState('+7');
  const [address, setAddress] = useState('');
  const yandexMapsApiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

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
    if (!yandexMapsApiKey) {
      alert('API ключ Яндекс.Карт не настроен. Пожалуйста, добавьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY в ваш .env.local файл.');
      console.error('Yandex Maps API Key is not configured.');
      return;
    }
    // TODO: Implement order submission logic
    console.log('Order submitted:', { phone, address });
    alert('Заказ оформлен!');
  };

  if (!yandexMapsApiKey) {
    // Отображаем сообщение об ошибке, если ключ не найден на клиенте.
    // Это предотвратит попытку загрузки YMaps без ключа.
    return (
      <div className="p-4 my-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
        <span className="font-medium">Ошибка конфигурации:</span> API ключ Яндекс.Карт не найден. 
        Пожалуйста, убедитесь, что переменная <code className="font-mono bg-red-200 px-1 rounded">NEXT_PUBLIC_YANDEX_MAPS_API_KEY</code> 
        задана в вашем <code className="font-mono bg-red-200 px-1 rounded">.env.local</code> файле.
      </div>
    );
  }

  return (
    <YMaps query={{ apikey: yandexMapsApiKey }}>
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
          <input
            type="text"
            name="address"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
            placeholder="Введите адрес вручную"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Введите адрес доставки
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
  </YMaps>
  );
};

export default CheckoutForm;
