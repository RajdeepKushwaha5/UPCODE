"use client";
import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CloudArrowUpIcon,
  CodeBracketSquareIcon
} from "@heroicons/react/24/outline";

export default function EnhancedProblemManagement() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: [],
    companyTags: [],
    constraints: "",
    examples: [{ input: "", output: "", explanation: "" }],
    testCases: [{ input: "", expectedOutput: "", isHidden: false }],
    codeTemplates: {
      javascript: "",
      python: "",
      java: "",
      cpp: ""
    },
    isPremium: false,
    hints: [],
    solution: "",
    timeComplexity: "",
    spaceComplexity: ""
  });
  
  const problemsPerPage = 10;
  const difficulties = ["Easy", "Medium", "Hard"];
  const popularTags = [
    "Array", "String", "Dynamic Programming", "Math", "Greedy", "Tree", "Graph",
    "Hash Table", "Two Pointers", "Binary Search", "Sliding Window", "Stack",
    "Queue", "Heap", "Sorting", "Backtracking", "Bit Manipulation", "Recursion"
  ];
  const companyTags = [
    "Amazon", "Google", "Microsoft", "Facebook", "Apple", "Netflix", "LinkedIn",
    "Uber", "Tesla", "Adobe", "Spotify", "Twitter", "Airbnb", "Dropbox"
  ];

  useEffect(() => {
    fetchProblems();
  }, [currentPage, searchQuery, filterDifficulty, filterStatus]);

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchProblems(false); // Refresh without showing loader
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, currentPage, searchQuery, filterDifficulty, filterStatus]);

  const fetchProblems = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: problemsPerPage.toString(),
        search: searchQuery,
        difficulty: filterDifficulty === 'all' ? '' : filterDifficulty,
        status: filterStatus === 'all' ? '' : filterStatus
      });

      const response = await fetch(`/api/admin/problems?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setProblems(data.problems || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        console.error("Failed to fetch problems:", data.message);
        // Fallback to empty state instead of mock data
        setProblems([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      // Fallback to empty state instead of mock data
      setProblems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowAddModal(false);
        resetForm();
        fetchProblems(); // Refresh the problems list
        console.log("Problem added successfully");
      } else {
        console.error("Failed to add problem:", data.message);
        alert(`Failed to add problem: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding problem:", error);
      alert("Error adding problem. Please try again.");
    }
  };

  const handleEditProblem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/problems', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: selectedProblem._id,
          updates: formData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowEditModal(false);
        resetForm();
        fetchProblems(); // Refresh the problems list
        console.log("Problem updated successfully");
      } else {
        console.error("Failed to update problem:", data.message);
        alert(`Failed to update problem: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating problem:", error);
      alert("Error updating problem. Please try again.");
    }
  };

  const handleDeleteProblem = async () => {
    try {
      const response = await fetch('/api/admin/problems', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: selectedProblem._id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowDeleteModal(false);
        setSelectedProblem(null);
        fetchProblems(); // Refresh the problems list
        console.log("Problem deleted successfully");
      } else {
        console.error("Failed to delete problem:", data.message);
        alert(`Failed to delete problem: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
      alert("Error deleting problem. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "Easy",
      tags: [],
      companyTags: [],
      constraints: "",
      examples: [{ input: "", output: "", explanation: "" }],
      testCases: [{ input: "", expectedOutput: "", isHidden: false }],
      codeTemplates: {
        javascript: "",
        python: "",
        java: "",
        cpp: ""
      },
      isPremium: false,
      hints: [],
      solution: "",
      timeComplexity: "",
      spaceComplexity: ""
    });
  };

  const openEditModal = (problem) => {
    setSelectedProblem(problem);
    setFormData({
      title: problem.title || "",
      description: problem.description || "",
      difficulty: problem.difficulty || "Easy",
      tags: problem.tags || [],
      companyTags: problem.companyTags || [],
      constraints: problem.constraints || "",
      examples: problem.examples || [{ input: "", output: "", explanation: "" }],
      testCases: problem.testCases || [{ input: "", expectedOutput: "", isHidden: false }],
      codeTemplates: problem.codeTemplates || {
        javascript: "",
        python: "",
        java: "",
        cpp: ""
      },
      isPremium: problem.isPremium || false,
      hints: problem.hints || [],
      solution: problem.solution || "",
      timeComplexity: problem.timeComplexity || "",
      spaceComplexity: problem.spaceComplexity || ""
    });
    setShowEditModal(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400";
      case "Medium": return "bg-yellow-500/20 text-yellow-400";
      case "Hard": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published": return "bg-green-500/20 text-green-400";
      case "Draft": return "bg-yellow-500/20 text-yellow-400";
      case "Archived": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-white">Loading problems...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Problem Management</h2>
          <p className="text-gray-400">Create, edit, and manage coding problems</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add New Problem</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Difficulties</option>
          {difficulties.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Problems Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Problem</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Difficulty</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Tags</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Submissions</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Acceptance</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600/50">
              {problems.map((problem) => (
                <tr key={problem._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-medium">{problem.title}</h3>
                        {problem.isPremium && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Created: {problem.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{problem.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(problem.status)}`}>
                      {problem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{problem.submissions.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{problem.acceptanceRate}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => console.log("View problem", problem._id)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                        title="View Problem"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(problem)}
                        className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                        title="Edit Problem"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProblem(problem);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                        title="Delete Problem"
                      >
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {problems.length} problems
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-purple-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              <span>Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Problem</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{selectedProblem?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProblem}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
