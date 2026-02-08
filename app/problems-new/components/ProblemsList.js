'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FaSearch, 
  FaFilter, 
  FaCode, 
  FaBuilding, 
  FaCheckCircle,
  FaBookOpen,
  FaProjectDiagram,
  FaChevronDown,
  FaChevronUp,
  FaPlay,
  FaClock,
  FaUsers,
  FaFire,
  FaTrophy
} from 'react-icons/fa';
import { DIFFICULTY_COLORS, PROBLEM_CATEGORIES, COMPANIES } from '../utils/constants';

export default function ProblemsList() {
  const { isDark } = useTheme();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [expandedProblems, setExpandedProblems] = useState(new Set());
  const [userStats, setUserStats] = useState({
    solved: 0,
    streak: 0,
    totalSubmissions: 0
  });

  useEffect(() => {
    fetchProblems();
    fetchUserStats();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/problems-new');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.problems)) {
        setProblems(data.problems);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.stats || userStats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const toggleProblemExpansion = (problemId) => {
    setExpandedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const getDifficultyStyle = (difficulty) => {
    return DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.easy;
  };

  // Filter problems based on search criteria
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || problem.difficulty?.toLowerCase() === selectedDifficulty;
    const matchesCategory = !selectedCategory || 
                           (problem.tags && problem.tags.some(tag => 
                             tag.toLowerCase().includes(selectedCategory.toLowerCase())
                           ));
    const matchesCompany = !selectedCompany || 
                          (problem.companies && problem.companies.some(company => 
                            company.toLowerCase().includes(selectedCompany.toLowerCase())
                          ));
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesCompany;
  });

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-1' : 'bg-light-2'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-border mx-auto"></div>
            <div className="absolute inset-2 rounded-full bg-dark-1"></div>
            <FaCode className="absolute inset-0 m-auto text-3xl theme-accent animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-space">
            Loading Problems
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-2' : 'text-gray-1'} font-inter`}>
            Preparing your coding journey...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-dark-1' : 'bg-light-2'} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-8xl mb-4 animate-bounce">🚫</div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent font-space">
            Connection Error
          </h1>
          <p className={`${isDark ? 'text-gray-2' : 'text-gray-1'} mb-8 text-lg font-inter leading-relaxed`}>
            {error}
          </p>
          <button 
            onClick={fetchProblems}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg font-space"
          >
            🔄 TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-1' : 'bg-light-2'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-dark-2 border-purple-600/20' : 'bg-white border-light-4'} border-b sticky top-0 z-50 shadow-xl backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaCode className="text-3xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse" />
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-space">
                  Problems Hub
                </h1>
                <span className={`px-3 py-1 text-xs rounded-full font-mono ${isDark ? 'bg-dark-3 text-gray-2' : 'bg-light-3 text-gray-1'}`}>
                  {filteredProblems.length === problems.length 
                    ? `${problems.length} problems • Enhanced View`
                    : `${filteredProblems.length} of ${problems.length} problems • Filtered`
                  }
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* User Stats */}
              <div className="hidden md:flex items-center space-x-4">
                <div className={`flex items-center px-3 py-2 rounded-lg ${isDark ? 'bg-dark-3' : 'bg-light-3'}`}>
                  <FaCheckCircle className="text-green-400 mr-2" />
                  <span className={`text-sm font-medium ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                    {userStats.solved} Solved
                  </span>
                </div>
                <div className={`flex items-center px-3 py-2 rounded-lg ${isDark ? 'bg-dark-3' : 'bg-light-3'}`}>
                  <FaFire className="text-orange-400 mr-2" />
                  <span className={`text-sm font-medium ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                    {userStats.streak} Streak
                  </span>
                </div>
              </div>

              {/* DSA Visualizer Button */}
              <Link
                href="/dsa-visualizer"
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl ${isDark ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white' : 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white'} transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm group relative overflow-hidden`}
              >
                <FaProjectDiagram className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-bold text-sm font-space hidden sm:block">DSA VISUALIZER</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className={`${isDark ? 'bg-dark-2 border-purple-600/20' : 'bg-white border-light-4'} rounded-2xl border p-6 mb-8 shadow-xl backdrop-blur-sm`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-cyan-400' : 'text-purple-500'} text-sm`} />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-inter ${
                    isDark 
                      ? 'bg-dark-3 border-dark-4 text-light-1 placeholder-gray-2 focus:border-purple-400' 
                      : 'bg-light-2 border-light-4 text-dark-1 placeholder-gray-1 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-inter ${
                  isDark 
                    ? 'bg-dark-3 border-dark-4 text-light-1 focus:border-purple-400' 
                    : 'bg-light-2 border-light-4 text-dark-1 focus:border-blue-500'
                }`}
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-inter ${
                  isDark 
                    ? 'bg-dark-3 border-dark-4 text-light-1 focus:border-purple-400' 
                    : 'bg-light-2 border-light-4 text-dark-1 focus:border-blue-500'
                }`}
              >
                <option value="">All Categories</option>
                {PROBLEM_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-inter ${
                  isDark 
                    ? 'bg-dark-3 border-dark-4 text-light-1 focus:border-purple-400' 
                    : 'bg-light-2 border-light-4 text-dark-1 focus:border-blue-500'
                }`}
              >
                <option value="">All Companies</option>
                {COMPANIES.slice(0, 10).map(company => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="space-y-6">
          {filteredProblems.length === 0 ? (
            <div className={`text-center py-16 ${isDark ? 'text-gray-2' : 'text-gray-1'}`}>
              <FaFilter className="text-6xl mx-auto opacity-30 mb-6" />
              <h3 className="text-2xl font-bold mb-2">No problems found</h3>
              <p className="text-lg mb-4">
                {searchTerm || selectedDifficulty || selectedCategory || selectedCompany 
                  ? 'Try adjusting your filters or search terms.'
                  : 'Loading problems from the database...'}
              </p>
            </div>
          ) : (
            filteredProblems.map((problem, index) => {
              const difficultyStyle = getDifficultyStyle(problem.difficulty);
              const isExpanded = expandedProblems.has(problem._id);
              
              return (
                <motion.div
                  key={problem._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`${isDark ? 'bg-dark-2 border-purple-600/20 hover:border-purple-500/40' : 'bg-white border-light-4 hover:border-purple-400/60'} border-2 rounded-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm`}
                >
                  {/* Problem Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-4 mb-3">
                          <h3 className={`text-xl font-bold ${isDark ? 'text-light-1' : 'text-dark-1'} font-space`}>
                            {problem.title}
                          </h3>
                          
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border-2 backdrop-blur-sm ${difficultyStyle.bg} ${difficultyStyle.text} ${difficultyStyle.border}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${difficultyStyle.text.replace('text-', 'bg-')}`}></div>
                            {problem.difficulty?.toUpperCase()}
                          </span>

                          {problem.isPremium && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-full text-xs">
                              <FaTrophy className="text-xs" />
                              <span className="font-bold">PREMIUM</span>
                            </div>
                          )}
                        </div>

                        <p className={`${isDark ? 'text-gray-2' : 'text-gray-1'} mb-4 leading-relaxed font-inter`}>
                          {problem.description?.substring(0, 200) || 'Click to see the complete problem description, constraints, examples, and test cases.'}
                          {problem.description?.length > 200 && '...'}
                        </p>

                        {/* Tags and Companies */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {problem.tags && problem.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className={`px-3 py-1 text-sm rounded-full font-medium ${isDark ? 'bg-dark-3 text-cyan-400 border border-cyan-600/30' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'}`}>
                              <FaCode className="inline mr-1" />
                              {tag}
                            </span>
                          ))}

                          {problem.companies && problem.companies.length > 0 && (
                            <div className="flex items-center gap-2">
                              <FaBuilding className={`${isDark ? 'theme-accent' : 'text-purple-600'} text-sm`} />
                              {problem.companies.slice(0, 3).map((company, i) => (
                                <span key={i} className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                                  {company}
                                </span>
                              ))}
                              {problem.companies.length > 3 && (
                                <span className={`px-2 py-1 text-xs ${isDark ? 'text-gray-2' : 'text-gray-1'}`}>
                                  +{problem.companies.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Stats and Action Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
                              <span className={`${isDark ? 'text-gray-2' : 'text-gray-1'} font-medium`}>
                                {problem.acceptanceRate || 45}% Acceptance
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FaUsers className={`${isDark ? 'text-cyan-400' : 'text-purple-500'} text-sm`} />
                              <span className={`${isDark ? 'text-gray-2' : 'text-gray-1'} font-medium`}>
                                {problem.submissions?.toLocaleString() || '1.2K'} Submissions
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {/* Details Toggle */}
                            <button
                              onClick={() => toggleProblemExpansion(problem._id)}
                              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-xs sm:text-sm ${
                                isExpanded
                                  ? (isDark ? 'bg-blue-600 text-white' : 'bg-purple-500 text-white')
                                  : (isDark ? 'bg-dark-3 text-light-1 hover:bg-dark-4' : 'bg-light-3 text-dark-1 hover:bg-light-4')
                              }`}
                            >
                              <FaBookOpen className="text-xs" />
                              <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
                              {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                            </button>

                            {/* Solve Button */}
                            <Link 
                              href={`/problems-new/${problem._id}`}
                              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-xs sm:text-sm whitespace-nowrap"
                            >
                              <FaPlay className="inline mr-2" />
                              Solve Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`border-t ${isDark ? 'border-dark-4' : 'border-light-4'} pt-6 mt-6`}
                        >
                          {/* Problem Description */}
                          <div className="mb-6">
                            <h4 className={`text-lg font-bold ${isDark ? 'text-light-1' : 'text-dark-1'} mb-3`}>
                              Problem Description
                            </h4>
                            <div className={`${isDark ? 'bg-dark-3' : 'bg-light-2'} rounded-lg p-4`}>
                              <div 
                                className={`${isDark ? 'text-gray-2' : 'text-gray-1'} leading-relaxed prose prose-sm max-w-none`}
                                dangerouslySetInnerHTML={{ __html: problem.description || 'Complete problem description available in the solving environment.' }}
                              />
                            </div>
                          </div>

                          {/* Examples */}
                          {problem.examples && problem.examples.length > 0 && (
                            <div className="mb-6">
                              <h4 className={`text-lg font-bold ${isDark ? 'text-light-1' : 'text-dark-1'} mb-3`}>
                                Examples
                              </h4>
                              <div className="space-y-4">
                                {problem.examples.slice(0, 2).map((example, i) => (
                                  <div key={i} className={`${isDark ? 'bg-dark-3' : 'bg-light-2'} rounded-lg p-4`}>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h5 className={`font-bold ${isDark ? 'text-cyan-400' : 'text-purple-600'} mb-2`}>Input:</h5>
                                        <code className={`${isDark ? 'bg-dark-1 text-green-400' : 'bg-white text-green-600'} p-3 rounded block font-mono text-sm`}>
                                          {example.input}
                                        </code>
                                      </div>
                                      <div>
                                        <h5 className={`font-bold ${isDark ? 'text-cyan-400' : 'text-purple-600'} mb-2`}>Output:</h5>
                                        <code className={`${isDark ? 'bg-dark-1 text-blue-400' : 'bg-white text-blue-600'} p-3 rounded block font-mono text-sm`}>
                                          {example.output}
                                        </code>
                                      </div>
                                    </div>
                                    {example.explanation && (
                                      <div className="mt-4">
                                        <h5 className={`font-bold ${isDark ? 'text-yellow-400' : 'text-orange-600'} mb-2`}>Explanation:</h5>
                                        <p className={`${isDark ? 'text-gray-2' : 'text-gray-1'}`}>
                                          {example.explanation}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-600">
                            <Link 
                              href={`/problems-new/${problem._id}`}
                              className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg font-bold text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                              Start Solving This Problem
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
