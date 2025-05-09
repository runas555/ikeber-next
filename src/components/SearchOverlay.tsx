"use client";
import React from 'react';

interface SearchOverlayProps {
  isOpen: boolean;
  statusText: string;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, statusText }) => {
  if (!isOpen) return null;

  return (
    <div
      id="search-overlay"
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40 flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out opacity-100"
      // Opacity and hidden class controlled by parent via isOpen
    >
      <div id="search-status-text" className="text-white text-xl mb-4 text-center px-4">
        {statusText}
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default SearchOverlay;
