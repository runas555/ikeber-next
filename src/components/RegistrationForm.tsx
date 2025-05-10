"use client";
import React, { useState, useContext } from 'react';
import { AppStateContext } from '@/context/AppStateProvider';
import { usersData, User } from '@/data/users'; // Импортируем данные пользователей и тип User

interface RegistrationFormProps {
  onSwitchToLogin: () => void; // Функция для переключения на форму входа
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  const { setCurrentUser, setActiveTab } = useContext(AppStateContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim() || !email.trim()) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    // Проверка, существует ли пользователь с таким именем
    if (usersData.find((u) => u.username === username)) {
      setError('Пользователь с таким именем уже существует');
      return;
    }
    
    // Проверка, существует ли пользователь с таким email
    if (usersData.find((u) => u.email === email)) {
      setError('Пользователь с таким email уже существует');
      return;
    }

    // В MVP мы просто добавляем пользователя в массив usersData.
    // В реальном приложении здесь будет запрос к API.
    const newUser: User = {
      id: usersData.length > 0 ? Math.max(...usersData.map(u => u.id)) + 1 : 1, // Генерируем новый ID
      username,
      password, // Пароль должен хешироваться в реальном приложении
      email,
    };
    usersData.push(newUser); // ВАЖНО: Это изменение будет только на клиенте и сбросится при перезагрузке.
                           // Для сохранения данных нужна база данных или localStorage.

    setCurrentUser(newUser);
    setSuccess('Регистрация прошла успешно! Вы вошли в систему.');
    
    // Очистка формы
    setUsername('');
    setPassword('');
    setEmail('');

    // Через некоторое время перенаправляем на вкладку профиля
    setTimeout(() => {
        setActiveTab('profile');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-6">Регистрация</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-username">
            Имя пользователя
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="reg-username"
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="reg-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
        <div className="flex flex-col items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-3"
            type="submit"
          >
            Зарегистрироваться
          </button>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Уже есть аккаунт? Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
