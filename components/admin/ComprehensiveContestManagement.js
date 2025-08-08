"use client";
import { useState, useEffect } from "react";
import {
  TrophyIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  PlayIcon,
  StopIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

export default function ComprehensiveContestManagement() {
  const [contests, setContests] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: 180, // minutes
    type: "public",
    maxParticipants: null,
    problems: [],
    prizes: [
      { position: 1, prize: "" },
      { position: 2, prize: "" },
      { position: 3, prize: "" }
    ],
    rules: "",
    isActive: false,
    registrationOpen: true
  });

  const contestTypes = [
    { value: "public", label: "Public Contest" },
    { value: "private", label: "Private Contest" },
    { value: "premium", label: "Premium Only" }
  ];

  useEffect(() => {
    fetchContests();
    fetchProblems();
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      setTimeout(() => {
        const mockContests = [
          {
            _id: "1",
            title: "Weekly Challenge #45",
            description: "Test your skills with array and string manipulation problems",
            startTime: new Date("2024-02-01T18:00:00Z"),
            endTime: new Date("2024-02-01T21:00:00Z"),
            duration: 180,
            type: "public",
            status: "completed",
            participants: 1247,
            maxParticipants: null,
            problems: [
              { problemId: "p1", title: "Two Sum", difficulty: "Easy", points: 100 },
              { problemId: "p2", title: "Valid Parentheses", difficulty: "Easy", points: 150 },
              { problemId: "p3", title: "Longest Palindrome", difficulty: "Medium", points: 300 },
              { problemId: "p4", title: "Merge Intervals", difficulty: "Hard", points: 500 }
            ],
            prizes: [
              { position: 1, prize: "$100 Gift Card" },
              { position: 2, prize: "$50 Gift Card" },
              { position: 3, prize: "$25 Gift Card" }
            ],
            createdAt: new Date("2024-01-25"),
            registrationOpen: false,
            totalSubmissions: 4523
          },
          {
            _id: "2",
            title: "Algorithm Masters Championship",
            description: "Monthly championship for advanced programmers",
            startTime: new Date("2024-02-15T16:00:00Z"),
            endTime: new Date("2024-02-15T20:00:00Z"),
            duration: 240,
            type: "premium",
            status: "upcoming",
            participants: 89,
            maxParticipants: 500,
            problems: [
              { problemId: "p5", title: "Binary Tree Traversal", difficulty: "Medium", points: 250 },
              { problemId: "p6", title: "Graph Algorithms", difficulty: "Hard", points: 400 },
              { problemId: "p7", title: "Dynamic Programming", difficulty: "Hard", points: 600 }
            ],
            prizes: [
              { position: 1, prize: "$500 Cash Prize" },
              { position: 2, prize: "$300 Cash Prize" },
              { position: 3, prize: "$200 Cash Prize" }
            ],
            createdAt: new Date("2024-01-20"),
            registrationOpen: true,
            totalSubmissions: 0
          },
          {
            _id: "3",
            title: "Beginner's Programming Contest",
            description: "Perfect for newcomers to competitive programming",
            startTime: new Date("2024-02-10T14:00:00Z"),
            endTime: new Date("2024-02-10T16:00:00Z"),
            duration: 120,
            type: "public",
            status: "active",
            participants: 567,
            maxParticipants: null,
            problems: [
              { problemId: "p8", title: "Hello World", difficulty: "Easy", points: 50 },
              { problemId: "p9", title: "Simple Math", difficulty: "Easy", points: 100 },
              { problemId: "p10", title: "Basic Loops", difficulty: "Easy", points: 150 }
            ],
            prizes: [
              { position: 1, prize: "Certificate + Badge" },
              { position: 2, prize: "Certificate + Badge" },
              { position: 3, prize: "Certificate + Badge" }
            ],
            createdAt: new Date("2024-02-05"),
            registrationOpen: true,
            totalSubmissions: 1234
          }
        ];
        
        setContests(mockContests);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching contests:", error);
      setLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      // Mock problems data
      const mockProblems = [
        { _id: "p1", title: "Two Sum", difficulty: "Easy" },
        { _id: "p2", title: "Valid Parentheses", difficulty: "Easy" },
        { _id: "p3", title: "Longest Palindrome", difficulty: "Medium" },
        { _id: "p4", title: "Merge Intervals", difficulty: "Hard" },
        { _id: "p5", title: "Binary Tree Traversal", difficulty: "Medium" },
        { _id: "p6", title: "Graph Algorithms", difficulty: "Hard" },
        { _id: "p7", title: "Dynamic Programming", difficulty: "Hard" },
        { _id: "p8", title: "Hello World", difficulty: "Easy" },
        { _id: "p9", title: "Simple Math", difficulty: "Easy" },
        { _id: "p10", title: "Basic Loops", difficulty: "Easy" }
      ];
      setProblems(mockProblems);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const handleCreateContest = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating contest:", formData);
      // Simulate API call
      setTimeout(() => {
        setShowCreateModal(false);
        resetForm();
        fetchContests();
      }, 1000);
    } catch (error) {
      console.error("Error creating contest:", error);
    }
  };

  const handleEditContest = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating contest:", selectedContest._id, formData);
      // Simulate API call
      setTimeout(() => {
        setShowEditModal(false);
        resetForm();
        fetchContests();
      }, 1000);
    } catch (error) {
      console.error("Error updating contest:", error);
    }
  };

  const handleDeleteContest = async () => {
    try {
      console.log("Deleting contest:", selectedContest._id);
      // Simulate API call
      setTimeout(() => {
        setShowDeleteModal(false);
        setSelectedContest(null);
        fetchContests();
      }, 1000);
    } catch (error) {
      console.error("Error deleting contest:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      duration: 180,
      type: "public",
      maxParticipants: null,
      problems: [],
      prizes: [
        { position: 1, prize: "" },
        { position: 2, prize: "" },
        { position: 3, prize: "" }
      ],
      rules: "",
      isActive: false,
      registrationOpen: true
    });
  };

  const openEditModal = (contest) => {
    setSelectedContest(contest);
    setFormData({
      title: contest.title || "",
      description: contest.description || "",
      startTime: contest.startTime ? new Date(contest.startTime).toISOString().slice(0, 16) : "",
      endTime: contest.endTime ? new Date(contest.endTime).toISOString().slice(0, 16) : "",
      duration: contest.duration || 180,
      type: contest.type || "public",
      maxParticipants: contest.maxParticipants,
      problems: contest.problems || [],
      prizes: contest.prizes || [
        { position: 1, prize: "" },
        { position: 2, prize: "" },
        { position: 3, prize: "" }
      ],
      rules: contest.rules || "",
      isActive: contest.status === "active",
      registrationOpen: contest.registrationOpen ?? true
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "upcoming": return "bg-blue-500/20 text-blue-400";
      case "completed": return "bg-gray-500/20 text-gray-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "public": return "bg-green-500/20 text-green-400";
      case "private": return "bg-yellow-500/20 text-yellow-400";
      case "premium": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
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

  const calculateDuration = (start, end) => {
    const diffMs = new Date(end) - new Date(start);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-white">Loading contests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Contest Management</h2>
          <p className="text-gray-400">Create and manage programming contests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Contest</span>
        </button>
      </div>

      {/* Contests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <div
            key={contest._id}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6 hover:border-purple-500/50 transition-all duration-300"
          >
            {/* Contest Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2">{contest.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{contest.description}</p>
              </div>
              <div className="flex items-center space-x-1 ml-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
                  {contest.status}
                </span>
              </div>
            </div>

            {/* Contest Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>{formatDate(contest.startTime)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <ClockIcon className="w-4 h-4" />
                <span>{calculateDuration(contest.startTime, contest.endTime)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <UserGroupIcon className="w-4 h-4" />
                <span>{contest.participants} participants</span>
                {contest.maxParticipants && (
                  <span className="text-gray-400">/ {contest.maxParticipants}</span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(contest.type)}`}>
                  {contest.type}
                </span>
                <span className="text-gray-400">{contest.problems.length} problems</span>
              </div>
            </div>

            {/* Problems Preview */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-2 text-sm">Problems:</h4>
              <div className="space-y-1">
                {contest.problems.slice(0, 3).map((problem, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{problem.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-gray-400">{problem.points}pt</span>
                    </div>
                  </div>
                ))}
                {contest.problems.length > 3 && (
                  <div className="text-gray-400 text-xs">
                    +{contest.problems.length - 3} more problems
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedContest(contest);
                    setShowLeaderboardModal(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                  title="View Leaderboard"
                >
                  <ChartBarIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => console.log("View contest", contest._id)}
                  className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => openEditModal(contest)}
                  className="text-yellow-400 hover:text-yellow-300 p-1 rounded transition-colors"
                  title="Edit Contest"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    setSelectedContest(contest);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                  title="Delete Contest"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400">
                  {contest.totalSubmissions} submissions
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Contest</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{selectedContest?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteContest}
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
