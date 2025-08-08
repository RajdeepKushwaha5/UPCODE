'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  // Free Theme
  purple: {
    id: 'purple',
    name: 'Purple Mode',
    isPremium: false,
    colors: {
      primary: 'from-purple-600 to-pink-600',
      secondary: 'from-slate-900 via-purple-900 to-slate-900',
      accent: 'purple-500',
      background: 'slate-900',
      surface: 'slate-800',
      text: 'white',
      textSecondary: 'gray-300',
      border: 'purple-500/20',
    },
    cssVars: {
      '--primary-start': '#9333ea',
      '--primary-end': '#ec4899',
      '--background': '#0f172a',
      '--surface': '#1e293b',
      '--accent': '#a855f7',
      '--text': '#ffffff',
      '--text-secondary': '#d1d5db',
      '--border': 'rgba(168, 85, 247, 0.2)',
    }
  },
  
  // Premium Themes
  darkMode: {
    id: 'darkMode',
    name: 'Dark Mode',
    isPremium: true,
    colors: {
      primary: 'from-gray-700 to-gray-900',
      secondary: 'from-black via-gray-900 to-black',
      accent: 'gray-600',
      background: 'black',
      surface: 'gray-900',
      text: 'white',
      textSecondary: 'gray-400',
      border: 'gray-700/30',
    },
    cssVars: {
      '--primary-start': '#374151',
      '--primary-end': '#111827',
      '--background': '#000000',
      '--surface': '#111827',
      '--accent': '#4b5563',
      '--text': '#ffffff',
      '--text-secondary': '#9ca3af',
      '--border': 'rgba(75, 85, 99, 0.3)',
    }
  },
  
  neon: {
    id: 'neon',
    name: 'Neon Dreams',
    isPremium: true,
    colors: {
      primary: 'from-cyan-400 to-purple-600',
      secondary: 'from-black via-purple-900 to-cyan-900',
      accent: 'cyan-400',
      background: 'black',
      surface: 'gray-900',
      text: 'cyan-100',
      textSecondary: 'cyan-300',
      border: 'cyan-400/30',
    },
    cssVars: {
      '--primary-start': '#22d3ee',
      '--primary-end': '#9333ea',
      '--background': '#000000',
      '--surface': '#111827',
      '--accent': '#22d3ee',
      '--text': '#e0f7fa',
      '--text-secondary': '#67e8f9',
      '--border': 'rgba(34, 211, 238, 0.3)',
    }
  },
  
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    isPremium: true,
    colors: {
      primary: 'from-orange-500 to-red-600',
      secondary: 'from-orange-900 via-red-900 to-orange-900',
      accent: 'orange-500',
      background: 'red-950',
      surface: 'red-900',
      text: 'orange-100',
      textSecondary: 'orange-200',
      border: 'orange-500/20',
    },
    cssVars: {
      '--primary-start': '#f97316',
      '--primary-end': '#dc2626',
      '--background': '#450a0a',
      '--surface': '#7f1d1d',
      '--accent': '#f97316',
      '--text': '#fed7aa',
      '--text-secondary': '#fde68a',
      '--border': 'rgba(249, 115, 22, 0.2)',
    }
  },
  
  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    isPremium: true,
    colors: {
      primary: 'from-blue-600 to-teal-600',
      secondary: 'from-blue-950 via-teal-950 to-blue-950',
      accent: 'teal-500',
      background: 'blue-950',
      surface: 'blue-900',
      text: 'blue-100',
      textSecondary: 'blue-200',
      border: 'teal-500/20',
    },
    cssVars: {
      '--primary-start': '#2563eb',
      '--primary-end': '#0d9488',
      '--background': '#172554',
      '--surface': '#1e3a8a',
      '--accent': '#14b8a6',
      '--text': '#dbeafe',
      '--text-secondary': '#bfdbfe',
      '--border': 'rgba(20, 184, 166, 0.2)',
    }
  },
  
  forest: {
    id: 'forest',
    name: 'Forest Green',
    isPremium: true,
    colors: {
      primary: 'from-green-600 to-emerald-600',
      secondary: 'from-green-950 via-emerald-950 to-green-950',
      accent: 'emerald-500',
      background: 'green-950',
      surface: 'green-900',
      text: 'green-100',
      textSecondary: 'green-200',
      border: 'emerald-500/20',
    },
    cssVars: {
      '--primary-start': '#16a34a',
      '--primary-end': '#059669',
      '--background': '#052e16',
      '--surface': '#14532d',
      '--accent': '#10b981',
      '--text': '#dcfce7',
      '--text-secondary': '#bbf7d0',
      '--border': 'rgba(16, 185, 129, 0.2)',
    }
  },
  
  pastel: {
    id: 'pastel',
    name: 'Pastel Dreams',
    isPremium: true,
    colors: {
      primary: 'from-pink-300 to-purple-300',
      secondary: 'from-pink-50 via-purple-50 to-pink-50',
      accent: 'purple-300',
      background: 'pink-50',
      surface: 'white',
      text: 'purple-900',
      textSecondary: 'purple-700',
      border: 'purple-200/50',
    },
    cssVars: {
      '--primary-start': '#f9a8d4',
      '--primary-end': '#c4b5fd',
      '--background': '#fdf2f8',
      '--surface': '#ffffff',
      '--accent': '#c4b5fd',
      '--text': '#581c87',
      '--text-secondary': '#6b21a8',
      '--border': 'rgba(196, 181, 253, 0.5)',
    }
  },
  
  royal: {
    id: 'royal',
    name: 'Royal Gold',
    isPremium: true,
    colors: {
      primary: 'from-yellow-500 to-amber-600',
      secondary: 'from-yellow-950 via-amber-950 to-yellow-950',
      accent: 'amber-500',
      background: 'yellow-950',
      surface: 'yellow-900',
      text: 'yellow-100',
      textSecondary: 'yellow-200',
      border: 'amber-500/20',
    },
    cssVars: {
      '--primary-start': '#eab308',
      '--primary-end': '#d97706',
      '--background': '#422006',
      '--surface': '#78350f',
      '--accent': '#f59e0b',
      '--text': '#fef3c7',
      '--text-secondary': '#fde68a',
      '--border': 'rgba(245, 158, 11, 0.2)',
    }
  },
  
  galaxy: {
    id: 'galaxy',
    name: 'Galaxy Night',
    isPremium: true,
    colors: {
      primary: 'from-indigo-600 to-purple-700',
      secondary: 'from-indigo-950 via-purple-950 to-indigo-950',
      accent: 'indigo-500',
      background: 'indigo-950',
      surface: 'indigo-900',
      text: 'indigo-100',
      textSecondary: 'indigo-200',
      border: 'indigo-500/20',
    },
    cssVars: {
      '--primary-start': '#4f46e5',
      '--primary-end': '#7c3aed',
      '--background': '#1e1b4b',
      '--surface': '#312e81',
      '--accent': '#6366f1',
      '--text': '#e0e7ff',
      '--text-secondary': '#c7d2fe',
      '--border': 'rgba(99, 102, 241, 0.2)',
    }
  },
  
  cherry: {
    id: 'cherry',
    name: 'Cherry Blossom',
    isPremium: true,
    colors: {
      primary: 'from-pink-500 to-rose-600',
      secondary: 'from-pink-950 via-rose-950 to-pink-950',
      accent: 'rose-500',
      background: 'pink-950',
      surface: 'pink-900',
      text: 'pink-100',
      textSecondary: 'pink-200',
      border: 'rose-500/20',
    },
    cssVars: {
      '--primary-start': '#ec4899',
      '--primary-end': '#e11d48',
      '--background': '#500724',
      '--surface': '#881337',
      '--accent': '#f43f5e',
      '--text': '#fce7f3',
      '--text-secondary': '#fbcfe8',
      '--border': 'rgba(244, 63, 94, 0.2)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('purple');
  const [userPremium, setUserPremium] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }

    // Check premium status (you can replace this with actual user data)
    const premiumStatus = localStorage.getItem('userPremium') === 'true';
    setUserPremium(premiumStatus);
  }, []);

  useEffect(() => {
    // Apply CSS variables to root
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    Object.entries(theme.cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Save to localStorage
    localStorage.setItem('selectedTheme', currentTheme);
  }, [currentTheme]);

  const switchTheme = (themeId) => {
    const theme = themes[themeId];
    
    if (theme.isPremium && !userPremium) {
      return { success: false, requiresPremium: true };
    }
    
    setCurrentTheme(themeId);
    return { success: true, requiresPremium: false };
  };

  const value = {
    currentTheme,
    themes,
    userPremium,
    setUserPremium,
    switchTheme,
    themeColors: themes[currentTheme].colors
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
