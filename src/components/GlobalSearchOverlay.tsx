"use client";

import React, { useContext } from 'react';
import { AppStateContext } from '@/context/AppStateProvider';
import SearchOverlay from '@/components/SearchOverlay';

export default function GlobalSearchOverlay() {
  const appState = useContext(AppStateContext);

  if (!appState) {
    // Это может произойти на мгновение во время инициализации,
    // или если компонент используется вне AppStateProvider (что не должно быть в данном случае).
    return null; 
  }

  const { isSearchOverlayOpen, searchStatusText } = appState;

  // Рендерим SearchOverlay только если isSearchOverlayOpen === true
  // isOpen пропс для SearchOverlay также будет управляться isSearchOverlayOpen
  if (!isSearchOverlayOpen) {
    return null;
  }

  return (
    <SearchOverlay isOpen={isSearchOverlayOpen} statusText={searchStatusText} />
  );
}
