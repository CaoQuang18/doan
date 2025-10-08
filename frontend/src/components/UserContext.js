import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser, removeUser] = useLocalStorage('user', null);

  // Login
  const login = useCallback((userData) => {
    setUser(userData);
  }, [setUser]);

  // Logout
  const logout = useCallback(() => {
    removeUser();
  }, [removeUser]);

  // Update profile (partial update)
  const updateProfile = useCallback((updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  }, [user, setUser]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    setUser,
    login,
    logout,
    updateProfile
  }), [user, setUser, login, logout, updateProfile]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
