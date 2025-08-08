'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaStepForward,
  FaStepBackward,
  FaArrowLeft,
  FaCogs,
  FaTree,
  FaSearch
} from 'react-icons/fa'

const BSTSearch = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [searchValue, setSearchValue] = useState(35)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [searchPath, setSearchPath] = useState([])
  const [searchResult, setSearchResult] = useState(null)
  const [comparisons, setComparisons] = useState(0)
  const [manualValue, setManualValue] = useState('')

  // BST Node class
  class TreeNode {
    constructor(value) {
      this.value = value
      this.left = null
      this.right = null
      this.id = `node-${value}-${Date.now()}`
    }
  }

  // Generate initial BST
  const generateTree = useCallback(() => {
    const root = new TreeNode(50)
    root.left = new TreeNode(30)
    root.right = new TreeNode(70)
    root.left.left = new TreeNode(20)
    root.left.right = new TreeNode(40)
    root.left.left.left = new TreeNode(10)
    root.left.right.left = new TreeNode(35)
    root.right.left = new TreeNode(60)
    root.right.right = new TreeNode(80)
    root.right.right.right = new TreeNode(90)
    
    setTree(root)
    setCurrentStep(0)
    setCurrentNode(null)
    setSearchPath([])
    setSearchResult(null)
    setComparisons(0)
    setIsPlaying(false)
    generateSteps(root, searchValue)
  }, [searchValue])

  // Generate search steps
  const generateSteps = (tree, target) => {
    const steps = []
    const path = []
    let comparisonCount = 0
    let found = false
    
    steps.push({
      type: 'initial',
      current: null,
      path: [],
      comparisons: 0,
      result: null,
      description: `Starting BST search for value ${target}. Begin at root node.`
    })

    let current = tree
    while (current) {
      path.push(current.value)
      comparisonCount++
      
      steps.push({
        type: 'compare',
        current: current.value,
        path: [...path],
        comparisons: comparisonCount,
        result: null,
        description: `Compare ${target} with current node ${current.value}. ${target} ${target < current.value ? '<' : target > current.value ? '>' : '='} ${current.value}`
      })

      if (target === current.value) {
        found = true
        steps.push({
          type: 'found',
          current: current.value,
          path: [...path],
          comparisons: comparisonCount,
          result: 'found',
          description: `Success! Found ${target} at node ${current.value}. Search complete.`
        })
        break
      } else if (target < current.value) {
        steps.push({
          type: 'go_left',
          current: current.value,
          path: [...path],
          comparisons: comparisonCount,
          result: null,
          description: `${target} < ${current.value}, so search in LEFT subtree.`
        })
        current = current.left
      } else {
        steps.push({
          type: 'go_right',
          current: current.value,
          path: [...path],
          comparisons: comparisonCount,
          result: null,
          description: `${target} > ${current.value}, so search in RIGHT subtree.`
        })
        current = current.right
      }
    }

    if (!found) {
      steps.push({
        type: 'not_found',
        current: null,
        path: [...path],
        comparisons: comparisonCount,
        result: 'not_found',
        description: `Search failed. Value ${target} not found in BST after ${comparisonCount} comparisons.`
      })
    }

    steps.push({
      type: 'complete',
      current: null,
      path: [...path],
      comparisons: comparisonCount,
      result: found ? 'found' : 'not_found',
      description: `BST search complete. Made ${comparisonCount} comparisons. Result: ${found ? 'FOUND' : 'NOT FOUND'}`
    })

    setSteps(steps)
  }

  // Manual search
  const searchManualValue = () => {
    const value = parseInt(manualValue)
    if (isNaN(value) || value < 1 || value > 100) return
    
    setSearchValue(value)
    setManualValue('')
    generateSteps(tree, value)
  }

  // Initialize
  useEffect(() => {
    generateTree()
  }, [generateTree])

  // Play animation
  useEffect(() => {
    let interval
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1
          if (nextStep >= steps.length - 1) {
            setIsPlaying(false)
          }
          return nextStep
        })
      }, 2000 - speed)
    } else {
      setIsPlaying(false)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, speed])

  // Update visualization state based on current step
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setCurrentNode(step.current)
      setSearchPath(step.path)
      setSearchResult(step.result)
      setComparisons(step.comparisons)
    }
  }, [currentStep, steps])

  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)
  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getNodeColor = (nodeValue) => {
    if (currentNode === nodeValue) {
      if (searchResult === 'found' && nodeValue === searchValue) {
        return 'fill-green-500 stroke-green-400 animate-pulse'
      }
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (searchPath.includes(nodeValue)) return 'fill-blue-500 stroke-blue-400'
    return 'fill-gray-500 stroke-gray-400'
  }

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null

    const nodeSize = 50
    const levelSpacing = 120
    const horizontalSpacing = Math.pow(2, 4 - level) * 40

    return (
      <g key={node.id}>
        {/* Left child connection */}
        {node.left && (
          <line
            x1={x}
            y1={y + nodeSize / 2}
            x2={x - horizontalSpacing}
            y2={y + levelSpacing - nodeSize / 2}
            stroke="#6B7280"
            strokeWidth="2"
          />
        )}
        
        {/* Right child connection */}
        {node.right && (
          <line
            x1={x}
            y1={y + nodeSize / 2}
            x2={x + horizontalSpacing}
            y2={y + levelSpacing - nodeSize / 2}
            stroke="#6B7280"
            strokeWidth="2"
          />
        )}

        {/* Highlight path with glow effect */}
        {searchPath.includes(node.value) && (
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2 + 5}
            className="fill-none stroke-blue-400 stroke-2 opacity-50"
          />
        )}

        {/* Current node */}
        <circle
          cx={x}
          cy={y}
          r={nodeSize / 2}
          className={`${getNodeColor(node.value)} transition-all duration-500 stroke-2`}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="fill-white font-bold text-lg"
        >
          {node.value}
        </text>

        {/* Search target indicator */}
        {node.value === searchValue && searchResult === 'found' && (
          <text
            x={x}
            y={y - 35}
            textAnchor="middle"
            className="fill-green-400 font-bold text-sm"
          >
            FOUND!
          </text>
        )}

        {/* Visit order */}
        {searchPath.includes(node.value) && (
          <text
            x={x + 30}
            y={y - 25}
            textAnchor="middle"
            className="fill-cyan-400 font-bold text-xs"
          >
            {searchPath.indexOf(node.value) + 1}
          </text>
        )}

        {/* Recursively render children */}
        {node.left && renderNode(node.left, x - horizontalSpacing, y + levelSpacing, level + 1)}
        {node.right && renderNode(node.right, x + horizontalSpacing, y + levelSpacing, level + 1)}
      </g>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dsa-visualizer')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Binary Search Tree Search
                </h1>
                <p className="text-gray-400 text-sm">Efficient searching using BST property</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaSearch className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">BST Operation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaCogs className="w-5 h-5" />
                Controls
              </h2>
              
              {/* Search Value */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Search Value: {searchValue}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={searchValue}
                  onChange={(e) => setSearchValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Manual Search */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Manual Search
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    placeholder="Enter value (1-100)"
                    className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm"
                  />
                  <button
                    onClick={searchManualValue}
                    disabled={!manualValue}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaSearch className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pause : play}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={reset}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaRedo className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={prevStep}
                    disabled={currentStep <= 0}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaStepBackward className="w-4 h-4" />
                    Prev
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaStepForward className="w-4 h-4" />
                    Next
                  </button>
                </div>

                <button
                  onClick={generateTree}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  New Search Demo
                </button>
              </div>

              {/* Settings */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Animation Speed
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1900"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>

              {/* Search Statistics */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Search Statistics:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Target Value:</span>
                    <span className="text-white font-bold">{searchValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Comparisons:</span>
                    <span className="text-blue-400 font-bold">{comparisons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Result:</span>
                    <span className={`font-bold ${
                      searchResult === 'found' ? 'text-green-400' :
                      searchResult === 'not_found' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {searchResult === 'found' ? 'FOUND' :
                       searchResult === 'not_found' ? 'NOT FOUND' : 'SEARCHING...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search Path */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Search Path:</h3>
                <div className="flex flex-wrap gap-2">
                  {searchPath.length === 0 ? (
                    <span className="text-gray-400 text-sm">No path yet</span>
                  ) : (
                    searchPath.map((value, index) => (
                      <React.Fragment key={value}>
                        <span
                          className={`px-2 py-1 rounded text-sm font-bold ${
                            index === searchPath.length - 1 && currentNode === value
                              ? 'bg-yellow-500 text-black'
                              : value === searchValue && searchResult === 'found'
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {value}
                        </span>
                        {index < searchPath.length - 1 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Color Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Unvisited Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">In Search Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Current Comparison</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Target Found</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">BST Search Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* BST Tree Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  <svg width="900" height="600" viewBox="0 0 900 600">
                    {tree && renderNode(tree, 450, 80)}
                  </svg>
                </div>
              </div>

              {/* Search Efficiency */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Search Efficiency:</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-800 rounded p-3 text-center">
                    <div className="text-gray-300">Linear Search</div>
                    <div className="text-red-400 font-bold">O(n)</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3 text-center">
                    <div className="text-gray-300">BST Search</div>
                    <div className="text-green-400 font-bold">O(log n)</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3 text-center">
                    <div className="text-gray-300">This Search</div>
                    <div className="text-blue-400 font-bold">{comparisons} steps</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start BST search'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">BST Search Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(h) where h is height of tree</p>
                  <p><strong>Best Case:</strong> O(log n) - balanced tree</p>
                  <p><strong>Worst Case:</strong> O(n) - skewed tree</p>
                  <p><strong>Space Complexity:</strong> O(h) - recursion stack</p>
                  <p><strong>Strategy:</strong> Eliminate half the search space at each step</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BSTSearch
