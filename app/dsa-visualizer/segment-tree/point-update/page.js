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
  FaEdit,
  FaSync,
  FaChartLine
} from 'react-icons/fa'

const SegmentTreeUpdate = () => {
  const router = useRouter()
  const [segmentTree, setSegmentTree] = useState(null)
  const [originalArray, setOriginalArray] = useState([2, 5, 1, 4, 9, 3])
  const [updateIndex, setUpdateIndex] = useState(2)
  const [updateValue, setUpdateValue] = useState(7)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [updatePath, setUpdatePath] = useState([])
  const [oldValues, setOldValues] = useState(new Map())
  const [newValues, setNewValues] = useState(new Map())

  // Segment Tree Node class
  class SegmentTreeNode {
    constructor(start, end, value = 0) {
      this.start = start
      this.end = end
      this.value = value
      this.left = null
      this.right = null
      this.id = `seg-${start}-${end}-${Date.now()}`
    }
  }

  // Build segment tree
  const buildSegmentTree = (arr, start = 0, end = arr.length - 1) => {
    if (start === end) {
      return new SegmentTreeNode(start, end, arr[start])
    }
    
    const mid = Math.floor((start + end) / 2)
    const node = new SegmentTreeNode(start, end)
    
    node.left = buildSegmentTree(arr, start, mid)
    node.right = buildSegmentTree(arr, mid + 1, end)
    node.value = node.left.value + node.right.value
    
    return node
  }

  // Update single point in segment tree
  const updatePoint = (node, index, newValue, steps = [], path = []) => {
    if (!node) return

    path.push(node.id)
    
    const stepInfo = {
      type: 'visit_node',
      currentNode: node.id,
      nodeRange: [node.start, node.end],
      nodeValue: node.value,
      updateIndex: index,
      updateValue: newValue,
      highlighted: new Set([node.id]),
      updatePath: [...path],
      oldValues: new Map(),
      newValues: new Map(),
      description: `Visiting node [${node.start}, ${node.end}] with sum ${node.value}. Update index: ${index}`
    }

    // Check if this node's range contains the update index
    if (node.start > index || node.end < index) {
      stepInfo.type = 'skip_node'
      stepInfo.description = `Node [${node.start}, ${node.end}] doesn't contain index ${index}. Skip this node.`
      steps.push(stepInfo)
      return
    }

    // If it's a leaf node, update directly
    if (node.start === node.end) {
      stepInfo.type = 'leaf_update'
      stepInfo.oldValues = new Map([[node.id, node.value]])
      const oldValue = node.value
      node.value = newValue
      stepInfo.newValues = new Map([[node.id, newValue]])
      stepInfo.description = `Leaf node [${node.start}, ${node.end}]: Update value from ${oldValue} to ${newValue}.`
      steps.push(stepInfo)
      return
    }

    // Internal node - need to update children first
    stepInfo.type = 'internal_node'
    stepInfo.description = `Internal node [${node.start}, ${node.end}]. Check children for index ${index}.`
    steps.push(stepInfo)

    // Store old value
    const oldNodeValue = node.value

    // Update appropriate child
    const mid = Math.floor((node.start + node.end) / 2)
    if (index <= mid) {
      updatePoint(node.left, index, newValue, steps, [...path])
    } else {
      updatePoint(node.right, index, newValue, steps, [...path])
    }

    // Recalculate this node's value
    const newNodeValue = (node.left ? node.left.value : 0) + (node.right ? node.right.value : 0)
    node.value = newNodeValue

    steps.push({
      type: 'update_internal',
      currentNode: node.id,
      nodeRange: [node.start, node.end],
      nodeValue: newNodeValue,
      updateIndex: index,
      updateValue: newValue,
      highlighted: new Set([node.id]),
      updatePath: [...path],
      oldValues: new Map([[node.id, oldNodeValue]]),
      newValues: new Map([[node.id, newNodeValue]]),
      description: `Update internal node [${node.start}, ${node.end}]: ${oldNodeValue} → ${newNodeValue} (sum of children).`
    })
  }

  // Generate update steps
  const generateSteps = useCallback((tree, index, value) => {
    if (!tree) return

    const treeCopy = cloneTree(tree)
    const steps = []
    
    steps.push({
      type: 'start',
      currentNode: tree.id,
      nodeRange: [tree.start, tree.end],
      nodeValue: tree.value,
      updateIndex: index,
      updateValue: value,
      highlighted: new Set([tree.id]),
      updatePath: [],
      oldValues: new Map(),
      newValues: new Map(),
      description: `Starting point update: Set array[${index}] = ${value} in segment tree.`
    })

    updatePoint(treeCopy, index, value, steps)
    
    steps.push({
      type: 'complete',
      currentNode: null,
      nodeRange: [0, 0],
      nodeValue: 0,
      updateIndex: index,
      updateValue: value,
      highlighted: new Set(),
      updatePath: [],
      oldValues: new Map(),
      newValues: new Map(),
      description: `Update complete! Array[${index}] updated to ${value} and segment tree recomputed.`
    })

    setSteps(steps)
    // Update the actual tree after generating steps
    updatePoint(tree, index, value, [], [])
    setSegmentTree(tree)
  }, [])

  // Clone tree for step simulation
  const cloneTree = (node) => {
    if (!node) return null
    
    const newNode = new SegmentTreeNode(node.start, node.end, node.value)
    newNode.id = node.id
    newNode.left = cloneTree(node.left)
    newNode.right = cloneTree(node.right)
    
    return newNode
  }

  // Initialize segment tree
  const initializeSegmentTree = useCallback(() => {
    const tree = buildSegmentTree(originalArray)
    setSegmentTree(tree)
    setCurrentStep(0)
    setCurrentNode(null)
    setHighlightedNodes(new Set())
    setUpdatePath([])
    setOldValues(new Map())
    setNewValues(new Map())
    setIsPlaying(false)
    generateSteps(tree, updateIndex, updateValue)
  }, [originalArray, updateIndex, updateValue, generateSteps])

  // Update array value and rebuild
  const updateArrayValue = (index, newValue) => {
    const newArray = [...originalArray]
    newArray[index] = parseInt(newValue)
    setOriginalArray(newArray)
  }

  // Initialize
  useEffect(() => {
    initializeSegmentTree()
  }, [initializeSegmentTree])

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
      setCurrentNode(step.currentNode)
      setHighlightedNodes(step.highlighted || new Set())
      setUpdatePath(step.updatePath || [])
      setOldValues(step.oldValues || new Map())
      setNewValues(step.newValues || new Map())
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

  // Get node color based on state
  const getNodeColor = (node) => {
    if (highlightedNodes.has(node.id)) {
      const step = steps[currentStep]
      if (step?.type === 'leaf_update') {
        return 'fill-green-500 stroke-green-400 animate-pulse'
      } else if (step?.type === 'update_internal') {
        return 'fill-blue-500 stroke-blue-400 animate-pulse'
      } else if (step?.type === 'skip_node') {
        return 'fill-red-500 stroke-red-400 animate-pulse'
      }
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (updatePath.includes(node.id)) {
      return 'fill-orange-500 stroke-orange-400'
    }
    return 'fill-gray-500 stroke-gray-400'
  }

  // Get display value for node
  const getDisplayValue = (node) => {
    if (newValues.has(node.id)) {
      return newValues.get(node.id)
    }
    return node.value
  }

  // Render segment tree
  const renderSegmentTree = (node, x, y, level = 0, parentX = x, parentY = y) => {
    if (!node) return null

    const nodeWidth = 80
    const levelHeight = 100
    const horizontalSpacing = Math.pow(2, 4 - level) * 30

    const hasOldValue = oldValues.has(node.id)
    const hasNewValue = newValues.has(node.id)

    return (
      <g key={node.id}>
        {/* Connection to parent */}
        {level > 0 && (
          <line
            x1={parentX}
            y1={parentY + 30}
            x2={x}
            y2={y - 30}
            stroke={updatePath.includes(node.id) ? '#F97316' : '#6B7280'}
            strokeWidth={updatePath.includes(node.id) ? '3' : '2'}
          />
        )}

        {/* Node rectangle */}
        <rect
          x={x - nodeWidth / 2}
          y={y - 15}
          width={nodeWidth}
          height={30}
          rx="5"
          className={`${getNodeColor(node)} stroke-2 transition-all duration-500`}
        />

        {/* Range label */}
        <text
          x={x}
          y={y - 2}
          textAnchor="middle"
          className="fill-white text-xs font-bold"
        >
          [{node.start}, {node.end}]
        </text>

        {/* Value label - show old and new if updating */}
        {hasOldValue && hasNewValue ? (
          <g>
            <text
              x={x - 15}
              y={y + 10}
              textAnchor="middle"
              className="fill-red-400 text-sm font-bold line-through"
            >
              {oldValues.get(node.id)}
            </text>
            <text
              x={x + 15}
              y={y + 10}
              textAnchor="middle"
              className="fill-green-400 text-sm font-bold"
            >
              {newValues.get(node.id)}
            </text>
          </g>
        ) : (
          <text
            x={x}
            y={y + 10}
            textAnchor="middle"
            className={`text-sm font-bold ${hasNewValue ? 'fill-green-400' : 'fill-white'}`}
          >
            {getDisplayValue(node)}
          </text>
        )}

        {/* Update indicator */}
        {highlightedNodes.has(node.id) && (
          <rect
            x={x - nodeWidth / 2 - 5}
            y={y - 20}
            width={nodeWidth + 10}
            height={40}
            rx="8"
            className="fill-none stroke-yellow-400 stroke-2 opacity-60"
          />
        )}

        {/* Render children */}
        {node.left && renderSegmentTree(node.left, x - horizontalSpacing, y + levelHeight, level + 1, x, y)}
        {node.right && renderSegmentTree(node.right, x + horizontalSpacing, y + levelHeight, level + 1, x, y)}
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
                  Segment Tree Point Update
                </h1>
                <p className="text-gray-400 text-sm">Update single array element and propagate changes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaEdit className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Point Update</span>
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
                Update Controls
              </h2>
              
              {/* Array Values */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Array Values
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {originalArray.map((value, index) => (
                    <div key={index} className="flex flex-col">
                      <label className="text-xs text-gray-400 mb-1">A[{index}]</label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => updateArrayValue(index, e.target.value)}
                        className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Parameters */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Update Parameters
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400">Index</label>
                    <input
                      type="number"
                      min="0"
                      max={originalArray.length - 1}
                      value={updateIndex}
                      onChange={(e) => setUpdateIndex(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">New Value</label>
                    <input
                      type="number"
                      value={updateValue}
                      onChange={(e) => setUpdateValue(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Set array[{updateIndex}] = {updateValue}
                </p>
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
                  onClick={initializeSegmentTree}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaSync className="w-4 h-4" />
                  Rebuild & Update
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

              {/* Current Update Info */}
              <div className="mt-6 bg-green-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                  <FaEdit className="w-4 h-4" />
                  Current Update:
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Index:</span>
                    <span className="text-green-400 font-bold">{updateIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Old Value:</span>
                    <span className="text-red-400 font-bold">{originalArray[updateIndex]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">New Value:</span>
                    <span className="text-green-400 font-bold">{updateValue}</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500"></div>
                    <span className="text-gray-300">Regular Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500"></div>
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500"></div>
                    <span className="text-gray-300">Update Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span className="text-gray-300">Leaf Update</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span className="text-gray-300">Internal Update</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span className="text-gray-300">Skipped Node</span>
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
                  <FaChartLine className="w-5 h-5" />
                  Segment Tree Update Visualization
                </h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Array Before/After */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Before Update:</h3>
                  <div className="flex justify-center space-x-2">
                    {originalArray.map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                          index === updateIndex
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {value}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{index}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">After Update:</h3>
                  <div className="flex justify-center space-x-2">
                    {originalArray.map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                          index === updateIndex
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {index === updateIndex ? updateValue : value}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{index}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Segment Tree */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="overflow-x-auto">
                  <svg width="900" height="400" className="mx-auto">
                    {segmentTree && renderSegmentTree(segmentTree, 450, 60)}
                  </svg>
                </div>
              </div>

              {/* Update Process */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Update Process:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-green-800 rounded p-3">
                    <div className="text-green-400 font-medium">1. Find Leaf</div>
                    <div className="text-gray-300">Navigate to leaf containing target index</div>
                  </div>
                  <div className="bg-blue-800 rounded p-3">
                    <div className="text-blue-400 font-medium">2. Update Leaf</div>
                    <div className="text-gray-300">Change leaf value to new value</div>
                  </div>
                  <div className="bg-orange-800 rounded p-3">
                    <div className="text-orange-400 font-medium">3. Propagate Up</div>
                    <div className="text-gray-300">Recalculate all ancestors</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start segment tree point update'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Segment Tree Point Update</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(log n) - visit nodes along root-to-leaf path</p>
                  <p><strong>Space Complexity:</strong> O(1) - no extra space needed</p>
                  <p><strong>Process:</strong> Find leaf, update value, recalculate ancestors bottom-up</p>
                  <p><strong>Applications:</strong> Dynamic arrays, range queries with updates</p>
                  <p><strong>Advantage:</strong> Maintains all range queries efficiently after updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SegmentTreeUpdate
