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
  FaPlus,
  FaBalanceScale,
  FaTree
} from 'react-icons/fa'

const RedBlackInsertion = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [insertValue, setInsertValue] = useState(25)
  const [currentNode, setCurrentNode] = useState(null)
  const [insertPath, setInsertPath] = useState([])
  const [rotationNodes, setRotationNodes] = useState(new Set())
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [fixUpPhase, setFixUpPhase] = useState('')
  const [violationType, setViolationType] = useState('')
  const [manualValue, setManualValue] = useState('')

  // Red-Black Tree Node class
  class RBNode {
    constructor(value, color = 'RED') {
      this.value = value
      this.color = color // 'RED' or 'BLACK'
      this.left = null
      this.right = null
      this.parent = null
      this.id = `rb-node-${value}-${Date.now()}`
    }
  }

  // Helper functions
  const isRed = (node) => node && node.color === 'RED'
  const isBlack = (node) => !node || node.color === 'BLACK'

  // Get grandparent of node
  const getGrandparent = (node) => {
    return node && node.parent ? node.parent.parent : null
  }

  // Get uncle of node
  const getUncle = (node) => {
    const grandparent = getGrandparent(node)
    if (!grandparent) return null
    return node.parent === grandparent.left ? grandparent.right : grandparent.left
  }

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

  // Insert node into Red-Black Tree
  const insertRBNode = (root, value) => {
    // Step 1: Regular BST insertion
    if (!root) {
      const newNode = new RBNode(value, 'BLACK') // Root is always black
      return newNode
    }

    const insertBST = (node, val) => {
      if (val < node.value) {
        if (!node.left) {
          node.left = new RBNode(val, 'RED')
          node.left.parent = node
          return node.left
        }
        return insertBST(node.left, val)
      } else if (val > node.value) {
        if (!node.right) {
          node.right = new RBNode(val, 'RED')
          node.right.parent = node
          return node.right
        }
        return insertBST(node.right, val)
      }
      return null // Duplicate
    }

    const insertedNode = insertBST(root, value)
    if (!insertedNode) return root

    // Step 2: Fix Red-Black violations
    return fixInsertViolations(root, insertedNode)
  }

  // Fix Red-Black Tree violations after insertion
  const fixInsertViolations = (root, node) => {
    let currentRoot = root
    let current = node

    while (current !== currentRoot && isRed(current.parent)) {
      const parent = current.parent
      const grandparent = getGrandparent(current)
      const uncle = getUncle(current)

      if (isRed(uncle)) {
        // Case 1: Uncle is red - recolor
        parent.color = 'BLACK'
        uncle.color = 'BLACK'
        grandparent.color = 'RED'
        current = grandparent
      } else {
        // Uncle is black - rotation needed
        if (parent === grandparent.left) {
          if (current === parent.right) {
            // Case 2a: Left-Right case
            current = parent
            currentRoot = performLeftRotation(currentRoot, current)
          }
          // Case 3a: Left-Left case
          parent.color = 'BLACK'
          grandparent.color = 'RED'
          currentRoot = performRightRotation(currentRoot, grandparent)
        } else {
          if (current === parent.left) {
            // Case 2b: Right-Left case
            current = parent
            currentRoot = performRightRotation(currentRoot, current)
          }
          // Case 3b: Right-Right case
          parent.color = 'BLACK'
          grandparent.color = 'RED'
          currentRoot = performLeftRotation(currentRoot, grandparent)
        }
      }
    }

    currentRoot.color = 'BLACK' // Root must be black
    return currentRoot
  }

  // Perform left rotation and update root if needed
  const performLeftRotation = (root, node) => {
    const newRoot = rotateLeft(node)
    return node === root ? newRoot : root
  }

  // Perform right rotation and update root if needed
  const performRightRotation = (root, node) => {
    const newRoot = rotateRight(node)
    return node === root ? newRoot : root
  }

  // Generate initial Red-Black Tree
  const generateTree = useCallback(() => {
    let root = null
    const values = [15, 10, 20, 8, 12, 25]
    
    values.forEach(value => {
      root = insertRBNode(root, value)
    })
    
    setTree(root)
    setCurrentStep(0)
    setCurrentNode(null)
    setInsertPath([])
    setRotationNodes(new Set())
    setHighlightedNodes(new Set())
    setFixUpPhase('')
    setViolationType('')
    setIsPlaying(false)
    generateSteps(root, insertValue)
  }, [insertValue])

  // Generate insertion steps
  const generateSteps = (tree, value) => {
    const steps = []
    let stepTree = cloneTree(tree)
    
    steps.push({
      type: 'initial',
      tree: stepTree,
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      fixUpPhase: '',
      violationType: '',
      description: `Starting Red-Black Tree insertion of value ${value}. RB properties: 1) Root is black, 2) No two red nodes adjacent, 3) All paths have same black height.`
    })

    // Step 1: BST insertion
    steps.push({
      type: 'bst_insertion',
      tree: stepTree,
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      fixUpPhase: 'BST Insertion',
      violationType: '',
      description: `Step 1: Insert ${value} using standard BST insertion. New nodes are always colored RED.`
    })

    // Find insertion path
    const path = []
    let current = stepTree
    let parent = null

    while (current) {
      path.push(current.value)
      
      steps.push({
        type: 'search',
        tree: cloneTree(stepTree),
        current: current.value,
        path: [...path],
        rotationNodes: new Set(),
        highlighted: new Set([current.value]),
        fixUpPhase: 'BST Insertion',
        violationType: '',
        description: `Compare ${value} with ${current.value}. ${value < current.value ? 'Go left' : value > current.value ? 'Go right' : 'Duplicate found'}.`
      })

      if (value === current.value) {
        steps.push({
          type: 'duplicate',
          tree: cloneTree(stepTree),
          current: current.value,
          path: [...path],
          rotationNodes: new Set(),
          highlighted: new Set([current.value]),
          fixUpPhase: '',
          violationType: '',
          description: `Value ${value} already exists. Red-Black Trees don't allow duplicates.`
        })
        setSteps(steps)
        return
      }

      parent = current
      if (value < current.value) {
        current = current.left
      } else {
        current = current.right
      }
    }

    // Insert the new node
    const newNode = new RBNode(value, 'RED')
    const insertedTree = insertNodeInTree(cloneTree(stepTree), value, parent.value, value < parent.value ? 'left' : 'right')
    
    path.push(value)
    steps.push({
      type: 'inserted',
      tree: insertedTree,
      current: value,
      path: [...path],
      rotationNodes: new Set(),
      highlighted: new Set([value]),
      fixUpPhase: 'BST Insertion Complete',
      violationType: '',
      description: `Inserted ${value} as RED node ${value < parent.value ? 'left' : 'right'} of ${parent.value}. Now check for RB violations.`
    })

    // Step 2: Fix-up phase
    simulateFixUp(steps, insertedTree, value, path)

    steps.push({
      type: 'complete',
      tree: insertRBNode(cloneTree(tree), value),
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      fixUpPhase: 'Complete',
      violationType: '',
      description: `Red-Black insertion complete! Tree maintains all RB properties. Black height preserved on all paths.`
    })

    setSteps(steps)
  }

  // Simulate the fix-up process
  const simulateFixUp = (steps, tree, insertedValue, path) => {
    // Find the inserted node
    const insertedNode = findNodeInTree(tree, insertedValue)
    if (!insertedNode || !insertedNode.parent) return

    // Check for violation: red parent of red child
    if (isRed(insertedNode.parent)) {
      const parent = insertedNode.parent
      const grandparent = parent.parent
      const uncle = grandparent ? (parent === grandparent.left ? grandparent.right : grandparent.left) : null

      steps.push({
        type: 'violation_detected',
        tree: cloneTree(tree),
        current: insertedValue,
        path: [...path],
        rotationNodes: new Set(),
        highlighted: new Set([insertedValue, parent.value, grandparent?.value].filter(Boolean)),
        fixUpPhase: 'Violation Detected',
        violationType: 'Red-Red Violation',
        description: `Red-Red violation detected! Node ${insertedValue} (RED) has parent ${parent.value} (RED). Need to fix this.`
      })

      if (uncle && isRed(uncle)) {
        // Case 1: Uncle is red - recoloring
        steps.push({
          type: 'case1_recolor',
          tree: cloneTree(tree),
          current: insertedValue,
          path: [...path],
          rotationNodes: new Set(),
          highlighted: new Set([parent.value, uncle.value, grandparent.value]),
          fixUpPhase: 'Case 1: Recoloring',
          violationType: 'Uncle is Red',
          description: `Case 1: Uncle ${uncle.value} is RED. Recolor parent and uncle to BLACK, grandparent to RED.`
        })

        // Apply recoloring
        const recoloredTree = cloneTree(tree)
        const recoloredParent = findNodeInTree(recoloredTree, parent.value)
        const recoloredUncle = findNodeInTree(recoloredTree, uncle.value)
        const recoloredGrandparent = findNodeInTree(recoloredTree, grandparent.value)
        
        recoloredParent.color = 'BLACK'
        recoloredUncle.color = 'BLACK'
        recoloredGrandparent.color = 'RED'

        steps.push({
          type: 'recolor_complete',
          tree: recoloredTree,
          current: grandparent.value,
          path: [grandparent.value],
          rotationNodes: new Set(),
          highlighted: new Set([grandparent.value]),
          fixUpPhase: 'Recoloring Complete',
          violationType: '',
          description: `Recoloring complete. Continue checking from grandparent ${grandparent.value} (now RED).`
        })

      } else {
        // Cases 2 & 3: Uncle is black - rotations needed
        const isLeftChild = parent === grandparent.left
        const isLeftGrandchild = insertedNode === parent.left

        if (isLeftChild && !isLeftGrandchild) {
          // Case 2a: Left-Right case
          steps.push({
            type: 'case2_left_right',
            tree: cloneTree(tree),
            current: insertedValue,
            path: [...path],
            rotationNodes: new Set([parent.value, insertedValue]),
            highlighted: new Set([parent.value, insertedValue, grandparent.value]),
            fixUpPhase: 'Case 2a: Left-Right',
            violationType: 'Left-Right Case',
            description: `Case 2a: Left-Right case. Perform LEFT rotation on parent ${parent.value}.`
          })
        } else if (!isLeftChild && isLeftGrandchild) {
          // Case 2b: Right-Left case
          steps.push({
            type: 'case2_right_left',
            tree: cloneTree(tree),
            current: insertedValue,
            path: [...path],
            rotationNodes: new Set([parent.value, insertedValue]),
            highlighted: new Set([parent.value, insertedValue, grandparent.value]),
            fixUpPhase: 'Case 2b: Right-Left',
            violationType: 'Right-Left Case',
            description: `Case 2b: Right-Left case. Perform RIGHT rotation on parent ${parent.value}.`
          })
        }

        // Case 3: Final rotation and recoloring
        const rotationType = isLeftChild ? 'RIGHT' : 'LEFT'
        steps.push({
          type: 'case3_rotation',
          tree: cloneTree(tree),
          current: insertedValue,
          path: [...path],
          rotationNodes: new Set([parent.value, grandparent.value]),
          highlighted: new Set([parent.value, grandparent.value]),
          fixUpPhase: `Case 3: ${rotationType} Rotation`,
          violationType: `${isLeftChild ? 'Left-Left' : 'Right-Right'} Case`,
          description: `Case 3: Perform ${rotationType} rotation on grandparent ${grandparent.value}. Recolor parent to BLACK, grandparent to RED.`
        })

        steps.push({
          type: 'rotation_complete',
          tree: cloneTree(tree),
          current: parent.value,
          path: [parent.value],
          rotationNodes: new Set(),
          highlighted: new Set([parent.value]),
          fixUpPhase: 'Rotation Complete',
          violationType: '',
          description: `Rotation and recoloring complete. ${parent.value} is now BLACK and root of this subtree.`
        })
      }
    }

    // Ensure root is black
    steps.push({
      type: 'root_black',
      tree: cloneTree(tree),
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      fixUpPhase: 'Root Check',
      violationType: '',
      description: `Final step: Ensure root is BLACK. Root color is enforced by Red-Black Tree property.`
    })
  }

  // Helper functions
  const cloneTree = (node) => {
    if (!node) return null
    const newNode = new RBNode(node.value, node.color)
    newNode.id = node.id
    newNode.left = cloneTree(node.left)
    newNode.right = cloneTree(node.right)
    if (newNode.left) newNode.left.parent = newNode
    if (newNode.right) newNode.right.parent = newNode
    return newNode
  }

  const findNodeInTree = (tree, value) => {
    if (!tree) return null
    if (tree.value === value) return tree
    return findNodeInTree(tree.left, value) || findNodeInTree(tree.right, value)
  }

  const insertNodeInTree = (tree, value, parentValue, direction) => {
    if (!tree) return new RBNode(value, 'RED')
    
    const insertInto = (node) => {
      if (!node) return new RBNode(value, 'RED')
      
      if (value < node.value) {
        node.left = insertInto(node.left)
        if (node.left) node.left.parent = node
      } else if (value > node.value) {
        node.right = insertInto(node.right)
        if (node.right) node.right.parent = node
      }
      return node
    }
    
    return insertInto(tree)
  }

  // Manual insertion
  const insertManualValue = () => {
    const value = parseInt(manualValue)
    if (isNaN(value) || value < 1 || value > 100) return
    
    setInsertValue(value)
    setManualValue('')
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
      setInsertPath(step.path || [])
      setRotationNodes(step.rotationNodes || new Set())
      setHighlightedNodes(step.highlighted || new Set())
      setFixUpPhase(step.fixUpPhase || '')
      setViolationType(step.violationType || '')
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
    if (currentNode === node.value) {
      return node.color === 'RED' ? 'fill-red-500 stroke-yellow-400 animate-pulse stroke-4' : 'fill-black stroke-yellow-400 animate-pulse stroke-4'
    }
    if (highlightedNodes.has(node.value)) {
      return node.color === 'RED' ? 'fill-red-400 stroke-yellow-300 stroke-3' : 'fill-gray-800 stroke-yellow-300 stroke-3'
    }
    if (rotationNodes.has(node.value)) {
      return node.color === 'RED' ? 'fill-red-300 stroke-purple-400 stroke-2' : 'fill-gray-600 stroke-purple-400 stroke-2'
    }
    return node.color === 'RED' ? 'fill-red-600 stroke-red-400' : 'fill-black stroke-gray-400'
  }

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null

    const leftChild = node.left
    const rightChild = node.right
    const childY = y + 80
    const separation = Math.max(40, 200 / (level + 1))

    return (
      <g key={node.id}>
        {/* Edges to children */}
        {leftChild && (
          <line
            x1={x}
            y1={y}
            x2={x - separation}
            y2={childY}
            stroke="#6B7280"
            strokeWidth="2"
          />
        )}
        {rightChild && (
          <line
            x1={x}
            y1={y}
            x2={x + separation}
            y2={childY}
            stroke="#6B7280"
            strokeWidth="2"
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
          className={`${getNodeColor(node)} stroke-2 transition-all duration-500`}
        />
        
        {/* Node value */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className={`${node.color === 'RED' ? 'fill-white' : 'fill-white'} text-lg font-bold`}
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
                  Red-Black Tree Insertion
                </h1>
                <p className="text-gray-400 text-sm">Self-balancing BST with color-based balance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaBalanceScale className="w-5 h-5 text-red-400" />
              <span className="text-gray-300 text-sm">Color Balanced</span>
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
              
              {/* Manual Input */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Insert Value (1-100)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter value"
                  />
                  <button
                    onClick={insertManualValue}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: {insertValue}</p>
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

                <button
                  onClick={generateTree}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Restart Algorithm
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

              {/* Fix-up Phase */}
              {fixUpPhase && (
                <div className="mt-6 bg-red-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Fix-up Phase:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Phase:</span>
                      <span className="text-red-400 font-bold">{fixUpPhase}</span>
                    </div>
                    {violationType && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Violation Type:</span>
                        <span className="text-orange-400 font-bold">{violationType}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Color Legend</h3>
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
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">Rotation Node</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaTree className="w-5 h-5" />
                  Red-Black Tree Visualization
                </h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Tree SVG */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <svg width="600" height="400" className="mx-auto">
                  {tree && renderNode(tree, 300, 60)}
                </svg>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start Red-Black Tree insertion'}
                </p>
              </div>

              {/* Red-Black Properties */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Red-Black Tree Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <h4 className="font-medium text-white mb-2">Properties:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Root is always BLACK</li>
                      <li>• No two RED nodes adjacent</li>
                      <li>• All paths have same black height</li>
                      <li>• All NULL pointers are BLACK</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Insertion Cases:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Case 1: Uncle is RED → Recolor</li>
                      <li>• Case 2: Uncle BLACK, zig-zag → Rotate</li>
                      <li>• Case 3: Uncle BLACK, line → Rotate + Recolor</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Red-Black Tree Insertion</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(log n) - Guaranteed balanced height</p>
                  <p><strong>Space Complexity:</strong> O(log n) - Recursion/iteration stack</p>
                  <p><strong>Balance:</strong> Height ≤ 2 * log₂(n + 1)</p>
                  <p><strong>Use Cases:</strong> Maps, sets, databases (better than AVL for insertions)</p>
                  <p><strong>Advantage:</strong> Fewer rotations than AVL trees during insertion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RedBlackInsertion
