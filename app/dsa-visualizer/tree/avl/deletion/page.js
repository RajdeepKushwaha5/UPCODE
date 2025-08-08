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
  FaTrash
} from 'react-icons/fa'

const AVLDeletion = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [deleteValue, setDeleteValue] = useState(30)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [deletePath, setDeletePath] = useState([])
  const [rotationNodes, setRotationNodes] = useState(new Set())
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [balanceFactors, setBalanceFactors] = useState({})
  const [rotationType, setRotationType] = useState('')
  const [deletedNode, setDeletedNode] = useState(null)
  const [replacementNode, setReplacementNode] = useState(null)
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

  // Find minimum value node in subtree
  const findMin = (node) => {
    while (node.left) {
      node = node.left
    }
    return node
  }

  // Delete node from AVL tree
  const deleteNode = (root, value) => {
    // Step 1: Perform normal BST deletion
    if (!root) return root

    if (value < root.value) {
      root.left = deleteNode(root.left, value)
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value)
    } else {
      // Node to be deleted found
      if (!root.left || !root.right) {
        // Node with only one child or no child
        const temp = root.left ? root.left : root.right
        if (!temp) {
          // No child case
          root = null
        } else {
          // One child case
          root = temp
        }
      } else {
        // Node with two children
        const temp = findMin(root.right)
        root.value = temp.value
        root.right = deleteNode(root.right, temp.value)
      }
    }

    if (!root) return root

    // Step 2: Update height
    updateHeight(root)

    // Step 3: Get balance factor
    const balance = getBalance(root)

    // Step 4: Check if node became unbalanced and perform rotations

    // Left Left Case
    if (balance > 1 && getBalance(root.left) >= 0) {
      return rotateRight(root)
    }

    // Left Right Case
    if (balance > 1 && getBalance(root.left) < 0) {
      root.left = rotateLeft(root.left)
      return rotateRight(root)
    }

    // Right Right Case
    if (balance < -1 && getBalance(root.right) <= 0) {
      return rotateLeft(root)
    }

    // Right Left Case
    if (balance < -1 && getBalance(root.right) > 0) {
      root.right = rotateRight(root.right)
      return rotateLeft(root)
    }

    return root
  }

  // Generate initial AVL tree
  const generateTree = useCallback(() => {
    let root = null
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]
    
    values.forEach(value => {
      root = insertNode(root, value)
    })
    
    setTree(root)
    setCurrentStep(0)
    setCurrentNode(null)
    setDeletePath([])
    setRotationNodes(new Set())
    setHighlightedNodes(new Set())
    setRotationType('')
    setDeletedNode(null)
    setReplacementNode(null)
    setIsPlaying(false)
    generateSteps(root, deleteValue)
  }, [deleteValue])

  // Insert node (for tree generation)
  const insertNode = (node, value) => {
    if (!node) return new AVLNode(value)

    if (value < node.value) {
      node.left = insertNode(node.left, value)
    } else if (value > node.value) {
      node.right = insertNode(node.right, value)
    } else {
      return node
    }

    updateHeight(node)
    const balance = getBalance(node)

    if (balance > 1 && value < node.left.value) {
      return rotateRight(node)
    }
    if (balance < -1 && value > node.right.value) {
      return rotateLeft(node)
    }
    if (balance > 1 && value > node.left.value) {
      node.left = rotateLeft(node.left)
      return rotateRight(node)
    }
    if (balance < -1 && value < node.right.value) {
      node.right = rotateRight(node.right)
      return rotateLeft(node)
    }

    return node
  }

  // Generate deletion steps
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
      balanceFactors: calculateAllBalances(stepTree),
      rotationType: '',
      deletedNode: null,
      replacement: null,
      description: `Starting AVL deletion of value ${value}. First, locate the node to delete.`
    })

    // Step 1: Find the node to delete
    const findAndDelete = (node, target, path = []) => {
      if (!node) {
        steps.push({
          type: 'not_found',
          tree: cloneTree(stepTree),
          current: null,
          path: [...path],
          rotationNodes: new Set(),
          highlighted: new Set(),
          balanceFactors: calculateAllBalances(stepTree),
          rotationType: '',
          deletedNode: null,
          replacement: null,
          description: `Value ${target} not found in AVL tree. Nothing to delete.`
        })
        return null
      }

      path.push(node.value)
      
      steps.push({
        type: 'search',
        tree: cloneTree(stepTree),
        current: node.value,
        path: [...path],
        rotationNodes: new Set(),
        highlighted: new Set([node.value]),
        balanceFactors: calculateAllBalances(stepTree),
        rotationType: '',
        deletedNode: null,
        replacement: null,
        description: `Compare ${target} with ${node.value}. ${target === node.value ? 'Found target!' : target < node.value ? 'Go left' : 'Go right'}`
      })

      if (target === node.value) {
        // Found the node to delete
        steps.push({
          type: 'found',
          tree: cloneTree(stepTree),
          current: node.value,
          path: [...path],
          rotationNodes: new Set(),
          highlighted: new Set([node.value]),
          balanceFactors: calculateAllBalances(stepTree),
          rotationType: '',
          deletedNode: node.value,
          replacement: null,
          description: `Found node ${target}! Now determine deletion case and handle balancing.`
        })

        // Check deletion cases
        if (!node.left && !node.right) {
          // Case 1: Leaf node
          steps.push({
            type: 'delete_leaf',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...path],
            rotationNodes: new Set(),
            highlighted: new Set([node.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: '',
            deletedNode: node.value,
            replacement: null,
            description: `Case 1: Leaf node. Simply remove ${target}.`
          })
        } else if (!node.left || !node.right) {
          // Case 2: One child
          const child = node.left || node.right
          steps.push({
            type: 'delete_one_child',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...path],
            rotationNodes: new Set(),
            highlighted: new Set([node.value, child.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: '',
            deletedNode: node.value,
            replacement: child.value,
            description: `Case 2: One child (${child.value}). Replace ${target} with its child.`
          })
        } else {
          // Case 3: Two children - find inorder successor
          const successor = findMin(node.right)
          steps.push({
            type: 'delete_two_children',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...path],
            rotationNodes: new Set(),
            highlighted: new Set([node.value, successor.value]),
            balanceFactors: calculateAllBalances(stepTree),
            rotationType: '',
            deletedNode: node.value,
            replacement: successor.value,
            description: `Case 3: Two children. Replace ${target} with inorder successor ${successor.value}.`
          })
        }

        // Perform deletion and check for rebalancing
        const newTree = deleteNode(cloneTree(stepTree), target)
        stepTree = newTree
        
        steps.push({
          type: 'deleted',
          tree: cloneTree(stepTree),
          current: null,
          path: [],
          rotationNodes: new Set(),
          highlighted: new Set(),
          balanceFactors: calculateAllBalances(stepTree),
          rotationType: '',
          deletedNode: null,
          replacement: null,
          description: `Node ${target} deleted. Now check balance factors and perform rotations if needed.`
        })

        // Check for imbalances and rotations along the path
        checkAndRotate(stepTree, [...path])
        
        return
      }

      if (target < node.value) {
        findAndDelete(node.left, target, [...path])
      } else {
        findAndDelete(node.right, target, [...path])
      }
    }

    // Check balance and rotate if needed
    const checkAndRotate = (tree, path) => {
      // In a real implementation, we'd trace back up the path
      // and check each ancestor for balance violations
      path.reverse().forEach((nodeValue, index) => {
        const node = findNodeInTree(tree, nodeValue)
        if (node) {
          const balance = getBalance(node)
          
          steps.push({
            type: 'check_balance',
            tree: cloneTree(tree),
            current: nodeValue,
            path: [nodeValue],
            rotationNodes: new Set(),
            highlighted: new Set([nodeValue]),
            balanceFactors: calculateAllBalances(tree),
            rotationType: '',
            deletedNode: null,
            replacement: null,
            description: `Check balance factor of node ${nodeValue}: BF = ${balance}. ${Math.abs(balance) <= 1 ? 'Balanced ✓' : 'Unbalanced! Need rotation.'}`
          })

          if (Math.abs(balance) > 1) {
            let rotType = ''
            let rotNodes = new Set([nodeValue])
            
            if (balance > 1) {
              const leftBalance = node.left ? getBalance(node.left) : 0
              if (leftBalance >= 0) {
                rotType = 'Right Rotation (LL)'
                if (node.left) rotNodes.add(node.left.value)
              } else {
                rotType = 'Left-Right Rotation (LR)'
                if (node.left) {
                  rotNodes.add(node.left.value)
                  if (node.left.right) rotNodes.add(node.left.right.value)
                }
              }
            } else {
              const rightBalance = node.right ? getBalance(node.right) : 0
              if (rightBalance <= 0) {
                rotType = 'Left Rotation (RR)'
                if (node.right) rotNodes.add(node.right.value)
              } else {
                rotType = 'Right-Left Rotation (RL)'
                if (node.right) {
                  rotNodes.add(node.right.value)
                  if (node.right.left) rotNodes.add(node.right.left.value)
                }
              }
            }

            steps.push({
              type: 'rotation_needed',
              tree: cloneTree(tree),
              current: nodeValue,
              path: [nodeValue],
              rotationNodes: rotNodes,
              highlighted: rotNodes,
              balanceFactors: calculateAllBalances(tree),
              rotationType: rotType,
              deletedNode: null,
              replacement: null,
              description: `Imbalance detected at ${nodeValue}. Performing ${rotType}.`
            })

            // The actual rotation would be performed here in the real tree
            steps.push({
              type: 'rotation_complete',
              tree: cloneTree(tree),
              current: nodeValue,
              path: [nodeValue],
              rotationNodes: new Set(),
              highlighted: new Set([nodeValue]),
              balanceFactors: calculateAllBalances(tree),
              rotationType: '',
              deletedNode: null,
              replacement: null,
              description: `Rotation complete at ${nodeValue}. Tree is now balanced.`
            })
          }
        }
      })
    }

    findAndDelete(tree, value)

    steps.push({
      type: 'complete',
      tree: deleteNode(cloneTree(tree), value),
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      balanceFactors: calculateAllBalances(deleteNode(cloneTree(tree), value)),
      rotationType: '',
      deletedNode: null,
      replacement: null,
      description: `AVL deletion complete! Value ${value} removed and tree rebalanced. All balance factors ≤ 1.`
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

  // Manual deletion
  const deleteManualValue = () => {
    const value = parseInt(manualValue)
    if (isNaN(value)) return
    
    setDeleteValue(value)
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
      setDeletePath(step.path || [])
      setRotationNodes(step.rotationNodes || new Set())
      setHighlightedNodes(step.highlighted || new Set())
      setBalanceFactors(step.balanceFactors || {})
      setRotationType(step.rotationType || '')
      setDeletedNode(step.deletedNode)
      setReplacementNode(step.replacement)
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
    if (deletedNode === nodeValue) {
      return 'fill-red-500 stroke-red-400 animate-pulse'
    }
    if (replacementNode === nodeValue && replacementNode !== deletedNode) {
      return 'fill-orange-500 stroke-orange-400 animate-pulse'
    }
    if (rotationNodes.has(nodeValue)) {
      return 'fill-purple-500 stroke-purple-400 animate-pulse'
    }
    if (highlightedNodes.has(nodeValue)) {
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (currentNode === nodeValue) {
      return 'fill-blue-500 stroke-blue-400 animate-pulse'
    }
    if (deletePath.includes(nodeValue)) {
      return 'fill-green-500 stroke-green-400'
    }
    return 'fill-gray-500 stroke-gray-400'
  }

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null

    const nodeSize = 50
    const levelSpacing = 120
    const horizontalSpacing = Math.pow(2, 4 - level) * 35

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

        {/* Deleted node indicator */}
        {deletedNode === node.value && (
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2 + 10}
            className="fill-none stroke-red-400 stroke-3 opacity-60"
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

        {/* Node labels */}
        {deletedNode === node.value && (
          <text
            x={x}
            y={y - 40}
            textAnchor="middle"
            className="fill-red-400 font-bold text-xs"
          >
            DELETE
          </text>
        )}

        {replacementNode === node.value && replacementNode !== deletedNode && (
          <text
            x={x}
            y={y - 40}
            textAnchor="middle"
            className="fill-orange-400 font-bold text-xs"
          >
            SUCCESSOR
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  AVL Tree Deletion
                </h1>
                <p className="text-gray-400 text-sm">Delete with automatic rebalancing via rotations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaBalanceScale className="w-5 h-5 text-red-400" />
              <span className="text-gray-300 text-sm">Balanced Deletion</span>
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
              
              {/* Delete Value */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Delete Value: {deleteValue}
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Manual Delete */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Manual Delete
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    placeholder="Enter value to delete"
                    className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm"
                  />
                  <button
                    onClick={deleteManualValue}
                    disabled={!manualValue}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaTrash className="w-3 h-3" />
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
                  New Delete Demo
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

              {/* Deletion Info */}
              {(deletedNode || replacementNode) && (
                <div className="mt-6 bg-red-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Deletion Info:</h3>
                  <div className="space-y-2 text-sm">
                    {deletedNode && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Deleting:</span>
                        <span className="text-red-400 font-bold">{deletedNode}</span>
                      </div>
                    )}
                    {replacementNode && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Replacement:</span>
                        <span className="text-orange-400 font-bold">{replacementNode}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Balance Factors */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Balance Factors:</h3>
                <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
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
                    <span className="text-gray-300">Delete Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Node to Delete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-300">Replacement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">Rotation Nodes</span>
                  </div>
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
                  <svg width="1000" height="700" viewBox="0 0 1000 700">
                    {tree && renderNode(tree, 500, 80)}
                  </svg>
                </div>
              </div>

              {/* Deletion Cases */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">AVL Deletion Cases:</h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-green-400 font-medium">Case 1: Leaf</div>
                    <div className="text-gray-300">Simply remove</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-blue-400 font-medium">Case 2: One Child</div>
                    <div className="text-gray-300">Replace with child</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-purple-400 font-medium">Case 3: Two Children</div>
                    <div className="text-gray-300">Use inorder successor</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start AVL deletion'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">AVL Deletion Algorithm:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(log n) - Guaranteed balanced tree</p>
                  <p><strong>Space Complexity:</strong> O(log n) - Recursion stack</p>
                  <p><strong>Steps:</strong> 1) Delete as BST, 2) Update heights, 3) Check balance, 4) Rotate ancestors</p>
                  <p><strong>Key:</strong> After deletion, check balance from deleted node up to root</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AVLDeletion
