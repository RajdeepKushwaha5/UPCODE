"use client";
import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function ProblemManagement() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    totalProblems: 0,
    publishedProblems: 0,
    draftProblems: 0,
    difficultyDistribution: { easy: 0, medium: 0, hard: 0 }
  });

  // Real-time updates
  useEffect(() => {
    fetchProblems();
    
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchProblems();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [searchTerm, selectedDifficulty, selectedCategory, autoRefresh]);

  const fetchProblems = async () => {
    try {
      const params = new URLSearchParams({
        page: 1,
        limit: 100,
        search: searchTerm,
        difficulty: selectedDifficulty !== "all" ? selectedDifficulty : "",
        category: selectedCategory !== "all" ? selectedCategory : ""
      });

      const response = await fetch(`/api/admin/problems?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProblems(data.problems || []);
        setStats(data.stats || {});
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch problems:', data.message);
        setProblems([]);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      setProblems([]);
    }
    setLoading(false);
  };

  // Get unique categories for filter
  const categories = [...new Set(problems.map(p => p.category))].filter(Boolean);

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesDifficulty = selectedDifficulty === "all" ||
      problem.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesCategory = selectedCategory === "all" ||
      problem.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Hard": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Draft": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Archived": return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  if (loading && problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="text-gray-400">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Problem Management</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage coding problems and challenges</p>
        </div>
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
                autoRefresh 
                  ? 'bg-green-600/20 text-green-400 border border-green-400/30' 
                  : 'bg-gray-600/20 text-gray-400 border border-gray-400/30'
              }`}
              title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
            >
              <ArrowPathIcon className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Auto</span>
            </button>
            
            <button
              onClick={fetchProblems}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-600/30 transition-all text-sm"
              title="Refresh now"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Problem</span>
          </button>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="flex items-center justify-between text-xs text-gray-400 theme-surface/30 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-4 h-4" />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          {autoRefresh ? (
            <>
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Real-time updates enabled</span>
            </>
          ) : (
            <>
              <XCircleIcon className="w-4 h-4 text-gray-400" />
              <span>Real-time updates disabled</span>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="text-xl sm:text-2xl font-bold text-white">{problems.length}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Total Problems</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="text-xl sm:text-2xl font-bold text-green-400">
            {problems.filter(p => p.status === "Published").length}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Published</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="text-xl sm:text-2xl font-bold text-yellow-400">
            {problems.filter(p => p.status === "Draft").length}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Drafts</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="text-xl sm:text-2xl font-bold theme-accent">
            {problems.length > 0 ? Math.round(problems.reduce((acc, p) => acc + (p.acceptance || 0), 0) / problems.length) : 0}%
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Avg Acceptance</div>
        </div>
      </div>

      {/* Filters - Responsive */}
      <div className="theme-surface backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 theme-surface-elevated/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 theme-surface-elevated/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 theme-surface-elevated/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* Filter Summary */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
          <div className="flex items-center space-x-2 text-sm">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              Showing {filteredProblems.length} of {problems.length} problems
            </span>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex theme-surface-elevated/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === "table" 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === "grid" 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Problems Display - Responsive */}
      {viewMode === "table" ? (
        /* Table View - Desktop */
        <div className="theme-surface backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="theme-surface-elevated/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Problem</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Submissions</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acceptance</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredProblems.map((problem) => (
                    <tr key={problem._id || problem.id} className="hover:theme-surface-elevated/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium truncate max-w-xs">{problem.title}</div>
                          <div className="text-gray-400 text-sm">#{problem._id?.slice(-6) || problem.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{problem.category}</td>
                      <td className="px-6 py-4 text-gray-300">{(problem.submissions || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-300">{problem.acceptance || 0}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(problem.status || "Draft")}`}>
                          {problem.status || "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 theme-accent hover:theme-text-secondary hover:bg-purple-400/10 rounded-lg transition-all">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden">
            <div className="divide-y divide-slate-700/50">
              {filteredProblems.map((problem) => (
                <div key={problem._id || problem.id} className="p-4 hover:theme-surface-elevated/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{problem.title}</h3>
                      <p className="text-gray-400 text-sm">#{problem._id?.slice(-6) || problem.id}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 theme-accent hover:theme-text-secondary hover:bg-purple-400/10 rounded">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(problem.status || "Draft")}`}>
                      {problem.status || "Draft"}
                    </span>
                    <span className="px-2 py-1 text-xs theme-surface-elevated/50 text-gray-300 rounded-full">
                      {problem.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{(problem.submissions || 0).toLocaleString()} submissions</span>
                    <span>{problem.acceptance || 0}% acceptance</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProblems.map((problem) => (
            <div key={problem._id || problem.id} className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-medium truncate flex-1">{problem.title}</h3>
                <div className="flex items-center space-x-1 ml-2">
                  <button className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded">
                    <EyeIcon className="w-3 h-3" />
                  </button>
                  <button className="p-1 theme-accent hover:theme-text-secondary hover:bg-purple-400/10 rounded">
                    <PencilIcon className="w-3 h-3" />
                  </button>
                  <button className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded">
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(problem.status || "Draft")}`}>
                    {problem.status || "Draft"}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">{problem.category}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-slate-700/50">
                <div className="flex items-center space-x-1">
                  <ChartBarIcon className="w-3 h-3" />
                  <span>{(problem.submissions || 0).toLocaleString()}</span>
                </div>
                <span>{problem.acceptance || 0}% pass</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProblems.length === 0 && !loading && (
        <div className="theme-surface backdrop-blur-sm rounded-xl p-12 border border-slate-700/50 text-center">
          <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No problems found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || selectedDifficulty !== "all" || selectedCategory !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating your first problem"
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Problem</span>
          </button>
        </div>
      )}

      {/* Create Problem Modal - Enhanced */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-surface rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Create New Problem</h3>
            <p className="text-gray-400 mb-6">This will open the problem creation wizard.</p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg border border-gray-600 hover:border-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Create Problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
