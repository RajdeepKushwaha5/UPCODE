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
  FaSyncAlt,
  FaBalanceScale,
  FaTree
} from 'react-icons/fa'

const RedBlackRotations = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [rotationType, setRotationType] = useState('LL')
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [rotationNodes, setRotationNodes] = useState(new Set())
  const [highlightedEdges, setHighlightedEdges] = useState(new Set())
  const [beforeTree, setBeforeTree] = useState(null)
  const [afterTree, setAfterTree] = useState(null)
  const [currentPhase, setCurrentPhase] = useState('before')
  const [violationCase, setViolationCase] = useState('')
  const [rotationStep, setRotationStep] = useState('')

  // Red-Black Tree Node class
  class RBNode {
    constructor(value, color = 'RED') {
      this.value = value
      this.color = color // 'RED' or 'BLACK'
      this.left = null
      this.right = null
      this.parent = null
      this.height = 1
      this.id = `rb-node-${value}-${Date.now()}`
    }
  }

  // Helper functions
  const isRed = (node) => node && node.color === 'RED'
  const isBlack = (node) => !node || node.color === 'BLACK'

  // Rotate left
  const rotateLeft = (x) => {
    const y = x.right
    x.right = y.left
    if (y.left) y.left.parent = x
    y.parent = x.parent
    
    if (!x.parent) {
      // x was root
    } else if (x === x.parent.left) {
      x.parent.left = y
    } else {
      x.parent.right = y
    }
    
    y.left = x
    x.parent = y
    return y
  }

  // Rotate right
  const rotateRight = (y) => {
    const x = y.left
    y.left = x.right
    if (x.right) x.right.parent = y
    x.parent = y.parent
    
    if (!y.parent) {
      // y was root
    } else if (y === y.parent.left) {
      y.parent.left = x
    } else {
      y.parent.right = x
    }
    
    x.right = y
    y.parent = x
    return x
  }

  // Generate scenario for different rotation types
  const generateRotationScenario = useCallback((type) => {
    let root = null

    switch (type) {
      case 'LL': // Left-Left case (Right rotation needed)
        root = new RBNode(30, 'BLACK')
        root.left = new RBNode(20, 'RED')
        root.left.parent = root
        root.left.left = new RBNode(10, 'RED')
        root.left.left.parent = root.left
        root.height = 3
        root.left.height = 2
        root.left.left.height = 1
        break
        
      case 'RR': // Right-Right case (Left rotation needed)
        root = new RBNode(10, 'BLACK')
        root.right = new RBNode(20, 'RED')
        root.right.parent = root
        root.right.right = new RBNode(30, 'RED')
        root.right.right.parent = root.right
        root.height = 3
        root.right.height = 2
        root.right.right.height = 1
        break
        
      case 'LR': // Left-Right case (Left-Right rotation)
        root = new RBNode(30, 'BLACK')
        root.left = new RBNode(10, 'RED')
        root.left.parent = root
        root.left.right = new RBNode(20, 'RED')
        root.left.right.parent = root.left
        root.height = 3
        root.left.height = 2
        root.left.right.height = 1
        break
        
      case 'RL': // Right-Left case (Right-Left rotation)
        root = new RBNode(10, 'BLACK')
        root.right = new RBNode(30, 'RED')
        root.right.parent = root
        root.right.left = new RBNode(20, 'RED')
        root.right.left.parent = root.right
        root.height = 3
        root.right.height = 2
        root.right.left.height = 1
        break

      case 'UNCLE_RED': // Uncle is red - recoloring case
        root = new RBNode(20, 'BLACK')
        root.left = new RBNode(10, 'RED')
        root.left.parent = root
        root.right = new RBNode(30, 'RED')
        root.right.parent = root
        root.left.left = new RBNode(5, 'RED')
        root.left.left.parent = root.left
        root.height = 3
        root.left.height = 2
        root.right.height = 1
        root.left.left.height = 1
        break

      case 'DELETE_SIBLING': // Deletion case - red sibling
        root = new RBNode(20, 'BLACK')
        root.left = new RBNode(10, 'BLACK')
        root.left.parent = root
        root.right = new RBNode(30, 'RED')
        root.right.parent = root
        root.right.left = new RBNode(25, 'BLACK')
        root.right.left.parent = root.right
        root.right.right = new RBNode(35, 'BLACK')
        root.right.right.parent = root.right
        root.height = 3
        root.left.height = 1
        root.right.height = 2
        root.right.left.height = 1
        root.right.right.height = 1
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
      violationCase: '',
      rotationStep: '',
      description: `${getRotationName(type)} scenario. ${getScenarioDescription(type)}`
    })

    let rotatedTree = null
    let rotNodes = new Set()
    let highlightEdges = new Set()
    
    switch (type) {
      case 'LL':
        rotNodes = new Set([30, 20, 10])
        highlightEdges = new Set(['30-20', '20-10'])
        steps.push({
          type: 'identify_violation',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: highlightEdges,
          violationCase: 'Red-Red Violation',
          rotationStep: 'Left-Left Case',
          description: 'Red-Red violation detected! Node 10 (RED) has parent 20 (RED). Need RIGHT rotation at grandparent 30.'
        })
        
        steps.push({
          type: 'explain_rotation',
          tree: cloneTree(originalTree),
          phase: 'during',
          rotationNodes: new Set([30, 20]),
          highlightedEdges: new Set(['30-20']),
          violationCase: 'Left-Left Case',
          rotationStep: 'Right Rotation',
          description: 'RIGHT rotation: Node 20 becomes new root. Node 30 becomes right child of 20. Recolor: 20 → BLACK, 30 → RED.'
        })
        
        rotatedTree = rotateRight(cloneTree(originalTree))
        rotatedTree.color = 'BLACK' // New root
        rotatedTree.right.color = 'RED'
        
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([20]),
          highlightedEdges: new Set(),
          violationCase: '',
          rotationStep: 'Complete',
          description: 'RIGHT rotation complete! Red-Red violation fixed. Tree balanced with proper colors.'
        })
        break

      case 'RR':
        rotNodes = new Set([10, 20, 30])
        highlightEdges = new Set(['10-20', '20-30'])
        steps.push({
          type: 'identify_violation',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: highlightEdges,
          violationCase: 'Red-Red Violation',
          rotationStep: 'Right-Right Case',
          description: 'Red-Red violation detected! Node 30 (RED) has parent 20 (RED). Need LEFT rotation at grandparent 10.'
        })
        
        steps.push({
          type: 'explain_rotation',
          tree: cloneTree(originalTree),
          phase: 'during',
          rotationNodes: new Set([10, 20]),
          highlightedEdges: new Set(['10-20']),
          violationCase: 'Right-Right Case',
          rotationStep: 'Left Rotation',
          description: 'LEFT rotation: Node 20 becomes new root. Node 10 becomes left child of 20. Recolor: 20 → BLACK, 10 → RED.'
        })
        
        rotatedTree = rotateLeft(cloneTree(originalTree))
        rotatedTree.color = 'BLACK' // New root
        rotatedTree.left.color = 'RED'
        
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([20]),
          highlightedEdges: new Set(),
          violationCase: '',
          rotationStep: 'Complete',
          description: 'LEFT rotation complete! Red-Red violation fixed. Tree balanced with proper colors.'
        })
        break

      case 'LR':
        rotNodes = new Set([30, 10, 20])
        highlightEdges = new Set(['30-10', '10-20'])
        steps.push({
          type: 'identify_violation',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: highlightEdges,
          violationCase: 'Red-Red Violation',
          rotationStep: 'Left-Right Case',
          description: 'Red-Red violation: Node 20 (RED) has parent 10 (RED). Left-Right case - need double rotation.'
        })
        
        // First rotation: Left on node 10
        const intermediateTree = cloneTree(originalTree)
        intermediateTree.left = rotateLeft(intermediateTree.left)
        
        steps.push({
          type: 'first_rotation',
          tree: intermediateTree,
          phase: 'during',
          rotationNodes: new Set([10, 20]),
          highlightedEdges: new Set(['10-20']),
          violationCase: 'Left-Right Case',
          rotationStep: 'Step 1: Left Rotation',
          description: 'Step 1: LEFT rotation on node 10. Node 20 becomes left child of 30. Now we have Left-Left case.'
        })
        
        steps.push({
          type: 'explain_second',
          tree: intermediateTree,
          phase: 'during',
          rotationNodes: new Set([30, 20]),
          highlightedEdges: new Set(['30-20']),
          violationCase: 'Left-Left Case',
          rotationStep: 'Step 2: Right Rotation',
          description: 'Step 2: RIGHT rotation on node 30. Node 20 becomes root. Recolor: 20 → BLACK, 30 → RED.'
        })
        
        // Second rotation: Right on root
        rotatedTree = rotateRight(intermediateTree)
        rotatedTree.color = 'BLACK'
        rotatedTree.right.color = 'RED'
        
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([20]),
          highlightedEdges: new Set(),
          violationCase: '',
          rotationStep: 'Complete',
          description: 'LEFT-RIGHT rotation complete! Double rotation fixed violation. Node 20 is new balanced root.'
        })
        break

      case 'RL':
        rotNodes = new Set([10, 30, 20])
        highlightEdges = new Set(['10-30', '30-20'])
        steps.push({
          type: 'identify_violation',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: highlightEdges,
          violationCase: 'Red-Red Violation',
          rotationStep: 'Right-Left Case',
          description: 'Red-Red violation: Node 20 (RED) has parent 30 (RED). Right-Left case - need double rotation.'
        })
        
        // First rotation: Right on node 30
        const intermediateTree2 = cloneTree(originalTree)
        intermediateTree2.right = rotateRight(intermediateTree2.right)
        
        steps.push({
          type: 'first_rotation',
          tree: intermediateTree2,
          phase: 'during',
          rotationNodes: new Set([30, 20]),
          highlightedEdges: new Set(['30-20']),
          violationCase: 'Right-Left Case',
          rotationStep: 'Step 1: Right Rotation',
          description: 'Step 1: RIGHT rotation on node 30. Node 20 becomes right child of 10. Now we have Right-Right case.'
        })
        
        steps.push({
          type: 'explain_second',
          tree: intermediateTree2,
          phase: 'during',
          rotationNodes: new Set([10, 20]),
          highlightedEdges: new Set(['10-20']),
          violationCase: 'Right-Right Case',
          rotationStep: 'Step 2: Left Rotation',
          description: 'Step 2: LEFT rotation on node 10. Node 20 becomes root. Recolor: 20 → BLACK, 10 → RED.'
        })
        
        // Second rotation: Left on root
        rotatedTree = rotateLeft(intermediateTree2)
        rotatedTree.color = 'BLACK'
        rotatedTree.left.color = 'RED'
        
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([20]),
          highlightedEdges: new Set(),
          violationCase: '',
          rotationStep: 'Complete',
          description: 'RIGHT-LEFT rotation complete! Double rotation fixed violation. Node 20 is new balanced root.'
        })
        break

      case 'UNCLE_RED':
        rotNodes = new Set([5, 10, 20, 30])
        steps.push({
          type: 'identify_violation',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: new Set(),
          violationCase: 'Red-Red Violation',
          rotationStep: 'Uncle is Red',
          description: 'Red-Red violation: Node 5 (RED) has parent 10 (RED). Uncle 30 is also RED - use recoloring instead of rotation.'
        })
        
        steps.push({
          type: 'recolor_explanation',
          tree: cloneTree(originalTree),
          phase: 'during',
          rotationNodes: new Set([10, 30, 20]),
          highlightedEdges: new Set(),
          violationCase: 'Uncle Red Case',
          rotationStep: 'Recoloring',
          description: 'Recoloring solution: Parent 10 → BLACK, Uncle 30 → BLACK, Grandparent 20 → RED. No rotation needed!'
        })
        
        const recoloredTree = cloneTree(originalTree)
        recoloredTree.left.color = 'BLACK'  // Parent
        recoloredTree.right.color = 'BLACK' // Uncle
        recoloredTree.color = 'RED'         // Grandparent
        
        steps.push({
          type: 'recolor_complete',
          tree: recoloredTree,
          phase: 'after',
          rotationNodes: new Set(),
          highlightedEdges: new Set(),
          violationCase: '',
          rotationStep: 'Complete',
          description: 'Recoloring complete! Violation fixed without rotation. Continue checking from grandparent upward.'
        })
        
        rotatedTree = recoloredTree
        break

      case 'DELETE_SIBLING':
        rotNodes = new Set([20, 30, 25, 35])
        steps.push({
          type: 'identify_violation',
          tree: cloneTree(originalTree),
          phase: 'before',
          rotationNodes: rotNodes,
          highlightedEdges: new Set(['20-30']),
          violationCase: 'Double Black Violation',
          rotationStep: 'Red Sibling Case',
          description: 'Deletion fix-up: Double-black at 10. Sibling 30 is RED - need to make sibling BLACK first.'
        })
        
        steps.push({
          type: 'explain_rotation',
          tree: cloneTree(originalTree),
          phase: 'during',
          rotationNodes: new Set([20, 30]),
          highlightedEdges: new Set(['20-30']),
          violationCase: 'Red Sibling',
          rotationStep: 'Left Rotation + Recolor',
          description: 'LEFT rotation on 20. Recolor: 30 → BLACK, 20 → RED. Now sibling is BLACK, continue with other cases.'
        })
        
        rotatedTree = rotateLeft(cloneTree(originalTree))
        rotatedTree.color = 'BLACK' // New root (was red sibling)
        rotatedTree.left.color = 'RED' // Old root
        
        steps.push({
          type: 'rotation_complete',
          tree: rotatedTree,
          phase: 'after',
          rotationNodes: new Set([30]),
          highlightedEdges: new Set(),
          violationCase: '',
          rotationStep: 'Continue Fix-up',
          description: 'Rotation complete! Sibling is now BLACK. Continue with appropriate deletion fix-up case.'
        })
        break
    }

    setBeforeTree(cloneTree(originalTree))
    setAfterTree(rotatedTree)
    setSteps(steps)
  }, [generateRotationScenario])

  // Get rotation name
  const getRotationName = (type) => {
    const names = {
      'LL': 'Left-Left Case (Right Rotation)',
      'RR': 'Right-Right Case (Left Rotation)', 
      'LR': 'Left-Right Case (Double Rotation)',
      'RL': 'Right-Left Case (Double Rotation)',
      'UNCLE_RED': 'Uncle Red Case (Recoloring)',
      'DELETE_SIBLING': 'Deletion Red Sibling Case'
    }
    return names[type] || type
  }

  // Get scenario description
  const getScenarioDescription = (type) => {
    const descriptions = {
      'LL': 'Red-Red violation in left-left chain requires right rotation.',
      'RR': 'Red-Red violation in right-right chain requires left rotation.',
      'LR': 'Red-Red violation in left-right configuration needs double rotation.',
      'RL': 'Red-Red violation in right-left configuration needs double rotation.',
      'UNCLE_RED': 'When uncle is red, recoloring solves violation without rotation.',
      'DELETE_SIBLING': 'Deletion case where sibling is red requires rotation first.'
    }
    return descriptions[type] || 'Red-Black tree rotation scenario.'
  }

  // Helper functions
  const cloneTree = (node) => {
    if (!node) return null
    const newNode = new RBNode(node.value, node.color)
    newNode.height = node.height
    newNode.id = node.id
    newNode.left = cloneTree(node.left)
    newNode.right = cloneTree(node.right)
    if (newNode.left) newNode.left.parent = newNode
    if (newNode.right) newNode.right.parent = newNode
    return newNode
  }

  // Initialize
  useEffect(() => {
    generateSteps(rotationType)
  }, [generateSteps, rotationType])

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
      setRotationNodes(step.rotationNodes || new Set())
      setHighlightedEdges(step.highlightedEdges || new Set())
      setCurrentPhase(step.phase || 'before')
      setViolationCase(step.violationCase || '')
      setRotationStep(step.rotationStep || '')
      if (step.tree) {
        setTree(step.tree)
      }
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
    if (rotationNodes.has(node.value)) {
      return node.color === 'RED' ? 'fill-red-400 stroke-yellow-400 animate-pulse stroke-4' : 'fill-gray-700 stroke-yellow-400 animate-pulse stroke-4'
    }
    return node.color === 'RED' ? 'fill-red-600 stroke-red-400 stroke-2' : 'fill-black stroke-gray-400 stroke-2'
  }

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null

    const leftChild = node.left
    const rightChild = node.right
    const childY = y + 80
    const separation = Math.max(50, 150 / (level + 1))

    return (
      <g key={node.id}>
        {/* Edges to children */}
        {leftChild && (
          <line
            x1={x}
            y1={y}
            x2={x - separation}
            y2={childY}
            stroke={highlightedEdges.has(`${node.value}-${leftChild.value}`) ? '#F59E0B' : '#6B7280'}
            strokeWidth={highlightedEdges.has(`${node.value}-${leftChild.value}`) ? '4' : '2'}
            className="transition-all duration-500"
          />
        )}
        {rightChild && (
          <line
            x1={x}
            y1={y}
            x2={x + separation}
            y2={childY}
            stroke={highlightedEdges.has(`${node.value}-${rightChild.value}`) ? '#F59E0B' : '#6B7280'}
            strokeWidth={highlightedEdges.has(`${node.value}-${rightChild.value}`) ? '4' : '2'}
            className="transition-all duration-500"
          />
        )}

        {/* Child nodes */}
        {leftChild && renderNode(leftChild, x - separation, childY, level + 1)}
        {rightChild && renderNode(rightChild, x + separation, childY, level + 1)}

        {/* Current node */}
        <circle
          cx={x}
          cy={y}
          r="25"
          className={`${getNodeColor(node)} transition-all duration-500`}
        />
        
        {/* Node value */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="fill-white text-lg font-bold"
        >
          {node.value}
        </text>

        {/* Color indicator */}
        <text
          x={x}
          y={y + 40}
          textAnchor="middle"
          className={`${node.color === 'RED' ? 'fill-red-400' : 'fill-gray-300'} text-xs font-bold`}
        >
          {node.color}
        </text>
      </g>
    )
  }

  const renderComparisonTrees = () => {
    if (!beforeTree || !afterTree) return null

    return (
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 text-center">Before Rotation</h4>
          <svg width="250" height="200" className="mx-auto">
            {renderNode(beforeTree, 125, 40)}
          </svg>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 text-center">After Rotation</h4>
          <svg width="250" height="200" className="mx-auto">
            {renderNode(afterTree, 125, 40)}
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-black bg-clip-text text-transparent">
                  Red-Black Tree Rotations
                </h1>
                <p className="text-gray-400 text-sm">Color-based balance maintenance operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaSyncAlt className="w-5 h-5 text-red-400" />
              <span className="text-gray-300 text-sm">RB Rotations</span>
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
                  Rotation Scenario
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'LL', label: 'Left-Left (Right Rotation)' },
                    { value: 'RR', label: 'Right-Right (Left Rotation)' },
                    { value: 'LR', label: 'Left-Right (Double)' },
                    { value: 'RL', label: 'Right-Left (Double)' },
                    { value: 'UNCLE_RED', label: 'Uncle Red (Recolor)' },
                    { value: 'DELETE_SIBLING', label: 'Delete Red Sibling' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRotationType(option.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                        rotationType === option.value 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pause : play}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
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

              {/* Current Status */}
              {(violationCase || rotationStep) && (
                <div className="mt-6 bg-red-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Current Status:</h3>
                  <div className="space-y-2 text-sm">
                    {violationCase && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Violation:</span>
                        <span className="text-red-400 font-bold text-xs">{violationCase}</span>
                      </div>
                    )}
                    {rotationStep && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Step:</span>
                        <span className="text-orange-400 font-bold text-xs">{rotationStep}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rotation Details */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">{getRotationName(rotationType)}</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  {rotationType === 'LL' && (
                    <>
                      <p>• Red-Red violation in left-left path</p>
                      <p>• Single RIGHT rotation at grandparent</p>
                      <p>• Recolor: parent → BLACK, grandparent → RED</p>
                      <p>• Time complexity: O(1)</p>
                    </>
                  )}
                  {rotationType === 'RR' && (
                    <>
                      <p>• Red-Red violation in right-right path</p>
                      <p>• Single LEFT rotation at grandparent</p>
                      <p>• Recolor: parent → BLACK, grandparent → RED</p>
                      <p>• Time complexity: O(1)</p>
                    </>
                  )}
                  {rotationType === 'LR' && (
                    <>
                      <p>• Red-Red violation in left-right path</p>
                      <p>• Double rotation: LEFT then RIGHT</p>
                      <p>• Grandchild becomes new root</p>
                      <p>• Time complexity: O(1)</p>
                    </>
                  )}
                  {rotationType === 'RL' && (
                    <>
                      <p>• Red-Red violation in right-left path</p>
                      <p>• Double rotation: RIGHT then LEFT</p>
                      <p>• Grandchild becomes new root</p>
                      <p>• Time complexity: O(1)</p>
                    </>
                  )}
                  {rotationType === 'UNCLE_RED' && (
                    <>
                      <p>• Uncle is RED - can use recoloring</p>
                      <p>• No rotation needed - just recolor</p>
                      <p>• Parent/Uncle → BLACK, Grandparent → RED</p>
                      <p>• Continue checking from grandparent</p>
                    </>
                  )}
                  {rotationType === 'DELETE_SIBLING' && (
                    <>
                      <p>• Deletion case: sibling is RED</p>
                      <p>• Rotate to make sibling BLACK</p>
                      <p>• Then continue with appropriate case</p>
                      <p>• Part of deletion fix-up process</p>
                    </>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                    <span className="text-gray-300">Red Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-black border border-gray-400 rounded-full"></div>
                    <span className="text-gray-300">Black Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Rotation Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-yellow-500"></div>
                    <span className="text-gray-300">Rotation Edge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Red-Black Rotation Visualization</h2>
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

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Select a rotation scenario and click play'}
                </p>
              </div>

              {/* Red-Black Properties */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Red-Black Rotation Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div>
                    <h4 className="font-medium text-white mb-2">Insertion Cases:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• LL/RR: Single rotation</li>
                      <li>• LR/RL: Double rotation</li>
                      <li>• Uncle red: Recoloring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Deletion Cases:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Red sibling: Rotate first</li>
                      <li>• Black sibling: Various fixes</li>
                      <li>• At most 3 rotations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Properties:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Root always BLACK</li>
                      <li>• No adjacent RED nodes</li>
                      <li>• Equal black height</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Red-Black Tree Rotations</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Rotation Complexity:</strong> O(1) - Constant time operations</p>
                  <p><strong>Insertion Fix:</strong> At most 2 rotations needed</p>
                  <p><strong>Deletion Fix:</strong> At most 3 rotations needed</p>
                  <p><strong>Recoloring:</strong> May propagate up to root (O(log n))</p>
                  <p><strong>Advantage:</strong> Fewer rotations than AVL trees during modifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RedBlackRotations
