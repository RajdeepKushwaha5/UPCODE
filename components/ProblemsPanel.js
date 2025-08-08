'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getMockProblems, getDifficultyColor, getDifficultyBg, getCompanyColor, toggleBookmark, toggleLike } from '../lib/problemsApi';
import AIProblemsGenerator from './AIProblemsGenerator';
import {
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaFilter,
  FaSearch,
  FaSort,
  FaCode,
  FaFire,
  FaStar,
  FaBookmark,
  FaHeart,
  FaShare,
  FaBuilding,
  FaCrown,
  FaRegBookmark,
  FaRegHeart,
  FaRobot
} from 'react-icons/fa';

const ProblemRow = ({ problem, index, onProblemClick, onBookmarkToggle, onLikeToggle }) => {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(problem.bookmarked || false);
  const [isLiked, setIsLiked] = useState(problem.liked || false);
  const [loading, setLoading] = useState(false);

  const getDifficultyIcon = (difficulty) => {
    const baseStyle = "w-2 h-2 rounded-full flex-shrink-0";
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return `${baseStyle} bg-green-500`;
      case 'medium':
        return `${baseStyle} bg-yellow-500`;
      case 'hard':
        return `${baseStyle} bg-red-500`;
      default:
        return `${baseStyle} bg-gray-500`;
    }
  };

  const getProgressBar = (acceptance_rate) => {
    const rate = parseFloat(acceptance_rate?.replace('%', '') || 0);
    const width = Math.min(rate, 100);

    let colorClass = 'bg-red-500';
    if (rate >= 60) colorClass = 'bg-green-500';
    else if (rate >= 40) colorClass = 'bg-yellow-500';

    return (
      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
    );
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    if (!session) {
      alert('Please login to bookmark problems');
      return;
    }

    setLoading(true);
    try {
      const result = await toggleBookmark(problem.id);
      if (result.success) {
        setIsBookmarked(!isBookmarked);
        onBookmarkToggle?.(problem.id);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!session) {
      alert('Please login to like problems');
      return;
    }

    setLoading(true);
    try {
      const result = await toggleLike(problem.id);
      if (result.success) {
        setIsLiked(!isLiked);
        onLikeToggle?.(problem.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/problems/${problem.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Problem link copied to clipboard!');
    });
  };

  return (
    <div
      className="flex items-center p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-700/50 group cursor-pointer"
      onClick={() => onProblemClick(problem)}
    >
      {/* Problem Number */}
      <div className="w-8 sm:w-12 text-gray-400 text-sm font-mono flex-shrink-0">
        {index + 1}.
      </div>

      {/* Problem Title and Tags */}
      <div className="flex-1 min-w-0 mr-3 sm:mr-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors truncate">
            {problem.title}
          </h3>
          {problem.premium && (
            <FaCrown className="text-yellow-500 text-xs flex-shrink-0" title="Premium Problem" />
          )}
        </div>

        {/* Tags */}
        {problem.tags && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {problem.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {problem.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{problem.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Company Tags */}
        {problem.companies && problem.companies.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            <FaBuilding className="text-gray-500 text-xs mt-1" />
            {problem.companies.slice(0, 3).map((company, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded font-medium ${getCompanyColor(company)}`}
              >
                {company}
              </span>
            ))}
            {problem.companies.length > 3 && (
              <span className="text-xs text-gray-500 py-0.5">+{problem.companies.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Acceptance Rate - Hidden on small screens */}
      <div className="hidden sm:block w-16 lg:w-20 text-right mr-4 lg:mr-6">
        <div className="text-gray-300 text-sm mb-1">
          {problem.acceptance_rate}
        </div>
        {getProgressBar(problem.acceptance_rate)}
      </div>

      {/* Difficulty */}
      <div className="w-12 sm:w-16 mr-3 sm:mr-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className={getDifficultyIcon(problem.difficulty)} />
          <span className={`text-xs sm:text-sm font-medium ${getDifficultyColor(problem.difficulty)} hidden sm:inline`}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          disabled={loading}
          className={`p-1.5 rounded transition-colors ${isLiked
            ? 'text-red-500 hover:text-red-400'
            : 'text-gray-400 hover:text-red-500'
            }`}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          disabled={loading}
          className={`p-1.5 rounded transition-colors ${isBookmarked
            ? 'text-blue-500 hover:text-blue-400'
            : 'text-gray-400 hover:text-blue-500'
            }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
        >
          {isBookmarked ? <FaBookmark className="text-sm" /> : <FaRegBookmark className="text-sm" />}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShareClick}
          className="p-1.5 rounded text-gray-400 hover:text-green-500 transition-colors"
          title="Share Problem"
        >
          <FaShare className="text-sm" />
        </button>
      </div>

      {/* Status Indicators - Simplified on small screens */}
      <div className="w-8 sm:w-16 flex justify-center ml-2">
        <div className="flex gap-0.5 sm:gap-1">
          <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-600 rounded-sm" />
          <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-600 rounded-sm" />
          <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-600 rounded-sm hidden sm:block" />
          <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-600 rounded-sm hidden sm:block" />
          <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-600 rounded-sm hidden lg:block" />
          <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-600 rounded-sm hidden lg:block" />
        </div>
      </div>
    </div>
  );
};

const FilterBar = ({ filters, setFilters, problemCount, onGenerateProblem, generating }) => {
  const topCompanies = ['Amazon', 'Google', 'Microsoft', 'Facebook', 'Apple', 'Netflix', 'Uber', 'LinkedIn'];
  const topTags = ['Array', 'String', 'Dynamic Programming', 'Tree', 'Graph', 'Binary Search', 'Hash Table', 'Math'];

  return (
    <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
      {/* Top Row - Main Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Problem Source */}
        <select
          value={filters.source}
          onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
        >
          <option value="mock">Mock Problems</option>
          <option value="gemini">🤖 AI Generated</option>
          <option value="leetcode">LeetCode</option>
          <option value="codeforces">Codeforces</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Topic Filter */}
        <select
          value={filters.topic}
          onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
        >
          <option value="">All Topics</option>
          {topTags.map(tag => (
            <option key={tag} value={tag.toLowerCase().replace(' ', '-')}>{tag}</option>
          ))}
        </select>

        {/* Company Filter */}
        <select
          value={filters.company}
          onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
        >
          <option value="">All Companies</option>
          {topCompanies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="solved">Solved</option>
          <option value="attempted">Attempted</option>
          <option value="bookmarked">Bookmarked</option>
          <option value="liked">Liked</option>
        </select>
      </div>

      {/* Bottom Row - Search and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search problems..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="bg-gray-700 text-white px-3 py-1.5 pl-8 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <FaSearch className="w-3 h-3 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
          >
            <option value="default">Default</option>
            <option value="title">Title</option>
            <option value="difficulty">Difficulty</option>
            <option value="acceptance">Acceptance Rate</option>
            <option value="frequency">Frequency</option>
          </select>

          {/* Generate AI Problem Button */}
          <button
            onClick={onGenerateProblem}
            disabled={generating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400 disabled:to-blue-400 text-white px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 whitespace-nowrap font-medium"
          >
            <FaRobot className="w-4 h-4" />
            {generating ? 'Generating...' : 'AI Problem'}
          </button>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({
              source: 'mock',
              difficulty: '',
              topic: '',
              company: '',
              status: '',
              search: '',
              sortBy: 'default'
            })}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <FaFilter className="w-3 h-3" />
            Clear
          </button>
        </div>

        {/* Problem Count */}
        <div className="text-gray-400 text-sm whitespace-nowrap">
          {problemCount} problems
        </div>
      </div>
    </div>
  );
};

const ProblemModal = ({ problem, isOpen, onClose }) => {
  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">{problem.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs ${getDifficultyBg(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="text-gray-400 text-sm">{problem.acceptance_rate}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">
              {problem.description || 'Problem description will be loaded here...'}
            </p>

            {problem.examples && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Examples:</h3>
                {problem.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-900 p-4 rounded mb-4">
                    <div className="mb-2">
                      <strong className="text-gray-300">Input:</strong>
                      <code className="ml-2 text-blue-400">{example.input}</code>
                    </div>
                    <div className="mb-2">
                      <strong className="text-gray-300">Output:</strong>
                      <code className="ml-2 text-green-400">{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div>
                        <strong className="text-gray-300">Explanation:</strong>
                        <span className="ml-2 text-gray-400">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {problem.constraints && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Constraints:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {problem.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}

            {problem.tags && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
              Solve Problem
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              View Solutions
            </button>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProblemsPanel({ onStatsUpdate }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [filters, setFilters] = useState({
    source: 'mock',
    difficulty: '',
    topic: '',
    company: '',
    status: '',
    search: '',
    sortBy: 'default'
  });

  useEffect(() => {
    loadProblems();
  }, [filters.source]);

  useEffect(() => {
    filterProblems();
  }, [problems, filters]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/problems?source=${filters.source}&difficulty=${filters.difficulty}&topic=${filters.topic}`);
      const data = await response.json();

      if (data.success) {
        setProblems(data.problems);
      } else {
        setProblems(getMockProblems());
      }
    } catch (error) {
      console.error('Error loading problems:', error);
      setProblems(getMockProblems());
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = [...problems];

    // Filter by difficulty
    if (filters.difficulty) {
      filtered = filtered.filter(problem =>
        problem.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    // Filter by company
    if (filters.company) {
      filtered = filtered.filter(problem =>
        problem.companies?.some(company =>
          company.toLowerCase().includes(filters.company.toLowerCase())
        )
      );
    }

    // Filter by topic/tags
    if (filters.topic) {
      const topicFilter = filters.topic.toLowerCase().replace('-', ' ');
      filtered = filtered.filter(problem =>
        problem.tags?.some(tag =>
          tag.toLowerCase().includes(topicFilter)
        )
      );
    }

    // Filter by status
    if (filters.status) {
      switch (filters.status) {
        case 'bookmarked':
          filtered = filtered.filter(problem => problem.bookmarked);
          break;
        case 'liked':
          filtered = filtered.filter(problem => problem.liked);
          break;
        case 'solved':
          filtered = filtered.filter(problem => problem.solved);
          break;
        case 'attempted':
          filtered = filtered.filter(problem => problem.attempted);
          break;
      }
    }

    // Filter by search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(problem =>
        problem.title?.toLowerCase().includes(searchTerm) ||
        problem.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        problem.companies?.some(company => company.toLowerCase().includes(searchTerm))
      );
    }

    // Sort problems
    if (filters.sortBy !== 'default') {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'difficulty':
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            return difficultyOrder[a.difficulty?.toLowerCase()] - difficultyOrder[b.difficulty?.toLowerCase()];
          case 'acceptance':
            return parseFloat(b.acceptance_rate?.replace('%', '') || 0) - parseFloat(a.acceptance_rate?.replace('%', '') || 0);
          case 'frequency':
            return (b.solved_count || 0) - (a.solved_count || 0);
          default:
            return 0;
        }
      });
    }

    setFilteredProblems(filtered);
  };

  // Handle real-time bookmark toggle
  const handleBookmarkToggle = async (problemId) => {
    try {
      const success = await toggleBookmark(problemId, session);
      if (success) {
        // Update local state for real-time feedback
        setProblems(prev => {
          const updated = prev.map(problem =>
            problem.id === problemId
              ? { ...problem, bookmarked: !problem.bookmarked }
              : problem
          );
          // Update stats in parent component
          onStatsUpdate?.(updated);
          return updated;
        });
        setFilteredProblems(prev => prev.map(problem =>
          problem.id === problemId
            ? { ...problem, bookmarked: !problem.bookmarked }
            : problem
        ));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Handle real-time like toggle
  const handleLikeToggle = async (problemId) => {
    try {
      const success = await toggleLike(problemId, session);
      if (success) {
        // Update local state for real-time feedback
        setProblems(prev => {
          const updated = prev.map(problem =>
            problem.id === problemId
              ? { ...problem, liked: !problem.liked }
              : problem
          );
          // Update stats in parent component
          onStatsUpdate?.(updated);
          return updated;
        });
        setFilteredProblems(prev => prev.map(problem =>
          problem.id === problemId
            ? { ...problem, liked: !problem.liked }
            : problem
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const generateAIProblem = () => {
    setShowAIGenerator(true);
  };

  const handleProblemGenerated = (newProblem) => {
    // Add the generated problem to the problems list
    setProblems(prev => [newProblem, ...prev]);
    // Optionally filter to show it immediately
    setFilters(prev => ({ ...prev, search: '' }));
  };

  const handleProblemClick = (problem) => {
    router.push(`/problems/${problem.id}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 w-full h-full flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex-shrink-0">
          <h2 className="text-white text-xl font-bold">Problems</h2>
          <p className="text-blue-100 text-sm mt-1">Choose a problem to start coding</p>
        </div>

        {/* Filter Bar */}
        <div className="flex-shrink-0">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            problemCount={filteredProblems.length}
            onGenerateProblem={generateAIProblem}
            generating={generating}
          />
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProblems.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No problems found</div>
              <p className="text-gray-500 text-sm">Try adjusting your filters or generate an AI problem</p>
            </div>
          ) : (
            filteredProblems.map((problem, index) => (
              <ProblemRow
                key={problem.id || index}
                problem={problem}
                index={index}
                onProblemClick={handleProblemClick}
                onBookmarkToggle={handleBookmarkToggle}
                onLikeToggle={handleLikeToggle}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800/50 p-3 text-center border-t border-gray-700/50 flex-shrink-0">
          <p className="text-gray-400 text-xs">
            Powered by UpCode • {filters.source === 'gemini' ? '🤖 AI Enhanced' : 'Updated daily'}
          </p>
        </div>
      </div>

      {/* Problem Modal */}
      <ProblemModal
        problem={selectedProblem}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* AI Problems Generator */}
      <AIProblemsGenerator
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onProblemGenerated={handleProblemGenerated}
      />
    </>
  );
}
