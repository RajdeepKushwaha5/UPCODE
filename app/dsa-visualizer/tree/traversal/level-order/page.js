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

const BinaryTreeLevelOrder = () => {
  const router = useRouter()
  const [tree, setTree] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [queue, setQueue] = useState([])
  const [traversalResult, setTraversalResult] = useState([])
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [currentLevel, setCurrentLevel] = useState(-1)

  // Generate binary tree
  const generateTree = useCallback(() => {
    const treeStructure = {
      value: 50,
      id: 'root',
      level: 0,
      left: {
        value: 30,
        id: 'left',
        level: 1,
        left: {
          value: 20,
          id: 'left-left',
          level: 2,
          left: null,
          right: null
        },
        right: {
          value: 40,
          id: 'left-right',
          level: 2,
          left: null,
          right: null
        }
      },
      right: {
        value: 70,
        id: 'right',
        level: 1,
        left: {
          value: 60,
          id: 'right-left',
          level: 2,
          left: null,
          right: null
        },
        right: {
          value: 80,
          id: 'right-right',
          level: 2,
          left: null,
          right: null
        }
      }
    }
    
    setTree(treeStructure)
    setCurrentStep(0)
    setCurrentNode(null)
    setVisitedNodes([])
    setQueue([])
    setTraversalResult([])
    setCurrentLevel(-1)
    setIsPlaying(false)
    generateSteps(treeStructure)
  }, [])

  // Generate level-order traversal steps
  const generateSteps = (tree) => {
    const steps = []
    const result = []
    const queue = [tree]
    
    steps.push({
      type: 'initial',
      current: null,
      visited: [],
      queue: [tree.id],
      result: [],
      currentLevel: -1,
      description: 'Starting level-order (BFS) traversal. Initialize queue with root node.'
    })

    while (queue.length > 0) {
      const current = queue.shift()
      
      steps.push({
        type: 'dequeue',
        current: current.id,
        visited: result.map(n => n.id),
        queue: queue.map(n => n.id),
        result: [...result],
        currentLevel: current.level,
        description: `Dequeue node ${current.value} (Level ${current.level}) from front of queue.`
      })

      // Visit current node
      result.push({ id: current.id, value: current.value, level: current.level })
      
      steps.push({
        type: 'visit',
        current: current.id,
        visited: result.map(n => n.id),
        queue: queue.map(n => n.id),
        result: [...result],
        currentLevel: current.level,
        description: `Visit node ${current.value}. Processing level ${current.level}. Result: [${result.map(n => n.value).join(', ')}]`
      })

      // Add children to queue
      const children = []
      if (current.left) children.push(current.left)
      if (current.right) children.push(current.right)

      if (children.length > 0) {
        children.forEach(child => queue.push(child))
        
        steps.push({
          type: 'enqueue',
          current: current.id,
          visited: result.map(n => n.id),
          queue: queue.map(n => n.id),
          result: [...result],
          currentLevel: current.level,
          description: `Add children of ${current.value} to queue: [${children.map(c => c.value).join(', ')}] (Level ${current.level + 1})`
        })
      } else {
        steps.push({
          type: 'no_children',
          current: current.id,
          visited: result.map(n => n.id),
          queue: queue.map(n => n.id),
          result: [...result],
          currentLevel: current.level,
          description: `Node ${current.value} has no children.`
        })
      }
    }

    steps.push({
      type: 'complete',
      current: null,
      visited: result.map(n => n.id),
      queue: [],
      result: [...result],
      currentLevel: -1,
      description: `Level-order traversal complete! Result: [${result.map(n => n.value).join(', ')}] - Processed level by level!`
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
      setQueue(step.queue)
      setTraversalResult(step.result)
      setCurrentLevel(step.currentLevel)
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

  const getNodeColor = (node) => {
    if (node.id === currentNode) return 'bg-yellow-500 border-yellow-400 text-black'
    if (visitedNodes.includes(node.id)) return 'bg-green-500 border-green-400'
    if (queue.includes(node.id)) return 'bg-blue-400 border-blue-300'
    return 'bg-gray-500 border-gray-400'
  }

  const getLevelHighlight = (nodeLevel) => {
    return nodeLevel === currentLevel ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''
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

        {/* Level highlight */}
        {node.level === currentLevel && (
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2 + 8}
            className="fill-none stroke-yellow-400 stroke-4 opacity-75 animate-pulse"
          />
        )}

        {/* Current node */}
        <circle
          cx={x}
          cy={y}
          r={nodeSize / 2}
          className={`${getNodeColor(node)} transition-all duration-500 stroke-2`}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="fill-white font-bold text-sm"
        >
          {node.value}
        </text>

        {/* Level label */}
        <text
          x={x + 35}
          y={y - 10}
          textAnchor="middle"
          className="fill-cyan-400 font-bold text-xs"
        >
          L{node.level}
        </text>

        {/* Show visit order for visited nodes */}
        {visitedNodes.includes(node.id) && (
          <text
            x={x}
            y={y - 35}
            textAnchor="middle"
            className="fill-yellow-400 font-bold text-xs"
          >
            {traversalResult.findIndex(n => n.id === node.id) + 1}
          </text>
        )}

        {/* Recursively render children */}
        {node.left && renderNode(node.left, x - horizontalSpacing, y + levelSpacing, level + 1)}
        {node.right && renderNode(node.right, x + horizontalSpacing, y + levelSpacing, level + 1)}
      </g>
    )
  }

  const renderLevelByLevel = () => {
    const levels = [
      [{ id: 'root', value: 50 }],
      [{ id: 'left', value: 30 }, { id: 'right', value: 70 }],
      [{ id: 'left-left', value: 20 }, { id: 'left-right', value: 40 }, { id: 'right-left', value: 60 }, { id: 'right-right', value: 80 }]
    ]

    return (
      <div className="space-y-4">
        {levels.map((level, levelIndex) => (
          <div key={levelIndex} className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded text-sm font-bold ${levelIndex === currentLevel ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}>
              Level {levelIndex}
            </div>
            <div className="flex gap-2">
              {level.map(node => (
                <div
                  key={node.id}
                  className={`w-12 h-8 flex items-center justify-center rounded text-sm font-bold transition-all duration-500 ${
                    node.id === currentNode ? 'bg-yellow-500 text-black scale-110' :
                    visitedNodes.includes(node.id) ? 'bg-green-500 text-white' :
                    queue.includes(node.id) ? 'bg-blue-400 text-white' :
                    'bg-gray-500 text-white'
                  }`}
                >
                  {node.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
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
                  Binary Tree Level-Order Traversal
                </h1>
                <p className="text-gray-400 text-sm">Breadth-First Search (BFS) level by level traversal</p>
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

              {/* Queue State */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Queue State:</h3>
                <div className="bg-gray-800 rounded p-3">
                  {queue.length > 0 ? (
                    <div className="flex gap-2">
                      <span className="text-gray-400 text-sm">Front →</span>
                      {queue.map((nodeId, index) => (
                        <span
                          key={`${nodeId}-${index}`}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-sm font-bold"
                        >
                          {tree[nodeId]?.value || nodeId.split('-').pop()}
                        </span>
                      ))}
                      <span className="text-gray-400 text-sm">← Back</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Empty</span>
                  )}
                </div>
              </div>

              {/* Current Level */}
              {currentLevel >= 0 && (
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Current Level:</h3>
                  <div className="bg-gray-800 rounded p-3 text-center">
                    <span className="px-4 py-2 bg-yellow-500 text-black rounded font-bold">
                      Level {currentLevel}
                    </span>
                  </div>
                </div>
              )}

              {/* Traversal Result */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Traversal Result:</h3>
                <div className="bg-gray-800 rounded p-3">
                  {traversalResult.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {traversalResult.map((node, index) => (
                        <span
                          key={node.id}
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm font-bold"
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
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Unvisited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">In Queue</span>
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

              {/* Level by Level View */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Level-by-Level View:</h3>
                <div className="bg-gray-800 rounded p-4">
                  {renderLevelByLevel()}
                </div>
              </div>

              {/* Level-order Pattern */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Level-Order Pattern:</h3>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="px-3 py-2 bg-blue-600 text-white rounded">Use Queue (BFS)</div>
                  <div className="text-yellow-400">→</div>
                  <div className="px-3 py-2 bg-purple-600 text-white rounded">Visit Level by Level</div>
                  <div className="text-yellow-400">→</div>
                  <div className="px-3 py-2 bg-green-600 text-white rounded">Breadth First</div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start the level-order traversal'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Algorithm Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(n) - Visit each node once</p>
                  <p><strong>Space Complexity:</strong> O(w) where w is maximum width of tree</p>
                  <p><strong>Use Cases:</strong> Print tree level by level, serialize tree, find level of nodes</p>
                  <p><strong>Pattern:</strong> BFS using queue - process nodes level by level</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BinaryTreeLevelOrder
