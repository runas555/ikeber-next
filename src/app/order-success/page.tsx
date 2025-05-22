'use client';

import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-8 rounded-lg shadow-md">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Заказ успешно оформлен!
        </h2>
        <p className="mt-2 text-gray-600">
          Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для уточнения деталей.
        </p>
        <p className="mt-2 text-green-600 font-medium">
          Вы вошли в свой аккаунт! Теперь вы можете отслеживать заказы в личном кабинете.
        </p>
        <div className="mt-8">
          <button
            onClick={() => router.push('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}
