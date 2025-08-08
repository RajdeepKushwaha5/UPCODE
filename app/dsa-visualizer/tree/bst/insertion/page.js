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
  FaPlus
} from 'react-icons/fa'

const BSTInsertion = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [comparisonNode, setComparisonNode] = useState(null)
  const [insertValue, setInsertValue] = useState(25)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [highlightPath, setHighlightPath] = useState([])
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
    root.right.left = new TreeNode(60)
    root.right.right = new TreeNode(80)
    
    setTree(root)
    setCurrentStep(0)
    setCurrentNode(null)
    setComparisonNode(null)
    setHighlightPath([])
    setIsPlaying(false)
    generateSteps(root, insertValue)
  }, [insertValue])

  // Generate insertion steps
  const generateSteps = (tree, value) => {
    const steps = []
    const path = []
    
    steps.push({
      type: 'initial',
      tree: cloneTree(tree),
      current: null,
      comparison: null,
      path: [],
      description: `Starting BST insertion of value ${value}. Begin at root node.`
    })

    let current = tree
    while (current) {
      path.push(current.value)
      
      steps.push({
        type: 'compare',
        tree: cloneTree(tree),
        current: current.value,
        comparison: null,
        path: [...path],
        description: `Compare ${value} with current node ${current.value}. ${value} ${value < current.value ? '<' : value > current.value ? '>' : '='} ${current.value}`
      })

      if (value === current.value) {
        steps.push({
          type: 'duplicate',
          tree: cloneTree(tree),
          current: current.value,
          comparison: null,
          path: [...path],
          description: `Value ${value} already exists in BST. Insertion canceled (no duplicates allowed).`
        })
        break
      } else if (value < current.value) {
        if (current.left) {
          steps.push({
            type: 'go_left',
            tree: cloneTree(tree),
            current: current.value,
            comparison: null,
            path: [...path],
            description: `${value} < ${current.value}, so go LEFT to continue search.`
          })
          current = current.left
        } else {
          steps.push({
            type: 'insert_left',
            tree: insertNodeInTree(cloneTree(tree), value, current.value, 'left'),
            current: current.value,
            comparison: value,
            path: [...path, value],
            description: `Found empty LEFT child. Insert ${value} as LEFT child of ${current.value}.`
          })
          break
        }
      } else {
        if (current.right) {
          steps.push({
            type: 'go_right',
            tree: cloneTree(tree),
            current: current.value,
            comparison: null,
            path: [...path],
            description: `${value} > ${current.value}, so go RIGHT to continue search.`
          })
          current = current.right
        } else {
          steps.push({
            type: 'insert_right',
            tree: insertNodeInTree(cloneTree(tree), value, current.value, 'right'),
            current: current.value,
            comparison: value,
            path: [...path, value],
            description: `Found empty RIGHT child. Insert ${value} as RIGHT child of ${current.value}.`
          })
          break
        }
      }
    }

    steps.push({
      type: 'complete',
      tree: insertNodeInTree(cloneTree(tree), value, null, null),
      current: null,
      comparison: null,
      path: [],
      description: `BST insertion complete! Value ${value} successfully inserted while maintaining BST property.`
    })

    setSteps(steps)
  }

  // Helper function to clone tree
  const cloneTree = (node) => {
    if (!node) return null
    const newNode = new TreeNode(node.value)
    newNode.id = node.id
    newNode.left = cloneTree(node.left)
    newNode.right = cloneTree(node.right)
    return newNode
  }

  // Helper function to insert node in tree
  const insertNodeInTree = (tree, value, parentValue, direction) => {
    if (!tree) return new TreeNode(value)
    
    if (parentValue === null) {
      // Complete insertion
      const insertInto = (node) => {
        if (!node) return new TreeNode(value)
        
        if (value < node.value) {
          node.left = insertInto(node.left)
        } else if (value > node.value) {
          node.right = insertInto(node.right)
        }
        return node
      }
      return insertInto(tree)
    }
    
    // Find parent and insert
    const findAndInsert = (node) => {
      if (!node) return null
      
      if (node.value === parentValue) {
        if (direction === 'left') {
          node.left = new TreeNode(value)
        } else {
          node.right = new TreeNode(value)
        }
      } else {
        if (node.left) findAndInsert(node.left)
        if (node.right) findAndInsert(node.right)
      }
      return node
    }
    
    return findAndInsert(tree)
  }

  // Manual insertion
  const insertManualValue = () => {
    const value = parseInt(manualValue)
    if (isNaN(value) || value < 1 || value > 100) return
    
    setInsertValue(value)
    setManualValue('')
    
    // Update tree with new value
    const newTree = cloneTree(tree)
    const insertInto = (node) => {
      if (!node) return new TreeNode(value)
      
      if (value < node.value) {
        node.left = insertInto(node.left)
      } else if (value > node.value) {
        node.right = insertInto(node.right)
      }
      return node
    }
    
    setTree(insertInto(newTree))
    generateSteps(insertInto(newTree), value)
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
      setTree(step.tree)
      setCurrentNode(step.current)
      setComparisonNode(step.comparison)
      setHighlightPath(step.path)
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
    if (comparisonNode === nodeValue) return 'fill-green-500 stroke-green-400 animate-pulse'
    if (currentNode === nodeValue) return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    if (highlightPath.includes(nodeValue)) return 'fill-blue-500 stroke-blue-400'
    return 'fill-gray-500 stroke-gray-400'
  }

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null

    const nodeSize = 50
    const levelSpacing = 120
    const horizontalSpacing = Math.pow(2, 3 - level) * 50

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

        {/* BST property indicators */}
        {level > 0 && (
          <text
            x={x}
            y={y - 35}
            textAnchor="middle"
            className="fill-cyan-400 font-bold text-xs"
          >
            {node.value < 50 ? 'L' : 'R'}
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
                  Binary Search Tree Insertion
                </h1>
                <p className="text-gray-400 text-sm">Insert values while maintaining BST property</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaTree className="w-5 h-5 text-green-400" />
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
              
              {/* Value to Insert */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Inserting Value: {insertValue}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={insertValue}
                  onChange={(e) => setInsertValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Manual Insert */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Manual Insert
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
                    onClick={insertManualValue}
                    disabled={!manualValue}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaPlus className="w-3 h-3" />
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
                  New Insertion Demo
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

              {/* Search Path */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Search Path:</h3>
                <div className="flex flex-wrap gap-2">
                  {highlightPath.length === 0 ? (
                    <span className="text-gray-400 text-sm">No path yet</span>
                  ) : (
                    highlightPath.map((value, index) => (
                      <React.Fragment key={value}>
                        <span
                          className={`px-2 py-1 rounded text-sm font-bold ${
                            index === highlightPath.length - 1 && comparisonNode
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {value}
                        </span>
                        {index < highlightPath.length - 1 && (
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
                    <span className="text-gray-300">Normal Node</span>
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
                    <span className="text-gray-300">Newly Inserted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">BST Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* BST Tree Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  <svg width="800" height="500" viewBox="0 0 800 500">
                    {tree && renderNode(tree, 400, 80)}
                  </svg>
                </div>
              </div>

              {/* BST Properties */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">BST Properties:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p>• Left subtree contains values &lt; current node</p>
                  <p>• Right subtree contains values &gt; current node</p>
                  <p>• Both left and right subtrees are also BSTs</p>
                  <p>• No duplicate values allowed</p>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start BST insertion'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">BST Insertion Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(h) where h is height of tree</p>
                  <p><strong>Best Case:</strong> O(log n) - balanced tree</p>
                  <p><strong>Worst Case:</strong> O(n) - skewed tree</p>
                  <p><strong>Space Complexity:</strong> O(h) - recursion stack</p>
                  <p><strong>Strategy:</strong> Compare with current node, go left if smaller, right if larger</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BSTInsertion
