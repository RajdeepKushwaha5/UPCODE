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
  FaBalanceScale,
  FaSyncAlt
} from 'react-icons/fa'

const AVLRotations = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [rotationType, setRotationType] = useState('LL')
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [rotationNodes, setRotationNodes] = useState(new Set())
  const [highlightedEdges, setHighlightedEdges] = useState(new Set())
  const [beforeTree, setBeforeTree] = useState(null)
  const [afterTree, setAfterTree] = useState(null)
  const [currentPhase, setCurrentPhase] = useState('before')

  // AVL Node class
  class AVLNode {
    constructor(value) {
      this.value = value
      this.left = null
      this.right = null
      this.height = 1
      this.id = `node-${value}-${Date.now()}`
    }
  }

  // Get height of node
  const getHeight = (node) => {
    return node ? node.height : 0
  }

  // Calculate balance factor
  const getBalance = (node) => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0
  }

  // Update height of node
  const updateHeight = (node) => {
    if (node) {
      node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right))
    }
  }

  // Right rotate
  const rotateRight = (y) => {
    const x = y.left
    const T2 = x.right

    // Perform rotation
    x.right = y
    y.left = T2

    // Update heights
    updateHeight(y)
    updateHeight(x)

    return x
  }

  // Left rotate
  const rotateLeft = (x) => {
    const y = x.right
    const T2 = y.left

    // Perform rotation
    y.left = x
    x.right = T2

    // Update heights
    updateHeight(x)
    updateHeight(y)

    return y
  }

  // Generate different rotation scenarios
  const generateRotationScenario = useCallback((type) => {
    let root = null
    
    switch (type) {
      case 'LL': // Left-Left case (Right rotation)
        root = new AVLNode(30)
        root.left = new AVLNode(20)
        root.left.left = new AVLNode(10)
        root.height = 3
        root.left.height = 2
        root.left.left.height = 1
        break
        
      case 'RR': // Right-Right case (Left rotation)
        root = new AVLNode(10)
        root.right = new AVLNode(20)
        root.right.right = new AVLNode(30)
        root.height = 3
        root.right.height = 2
        root.right.right.height = 1
        break
        
      case 'LR': // Left-Right case (Left-Right rotation)
        root = new AVLNode(30)
        root.left = new AVLNode(10)
        root.left.right = new AVLNode(20)
        root.height = 3
        root.left.height = 2
        root.left.right.height = 1
        break
        
      case 'RL': // Right-Left case (Right-Left rotation)
        root = new AVLNode(10)
        root.right = new AVLNode(30)
        root.right.left = new AVLNode(20)
        root.height = 3
        root.right.height = 2
        root.right.left.height = 1
        break
    }
    
    return root
  }, [])

  // Generate rotation steps
  const generateSteps = useCallback((type) => {
    const steps = []
    const originalTree = generateRotationScenario(type)
    
    steps.push({
      type: 'initial',
      tree: cloneTree(originalTree),
      phase: 'before',
      rotationNodes: new Set(),
      highlightedEdges: new Set(),
      description: `${getRotationName(type)} scenario detected. Tree is unbalanced with BF > 1 or BF < -1.`
    })

    let rotatedTree = null
    let rotNodes = new Set()
    let highlightEdges = new Set()
    
    switch (type) {
      case 'LL':
        rotNodes = new Set([30, 20, 10])
        highlightEdges = new Set(['30-20', '20-10'])
        steps.push({
          type: 'identify_case',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: highlightEdges,
          description: 'Left-Left case: Insert/delete caused left-heavy subtree. Need RIGHT rotation around node 30.'
        })
        
        steps.push({
          type: 'explain_rotation',
          tree: cloneTree(originalTree),
          phase: 'during',
          rotationNodes: rotNodes,
          highlightedEdges: new Set(['30-20']),
          description: 'RIGHT rotation: Node 20 becomes new root. Node 30 becomes right child of 20.'
        })
        
        rotatedTree = rotateRight(cloneTree(originalTree))
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([20]),
          highlightedEdges: new Set(),
          description: 'RIGHT rotation complete! Tree is now balanced. New root is 20.'
        })
        break

      case 'RR':
        rotNodes = new Set([10, 20, 30])
        highlightEdges = new Set(['10-20', '20-30'])
        steps.push({
          type: 'identify_case',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: highlightEdges,
          description: 'Right-Right case: Insert/delete caused right-heavy subtree. Need LEFT rotation around node 10.'
        })
        
        steps.push({
          type: 'explain_rotation',
          tree: cloneTree(originalTree),
          phase: 'during',
          rotationNodes: rotNodes,
          highlightedEdges: new Set(['10-20']),
          description: 'LEFT rotation: Node 20 becomes new root. Node 10 becomes left child of 20.'
        })
        
        rotatedTree = rotateLeft(cloneTree(originalTree))
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([20]),
          highlightedEdges: new Set(),
          description: 'LEFT rotation complete! Tree is now balanced. New root is 20.'
        })
        break

      case 'LR':
        rotNodes = new Set([30, 10, 20])
        highlightEdges = new Set(['30-10', '10-20'])
        steps.push({
          type: 'identify_case',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: highlightEdges,
          description: 'Left-Right case: Left subtree is right-heavy. Need LEFT rotation on 10, then RIGHT rotation on 30.'
        })
        
        // First rotation: Left on node 10
        const intermediateTree = cloneTree(originalTree)
        intermediateTree.left = rotateLeft(intermediateTree.left)
        updateHeight(intermediateTree)
        
        steps.push({
          type: 'first_rotation',
          tree: intermediateTree,
          phase: 'during',
          rotationNodes: new Set([10, 20]),
          highlightedEdges: new Set(['10-20']),
          description: 'Step 1: LEFT rotation on node 10. Node 20 becomes left child of 30.'
        })
        
        steps.push({
          type: 'explain_second',
          tree: intermediateTree,
          phase: 'during',
          rotationNodes: new Set([30, 20]),
          highlightedEdges: new Set(['30-20']),
          description: 'Step 2: Now perform RIGHT rotation on node 30. Node 20 becomes new root.'
        })
        
        // Second rotation: Right on root
        rotatedTree = rotateRight(intermediateTree)
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([20]),
          highlightedEdges: new Set(),
          description: 'LEFT-RIGHT rotation complete! Two rotations balanced the tree. New root is 20.'
        })
        break

      case 'RL':
        rotNodes = new Set([10, 30, 20])
        highlightEdges = new Set(['10-30', '30-20'])
        steps.push({
          type: 'identify_case',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: highlightEdges,
          description: 'Right-Left case: Right subtree is left-heavy. Need RIGHT rotation on 30, then LEFT rotation on 10.'
        })
        
        // First rotation: Right on node 30
        const intermediateTree2 = cloneTree(originalTree)
        intermediateTree2.right = rotateRight(intermediateTree2.right)
        updateHeight(intermediateTree2)
        
        steps.push({
          type: 'first_rotation',
          tree: intermediateTree2,
          phase: 'during',
          rotationNodes: new Set([30, 20]),
          highlightedEdges: new Set(['30-20']),
          description: 'Step 1: RIGHT rotation on node 30. Node 20 becomes right child of 10.'
        })
        
        steps.push({
          type: 'explain_second',
          tree: intermediateTree2,
          phase: 'during',
          rotationNodes: new Set([10, 20]),
          highlightedEdges: new Set(['10-20']),
          description: 'Step 2: Now perform LEFT rotation on node 10. Node 20 becomes new root.'
        })
        
        // Second rotation: Left on root
        rotatedTree = rotateLeft(intermediateTree2)
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([20]),
          highlightedEdges: new Set(),
          description: 'RIGHT-LEFT rotation complete! Two rotations balanced the tree. New root is 20.'
        })
        break
    }

    setBeforeTree(cloneTree(originalTree))
    setAfterTree(rotatedTree)
    setSteps(steps)
  }, [generateRotationScenario])

  // Helper functions
  const cloneTree = (node) => {
    if (!node) return null
    const newNode = new AVLNode(node.value)
    newNode.height = node.height
    newNode.id = node.id
    newNode.left = cloneTree(node.left)
    newNode.right = cloneTree(node.right)
    return newNode
  }

  const getRotationName = (type) => {
    const names = {
      'LL': 'Left-Left (Right Rotation)',
      'RR': 'Right-Right (Left Rotation)',
      'LR': 'Left-Right (Double Rotation)',
      'RL': 'Right-Left (Double Rotation)'
    }
    return names[type]
  }

  // Initialize
  useEffect(() => {
    generateSteps(rotationType)
    setCurrentStep(0)
    setCurrentPhase('before')
    setIsPlaying(false)
  }, [rotationType, generateSteps])

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
      }, 2500 - speed)
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
      setCurrentPhase(step.phase || 'before')
      setRotationNodes(step.rotationNodes || new Set())
      setHighlightedEdges(step.highlightedEdges || new Set())
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
    if (rotationNodes.has(nodeValue)) {
      return 'fill-purple-500 stroke-purple-400 animate-pulse'
    }
    return 'fill-gray-500 stroke-gray-400'
  }

  const getEdgeColor = (fromValue, toValue) => {
    const edgeKey = `${fromValue}-${toValue}`
    if (highlightedEdges.has(edgeKey)) {
      return '#9333EA' // purple-600
    }
    return '#6B7280' // gray-500
  }

  const renderNode = (node, x, y, level = 0, parent = null) => {
    if (!node) return null

    const nodeSize = 50
    const levelSpacing = 120
    const horizontalSpacing = Math.pow(2, 3 - level) * 60

    const balance = getBalance(node)

    return (
      <g key={node.id}>
        {/* Left child connection */}
        {node.left && (
          <line
            x1={x}
            y1={y + nodeSize / 2}
            x2={x - horizontalSpacing}
            y2={y + levelSpacing - nodeSize / 2}
            stroke={getEdgeColor(node.value, node.left.value)}
            strokeWidth="3"
            className="transition-colors duration-500"
          />
        )}
        
        {/* Right child connection */}
        {node.right && (
          <line
            x1={x}
            y1={y + nodeSize / 2}
            x2={x + horizontalSpacing}
            y2={y + levelSpacing - nodeSize / 2}
            stroke={getEdgeColor(node.value, node.right.value)}
            strokeWidth="3"
            className="transition-colors duration-500"
          />
        )}

        {/* Rotation indicator */}
        {rotationNodes.has(node.value) && (
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2 + 8}
            className="fill-none stroke-purple-400 stroke-3 opacity-60 animate-pulse"
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
          className="fill-white font-bold text-xl"
        >
          {node.value}
        </text>

        {/* Balance factor */}
        <text
          x={x - 40}
          y={y - 30}
          textAnchor="middle"
          className={`font-bold text-sm ${
            Math.abs(balance) > 1 ? 'fill-red-400' : 
            balance === 0 ? 'fill-green-400' : 'fill-yellow-400'
          }`}
        >
          BF:{balance}
        </text>

        {/* Height */}
        <text
          x={x + 40}
          y={y - 30}
          textAnchor="middle"
          className="fill-cyan-400 font-bold text-sm"
        >
          H:{node.height}
        </text>

        {/* Recursively render children */}
        {node.left && renderNode(node.left, x - horizontalSpacing, y + levelSpacing, level + 1, node)}
        {node.right && renderNode(node.right, x + horizontalSpacing, y + levelSpacing, level + 1, node)}
      </g>
    )
  }

  const renderComparisonTrees = () => {
    return (
      <div className="grid grid-cols-2 gap-8">
        {/* Before */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h4 className="text-white font-medium mb-4 text-center">Before Rotation</h4>
          <svg width="300" height="250" className="mx-auto">
            {beforeTree && renderNode(beforeTree, 150, 60)}
          </svg>
        </div>

        {/* After */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h4 className="text-white font-medium mb-4 text-center">After Rotation</h4>
          <svg width="300" height="250" className="mx-auto">
            {afterTree && renderNode(afterTree, 150, 60)}
          </svg>
        </div>
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AVL Tree Rotations
                </h1>
                <p className="text-gray-400 text-sm">Four types of rotations to maintain balance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaSyncAlt className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-sm">Tree Rotations</span>
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
              
              {/* Rotation Type Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Rotation Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['LL', 'RR', 'LR', 'RL'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRotationType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        rotationType === type 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {getRotationName(rotationType)}
                </p>
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
                    max="2000"
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

              {/* Current Phase */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Phase:</h3>
                <div className="bg-gray-800 rounded p-3 text-center">
                  <span className={`px-3 py-1 rounded font-bold text-sm ${
                    currentPhase === 'before' ? 'bg-red-600 text-white' :
                    currentPhase === 'during' ? 'bg-yellow-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {currentPhase === 'before' ? 'UNBALANCED' :
                     currentPhase === 'during' ? 'ROTATING' : 'BALANCED'}
                  </span>
                </div>
              </div>

              {/* Rotation Rules */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Rotation Rules:</h3>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-blue-400 font-medium">LL Case:</span>
                    <span className="text-gray-300 block">BF(z) > 1, BF(y) ≥ 0 → Right rotate</span>
                  </div>
                  <div>
                    <span className="text-green-400 font-medium">RR Case:</span>
                    <span className="text-gray-300 block">BF(z) < -1, BF(y) ≤ 0 → Left rotate</span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium">LR Case:</span>
                    <span className="text-gray-300 block">BF(z) > 1, BF(y) < 0 → Left-Right</span>
                  </div>
                  <div>
                    <span className="text-yellow-400 font-medium">RL Case:</span>
                    <span className="text-gray-300 block">BF(z) < -1, BF(y) > 0 → Right-Left</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Normal Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">Rotation Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-purple-500"></div>
                    <span className="text-gray-300">Highlighted Edge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">AVL Rotation Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Main Tree Visualization */}
              <div className="bg-gray-900 rounded-lg p-8 mb-6">
                <div className="flex justify-center">
                  <svg width="500" height="350" viewBox="0 0 500 350">
                    {tree && renderNode(tree, 250, 80)}
                  </svg>
                </div>
              </div>

              {/* Before/After Comparison */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-4">Before vs After Comparison</h3>
                {renderComparisonTrees()}
              </div>

              {/* Rotation Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">{getRotationName(rotationType)}</h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    {rotationType === 'LL' && (
                      <>
                        <p>• Left subtree is left-heavy</p>
                        <p>• Single RIGHT rotation needed</p>
                        <p>• Left child becomes new root</p>
                        <p>• Time complexity: O(1)</p>
                      </>
                    )}
                    {rotationType === 'RR' && (
                      <>
                        <p>• Right subtree is right-heavy</p>
                        <p>• Single LEFT rotation needed</p>
                        <p>• Right child becomes new root</p>
                        <p>• Time complexity: O(1)</p>
                      </>
                    )}
                    {rotationType === 'LR' && (
                      <>
                        <p>• Left subtree is right-heavy</p>
                        <p>• Double rotation: LEFT then RIGHT</p>
                        <p>• Left-right grandchild becomes root</p>
                        <p>• Time complexity: O(1)</p>
                      </>
                    )}
                    {rotationType === 'RL' && (
                      <>
                        <p>• Right subtree is left-heavy</p>
                        <p>• Double rotation: RIGHT then LEFT</p>
                        <p>• Right-left grandchild becomes root</p>
                        <p>• Time complexity: O(1)</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Balance Factor Changes</h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>• <span className="text-red-400">Before:</span> Unbalanced tree</p>
                    <p>• <span className="text-yellow-400">During:</span> Rotation in progress</p>
                    <p>• <span className="text-green-400">After:</span> Balanced tree</p>
                    <p>• All BF values are now |BF| ≤ 1</p>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Select a rotation type and click play to start'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AVLRotations
