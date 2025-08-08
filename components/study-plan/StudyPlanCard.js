'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';
import { SiNetflix, SiUber } from 'react-icons/si';

const {
  FaPlay, FaPause, FaStop, FaEdit, FaTrash, FaCalendarAlt,
  FaClock, FaFire, FaBullseye, FaTrophy, FaChartLine, FaCrown,
  FaGoogle, FaAmazon, FaMicrosoft, FaApple, FaFacebook,
  FaBrain, FaRocket, FaCertificate, FaUser, FaFlag
} = FaIcons;

const StudyPlanCard = ({ studyPlan, isActive, onUpdate }) => {
  const getCompanyIcon = (company) => {
    const icons = {
      'Google': FaGoogle,
      'Amazon': FaAmazon,
      'Microsoft': FaMicrosoft,
      'Apple': FaApple,
      'Meta': FaFacebook,
      'Netflix': SiNetflix,
      'Uber': SiUber
    };
    return icons[company] || FaBullseye;
  };

  const getCompanyColor = (company) => {
    const colors = {
      'Google': 'text-blue-500',
      'Amazon': 'text-orange-500',
      'Microsoft': 'text-blue-600',
      'Apple': 'text-gray-400',
      'Meta': 'text-blue-500',
      'Netflix': 'text-red-500',
      'Uber': 'text-black dark:text-white'
    };
    return colors[company] || 'text-purple-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'from-green-500 to-emerald-500',
      'paused': 'from-yellow-500 to-orange-500',
      'completed': 'from-purple-500 to-pink-500',
      'cancelled': 'from-red-500 to-rose-500'
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  const getGoalTypeIcon = (type) => {
    const icons = {
      'interview': FaBrain,
      'contest': FaTrophy,
      'skill_improvement': FaRocket,
      'certification': FaCertificate
    };
    return icons[type] || FaBullseye;
  };

  const formatDaysRemaining = () => {
    const now = new Date();
    const end = new Date(studyPlan.estimatedCompletionDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const CompanyIcon = getCompanyIcon(studyPlan.goal?.company);
  const GoalIcon = getGoalTypeIcon(studyPlan.goal?.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${isActive
        ? 'border-purple-500/50 shadow-lg shadow-purple-500/20'
        : 'border-gray-700/50 hover:border-gray-600/50'
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(studyPlan.status)} rounded-lg flex items-center justify-center`}>
            <GoalIcon className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{studyPlan.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {studyPlan.goal?.company && studyPlan.goal.company !== 'General' && (
                <div className="flex items-center gap-1">
                  <CompanyIcon className={`text-sm ${getCompanyColor(studyPlan.goal.company)}`} />
                  <span className="text-gray-400 text-sm">{studyPlan.goal.company}</span>
                </div>
              )}
              {studyPlan.isPremiumPlan && (
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                  <FaCrown className="text-yellow-400 text-xs" />
                  <span className="text-yellow-200 text-xs">Premium</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${studyPlan.status === 'active' ? 'bg-green-500/20 text-green-300' :
            studyPlan.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300' :
              studyPlan.status === 'completed' ? 'bg-purple-500/20 text-purple-300' :
                'bg-red-500/20 text-red-300'
            }`}>
            {studyPlan.status.charAt(0).toUpperCase() + studyPlan.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-white font-medium">{studyPlan.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${studyPlan.completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-white font-semibold">{studyPlan.progress?.problemsCompleted || 0}</div>
          <div className="text-gray-400 text-xs">Problems</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{studyPlan.progress?.topicsCompleted || 0}</div>
          <div className="text-gray-400 text-xs">Topics</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold flex items-center justify-center gap-1">
            <FaFire className="text-orange-400 text-sm" />
            {studyPlan.progress?.currentStreak || 0}
          </div>
          <div className="text-gray-400 text-xs">Streak</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{formatDaysRemaining()}</div>
          <div className="text-gray-400 text-xs">Remaining</div>
        </div>
      </div>

      {/* Study Schedule Info */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <FaClock className="text-blue-400" />
          <span>{studyPlan.timeAvailability?.hoursPerDay}h/day</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCalendarAlt className="text-green-400" />
          <span>{studyPlan.timeAvailability?.daysPerWeek} days/week</span>
        </div>
        <div className="flex items-center gap-1">
          <FaFlag className="text-purple-400" />
          <span>{studyPlan.goal?.timeline} days</span>
        </div>
      </div>

      {/* AI Insights Preview */}
      {studyPlan.aiInsights?.recommendedFocus && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-blue-300 text-sm font-medium">AI Recommendation</span>
          </div>
          <p className="text-blue-200 text-sm">{studyPlan.aiInsights.recommendedFocus}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {studyPlan.status === 'active' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
          >
            <FaPlay className="text-sm" />
            Continue
          </motion.button>
        )}

        {studyPlan.status === 'paused' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
          >
            <FaPlay className="text-sm" />
            Resume
          </motion.button>
        )}

        {studyPlan.status === 'completed' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
          >
            <FaTrophy className="text-sm" />
            View Results
          </motion.button>
        )}

        {studyPlan.status === 'active' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all"
          >
            <FaPause />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all"
        >
          <FaEdit />
        </motion.button>
      </div>

      {/* Quick Actions for Active Plan */}
      {isActive && studyPlan.status === 'active' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-700"
        >
          <div className="text-sm text-gray-400 mb-2">Today's Focus</div>
          <div className="flex gap-2">
            {studyPlan.topics?.slice(0, 3).map((topic, index) => (
              <span
                key={index}
                className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
              >
                {topic.name}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudyPlanCard;
