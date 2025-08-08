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
  FaTrash
} from 'react-icons/fa'

const BSTDeletion = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [deleteValue, setDeleteValue] = useState(30)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [deletePath, setDeletePath] = useState([])
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [nodeToDelete, setNodeToDelete] = useState(null)
  const [replacementNode, setReplacementNode] = useState(null)
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

  // Build tree from array (level order)
  const buildTree = (values) => {
    if (!values.length) return null
    
    const root = new TreeNode(values[0])
    const queue = [root]
    let i = 1
    
    while (queue.length && i < values.length) {
      const node = queue.shift()
      
      if (i < values.length && values[i] !== null) {
        node.left = new TreeNode(values[i])
        queue.push(node.left)
      }
      i++
      
      if (i < values.length && values[i] !== null) {
        node.right = new TreeNode(values[i])
        queue.push(node.right)
      }
      i++
    }
    
    return root
  }

  // Convert tree to array for easier manipulation
  const treeToArray = (root) => {
    if (!root) return []
    const result = []
    const queue = [root]
    
    while (queue.length) {
      const node = queue.shift()
      if (node) {
        result.push(node.value)
        queue.push(node.left)
        queue.push(node.right)
      } else {
        result.push(null)
      }
    }
    
    // Remove trailing nulls
    while (result.length && result[result.length - 1] === null) {
      result.pop()
    }
    
    return result
  }

  // Find inorder successor (leftmost in right subtree)
  const findInorderSuccessor = (node) => {
    let current = node.right
    while (current && current.left) {
      current = current.left
    }
    return current
  }

  // Delete node from BST
  const deleteNode = (root, value) => {
    if (!root) return null
    
    if (value < root.value) {
      root.left = deleteNode(root.left, value)
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value)
    } else {
      // Node to be deleted found
      
      // Case 1: No children (leaf node)
      if (!root.left && !root.right) {
        return null
      }
      
      // Case 2: One child
      if (!root.left) {
        return root.right
      }
      if (!root.right) {
        return root.left
      }
      
      // Case 3: Two children
      const successor = findInorderSuccessor(root)
      root.value = successor.value
      root.right = deleteNode(root.right, successor.value)
    }
    
    return root
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
    setDeletePath([])
    setHighlightedNodes(new Set())
    setNodeToDelete(null)
    setReplacementNode(null)
    setIsPlaying(false)
    generateSteps(root, deleteValue)
  }, [deleteValue])

  // Generate deletion steps
  const generateSteps = (tree, target) => {
    const steps = []
    const path = []
    
    steps.push({
      type: 'initial',
      current: null,
      path: [],
      highlighted: new Set(),
      nodeToDelete: null,
      replacement: null,
      description: `Starting BST deletion for value ${target}. First, we need to find the node.`
    })

    // Step 1: Find the node to delete
    let current = tree
    let parent = null
    let found = false
    
    while (current) {
      path.push(current.value)
      
      steps.push({
        type: 'search',
        current: current.value,
        path: [...path],
        highlighted: new Set([current.value]),
        nodeToDelete: null,
        replacement: null,
        description: `Searching for ${target}. Compare ${target} with ${current.value}.`
      })

      if (target === current.value) {
        found = true
        steps.push({
          type: 'found',
          current: current.value,
          path: [...path],
          highlighted: new Set([current.value]),
          nodeToDelete: current.value,
          replacement: null,
          description: `Found node ${target}! Now determine deletion case.`
        })
        break
      } else if (target < current.value) {
        steps.push({
          type: 'go_left',
          current: current.value,
          path: [...path],
          highlighted: new Set([current.value]),
          nodeToDelete: null,
          replacement: null,
          description: `${target} < ${current.value}, go to left subtree.`
        })
        parent = current
        current = current.left
      } else {
        steps.push({
          type: 'go_right',
          current: current.value,
          path: [...path],
          highlighted: new Set([current.value]),
          nodeToDelete: null,
          replacement: null,
          description: `${target} > ${current.value}, go to right subtree.`
        })
        parent = current
        current = current.right
      }
    }

    if (!found) {
      steps.push({
        type: 'not_found',
        current: null,
        path: [...path],
        highlighted: new Set(),
        nodeToDelete: null,
        replacement: null,
        description: `Node ${target} not found in BST. Nothing to delete.`
      })
      setSteps(steps)
      return
    }

    // Determine deletion case
    const nodeToDelete = current
    const hasLeftChild = nodeToDelete.left !== null
    const hasRightChild = nodeToDelete.right !== null

    if (!hasLeftChild && !hasRightChild) {
      // Case 1: Leaf node
      steps.push({
        type: 'case_leaf',
        current: nodeToDelete.value,
        path: [...path],
        highlighted: new Set([nodeToDelete.value]),
        nodeToDelete: nodeToDelete.value,
        replacement: null,
        description: `Case 1: Node ${target} is a leaf node (no children). Simply remove it.`
      })
      
      steps.push({
        type: 'delete_leaf',
        current: null,
        path: [...path],
        highlighted: new Set(),
        nodeToDelete: null,
        replacement: null,
        description: `Deleted leaf node ${target}. Deletion complete.`
      })
    } else if (!hasLeftChild || !hasRightChild) {
      // Case 2: One child
      const child = hasLeftChild ? nodeToDelete.left : nodeToDelete.right
      const childSide = hasLeftChild ? 'left' : 'right'
      
      steps.push({
        type: 'case_one_child',
        current: nodeToDelete.value,
        path: [...path],
        highlighted: new Set([nodeToDelete.value, child.value]),
        nodeToDelete: nodeToDelete.value,
        replacement: child.value,
        description: `Case 2: Node ${target} has one ${childSide} child (${child.value}). Replace with child.`
      })
      
      steps.push({
        type: 'replace_with_child',
        current: child.value,
        path: [...path],
        highlighted: new Set([child.value]),
        nodeToDelete: null,
        replacement: child.value,
        description: `Replaced node ${target} with its ${childSide} child ${child.value}. Deletion complete.`
      })
    } else {
      // Case 3: Two children - find inorder successor
      steps.push({
        type: 'case_two_children',
        current: nodeToDelete.value,
        path: [...path],
        highlighted: new Set([nodeToDelete.value]),
        nodeToDelete: nodeToDelete.value,
        replacement: null,
        description: `Case 3: Node ${target} has two children. Find inorder successor (leftmost in right subtree).`
      })
      
      // Find inorder successor
      let successor = nodeToDelete.right
      const successorPath = [successor.value]
      
      steps.push({
        type: 'find_successor_start',
        current: successor.value,
        path: [...path],
        highlighted: new Set([nodeToDelete.value, successor.value]),
        nodeToDelete: nodeToDelete.value,
        replacement: successor.value,
        description: `Start from right child ${successor.value} to find leftmost node.`
      })
      
      while (successor.left) {
        successor = successor.left
        successorPath.push(successor.value)
        
        steps.push({
          type: 'find_successor',
          current: successor.value,
          path: [...path],
          highlighted: new Set([nodeToDelete.value, successor.value]),
          nodeToDelete: nodeToDelete.value,
          replacement: successor.value,
          description: `Move left to ${successor.value}. Continue finding leftmost node.`
        })
      }
      
      steps.push({
        type: 'successor_found',
        current: successor.value,
        path: [...path],
        highlighted: new Set([nodeToDelete.value, successor.value]),
        nodeToDelete: nodeToDelete.value,
        replacement: successor.value,
        description: `Found inorder successor: ${successor.value}. This will replace ${target}.`
      })
      
      steps.push({
        type: 'replace_with_successor',
        current: successor.value,
        path: [...path],
        highlighted: new Set([successor.value]),
        nodeToDelete: null,
        replacement: successor.value,
        description: `Replaced ${target} with successor ${successor.value}. Now delete original successor.`
      })
    }

    steps.push({
      type: 'complete',
      current: null,
      path: [],
      highlighted: new Set(),
      nodeToDelete: null,
      replacement: null,
      description: `BST deletion complete! Tree maintains BST property.`
    })

    setSteps(steps)
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
      setDeletePath(step.path)
      setHighlightedNodes(step.highlighted)
      setNodeToDelete(step.nodeToDelete)
      setReplacementNode(step.replacement)
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
    if (nodeToDelete === nodeValue) {
      return 'fill-red-500 stroke-red-400 animate-pulse'
    }
    if (replacementNode === nodeValue) {
      return 'fill-green-500 stroke-green-400 animate-pulse'
    }
    if (currentNode === nodeValue) {
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (highlightedNodes.has(nodeValue)) {
      return 'fill-blue-500 stroke-blue-400'
    }
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

        {/* Node to delete indicator */}
        {nodeToDelete === node.value && (
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2 + 8}
            className="fill-none stroke-red-400 stroke-3 opacity-60"
          />
        )}

        {/* Replacement node indicator */}
        {replacementNode === node.value && replacementNode !== nodeToDelete && (
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2 + 8}
            className="fill-none stroke-green-400 stroke-3 opacity-60"
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

        {/* Labels */}
        {nodeToDelete === node.value && (
          <text
            x={x}
            y={y - 35}
            textAnchor="middle"
            className="fill-red-400 font-bold text-xs"
          >
            DELETE
          </text>
        )}

        {replacementNode === node.value && replacementNode !== nodeToDelete && (
          <text
            x={x}
            y={y - 35}
            textAnchor="middle"
            className="fill-green-400 font-bold text-xs"
          >
            SUCCESSOR
          </text>
        )}

        {/* Visit order */}
        {deletePath.includes(node.value) && !nodeToDelete && (
          <text
            x={x + 30}
            y={y - 25}
            textAnchor="middle"
            className="fill-cyan-400 font-bold text-xs"
          >
            {deletePath.indexOf(node.value) + 1}
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
                  Binary Search Tree Deletion
                </h1>
                <p className="text-gray-400 text-sm">Three cases: leaf, one child, two children</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaTrash className="w-5 h-5 text-red-400" />
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
              
              {/* Delete Value */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Delete Value: {deleteValue}
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="10"
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
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Node to Delete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Replacement Node</span>
                  </div>
                </div>
              </div>

              {/* Deletion Cases */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Deletion Cases:</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-green-400 font-medium">Case 1: Leaf Node</div>
                    <div className="text-gray-300">Simply remove the node</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-medium">Case 2: One Child</div>
                    <div className="text-gray-300">Replace with child node</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-medium">Case 3: Two Children</div>
                    <div className="text-gray-300">Replace with inorder successor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">BST Deletion Visualization</h2>
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

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start BST deletion'}
                </p>
              </div>

              {/* Algorithm Complexity */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Algorithm Complexity:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Time Complexity:</div>
                    <div className="text-green-400 font-bold">O(h)</div>
                    <div className="text-gray-400 text-xs">h = height of tree</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Space Complexity:</div>
                    <div className="text-blue-400 font-bold">O(h)</div>
                    <div className="text-gray-400 text-xs">recursion stack</div>
                  </div>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">BST Deletion Algorithm:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>1. Find:</strong> Locate the node to delete</p>
                  <p><strong>2. Analyze:</strong> Determine which case applies</p>
                  <p><strong>3. Delete:</strong> Apply appropriate deletion strategy</p>
                  <p><strong>4. Maintain:</strong> Preserve BST property</p>
                  <p><strong>Key:</strong> Inorder successor = leftmost in right subtree</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BSTDeletion
