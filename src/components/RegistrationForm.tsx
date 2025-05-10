"use client";
import React, { useState, useContext } from 'react';
import { AppStateContext } from '@/context/AppStateProvider';
import { User } from '@/data/users'; // Импортируем тип User, usersData больше не нужен для проверок здесь

interface RegistrationFormProps {
  onSwitchToLogin: () => void; // Функция для переключения на форму входа
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  const { setCurrentUser, setActiveTab } = useContext(AppStateContext);
  const [phoneNumber, setPhoneNumber] = useState(''); // Изменено с username/email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!phoneNumber.trim() || !password.trim()) { // Проверка phoneNumber и password
      setError('Номер телефона и пароль обязательны для заполнения');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }), // Отправляем phoneNumber и password
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Ошибка регистрации. Попробуйте еще раз.');
      } else {
        // Пароль не должен храниться в currentUser в состоянии приложения
        const registeredUser = data.user as User; // Утверждаем тип пользователя из ответа
        const userToSetAsCurrent = { ...registeredUser };
        delete userToSetAsCurrent.password; // Удаляем свойство password из копии

        setCurrentUser(userToSetAsCurrent);
        setSuccess(data.message || 'Регистрация прошла успешно! Вы вошли в систему.');
        
        // Очистка формы
        setPhoneNumber('');
        setPassword('');

        // Через некоторое время перенаправляем на вкладку профиля
        setTimeout(() => {
            setActiveTab('profile');
        }, 1500);
      }
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-phoneNumber">
            Номер телефона
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="reg-phoneNumber"
            type="tel" // Изменен тип на tel
            placeholder="+7 (XXX) XXX-XX-XX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-password">
            Пароль
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="reg-password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
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
