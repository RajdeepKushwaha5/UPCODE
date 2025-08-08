'use client'
import { useState, useEffect, useRef } from 'react'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  CpuChipIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  CommandLineIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

export default function OutputConsole({ 
  results, 
  isRunning, 
  isSubmitting, 
  isMobile = false 
}) {
  const [activeTab, setActiveTab] = useState('output')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedTestCase, setSelectedTestCase] = useState(0)
  const scrollRef = useRef(null)

  // Auto-scroll to latest output
  useEffect(() => {
    if (scrollRef.current && results.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [results])

  // Auto-switch to output tab when new results come in
  useEffect(() => {
    if (results.length > 0) {
      setActiveTab('output')
      setIsCollapsed(false)
    }
  }, [results])

  const getLatestResult = () => {
    return results[results.length - 1] || null
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'Wrong Answer':
      case 'Runtime Error':
      case 'Compilation Error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'Time Limit Exceeded':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'Wrong Answer':
        return 'text-red-400 bg-red-900/20 border-red-500/30'
      case 'Runtime Error':
        return 'text-red-400 bg-red-900/20 border-red-500/30'
      case 'Compilation Error':
        return 'text-orange-400 bg-orange-900/20 border-orange-500/30'
      case 'Time Limit Exceeded':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  const renderTestCaseResult = (testCase, index) => {
    const isSelected = selectedTestCase === index
    const isPassed = testCase.status === 'Accepted'
    
    return (
      <div
        key={index}
        onClick={() => setSelectedTestCase(index)}
        className={`p-3 border rounded-lg cursor-pointer transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-900/20'
            : isPassed
            ? 'border-green-500/30 bg-green-900/10 hover:bg-green-900/20'
            : 'border-red-500/30 bg-red-900/10 hover:bg-red-900/20'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(testCase.status)}
            <span className="text-sm font-medium text-white">
              Test Case {index + 1}
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(testCase.status)}`}>
            {testCase.status}
          </span>
        </div>
        
        {isSelected && (
          <div className="space-y-3 mt-3">
            {testCase.input && (
              <div>
                <div className="text-xs font-medium text-gray-400 mb-1">Input:</div>
                <div className="bg-gray-900 p-2 rounded text-sm font-mono text-green-400 border border-gray-600">
                  {testCase.input}
                </div>
              </div>
            )}
            
            {testCase.expectedOutput && (
              <div>
                <div className="text-xs font-medium text-gray-400 mb-1">Expected Output:</div>
                <div className="bg-gray-900 p-2 rounded text-sm font-mono text-blue-400 border border-gray-600">
                  {testCase.expectedOutput}
                </div>
              </div>
            )}
            
            {testCase.actualOutput && (
              <div>
                <div className="text-xs font-medium text-gray-400 mb-1">Your Output:</div>
                <div className={`bg-gray-900 p-2 rounded text-sm font-mono border border-gray-600 ${
                  isPassed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {testCase.actualOutput}
                </div>
              </div>
            )}
            
            {testCase.error && (
              <div>
                <div className="text-xs font-medium text-gray-400 mb-1">Error:</div>
                <div className="bg-red-900/20 p-2 rounded text-sm font-mono text-red-400 border border-red-500/30">
                  {testCase.error}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderExecutionSummary = (result) => {
    if (!result) return null

    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {getStatusIcon(result.status)}
            <span className="text-lg font-semibold text-white">
              {result.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {result.runtime && (
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{result.runtime}</span>
              </div>
            )}
            {result.memory && (
              <div className="flex items-center gap-1">
                <CpuChipIcon className="w-4 h-4" />
                <span>{result.memory}</span>
              </div>
            )}
            {result.language && (
              <div className="px-2 py-1 bg-gray-700 rounded text-xs">
                {result.language}
              </div>
            )}
          </div>
        </div>

        {result.testCases && (
          <div className="mb-3">
            <div className="text-sm text-gray-400 mb-1">
              Test Cases: {result.testCases.filter(tc => tc.status === 'Accepted').length} / {result.testCases.length} passed
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  result.status === 'Accepted' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${(result.testCases.filter(tc => tc.status === 'Accepted').length / result.testCases.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}

        {result.compilationError && (
          <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
            <div className="text-sm font-medium text-red-400 mb-1">Compilation Error:</div>
            <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">
              {result.compilationError}
            </pre>
          </div>
        )}

        {result.runtimeError && (
          <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
            <div className="text-sm font-medium text-red-400 mb-1">Runtime Error:</div>
            <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">
              {result.runtimeError}
            </pre>
          </div>
        )}
      </div>
    )
  }

  const renderOutputContent = () => {
    const latestResult = getLatestResult()

    if (isRunning) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <div className="text-white font-medium">Running Code...</div>
            <div className="text-sm text-gray-400">Executing test cases</div>
          </div>
        </div>
      )
    }

    if (isSubmitting) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
            <div className="text-white font-medium">Submitting Solution...</div>
            <div className="text-sm text-gray-400">Running all test cases</div>
          </div>
        </div>
      )
    }

    if (!latestResult) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <PlayIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <div className="text-lg font-medium">No Output Yet</div>
            <div className="text-sm">Run your code to see results here</div>
          </div>
        </div>
      )
    }

    return (
      <div ref={scrollRef} className="h-full overflow-y-auto p-4">
        {renderExecutionSummary(latestResult)}
        
        {latestResult.testCases && latestResult.testCases.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-300 mb-3">
              Test Cases ({latestResult.testCases.length})
            </div>
            {latestResult.testCases.map(renderTestCaseResult)}
          </div>
        )}
        
        {latestResult.customOutput && (
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-300 mb-2">Custom Input Result:</div>
            <div className="bg-gray-900 p-3 rounded text-sm font-mono text-green-400 border border-gray-600">
              {latestResult.customOutput}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderHistoryContent = () => {
    if (results.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <CommandLineIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <div className="text-lg font-medium">No History</div>
            <div className="text-sm">Your execution history will appear here</div>
          </div>
        </div>
      )
    }

    return (
      <div ref={scrollRef} className="h-full overflow-y-auto p-4">
        <div className="space-y-3">
          {results.slice().reverse().map((result, index) => (
            <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="text-sm font-medium text-white">{result.status}</span>
                  {result.isSubmission && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                      Submission
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-400">
                {result.runtime && <span>Runtime: {result.runtime}</span>}
                {result.memory && <span>Memory: {result.memory}</span>}
                <span>Language: {result.language}</span>
                {result.testCases && (
                  <span>
                    Tests: {result.testCases.filter(tc => tc.status === 'Accepted').length}/{result.testCases.length}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 border-t border-gray-700">
      {/* Console Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('output')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'output'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              History ({results.length})
            </button>
          </div>
        </div>

        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title={isCollapsed ? 'Expand Console' : 'Collapse Console'}
        >
          {isCollapsed ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Console Content */}
      {!isCollapsed && (
        <div className="flex-1 min-h-0">
          {activeTab === 'output' ? renderOutputContent() : renderHistoryContent()}
        </div>
      )}

      {/* Console Footer */}
      {!isCollapsed && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-700 bg-gray-800 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            {(isRunning || isSubmitting) && (
              <>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>{isSubmitting ? 'Submitting...' : 'Running...'}</span>
              </>
            )}
            {!isRunning && !isSubmitting && results.length > 0 && (
              <span>Last execution: {new Date(getLatestResult()?.timestamp).toLocaleTimeString()}</span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span>Console</span>
            {results.length > 0 && (
              <>
                <span>•</span>
                <button
                  onClick={() => {
                    // Clear results (this would be handled by parent component)
                    console.log('Clear console requested')
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
