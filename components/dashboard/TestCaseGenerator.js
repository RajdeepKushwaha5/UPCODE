'use client'
import { useState } from 'react'
import { 
  PlusIcon, 
  TrashIcon,
  PlayIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'

export default function TestCaseGenerator({ problem, onRunCustomTest }) {
  const [testCases, setTestCases] = useState([
    { id: 1, input: '', expectedOutput: '', description: '' }
  ])
  const [generatingAI, setGeneratingAI] = useState(false)

  const addTestCase = () => {
    const newId = Math.max(...testCases.map(tc => tc.id)) + 1
    setTestCases([...testCases, { 
      id: newId, 
      input: '', 
      expectedOutput: '', 
      description: '' 
    }])
  }

  const removeTestCase = (id) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter(tc => tc.id !== id))
    }
  }

  const updateTestCase = (id, field, value) => {
    setTestCases(testCases.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ))
  }

  const generateAITestCases = async () => {
    setGeneratingAI(true)
    try {
      const response = await fetch('/api/ai/generate-test-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          constraints: problem.constraints,
          examples: problem.examples
        })
      })

      const data = await response.json()
      if (data.success && data.testCases) {
        const newTestCases = data.testCases.map((tc, index) => ({
          id: testCases.length + index + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          description: tc.description || `AI Generated Test Case ${index + 1}`
        }))
        setTestCases([...testCases, ...newTestCases])
      }
    } catch (error) {
      console.error('Error generating test cases:', error)
    } finally {
      setGeneratingAI(false)
    }
  }

  const runTestCase = (testCase) => {
    onRunCustomTest({
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      description: testCase.description
    })
  }

  const copyTestCase = (testCase) => {
    navigator.clipboard.writeText(testCase.input)
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <h3 className="font-semibold text-white">Test Case Generator</h3>
        <div className="flex gap-2">
          <button
            onClick={generateAI}
            disabled={generatingAI}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {generatingAI ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlusIcon className="w-4 h-4" />
            )}
            {generatingAI ? 'Generating...' : 'AI Generate'}
          </button>
          <button
            onClick={addTestCase}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Test Case
          </button>
        </div>
      </div>

      {/* Test Cases */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {testCases.map((testCase, index) => (
          <div key={testCase.id} className="bg-gray-800 rounded-lg border border-gray-700">
            {/* Test Case Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300">
                  Test Case {index + 1}
                </span>
                {testCase.description && (
                  <span className="text-xs text-gray-500">
                    {testCase.description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyTestCase(testCase)}
                  className="p-1.5 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
                  title="Copy input"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => runTestCase(testCase)}
                  disabled={!testCase.input}
                  className="p-1.5 hover:bg-gray-700 text-blue-400 hover:text-blue-300 disabled:text-gray-600 rounded transition-colors"
                  title="Run this test case"
                >
                  <PlayIcon className="w-4 h-4" />
                </button>
                {testCases.length > 1 && (
                  <button
                    onClick={() => removeTestCase(testCase.id)}
                    className="p-1.5 hover:bg-gray-700 text-red-400 hover:text-red-300 rounded transition-colors"
                    title="Delete test case"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Test Case Content */}
            <div className="p-3 space-y-3">
              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={testCase.description}
                  onChange={(e) => updateTestCase(testCase.id, 'description', e.target.value)}
                  placeholder="Describe what this test case checks..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Input */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Input
                </label>
                <textarea
                  value={testCase.input}
                  onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                  placeholder="Enter test input (each line represents a parameter)..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              {/* Expected Output */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Expected Output
                </label>
                <textarea
                  value={testCase.expectedOutput}
                  onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                  placeholder="Enter expected output..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="text-xs text-gray-400">
          <p className="mb-1">
            <strong>Input Format:</strong> Each line represents a parameter for your function
          </p>
          <p>
            <strong>Example:</strong> For array [1,2,3] and target 4, enter each on separate lines
          </p>
        </div>
      </div>
    </div>
  )
}
