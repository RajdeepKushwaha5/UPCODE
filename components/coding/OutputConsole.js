'use client'
import { useState, useEffect } from 'react'
import { 
  FaPlay, FaCheckCircle, FaTimes, FaClock, FaMemory, 
  FaExclamationTriangle, FaChevronDown, FaChevronUp,
  FaCopy, FaTrash, FaTrophy, FaFire
} from 'react-icons/fa'

const STATUS_CONFIG = {
  'Accepted': {
    icon: FaCheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  'Wrong Answer': {
    icon: FaTimes,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  'Time Limit Exceeded': {
    icon: FaClock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  'Memory Limit Exceeded': {
    icon: FaMemory,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
  'Runtime Error': {
    icon: FaExclamationTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  'Compilation Error': {
    icon: FaExclamationTriangle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
  'Running': {
    icon: FaPlay,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  }
}

export default function OutputConsole({ 
  results = [], 
  isRunning = false, 
  onClear,
  onRunTests,
  problem
}) {
  const [activeTab, setActiveTab] = useState('testcase')
  const [selectedResult, setSelectedResult] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const latestResult = results[results.length - 1]
  const hasResults = results.length > 0

  // Auto-scroll to latest result
  useEffect(() => {
    if (results.length > 0) {
      setSelectedResult(results.length - 1)
    }
  }, [results.length])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const formatExecutionTime = (time) => {
    if (!time) return 'N/A'
    return `${time}ms`
  }

  const formatMemoryUsage = (memory) => {
    if (!memory) return 'N/A'
    return `${(memory / 1024).toFixed(1)} MB`
  }

  const renderStatusIcon = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG['Runtime Error']
    const IconComponent = config.icon
    return <IconComponent className={`w-4 h-4 ${config.color}`} />
  }

  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG['Runtime Error']
  }

  const renderTestResult = (result, index) => {
    const statusConfig = getStatusConfig(result.status)
    
    return (
      <div
        key={index}
        className={`border rounded-lg p-4 ${statusConfig.bgColor} ${statusConfig.borderColor} cursor-pointer transition-all hover:opacity-80 ${
          selectedResult === index ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setSelectedResult(index)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {renderStatusIcon(result.status)}
            <span className={`font-medium ${statusConfig.color}`}>
              {result.status}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Test Case {index + 1}
          </div>
        </div>

        {result.status === 'Accepted' && (
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <FaClock className="w-3 h-3" />
              {formatExecutionTime(result.runtime)}
            </div>
            <div className="flex items-center gap-1">
              <FaMemory className="w-3 h-3" />
              {formatMemoryUsage(result.memory)}
            </div>
          </div>
        )}

        {result.status === 'Wrong Answer' && (
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Expected:</span>
              <code className="ml-2 px-2 py-1 bg-gray-800 rounded text-green-400">
                {result.expected}
              </code>
            </div>
            <div>
              <span className="text-gray-400">Output:</span>
              <code className="ml-2 px-2 py-1 bg-gray-800 rounded text-red-400">
                {result.output}
              </code>
            </div>
          </div>
        )}

        {result.error && (
          <div className="mt-2">
            <div className="text-xs text-gray-400 mb-1">Error:</div>
            <pre className="text-xs text-red-400 bg-gray-800 p-2 rounded overflow-x-auto">
              {result.error}
            </pre>
          </div>
        )}
      </div>
    )
  }

  const renderSubmissionResult = (result) => {
    const statusConfig = getStatusConfig(result.status)
    const isAccepted = result.status === 'Accepted'
    
    return (
      <div className={`border rounded-lg p-6 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {renderStatusIcon(result.status)}
            <h3 className={`text-lg font-bold ${statusConfig.color}`}>
              {result.status}
            </h3>
          </div>
          
          {isAccepted && (
            <div className="flex items-center gap-2 text-yellow-500">
              <FaTrophy className="w-5 h-5" />
              <span className="text-sm font-medium">Problem Solved!</span>
            </div>
          )}
        </div>

        {isAccepted && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Runtime</div>
              <div className="text-sm font-medium text-white">
                {formatExecutionTime(result.runtime)}
              </div>
              <div className="text-xs text-green-400">
                Beats {result.runtimePercentile || '85'}%
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Memory</div>
              <div className="text-sm font-medium text-white">
                {formatMemoryUsage(result.memory)}
              </div>
              <div className="text-xs text-green-400">
                Beats {result.memoryPercentile || '72'}%
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Test Cases</div>
              <div className="text-sm font-medium text-white">
                {result.totalTests || 0} / {result.totalTests || 0}
              </div>
              <div className="text-xs text-green-400">Passed</div>
            </div>
          </div>
        )}

        {!isAccepted && result.failedTest && (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-gray-400">Failed on test case:</span>
              <span className="ml-2 text-white">{result.failedTest.index + 1}</span>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Input:</span>
                <code className="ml-2 px-2 py-1 bg-gray-700 rounded text-gray-300">
                  {result.failedTest.input}
                </code>
              </div>
              <div>
                <span className="text-gray-400">Expected:</span>
                <code className="ml-2 px-2 py-1 bg-gray-700 rounded text-green-400">
                  {result.failedTest.expected}
                </code>
              </div>
              <div>
                <span className="text-gray-400">Output:</span>
                <code className="ml-2 px-2 py-1 bg-gray-700 rounded text-red-400">
                  {result.failedTest.output}
                </code>
              </div>
            </div>
          </div>
        )}

        {result.error && (
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">Error Details:</div>
            <pre className="text-sm text-red-400 bg-gray-800 p-3 rounded overflow-x-auto">
              {result.error}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          {/* Tab Navigation */}
          <div className="flex">
            {[
              { id: 'testcase', label: 'Testcase' },
              { id: 'result', label: 'Result' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 bg-blue-500/20 rounded-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {hasResults && (
            <div className="text-xs text-gray-400">
              {results.length} execution{results.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasResults && (
            <button
              onClick={onClear}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Clear Results"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'testcase' && (
          <div className="p-4">
            {isRunning ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <div className="text-gray-400">Running test cases...</div>
                </div>
              </div>
            ) : hasResults ? (
              <div className="space-y-4">
                {results.map((result, index) => renderTestResult(result, index))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaPlay className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  Run Your Code
                </h3>
                <p className="text-gray-500 mb-4">
                  Click "Run" to test your solution with the provided examples.
                </p>
                <button
                  onClick={onRunTests}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  Run Code
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'result' && (
          <div className="p-4">
            {latestResult?.isSubmission ? (
              renderSubmissionResult(latestResult)
            ) : (
              <div className="text-center py-12">
                <FaTrophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  Submit Your Solution
                </h3>
                <p className="text-gray-500">
                  Submit your code to see detailed results and performance metrics.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {hasResults && !isRunning && (
        <div className="border-t border-gray-700 p-3 bg-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span>Last run: {new Date().toLocaleTimeString()}</span>
              {latestResult?.runtime && (
                <div className="flex items-center gap-1">
                  <FaClock className="w-3 h-3" />
                  {formatExecutionTime(latestResult.runtime)}
                </div>
              )}
              {latestResult?.memory && (
                <div className="flex items-center gap-1">
                  <FaMemory className="w-3 h-3" />
                  {formatMemoryUsage(latestResult.memory)}
                </div>
              )}
            </div>
            
            {latestResult?.status === 'Accepted' && (
              <div className="flex items-center gap-1 text-green-400">
                <FaFire className="w-3 h-3" />
                <span>Great job!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
