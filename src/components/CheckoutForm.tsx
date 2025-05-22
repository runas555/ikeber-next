'use client';

import React, { useState, useContext, useEffect } from 'react';
import FullPageLoader from './FullPageLoader';
import { AddressSuggestions, DaDataSuggestion, DaDataAddress } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import { supabase } from '@/lib/supabase';
import { AppStateContext } from '@/context/AppStateProvider';

const CheckoutForm = () => {
  const { cart, setCurrentUser, setCart, currentUser, setOrdersBadgeCount } = useContext(AppStateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '+7');
  const [address, setAddress] = useState(currentUser?.address || '');

  useEffect(() => {
    if (currentUser?.address) {
      setAddress(currentUser.address);
    }
  }, [currentUser?.address]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !address) {
      alert('Заполните телефон и адрес');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Проверяем/создаем пользователя
      let userId;
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', phone)
        .single();

      if (existingUser) {
        userId = existingUser.id;
        // Обновляем адрес если нужно
        await supabase
          .from('users')
          .update({ address })
          .eq('id', userId);
      } else {
        // Создаем нового пользователя
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([{ 
            phone_number: phone,
            address: address
          }])
          .select('id')
          .single();

        if (error) throw error;
        userId = newUser.id;

        // Автоматически входим в систему
        const { error: signInError } = await supabase.auth.signInWithPassword({
          phone: phone,
          password: phone // Используем телефон как временный пароль
        });

        if (signInError) throw signInError;
      }

      // 2. Создаем заказ
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          address: address,
          items: cart,
          status: 'new'
        })
        .select();

      if (orderError || !orderData) throw orderError || new Error('Не удалось создать заказ');
      
      console.log('Заказ создан:', orderData);

      // 3. Обновляем состояние
      setCurrentUser({
        id: userId,
        phoneNumber: phone,
        address: address
      });
      // Очищаем корзину и обновляем состояние
      setCart([]);
      // Обновляем localStorage
      localStorage.removeItem('cart');
      // Сбрасываем счетчик в табе
      localStorage.setItem('ordersBadgeCount', '0');
      // Обновляем состояние счетчика
      if (setOrdersBadgeCount) {
        setOrdersBadgeCount(0);
      }
      
      // Перенаправляем на страницу успешного оформления
      window.location.href = '/order-success';
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      alert('Ошибка при оформлении заказа');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

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
            value={address ? { value: address } as DaDataSuggestion<DaDataAddress> : undefined}
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
