import React, { createContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage('favorites', []);

  const toggleFavorite = useCallback((house) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === house.id);
      if (isFavorite) {
        // Remove from favorites
        return prev.filter(fav => fav.id !== house.id);
      } else {
        // Add to favorites
        return [...prev, house];
      }
    });
  }, [setFavorites]);

  const isFavorite = useCallback((houseId) => {
    return favorites.some(fav => fav.id === houseId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  }), [favorites, toggleFavorite, isFavorite, clearFavorites]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
