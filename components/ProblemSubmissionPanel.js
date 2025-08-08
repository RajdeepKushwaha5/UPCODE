'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlay,
  FaUpload,
  FaLightbulb,
  FaEye,
  FaEyeSlash,
  FaExpand,
  FaCompress,
  FaCode,
  FaCog,
  FaHistory,
  FaCheck,
  FaTimes,
  FaClock,
  FaFire,
  FaHeart,
  FaHeartBroken,
  FaBookmark,
  FaShare,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaTerminal,
  FaRedo,
  FaLock,
  FaArrowLeft,
  FaThumbsUp,
  FaThumbsDown,
  FaQuestionCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
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
    
};`
  },
  {
    value: 'python',
    label: 'Python',
    template: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `
  },
  {
    value: 'java',
    label: 'Java',
    template: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`
  },
  {
    value: 'cpp',
    label: 'C++',
    template: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`
  }
]

export default function ProblemSubmissionPanel({ problem }) {
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
  const [showHint, setShowHint] = useState(false)
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
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
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
      alert('Congratulations! Your solution has been accepted!')

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

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading problem...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}>
      {/* Header */}
      <div className="bg-gray-800/90 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/problems')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-gray-400 text-sm">#{problem.id}</span>
                  {problem.acceptance_rate && (
                    <span className="text-gray-400 text-sm">
                      Acceptance: {problem.acceptance_rate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <FaBookmark className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <FaShare className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <FaHeart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Problem Description */}
        <div
          className="bg-gray-800 border-r border-gray-700 overflow-hidden flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {['description', 'editorial', 'solutions', 'submissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors capitalize ${activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700/50'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    {problem.description || `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`}
                  </p>
                </div>

                {problem.examples && problem.examples.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-4">Examples</h3>
                    {problem.examples.map((example, idx) => (
                      <div key={idx} className="bg-gray-900 rounded-lg p-4 mb-4">
                        <div className="text-white font-medium mb-2">Example {idx + 1}:</div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-400">Input: </span>
                            <code className="text-green-400 bg-gray-800 px-2 py-1 rounded">
                              {example.input}
                            </code>
                          </div>
                          <div>
                            <span className="text-gray-400">Output: </span>
                            <code className="text-blue-400 bg-gray-800 px-2 py-1 rounded">
                              {example.output}
                            </code>
                          </div>
                          {example.explanation && (
                            <div>
                              <span className="text-gray-400">Explanation: </span>
                              <span className="text-gray-300">{example.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints && problem.constraints.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-4">Constraints</h3>
                    <ul className="space-y-2">
                      {problem.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <code className="bg-gray-900 px-2 py-1 rounded text-sm">
                            {constraint}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {problem.tags && problem.tags.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Your Submissions</h3>
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <div key={submission.id} className="bg-gray-900 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <FaCheckCircle className="text-green-400 w-5 h-5" />
                          <span className="text-green-400 font-medium">{submission.status}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{submission.timestamp}</span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-300">
                        <span>Runtime: {submission.runtime}</span>
                        <span>Memory: {submission.memory}</span>
                        <span>Language: {submission.language}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No submissions yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Editor Header */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2"
                >
                  <FaLightbulb />
                  <span>Hint</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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

          {/* Code Editor */}
          <div className="flex-1">
            <Editor
              height="60%"
              language={selectedLanguage}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                contextmenu: false,
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
              }}
            />
          </div>

          {/* Test Results/Console */}
          <div className="h-40 bg-gray-800 border-t border-gray-700">
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setShowTestCase(false)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${!showTestCase ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
              >
                Console
              </button>
              <button
                onClick={() => setShowTestCase(true)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${showTestCase ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
              >
                Test Results
              </button>
            </div>

            <div className="p-4 h-32 overflow-y-auto">
              {!showTestCase ? (
                <div className="space-y-2">
                  <div className="text-gray-300 font-mono text-sm">
                    {consoleOutput || 'Click "Run" to see output...'}
                  </div>
                  {executionTime && (
                    <div className="text-gray-400 text-xs">
                      Execution time: {executionTime} | Memory: {memoryUsage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.length > 0 ? (
                    testResults.map((result, idx) => (
                      <div key={idx} className="bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <FaCheckCircle className="text-green-400 w-4 h-4" />
                          ) : (
                            <FaTimesCircle className="text-red-400 w-4 h-4" />
                          )}
                          <span className={`text-sm font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                            Test Case {idx + 1} {result.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="text-gray-400">Input: <span className="text-white">{result.input}</span></div>
                          <div className="text-gray-400">Expected: <span className="text-green-400">{result.expectedOutput}</span></div>
                          <div className="text-gray-400">Output: <span className={result.passed ? 'text-green-400' : 'text-red-400'}>{result.actualOutput}</span></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">Run your code to see test results...</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowHint(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <FaLightbulb className="text-yellow-400 w-5 h-5" />
                <h3 className="text-white font-semibold">Hint</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Try using a hash map to store the numbers you've seen and their indices.
                For each number, check if its complement (target - current number) exists in the hash map.
              </p>
              <button
                onClick={() => setShowHint(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
