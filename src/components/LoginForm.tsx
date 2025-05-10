"use client";
import React, { useState, useContext } from 'react';
import { AppStateContext } from '@/context/AppStateProvider';
import { usersData } from '@/data/users';

interface LoginFormProps {
  onSwitchToRegister: () => void; // Функция для переключения на форму регистрации
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { setCurrentUser, setActiveTab } = useContext(AppStateContext);
  const [phoneNumber, setPhoneNumber] = useState(''); // Изменено на phoneNumber
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Ищем пользователя по номеру телефона и паролю
    const user = usersData.find(
      (u) => u.phoneNumber === phoneNumber && u.password === password
    );

    if (user) {
      // Пароль не должен храниться в currentUser в состоянии приложения
      const userToSetAsCurrent = { ...user };
      delete userToSetAsCurrent.password; // Удаляем свойство password из копии
      setCurrentUser(userToSetAsCurrent);
      setActiveTab('profile'); // Перенаправляем на вкладку профиля после входа
    } else {
      setError('Неверный номер телефона или пароль'); // Обновлено сообщение об ошибке
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-6">Вход</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-phoneNumber">
            Номер телефона
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="login-phoneNumber"
            type="tel" // Изменен тип на tel
            placeholder="+7 (XXX) XXX-XX-XX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
            Пароль
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
