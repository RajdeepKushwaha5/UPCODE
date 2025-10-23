'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeButton = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-lg theme-surface-elevated border theme-border hover:scale-110 transition-all duration-300 flex items-center justify-center text-lg max-sm:text-base theme-shadow"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FaSun className="theme-accent" />
      ) : (
        <FaMoon className="theme-accent" />
      )}
    </button>
  );
};

export default ThemeButton;


