import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Apply dark mode with smooth transition
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = (event) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Get click position for ripple effect
    const x = event?.clientX || window.innerWidth / 2;
    const y = event?.clientY || window.innerHeight / 2;
    
    // Create ripple overlay
    const overlay = document.createElement('div');
    overlay.className = 'dark-mode-ripple';
    overlay.style.left = x + 'px';
    overlay.style.top = y + 'px';
    document.body.appendChild(overlay);
    
    // Start animation immediately
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });
    });
    
    // Toggle dark mode when circle reaches ~40% expansion
    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
    }, 300);
    
    // Remove overlay after full animation
    setTimeout(() => {
      overlay.remove();
      setIsTransitioning(false);
    }, 1000);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, isTransitioning }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};
