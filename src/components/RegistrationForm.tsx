"use client";
import React, { useState, useContext } from 'react';
import { AppStateContext } from '@/context/AppStateProvider';
import { supabase } from '@/lib/supabase';

interface RegistrationFormProps {
  onSwitchToLogin: () => void;
}

const validateRussianPhone = (phone: string): boolean => {
  return /^\+7\d{10}$/.test(phone);
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  const { setCurrentUser, setActiveTab } = useContext(AppStateContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Генерируем простой код из номера (последние 4 цифры)
  const generateSimpleCode = (phone: string) => {
    return phone.slice(-4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateRussianPhone(phoneNumber)) {
      setError('Введите российский номер в формате +7XXXXXXXXXX');
      setIsLoading(false);
      return;
    }

    try {
      if (!showCodeInput) {
        // Первый шаг - показываем поле для ввода кода
        setShowCodeInput(true);
        setIsLoading(false);
        return;
      }

      // Второй шаг - проверка кода
      const expectedCode = generateSimpleCode(phoneNumber);
      if (verificationCode !== expectedCode) {
        setError('Неверный код подтверждения');
        return;
      }

      // Проверяем, не зарегистрирован ли уже номер
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();

      if (existingUser) {
        setError('Этот номер уже зарегистрирован');
        return;
      }

      // Генерируем аватарку
      const avatarUrl = `https://i.pravatar.cc/150?u=${phoneNumber}`;
      
      // Регистрируем нового пользователя
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          phone_number: phoneNumber,
          avatar_url: avatarUrl,
          address: ''
        }])
        .select('id, phone_number, name, surname, avatar_url, address')
        .single();

      if (error) {
        setError('Ошибка регистрации: ' + error.message);
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
    } catch (err) {
      console.error('Registration request failed:', err);
      setError('Не удалось подключиться к серверу. Пожалуйста, проверьте ваше соединение.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-6">Регистрация</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        {!showCodeInput ? (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-phoneNumber">
              Номер телефона
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="reg-phoneNumber"
              type="tel"
              placeholder="+7XXXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-code">
              Введите последние 4 цифры номера
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="reg-code"
              type="text"
              placeholder="XXXX"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        )}
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex flex-col items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-3"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            disabled={isLoading}
          >
            Уже есть аккаунт? Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
