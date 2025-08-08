'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  FaRobot,
  FaTimes,
  FaSpinner,
  FaPlay,
  FaCheck,
  FaCode,
  FaLightbulb,
  FaGraduationCap,
  FaRandom,
  FaTrophy,
  FaCog
} from 'react-icons/fa'

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard']
const TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming',
  'Binary Search', 'Sorting', 'Hash Tables', 'Stacks', 'Queues', 'Recursion',
  'Greedy', 'Backtracking', 'Two Pointers', 'Sliding Window'
]

const PROGRAMMING_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', template: 'function solution() {\n    // Your code here\n}' },
  { id: 'python', name: 'Python', template: 'def solution():\n    # Your code here\n    pass' },
  { id: 'java', name: 'Java', template: 'public class Solution {\n    public void solution() {\n        // Your code here\n    }\n}' },
  { id: 'cpp', name: 'C++', template: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solution() {\n        // Your code here\n    }\n};' }
]

const AIProblemsGenerator = ({ isOpen, onClose, onProblemGenerated }) => {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    difficulty: 'Medium',
    topics: [],
    language: 'javascript',
    includeHints: true,
    includeTestCases: true
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProblem, setGeneratedProblem] = useState(null)
  const [userSolution, setUserSolution] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const { data: session } = useSession()

  const generateProblem = async () => {
    setIsGenerating(true)

    // Simulate AI problem generation
    await new Promise(resolve => setTimeout(resolve, 3000))

    const problems = {
      Easy: {
        Arrays: {
          title: "Find Maximum Element",
          description: "Given an array of integers, find the maximum element in the array.",
          examples: [
            { input: "[3, 1, 4, 1, 5]", output: "5", explanation: "5 is the largest number in the array." }
          ],
          constraints: ["1 ≤ array.length ≤ 1000", "-1000 ≤ array[i] ≤ 1000"],
          hints: ["Iterate through the array once", "Keep track of the maximum value seen so far"]
        },
        Strings: {
          title: "Reverse String",
          description: "Write a function that reverses a string. The input string is given as an array of characters.",
          examples: [
            { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: "The string is reversed character by character." }
          ],
          constraints: ["1 ≤ s.length ≤ 10^5", "s[i] is a printable ascii character"],
          hints: ["Use two pointers approach", "Swap characters from both ends moving towards center"]
        }
      },
      Medium: {
        Arrays: {
          title: "Product of Array Except Self",
          description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
          examples: [
            { input: "[1,2,3,4]", output: "[24,12,8,6]", explanation: "For index 0: 2*3*4 = 24, for index 1: 1*3*4 = 12, etc." }
          ],
          constraints: ["2 ≤ nums.length ≤ 10^5", "-30 ≤ nums[i] ≤ 30"],
          hints: ["Think about using prefix and suffix products", "Can you solve it without division?"]
        },
        Trees: {
          title: "Binary Tree Level Order Traversal",
          description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
          examples: [
            { input: "[3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]", explanation: "Level 0: [3], Level 1: [9,20], Level 2: [15,7]" }
          ],
          constraints: ["Number of nodes is in range [0, 2000]", "-1000 ≤ Node.val ≤ 1000"],
          hints: ["Use BFS (Breadth-First Search)", "Queue data structure can help"]
        }
      },
      Hard: {
        'Dynamic Programming': {
          title: "Edit Distance",
          description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
          examples: [
            { input: 'word1 = "horse", word2 = "ros"', output: "3", explanation: "horse -> rorse (replace 'h' with 'r'), rorse -> rose (remove 'r'), rose -> ros (remove 'e')" }
          ],
          constraints: ["0 ≤ word1.length, word2.length ≤ 500", "word1 and word2 consist of lowercase English letters"],
          hints: ["Use dynamic programming", "Think about subproblems: what if we know the edit distance for smaller strings?"]
        },
        Graphs: {
          title: "Word Ladder",
          description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence where each adjacent pair differs by a single letter.",
          examples: [
            { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5", explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog"' }
          ],
          constraints: ["1 ≤ beginWord.length ≤ 10", "endWord.length == beginWord.length", "1 ≤ wordList.length ≤ 5000"],
          hints: ["Think of this as a graph problem", "BFS can find the shortest path"]
        }
      }
    }

    const selectedTopic = preferences.topics.length > 0 ? preferences.topics[0] : 'Arrays'
    const problemData = problems[preferences.difficulty]?.[selectedTopic] || problems.Medium.Arrays

    const problem = {
      id: `ai-generated-${Date.now()}`,
      title: problemData.title,
      description: problemData.description,
      difficulty: preferences.difficulty,
      examples: problemData.examples,
      constraints: problemData.constraints,
      hints: preferences.includeHints ? problemData.hints : [],
      language: preferences.language,
      template: PROGRAMMING_LANGUAGES.find(lang => lang.id === preferences.language)?.template || '',
      tags: [selectedTopic, 'AI Generated'],
      testCases: preferences.includeTestCases ? [
        { input: problemData.examples[0].input, expectedOutput: problemData.examples[0].output }
      ] : []
    }

    setGeneratedProblem(problem)
    setUserSolution(problem.template)
    setIsGenerating(false)
    setStep(2)
  }

  const evaluateSolution = async () => {
    setIsEvaluating(true)

    // Simulate AI evaluation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const evaluations = [
      {
        status: 'Excellent',
        score: 95,
        feedback: 'Your solution is correct and efficient! The time complexity is optimal.',
        improvements: ['Consider adding edge case handling', 'Add comments for better readability'],
        passed: true
      },
      {
        status: 'Good',
        score: 78,
        feedback: 'Your solution works but can be optimized for better performance.',
        improvements: ['Try to reduce time complexity', 'Consider using a different data structure'],
        passed: true
      },
      {
        status: 'Needs Improvement',
        score: 45,
        feedback: 'Your solution has logical errors. Please review the algorithm.',
        improvements: ['Check your loop conditions', 'Verify the logic for edge cases'],
        passed: false
      }
    ]

    const result = evaluations[Math.floor(Math.random() * evaluations.length)]
    setEvaluation(result)
    setIsEvaluating(false)
  }

  const resetGenerator = () => {
    setStep(1)
    setGeneratedProblem(null)
    setUserSolution('')
    setEvaluation(null)
    setPreferences({
      difficulty: 'Medium',
      topics: [],
      language: 'javascript',
      includeHints: true,
      includeTestCases: true
    })
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FaRobot className="text-purple-400 text-2xl" />
            <h2 className="text-white text-xl font-bold">AI Problem Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Step 1: Preferences */}
          {step === 1 && (
            <div className="p-6 space-y-6">
              <div className="text-center mb-8">
                <FaGraduationCap className="text-4xl text-purple-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Generate a Custom Problem</h3>
                <p className="text-gray-400">Set your preferences and let AI create a unique problem for you!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty */}
                <div>
                  <label className="block text-white font-medium mb-3">Difficulty Level</label>
                  <div className="space-y-2">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value={level}
                          checked={preferences.difficulty === level}
                          onChange={(e) => setPreferences(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="mr-3"
                        />
                        <span className={`${level === 'Easy' ? 'text-green-400' :
                            level === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                <div>
                  <label className="block text-white font-medium mb-3">Topics (Select up to 3)</label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {TOPICS.map((topic) => (
                      <label key={topic} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.topics.includes(topic)}
                          onChange={(e) => {
                            if (e.target.checked && preferences.topics.length < 3) {
                              setPreferences(prev => ({
                                ...prev,
                                topics: [...prev.topics, topic]
                              }))
                            } else if (!e.target.checked) {
                              setPreferences(prev => ({
                                ...prev,
                                topics: prev.topics.filter(t => t !== topic)
                              }))
                            }
                          }}
                          className="mr-3"
                          disabled={!preferences.topics.includes(topic) && preferences.topics.length >= 3}
                        />
                        <span className="text-gray-300">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Programming Language */}
                <div>
                  <label className="block text-white font-medium mb-3">Programming Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                {/* Additional Options */}
                <div>
                  <label className="block text-white font-medium mb-3">Additional Features</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.includeHints}
                        onChange={(e) => setPreferences(prev => ({ ...prev, includeHints: e.target.checked }))}
                        className="mr-3"
                      />
                      <span className="text-gray-300">Include Hints</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.includeTestCases}
                        onChange={(e) => setPreferences(prev => ({ ...prev, includeTestCases: e.target.checked }))}
                        className="mr-3"
                      />
                      <span className="text-gray-300">Include Test Cases</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  onClick={generateProblem}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400 disabled:to-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Generating Problem...
                    </>
                  ) : (
                    <>
                      <FaRandom />
                      Generate Problem
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Generated Problem & Solution */}
          {step === 2 && generatedProblem && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-bold">{generatedProblem.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${generatedProblem.difficulty === 'Easy' ? 'bg-green-400/20 text-green-400' :
                    generatedProblem.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-red-400/20 text-red-400'
                  }`}>
                  {generatedProblem.difficulty}
                </span>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-300 mb-4">{generatedProblem.description}</p>

                {generatedProblem.examples && (
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Example:</h4>
                    {generatedProblem.examples.map((example, idx) => (
                      <div key={idx} className="bg-gray-800 rounded p-3 mb-2">
                        <div><strong>Input:</strong> <code className="text-blue-400">{example.input}</code></div>
                        <div><strong>Output:</strong> <code className="text-green-400">{example.output}</code></div>
                        {example.explanation && (
                          <div><strong>Explanation:</strong> {example.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {generatedProblem.hints.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <FaLightbulb className="text-yellow-400" />
                      Hints:
                    </h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {generatedProblem.hints.map((hint, idx) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FaCode />
                  Your Solution ({PROGRAMMING_LANGUAGES.find(l => l.id === generatedProblem.language)?.name})
                </h4>
                <textarea
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                  placeholder="Write your solution here..."
                  className="w-full h-64 bg-gray-900 text-white p-4 rounded-lg font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {evaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 ${evaluation.passed
                      ? 'border-green-400/30 bg-green-400/10'
                      : 'border-red-400/30 bg-red-400/10'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {evaluation.passed ? (
                      <FaCheck className="text-green-400" />
                    ) : (
                      <FaTimes className="text-red-400" />
                    )}
                    <h4 className="text-white font-semibold">{evaluation.status}</h4>
                    <span className="text-gray-300">Score: {evaluation.score}/100</span>
                  </div>

                  <p className="text-gray-300 mb-3">{evaluation.feedback}</p>

                  {evaluation.improvements.length > 0 && (
                    <div>
                      <h5 className="text-white font-medium mb-2">Suggestions for improvement:</h5>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {evaluation.improvements.map((improvement, idx) => (
                          <li key={idx}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={resetGenerator}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Generate Another
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={evaluateSolution}
                    disabled={isEvaluating || !userSolution.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <FaTrophy />
                        Evaluate Solution
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onProblemGenerated(generatedProblem)
                      onClose()
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Save Problem
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AIProblemsGenerator
