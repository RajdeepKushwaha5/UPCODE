'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  FaPlus, FaRocket, FaTrophy, FaCalendarAlt, FaClock, FaFire,
  FaChartLine, FaStar, FaBrain, FaBullseye, FaPlay, FaPause,
  FaCheck, FaArrowRight, FaLightbulb, FaBook, FaVideo,
  FaCrown, FaLock, FaGraduationCap
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import StudyPlanCreator from '@/components/study-plan/StudyPlanCreator';
import StudyPlanCard from '@/components/study-plan/StudyPlanCard';
import DailyTasksPanel from '@/components/study-plan/DailyTasksPanel';
import ProgressChart from '@/components/study-plan/ProgressChart';
import AchievementBadge from '@/components/study-plan/AchievementBadge';

const StudyPlanDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [studyPlans, setStudyPlans] = useState([]);
  const [activeStudyPlan, setActiveStudyPlan] = useState(null);
  const [showCreator, setShowCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlans: 0,
    completedPlans: 0,
    currentStreak: 0,
    totalProblemsCompleted: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchStudyPlans();
  }, [session, status]);

  const fetchStudyPlans = async () => {
    try {
      const response = await fetch('/api/study-plans');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (data.success) {
        setStudyPlans(data.studyPlans || []);
        setActiveStudyPlan(data.activeStudyPlan || null);
        setStats(data.stats || {
          totalPlans: 0,
          completedPlans: 0,
          currentStreak: 0,
          totalProblemsCompleted: 0
        });
      } else {
        throw new Error(data.error || 'Failed to fetch study plans');
      }
    } catch (error) {
      console.error('Error fetching study plans:', error);
      toast.error('Failed to load study plans: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (planData) => {
    try {
      // Transform the data to match API expectations
      const apiData = {
        goal: planData.goal,
        timeAvailability: planData.timeAvailability,
        focusAreas: planData.focusAreas || [],
        customization: {
          aiPersonalization: planData.isPremium || false,
          adaptiveLearning: planData.isPremium || false,
          mentorship: false
        }
      };


      const response = await fetch('/api/study-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Study plan created successfully!');
        setShowCreator(false);
        fetchStudyPlans();
      } else {
        toast.error(data.error || 'Failed to create study plan');
      }
    } catch (error) {
      console.error('Error creating study plan:', error);
      toast.error('Failed to create study plan');
    }
  };

  const handleTaskComplete = async (taskId, completed, progressData) => {
    try {
      // Update progress in backend
      const response = await fetch(`/api/study-plans/${activeStudyPlan._id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete_task',
          taskId: taskId,
          completed: completed
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state with new progress data
        if (progressData) {
          setActiveStudyPlan(prev => ({
            ...prev,
            progress: progressData
          }));
        }

        // Refresh study plans to get updated data
        await fetchStudyPlans();

        toast.success(completed ? 'Task completed! 🎉' : 'Task marked as pending');
      } else {
        throw new Error(data.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleTaskStart = async (taskId) => {
    try {
      // Track task start time or trigger any start actions
      const response = await fetch(`/api/study-plans/${activeStudyPlan._id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start_task',
          taskId: taskId,
          startTime: new Date()
        }),
      });

      if (response.ok) {
        toast.success('Task started! Good luck! 💪');
      }
    } catch (error) {
      console.error('Error starting task:', error);
      // Don't show error toast for non-critical action
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Loading your study plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <FaBrain className="theme-accent" />
                AI Study Plans
              </h1>
              <p className="text-gray-300 mt-2">
                Personalized learning paths powered by AI to accelerate your coding journey
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreator(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg"
            >
              <FaPlus />
              Create New Plan
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Plans</p>
                <p className="text-2xl font-bold text-white">{stats.totalPlans}</p>
              </div>
              <FaGraduationCap className="theme-accent text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completedPlans}</p>
              </div>
              <FaTrophy className="text-green-400 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
              </div>
              <FaFire className="text-orange-400 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Problems Solved</p>
                <p className="text-2xl font-bold text-white">{stats.totalProblemsCompleted}</p>
              </div>
              <FaChartLine className="text-blue-400 text-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        {studyPlans.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBrain className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Start Your AI-Powered Learning Journey
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Create your first personalized study plan and let our AI guide you through
                a customized path to achieve your coding goals.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreator(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto transition-all duration-300 shadow-lg"
              >
                <FaRocket />
                Create Your First Study Plan
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // Study Plans Grid
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Plan & Daily Tasks */}
            <div className="lg:col-span-2 space-y-6">
              {activeStudyPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <FaBullseye className="theme-accent" />
                    Active Study Plan
                  </h2>
                  <StudyPlanCard
                    studyPlan={activeStudyPlan}
                    isActive={true}
                    onUpdate={fetchStudyPlans}
                  />
                </motion.div>
              )}

              {activeStudyPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <DailyTasksPanel
                    studyPlan={activeStudyPlan}
                    onTaskComplete={handleTaskComplete}
                    onTaskStart={handleTaskStart}
                    onUpdate={fetchStudyPlans}
                  />
                </motion.div>
              )}

              {/* All Study Plans */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FaBook className="text-blue-400" />
                  All Study Plans
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {studyPlans.map((plan, index) => (
                    <motion.div
                      key={plan._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <StudyPlanCard
                        studyPlan={plan}
                        isActive={plan._id === activeStudyPlan?._id}
                        onUpdate={fetchStudyPlans}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Chart */}
              {activeStudyPlan && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ProgressChart studyPlan={activeStudyPlan} />
                </motion.div>
              )}

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaTrophy className="text-yellow-400" />
                  Recent Achievements
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Sample achievements for demo */}
                  <AchievementBadge
                    achievement={{
                      title: 'First Steps',
                      description: 'Complete your first study session',
                      icon: 'target',
                      rarity: 'common',
                      unlockedAt: new Date(),
                      currentProgress: 1,
                      requirement: 1,
                      reward: '+50 XP'
                    }}
                    size="md"
                  />
                  <AchievementBadge
                    achievement={{
                      title: 'Problem Solver',
                      description: 'Solve 10 coding problems',
                      icon: 'code',
                      rarity: 'rare',
                      unlockedAt: null,
                      currentProgress: 7,
                      requirement: 10,
                      reward: 'Problem Solver Badge'
                    }}
                    size="md"
                  />
                  <AchievementBadge
                    achievement={{
                      title: 'Streak Master',
                      description: 'Maintain a 7-day study streak',
                      icon: 'fire',
                      rarity: 'epic',
                      unlockedAt: null,
                      currentProgress: 3,
                      requirement: 7,
                      reward: 'Streak Master Title'
                    }}
                    size="md"
                  />
                </div>
              </motion.div>

              {/* AI Insights */}
              {activeStudyPlan?.aiInsights && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaLightbulb className="text-yellow-400" />
                    AI Insights
                  </h3>
                  <div className="space-y-3">
                    {activeStudyPlan.aiInsights.recommendedFocus && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-blue-300 text-sm">
                          <strong>Focus Area:</strong> {activeStudyPlan.aiInsights.recommendedFocus}
                        </p>
                      </div>
                    )}
                    {activeStudyPlan.aiInsights.strongAreas?.length > 0 && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-green-300 text-sm">
                          <strong>Strong Areas:</strong> {activeStudyPlan.aiInsights.strongAreas.join(', ')}
                        </p>
                      </div>
                    )}
                    {activeStudyPlan.aiInsights.weakAreas?.length > 0 && (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                        <p className="text-orange-300 text-sm">
                          <strong>Needs Improvement:</strong> {activeStudyPlan.aiInsights.weakAreas.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Study Plan Creator Modal */}
      <AnimatePresence>
        {showCreator && (
          <StudyPlanCreator
            onClose={() => setShowCreator(false)}
            onSubmit={handleCreatePlan}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyPlanDashboard;
