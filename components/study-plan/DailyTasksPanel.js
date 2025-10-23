'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';
import toast from 'react-hot-toast';

const {
  FaCheckCircle, FaCircle, FaClock, FaFire, FaPlay, FaCheck,
  FaCode, FaBook, FaVideo, FaPencilAlt, FaLightbulb, FaStar,
  FaChevronDown, FaChevronUp, FaCalendarAlt, FaFlag, FaBullseye
} = FaIcons;

const DailyTasksPanel = ({ studyPlan, onTaskComplete, onTaskStart }) => {
  const [expandedTask, setExpandedTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [dailyTasks, setDailyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch daily tasks when component mounts or studyPlan changes
  useEffect(() => {
    if (studyPlan?._id) {
      fetchDailyTasks();
    }
  }, [studyPlan]);

  const fetchDailyTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/study-plans/${studyPlan._id}/tasks`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setDailyTasks(data.tasks || []);
      } else {
        console.error('Failed to fetch tasks:', data.error);
      }
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId, completed) => {
    try {
      setUpdating(true);

      const response = await fetch(`/api/study-plans/${studyPlan._id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          completed,
          timeSpent: 0 // You can track actual time spent
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setDailyTasks(data.tasks || []);

        // Call parent callback if provided
        if (onTaskComplete) {
          onTaskComplete(taskId, completed, data.progress);
        }

        // Show success message
        if (completed) {
          toast.success('Task completed! 🎉');
        }
      } else {
        throw new Error(data.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const getTaskIcon = (type) => {
    const icons = {
      'practice': FaCode,
      'theory': FaBook,
      'interview': FaVideo,
      'concept': FaLightbulb
    };
    return icons[type] || FaCode;
  };

  const getTaskColor = (type) => {
    const colors = {
      'practice': 'from-blue-500 to-cyan-500',
      'theory': 'from-green-500 to-emerald-500',
      'interview': 'from-purple-500 to-pink-500',
      'concept': 'from-yellow-500 to-orange-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'text-green-400',
      'Medium': 'text-yellow-400',
      'Hard': 'text-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-400',
      'medium': 'text-yellow-400',
      'low': 'text-green-400'
    };
    return colors[priority] || 'text-gray-400';
  };

  const filteredTasks = dailyTasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const completedCount = dailyTasks.filter(task => task.completed).length;
  const totalTime = dailyTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
  const completedTime = dailyTasks.filter(task => task.completed).reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-400">Loading daily tasks...</span>
        </div>
      </div>
    );
  }

  // No study plan state
  if (!studyPlan) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="text-center py-8">
          <FaCalendarAlt className="text-4xl text-gray-500 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-xl mb-2">No Study Plan</h3>
          <p className="text-gray-400">Create a study plan to see your daily tasks.</p>
        </div>
      </div>
    );
  }

  // No tasks state
  if (dailyTasks.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="text-center py-8">
          <FaCalendarAlt className="text-4xl text-gray-500 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-xl mb-2">No Tasks for Today</h3>
          <p className="text-gray-400">Your daily tasks will appear here once generated.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchDailyTasks}
            className="mt-4 bg-purple-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            Refresh Tasks
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-xl flex items-center gap-2">
            <FaCalendarAlt className="theme-accent" />
            Today's Tasks
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {completedCount} of {dailyTasks.length} completed • {completedTime}m of {totalTime}m
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FaBullseye className="text-blue-400 text-sm" />
            <span className="text-blue-300 text-sm">Progress</span>
          </div>
          <div className="text-white font-semibold">{Math.round((completedCount / dailyTasks.length) * 100)}%</div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FaClock className="text-green-400 text-sm" />
            <span className="text-green-300 text-sm">Time Spent</span>
          </div>
          <div className="text-white font-semibold">{completedTime}m</div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FaFire className="text-orange-400 text-sm" />
            <span className="text-orange-300 text-sm">Streak</span>
          </div>
          <div className="text-white font-semibold">{studyPlan?.progress?.currentStreak || 0}</div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.map((task, index) => {
            const TaskIcon = getTaskIcon(task.type);
            const isExpanded = expandedTask === task.id;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg transition-all duration-300 ${task.completed
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50'
                  }`}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Completion Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleTaskComplete(task._id || task.id, !task.completed)}
                      disabled={updating}
                      className={`text-xl transition-colors ${task.completed
                        ? 'text-green-400 hover:text-green-300'
                        : 'text-gray-500 hover:text-green-400'
                        } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {task.completed ? <FaCheckCircle /> : <FaCircle />}
                    </motion.button>

                    {/* Task Icon */}
                    <div className={`w-10 h-10 bg-gradient-to-r ${getTaskColor(task.type)} rounded-lg flex items-center justify-center`}>
                      <TaskIcon className="text-white text-sm" />
                    </div>

                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(task.difficulty)} bg-gray-700/50`}>
                          {task.difficulty}
                        </span>
                        <FaFlag className={`text-xs ${getPriorityColor(task.priority)}`} />
                      </div>
                      <p className="text-gray-400 text-sm">{task.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {task.estimatedTime}m
                        </span>
                        <span className="capitalize">{task.type}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {!task.completed && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onTaskStart?.(task.id)}
                          className="bg-purple-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-all"
                        >
                          <FaPlay className="text-xs" />
                          Start
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                        className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-700/50"
                      >
                        {/* AI Tip */}
                        {task.aiTip && (
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <FaLightbulb className="text-blue-400 text-sm" />
                              <span className="text-blue-300 text-sm font-medium">AI Tip</span>
                            </div>
                            <p className="text-blue-200 text-sm">{task.aiTip}</p>
                          </div>
                        )}

                        {/* Task Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Problems/Resources */}
                          {task.problems && (
                            <div>
                              <h5 className="text-white font-medium text-sm mb-2">Problems to Solve:</h5>
                              <ul className="space-y-1">
                                {task.problems.map((problem, idx) => (
                                  <li key={idx} className="text-gray-400 text-sm flex items-center gap-2">
                                    <FaCode className="text-xs text-blue-400" />
                                    {problem}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {task.resources && (
                            <div>
                              <h5 className="text-white font-medium text-sm mb-2">Resources:</h5>
                              <ul className="space-y-1">
                                {task.resources.map((resource, idx) => (
                                  <li key={idx} className="text-gray-400 text-sm flex items-center gap-2">
                                    <FaBook className="text-xs text-green-400" />
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {task.skills && (
                            <div>
                              <h5 className="text-white font-medium text-sm mb-2">Skills to Practice:</h5>
                              <ul className="space-y-1">
                                {task.skills.map((skill, idx) => (
                                  <li key={idx} className="text-gray-400 text-sm flex items-center gap-2">
                                    <FaStar className="text-xs theme-accent" />
                                    {skill}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {task.topics && (
                            <div>
                              <h5 className="text-white font-medium text-sm mb-2">Topics Covered:</h5>
                              <ul className="space-y-1">
                                {task.topics.map((topic, idx) => (
                                  <li key={idx} className="text-gray-400 text-sm flex items-center gap-2">
                                    <FaLightbulb className="text-xs text-yellow-400" />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      {completedCount === dailyTasks.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaCheck className="text-green-400" />
            <span className="text-green-300 font-medium">All tasks completed!</span>
          </div>
          <p className="text-green-200 text-sm mb-3">
            Great job! You've completed all tasks for today. Keep up the momentum!
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            View Tomorrow's Plan
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default DailyTasksPanel;
