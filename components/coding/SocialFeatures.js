// Social Features Component for LeetCode-style platform
// Includes discussions, solution sharing, user interactions, and community features

'use client'
import { useState, useEffect } from 'react'
import { 
  FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaBookmark, FaUsers,
  FaTrophy, FaFire, FaStar, FaEye, FaHeart, FaCrown, FaGithub, FaLinkedin,
  FaTwitter, FaDiscord, FaCode, FaLightbulb, FaQuestionCircle, FaCopy,
  FaFlag, FaReply, FaSort, FaFilter, FaSearch, FaMedal, FaRocket,
  FaChartLine, FaUserFriends, FaBell, FaComments
} from 'react-icons/fa'
import { toast } from 'react-hot-toast'

export function SocialFeaturesPanel({ 
  problem, 
  user, 
  onClose, 
  isVisible = true 
}) {
  const [activeTab, setActiveTab] = useState('discussions')
  const [discussions, setDiscussions] = useState([])
  const [solutions, setSolutions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: FaComments },
    { id: 'solutions', label: 'Solutions', icon: FaCode },
    { id: 'leaderboard', label: 'Leaderboard', icon: FaTrophy },
    { id: 'hints', label: 'Community Hints', icon: FaLightbulb }
  ]

  useEffect(() => {
    if (isVisible && problem) {
      loadTabContent(activeTab)
    }
  }, [activeTab, isVisible, problem])

  const loadTabContent = async (tab) => {
    setLoading(true)
    try {
      switch (tab) {
        case 'discussions':
          await loadDiscussions()
          break
        case 'solutions':
          await loadSolutions()
          break
        case 'leaderboard':
          await loadLeaderboard()
          break
        case 'hints':
          await loadCommunityHints()
          break
      }
    } catch (error) {
      console.error(`Error loading ${tab}:`, error)
      toast.error(`Failed to load ${tab}`)
    } finally {
      setLoading(false)
    }
  }

  const loadDiscussions = async () => {
    // Mock discussion data - replace with real API call
    const mockDiscussions = [
      {
        id: 1,
        title: "Optimal O(n) solution using HashMap",
        author: "coder_pro",
        authorRank: "Expert",
        content: "I found an elegant solution using a HashMap to track seen elements...",
        votes: 42,
        replies: 8,
        tags: ["hash-map", "optimal"],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isPinned: true,
        hasAcceptedAnswer: true
      },
      {
        id: 2,
        title: "Why does this approach fail for edge case?",
        author: "learning_dev",
        authorRank: "Intermediate",
        content: "I'm getting WA for test case 15. My approach seems correct but...",
        votes: 15,
        replies: 12,
        tags: ["help", "edge-cases"],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isPinned: false,
        hasAcceptedAnswer: true
      },
      {
        id: 3,
        title: "Multiple approaches comparison",
        author: "algo_master",
        authorRank: "Master",
        content: "Let's compare different approaches: brute force O(n²), sorting O(n log n), and hash map O(n)...",
        votes: 89,
        replies: 23,
        tags: ["comparison", "analysis"],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isPinned: true,
        hasAcceptedAnswer: false
      }
    ]
    setDiscussions(mockDiscussions)
  }

  const loadSolutions = async () => {
    // Mock solution data
    const mockSolutions = [
      {
        id: 1,
        title: "Clean Python Solution - O(n) Time, O(1) Space",
        author: "python_ninja",
        authorRank: "Expert",
        language: "python",
        code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        explanation: "This solution uses a hash map to store seen numbers and their indices...",
        votes: 156,
        runtime: "52ms",
        memory: "15.2MB",
        runtimePercentile: 85,
        memoryPercentile: 72,
        tags: ["hash-map", "one-pass"],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isAccepted: true,
        complexity: { time: "O(n)", space: "O(n)" }
      },
      {
        id: 2,
        title: "JavaScript Solution with Comments",
        author: "js_developer",
        authorRank: "Intermediate",
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
        explanation: "Similar approach to Python version but using JavaScript Map...",
        votes: 89,
        runtime: "68ms",
        memory: "42.1MB",
        runtimePercentile: 65,
        memoryPercentile: 58,
        tags: ["hash-map", "javascript"],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isAccepted: true,
        complexity: { time: "O(n)", space: "O(n)" }
      }
    ]
    setSolutions(mockSolutions)
  }

  const loadLeaderboard = async () => {
    // Mock leaderboard data
    const mockLeaderboard = [
      {
        rank: 1,
        username: "speed_coder",
        runtime: "44ms",
        memory: "14.8MB",
        language: "C++",
        submissionTime: new Date(Date.now() - 30 * 60 * 1000),
        badge: "🥇"
      },
      {
        rank: 2,
        username: "algo_wizard",
        runtime: "48ms",
        memory: "15.1MB",
        language: "Python",
        submissionTime: new Date(Date.now() - 45 * 60 * 1000),
        badge: "🥈"
      },
      {
        rank: 3,
        username: "code_master",
        runtime: "52ms",
        memory: "15.2MB",
        language: "Java",
        submissionTime: new Date(Date.now() - 60 * 60 * 1000),
        badge: "🥉"
      }
    ]
    setLeaderboard(mockLeaderboard)
  }

  const loadCommunityHints = async () => {
    // This would load community-generated hints
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-800 border-l border-gray-700 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <FaUsers className="text-blue-400" />
          Community
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <Icon className="inline mr-1 text-xs" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <>
            {activeTab === 'discussions' && (
              <DiscussionsTab discussions={discussions} />
            )}
            {activeTab === 'solutions' && (
              <SolutionsTab solutions={solutions} />
            )}
            {activeTab === 'leaderboard' && (
              <LeaderboardTab leaderboard={leaderboard} />
            )}
            {activeTab === 'hints' && (
              <CommunityHintsTab problem={problem} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function DiscussionsTab({ discussions }) {
  const [sortBy, setSortBy] = useState('votes')

  const sortedDiscussions = [...discussions].sort((a, b) => {
    switch (sortBy) {
      case 'votes':
        return b.votes - a.votes
      case 'recent':
        return b.createdAt - a.createdAt
      case 'replies':
        return b.replies - a.replies
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-4">
        <FaSort className="text-gray-400" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
        >
          <option value="votes">Most Voted</option>
          <option value="recent">Most Recent</option>
          <option value="replies">Most Replies</option>
        </select>
      </div>

      {/* Discussions List */}
      {sortedDiscussions.map((discussion) => (
        <DiscussionCard key={discussion.id} discussion={discussion} />
      ))}
    </div>
  )
}

function DiscussionCard({ discussion }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {discussion.isPinned && <FaCrown className="text-yellow-400 text-xs" />}
            <h4 className="text-white font-medium text-sm leading-tight">
              {discussion.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{discussion.author}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              discussion.authorRank === 'Expert' 
                ? 'bg-purple-900/50 text-purple-300'
                : discussion.authorRank === 'Master'
                ? 'bg-yellow-900/50 text-yellow-300'
                : 'bg-blue-900/50 text-blue-300'
            }`}>
              {discussion.authorRank}
            </span>
            <span>{discussion.createdAt.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {discussion.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Content Preview */}
      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
        {discussion.content}
      </p>

      {/* Stats and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FaThumbsUp />
            {discussion.votes}
          </span>
          <span className="flex items-center gap-1">
            <FaComment />
            {discussion.replies}
          </span>
          {discussion.hasAcceptedAnswer && (
            <span className="flex items-center gap-1 text-green-400">
              <FaCheck />
              Solved
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300 text-xs"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      </div>
    </div>
  )
}

function SolutionsTab({ solutions }) {
  const [sortBy, setSortBy] = useState('votes')

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-4">
        <FaSort className="text-gray-400" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
        >
          <option value="votes">Most Voted</option>
          <option value="runtime">Fastest Runtime</option>
          <option value="memory">Least Memory</option>
        </select>
      </div>

      {/* Solutions List */}
      {solutions.map((solution) => (
        <SolutionCard key={solution.id} solution={solution} />
      ))}
    </div>
  )
}

function SolutionCard({ solution }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(solution.code)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  return (
    <div className="bg-gray-700/50 rounded-lg border border-gray-600/50 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-white font-medium text-sm leading-tight flex-1">
            {solution.title}
          </h4>
          <span className={`px-2 py-1 rounded text-xs ${
            solution.language === 'python' 
              ? 'bg-blue-900/50 text-blue-300'
              : solution.language === 'javascript'
              ? 'bg-yellow-900/50 text-yellow-300'
              : 'bg-green-900/50 text-green-300'
          }`}>
            {solution.language}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>{solution.author}</span>
          <span className="text-green-400">✓ Accepted</span>
          <span>{solution.createdAt.toLocaleTimeString()}</span>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-800 rounded p-2">
            <div className="text-xs text-gray-400">Runtime</div>
            <div className="text-sm text-white">{solution.runtime}</div>
            <div className="text-xs text-green-400">
              {solution.runtimePercentile}th percentile
            </div>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <div className="text-xs text-gray-400">Memory</div>
            <div className="text-sm text-white">{solution.memory}</div>
            <div className="text-xs text-green-400">
              {solution.memoryPercentile}th percentile
            </div>
          </div>
        </div>

        {/* Complexity */}
        <div className="flex gap-4 text-xs mb-3">
          <span className="text-blue-400">Time: {solution.complexity.time}</span>
          <span className="text-purple-400">Space: {solution.complexity.space}</span>
        </div>
      </div>

      {/* Code Section */}
      {isExpanded && (
        <div className="border-t border-gray-600">
          <div className="bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Code</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
              >
                <FaCopy />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-sm text-gray-100 overflow-x-auto">
              <code>{solution.code}</code>
            </pre>
          </div>
          
          {solution.explanation && (
            <div className="p-4 border-t border-gray-600">
              <h5 className="text-white text-sm font-medium mb-2">Explanation</h5>
              <p className="text-gray-300 text-sm">{solution.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 bg-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FaThumbsUp />
            {solution.votes}
          </span>
          <div className="flex flex-wrap gap-1">
            {solution.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300 text-xs"
        >
          {isExpanded ? 'Hide Code' : 'View Code'}
        </button>
      </div>
    </div>
  )
}

function LeaderboardTab({ leaderboard }) {
  return (
    <div className="space-y-3">
      <h4 className="text-white font-medium mb-4 flex items-center gap-2">
        <FaTrophy className="text-yellow-400" />
        Fastest Solutions
      </h4>
      
      {leaderboard.map((entry) => (
        <div
          key={entry.rank}
          className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{entry.badge}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{entry.username}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    entry.language === 'C++' 
                      ? 'bg-red-900/50 text-red-300'
                      : entry.language === 'Python'
                      ? 'bg-blue-900/50 text-blue-300'
                      : 'bg-green-900/50 text-green-300'
                  }`}>
                    {entry.language}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {entry.submissionTime.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white">{entry.runtime}</div>
              <div className="text-xs text-gray-400">{entry.memory}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CommunityHintsTab({ problem }) {
  const [hints, setHints] = useState([])

  useEffect(() => {
    // Mock community hints
    setHints([
      {
        id: 1,
        content: "Think about using a hash map to store values you've seen before.",
        author: "helpful_coder",
        votes: 23,
        isHelpful: true
      },
      {
        id: 2,
        content: "Remember to consider the edge case where the array is empty.",
        author: "edge_case_master",
        votes: 15,
        isHelpful: true
      },
      {
        id: 3,
        content: "The optimal solution has O(n) time complexity and O(n) space.",
        author: "complexity_guru",
        votes: 31,
        isHelpful: true
      }
    ])
  }, [problem])

  return (
    <div className="space-y-3">
      <h4 className="text-white font-medium mb-4 flex items-center gap-2">
        <FaLightbulb className="text-yellow-400" />
        Community Hints
      </h4>
      
      {hints.map((hint) => (
        <div
          key={hint.id}
          className="bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-3"
        >
          <p className="text-gray-300 text-sm mb-2">{hint.content}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">by {hint.author}</span>
            <span className="text-yellow-400 flex items-center gap-1">
              <FaThumbsUp />
              {hint.votes}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
