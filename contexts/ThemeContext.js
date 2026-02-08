'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  light: { id: 'light', name: 'Light Mode', description: 'Clean, bright theme with excellent readability' },
  dark:  { id: 'dark',  name: 'Dark Mode',  description: 'Deep dark theme for comfortable viewing' },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('upcode-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setCurrentTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('upcode-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setCurrentTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('upcode-theme', currentTheme);
      // Also set meta theme-color for mobile browsers
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.content = currentTheme === 'dark' ? '#0c0c14' : '#f8fafc';
      }
    }
  }, [currentTheme, mounted]);

  const toggleTheme = useCallback(() => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((theme) => {
    if (theme === 'light' || theme === 'dark') {
      setCurrentTheme(theme);
    }
  }, []);

  const value = {
    theme: currentTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    toggleTheme,
    setTheme,
    themes,
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
