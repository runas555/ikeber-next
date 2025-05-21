"use client";
import React, { useState, useContext } from 'react';
import { AppStateContext } from '@/context/AppStateProvider';
import { supabase } from '@/lib/supabase';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const validateRussianPhone = (phone: string): boolean => {
  return /^\+7\d{10}$/.test(phone);
};

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { setCurrentUser, setActiveTab } = useContext(AppStateContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateRussianPhone(phoneNumber)) {
      setError('Введите российский номер в формате +7XXXXXXXXXX');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, phone_number, name, surname, avatar_url, address')
        .eq('phone_number', phoneNumber)
        .single();

      if (error || !data) {
        setError('Пользователь не найден');
        return;
      }

      setCurrentUser({
        id: data.id,
        phoneNumber: data.phone_number,
        name: data.name,
        surname: data.surname,
        avatar_url: data.avatar_url,
        address: data.address
      });
      setActiveTab('profile');
    } catch {
      setError('Ошибка при входе');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-6">Вход</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-phoneNumber">
            Номер телефона
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="login-phoneNumber"
            type="tel"
            placeholder="+7XXXXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex flex-col items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-3"
            type="submit"
          >
            Войти
          </button>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800"
          >
            Нет аккаунта? Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
