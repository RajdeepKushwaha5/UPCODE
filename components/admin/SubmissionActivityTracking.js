"use client";
import { useState, useEffect } from "react";
import {
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  FireIcon,
  TrophyIcon,
  PlayCircleIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function SubmissionActivityTracking() {
  const [submissions, setSubmissions] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [activityStats, setActivityStats] = useState({
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    acceptanceRate: 0,
    activeUsers: 0,
    streaksActive: 0,
    problemOfDay: null
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("submissions");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    language: "all",
    difficulty: "all",
    dateRange: "all",
    searchTerm: ""
  });

  const [streakFilters, setStreakFilters] = useState({
    status: "all",
    lengthFilter: "all",
    searchTerm: ""
  });

  const submissionStatuses = [
    { value: "all", label: "All Statuses" },
    { value: "accepted", label: "Accepted", color: "text-green-400" },
    { value: "wrong-answer", label: "Wrong Answer", color: "text-red-400" },
    { value: "time-limit-exceeded", label: "TLE", color: "text-yellow-400" },
    { value: "memory-limit-exceeded", label: "MLE", color: "text-orange-400" },
    { value: "runtime-error", label: "Runtime Error", color: "text-purple-400" },
    { value: "compile-error", label: "Compile Error", color: "text-pink-400" }
  ];

  const languages = [
    { value: "all", label: "All Languages" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" }
  ];

  const difficulties = [
    { value: "all", label: "All Difficulties" },
    { value: "easy", label: "Easy", color: "text-green-400" },
    { value: "medium", label: "Medium", color: "text-yellow-400" },
    { value: "hard", label: "Hard", color: "text-red-400" }
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

  const tabs = [
    { id: "submissions", label: "All Submissions", icon: CodeBracketIcon },
    { id: "streaks", label: "Streak Management", icon: FireIcon },
    { id: "problem-of-day", label: "Problem of the Day", icon: CalendarDaysIcon },
    { id: "analytics", label: "Activity Analytics", icon: ChartBarIcon }
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch activity stats
      const statsResponse = await fetch('/api/admin/submissions?type=stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setActivityStats(statsData.stats);
      }

      // Fetch submissions or streaks based on active tab
      if (activeTab === 'submissions') {
        await fetchSubmissions();
      } else if (activeTab === 'streaks') {
        await fetchStreaks();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const fetchSubmissions = async () => {
    try {
      const params = new URLSearchParams({
        type: 'submissions',
        page: 1,
        limit: 50,
        status: filters.status,
        language: filters.language,
        difficulty: filters.difficulty,
        search: filters.searchTerm
      });

      const response = await fetch(`/api/admin/submissions?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchStreaks = async () => {
    try {
      const params = new URLSearchParams({
        type: 'streaks',
        page: 1,
        limit: 50,
        status: streakFilters.status,
        lengthFilter: streakFilters.lengthFilter,
        search: streakFilters.searchTerm
      });

      const response = await fetch(`/api/admin/submissions?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setStreaks(data.streaks);
      }
    } catch (error) {
      console.error("Error fetching streaks:", error);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'streaks') {
      fetchStreaks();
    }
  }, [streakFilters]);

  const getStatusColor = (status) => {
    const statusConfig = submissionStatuses.find(s => s.value === status);
    return statusConfig?.color || "text-gray-400";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case "wrong-answer":
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case "time-limit-exceeded":
      case "memory-limit-exceeded":
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case "runtime-error":
      case "compile-error":
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    const diffConfig = difficulties.find(d => d.value === difficulty);
    return diffConfig?.color || "text-gray-400";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStreakStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "broken":
        return "bg-red-500/20 text-red-400";
      case "at-risk":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const calculateDaysSinceLastSolved = (lastSolved) => {
    const today = new Date();
    const last = new Date(lastSolved);
    const diffTime = today - last;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleManualStreakUpdate = async (userId, action, value = null) => {
    try {
      // Simulate API call
      setTimeout(() => {
        fetchData();
      }, 500);
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  const handleSetProblemOfDay = async (problemId) => {
    try {
      // Simulate API call
      setTimeout(() => {
        fetchData();
      }, 500);
    } catch (error) {
      console.error("Error setting problem of the day:", error);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filters.status !== "all" && submission.status !== filters.status) return false;
    if (filters.language !== "all" && submission.language !== filters.language) return false;
    if (filters.difficulty !== "all" && submission.difficulty !== filters.difficulty) return false;
    if (filters.searchTerm && !submission.username.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !submission.problemTitle.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredStreaks = streakData.filter(streak => {
    if (streakFilters.status !== "all" && streak.streakStatus !== streakFilters.status) return false;
    if (streakFilters.lengthFilter === "long" && streak.currentStreak < 10) return false;
    if (streakFilters.lengthFilter === "short" && streak.currentStreak >= 10) return false;
    if (streakFilters.searchTerm && !streak.username.toLowerCase().includes(streakFilters.searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-white">Loading activity data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Submission & Activity Tracking</h2>
          <p className="text-gray-400">Monitor user submissions, streaks, and platform activity</p>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Submissions</p>
              <p className="text-2xl font-bold text-white">{activityStats.totalSubmissions.toLocaleString()}</p>
            </div>
            <CodeBracketIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-white">{activityStats.acceptedSubmissions.toLocaleString()}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Acceptance Rate</p>
              <p className="text-2xl font-bold text-white">{activityStats.acceptanceRate}%</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{activityStats.activeUsers.toLocaleString()}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Streaks</p>
              <p className="text-2xl font-bold text-white">{activityStats.streaksActive.toLocaleString()}</p>
            </div>
            <FireIcon className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Problem of Day</p>
              <p className="text-lg font-bold text-white">{activityStats.problemOfDay?.title.slice(0, 12)}...</p>
              <p className="text-xs text-gray-400">{activityStats.problemOfDay?.submissions} submissions</p>
            </div>
            <CalendarDaysIcon className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-600">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Submissions Tab */}
      {activeTab === "submissions" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {submissionStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value}>{diff.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    placeholder="Search by user or problem..."
                    className="w-full bg-slate-700 border border-slate-600 text-white pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Submissions</h3>
              <div className="text-sm text-gray-400">
                {filteredSubmissions.length} submissions found
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-300 font-medium">User</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-medium">Problem</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-medium">Language</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-medium">Runtime</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-medium">Memory</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-medium">Submitted</th>
                    <th className="text-left px-4 py-3 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/50">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">{submission.username}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium">{submission.problemTitle}</p>
                          <span className={`text-sm font-medium ${getDifficultyColor(submission.difficulty)}`}>
                            {submission.difficulty?.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white capitalize">{submission.language}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(submission.status)}
                          <span className={`text-sm font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status.replace("-", " ").toUpperCase()}
                          </span>
                        </div>
                        {submission.testCasesPassed !== undefined && (
                          <p className="text-xs text-gray-400">
                            {submission.testCasesPassed}/{submission.totalTestCases} test cases
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white">
                          {submission.runtime ? `${submission.runtime}ms` : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white">
                          {submission.memory ? `${submission.memory}MB` : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-300 text-sm">
                          {formatDate(submission.submittedAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowSubmissionModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                          title="View Code"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Streak Management Tab */}
      {activeTab === "streaks" && (
        <div className="space-y-6">
          {/* Streak Filters */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Streak Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Streak Status</label>
                <select
                  value={streakFilters.status}
                  onChange={(e) => setStreakFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="broken">Broken</option>
                  <option value="at-risk">At Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Streak Length</label>
                <select
                  value={streakFilters.lengthFilter}
                  onChange={(e) => setStreakFilters(prev => ({ ...prev, lengthFilter: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Lengths</option>
                  <option value="long">10+ Days</option>
                  <option value="short">Less than 10 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search User</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={streakFilters.searchTerm}
                    onChange={(e) => setStreakFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    placeholder="Search users..."
                    className="w-full bg-slate-700 border border-slate-600 text-white pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Streak Management */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">User Streaks</h3>
              <div className="text-sm text-gray-400">
                {filteredStreaks.length} users found
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStreaks.map((streak) => (
                <div key={streak._id} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{streak.username}</h4>
                      <p className="text-gray-400 text-sm mb-2">{streak.email}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStreakStatusColor(streak.streakStatus)}`}>
                        {streak.streakStatus}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <FireIcon className="w-5 h-5 text-orange-400" />
                        <span className="text-2xl font-bold text-white">{streak.currentStreak}</span>
                      </div>
                      <p className="text-gray-400 text-xs">current streak</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Longest Streak</p>
                      <p className="text-white font-medium">{streak.longestStreak} days</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Solved</p>
                      <p className="text-white font-medium">{streak.totalSolved}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Last Solved</p>
                      <p className="text-white font-medium">{formatDateShort(streak.lastSolved)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Days Ago</p>
                      <p className="text-white font-medium">{calculateDaysSinceLastSolved(streak.lastSolved)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleManualStreakUpdate(streak.userId, "extend", 1)}
                      className="flex-1 text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 p-2 rounded transition-colors text-sm"
                    >
                      +1 Day
                    </button>
                    <button
                      onClick={() => handleManualStreakUpdate(streak.userId, "reset")}
                      className="flex-1 text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 p-2 rounded transition-colors text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(streak);
                        setShowStreakModal(true);
                      }}
                      className="text-blue-400 hover:text-blue-300 p-2 rounded transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Problem of the Day Tab */}
      {activeTab === "problem-of-day" && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Problem of the Day Management</h3>
            
            {activityStats.problemOfDay && (
              <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{activityStats.problemOfDay.title}</h4>
                    <p className="text-gray-400">Problem ID: {activityStats.problemOfDay.id}</p>
                    <span className={`text-sm font-medium ${getDifficultyColor(activityStats.problemOfDay.difficulty)}`}>
                      {activityStats.problemOfDay.difficulty?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{activityStats.problemOfDay.submissions}</p>
                    <p className="text-gray-400 text-sm">submissions today</p>
                    <p className="text-green-400 text-sm">{activityStats.problemOfDay.acceptanceRate}% accepted</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSetProblemOfDay("new-problem-id")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Change Problem of the Day
                </button>
              </div>
            )}

            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-medium">Manual Override</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Use the form below to manually set a specific problem as the Problem of the Day.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Set New Problem of the Day
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Enter Problem ID (e.g., two-sum)"
                  className="flex-1 bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSetProblemOfDay("manual-selection")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Set Problem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Activity Analytics</h3>
            
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 text-center">
              <ChartBarIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-blue-400 font-medium text-lg mb-2">Advanced Analytics</h4>
              <p className="text-gray-300">
                Detailed analytics charts and graphs for submission patterns, user activity trends, 
                and performance metrics will be displayed here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Modal */}
      {showSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Submission Details</h3>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm">User</p>
                  <p className="text-white font-medium">{selectedSubmission.username}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Problem</p>
                  <p className="text-white font-medium">{selectedSubmission.problemTitle}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Language</p>
                  <p className="text-white capitalize">{selectedSubmission.language}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedSubmission.status)}
                    <span className={`font-medium ${getStatusColor(selectedSubmission.status)}`}>
                      {selectedSubmission.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
                {selectedSubmission.runtime && (
                  <div>
                    <p className="text-gray-400 text-sm">Runtime</p>
                    <p className="text-white">{selectedSubmission.runtime}ms</p>
                  </div>
                )}
                {selectedSubmission.memory && (
                  <div>
                    <p className="text-gray-400 text-sm">Memory</p>
                    <p className="text-white">{selectedSubmission.memory}MB</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Submitted Code</p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    {selectedSubmission.code}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Details Modal */}
      {showStreakModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Streak Details</h3>
                <button
                  onClick={() => setShowStreakModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <h4 className="text-white font-semibold text-lg">{selectedUser.username}</h4>
                <p className="text-gray-400">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <FireIcon className="w-6 h-6 text-orange-400" />
                    <span className="text-3xl font-bold text-white">{selectedUser.currentStreak}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Current Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrophyIcon className="w-6 h-6 text-yellow-400" />
                    <span className="text-3xl font-bold text-white">{selectedUser.longestStreak}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Longest Streak</p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-white font-medium">Recent Activity</h5>
                {selectedUser.problems?.slice(0, 5).map((problem, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-slate-700/50 rounded">
                    <div>
                      <p className="text-white text-sm">{problem.problemId}</p>
                      <p className="text-gray-400 text-xs">{problem.date}</p>
                    </div>
                    {problem.solved ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStreakModal(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
