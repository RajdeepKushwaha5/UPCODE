'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaPalette, FaCrown, FaCheck, FaTimes } from 'react-icons/fa';

const ThemeButton = () => {
  const { currentTheme, themes, userPremium, switchTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSwitch = (themeId) => {
    const result = switchTheme(themeId);

    if (!result.success && result.requiresPremium) {
      setShowPremiumModal(true);
      return;
    }

    setIsOpen(false);
  };

  const getThemeIcon = (theme) => {
    const icons = {
      purple: '🟣',
      darkMode: '🌙',
      lightMode: '☀️',
      ocean: '🌊',
      sunset: '🌅',
      forest: '🌲',
      midnight: '🌌',
      rose: '🌹',
      emerald: '💚',
      cosmic: '🪐'
    };
    return icons[theme.id] || '🎨';
  };

  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaCrown className="text-yellow-500 text-xl" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Premium Theme</h3>
          </div>
          <button
            onClick={() => setShowPremiumModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This beautiful theme is exclusive to Premium members. Upgrade to unlock all premium themes and features!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPremiumModal(false)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200"
          >
            Upgrade to Premium
          </button>
          <button
            onClick={() => setShowPremiumModal(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 flex items-center justify-center text-lg max-sm:text-base hover:scale-110"
        title="Change Theme"
      >
        🎨
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaPalette className="text-purple-500" />
              Choose Theme
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Personalize your experience
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="p-2">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSwitch(theme.id)}
                  className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700 ${currentTheme === theme.id
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700'
                    : 'border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getThemeIcon(theme)}</span>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {theme.name}
                          </span>
                          {theme.isPremium && (
                            <FaCrown className="text-yellow-500 text-xs" />
                          )}
                        </div>
                        {theme.isPremium && !userPremium && (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">
                            Premium Only
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Theme Preview */}
                    <div className="flex gap-1">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: theme.cssVars['--primary-start'] }}
                      ></div>
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: theme.cssVars['--primary-end'] }}
                      ></div>
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: theme.cssVars['--accent'] }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentTheme === theme.id && (
                      <FaCheck className="text-purple-500 text-sm" />
                    )}
                    {theme.isPremium && !userPremium && (
                      <FaCrown className="text-yellow-500 text-sm opacity-50" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {Object.values(themes).filter(t => !t.isPremium).length} Free themes
              </span>
              <span>
                {Object.values(themes).filter(t => t.isPremium).length} Premium themes
              </span>
            </div>
            {!userPremium && (
              <button className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs py-2 px-3 rounded-lg font-semibold transition-all duration-200">
                Unlock All Themes with Premium
              </button>
            )}
          </div>
        </div>
      )}

      {showPremiumModal && <PremiumModal />}
    </div>
  );
};

export default ThemeButton;


