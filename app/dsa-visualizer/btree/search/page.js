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
  FaSearch,
  FaTree
} from 'react-icons/fa'

const BTreeSearch = () => {
  const router = useRouter()
  const [btree, setBTree] = useState(null)
  const [searchValue, setSearchValue] = useState(17)
  const [degree, setDegree] = useState(3)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [searchPath, setSearchPath] = useState([])
  const [compareKeys, setCompareKeys] = useState([])
  const [foundResult, setFoundResult] = useState(null)
  const [manualValue, setManualValue] = useState('')

  // B-Tree Node class (same as insertion)
  class BTreeNode {
    constructor(isLeaf = false) {
      this.keys = []
      this.children = []
      this.isLeaf = isLeaf
      this.id = `btree-${Date.now()}-${Math.random()}`
    }

    isFull(t) {
      return this.keys.length === 2 * t - 1
    }

    insertNonFull(k, t) {
      let i = this.keys.length - 1

      if (this.isLeaf) {
        this.keys.push(0)
        while (i >= 0 && this.keys[i] > k) {
          this.keys[i + 1] = this.keys[i]
          i--
        }
        this.keys[i + 1] = k
      } else {
        while (i >= 0 && this.keys[i] > k) {
          i--
        }
        i++

        if (this.children[i].isFull(t)) {
          this.splitChild(i, this.children[i], t)
          if (this.keys[i] < k) {
            i++
          }
        }
        this.children[i].insertNonFull(k, t)
      }
    }

    splitChild(i, fullChild, t) {
      const newChild = new BTreeNode(fullChild.isLeaf)
      const midIndex = t - 1

      newChild.keys = fullChild.keys.splice(midIndex + 1)

      if (!fullChild.isLeaf) {
        newChild.children = fullChild.children.splice(midIndex + 1)
      }

      this.children.splice(i + 1, 0, newChild)
      const middleKey = fullChild.keys.splice(midIndex, 1)[0]
      this.keys.splice(i, 0, middleKey)
    }

    // Enhanced search with step tracking
    search(k, steps = [], path = [], level = 0) {
      steps.push({
        type: 'visit_node',
        currentNode: this.id,
        searchValue: k,
        highlighted: new Set([this.id]),
        searchPath: [...path, this.id],
        compareKeys: [...this.keys],
        foundResult: null,
        description: `Visiting node at level ${level}. Keys: [${this.keys.join(', ')}]`
      })

      let i = 0
      
      // Linear search through keys
      while (i < this.keys.length) {
        steps.push({
          type: 'compare_key',
          currentNode: this.id,
          searchValue: k,
          highlighted: new Set([this.id]),
          searchPath: [...path, this.id],
          compareKeys: [this.keys[i]],
          foundResult: null,
          description: `Comparing ${k} with key ${this.keys[i]}. ${k === this.keys[i] ? 'Found!' : k < this.keys[i] ? `${k} < ${this.keys[i]}` : `${k} > ${this.keys[i]}`}`
        })

        if (k === this.keys[i]) {
          steps.push({
            type: 'key_found',
            currentNode: this.id,
            searchValue: k,
            highlighted: new Set([this.id]),
            searchPath: [...path, this.id],
            compareKeys: [this.keys[i]],
            foundResult: { node: this, index: i },
            description: `Key ${k} found at index ${i} in current node!`
          })
          return { node: this, index: i }
        }

        if (k < this.keys[i]) {
          break
        }
        i++
      }

      if (this.isLeaf) {
        steps.push({
          type: 'key_not_found',
          currentNode: this.id,
          searchValue: k,
          highlighted: new Set([this.id]),
          searchPath: [...path, this.id],
          compareKeys: [],
          foundResult: null,
          description: `Key ${k} not found. Reached leaf node - search unsuccessful.`
        })
        return null
      }

      steps.push({
        type: 'navigate_child',
        currentNode: this.id,
        searchValue: k,
        highlighted: new Set([this.id, this.children[i].id]),
        searchPath: [...path, this.id],
        compareKeys: [],
        foundResult: null,
        description: `Key ${k} should be in child ${i}. Navigating down...`
      })

      return this.children[i].search(k, steps, [...path, this.id], level + 1)
    }
  }

  // B-Tree class
  class BTree {
    constructor(t) {
      this.root = null
      this.t = t
    }

    insert(k) {
      if (!this.root) {
        this.root = new BTreeNode(true)
        this.root.keys.push(k)
        return
      }

      if (this.root.isFull(this.t)) {
        const oldRoot = this.root
        this.root = new BTreeNode(false)
        this.root.children.push(oldRoot)
        this.root.splitChild(0, oldRoot, this.t)
      }

      this.root.insertNonFull(k, this.t)
    }

    search(k) {
      const steps = []
      
      if (!this.root) {
        steps.push({
          type: 'empty_tree',
          currentNode: null,
          searchValue: k,
          highlighted: new Set(),
          searchPath: [],
          compareKeys: [],
          foundResult: null,
          description: `Tree is empty. Key ${k} not found.`
        })
        return { result: null, steps }
      }

      steps.push({
        type: 'search_start',
        currentNode: this.root.id,
        searchValue: k,
        highlighted: new Set(),
        searchPath: [],
        compareKeys: [],
        foundResult: null,
        description: `Starting search for key ${k} from root`
      })

      const result = this.root.search(k, steps)
      
      if (result) {
        steps.push({
          type: 'search_success',
          currentNode: result.node.id,
          searchValue: k,
          highlighted: new Set([result.node.id]),
          searchPath: [],
          compareKeys: [k],
          foundResult: result,
          description: `Search successful! Key ${k} found in the B-Tree.`
        })
      } else {
        steps.push({
          type: 'search_failed',
          currentNode: null,
          searchValue: k,
          highlighted: new Set(),
          searchPath: [],
          compareKeys: [],
          foundResult: null,
          description: `Search failed! Key ${k} is not present in the B-Tree.`
        })
      }

      return { result, steps }
    }
  }

  // Initialize B-Tree with sample data
  const initializeBTree = useCallback(() => {
    const tree = new BTree(degree)
    
    // Insert values to create a meaningful B-Tree structure
    const values = [10, 20, 5, 6, 12, 30, 7, 17, 25, 40, 15, 8, 22, 35, 50]
    values.forEach(value => tree.insert(value))

    setBTree(tree)
    setCurrentStep(0)
    setCurrentNode(null)
    setHighlightedNodes(new Set())
    setSearchPath([])
    setCompareKeys([])
    setFoundResult(null)
    setIsPlaying(false)
  }, [degree])

  // Generate search steps
  const generateSearchSteps = useCallback((tree, value) => {
    if (!tree) return

    const { result, steps } = tree.search(value)
    setSteps(steps)
    setFoundResult(result)
  }, [])

  // Search manual value
  const searchManualValue = () => {
    const value = parseInt(manualValue)
    if (isNaN(value)) return
    
    setSearchValue(value)
    setManualValue('')
    generateSearchSteps(btree, value)
  }

  // Initialize
  useEffect(() => {
    initializeBTree()
  }, [initializeBTree])

  // Generate steps when search value changes
  useEffect(() => {
    if (btree) {
      generateSearchSteps(btree, searchValue)
    }
  }, [btree, searchValue, generateSearchSteps])

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
      setSearchPath(step.searchPath || [])
      setCompareKeys(step.compareKeys || [])
      setFoundResult(step.foundResult)
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
    if (currentNode === node.id && highlightedNodes.has(node.id)) {
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (searchPath.includes(node.id)) {
      return 'fill-green-500 stroke-green-400'
    }
    if (foundResult && foundResult.node.id === node.id) {
      return 'fill-emerald-500 stroke-emerald-400 animate-pulse'
    }
    return 'fill-blue-500 stroke-blue-400'
  }

  // Get key color
  const getKeyColor = (key) => {
    if (compareKeys.includes(key)) {
      return 'fill-yellow-300 font-bold'
    }
    if (foundResult && key === searchValue) {
      return 'fill-emerald-300 font-bold animate-pulse'
    }
    return 'fill-white'
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
        {/* Search path indicator */}
        {searchPath.includes(node.id) && (
          <circle
            cx={x}
            cy={y}
            r={nodeWidth / 2 + 8}
            className="fill-none stroke-green-400 stroke-3 opacity-60 animate-pulse"
          />
        )}

        {/* Found result indicator */}
        {foundResult && foundResult.node.id === node.id && (
          <circle
            cx={x}
            cy={y}
            r={nodeWidth / 2 + 12}
            className="fill-none stroke-emerald-400 stroke-4 opacity-80 animate-pulse"
          />
        )}

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
              className={`text-sm font-bold ${getKeyColor(key)} transition-all duration-300`}
            >
              {key}
            </text>

            {/* Found key indicator */}
            {foundResult && foundResult.node.id === node.id && foundResult.index === index && (
              <circle
                cx={x - nodeWidth / 2 + ((index + 0.5) * (nodeWidth / node.keys.length))}
                cy={y - nodeHeight / 2 - 8}
                r="3"
                className="fill-emerald-400 animate-bounce"
              />
            )}
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
                className={searchPath.includes(child.id) ? 'stroke-green-400 stroke-4' : ''}
              />
              
              {/* Render child */}
              {renderBTreeNode(child, childX, childY, level + 1)}
            </g>
          )
        })}

        {/* Node info */}
        <text
          x={x}
          y={y - nodeHeight / 2 - 20}
          textAnchor="middle"
          className="fill-gray-400 text-xs"
        >
          Level {level} | {node.isLeaf ? 'Leaf' : 'Internal'} | Keys: {node.keys.length}
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  B-Tree Search
                </h1>
                <p className="text-gray-400 text-sm">Efficient search in multi-way trees</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaSearch className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Database Search</span>
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
                Search Controls
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
              </div>

              {/* Search Value */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Search Value: {searchValue}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={searchValue}
                  onChange={(e) => setSearchValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Manual Search */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Manual Search
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter value"
                  />
                  <button
                    onClick={searchManualValue}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaSearch className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pause : play}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
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

              {/* Search Result */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Search Result:</h3>
                {foundResult ? (
                  <div className="bg-emerald-800 rounded p-3">
                    <div className="text-emerald-400 font-bold">Key Found!</div>
                    <div className="text-emerald-200 text-sm">
                      Value {searchValue} found at index {foundResult.index}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-800 rounded p-3">
                    <div className="text-red-400 font-bold">Key Not Found</div>
                    <div className="text-red-200 text-sm">
                      Value {searchValue} is not present
                    </div>
                  </div>
                )}
              </div>

              {/* Search Statistics */}
              <div className="mt-6 bg-blue-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Search Stats:</h3>
                <div className="text-sm text-blue-200 space-y-1">
                  <p>Steps taken: {currentStep + 1}</p>
                  <p>Nodes visited: {searchPath.length}</p>
                  <p>Comparisons: {steps.filter(s => s.type === 'compare_key').length}</p>
                  <p>Tree height: ~{Math.floor(Math.log(btree?.root?.keys?.length || 1) / Math.log(degree)) + 1}</p>
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
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span className="text-gray-300">Search Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500"></div>
                    <span className="text-gray-300">Found Key</span>
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
                  B-Tree Search Visualization
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

              {/* Search Algorithm Steps */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">B-Tree Search Algorithm:</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-blue-800 rounded p-3">
                    <div className="text-blue-400 font-medium">1. Start at Root</div>
                    <div className="text-gray-300">Begin search from root node</div>
                  </div>
                  <div className="bg-green-800 rounded p-3">
                    <div className="text-green-400 font-medium">2. Linear Search</div>
                    <div className="text-gray-300">Compare key with node keys</div>
                  </div>
                  <div className="bg-yellow-800 rounded p-3">
                    <div className="text-yellow-400 font-medium">3. Navigate Down</div>
                    <div className="text-gray-300">Move to appropriate child</div>
                  </div>
                  <div className="bg-purple-800 rounded p-3">
                    <div className="text-purple-400 font-medium">4. Found/Not Found</div>
                    <div className="text-gray-300">Key found or reach leaf</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start B-Tree search'}
                </p>
              </div>

              {/* Algorithm Analysis */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Search Analysis</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(log_t n) - where t is minimum degree</p>
                  <p><strong>Comparisons per node:</strong> O(t) - linear search within node</p>
                  <p><strong>Disk I/O:</strong> O(log_t n) - one read per level</p>
                  <p><strong>Best case:</strong> Key found at root - O(1)</p>
                  <p><strong>Worst case:</strong> Key not found, search to leaf - O(log_t n)</p>
                  <p><strong>Space complexity:</strong> O(log_t n) - recursion stack</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BTreeSearch
