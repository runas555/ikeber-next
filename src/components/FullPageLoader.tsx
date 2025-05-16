"use client";
import React from 'react';

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col justify-center items-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <span className="text-gray-700 font-medium">Загрузка...</span>
    </div>
  );
}
