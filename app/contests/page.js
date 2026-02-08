"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '../../contexts/ThemeContext';
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
  FaSearch,
  FaTimes,
  FaCrown,
  FaBolt,
  FaFlag,
  FaMedal
} from "react-icons/fa";
import ContestModes from '@/components/contests/ContestModes';
import RatingCard from '@/components/contests/RatingCard';
import ContestLeaderboard from '@/components/contests/ContestLeaderboard';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function ContestsPage() {
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [isMounted, setIsMounted] = useState(false);
  const [registeredContests, setRegisteredContests] = useState(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [realLeaderboardData, setRealLeaderboardData] = useState({ global: [], indian: [] });
  const [loading, setLoading] = useState(true);
  const [showContestModes, setShowContestModes] = useState(false);
  const [realtimeStats, setRealtimeStats] = useState({
    activeUsers: 0,
    liveContests: 0,
    totalPrizePool: 0
  });

  // WebSocket connection for real-time updates
  const { 
    connectionStatus, 
    lastMessage, 
    subscribeToStats, 
    unsubscribeFromStats 
  } = useWebSocket('ws://localhost:3001');

  // Handle hydration and update time every second for real-time timers
  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time countdown timer utility
  const getTimeRemaining = (startTime, endTime) => {
    // Return placeholder during SSR to prevent hydration mismatch
    if (!isMounted) {
      return 'Loading...';
    }
    
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    
    if (now < start) {
      // Contest hasn't started yet
      const timeToStart = start - now;
      const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeToStart % (1000 * 60)) / 1000);
      
      if (days > 0) return `Starts in ${days}d ${hours}h`;
      if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
      if (minutes > 0) return `Starts in ${minutes}m ${seconds}s`;
      return `Starts in ${seconds}s`;
    } else if (now >= start && now <= end) {
      // Contest is live
      const timeRemaining = end - now;
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      
      if (hours > 0) return `${hours}h ${minutes}m ${seconds}s left`;
      if (minutes > 0) return `${minutes}m ${seconds}s left`;
      return `${seconds}s left`;
    } else {
      // Contest has ended
      return 'Ended';
    }
  };

  const getContestStatus = (startTime, endTime) => {
    // During SSR, use the static status from contest data to prevent hydration mismatch
    if (!isMounted) {
      return 'upcoming'; // Default fallback during SSR
    }
    
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'ended';
  };

  // WebSocket real-time updates
  useEffect(() => {
    if (subscribeToStats) {
      subscribeToStats();
    }
    
    return () => {
      if (unsubscribeFromStats) {
        unsubscribeFromStats();
      }
    };
  }, [subscribeToStats, unsubscribeFromStats]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'stats-update':
          setRealtimeStats(prev => ({
            ...prev,
            ...lastMessage.stats
          }));
          break;
        case 'contest-update':
          // Handle contest-specific updates
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  // Fetch real leaderboard data and realtime stats
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leaderboard/real');
        if (response.ok) {
          const data = await response.json();
          setRealLeaderboardData(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Fall back to mock data if real data fails
        setRealLeaderboardData(mockLeaderboardData);
      } finally {
        setLoading(false);
      }
    };

    const fetchRealtimeStats = async () => {
      try {
        const response = await fetch('/api/stats/realtime');
        if (response.ok) {
          const data = await response.json();
          setRealtimeStats(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Error fetching realtime stats:', error);
        // Use mock data
        setRealtimeStats({
          activeUsers: Math.floor(Math.random() * 10000) + 15000,
          liveContests: contests.filter(c => c.status === 'live').length,
          totalPrizePool: contests.reduce((sum, c) => sum + parseInt(c.prize.replace(/\D/g, '')), 0)
        });
      }
    };

    fetchLeaderboardData();
    fetchRealtimeStats();
    
    // Refresh leaderboard every 5 minutes
    const leaderboardInterval = setInterval(fetchLeaderboardData, 300000);
    // Refresh stats every 30 seconds
    const statsInterval = setInterval(fetchRealtimeStats, 30000);
    
    return () => {
      clearInterval(leaderboardInterval);
      clearInterval(statsInterval);
    };
  }, []);

  // Mock leaderboard data as fallback
  const mockLeaderboardData = {
    global: [
      { rank: 1, username: "CodeMaster2024", score: 3247, country: "🇺🇸 USA", contests: 156, rating: 2834 },
      { rank: 2, username: "AlgoNinja", score: 3198, country: "🇨🇳 China", contests: 142, rating: 2798 },
      { rank: 3, username: "ByteWarrior", score: 3156, country: "🇷🇺 Russia", contests: 134, rating: 2756 },
      { rank: 4, username: "StackOverflow", score: 3089, country: "🇯🇵 Japan", contests: 128, rating: 2734 },
      { rank: 5, username: "RecursionKing", score: 3034, country: "🇰🇷 South Korea", contests: 125, rating: 2698 },
      { rank: 6, username: "BinarySearch", score: 2987, country: "🇩🇪 Germany", contests: 119, rating: 2676 },
      { rank: 7, username: "DynamicProg", score: 2934, country: "🇮🇳 India", contests: 117, rating: 2654 },
      { rank: 8, username: "GraphTraversal", score: 2889, country: "🇨🇦 Canada", contests: 112, rating: 2632 },
      { rank: 9, username: "TreeBuilder", score: 2845, country: "🇧🇷 Brazil", contests: 108, rating: 2598 },
      { rank: 10, username: "HashMaster", score: 2798, country: "🇦🇺 Australia", contests: 105, rating: 2576 }
    ],
    indian: [
      { rank: 1, username: "DynamicProg", score: 2934, city: "Bangalore", contests: 117, rating: 2654 },
      { rank: 2, username: "IndianCoder", score: 2756, city: "Mumbai", contests: 98, rating: 2543 },
      { rank: 3, username: "DelhiDev", score: 2689, city: "New Delhi", contests: 94, rating: 2498 },
      { rank: 4, username: "ChennaiChamp", score: 2634, city: "Chennai", contests: 89, rating: 2456 },
      { rank: 5, username: "HyderabadHero", score: 2578, city: "Hyderabad", contests: 85, rating: 2423 },
      { rank: 6, username: "PuneProdigy", score: 2523, city: "Pune", contests: 82, rating: 2389 },
      { rank: 7, username: "KolkataKing", score: 2467, city: "Kolkata", contests: 78, rating: 2356 },
      { rank: 8, username: "AhmedabadAce", score: 2423, city: "Ahmedabad", contests: 75, rating: 2334 },
      { rank: 9, username: "JaipurJedi", score: 2378, city: "Jaipur", contests: 72, rating: 2298 },
      { rank: 10, username: "LucknowLegend", score: 2334, city: "Lucknow", contests: 69, rating: 2276 }
    ]
  };

  // Safe date formatting helper
  const safeDateFormat = (date, options = {}) => {
    if (!isMounted) return '...';
    return date.toLocaleDateString(undefined, options);
  };

  const safeTimeFormat = (date) => {
    if (!isMounted) return '...';
    return date.toLocaleTimeString();
  };

  // Handle contest registration
  const handleRegister = async (contest) => {
    try {
      if (registeredContests.has(contest.id)) {
        setNotificationMessage(`You are already registered for ${contest.title}!`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
        return;
      }

      const response = await fetch('/api/contest/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contestId: contest.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisteredContests(prev => new Set([...prev, contest.id]));
        setNotificationMessage(`Successfully registered for ${contest.title}!`);
      } else {
        setNotificationMessage(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setNotificationMessage('Registration failed. Please try again.');
    }

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  // Handle leaderboard display
  const handleLeaderboard = async (type = 'global') => {
    setLeaderboardType(type);
    setShowLeaderboard(true);

    try {
      const response = await fetch(`/api/leaderboard/real?type=${type}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setRealLeaderboardData(prev => ({
          ...prev,
          [type]: data[type] || prev[type]
        }));
      }
    } catch (error) {
      console.error('Leaderboard error:', error);
    }
  };

  // Use real leaderboard data
  const leaderboardData = realLeaderboardData;

  // Notification component
  const NotificationPopup = () => (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3"
        >
          <FaCheckCircle className="text-xl" />
          <span className="font-semibold">{notificationMessage}</span>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Leaderboard Modal Component
  const LeaderboardModal = () => (
    <AnimatePresence>
      {showLeaderboard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLeaderboard(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="theme-surface rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaTrophy className="text-yellow-500" />
                  Leaderboard
                </h2>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="transition-colors" style={{ color: 'var(--text-secondary)' }}
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setLeaderboardType('global')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${leaderboardType === 'global'
                    ? 'bg-blue-500 text-white'
                    : 'theme-surface-elevated theme-text-secondary'
                    }`}
                >
                  <FaGlobe className="inline mr-1" /> Global Rankings
                </button>
                <button
                  onClick={() => setLeaderboardType('indian')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${leaderboardType === 'indian'
                    ? 'bg-orange-500 text-white'
                    : 'theme-surface-elevated theme-text-secondary'
                    }`}
                >
                  <FaFlag className="inline mr-1" /> Indian Rankings
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Rank</th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>User</th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Score</th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {leaderboardType === 'global' ? 'Country' : 'City'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Contests</th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData[leaderboardType].map((user, index) => (
                      <motion.tr
                        key={user.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:opacity-80 transition-colors" style={{ borderColor: 'var(--border-primary)' }}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {user.rank <= 3 && (
                              <span className={`text-lg font-bold ${user.rank === 1 ? 'text-yellow-500' : user.rank === 2 ? 'text-gray-400' : 'text-amber-600'}`}>
                                <FaMedal />
                              </span>
                            )}
                            <span className="font-bold" style={{ color: user.rank <= 3 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                              #{user.rank}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {user.username}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-blue-400">
                            {isMounted ? user.score.toLocaleString() : '...'}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div style={{ color: 'var(--text-secondary)' }}>
                            {leaderboardType === 'global' ? user.country : user.city}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div style={{ color: 'var(--text-secondary)' }}>
                            {user.contests}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`font-semibold px-2 py-1 rounded text-sm ${user.rating >= 2500 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            user.rating >= 2000 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              user.rating >= 1500 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                            {user.rating}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mock contest data - with force recompile
  // Static contest data for SSR to prevent hydration mismatches
  const getStaticContests = () => {
    return [
      {
        id: 1,
        title: "Weekly Contest 380",
        type: "weekly",
        status: "upcoming",
        startTime: new Date('2025-08-07T18:00:00Z'), // Fixed time for SSR
        duration: 90,
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
        startTime: new Date('2025-08-07T16:30:00Z'),
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
        startTime: new Date('2025-08-08T14:00:00Z'),
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
        startTime: new Date('2025-08-06T12:00:00Z'),
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
        startTime: new Date('2025-08-10T16:00:00Z'),
        duration: 180,
        participants: 25000,
        problems: 4,
        difficulty: "Expert",
        prize: "$15000",
        rating: "1800-3000",
        host: "Google"
      },
      {
        id: 6,
        title: "AtCoder Beginner Contest",
        type: "weekly",
        status: "upcoming",
        startTime: new Date('2025-08-14T13:00:00Z'),
        duration: 100,
        participants: 7200,
        problems: 6,
        difficulty: "Easy",
        prize: "$300",
        rating: "800-1600",
        host: "AtCoder"
      }
    ];
  };

  // Dynamic contest data for client-side updates
  const generateDynamicContests = () => {
    if (!isMounted) return getStaticContests();
    
    const now = new Date();
    const baseContests = getStaticContests();
    
    // Add random upcoming contests for the calendar (only on client)
    for (let i = 0; i < 12; i++) {
      const randomDays = Math.floor(Math.random() * 30) + 1;
      const startTime = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000);
      const duration = [60, 90, 120, 150, 180][Math.floor(Math.random() * 5)];
      
      baseContests.push({
        id: 10 + i,
        title: [
          "Data Structure Sprint",
          "Algorithm Olympics", 
          "Competitive Programming Cup",
          "Code Optimization Challenge",
          "Problem Solving Marathon",
          "Advanced DS Challenge",
          "Mathematical Programming",
          "Greedy Algorithm Battle",
          "Tree Traversal Masters",
          "Hash Table Heroes",
          "Dynamic Programming Duel",
          "Graph Theory Challenge"
        ][i],
        type: ["weekly", "biweekly", "monthly", "special"][Math.floor(Math.random() * 4)],
        status: "upcoming",
        startTime,
        duration,
        participants: Math.floor(Math.random() * 10000) + 1000,
        problems: Math.floor(Math.random() * 4) + 3,
        difficulty: ["Easy", "Medium", "Hard", "Expert"][Math.floor(Math.random() * 4)],
        prize: `$${(Math.floor(Math.random() * 10) + 1) * 500}`,
        rating: "1200-2400",
        host: ["CodeGamy", "LeetCode", "CodeChef", "Codeforces"][Math.floor(Math.random() * 4)]
      });
    }

    return baseContests;
  };

  const contests = generateDynamicContests();

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

  // Enhanced calendar functionality with better contest detection
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getContestsForDate = (date) => {
    return contests.filter(contest => {
      const contestDate = new Date(contest.startTime);
      return contestDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendar = () => {
    if (!isMounted) {
      // Return placeholder calendar structure during SSR
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      // Empty cells for days before month starts
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-8 lg:h-10"></div>);
      }

      // Days of the month (without date string comparisons)
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(
          <div key={day} className="h-8 lg:h-10 flex items-center justify-center text-xs lg:text-sm cursor-pointer rounded-lg transition-all hover:bg-blue-500/20 theme-text-secondary">
            {day}
          </div>
        );
      }

      return days;
    }

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 lg:h-10"></div>);
    }

    // Days of the month with enhanced styling
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const contestsForDay = getContestsForDate(dayDate);
      const isToday = dayDate.toDateString() === today.toDateString();
      const isPast = dayDate < today && !isToday;
      
      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`h-8 lg:h-10 flex flex-col items-center justify-center text-xs lg:text-sm cursor-pointer rounded-lg transition-all relative group
            ${isToday 
              ? 'bg-blue-600 text-white font-bold shadow-lg' 
              : isPast 
                ? 'theme-accent/50 hover:theme-text-secondary' 
                : 'theme-text-secondary hover:bg-blue-500/20'
            }
            ${contestsForDay.length > 0 ? 'ring-2 ring-blue-400/50' : ''}
          `}
          title={contestsForDay.length > 0 ? `${contestsForDay.length} contest(s) on this day` : ''}
        >
          <span className={contestsForDay.length > 0 ? 'font-semibold' : ''}>{day}</span>
          {contestsForDay.length > 0 && (
            <div className="flex space-x-1 mt-0.5">
              {contestsForDay.slice(0, 3).map((contest, index) => (
                <div
                  key={contest.id}
                  className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full ${
                    contest.status === 'live' 
                      ? 'bg-green-400 animate-pulse' 
                      : contest.status === 'upcoming'
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                  }`}
                />
              ))}
              {contestsForDay.length > 3 && (
                <span className="text-xs theme-text-secondary">+{contestsForDay.length - 3}</span>
              )}
            </div>
          )}
          
          {/* Tooltip on hover */}
          {contestsForDay.length > 0 && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 theme-surface text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              {contestsForDay.map(contest => (
                <div key={contest.id} className="truncate max-w-32">
                  {contest.title}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold theme-text mb-4">
              Programming Contests
            </h1>
            <p className="theme-text-secondary text-lg md:text-xl max-w-3xl mx-auto">
              Compete with the best minds around the world • Live contests & Real-time updates
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm theme-text-secondary">
              <motion.div 
                className="flex items-center gap-2 theme-surface px-4 py-2 rounded-full border border theme-border"
                whileHover={{ scale: 1.05 }}
              >
                <FaClock className="theme-accent" />
                <span>{isMounted ? currentTime.toLocaleString() : '...'}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 theme-surface px-4 py-2 rounded-full border border theme-border"
                whileHover={{ scale: 1.05 }}
              >
                <FaUsers className="theme-accent" />
                <span>{isMounted ? realtimeStats.activeUsers.toLocaleString() : '...'} Active Users</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 theme-surface px-4 py-2 rounded-full border border theme-border"
                whileHover={{ scale: 1.05 }}
              >
                <FaFire className="theme-accent" />
                <span>{realtimeStats.liveContests} Live Contests</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Contest Modes Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-blue-600 rounded-3xl p-8 text-center text-white mb-6 border border theme-border shadow-2xl">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-4 flex flex-wrap items-center justify-center gap-3">
                  <FaCode className="text-orange-400" />
                  Real-Time Battle Modes
                  <FaCrown className="text-yellow-400" />
                </h2>
                <p className="text-lg md:text-xl theme-text-secondary mb-6 max-w-3xl mx-auto">
                  Challenge coders worldwide in epic real-time battles! Choose your arena and prove your coding supremacy.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <FaCode className="text-4xl text-orange-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">CodeDuel</h3>
                    <p className="theme-text-secondary text-sm mb-3">1v1 epic showdowns</p>
                    <div className="text-xs theme-text-secondary">30min • 1 Problem</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <FaUsers className="text-4xl text-blue-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">QuadRush</h3>
                    <p className="theme-text-secondary text-sm mb-3">4-player squad battles</p>
                    <div className="text-xs theme-text-secondary">45min • 2 Problems</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">CodeBattleground</h3>
                    <p className="theme-text-secondary text-sm mb-3">100-player code royale</p>
                    <div className="text-xs theme-text-secondary">60min • 3 Problems</div>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowContestModes(!showContestModes)}
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <FaBolt className="inline mr-2" />
                  {showContestModes ? 'Hide Battle Modes' : 'Enter Battle Arena'}
                </motion.button>
              </motion.div>
            </div>

            {/* Contest Modes Component */}
            <AnimatePresence>
              {showContestModes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden"
                >
                  <ContestModes />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Contest List */}
            <div className="xl:col-span-3 space-y-6">
              {/* Filter and Search */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="theme-surface backdrop-blur-sm rounded-xl p-6 shadow-lg border border theme-border"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <FaFilter className="theme-accent" />
                      <span className="theme-text-secondary font-medium">Filter:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'live', 'upcoming', 'completed'].map((filter) => (
                        <motion.button
                          key={filter}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedFilter(filter)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedFilter === filter
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                            : 'theme-surface-elevated/50 theme-text-secondary hover:bg-slate-600/50 border border theme-border'
                            }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="relative w-full md:w-auto">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-accent" />
                    <input
                      type="text"
                      placeholder="Search contests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full md:w-64 theme-surface-elevated/50 border border theme-border rounded-lg theme-text placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
                      className="theme-surface backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border theme-border hover:border theme-border"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1 w-full">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${getStatusColor(contest.status)}`}>
                              {getStatusIcon(contest.status)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold theme-text">
                                {contest.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm theme-text-secondary">
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
                            <div className="theme-surface-elevated/50 rounded-lg p-3 border border theme-border">
                              <div className="text-sm theme-text-secondary mb-1">Start Time</div>
                              <div className="font-semibold theme-text text-sm">
                                {safeDateFormat(contest.startTime)}
                              </div>
                              <div className="text-xs theme-text-secondary">
                                {safeTimeFormat(contest.startTime)}
                              </div>
                            </div>

                            <div className="theme-surface-elevated/50 rounded-lg p-3 border border theme-border">
                              <div className="text-sm theme-text-secondary mb-1">Duration</div>
                              <div className="font-semibold theme-text">
                                {Math.floor(contest.duration / 60)}h {contest.duration % 60}m
                              </div>
                            </div>

                            <div className="theme-surface-elevated/50 rounded-lg p-3 border border theme-border">
                              <div className="text-sm theme-text-secondary mb-1">Participants</div>
                              <div className="font-semibold theme-text">
                                {isMounted ? contest.participants.toLocaleString() : '...'}
                              </div>
                            </div>

                            <div className="theme-surface-elevated/50 rounded-lg p-3 border border theme-border">
                              <div className="text-sm theme-text-secondary mb-1">Prize Pool</div>
                              <div className="font-semibold text-green-400">
                                {contest.prize}
                              </div>
                            </div>
                          </div>

                          {/* Contest Status Display */}
                          {!isMounted ? (
                            // Static status during SSR
                            <>
                              {contest.status === 'upcoming' && (
                                <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-3 mb-4">
                                  <div className="flex items-center gap-2 text-blue-400">
                                    <FaClock />
                                    <span className="font-semibold">Contest Starting Soon</span>
                                  </div>
                                </div>
                              )}

                              {contest.status === 'live' && (
                                <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-3 mb-4">
                                  <div className="flex items-center gap-2 text-green-400">
                                    <FaFire />
                                    <span className="font-semibold">LIVE NOW!</span>
                                  </div>
                                </div>
                              )}

                              {contest.status === 'completed' && (
                                <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-3 mb-4">
                                  <div className="flex items-center gap-2 text-red-400">
                                    <FaTrophy />
                                    <span className="font-semibold">Contest Ended</span>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            // Dynamic status after hydration
                            <>
                              {getContestStatus(contest.startTime, new Date(new Date(contest.startTime).getTime() + contest.duration * 60000)) === 'upcoming' && (
                                <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-3 mb-4">
                                  <div className="flex items-center gap-2 text-blue-400">
                                    <FaClock className="animate-pulse" />
                                    <span className="font-semibold">
                                      {getTimeRemaining(contest.startTime, new Date(new Date(contest.startTime).getTime() + contest.duration * 60000))}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {getContestStatus(contest.startTime, new Date(new Date(contest.startTime).getTime() + contest.duration * 60000)) === 'live' && (
                                <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-3 mb-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-green-400">
                                      <FaFire className="animate-pulse" />
                                      <span className="font-semibold animate-pulse">LIVE NOW!</span>
                                    </div>
                                    <div className="text-green-300 font-mono text-sm">
                                      {getTimeRemaining(contest.startTime, new Date(new Date(contest.startTime).getTime() + contest.duration * 60000))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {getContestStatus(contest.startTime, new Date(new Date(contest.startTime).getTime() + contest.duration * 60000)) === 'ended' && (
                                <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-3 mb-4">
                                  <div className="flex items-center gap-2 text-red-400">
                                    <FaTrophy />
                                    <span className="font-semibold">Contest Ended - View Results</span>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 w-full lg:w-auto">
                          {contest.status === 'live' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Link
                                href={`/contests/${contest.id}/participate`}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl block"
                              >
                                <FaPlay className="inline mr-2" />
                                Join Contest
                              </Link>
                            </motion.div>
                          )}
                          {contest.status === 'upcoming' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRegister(contest)}
                              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg w-full ${registeredContests.has(contest.id)
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                              {registeredContests.has(contest.id) ? (
                                <>
                                  <FaCheckCircle className="inline mr-2" />
                                  Registered
                                </>
                              ) : (
                                <>
                                  <FaBell className="inline mr-2" />
                                  Register
                                </>
                              )}
                            </motion.button>
                          )}
                          
                          {contest.status === 'completed' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Link
                                href={`/contests/${contest.id}/results`}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl block"
                              >
                                <FaTrophy className="inline mr-2" />
                                View Results
                              </Link>
                            </motion.div>
                          )}
                          
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                              href={`/contests/${contest.id}`}
                              className="theme-surface-elevated/50 hover:bg-slate-600/50 theme-text-secondary px-6 py-2 rounded-lg text-center transition-all duration-300 border border theme-border hover:border theme-border block"
                            >
                              View Details
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rating Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <RatingCard />
              </motion.div>

              {/* Contest Leaderboard */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ContestLeaderboard />
              </motion.div>

              {/* Updates Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="theme-surface backdrop-blur-sm rounded-xl p-6 shadow-lg border border theme-border"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaBell className="theme-accent" />
                  <h3 className="text-lg font-bold theme-text">Live Updates</h3>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                  {updates.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                        update.urgent
                          ? 'bg-red-900/30 border-red-400/30 text-red-100'
                          : 'theme-surface-elevated/50 border theme-border theme-text-secondary'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm mb-1">
                          {update.title}
                        </div>
                        <div className="text-xs mb-2 opacity-90">
                          {update.message}
                        </div>
                        <div className="text-xs opacity-70">
                          {update.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Calendar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="theme-surface backdrop-blur-sm rounded-xl p-4 lg:p-6 shadow-lg border border theme-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="theme-accent" />
                    <h3 className="text-base lg:text-lg font-bold theme-text">Contest Calendar</h3>
                  </div>
                  <div className="flex items-center gap-1 lg:gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                      className="p-1 lg:p-2 hover:theme-surface-elevated/50 rounded-lg theme-text-secondary hover:theme-text transition-colors"
                    >
                      <FaChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
                    </motion.button>
                    <div className="font-semibold theme-text px-2 lg:px-3 text-sm lg:text-base min-w-[120px] text-center">
                      {safeDateFormat(currentDate, { month: 'long', year: 'numeric' })}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                      className="p-1 lg:p-2 hover:theme-surface-elevated/50 rounded-lg theme-text-secondary hover:theme-text transition-colors"
                    >
                      <FaChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="h-6 lg:h-8 flex items-center justify-center text-xs font-semibold theme-text-secondary">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-sm mb-4">
                  {renderCalendar()}
                </div>

                {/* Calendar Legend */}
                <div className="space-y-2 text-xs theme-text-secondary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Upcoming Contest</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded animate-pulse"></div>
                      <span>Live Contest</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-blue-400 rounded"></div>
                      <span>Contest Day</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats for current month */}
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
                  <div className="text-xs theme-text-secondary">
                    <div className="flex items-center justify-between">
                      <span>Contests this month:</span>
                      <span className="font-semibold theme-text">
                        {contests.filter(contest => {
                          const contestDate = new Date(contest.startTime);
                          return contestDate.getMonth() === currentDate.getMonth() && 
                                 contestDate.getFullYear() === currentDate.getFullYear();
                        }).length}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="theme-surface backdrop-blur-sm rounded-xl p-6 shadow-lg border border theme-border"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaTrophy className="theme-accent" />
                  <h3 className="text-lg font-bold theme-text">Live Stats</h3>
                </div>
                <div className="space-y-3">
                  <motion.div 
                    className="flex justify-between items-center p-2 rounded-lg theme-surface-elevated/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="theme-text-secondary">Live Contests</span>
                    <span className="font-bold text-green-400 text-lg">
                      {realtimeStats.liveContests}
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between items-center p-2 rounded-lg theme-surface-elevated/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="theme-text-secondary">Upcoming</span>
                    <span className="font-bold text-blue-400 text-lg">
                      {contests.filter(c => c.status === 'upcoming').length}
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between items-center p-2 rounded-lg theme-surface-elevated/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="theme-text-secondary">Total Prize Pool</span>
                    <span className="font-bold text-yellow-400 text-lg">
                      ${isMounted ? realtimeStats.totalPrizePool.toLocaleString() : '...'}
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between items-center p-2 rounded-lg theme-surface-elevated/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="theme-text-secondary">Active Users</span>
                    <span className="font-bold text-orange-400 text-lg">
                      {isMounted ? realtimeStats.activeUsers.toLocaleString() : '...'}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 theme-surface backdrop-blur-sm rounded-xl p-6 shadow-lg border border theme-border"
          >
            <h3 className="text-lg font-bold theme-text mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/problems"
                  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaCode className="text-xl" />
                  <div>
                    <div className="font-semibold">Practice Problems</div>
                    <div className="text-sm opacity-90">Sharpen your skills</div>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contests/create"
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaTrophy className="text-xl" />
                  <div>
                    <div className="font-semibold">Host Contest</div>
                    <div className="text-sm opacity-90">Create your own</div>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => handleLeaderboard('global')}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full text-left"
                >
                  <FaUsers className="text-xl" />
                  <div>
                    <div className="font-semibold">Leaderboard</div>
                    <div className="text-sm opacity-90">See top performers</div>
                  </div>
                </button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaStar className="text-xl" />
                  <div>
                    <div className="font-semibold">My Profile</div>
                    <div className="text-sm opacity-90">Track progress</div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Notification Popup */}
          <NotificationPopup />

          {/* Leaderboard Modal */}
          <LeaderboardModal />
        </div>
      </div>
    </div>
  );
}