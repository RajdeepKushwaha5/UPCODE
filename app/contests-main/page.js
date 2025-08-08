"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaTrophy,
  FaUsers,
  FaFire,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaStop,
  FaCheckCircle,
  FaStar,
  FaCode,
  FaGlobe,
  FaFilter,
  FaSearch
} from "react-icons/fa";

export default function ContestsPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration and update time every second
  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock contest data - in real app this would come from API
  const contests = [
    {
      id: 1,
      title: "Weekly Contest 380",
      type: "weekly",
      status: "upcoming",
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 90, // minutes
      participants: 15420,
      problems: 4,
      difficulty: "Medium",
      prize: "$500",
      rating: "1400-2100",
      host: "LeetCode"
    },
    {
      id: 2,
      title: "Biweekly Contest 120",
      type: "biweekly",
      status: "live",
      startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 mins ago
      duration: 120,
      participants: 8750,
      problems: 4,
      difficulty: "Hard",
      prize: "$1000",
      rating: "1600-2400",
      host: "LeetCode"
    },
    {
      id: 3,
      title: "CodeChef Starters 115",
      type: "monthly",
      status: "upcoming",
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      duration: 150,
      participants: 12300,
      problems: 6,
      difficulty: "Mixed",
      prize: "$2000",
      rating: "1200-2800",
      host: "CodeChef"
    },
    {
      id: 4,
      title: "Codeforces Round 915",
      type: "educational",
      status: "completed",
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      duration: 135,
      participants: 18500,
      problems: 5,
      difficulty: "Hard",
      prize: "$750",
      rating: "1500-2600",
      host: "Codeforces"
    },
    {
      id: 5,
      title: "Google Code Jam Qualifier",
      type: "special",
      status: "upcoming",
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      duration: 180,
      participants: 25000,
      problems: 4,
      difficulty: "Expert",
      prize: "$15000",
      rating: "2000+",
      host: "Google"
    }
  ];

  // Mock updates data
  const updates = [
    {
      id: 1,
      type: "announcement",
      title: "New Contest Format Introduced",
      message: "We're excited to announce our new interactive contest format with real-time collaboration!",
      time: "2 hours ago",
      urgent: false
    },
    {
      id: 2,
      type: "reminder",
      title: "Contest Starting Soon",
      message: "Biweekly Contest 120 starts in 30 minutes. Get ready!",
      time: "30 minutes ago",
      urgent: true
    },
    {
      id: 3,
      type: "result",
      title: "Contest Results Published",
      message: "Results for Educational Round 163 are now available. Check your ranking!",
      time: "1 day ago",
      urgent: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live': return <FaPlay className="text-white" />;
      case 'upcoming': return <FaClock className="text-white" />;
      case 'completed': return <FaCheckCircle className="text-white" />;
      default: return <FaClock className="text-white" />;
    }
  };

  const formatTimeUntil = (targetTime) => {
    if (!isMounted) return "...";

    const now = currentTime;
    const diff = targetTime - now;

    if (diff <= 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const filteredContests = contests.filter(contest => {
    const matchesFilter = selectedFilter === 'all' || contest.status === selectedFilter;
    const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.host.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calendar functionality
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const hasContest = contests.some(contest =>
        contest.startTime.toDateString() === dayDate.toDateString()
      );

      days.push(
        <div
          key={day}
          className={`p-2 text-center cursor-pointer rounded-lg transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30 ${hasContest ? 'bg-purple-200 dark:bg-purple-800 font-bold' : ''
            } ${dayDate.toDateString() === new Date().toDateString()
              ? 'border-2 border-purple-500'
              : ''
            }`}
        >
          {day}
          {hasContest && (
            <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1"></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Programming Contests
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Compete with the best minds around the world • Live contests & Real-time updates
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{isMounted ? currentTime.toLocaleString() : '...'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers />
              <span>{contests.reduce((acc, c) => acc + c.participants, 0).toLocaleString()} Active Users</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Contest List */}
          <div className="xl:col-span-3 space-y-6">
            {/* Filter and Search */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                  <FaFilter className="text-purple-500" />
                  <div className="flex gap-2">
                    {['all', 'live', 'upcoming', 'completed'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedFilter === filter
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                          }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contest Cards */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredContests.map((contest, index) => (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(contest.status)}`}>
                            {getStatusIcon(contest.status)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {contest.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <FaGlobe />
                                {contest.host}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaCode />
                                {contest.problems} Problems
                              </span>
                              <span className="flex items-center gap-1">
                                <FaStar />
                                {contest.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="text-sm text-gray-500 mb-1">Start Time</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {contest.startTime.toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {contest.startTime.toLocaleTimeString()}
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="text-sm text-gray-500 mb-1">Duration</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {Math.floor(contest.duration / 60)}h {contest.duration % 60}m
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="text-sm text-gray-500 mb-1">Participants</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {contest.participants.toLocaleString()}
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="text-sm text-gray-500 mb-1">Prize Pool</div>
                            <div className="font-semibold text-green-600">
                              {contest.prize}
                            </div>
                          </div>
                        </div>

                        {contest.status === 'upcoming' && (
                          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <FaClock />
                              <span className="font-semibold">
                                Starts in: {formatTimeUntil(contest.startTime)}
                              </span>
                            </div>
                          </div>
                        )}

                        {contest.status === 'live' && (
                          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <FaFire />
                              <span className="font-semibold animate-pulse">
                                LIVE NOW! Join the contest
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {contest.status === 'live' && (
                          <Link
                            href={`/contests/${contest.id}/participate`}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:scale-105 shadow-lg"
                          >
                            Join Contest
                          </Link>
                        )}
                        {contest.status === 'upcoming' && (
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                            Register
                          </button>
                        )}
                        {contest.status === 'completed' && (
                          <Link
                            href={`/contests/${contest.id}/results`}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:scale-105 shadow-lg"
                          >
                            View Results
                          </Link>
                        )}
                        <Link
                          href={`/contests/${contest.id}`}
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg text-center transition-all duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Updates Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaBell className="text-purple-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Live Updates</h3>
              </div>
              <div className="space-y-3">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className={`p-3 rounded-lg border-l-4 ${update.urgent
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      }`}
                  >
                    <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                      {update.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      {update.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      {update.time}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-500" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contest Calendar</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FaChevronLeft />
                  </button>
                  <div className="font-semibold text-gray-900 dark:text-white px-3">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-xs font-semibold text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-sm">
                {renderCalendar()}
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-200 dark:bg-purple-800 rounded"></div>
                  <span>Contest Day</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <FaTrophy className="text-purple-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Live Contests</span>
                  <span className="font-bold text-green-500">
                    {contests.filter(c => c.status === 'live').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Upcoming</span>
                  <span className="font-bold text-blue-500">
                    {contests.filter(c => c.status === 'upcoming').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Total Prize Pool</span>
                  <span className="font-bold text-purple-500">$19,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Active Users</span>
                  <span className="font-bold text-orange-500">
                    {contests.reduce((acc, c) => acc + c.participants, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/problems"
              className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <FaCode className="text-xl" />
              <div>
                <div className="font-semibold">Practice Problems</div>
                <div className="text-sm opacity-90">Sharpen your skills</div>
              </div>
            </Link>

            <Link
              href="/contests/create"
              className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <FaTrophy className="text-xl" />
              <div>
                <div className="font-semibold">Host Contest</div>
                <div className="text-sm opacity-90">Create your own</div>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <FaUsers className="text-xl" />
              <div>
                <div className="font-semibold">Leaderboard</div>
                <div className="text-sm opacity-90">See top performers</div>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <FaStar className="text-xl" />
              <div>
                <div className="font-semibold">My Profile</div>
                <div className="text-sm opacity-90">Track progress</div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
