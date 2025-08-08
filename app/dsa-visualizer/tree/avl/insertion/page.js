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
  FaPlus
} from 'react-icons/fa'

const AVLInsertion = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [insertValue, setInsertValue] = useState(25)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [insertPath, setInsertPath] = useState([])
  const [rotationNodes, setRotationNodes] = useState(new Set())
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [balanceFactors, setBalanceFactors] = useState({})
  const [rotationType, setRotationType] = useState('')
  const [manualValue, setManualValue] = useState('')

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

  // Insert node in AVL tree
  const insertNode = (node, value) => {
    // Step 1: Perform normal BST insertion
    if (!node) return new AVLNode(value)

    if (value < node.value) {
      node.left = insertNode(node.left, value)
    } else if (value > node.value) {
      node.right = insertNode(node.right, value)
    } else {
      // Duplicate values not allowed
      return node
    }

    // Step 2: Update height of ancestor node
    updateHeight(node)

    // Step 3: Get balance factor
    const balance = getBalance(node)

    // Step 4: Check if node became unbalanced
    
    // Left Left Case
    if (balance > 1 && value < node.left.value) {
      return rotateRight(node)
    }

    // Right Right Case
    if (balance < -1 && value > node.right.value) {
      return rotateLeft(node)
    }

    // Left Right Case
    if (balance > 1 && value > node.left.value) {
      node.left = rotateLeft(node.left)
      return rotateRight(node)
    }

    // Right Left Case
    if (balance < -1 && value < node.right.value) {
      node.right = rotateRight(node.right)
      return rotateLeft(node)
    }

    return node
  }

  // Generate initial AVL tree
  const generateTree = useCallback(() => {
    let root = null
    const values = [50, 30, 70, 20, 40]
    
    values.forEach(value => {
      root = insertNode(root, value)
    })
    
    setTree(root)
    setCurrentStep(0)
    setCurrentNode(null)
    setInsertPath([])
    setRotationNodes(new Set())
    setHighlightedNodes(new Set())
    setRotationType('')
    setIsPlaying(false)
    generateSteps(root, insertValue)
  }, [insertValue])

  // Generate insertion steps
  const generateSteps = (tree, value) => {
    const steps = []
    const path = []
    let stepTree = cloneTree(tree)
    
    steps.push({
      type: 'initial',
      tree: stepTree,
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      balanceFactors: calculateAllBalances(stepTree),
      rotationType: '',
      description: `Starting AVL insertion of value ${value}. AVL trees maintain balance factor |BF| ≤ 1.`
    })

    // Simulate insertion with detailed steps
    const insertWithSteps = (node, value, currentPath = []) => {
      if (!node) {
        const newNode = new AVLNode(value)
        steps.push({
          type: 'insert',
          tree: insertNodeToTree(cloneTree(tree), value, currentPath),
          current: value,
          path: [...currentPath, value],
          rotationNodes: new Set(),
          highlighted: new Set([value]),
          balanceFactors: calculateAllBalances(insertNodeToTree(cloneTree(tree), value, currentPath)),
          rotationType: '',
          description: `Inserted ${value} as new leaf node. Now check balance factors up the path.`
        })
        return newNode
      }

      currentPath.push(node.value)
      
      steps.push({
        type: 'traverse',
        tree: cloneTree(stepTree),
        current: node.value,
        path: [...currentPath],
        rotationNodes: new Set(),
        highlighted: new Set([node.value]),
        balanceFactors: calculateAllBalances(stepTree),
        rotationType: '',
        description: `Compare ${value} with ${node.value}. ${value} ${value < node.value ? '<' : value > node.value ? '>' : '='} ${node.value}`
      })

      if (value < node.value) {
        steps.push({
          type: 'go_left',
          tree: cloneTree(stepTree),
          current: node.value,
          path: [...currentPath],
          rotationNodes: new Set(),
          highlighted: new Set([node.value]),
          balanceFactors: calculateAllBalances(stepTree),
          rotationType: '',
          description: `${value} < ${node.value}, go LEFT to insert in left subtree.`
        })
        node.left = insertWithSteps(node.left, value, [...currentPath])
      } else if (value > node.value) {
        steps.push({
          type: 'go_right',
          tree: cloneTree(stepTree),
          current: node.value,
          path: [...currentPath],
          rotationNodes: new Set(),
          highlighted: new Set([node.value]),
          balanceFactors: calculateAllBalances(stepTree),
          rotationType: '',
          description: `${value} > ${node.value}, go RIGHT to insert in right subtree.`
        })
        node.right = insertWithSteps(node.right, value, [...currentPath])
      } else {
        steps.push({
          type: 'duplicate',
          tree: cloneTree(stepTree),
          current: node.value,
          path: [...currentPath],
          rotationNodes: new Set(),
          highlighted: new Set([node.value]),
          balanceFactors: calculateAllBalances(stepTree),
          rotationType: '',
          description: `Value ${value} already exists. Duplicates not allowed in AVL tree.`
        })
        currentPath.pop()
        return node
      }

      // Update height
      updateHeight(node)
      
      // Check balance factor
      const balance = getBalance(node)
      
      steps.push({
        type: 'check_balance',
        tree: cloneTree(stepTree),
        current: node.value,
        path: [...currentPath],
        rotationNodes: new Set(),
        highlighted: new Set([node.value]),
        balanceFactors: calculateAllBalances(stepTree),
        rotationType: '',
        description: `Check balance factor of ${node.value}: BF = ${balance}. ${Math.abs(balance) <= 1 ? 'Balanced ✓' : 'Unbalanced! Need rotation.'}`
      })

      // Handle rotations
      if (balance > 1) {
        if (value < node.left.value) {
          // Left Left Case
          steps.push({
            type: 'rotation_needed',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...currentPath],
            rotationNodes: new Set([node.value, node.left.value]),
            highlighted: new Set([node.value, node.left.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: 'Right Rotation (LL)',
            description: `Left-Left case detected at ${node.value}. Perform RIGHT rotation.`
          })
          
          const rotatedTree = cloneTree(stepTree)
          const rotatedNode = rotateRight(findNodeInTree(rotatedTree, node.value))
          updateTreeAfterRotation(rotatedTree, node.value, rotatedNode)
          
          steps.push({
            type: 'rotation_complete',
            tree: rotatedTree,
            current: rotatedNode.value,
            path: [...currentPath],
            rotationNodes: new Set(),
            highlighted: new Set([rotatedNode.value]),
            balanceFactors: calculateAllBalances(rotatedTree),
            rotationType: '',
            description: `Right rotation complete. ${rotatedNode.value} is now the root of this subtree.`
          })
          
          node = rotateRight(node)
        } else {
          // Left Right Case
          steps.push({
            type: 'rotation_needed',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...currentPath],
            rotationNodes: new Set([node.value, node.left.value, node.left.right.value]),
            highlighted: new Set([node.value, node.left.value, node.left.right.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: 'Left-Right Rotation (LR)',
            description: `Left-Right case detected. First LEFT rotation on ${node.left.value}, then RIGHT on ${node.value}.`
          })
          
          node.left = rotateLeft(node.left)
          node = rotateRight(node)
          
          steps.push({
            type: 'rotation_complete',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...currentPath],
            rotationNodes: new Set(),
            highlighted: new Set([node.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: '',
            description: `Left-Right rotation complete. Tree is now balanced.`
          })
        }
      }
      
      if (balance < -1) {
        if (value > node.right.value) {
          // Right Right Case
          steps.push({
            type: 'rotation_needed',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...currentPath],
            rotationNodes: new Set([node.value, node.right.value]),
            highlighted: new Set([node.value, node.right.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: 'Left Rotation (RR)',
            description: `Right-Right case detected at ${node.value}. Perform LEFT rotation.`
          })
          
          node = rotateLeft(node)
          
          steps.push({
            type: 'rotation_complete',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...currentPath],
            rotationNodes: new Set(),
            highlighted: new Set([node.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: '',
            description: `Left rotation complete. ${node.value} is now the root of this subtree.`
          })
        } else {
          // Right Left Case
          steps.push({
            type: 'rotation_needed',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...currentPath],
            rotationNodes: new Set([node.value, node.right.value, node.right.left.value]),
            highlighted: new Set([node.value, node.right.value, node.right.left.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: 'Right-Left Rotation (RL)',
            description: `Right-Left case detected. First RIGHT rotation on ${node.right.value}, then LEFT on ${node.value}.`
          })
          
          node.right = rotateRight(node.right)
          node = rotateLeft(node)
          
          steps.push({
            type: 'rotation_complete',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...currentPath],
            rotationNodes: new Set(),
            highlighted: new Set([node.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: '',
            description: `Right-Left rotation complete. Tree is now balanced.`
          })
        }
      }

      currentPath.pop()
      return node
    }

    if (tree) {
      insertWithSteps(cloneTree(tree), value, [])
    } else {
      const newTree = new AVLNode(value)
      stepTree = newTree
    }

    steps.push({
      type: 'complete',
      tree: insertNode(cloneTree(tree), value),
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      balanceFactors: calculateAllBalances(insertNode(cloneTree(tree), value)),
      rotationType: '',
      description: `AVL insertion complete! Value ${value} inserted and tree rebalanced. All balance factors ≤ 1.`
    })

    setSteps(steps)
  }

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

  const calculateAllBalances = (tree) => {
    const balances = {}
    const traverse = (node) => {
      if (!node) return
      balances[node.value] = getBalance(node)
      traverse(node.left)
      traverse(node.right)
    }
    traverse(tree)
    return balances
  }

  const findNodeInTree = (tree, value) => {
    if (!tree) return null
    if (tree.value === value) return tree
    return findNodeInTree(tree.left, value) || findNodeInTree(tree.right, value)
  }

  const insertNodeToTree = (tree, value, path) => {
    if (!tree) return new AVLNode(value)
    return insertNode(tree, value)
  }

  const updateTreeAfterRotation = (tree, oldRoot, newRoot) => {
    // This is a simplified version - in a real implementation you'd need
    // to properly update the tree structure after rotation
    return tree
  }

  // Manual insertion
  const insertManualValue = () => {
    const value = parseInt(manualValue)
    if (isNaN(value) || value < 1 || value > 100) return
    
    setInsertValue(value)
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
      setInsertPath(step.path || [])
      setRotationNodes(step.rotationNodes || new Set())
      setHighlightedNodes(step.highlighted || new Set())
      setBalanceFactors(step.balanceFactors || {})
      setRotationType(step.rotationType || '')
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

  const getNodeColor = (nodeValue) => {
    if (rotationNodes.has(nodeValue)) {
      return 'fill-purple-500 stroke-purple-400 animate-pulse'
    }
    if (highlightedNodes.has(nodeValue)) {
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (currentNode === nodeValue) {
      return 'fill-blue-500 stroke-blue-400 animate-pulse'
    }
    if (insertPath.includes(nodeValue)) {
      return 'fill-green-500 stroke-green-400'
    }
    return 'fill-gray-500 stroke-gray-400'
  }

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null

    const nodeSize = 50
    const levelSpacing = 120
    const horizontalSpacing = Math.pow(2, 4 - level) * 40

    const balance = balanceFactors[node.value] || 0

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

        {/* Rotation indicator */}
        {rotationNodes.has(node.value) && (
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2 + 8}
            className="fill-none stroke-purple-400 stroke-3 opacity-60"
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

        {/* Balance factor */}
        <text
          x={x - 35}
          y={y - 25}
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
          x={x + 35}
          y={y - 25}
          textAnchor="middle"
          className="fill-cyan-400 font-bold text-xs"
        >
          H:{node.height}
        </text>

        {/* New node indicator */}
        {insertPath.includes(node.value) && insertPath[insertPath.length - 1] === node.value && (
          <text
            x={x}
            y={y - 40}
            textAnchor="middle"
            className="fill-green-400 font-bold text-xs"
          >
            NEW
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  AVL Tree Insertion
                </h1>
                <p className="text-gray-400 text-sm">Self-balancing binary search tree with rotations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaBalanceScale className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Balanced Tree</span>
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
              
              {/* Insert Value */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Insert Value: {insertValue}
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
                  New Insert Demo
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

              {/* Rotation Type */}
              {rotationType && (
                <div className="mt-6 bg-purple-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Rotation Required:</h3>
                  <div className="bg-purple-800 rounded p-3 text-center">
                    <span className="px-3 py-1 bg-purple-600 text-white rounded font-bold text-sm">
                      {rotationType}
                    </span>
                  </div>
                </div>
              )}

              {/* Balance Factors */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Balance Factors:</h3>
                <div className="text-xs space-y-1">
                  {Object.entries(balanceFactors).map(([node, bf]) => (
                    <div key={node} className="flex justify-between">
                      <span className="text-gray-300">Node {node}:</span>
                      <span className={`font-bold ${
                        Math.abs(bf) > 1 ? 'text-red-400' : 
                        bf === 0 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {bf > 0 ? '+' : ''}{bf}
                      </span>
                    </div>
                  ))}
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
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">In Insert Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Highlighted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">Rotation Nodes</span>
                  </div>
                </div>
              </div>

              {/* AVL Properties */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">AVL Properties:</h3>
                <div className="text-gray-300 text-xs space-y-1">
                  <p>• Balance Factor = Height(L) - Height(R)</p>
                  <p>• For all nodes: |BF| ≤ 1</p>
                  <p>• Self-balancing via rotations</p>
                  <p>• Guarantees O(log n) operations</p>
                  <p>• Height ≤ 1.44 log(n)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">AVL Tree Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* AVL Tree Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  <svg width="900" height="600" viewBox="0 0 900 600">
                    {tree && renderNode(tree, 450, 80)}
                  </svg>
                </div>
              </div>

              {/* Rotation Types */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">AVL Rotation Types:</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-blue-400 font-medium">Left-Left (LL)</div>
                    <div className="text-gray-300">Right Rotation</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-green-400 font-medium">Right-Right (RR)</div>
                    <div className="text-gray-300">Left Rotation</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-purple-400 font-medium">Left-Right (LR)</div>
                    <div className="text-gray-300">Left + Right</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-yellow-400 font-medium">Right-Left (RL)</div>
                    <div className="text-gray-300">Right + Left</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start AVL insertion'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">AVL Insertion Algorithm:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(log n) - Guaranteed balanced tree</p>
                  <p><strong>Space Complexity:</strong> O(log n) - Recursion stack</p>
                  <p><strong>Steps:</strong> 1) Insert as BST, 2) Update heights, 3) Check balance, 4) Rotate if needed</p>
                  <p><strong>Advantage:</strong> Worst-case O(log n) vs BST's O(n)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AVLInsertion
