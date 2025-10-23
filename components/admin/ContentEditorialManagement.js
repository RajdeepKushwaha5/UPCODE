"use client";
import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  PlayCircleIcon,
  LightBulbIcon,
  BookOpenIcon,
  PencilSquareIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ChatBubbleBottomCenterTextIcon,
  StarIcon
} from "@heroicons/react/24/outline";

export default function ContentEditorialManagement() {
  const [solutions, setSolutions] = useState([]);
  const [videoSolutions, setVideoSolutions] = useState([]);
  const [hints, setHints] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("solutions");
  
  // Modal states
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showEditorialModal, setShowEditorialModal] = useState(false);
  
  // Form states
  const [solutionFormData, setSolutionFormData] = useState({
    problemId: "",
    language: "javascript",
    code: "",
    explanation: "",
    timeComplexity: "",
    spaceComplexity: "",
    approach: "",
    keyInsights: [],
    difficulty: "medium",
    isVerified: false
  });

  const [videoFormData, setVideoFormData] = useState({
    problemId: "",
    title: "",
    description: "",
    videoUrl: "",
    duration: "",
    difficulty: "medium",
    instructor: "",
    tags: [],
    isPublished: false
  });

  const [hintFormData, setHintFormData] = useState({
    problemId: "",
    hints: ["", "", ""],
    difficulty: "medium",
    isActive: true
  });

  const [editorialFormData, setEditorialFormData] = useState({
    problemId: "",
    title: "",
    content: "",
    author: "",
    tags: [],
    approaches: [],
    isPublished: false
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [editingMode, setEditingMode] = useState(false);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "typescript", label: "TypeScript" }
  ];

  const difficulties = [
    { value: "easy", label: "Easy", color: "text-green-400" },
    { value: "medium", label: "Medium", color: "text-yellow-400" },
    { value: "hard", label: "Hard", color: "text-red-400" }
  ];

  const tabs = [
    { id: "solutions", label: "Code Solutions", icon: DocumentTextIcon },
    { id: "videos", label: "Video Solutions", icon: PlayCircleIcon },
    { id: "hints", label: "Hints", icon: LightBulbIcon },
    { id: "editorials", label: "Editorials", icon: BookOpenIcon }
  ];

  useEffect(() => {
    fetchContentData();
  }, [activeTab]);

  const fetchContentData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      setTimeout(() => {
        setSolutions([
          {
            _id: "1",
            problemId: "two-sum",
            problemTitle: "Two Sum",
            language: "javascript",
            code: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
            explanation: "Use a hashmap to store numbers and their indices. For each number, check if its complement exists in the map.",
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)",
            approach: "Hash Map",
            keyInsights: ["Single pass solution", "Trade space for time"],
            difficulty: "easy",
            isVerified: true,
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-16"),
            author: "Admin"
          },
          {
            _id: "2",
            problemId: "add-two-numbers",
            problemTitle: "Add Two Numbers",
            language: "python",
            code: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        current.next = ListNode(total % 10)
        
        current = current.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return dummy.next`,
            explanation: "Simulate addition digit by digit with carry handling.",
            timeComplexity: "O(max(m,n))",
            spaceComplexity: "O(max(m,n))",
            approach: "Simulation",
            keyInsights: ["Handle carry properly", "Use dummy node"],
            difficulty: "medium",
            isVerified: false,
            createdAt: new Date("2024-01-14"),
            updatedAt: new Date("2024-01-14"),
            author: "Content Team"
          }
        ]);

        setVideoSolutions([
          {
            _id: "1",
            problemId: "two-sum",
            problemTitle: "Two Sum",
            title: "Two Sum - Hash Map Approach",
            description: "Learn how to solve Two Sum efficiently using a hash map in just one pass.",
            videoUrl: "https://youtube.com/watch?v=example1",
            duration: "8:45",
            difficulty: "easy",
            instructor: "John Smith",
            tags: ["arrays", "hash-map", "beginner"],
            isPublished: true,
            views: 15420,
            rating: 4.8,
            createdAt: new Date("2024-01-10")
          },
          {
            _id: "2",
            problemId: "longest-substring",
            problemTitle: "Longest Substring Without Repeating Characters",
            title: "Sliding Window Technique Explained",
            description: "Master the sliding window pattern with this comprehensive walkthrough.",
            videoUrl: "https://youtube.com/watch?v=example2",
            duration: "12:30",
            difficulty: "medium",
            instructor: "Sarah Johnson", 
            tags: ["strings", "sliding-window", "two-pointers"],
            isPublished: false,
            views: 8930,
            rating: 4.6,
            createdAt: new Date("2024-01-08")
          }
        ]);

        setHints([
          {
            _id: "1",
            problemId: "two-sum",
            problemTitle: "Two Sum",
            hints: [
              "Think about what information you need to store as you iterate through the array.",
              "Consider using a hash map to store numbers you've seen and their indices.",
              "For each number, check if its complement (target - current number) exists in your hash map."
            ],
            difficulty: "easy",
            isActive: true,
            createdAt: new Date("2024-01-12")
          },
          {
            _id: "2",
            problemId: "reverse-linked-list",
            problemTitle: "Reverse Linked List",
            hints: [
              "You need to change the direction of the pointers.",
              "Keep track of the previous node to reverse the link.",
              "Use three pointers: previous, current, and next."
            ],
            difficulty: "easy",
            isActive: true,
            createdAt: new Date("2024-01-11")
          }
        ]);

        setEditorials([
          {
            _id: "1",
            problemId: "binary-search",
            problemTitle: "Binary Search",
            title: "Mastering Binary Search: A Complete Guide",
            content: `Binary search is one of the most fundamental algorithms in computer science. In this editorial, we'll explore various approaches and common pitfalls.

## Understanding the Problem
Binary search works on sorted arrays by repeatedly dividing the search space in half...

## Approach 1: Iterative Solution
The iterative approach uses a while loop and two pointers...

## Approach 2: Recursive Solution
The recursive approach is more elegant but uses O(log n) space...

## Common Pitfalls
- Off-by-one errors in boundary conditions
- Integer overflow in mid calculation
- Incorrect loop termination conditions`,
            author: "Tech Editorial Team",
            tags: ["algorithms", "binary-search", "fundamentals"],
            approaches: ["Iterative", "Recursive"],
            isPublished: true,
            readTime: "7 min",
            views: 23400,
            rating: 4.9,
            createdAt: new Date("2024-01-05"),
            updatedAt: new Date("2024-01-06")
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching content data:", error);
      setLoading(false);
    }
  };

  const handleCreateSolution = async (e) => {
    e.preventDefault();
    try {
      setShowSolutionModal(false);
      resetSolutionForm();
      fetchContentData();
    } catch (error) {
      console.error("Error creating solution:", error);
    }
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    try {
      setShowVideoModal(false);
      resetVideoForm();
      fetchContentData();
    } catch (error) {
      console.error("Error creating video:", error);
    }
  };

  const handleCreateHint = async (e) => {
    e.preventDefault();
    try {
      setShowHintModal(false);
      resetHintForm();
      fetchContentData();
    } catch (error) {
      console.error("Error creating hints:", error);
    }
  };

  const handleCreateEditorial = async (e) => {
    e.preventDefault();
    try {
      setShowEditorialModal(false);
      resetEditorialForm();
      fetchContentData();
    } catch (error) {
      console.error("Error creating editorial:", error);
    }
  };

  const resetSolutionForm = () => {
    setSolutionFormData({
      problemId: "",
      language: "javascript",
      code: "",
      explanation: "",
      timeComplexity: "",
      spaceComplexity: "",
      approach: "",
      keyInsights: [],
      difficulty: "medium",
      isVerified: false
    });
  };

  const resetVideoForm = () => {
    setVideoFormData({
      problemId: "",
      title: "",
      description: "",
      videoUrl: "",
      duration: "",
      difficulty: "medium",
      instructor: "",
      tags: [],
      isPublished: false
    });
  };

  const resetHintForm = () => {
    setHintFormData({
      problemId: "",
      hints: ["", "", ""],
      difficulty: "medium",
      isActive: true
    });
  };

  const resetEditorialForm = () => {
    setEditorialFormData({
      problemId: "",
      title: "",
      content: "",
      author: "",
      tags: [],
      approaches: [],
      isPublished: false
    });
  };

  const addKeyInsight = () => {
    setSolutionFormData(prev => ({
      ...prev,
      keyInsights: [...prev.keyInsights, ""]
    }));
  };

  const updateKeyInsight = (index, value) => {
    setSolutionFormData(prev => ({
      ...prev,
      keyInsights: prev.keyInsights.map((insight, i) => i === index ? value : insight)
    }));
  };

  const removeKeyInsight = (index) => {
    setSolutionFormData(prev => ({
      ...prev,
      keyInsights: prev.keyInsights.filter((_, i) => i !== index)
    }));
  };

  const updateHint = (index, value) => {
    setHintFormData(prev => ({
      ...prev,
      hints: prev.hints.map((hint, i) => i === index ? value : hint)
    }));
  };

  const getDifficultyColor = (difficulty) => {
    const config = difficulties.find(d => d.value === difficulty);
    return config?.color || "text-gray-400";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (isVerified, isPublished, isActive) => {
    const status = isVerified || isPublished || isActive;
    return status ? (
      <CheckCircleIcon className="w-5 h-5 text-green-400" />
    ) : (
      <ClockIcon className="w-5 h-5 text-yellow-400" />
    );
  };

  const renderContentCards = () => {
    let data = [];
    switch (activeTab) {
      case "solutions":
        data = solutions;
        break;
      case "videos":
        data = videoSolutions;
        break;
      case "hints":
        data = hints;
        break;
      case "editorials":
        data = editorials;
        break;
      default:
        data = [];
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item._id} className="theme-surface-elevated/50 rounded-lg p-6 border border-slate-600/50 hover:border-slate-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">
                  {item.problemTitle || item.title}
                </h4>
                <p className="text-gray-400 text-sm mb-2">
                  {item.problemId || `Problem: ${item.problemId}`}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty?.toUpperCase()}
                  </span>
                  {getStatusIcon(item.isVerified, item.isPublished, item.isActive)}
                </div>
              </div>
            </div>

            {/* Content specific details */}
            {activeTab === "solutions" && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Language:</span>
                  <span className="capitalize">{item.language}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Complexity:</span>
                  <span>{item.timeComplexity} / {item.spaceComplexity}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Author:</span>
                  <span>{item.author}</span>
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Duration:</span>
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Instructor:</span>
                  <span>{item.instructor}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Views:</span>
                  <span>{item.views?.toLocaleString()}</span>
                </div>
                {item.rating && (
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{item.rating}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "hints" && (
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-300">
                  <span className="font-medium">Hints:</span> {item.hints?.filter(h => h.trim()).length}
                </div>
                <div className="text-xs text-gray-400">
                  Created: {formatDate(item.createdAt)}
                </div>
              </div>
            )}

            {activeTab === "editorials" && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Author:</span>
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Read Time:</span>
                  <span>{item.readTime}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">Views:</span>
                  <span>{item.views?.toLocaleString()}</span>
                </div>
                {item.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-slate-600/50 px-2 py-1 rounded text-xs text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
              <span className="text-gray-400 text-xs">
                {formatDate(item.createdAt)}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    // Open appropriate modal for viewing
                  }}
                  className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    // Handle edit logic
                  }}
                  className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                  title="Edit"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    // Handle delete logic
                  }}
                  className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-white">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Content & Editorial Management</h2>
          <p className="text-gray-400">Manage problem solutions, videos, hints, and editorials</p>
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
                  ? "border-purple-500 theme-accent"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            switch (activeTab) {
              case "solutions":
                setShowSolutionModal(true);
                break;
              case "videos":
                setShowVideoModal(true);
                break;
              case "hints":
                setShowHintModal(true);
                break;
              case "editorials":
                setShowEditorialModal(true);
                break;
            }
          }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}</span>
        </button>
      </div>

      {/* Content Cards */}
      <div className="theme-surface backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
        {renderContentCards()}
      </div>

      {/* Solution Modal */}
      {showSolutionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Add Code Solution</h3>
            </div>
            
            <form onSubmit={handleCreateSolution} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Problem ID *
                  </label>
                  <input
                    type="text"
                    value={solutionFormData.problemId}
                    onChange={(e) => setSolutionFormData(prev => ({ ...prev, problemId: e.target.value }))}
                    className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Programming Language *
                  </label>
                  <select
                    value={solutionFormData.language}
                    onChange={(e) => setSolutionFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Complexity *
                  </label>
                  <input
                    type="text"
                    value={solutionFormData.timeComplexity}
                    onChange={(e) => setSolutionFormData(prev => ({ ...prev, timeComplexity: e.target.value }))}
                    placeholder="e.g., O(n)"
                    className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Space Complexity *
                  </label>
                  <input
                    type="text"
                    value={solutionFormData.spaceComplexity}
                    onChange={(e) => setSolutionFormData(prev => ({ ...prev, spaceComplexity: e.target.value }))}
                    placeholder="e.g., O(1)"
                    className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Solution Code *
                </label>
                <textarea
                  value={solutionFormData.code}
                  onChange={(e) => setSolutionFormData(prev => ({ ...prev, code: e.target.value }))}
                  rows={12}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Explanation *
                </label>
                <textarea
                  value={solutionFormData.explanation}
                  onChange={(e) => setSolutionFormData(prev => ({ ...prev, explanation: e.target.value }))}
                  rows={4}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Insights
                </label>
                {solutionFormData.keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={insight}
                      onChange={(e) => updateKeyInsight(index, e.target.value)}
                      className="flex-1 theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter key insight"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyInsight(index)}
                      className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addKeyInsight}
                  className="theme-accent hover:theme-text-secondary text-sm transition-colors"
                >
                  + Add Key Insight
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={solutionFormData.isVerified}
                    onChange={(e) => setSolutionFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                    className="rounded border-slate-500"
                  />
                  <span className="text-gray-300">Mark as Verified</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowSolutionModal(false);
                    resetSolutionForm();
                  }}
                  className="px-4 py-2 bg-slate-600 hover:theme-surface-elevated text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Add Video Solution</h3>
            </div>
            
            <form onSubmit={handleCreateVideo} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Problem ID *
                  </label>
                  <input
                    type="text"
                    value={videoFormData.problemId}
                    onChange={(e) => setVideoFormData(prev => ({ ...prev, problemId: e.target.value }))}
                    className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={videoFormData.duration}
                    onChange={(e) => setVideoFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 12:30"
                    className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video URL *
                </label>
                <input
                  type="url"
                  value={videoFormData.videoUrl}
                  onChange={(e) => setVideoFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instructor *
                </label>
                <input
                  type="text"
                  value={videoFormData.instructor}
                  onChange={(e) => setVideoFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={videoFormData.isPublished}
                    onChange={(e) => setVideoFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="rounded border-slate-500"
                  />
                  <span className="text-gray-300">Publish Immediately</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoModal(false);
                    resetVideoForm();
                  }}
                  className="px-4 py-2 bg-slate-600 hover:theme-surface-elevated text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Video Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Add Problem Hints</h3>
            </div>
            
            <form onSubmit={handleCreateHint} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Problem ID *
                </label>
                <input
                  type="text"
                  value={hintFormData.problemId}
                  onChange={(e) => setHintFormData(prev => ({ ...prev, problemId: e.target.value }))}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Hints (Progressive Difficulty)
                </label>
                {hintFormData.hints.map((hint, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-xs text-gray-400 mb-2">
                      Hint {index + 1}
                    </label>
                    <textarea
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      rows={3}
                      className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter hint ${index + 1} (should be ${index === 0 ? 'subtle' : index === 1 ? 'more specific' : 'most revealing'})`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hintFormData.isActive}
                    onChange={(e) => setHintFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-slate-500"
                  />
                  <span className="text-gray-300">Activate Hints</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowHintModal(false);
                    resetHintForm();
                  }}
                  className="px-4 py-2 bg-slate-600 hover:theme-surface-elevated text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Hints
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editorial Modal */}
      {showEditorialModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Create Editorial</h3>
            </div>
            
            <form onSubmit={handleCreateEditorial} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Problem ID *
                  </label>
                  <input
                    type="text"
                    value={editorialFormData.problemId}
                    onChange={(e) => setEditorialFormData(prev => ({ ...prev, problemId: e.target.value }))}
                    className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={editorialFormData.author}
                    onChange={(e) => setEditorialFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Editorial Title *
                </label>
                <input
                  type="text"
                  value={editorialFormData.title}
                  onChange={(e) => setEditorialFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content (Markdown) *
                </label>
                <textarea
                  value={editorialFormData.content}
                  onChange={(e) => setEditorialFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={16}
                  className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Write your editorial content using Markdown formatting..."
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editorialFormData.isPublished}
                    onChange={(e) => setEditorialFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="rounded border-slate-500"
                  />
                  <span className="text-gray-300">Publish Immediately</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditorialModal(false);
                    resetEditorialForm();
                  }}
                  className="px-4 py-2 bg-slate-600 hover:theme-surface-elevated text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Editorial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
