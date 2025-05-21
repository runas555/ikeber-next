'use client';

import React, { useState } from 'react';
import { AddressSuggestions, DaDataSuggestion, DaDataAddress } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const CheckoutForm = () => {
  const [phone, setPhone] = useState('+7');
  const [address, setAddress] = useState('');
  const dadataToken = process.env.NEXT_PUBLIC_DADATA_API_KEY;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('+7')) {
      const digits = value.substring(2).replace(/\D/g, '');
      if (digits.length <= 10) {
        setPhone(`+7${digits}`);
      }
    } else if (value === '+' || value === '') {
      setPhone('+7');
    }
    else if (!value.startsWith('+7') && value.length > 0){
        setPhone('+7' + value.replace(/\D/g, '').substring(0,10));
    }
  };

  const handleAddressChange = (suggestion?: DaDataSuggestion<DaDataAddress>) => {
    setAddress(suggestion?.value || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <AddressSuggestions
            token={dadataToken || ''}
            value={address as unknown as DaDataSuggestion<DaDataAddress>}
            onChange={handleAddressChange}
            inputProps={{
              placeholder: "Начните вводить адрес",
              className: "block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
            }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Начните вводить адрес для автодополнения
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
