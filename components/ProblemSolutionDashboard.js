'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlay,
  FaUpload,
  FaLightbulb,
  FaExpand,
  FaCompress,
  FaCode,
  FaCog,
  FaHistory,
  FaCheck,
  FaTimes,
  FaClock,
  FaFire,
  FaBookmark,
  FaShare,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaTerminal,
  FaRedo,
  FaArrowLeft,
  FaThumbsUp,
  FaThumbsDown,
  FaQuestionCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBug,
  FaRocket,
  FaList,
  FaEye,
  FaStar
} from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Editor from '@monaco-editor/react'
import confetti from 'canvas-confetti'

const languages = [
  {
    value: 'javascript',
    label: 'JavaScript',
    template: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
    
};`
  },
  {
    value: 'python',
    label: 'Python',
    template: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass`
  },
  {
    value: 'java',
    label: 'Java',
    template: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`
  },
  {
    value: 'cpp',
    label: 'C++',
    template: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`
  }
]

export default function ProblemSolutionDashboard({ problem }) {
  const router = useRouter()
  const { data: session } = useSession()
  const editorRef = useRef(null)

  // State management
  const [activeTab, setActiveTab] = useState('description')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [leftPanelWidth, setLeftPanelWidth] = useState(50)
  const [isResizing, setIsResizing] = useState(false)
  const [showTestCase, setShowTestCase] = useState(false)
  const [selectedTestCase, setSelectedTestCase] = useState(0)
  const [customInput, setCustomInput] = useState('')
  const [outputData, setOutputData] = useState('')
  const [consoleOutput, setConsoleOutput] = useState('')
  const [executionTime, setExecutionTime] = useState(null)
  const [memoryUsage, setMemoryUsage] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showSolutions, setShowSolutions] = useState(false)
  const [showSubmissions, setShowSubmissions] = useState(false)

  useEffect(() => {
    if (problem && problem.starterCode && problem.starterCode[selectedLanguage]) {
      setCode(problem.starterCode[selectedLanguage])
    } else {
      const template = languages.find(lang => lang.value === selectedLanguage)?.template || ''
      setCode(template)
    }
  }, [selectedLanguage, problem])

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor

    // Configure editor theme
    monaco.editor.defineTheme('upcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'type', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#0F0F23',
        'editor.foreground': '#CCCCCC',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
      }
    })
    monaco.editor.setTheme('upcode-dark')
  }

  const runCode = async () => {
    setIsRunning(true)
    setTestResults([])
    setOutputData('')
    setConsoleOutput('')

    try {
      // Simulate API call to run code
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock test results
      const mockResults = [
        {
          input: 'nums = [2,7,11,15], target = 9',
          expectedOutput: '[0,1]',
          actualOutput: '[0,1]',
          passed: true,
          executionTime: '0ms',
          memory: '41.3 MB'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          expectedOutput: '[1,2]',
          actualOutput: '[1,2]',
          passed: true,
          executionTime: '1ms',
          memory: '41.5 MB'
        }
      ]

      setTestResults(mockResults)
      setExecutionTime('1ms')
      setMemoryUsage('41.4 MB')
      setConsoleOutput('Code executed successfully!')

    } catch (error) {
      setConsoleOutput('Error: ' + error.message)
    } finally {
      setIsRunning(false)
    }
  }

  const submitCode = async () => {
    // Check if user is authenticated
    if (!session) {
      alert('Please log in to submit your solution!')
      router.push('/login')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Show success animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Add to submissions history
      const newSubmission = {
        id: Date.now(),
        language: selectedLanguage,
        status: 'Accepted',
        runtime: '1ms',
        memory: '41.4 MB',
        timestamp: new Date().toLocaleString(),
        code: code
      }

      setSubmissions(prev => [newSubmission, ...prev])

      // Show success message
      alert('🎉 Congratulations! Your solution has been accepted!')

    } catch (error) {
      alert('Submission failed: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyBg = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-500/10 border-green-500/20'
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/20'
      case 'hard': return 'bg-red-500/10 border-red-500/20'
      default: return 'bg-gray-500/10 border-gray-500/20'
    }
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/problems')}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <FaArrowLeft className="text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-3">
                  {problem.id}. {problem.title}
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyBg(problem.difficulty)}`}>
                    <span className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </span>
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Problem Actions */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-colors ${isLiked ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                <FaThumbsUp />
              </button>
              <button
                onClick={() => setIsDisliked(!isDisliked)}
                className={`p-2 rounded-lg transition-colors ${isDisliked ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                <FaThumbsDown />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                <FaBookmark />
              </button>
              <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                <FaShare />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Problem Description */}
        <div
          className="bg-gray-800/30 border-r border-gray-700 overflow-hidden"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <div className="h-full flex flex-col">
            {/* Tabs */}
            <div className="flex bg-gray-800/50 border-b border-gray-700">
              {[
                { id: 'description', label: 'Description', icon: FaQuestionCircle },
                { id: 'solutions', label: 'Solutions', icon: FaLightbulb },
                { id: 'submissions', label: 'Submissions', icon: FaHistory }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  <tab.icon className="text-xs" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  {/* Problem Statement */}
                  <div>
                    <p className="text-gray-300 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Examples</h3>
                    {problem.examples?.map((example, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Input:</span>
                            <pre className="text-gray-300 mt-1 font-mono text-sm">{example.input}</pre>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm font-medium">Output:</span>
                            <pre className="text-gray-300 mt-1 font-mono text-sm">{example.output}</pre>
                          </div>
                          {example.explanation && (
                            <div>
                              <span className="text-gray-400 text-sm font-medium">Explanation:</span>
                              <p className="text-gray-300 mt-1 text-sm">{example.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  {problem.constraints && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3>
                      <ul className="space-y-1">
                        {problem.constraints.map((constraint, index) => (
                          <li key={index} className="text-gray-300 text-sm font-mono">
                            • {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'solutions' && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <FaLock className="mx-auto text-gray-500 text-3xl mb-4" />
                    <p className="text-gray-400">Solutions will be available after you solve this problem</p>
                  </div>
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  {submissions.length === 0 ? (
                    <div className="text-center py-8">
                      <FaHistory className="mx-auto text-gray-500 text-3xl mb-4" />
                      <p className="text-gray-400">No submissions yet</p>
                    </div>
                  ) : (
                    submissions.map(submission => (
                      <div key={submission.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${submission.status === 'Accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                              {submission.status}
                            </span>
                            <span className="text-gray-400 text-sm">{submission.language}</span>
                          </div>
                          <span className="text-gray-500 text-xs">{submission.timestamp}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>Runtime: {submission.runtime}</span>
                          <span>Memory: {submission.memory}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resizer */}
        <div
          className="w-1 bg-gray-600 hover:bg-purple-500 cursor-col-resize transition-colors"
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-gray-900/30">
          {/* Editor Header */}
          <div className="bg-gray-800/50 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Language Selector */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>

                {/* Editor Settings */}
                <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                  <FaCog />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={selectedLanguage}
              value={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>

          {/* Bottom Panel - Test Cases & Output */}
          <div className="h-48 border-t border-gray-700 bg-gray-800/30">
            <div className="h-full flex flex-col">
              {/* Test Case Tabs */}
              <div className="flex bg-gray-800/50 border-b border-gray-700">
                <button
                  onClick={() => setShowTestCase(false)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${!showTestCase
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  <FaTerminal className="inline mr-2" />
                  Console
                </button>
                <button
                  onClick={() => setShowTestCase(true)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${showTestCase
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  <FaList className="inline mr-2" />
                  Testcase
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {!showTestCase ? (
                  // Console Output
                  <div className="space-y-3">
                    {testResults.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Test Results:</h4>
                        {testResults.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${result.passed
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                              }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {result.passed ? <FaCheckCircle /> : <FaTimesCircle />}
                              <span className="font-medium">Test Case {index + 1}</span>
                            </div>
                            <div className="text-xs space-y-1">
                              <div>Input: {result.input}</div>
                              <div>Expected: {result.expectedOutput}</div>
                              <div>Output: {result.actualOutput}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {consoleOutput && (
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap">{consoleOutput}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  // Test Cases
                  <div className="space-y-3">
                    <div className="flex gap-2 mb-4">
                      {problem.testCases?.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTestCase(index)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${selectedTestCase === index
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                          Case {index + 1}
                        </button>
                      ))}
                    </div>

                    {problem.testCases?.[selectedTestCase] && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">nums =</label>
                          <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
                            <code className="text-gray-300">{JSON.stringify(problem.testCases[selectedTestCase].input.nums)}</code>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">target =</label>
                          <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
                            <code className="text-gray-300">{problem.testCases[selectedTestCase].input.target}</code>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-800/50 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {executionTime && (
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaClock /> {executionTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRocket /> {memoryUsage}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <FaPlay />
                      <span>Run</span>
                    </>
                  )}
                </button>

                <button
                  onClick={submitCode}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
