'use client'
import { useState, useEffect, useRef } from 'react'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  CpuChipIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

export default function EnhancedOutputConsole({ 
  results = [], 
  lastRunStatus, 
  isVisible = true, 
  onToggle,
  isMobile = false 
}) {
  const [expandedResults, setExpandedResults] = useState(new Set())
  const [showPassedTests, setShowPassedTests] = useState(true)
  const consoleRef = useRef(null)

  // Auto-scroll to bottom when new results arrive
  useEffect(() => {
    if (consoleRef.current && results.length > 0) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [results])

  const toggleResultExpansion = (index) => {
    const newExpanded = new Set(expandedResults)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedResults(newExpanded)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />
      case 'Wrong Answer':
        return <XCircleIcon className="w-5 h-5 text-red-400" />
      case 'Time Limit Exceeded':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />
      case 'Memory Limit Exceeded':
        return <CpuChipIcon className="w-5 h-5 text-orange-400" />
      case 'Runtime Error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
      case 'Compilation Error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'Wrong Answer':
        return 'text-red-400 bg-red-900/20 border-red-500/30'
      case 'Time Limit Exceeded':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      case 'Memory Limit Exceeded':
        return 'text-orange-400 bg-orange-900/20 border-orange-500/30'
      case 'Runtime Error':
        return 'text-red-400 bg-red-900/20 border-red-500/30'
      case 'Compilation Error':
        return 'text-red-400 bg-red-900/20 border-red-500/30'
      default:
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
    }
  }

  const formatTestCaseResult = (testCase, index) => {
    return (
      <div key={index} className={`border rounded-lg p-3 ${
        testCase.passed 
          ? 'border-green-500/30 bg-green-900/10' 
          : 'border-red-500/30 bg-red-900/10'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {testCase.passed ? (
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm font-medium text-gray-300">
              Test Case {index + 1}
            </span>
          </div>
          
          {testCase.runtime && (
            <div className="text-xs text-gray-400">
              {testCase.runtime}ms
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Input: </span>
            <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">
              {testCase.input}
            </code>
          </div>
          
          <div>
            <span className="text-gray-400">Expected: </span>
            <code className="bg-gray-800 px-2 py-1 rounded text-green-300">
              {testCase.expected}
            </code>
          </div>
          
          <div>
            <span className="text-gray-400">Output: </span>
            <code className={`bg-gray-800 px-2 py-1 rounded ${
              testCase.passed ? 'text-green-300' : 'text-red-300'
            }`}>
              {testCase.output}
            </code>
          </div>
          
          {testCase.error && (
            <div>
              <span className="text-gray-400">Error: </span>
              <code className="bg-red-900/20 px-2 py-1 rounded text-red-300">
                {testCase.error}
              </code>
            </div>
          )}
        </div>
      </div>
    )
  }

  const latestResult = results[results.length - 1]

  if (!isVisible) {
    return (
      <div className="border-t border-gray-700 bg-gray-800">
        <button
          onClick={onToggle}
          className="w-full p-2 text-gray-400 hover:text-gray-300 text-sm flex items-center justify-center gap-2"
        >
          <ChevronUpIcon className="w-4 h-4" />
          Show Console
        </button>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-700 bg-gray-800 flex flex-col max-h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-gray-300">Console</h3>
          
          {latestResult && (
            <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs border ${getStatusColor(latestResult.status)}`}>
              {getStatusIcon(latestResult.status)}
              {latestResult.status}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowPassedTests(!showPassedTests)}
            className={`p-1 rounded text-xs ${
              showPassedTests 
                ? 'text-green-400 bg-green-900/30' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            title={showPassedTests ? 'Hide passed tests' : 'Show passed tests'}
          >
            {showPassedTests ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
          </button>

          {/* Collapse */}
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-300"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-3"
      >
        {results.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <InformationCircleIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Run your code to see results here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, resultIndex) => (
              <div key={resultIndex} className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                {/* Result Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded text-sm border ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      {result.status}
                    </div>
                    
                    {result.isSubmission && (
                      <span className="px-2 py-1 bg-purple-900/30 theme-text-secondary text-xs rounded border border-purple-500/30">
                        Submission
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {result.runtime && (
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {result.runtime}
                      </span>
                    )}
                    
                    {result.memory && (
                      <span className="flex items-center gap-1">
                        <CpuChipIcon className="w-3 h-3" />
                        {result.memory}
                      </span>
                    )}
                    
                    <span>{result.language}</span>
                  </div>
                </div>

                {/* Summary Stats */}
                {result.testCases && (
                  <div className="mb-3 p-2 bg-gray-800 rounded border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        Test Cases: {result.testCases.filter(tc => tc.passed).length} / {result.testCases.length} passed
                      </span>
                      
                      {result.testCases.length > 3 && (
                        <button
                          onClick={() => toggleResultExpansion(resultIndex)}
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                        >
                          {expandedResults.has(resultIndex) ? 'Show Less' : 'Show All'}
                          {expandedResults.has(resultIndex) ? 
                            <ChevronUpIcon className="w-3 h-3" /> : 
                            <ChevronDownIcon className="w-3 h-3" />
                          }
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Compilation Error */}
                {result.status === 'Compilation Error' && result.error && (
                  <div className="mb-3 p-3 bg-red-900/20 border border-red-500/30 rounded">
                    <h4 className="text-sm font-medium text-red-400 mb-2">Compilation Error:</h4>
                    <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono">
                      {result.error}
                    </pre>
                  </div>
                )}

                {/* Runtime Error */}
                {result.status === 'Runtime Error' && result.error && (
                  <div className="mb-3 p-3 bg-red-900/20 border border-red-500/30 rounded">
                    <h4 className="text-sm font-medium text-red-400 mb-2">Runtime Error:</h4>
                    <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono">
                      {result.error}
                    </pre>
                  </div>
                )}

                {/* Test Cases */}
                {result.testCases && (
                  <div className="space-y-2">
                    {result.testCases
                      .filter((testCase, index) => {
                        // Show first 3 test cases, or all if expanded
                        const shouldShow = index < 3 || expandedResults.has(resultIndex)
                        // Apply passed/failed filter
                        return shouldShow && (showPassedTests || !testCase.passed)
                      })
                      .map((testCase, index) => formatTestCaseResult(testCase, index))
                    }
                  </div>
                )}

                {/* Custom Output */}
                {result.output && !result.testCases && (
                  <div className="mt-3 p-3 bg-gray-800 border border-gray-600 rounded">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Output:</h4>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {result.output}
                    </pre>
                  </div>
                )}

                {/* Timestamp */}
                <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-500">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
