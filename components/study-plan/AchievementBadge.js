'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';

const {
  FaTrophy, FaMedal, FaStar, FaFire, FaCrown, FaGem,
  FaCode, FaBullseye, FaClock, FaCalendarAlt, FaChartLine,
  FaLock, FaCheckCircle, FaPlay, FaInfoCircle
} = FaIcons; const AchievementBadge = ({ achievement, size = 'md', showDetails = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const sizes = {
    sm: { badge: 'w-12 h-12', icon: 'text-sm', text: 'text-xs' },
    md: { badge: 'w-16 h-16', icon: 'text-base', text: 'text-sm' },
    lg: { badge: 'w-20 h-20', icon: 'text-lg', text: 'text-base' }
  };

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  };

  const rarityGlows = {
    common: 'shadow-gray-500/20',
    rare: 'shadow-blue-500/30',
    epic: 'shadow-purple-500/30',
    legendary: 'shadow-yellow-500/40'
  };

  const getIcon = (iconType) => {
    const icons = {
      trophy: FaTrophy,
      medal: FaMedal,
      star: FaStar,
      fire: FaFire,
      crown: FaCrown,
      gem: FaGem,
      code: FaCode,
      target: FaBullseye,
      clock: FaClock,
      calendar: FaCalendarAlt,
      chart: FaChartLine
    };
    return icons[iconType] || FaTrophy;
  };

  const currentSize = sizes[size];
  const Icon = getIcon(achievement.icon);
  const isUnlocked = achievement.unlockedAt;
  const progressPercentage = Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);

  return (
    <div className="relative">
      <motion.div
        className={`relative ${currentSize.badge} cursor-pointer ${onClick ? 'cursor-pointer' : ''}`}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Badge Background */}
        <div
          className={`w-full h-full rounded-full bg-gradient-to-br ${isUnlocked ? rarityColors[achievement.rarity] : 'from-gray-600 to-gray-700'
            } flex items-center justify-center border-2 ${isUnlocked ? 'border-white/20' : 'border-gray-500/20'
            } transition-all duration-300 ${isUnlocked ? `shadow-lg ${rarityGlows[achievement.rarity]}` : ''
            } ${isHovered && isUnlocked ? 'shadow-xl' : ''}`}
        >
          {/* Icon */}
          <Icon
            className={`${currentSize.icon} ${isUnlocked ? 'text-white' : 'text-gray-400'
              } transition-colors`}
          />

          {/* Lock Overlay for Locked Achievements */}
          {!isUnlocked && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <FaLock className="text-gray-300 text-xs" />
            </div>
          )}

          {/* Sparkle Effect for Legendary */}
          {isUnlocked && achievement.rarity === 'legendary' && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(234, 179, 8, 0.7)',
                  '0 0 0 10px rgba(234, 179, 8, 0)',
                  '0 0 0 0 rgba(234, 179, 8, 0)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* Progress Ring for In-Progress Achievements */}
          {!isUnlocked && achievement.currentProgress > 0 && (
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(147, 51, 234, 0.8)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 45 * (1 - progressPercentage / 100)
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          )}

          {/* Check Mark for Completed */}
          {isUnlocked && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FaCheckCircle className="text-white text-xs" />
            </motion.div>
          )}
        </div>

        {/* Rarity Indicator */}
        {isUnlocked && (
          <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium ${achievement.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
            achievement.rarity === 'epic' ? 'bg-purple-500 text-white' :
              achievement.rarity === 'rare' ? 'bg-blue-500 text-white' :
                'bg-gray-500 text-white'
            }`}>
            {achievement.rarity.charAt(0).toUpperCase()}
          </div>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl min-w-[200px]">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`text-sm ${isUnlocked ? 'text-white' : 'text-gray-400'
                  }`} />
                <span className={`font-medium ${isUnlocked ? 'text-white' : 'text-gray-400'
                  }`}>
                  {achievement.title}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                  achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                    achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                  }`}>
                  {achievement.rarity}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>

              {/* Progress */}
              {!isUnlocked && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{achievement.currentProgress} / {achievement.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Unlock Date */}
              {isUnlocked && achievement.unlockedAt && (
                <div className="text-xs text-gray-400">
                  Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}

              {/* Reward Info */}
              {achievement.reward && (
                <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs">
                  <div className="text-green-300 font-medium">Reward:</div>
                  <div className="text-green-200">{achievement.reward}</div>
                </div>
              )}

              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-700"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Card View */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${isUnlocked ? rarityColors[achievement.rarity] : 'from-gray-600 to-gray-700'
              } flex items-center justify-center border-2 border-white/20`}>
              <Icon className={`text-lg ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <FaLock className="text-gray-300 text-sm" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                  {achievement.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                  achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                    achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                  }`}>
                  {achievement.rarity}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>

              {!isUnlocked && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{achievement.currentProgress} / {achievement.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {achievement.requirement - achievement.currentProgress} more to unlock
                  </div>
                </div>
              )}

              {achievement.reward && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                  <div className="text-green-300 font-medium text-sm">Reward:</div>
                  <div className="text-green-200 text-sm">{achievement.reward}</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementBadge;
