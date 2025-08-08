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
  FaDatabase,
  FaPlus,
  FaTree
} from 'react-icons/fa'

const BTreeInsertion = () => {
  const router = useRouter()
  const [btree, setBTree] = useState(null)
  const [insertValue, setInsertValue] = useState(50)
  const [degree, setDegree] = useState(3) // Minimum degree (t)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [splitNodes, setSplitNodes] = useState(new Set())
  const [insertPath, setInsertPath] = useState([])
  const [manualValue, setManualValue] = useState('')

  // B-Tree Node class
  class BTreeNode {
    constructor(isLeaf = false) {
      this.keys = []
      this.children = []
      this.isLeaf = isLeaf
      this.id = `btree-${Date.now()}-${Math.random()}`
    }

    // Check if node is full
    isFull(t) {
      return this.keys.length === 2 * t - 1
    }

    // Insert into non-full node
    insertNonFull(k, t, steps = []) {
      let i = this.keys.length - 1

      if (this.isLeaf) {
        // Insert into leaf node
        this.keys.push(0)
        while (i >= 0 && this.keys[i] > k) {
          this.keys[i + 1] = this.keys[i]
          i--
        }
        this.keys[i + 1] = k

        steps.push({
          type: 'leaf_insert',
          currentNode: this.id,
          insertValue: k,
          highlighted: new Set([this.id]),
          splitNodes: new Set(),
          insertPath: [],
          description: `Inserted ${k} into leaf node. Keys: [${this.keys.join(', ')}]`
        })
      } else {
        // Find child to insert into
        while (i >= 0 && this.keys[i] > k) {
          i--
        }
        i++

        steps.push({
          type: 'find_child',
          currentNode: this.id,
          insertValue: k,
          highlighted: new Set([this.id, this.children[i].id]),
          splitNodes: new Set(),
          insertPath: [],
          description: `Value ${k} should go to child at index ${i}`
        })

        if (this.children[i].isFull(t)) {
          // Split child if full
          steps.push({
            type: 'split_needed',
            currentNode: this.children[i].id,
            insertValue: k,
            highlighted: new Set([this.children[i].id]),
            splitNodes: new Set([this.children[i].id]),
            insertPath: [],
            description: `Child node is full (${2 * t - 1} keys). Need to split before insertion.`
          })

          this.splitChild(i, this.children[i], t, steps)

          if (this.keys[i] < k) {
            i++
          }
        }

        this.children[i].insertNonFull(k, t, steps)
      }
    }

    // Split child node
    splitChild(i, fullChild, t, steps = []) {
      const newChild = new BTreeNode(fullChild.isLeaf)
      const midIndex = t - 1

      // Move half of keys to new node
      newChild.keys = fullChild.keys.splice(midIndex + 1)

      // Move half of children if not leaf
      if (!fullChild.isLeaf) {
        newChild.children = fullChild.children.splice(midIndex + 1)
      }

      // Insert new child into parent
      this.children.splice(i + 1, 0, newChild)

      // Move middle key up to parent
      const middleKey = fullChild.keys.splice(midIndex, 1)[0]
      this.keys.splice(i, 0, middleKey)

      steps.push({
        type: 'split_complete',
        currentNode: this.id,
        insertValue: middleKey,
        highlighted: new Set([this.id, fullChild.id, newChild.id]),
        splitNodes: new Set([fullChild.id, newChild.id]),
        insertPath: [],
        description: `Split complete. Middle key ${middleKey} moved up. Created new node with keys [${newChild.keys.join(', ')}]`
      })
    }

    // Search for a key
    search(k) {
      let i = 0
      while (i < this.keys.length && k > this.keys[i]) {
        i++
      }

      if (i < this.keys.length && k === this.keys[i]) {
        return { node: this, index: i }
      }

      if (this.isLeaf) {
        return null
      }

      return this.children[i].search(k)
    }
  }

  // B-Tree class
  class BTree {
    constructor(t) {
      this.root = null
      this.t = t // Minimum degree
    }

    // Insert key
    insert(k, steps = []) {
      if (!this.root) {
        this.root = new BTreeNode(true)
        this.root.keys.push(k)

        steps.push({
          type: 'create_root',
          currentNode: this.root.id,
          insertValue: k,
          highlighted: new Set([this.root.id]),
          splitNodes: new Set(),
          insertPath: [],
          description: `Created root node and inserted ${k}`
        })
        return
      }

      if (this.root.isFull(this.t)) {
        // Root is full, create new root
        const oldRoot = this.root
        this.root = new BTreeNode(false)
        this.root.children.push(oldRoot)

        steps.push({
          type: 'split_root',
          currentNode: this.root.id,
          insertValue: k,
          highlighted: new Set([this.root.id, oldRoot.id]),
          splitNodes: new Set([oldRoot.id]),
          insertPath: [],
          description: `Root is full. Creating new root and splitting old root.`
        })

        this.root.splitChild(0, oldRoot, this.t, steps)
      }

      this.root.insertNonFull(k, this.t, steps)
    }

    // Search for key
    search(k, steps = []) {
      if (!this.root) return null

      const searchRecursive = (node, depth = 0) => {
        steps.push({
          type: 'search_node',
          currentNode: node.id,
          insertValue: k,
          highlighted: new Set([node.id]),
          splitNodes: new Set(),
          insertPath: [],
          description: `Searching node at level ${depth}. Keys: [${node.keys.join(', ')}]`
        })

        let i = 0
        while (i < node.keys.length && k > node.keys[i]) {
          i++
        }

        if (i < node.keys.length && k === node.keys[i]) {
          steps.push({
            type: 'key_found',
            currentNode: node.id,
            insertValue: k,
            highlighted: new Set([node.id]),
            splitNodes: new Set(),
            insertPath: [],
            description: `Key ${k} found in node at index ${i}!`
          })
          return { node, index: i }
        }

        if (node.isLeaf) {
          steps.push({
            type: 'key_not_found',
            currentNode: node.id,
            insertValue: k,
            highlighted: new Set([node.id]),
            splitNodes: new Set(),
            insertPath: [],
            description: `Key ${k} not found. Reached leaf node.`
          })
          return null
        }

        return searchRecursive(node.children[i], depth + 1)
      }

      return searchRecursive(this.root)
    }
  }

  // Initialize B-Tree
  const initializeBTree = useCallback(() => {
    const tree = new BTree(degree)
    
    // Insert some initial values
    const initialValues = [10, 20, 5, 6, 12, 30, 7, 17]
    const steps = []

    steps.push({
      type: 'start',
      currentNode: null,
      insertValue: 0,
      highlighted: new Set(),
      splitNodes: new Set(),
      insertPath: [],
      description: `Creating B-Tree with minimum degree t = ${degree}. Max keys per node = ${2 * degree - 1}`
    })

    initialValues.forEach(value => {
      tree.insert(value, steps)
    })

    setBTree(tree)
    setSteps(steps)
    setCurrentStep(0)
    setCurrentNode(null)
    setHighlightedNodes(new Set())
    setSplitNodes(new Set())
    setInsertPath([])
    setIsPlaying(false)
  }, [degree])

  // Generate insertion steps
  const generateInsertionSteps = useCallback((tree, value) => {
    if (!tree) return

    const steps = []
    const treeCopy = cloneBTree(tree)
    
    steps.push({
      type: 'insert_start',
      currentNode: null,
      insertValue: value,
      highlighted: new Set(),
      splitNodes: new Set(),
      insertPath: [],
      description: `Starting insertion of ${value} into B-Tree`
    })

    treeCopy.insert(value, steps)

    steps.push({
      type: 'insert_complete',
      currentNode: null,
      insertValue: value,
      highlighted: new Set(),
      splitNodes: new Set(),
      insertPath: [],
      description: `Insertion of ${value} complete! B-Tree properties maintained.`
    })

    setSteps(steps)
  }, [])

  // Clone B-Tree
  const cloneBTree = (tree) => {
    if (!tree) return null

    const cloneNode = (node) => {
      if (!node) return null
      
      const newNode = new BTreeNode(node.isLeaf)
      newNode.keys = [...node.keys]
      newNode.id = node.id
      newNode.children = node.children.map(child => cloneNode(child))
      
      return newNode
    }

    const newTree = new BTree(tree.t)
    newTree.root = cloneNode(tree.root)
    
    return newTree
  }

  // Insert manual value
  const insertManualValue = () => {
    const value = parseInt(manualValue)
    if (isNaN(value)) return
    
    setInsertValue(value)
    setManualValue('')
    generateInsertionSteps(btree, value)
  }

  // Initialize
  useEffect(() => {
    initializeBTree()
  }, [initializeBTree])

  // Generate steps when insert value changes
  useEffect(() => {
    if (btree) {
      generateInsertionSteps(btree, insertValue)
    }
  }, [btree, insertValue, generateInsertionSteps])

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

  // Update visualization state
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setCurrentNode(step.currentNode)
      setHighlightedNodes(step.highlighted || new Set())
      setSplitNodes(step.splitNodes || new Set())
      setInsertPath(step.insertPath || [])
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

  // Get node color
  const getNodeColor = (node) => {
    if (splitNodes.has(node.id)) {
      return 'fill-red-500 stroke-red-400 animate-pulse'
    }
    if (highlightedNodes.has(node.id)) {
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    return 'fill-blue-500 stroke-blue-400'
  }

  // Render B-Tree node
  const renderBTreeNode = (node, x, y, level = 0) => {
    if (!node) return null

    const nodeWidth = Math.max(80, node.keys.length * 40 + 20)
    const nodeHeight = 40
    const levelSpacing = 100
    const childSpacing = nodeWidth + 60

    return (
      <g key={node.id}>
        {/* Node rectangle */}
        <rect
          x={x - nodeWidth / 2}
          y={y - nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          rx="5"
          className={`${getNodeColor(node)} stroke-2 transition-all duration-500`}
        />

        {/* Keys */}
        {node.keys.map((key, index) => (
          <g key={index}>
            {/* Key separator */}
            {index > 0 && (
              <line
                x1={x - nodeWidth / 2 + (index * (nodeWidth / node.keys.length))}
                y1={y - nodeHeight / 2}
                x2={x - nodeWidth / 2 + (index * (nodeWidth / node.keys.length))}
                y2={y + nodeHeight / 2}
                stroke="#374151"
                strokeWidth="1"
              />
            )}
            
            {/* Key text */}
            <text
              x={x - nodeWidth / 2 + ((index + 0.5) * (nodeWidth / node.keys.length))}
              y={y + 5}
              textAnchor="middle"
              className="fill-white text-sm font-bold"
            >
              {key}
            </text>
          </g>
        ))}

        {/* Child connections and nodes */}
        {!node.isLeaf && node.children.map((child, index) => {
          const childX = x + (index - (node.children.length - 1) / 2) * childSpacing
          const childY = y + levelSpacing

          return (
            <g key={child.id}>
              {/* Connection line */}
              <line
                x1={x - nodeWidth / 2 + ((index + 0.5) * (nodeWidth / (node.children.length)))}
                y1={y + nodeHeight / 2}
                x2={childX}
                y2={childY - nodeHeight / 2}
                stroke="#6B7280"
                strokeWidth="2"
              />
              
              {/* Render child */}
              {renderBTreeNode(child, childX, childY, level + 1)}
            </g>
          )
        })}

        {/* Node info */}
        <text
          x={x}
          y={y - nodeHeight / 2 - 10}
          textAnchor="middle"
          className="fill-gray-400 text-xs"
        >
          {node.isLeaf ? 'Leaf' : 'Internal'} | Keys: {node.keys.length}
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  B-Tree Insertion
                </h1>
                <p className="text-gray-400 text-sm">Multi-way search tree for database applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaDatabase className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Database Tree</span>
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
                B-Tree Controls
              </h2>
              
              {/* Degree Setting */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Minimum Degree (t): {degree}
                </label>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={degree}
                  onChange={(e) => setDegree(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Max keys per node: {2 * degree - 1}
                </div>
              </div>

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
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter value"
                  />
                  <button
                    onClick={insertManualValue}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
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
                  onClick={initializeBTree}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Rebuild B-Tree
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

              {/* B-Tree Properties */}
              <div className="mt-6 bg-blue-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">B-Tree Properties:</h3>
                <div className="text-sm text-blue-200 space-y-1">
                  <p>• Min degree: {degree}</p>
                  <p>• Max keys: {2 * degree - 1}</p>
                  <p>• Min keys: {degree - 1}</p>
                  <p>• Max children: {2 * degree}</p>
                  <p>• All leaves at same level</p>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span className="text-gray-300">Normal Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500"></div>
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span className="text-gray-300">Split Node</span>
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
                  B-Tree Visualization
                </h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* B-Tree */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="overflow-x-auto">
                  <svg width="1200" height="600" className="mx-auto">
                    {btree?.root && renderBTreeNode(btree.root, 600, 80)}
                  </svg>
                </div>
              </div>

              {/* B-Tree Operations */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">B-Tree Operations:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-green-800 rounded p-3">
                    <div className="text-green-400 font-medium">Insert</div>
                    <div className="text-gray-300">1. Find leaf<br/>2. Insert key<br/>3. Split if full</div>
                  </div>
                  <div className="bg-blue-800 rounded p-3">
                    <div className="text-blue-400 font-medium">Split</div>
                    <div className="text-gray-300">1. Move middle up<br/>2. Create new node<br/>3. Distribute keys</div>
                  </div>
                  <div className="bg-purple-800 rounded p-3">
                    <div className="text-purple-400 font-medium">Search</div>
                    <div className="text-gray-300">1. Compare keys<br/>2. Navigate child<br/>3. Repeat</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start B-Tree insertion'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">B-Tree Characteristics</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(log n) - for search, insert, delete</p>
                  <p><strong>Space Complexity:</strong> O(n) - for storing keys</p>
                  <p><strong>Height:</strong> O(log_t n) - where t is minimum degree</p>
                  <p><strong>Applications:</strong> Database indexes, file systems (NTFS, HFS+)</p>
                  <p><strong>Advantage:</strong> Minimizes disk I/O, self-balancing, efficient for large datasets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BTreeInsertion
