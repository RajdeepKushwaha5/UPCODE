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
  FaTree
} from 'react-icons/fa'

const BinaryTreeInOrder = () => {
  const router = useRouter()
  const [tree, setTree] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [traversalResult, setTraversalResult] = useState([])
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)

  // Generate binary tree
  const generateTree = useCallback(() => {
    const treeStructure = {
      value: 50,
      id: 'root',
      left: {
        value: 30,
        id: 'left',
        left: {
          value: 20,
          id: 'left-left',
          left: null,
          right: null
        },
        right: {
          value: 40,
          id: 'left-right',
          left: null,
          right: null
        }
      },
      right: {
        value: 70,
        id: 'right',
        left: {
          value: 60,
          id: 'right-left',
          left: null,
          right: null
        },
        right: {
          value: 80,
          id: 'right-right',
          left: null,
          right: null
        }
      }
    }
    
    setTree(treeStructure)
    setCurrentStep(0)
    setCurrentNode(null)
    setVisitedNodes([])
    setTraversalResult([])
    setIsPlaying(false)
    generateSteps(treeStructure)
  }, [])

  // Generate in-order traversal steps
  const generateSteps = (tree) => {
    const steps = []
    const result = []
    
    steps.push({
      type: 'initial',
      current: null,
      visited: [],
      result: [],
      description: 'Starting in-order traversal: LEFT → ROOT → RIGHT. We use recursion to traverse the tree.'
    })

    const inorderTraversal = (node, path = '') => {
      if (!node) return

      // Visit left subtree
      steps.push({
        type: 'visit',
        current: node.id,
        visited: [...result.map(n => n.id)],
        result: [...result],
        description: `Visiting node ${node.value}${path}. First, traverse LEFT subtree.`
      })

      if (node.left) {
        inorderTraversal(node.left, path + ' → Left')
      } else {
        steps.push({
          type: 'no_left',
          current: node.id,
          visited: [...result.map(n => n.id)],
          result: [...result],
          description: `No left child for node ${node.value}. Process this node.`
        })
      }

      // Process current node
      result.push({ id: node.id, value: node.value })
      steps.push({
        type: 'process',
        current: node.id,
        visited: [...result.map(n => n.id)],
        result: [...result],
        description: `Processing node ${node.value}. Added to result: [${result.map(n => n.value).join(', ')}]`
      })

      // Visit right subtree
      if (node.right) {
        steps.push({
          type: 'go_right',
          current: node.id,
          visited: [...result.map(n => n.id)],
          result: [...result],
          description: `Now traverse RIGHT subtree of node ${node.value}.`
        })
        inorderTraversal(node.right, path + ' → Right')
      } else {
        steps.push({
          type: 'no_right',
          current: node.id,
          visited: [...result.map(n => n.id)],
          result: [...result],
          description: `No right child for node ${node.value}. Backtrack to parent.`
        })
      }
    }

    inorderTraversal(tree)

    steps.push({
      type: 'complete',
      current: null,
      visited: result.map(n => n.id),
      result: result,
      description: `In-order traversal complete! Result: [${result.map(n => n.value).join(', ')}] - Notice it's sorted!`
    })

    setSteps(steps)
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
      setVisitedNodes(step.visited)
      setTraversalResult(step.result)
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

  const getNodeColor = (nodeId) => {
    if (nodeId === currentNode) return 'bg-yellow-500 border-yellow-400 text-black'
    if (visitedNodes.includes(nodeId)) return 'bg-green-500 border-green-400'
    return 'bg-blue-500 border-blue-400'
  }

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null

    const nodeSize = 50
    const levelSpacing = 120
    const horizontalSpacing = Math.pow(2, 3 - level) * 40

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
          className={`${getNodeColor(node.id)} transition-all duration-500 stroke-2`}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="fill-white font-bold text-sm"
        >
          {node.value}
        </text>

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
                  Binary Tree In-Order Traversal
                </h1>
                <p className="text-gray-400 text-sm">Left → Root → Right traversal pattern</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaTree className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Tree Traversal</span>
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
                  Reset Tree
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

              {/* Traversal Result */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Traversal Result:</h3>
                <div className="bg-gray-800 rounded p-3">
                  {traversalResult.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {traversalResult.map((node, index) => (
                        <span
                          key={node.id}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold"
                        >
                          {node.value}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Empty</span>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Color Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Unvisited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Visited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Binary Tree Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Tree Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  <svg width="600" height="400" viewBox="0 0 600 400">
                    {renderNode(tree, 300, 60)}
                  </svg>
                </div>
              </div>

              {/* In-order Pattern */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">In-Order Pattern:</h3>
                <div className="flex items-center justify-center space-x-4 text-lg font-bold">
                  <div className="px-4 py-2 bg-blue-600 text-white rounded">LEFT</div>
                  <div className="text-yellow-400">→</div>
                  <div className="px-4 py-2 bg-purple-600 text-white rounded">ROOT</div>
                  <div className="text-yellow-400">→</div>
                  <div className="px-4 py-2 bg-green-600 text-white rounded">RIGHT</div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start the in-order traversal'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Algorithm Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(n) - Visit each node once</p>
                  <p><strong>Space Complexity:</strong> O(h) - Recursion stack height</p>
                  <p><strong>Use Case:</strong> For BST, gives sorted order</p>
                  <p><strong>Pattern:</strong> Process left subtree, current node, then right subtree</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BinaryTreeInOrder
