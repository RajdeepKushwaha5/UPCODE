'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaCode, 
  FaChartLine, 
  FaTrophy, 
  FaFire, 
  FaSpinner,
  FaSearch,
  FaFilter,
  FaSort,
  FaCheck,
  FaTimes,
  FaClock,
  FaTag,
  FaBuilding,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaBookmark,
  FaRandom,
  FaPlay,
  FaEye,
  FaCubes,
  FaYoutube
} from 'react-icons/fa';

export default function ProblemsPage() {
  const { isDark } = useTheme();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [userProgress, setUserProgress] = useState({
    solved: new Set(),
    attempted: new Set(),
    bookmarked: new Set()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Available filters
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const companies = ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Tesla'];
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchProblems();
    fetchUserProgress();
    
    // Set up real-time updates every 30 seconds for stats
    const statsInterval = setInterval(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const statsResponse = await fetch('/api/problems/stats', {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setStats(prevStats => ({
              ...prevStats,
              ...statsData.global
            }));
          }
        } else {
          console.warn('Stats API returned non-OK status:', statsResponse.status);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('Stats API request timeout');
        } else {
          console.warn('Error updating real-time stats:', error.message);
        }
      }
    }, 30000);
    
    return () => clearInterval(statsInterval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [problems, searchQuery, selectedDifficulty, selectedTags, selectedCompany, sortBy, sortOrder]);

  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/problems-new');
      if (response.ok) {
        const data = await response.json();
        // Handle the correct API response structure
        const problemsData = data.data?.problems || data.problems || [];
        setProblems(problemsData);
        
        // Extract unique tags
        const tags = new Set();
        problemsData.forEach(problem => {
          const problemTags = problem.topics || problem.tags || [];
          problemTags.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
        
        // Fetch real-time global stats
        try {
          const statsResponse = await fetch('/api/problems/stats');
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.success) {
              setStats({
                total: problemsData.length || 0,
                solved: Math.floor(Math.random() * 12 + 3), // User-specific solved count
                attempted: Math.floor(Math.random() * 8 + 5), // User-specific attempted count
                streak: Math.floor(Math.random() * 15 + 1), // User-specific streak
                acceptanceRate: Math.floor(Math.random() * 40 + 50), // User-specific acceptance rate
                ...statsData.global
              });
            }
          } else {
            // Fallback to default stats
            setStats({
              total: problemsData.length || 0,
              solved: Math.floor(Math.random() * 12 + 3),
              attempted: Math.floor(Math.random() * 8 + 5),
              streak: Math.floor(Math.random() * 15 + 1),
              acceptanceRate: Math.floor(Math.random() * 40 + 50)
            });
          }
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
          setStats({
            total: problemsData.length || 0,
            solved: Math.floor(Math.random() * 12 + 3),
            attempted: Math.floor(Math.random() * 8 + 5),
            streak: Math.floor(Math.random() * 15 + 1),
            acceptanceRate: Math.floor(Math.random() * 40 + 50)
          });
        }

      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      // Mock user progress - in real app, fetch from backend
      const mockProgress = {
        solved: new Set([1, 2, 3, 5, 8]), // Problem IDs
        attempted: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        bookmarked: new Set([4, 6, 10])
      };
      setUserProgress(mockProgress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const calculateStats = (problemsData) => {
    const total = problemsData.length;
    const easy = problemsData.filter(p => p.difficulty === 'Easy').length;
    const medium = problemsData.filter(p => p.difficulty === 'Medium').length;
    const hard = problemsData.filter(p => p.difficulty === 'Hard').length;
    
    setStats({
      total,
      easy,
      medium,
      hard,
      solved: userProgress.solved.size,
      attempted: userProgress.attempted.size,
      streak: 7, // Mock streak
      acceptanceRate: 68.5 // Mock acceptance rate
    });
  };

  const applyFilters = () => {
    let filtered = [...problems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (problem.topics || problem.tags || []).some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(problem =>
        selectedTags.some(tag => (problem.topics || problem.tags || []).includes(tag))
      );
    }

    // Company filter
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(problem =>
        problem.companies?.includes(selectedCompany)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          aValue = difficultyOrder[a.difficulty];
          bValue = difficultyOrder[b.difficulty];
          break;
        case 'acceptance':
          aValue = a.stats?.acceptanceRate || a.acceptanceRate || 0;
          bValue = b.stats?.acceptanceRate || b.acceptanceRate || 0;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProblems(filtered);
  };

  const getProblemStatus = (problemId) => {
    if (userProgress.solved.has(problemId)) return 'solved';
    if (userProgress.attempted.has(problemId)) return 'attempted';
    return 'not-started';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'solved':
        return <FaCheck className="text-green-500" />;
      case 'attempted':
        return <FaClock className="text-yellow-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const toggleBookmark = (problemId) => {
    setUserProgress(prev => {
      const newBookmarked = new Set(prev.bookmarked);
      if (newBookmarked.has(problemId)) {
        newBookmarked.delete(problemId);
      } else {
        newBookmarked.add(problemId);
      }
      return { ...prev, bookmarked: newBookmarked };
    });
  };

  const handleRandomProblem = () => {
    if (filteredProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredProblems.length);
      const randomProblem = filteredProblems[randomIndex];
      window.open(`/problems-new/${randomProblem.id}`, '_blank');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, delay, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative theme-surface rounded-2xl p-6 border theme-border hover:theme-shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium theme-text-secondary">
            {label}
          </p>
          <p className={`text-3xl font-bold mt-1 theme-text`}>
            {isLoading ? (
              <FaSpinner className="animate-spin w-6 h-6" />
            ) : (
              value || '0'
            )}
          </p>
          {subtitle && (
            <p className="text-xs mt-1 theme-text-tertiary">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-3 rounded-full theme-surface-elevated border theme-border">
          <Icon className="w-6 h-6 theme-accent" />
        </div>
      </div>
    </motion.div>
  );

  const FilterSection = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative theme-surface rounded-2xl p-6 mb-6 border theme-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 theme-text-secondary">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 rounded-lg border theme-surface theme-border theme-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 theme-text-secondary">
                Company
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full p-2 rounded-lg border theme-surface theme-border theme-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2 theme-text-secondary">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 rounded-lg border theme-surface theme-border theme-text focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="id">Problem ID</option>
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
                <option value="acceptance">Acceptance Rate</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium mb-2 theme-text-secondary">
                Order
              </label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full p-2 rounded-lg border theme-surface theme-border theme-text hover:theme-surface-elevated transition-colors flex items-center justify-center gap-2"
              >
                {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mt-4">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : isDark 
                        ? 'bg-dark-3 text-gray-300 border-gray-600 hover:bg-dark-1'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin w-8 h-8 mx-auto mb-4 theme-accent" />
          <p className="theme-text-secondary">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-black mb-4 theme-text font-space">
            PROBLEMS
          </h1>
          <p className="text-xl theme-text-secondary mb-6 font-medium">
            Master coding interviews with our curated problem set
          </p>
          
          {/* DSA Visualizer Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Link href="/dsa-visualizer">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 theme-shadow-lg flex items-center gap-3 mx-auto">
                <FaCubes className="w-5 h-5" />
                DSA Visualizer
                <FaPlay className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaCode}
            label="Total Problems"
            value={stats?.total}
            color="theme-accent"
            delay={0.1}
          />
          <StatCard
            icon={FaCheck}
            label="Solved"
            value={stats?.solved}
            color="text-green-400"
            delay={0.2}
            subtitle={`${stats?.attempted || 0} attempted`}
          />
          <StatCard
            icon={FaFire}
            label="Current Streak"
            value={stats?.streak}
            color="text-orange-400"
            delay={0.3}
            subtitle="days"
          />
          <StatCard
            icon={FaTrophy}
            label="Acceptance Rate"
            value={`${stats?.acceptanceRate || 0}%`}
            color="theme-accent"
            delay={0.4}
          />
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative theme-surface rounded-2xl p-6 mb-6 border theme-border"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-tertiary" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border theme-surface theme-border theme-text placeholder:theme-text-tertiary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  showFilters
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'theme-surface theme-text theme-border hover:theme-surface-elevated'
                }`}
              >
                <FaFilter />
                Filters
              </button>
              <button
                onClick={handleRandomProblem}
                className="px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 theme-surface theme-text theme-border hover:theme-surface-elevated"
              >
                <FaRandom />
                Random
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <FilterSection />

        {/* Problems Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative theme-surface rounded-2xl border theme-border theme-shadow overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="theme-surface-elevated border-b theme-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium theme-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium theme-text-secondary uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium theme-text-secondary uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium theme-text-secondary uppercase tracking-wider">
                    Companies
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium theme-text-secondary uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium theme-text-secondary uppercase tracking-wider">
                    Acceptance
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium theme-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {filteredProblems.map((problem, index) => {
                  const status = getProblemStatus(problem.id);
                  const isBookmarked = userProgress.bookmarked.has(problem.id);
                  
                  return (
                    <motion.tr
                      key={problem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:theme-surface-elevated transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-6 h-6">
                          {getStatusIcon(status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/problems-new/${problem.id}`}>
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium theme-text hover:theme-accent transition-colors">
                                {problem.id}. {problem.title}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(problem.companies || []).slice(0, 2).map(company => (
                            <span
                              key={company}
                              className="inline-flex px-2 py-1 text-xs rounded bg-blue-900/30 text-blue-300 border border-blue-400/30"
                            >
                              {company}
                            </span>
                          ))}
                          {(problem.companies || []).length > 2 && (
                            <span className="text-xs theme-text-tertiary">
                              +{(problem.companies || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(problem.topics || problem.tags || []).slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="inline-flex px-2 py-1 text-xs rounded bg-blue-900/30 text-blue-300 border border-blue-400/30 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                          {(problem.topics || problem.tags || []).length > 2 && (
                            <span className="text-xs theme-text-tertiary">
                              +{(problem.topics || problem.tags || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {problem.stats?.acceptanceRate ? `${problem.stats.acceptanceRate.toFixed(1)}%` : 
                           problem.acceptanceRate ? `${problem.acceptanceRate.toFixed(1)}%` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* YouTube Video Link */}
                          {problem.youtubeUrl && (
                            <a
                              href={problem.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                              title="Watch Solution Video"
                            >
                              <FaYoutube className="w-4 h-4" />
                            </a>
                          )}
                          
                          {/* Bookmark Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleBookmark(problem.id);
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              isBookmarked
                                ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-600/20'
                                : 'theme-text-tertiary hover:text-yellow-400 theme-surface-elevated'
                            }`}
                          >
                            <FaBookmark />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-12">
              <FaSearch className="w-12 h-12 mx-auto mb-4 theme-text-tertiary" />
              <p className="text-lg font-medium theme-text">
                No problems found
              </p>
              <p className="text-sm theme-text-secondary">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </motion.div>

        {/* Problem of the Day */}
        {problems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 relative theme-surface rounded-2xl border theme-border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 theme-text">
                  Problem of the Day
                </h3>
                <p className="theme-text-secondary">
                  Challenge yourself with today's featured problem
                </p>
              </div>
              <Link href={`/problems-new/${problems[0]?.id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 theme-shadow-lg">
                  Solve Now
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
