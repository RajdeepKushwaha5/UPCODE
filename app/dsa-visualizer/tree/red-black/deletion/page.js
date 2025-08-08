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
  FaTrash,
  FaBalanceScale,
  FaTree
} from 'react-icons/fa'

const RedBlackDeletion = () => {
  const router = useRouter()
  const [tree, setTree] = useState(null)
  const [deleteValue, setDeleteValue] = useState(20)
  const [currentNode, setCurrentNode] = useState(null)
  const [deletePath, setDeletePath] = useState([])
  const [rotationNodes, setRotationNodes] = useState(new Set())
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [fixUpPhase, setFixUpPhase] = useState('')
  const [violationType, setViolationType] = useState('')
  const [deletedNode, setDeletedNode] = useState(null)
  const [replacementNode, setReplacementNode] = useState(null)
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

  // Find minimum value node in subtree
  const findMin = (node) => {
    while (node && node.left) {
      node = node.left
    }
    return node
  }

  // Find maximum value node in subtree
  const findMax = (node) => {
    while (node && node.right) {
      node = node.right
    }
    return node
  }

  // Replace node u with node v
  const transplant = (root, u, v) => {
    if (!u.parent) {
      root = v
    } else if (u === u.parent.left) {
      u.parent.left = v
    } else {
      u.parent.right = v
    }
    if (v) {
      v.parent = u.parent
    }
    return root
  }

  // Delete node from Red-Black Tree
  const deleteRBNode = (root, value) => {
    const nodeToDelete = findNodeInTree(root, value)
    if (!nodeToDelete) return root

    let y = nodeToDelete
    let yOriginalColor = y.color
    let x = null
    let newRoot = root

    if (!nodeToDelete.left) {
      // Case 1: No left child
      x = nodeToDelete.right
      newRoot = transplant(newRoot, nodeToDelete, nodeToDelete.right)
    } else if (!nodeToDelete.right) {
      // Case 2: No right child
      x = nodeToDelete.left
      newRoot = transplant(newRoot, nodeToDelete, nodeToDelete.left)
    } else {
      // Case 3: Two children - find successor
      y = findMin(nodeToDelete.right)
      yOriginalColor = y.color
      x = y.right

      if (y.parent === nodeToDelete) {
        if (x) x.parent = y
      } else {
        newRoot = transplant(newRoot, y, y.right)
        y.right = nodeToDelete.right
        y.right.parent = y
      }

      newRoot = transplant(newRoot, nodeToDelete, y)
      y.left = nodeToDelete.left
      y.left.parent = y
      y.color = nodeToDelete.color
    }

    // If deleted node was black, fix violations
    if (yOriginalColor === 'BLACK' && x) {
      newRoot = deleteFixUp(newRoot, x)
    }

    return newRoot
  }

  // Fix Red-Black violations after deletion
  const deleteFixUp = (root, x) => {
    while (x !== root && isBlack(x)) {
      if (x === x.parent.left) {
        let w = x.parent.right // Sibling

        // Case 1: Sibling is red
        if (isRed(w)) {
          w.color = 'BLACK'
          x.parent.color = 'RED'
          root = performLeftRotation(root, x.parent)
          w = x.parent.right
        }

        // Case 2: Sibling is black with black children
        if (isBlack(w.left) && isBlack(w.right)) {
          w.color = 'RED'
          x = x.parent
        } else {
          // Case 3: Sibling is black, left child red, right child black
          if (isBlack(w.right)) {
            w.left.color = 'BLACK'
            w.color = 'RED'
            root = performRightRotation(root, w)
            w = x.parent.right
          }

          // Case 4: Sibling is black with red right child
          w.color = x.parent.color
          x.parent.color = 'BLACK'
          w.right.color = 'BLACK'
          root = performLeftRotation(root, x.parent)
          x = root
        }
      } else {
        // Mirror cases for right child
        let w = x.parent.left // Sibling

        if (isRed(w)) {
          w.color = 'BLACK'
          x.parent.color = 'RED'
          root = performRightRotation(root, x.parent)
          w = x.parent.left
        }

        if (isBlack(w.right) && isBlack(w.left)) {
          w.color = 'RED'
          x = x.parent
        } else {
          if (isBlack(w.left)) {
            w.right.color = 'BLACK'
            w.color = 'RED'
            root = performLeftRotation(root, w)
            w = x.parent.left
          }

          w.color = x.parent.color
          x.parent.color = 'BLACK'
          w.left.color = 'BLACK'
          root = performRightRotation(root, x.parent)
          x = root
        }
      }
    }
    if (x) x.color = 'BLACK'
    return root
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

  // Insert node into Red-Black Tree (for tree generation)
  const insertRBNode = (root, value) => {
    if (!root) {
      return new RBNode(value, 'BLACK')
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
      return null
    }

    const insertedNode = insertBST(root, value)
    if (!insertedNode) return root

    return fixInsertViolations(root, insertedNode)
  }

  // Fix insertion violations (simplified for tree generation)
  const fixInsertViolations = (root, node) => {
    let current = node
    let currentRoot = root

    while (current !== currentRoot && isRed(current.parent)) {
      const parent = current.parent
      const grandparent = parent.parent
      
      if (!grandparent) break

      const uncle = parent === grandparent.left ? grandparent.right : grandparent.left

      if (isRed(uncle)) {
        parent.color = 'BLACK'
        if (uncle) uncle.color = 'BLACK'
        grandparent.color = 'RED'
        current = grandparent
      } else {
        if (parent === grandparent.left) {
          if (current === parent.right) {
            current = parent
            currentRoot = performLeftRotation(currentRoot, current)
          }
          parent.color = 'BLACK'
          grandparent.color = 'RED'
          currentRoot = performRightRotation(currentRoot, grandparent)
        } else {
          if (current === parent.left) {
            current = parent
            currentRoot = performRightRotation(currentRoot, current)
          }
          parent.color = 'BLACK'
          grandparent.color = 'RED'
          currentRoot = performLeftRotation(currentRoot, grandparent)
        }
      }
    }

    currentRoot.color = 'BLACK'
    return currentRoot
  }

  // Generate initial Red-Black Tree
  const generateTree = useCallback(() => {
    let root = null
    const values = [15, 10, 25, 5, 12, 20, 30, 8, 28, 35]
    
    values.forEach(value => {
      root = insertRBNode(root, value)
    })
    
    setTree(root)
    setCurrentStep(0)
    setCurrentNode(null)
    setDeletePath([])
    setRotationNodes(new Set())
    setHighlightedNodes(new Set())
    setFixUpPhase('')
    setViolationType('')
    setDeletedNode(null)
    setReplacementNode(null)
    setIsPlaying(false)
    generateSteps(root, deleteValue)
  }, [deleteValue])

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
      fixUpPhase: '',
      violationType: '',
      deletedNode: null,
      replacementNode: null,
      description: `Starting Red-Black Tree deletion of value ${value}. Must maintain RB properties after deletion.`
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
          fixUpPhase: 'Not Found',
          violationType: '',
          deletedNode: null,
          replacementNode: null,
          description: `Value ${target} not found in Red-Black tree. Nothing to delete.`
        })
        return
      }

      path.push(node.value)
      
      steps.push({
        type: 'search',
        tree: cloneTree(stepTree),
        current: node.value,
        path: [...path],
        rotationNodes: new Set(),
        highlighted: new Set([node.value]),
        fixUpPhase: 'Search Phase',
        violationType: '',
        deletedNode: null,
        replacementNode: null,
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
          fixUpPhase: 'Found Node',
          violationType: '',
          deletedNode: node.value,
          replacementNode: null,
          description: `Found node ${target}! Color: ${node.color}. Now determine deletion case.`
        })

        // Determine deletion case
        if (!node.left && !node.right) {
          // Case 1: Leaf node
          steps.push({
            type: 'case1_leaf',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...path],
            rotationNodes: new Set(),
            highlighted: new Set([node.value]),
            fixUpPhase: 'Case 1: Leaf Node',
            violationType: node.color === 'RED' ? 'No Violation' : 'Double Black',
            deletedNode: node.value,
            replacementNode: null,
            description: `Case 1: Leaf node deletion. ${node.color === 'RED' ? 'RED leaf - simple deletion' : 'BLACK leaf - causes double black violation'}.`
          })
        } else if (!node.left || !node.right) {
          // Case 2: One child
          const child = node.left || node.right
          steps.push({
            type: 'case2_one_child',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...path],
            rotationNodes: new Set(),
            highlighted: new Set([node.value, child.value]),
            fixUpPhase: 'Case 2: One Child',
            violationType: node.color === 'BLACK' && child.color === 'RED' ? 'No Violation' : 'Double Black',
            deletedNode: node.value,
            replacementNode: child.value,
            description: `Case 2: One child (${child.value}). Replace ${target} with child and ${node.color === 'BLACK' ? 'color child BLACK' : 'maintain colors'}.`
          })
        } else {
          // Case 3: Two children - find successor
          const successor = findMin(node.right)
          steps.push({
            type: 'case3_two_children',
            tree: cloneTree(stepTree),
            current: node.value,
            path: [...path],
            rotationNodes: new Set(),
            highlighted: new Set([node.value, successor.value]),
            fixUpPhase: 'Case 3: Two Children',
            violationType: 'Find Successor',
            deletedNode: node.value,
            replacementNode: successor.value,
            description: `Case 3: Two children. Replace ${target} with inorder successor ${successor.value} (${successor.color}).`
          })

          steps.push({
            type: 'successor_found',
            tree: cloneTree(stepTree),
            current: successor.value,
            path: [...path],
            rotationNodes: new Set(),
            highlighted: new Set([successor.value]),
            fixUpPhase: 'Successor Found',
            violationType: successor.color === 'BLACK' ? 'Potential Double Black' : 'No Violation',
            deletedNode: node.value,
            replacementNode: successor.value,
            description: `Successor ${successor.value} found. Color: ${successor.color}. ${successor.color === 'BLACK' ? 'Deletion may cause violations' : 'Should be safe to delete'}.`
          })
        }

        // Simulate deletion
        const deletedTree = deleteNodeFromTree(cloneTree(stepTree), target)
        stepTree = deletedTree

        steps.push({
          type: 'deleted',
          tree: cloneTree(stepTree),
          current: null,
          path: [],
          rotationNodes: new Set(),
          highlighted: new Set(),
          fixUpPhase: 'Node Deleted',
          violationType: '',
          deletedNode: null,
          replacementNode: null,
          description: `Node ${target} deleted. ${needsFixUp(node) ? 'Fix-up required to maintain RB properties.' : 'No violations - deletion complete.'}`
        })

        // Fix-up phase if needed
        if (needsFixUp(node)) {
          simulateDeleteFixUp(steps, stepTree, node)
        }

        return
      }

      if (target < node.value) {
        findAndDelete(node.left, target, [...path])
      } else {
        findAndDelete(node.right, target, [...path])
      }
    }

    findAndDelete(stepTree, value)

    steps.push({
      type: 'complete',
      tree: deleteRBNode(cloneTree(tree), value),
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      fixUpPhase: 'Complete',
      violationType: '',
      deletedNode: null,
      replacementNode: null,
      description: `Red-Black deletion complete! All RB properties maintained. Tree remains balanced.`
    })

    setSteps(steps)
  }

  // Check if fix-up is needed after deletion
  const needsFixUp = (deletedNode) => {
    return deletedNode.color === 'BLACK'
  }

  // Simulate the delete fix-up process
  const simulateDeleteFixUp = (steps, tree, deletedNode) => {
    steps.push({
      type: 'fixup_start',
      tree: cloneTree(tree),
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      fixUpPhase: 'Fix-up Started',
      violationType: 'Double Black Violation',
      deletedNode: null,
      replacementNode: null,
      description: `Fix-up phase started. BLACK node deletion created double-black violation. Need to restore RB properties.`
    })

    // Simulate different fix-up cases
    const simulateCases = [
      {
        type: 'fixup_case1',
        phase: 'Case 1: Red Sibling',
        violation: 'Red Sibling Rotation',
        description: 'Case 1: Sibling is RED. Rotate to make sibling BLACK, then continue with other cases.'
      },
      {
        type: 'fixup_case2',
        phase: 'Case 2: Black Sibling, Black Children',
        violation: 'Recoloring Required',
        description: 'Case 2: Sibling and children are BLACK. Recolor sibling to RED, move problem up.'
      },
      {
        type: 'fixup_case3',
        phase: 'Case 3: Black Sibling, Red-Black Children',
        violation: 'Rotation + Recoloring',
        description: 'Case 3: Sibling BLACK, left child RED, right child BLACK. Rotate and recolor.'
      },
      {
        type: 'fixup_case4',
        phase: 'Case 4: Black Sibling, Red Right Child',
        violation: 'Final Rotation',
        description: 'Case 4: Sibling BLACK, right child RED. Final rotation and recoloring restores properties.'
      }
    ]

    simulateCases.forEach((caseInfo, index) => {
      steps.push({
        type: caseInfo.type,
        tree: cloneTree(tree),
        current: null,
        path: [],
        rotationNodes: new Set(),
        highlighted: new Set(),
        fixUpPhase: caseInfo.phase,
        violationType: caseInfo.violation,
        deletedNode: null,
        replacementNode: null,
        description: caseInfo.description
      })
    })

    steps.push({
      type: 'fixup_complete',
      tree: cloneTree(tree),
      current: null,
      path: [],
      rotationNodes: new Set(),
      highlighted: new Set(),
      fixUpPhase: 'Fix-up Complete',
      violationType: '',
      deletedNode: null,
      replacementNode: null,
      description: 'Fix-up complete! All double-black violations resolved. RB properties restored.'
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

  const deleteNodeFromTree = (tree, value) => {
    if (!tree) return null
    
    if (value < tree.value) {
      tree.left = deleteNodeFromTree(tree.left, value)
    } else if (value > tree.value) {
      tree.right = deleteNodeFromTree(tree.right, value)
    } else {
      // Node to delete found
      if (!tree.left) return tree.right
      if (!tree.right) return tree.left
      
      // Two children - replace with successor
      const successor = findMin(tree.right)
      tree.value = successor.value
      tree.right = deleteNodeFromTree(tree.right, successor.value)
    }
    
    return tree
  }

  // Manual deletion
  const deleteManualValue = () => {
    const value = parseInt(manualValue)
    if (isNaN(value)) return
    
    setDeleteValue(value)
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
      setDeletePath(step.path || [])
      setRotationNodes(step.rotationNodes || new Set())
      setHighlightedNodes(step.highlighted || new Set())
      setFixUpPhase(step.fixUpPhase || '')
      setViolationType(step.violationType || '')
      setDeletedNode(step.deletedNode)
      setReplacementNode(step.replacementNode)
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
    if (deletedNode === node.value) {
      return 'fill-red-700 stroke-red-400 animate-pulse stroke-3'
    }
    if (replacementNode === node.value && replacementNode !== deletedNode) {
      return node.color === 'RED' ? 'fill-orange-500 stroke-orange-400 stroke-3' : 'fill-gray-700 stroke-orange-400 stroke-3'
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

        {/* Special labels */}
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
                  Red-Black Tree Deletion
                </h1>
                <p className="text-gray-400 text-sm">Delete with color-based rebalancing</p>
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
                  Delete Value
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter value"
                  />
                  <button
                    onClick={deleteManualValue}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: {deleteValue}</p>
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
                      <span className="text-gray-300">Phase:</span>
                      <span className="text-red-400 font-bold text-xs">{fixUpPhase}</span>
                    </div>
                    {violationType && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Type:</span>
                        <span className="text-orange-400 font-bold text-xs">{violationType}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Deletion Info */}
              {(deletedNode || replacementNode) && (
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
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
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-300">Successor</span>
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
                  {steps[currentStep]?.description || 'Click play to start Red-Black Tree deletion'}
                </p>
              </div>

              {/* Deletion Cases */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Red-Black Deletion Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <h4 className="font-medium text-white mb-2">Node Cases:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Leaf: Simple deletion</li>
                      <li>• One child: Replace with child</li>
                      <li>• Two children: Replace with successor</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Fix-up Cases:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Case 1: Red sibling → Rotate</li>
                      <li>• Case 2: Black sibling + children → Recolor</li>
                      <li>• Case 3-4: Mixed colors → Rotate + Recolor</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Red-Black Tree Deletion</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(log n) - Guaranteed balanced height</p>
                  <p><strong>Space Complexity:</strong> O(log n) - Recursion stack</p>
                  <p><strong>Critical:</strong> BLACK node deletion may violate RB properties</p>
                  <p><strong>Fix-up:</strong> Maximum 3 rotations needed to restore balance</p>
                  <p><strong>Advantage:</strong> Better deletion performance than AVL trees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RedBlackDeletion
