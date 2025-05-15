"use client";
import React from 'react';

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}
