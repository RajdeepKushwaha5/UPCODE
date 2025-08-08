'use client'
import { useState } from 'react'
import { 
  FaPlay, FaBookmark, FaHeart, FaYoutube, FaBuilding, FaTag, 
  FaCheckCircle, FaExclamationTriangle, FaTimes, FaLightbulb,
  FaRegBookmark, FaRegHeart, FaChevronDown, FaChevronUp,
  FaCrown, FaLock
} from 'react-icons/fa'

const DIFFICULTY_COLORS = {
  'Easy': 'text-green-500 bg-green-100 dark:bg-green-900/30',
  'Medium': 'text-orange-500 bg-orange-100 dark:bg-orange-900/30', 
  'Hard': 'text-red-500 bg-red-100 dark:bg-red-900/30'
}

export default function ProblemDescription({ 
  problem, 
  isBookmarked, 
  isLiked, 
  userNotes,
  onBookmark, 
  onLike,
  onNotesChange,
  canAccess = true
}) {
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [notes, setNotes] = useState(userNotes || '')

  if (!problem) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const handleNotesChange = (value) => {
    setNotes(value)
    onNotesChange?.(value)
  }

  const renderPremiumBadge = () => {
    if (!problem.isPremium) return null
    
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-black text-sm font-medium">
        <FaCrown className="w-3 h-3" />
        Premium
      </div>
    )
  }

  const renderAccessRestricted = () => {
    if (canAccess) return null

    return (
      <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md text-center border border-gray-700">
          <FaLock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Premium Problem</h3>
          <p className="text-gray-400 mb-6">
            This problem is available to Premium subscribers only. 
            Upgrade to access advanced problems and features.
          </p>
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white relative">
      {renderAccessRestricted()}
      
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 z-20">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                {renderPremiumBadge()}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty] || 'text-gray-400 bg-gray-800'}`}>
                  {problem.difficulty}
                </span>
                <span className="text-gray-400">
                  Acceptance: {problem.acceptanceRate}%
                </span>
                {problem.frequency && (
                  <span className="text-gray-400">
                    Frequency: {problem.frequency}/5
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={onBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30' 
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-800'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              <button
                onClick={onLike}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'text-red-500 bg-red-500/20 hover:bg-red-500/30' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-800'
                }`}
                title={isLiked ? 'Unlike' : 'Like problem'}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>

          {/* Companies and Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {problem.companies?.slice(0, 3).map((company, index) => (
              <span key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                <FaBuilding className="w-3 h-3" />
                {company}
              </span>
            ))}
            {problem.companies?.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                +{problem.companies.length - 3} more
              </span>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            {[
              { id: 'description', label: 'Description' },
              { id: 'solutions', label: 'Solutions' },
              { id: 'notes', label: 'Notes' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'description' && (
          <div className="p-4 space-y-6">
            {/* Problem Description */}
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: problem.description?.replace(/\n/g, '<br/>') || '' 
                }}
              />
            </div>

            {/* Examples */}
            {problem.examples?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
                <div className="space-y-4">
                  {problem.examples.map((example, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="text-sm font-medium text-gray-300 mb-2">
                        Example {index + 1}:
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Input:</span>
                          <code className="ml-2 px-2 py-1 bg-gray-700 rounded text-green-400">
                            {example.input}
                          </code>
                        </div>
                        <div>
                          <span className="text-gray-400">Output:</span>
                          <code className="ml-2 px-2 py-1 bg-gray-700 rounded text-blue-400">
                            {example.output}
                          </code>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="text-gray-400">Explanation:</span>
                            <span className="ml-2 text-gray-300">{example.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {problem.constraints?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3>
                <ul className="space-y-1 text-gray-300 list-disc list-inside">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm">{constraint}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints */}
            {problem.hints?.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-lg font-semibold text-white mb-3 hover:text-blue-400 transition-colors"
                >
                  <FaLightbulb className="w-4 h-4" />
                  Hints ({problem.hints.length})
                  {showHints ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {showHints && (
                  <div className="space-y-2">
                    {problem.hints.slice(0, currentHint + 1).map((hint, index) => (
                      <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="text-sm text-yellow-200">Hint {index + 1}:</div>
                        <div className="text-sm text-gray-300 mt-1">{hint}</div>
                      </div>
                    ))}
                    {currentHint < problem.hints.length - 1 && (
                      <button
                        onClick={() => setCurrentHint(currentHint + 1)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Show next hint
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {problem.tags?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, index) => (
                    <span key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                      <FaTag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video Solution */}
            {problem.videoSolution?.url && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Video Solution</h3>
                <a
                  href={problem.videoSolution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors w-fit"
                >
                  <FaYoutube className="w-4 h-4" />
                  {problem.videoSolution.title || 'Watch Solution'}
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="p-4">
            <div className="text-center py-12">
              <FaLock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Solutions</h3>
              <p className="text-gray-500">
                Submit your solution to view community solutions and editorial.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Personal Notes</h3>
              <p className="text-gray-400 text-sm">
                Your notes are automatically saved and will be available next time you visit this problem.
              </p>
            </div>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add your notes, observations, or solution approach here..."
              className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}
