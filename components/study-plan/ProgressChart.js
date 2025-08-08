'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';

const {
  FaChartLine, FaCalendarAlt, FaClock, FaCode, FaTrophy,
  FaFire, FaBullseye, FaCheckCircle, FaArrowUp, FaArrowDown
} = FaIcons;

const ProgressChart = ({ studyPlan, timeRange = '7d' }) => {
  const [selectedMetric, setSelectedMetric] = useState('problems');
  const [viewType, setViewType] = useState('chart'); // chart, stats
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studyPlan?._id) {
      fetchProgressData();
    }
  }, [studyPlan, timeRange]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/study-plans/${studyPlan._id}/progress?range=${timeRange}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProgressData(data.progress || getDefaultProgressData());
      } else {
        console.error('Failed to fetch progress:', data.error);
        setProgressData(getDefaultProgressData());
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgressData(getDefaultProgressData());
    } finally {
      setLoading(false);
    }
  };

  // Default progress data when API is not available
  const getDefaultProgressData = () => ({
    problems: {
      label: 'Problems Solved',
      data: studyPlan?.progress?.dailyProgress?.slice(-7) || [0, 0, 0, 0, 0, 0, 0],
      total: studyPlan?.progress?.totalProblems || 0,
      target: studyPlan?.weeklyGoals?.problems || 35,
      trend: studyPlan?.progress?.weeklyTrend || 0,
      color: 'from-blue-500 to-cyan-500'
    },
    topics: {
      label: 'Topics Completed',
      data: studyPlan?.progress?.topicsDaily?.slice(-7) || [0, 0, 0, 0, 0, 0, 0],
      total: studyPlan?.progress?.completedTopics?.length || 0,
      target: studyPlan?.weeklyGoals?.topics || 12,
      trend: studyPlan?.progress?.topicsTrend || 0,
      color: 'from-green-500 to-emerald-500'
    },
    time: {
      label: 'Study Time (hours)',
      data: studyPlan?.progress?.dailyTimeSpent?.slice(-7) || [0, 0, 0, 0, 0, 0, 0],
      total: studyPlan?.progress?.totalTimeSpent || 0,
      target: studyPlan?.weeklyGoals?.studyTime || 21,
      trend: studyPlan?.progress?.timeTrend || 0,
      color: 'from-purple-500 to-pink-500'
    },
    streak: {
      label: 'Daily Streak',
      data: Array.from({ length: 7 }, (_, i) => studyPlan?.progress?.currentStreak >= i + 1 ? 1 : 0),
      total: studyPlan?.progress?.currentStreak || 0,
      target: studyPlan?.weeklyGoals?.streak || 30,
      trend: studyPlan?.progress?.streakTrend || 0,
      color: 'from-orange-500 to-red-500'
    }
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-400">Loading progress data...</span>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="text-center py-8">
          <FaChartLine className="text-4xl text-gray-500 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-xl mb-2">No Progress Data</h3>
          <p className="text-gray-400">Start completing tasks to see your progress.</p>
        </div>
      </div>
    );
  }

  const currentData = progressData[selectedMetric];
  const maxValue = Math.max(...currentData.data);
  const chartHeight = 120;

  const getBarHeight = (value) => {
    return maxValue > 0 ? (value / maxValue) * chartHeight : 0;
  };

  const metrics = [
    { key: 'problems', icon: FaCode, label: 'Problems' },
    { key: 'topics', icon: FaBullseye, label: 'Topics' },
    { key: 'time', icon: FaClock, label: 'Time' },
    { key: 'streak', icon: FaFire, label: 'Streak' }
  ];

  const achievements = [
    {
      title: 'Problem Solver',
      description: 'Solved 20+ problems',
      achieved: progressData.problems.total >= 20,
      icon: FaCode,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Consistent Learner',
      description: '7 day streak',
      achieved: progressData.streak.total >= 7,
      icon: FaFire,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Topic Master',
      description: 'Completed 5+ topics',
      achieved: progressData.topics.total >= 5,
      icon: FaBullseye,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Time Warrior',
      description: '10+ hours studied',
      achieved: progressData.time.total >= 10,
      icon: FaClock,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-xl flex items-center gap-2">
            <FaChartLine className="text-purple-400" />
            Progress Analytics
          </h3>
          <p className="text-gray-400 text-sm mt-1">Track your learning journey</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="chart">Chart View</option>
            <option value="stats">Stats View</option>
          </select>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {metrics.map(({ key, icon: Icon, label }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMetric(key)}
            className={`p-3 rounded-lg border transition-all ${selectedMetric === key
              ? 'border-purple-500/50 bg-purple-500/20 text-white'
              : 'border-gray-700/50 bg-gray-800/30 text-gray-400 hover:text-white hover:border-gray-600/50'
              }`}
          >
            <Icon className="text-lg mb-1 mx-auto" />
            <div className="text-xs">{label}</div>
          </motion.button>
        ))}
      </div>

      {viewType === 'chart' ? (
        <div>
          {/* Current Metric Overview */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">{currentData.label}</h4>
              <div className={`flex items-center gap-1 text-sm ${currentData.trend >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                {currentData.trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                {Math.abs(currentData.trend)}%
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">{currentData.total}</div>
                <div className="text-gray-400 text-sm">Current</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-300">{currentData.target}</div>
                <div className="text-gray-400 text-sm">Target</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round((currentData.total / currentData.target) * 100)}%
                </div>
                <div className="text-gray-400 text-sm">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`bg-gradient-to-r ${currentData.color} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((currentData.total / currentData.target) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">Last 7 Days</h4>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaCalendarAlt />
                Daily Progress
              </div>
            </div>

            <div className="relative">
              {/* Chart Area */}
              <div className="flex items-end justify-between gap-2 mb-3" style={{ height: chartHeight + 20 }}>
                {currentData.data.map((value, index) => {
                  const barHeight = getBarHeight(value);
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <motion.div
                        className={`bg-gradient-to-t ${currentData.color} rounded-t-md min-h-[4px] relative group cursor-pointer`}
                        initial={{ height: 0 }}
                        animate={{ height: barHeight }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{ width: '100%' }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {value} {currentData.label.toLowerCase()}
                        </div>
                      </motion.div>
                      <div className="text-gray-400 text-xs mt-2">{weekDays[index]}</div>
                    </div>
                  );
                })}
              </div>

              {/* Average Line */}
              <div className="absolute left-0 right-0 border-t border-dashed border-gray-600"
                style={{ bottom: getBarHeight(currentData.total / 7) + 20 }}>
                <span className="absolute -right-12 -top-3 text-xs text-gray-400 bg-gray-800 px-1">
                  Avg
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map(({ key, icon: Icon, label }) => {
              const data = progressData[key];
              return (
                <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${data.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="text-white text-sm" />
                  </div>
                  <div className="text-white font-semibold text-lg">{data.total}</div>
                  <div className="text-gray-400 text-sm">{label}</div>
                  <div className={`text-xs mt-1 flex items-center gap-1 ${data.trend >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {data.trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(data.trend)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievements */}
          <div>
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <FaTrophy className="text-yellow-400" />
              Recent Achievements
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-3 ${achievement.achieved
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-gray-700/50 bg-gray-800/30'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center ${!achievement.achieved && 'opacity-50'
                      }`}>
                      <achievement.icon className="text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${achievement.achieved ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.title}
                      </div>
                      <div className="text-gray-500 text-sm">{achievement.description}</div>
                    </div>
                    {achievement.achieved && (
                      <FaCheckCircle className="text-green-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">This Week's Summary</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Study Time</span>
                <span className="text-white font-medium">{progressData.time.total}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Problems Solved</span>
                <span className="text-white font-medium">{progressData.problems.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Topics Completed</span>
                <span className="text-white font-medium">{progressData.topics.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Streak</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <FaFire className="text-orange-400" />
                  {progressData.streak.total} days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
