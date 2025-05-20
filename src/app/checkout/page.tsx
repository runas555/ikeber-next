'use client'; // Добавляем директиву

import CheckoutForm from '../../components/CheckoutForm';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import React from 'react';

const CheckoutPage = () => {
  // TODO: Implement actual search functionality if needed on this page
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  // TODO: Get current region from context or a default value
  const currentRegion = 'Буздяк';

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} currentRegion={currentRegion} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Оформление заказа</h1>
        <CheckoutForm />
      </main>
      <NavigationBar />
    </div>
  );
};

export default CheckoutPage;
