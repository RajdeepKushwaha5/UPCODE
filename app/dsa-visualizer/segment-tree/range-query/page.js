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
  FaChartLine,
  FaCalculator,
  FaSearch
} from 'react-icons/fa'

const SegmentTreeRangeQuery = () => {
  const router = useRouter()
  const [segmentTree, setSegmentTree] = useState(null)
  const [originalArray, setOriginalArray] = useState([2, 5, 1, 4, 9, 3])
  const [queryRange, setQueryRange] = useState({ left: 1, right: 4 })
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [queryResult, setQueryResult] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [partialResults, setPartialResults] = useState([])

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

  // Query range sum
  const queryRangeSum = (node, queryLeft, queryRight, steps = []) => {
    if (!node) return 0

    const stepInfo = {
      type: 'visit_node',
      currentNode: node.id,
      nodeRange: [node.start, node.end],
      nodeValue: node.value,
      queryRange: [queryLeft, queryRight],
      highlighted: new Set([node.id]),
      partialResults: [],
      description: `Visiting node [${node.start}, ${node.end}] with sum ${node.value}. Query range: [${queryLeft}, ${queryRight}]`
    }

    // Case 1: No overlap
    if (queryRight < node.start || queryLeft > node.end) {
      stepInfo.type = 'no_overlap'
      stepInfo.description = `No overlap between node [${node.start}, ${node.end}] and query [${queryLeft}, ${queryRight}]. Return 0.`
      steps.push(stepInfo)
      return 0
    }

    // Case 2: Complete overlap
    if (queryLeft <= node.start && queryRight >= node.end) {
      stepInfo.type = 'complete_overlap'
      stepInfo.description = `Complete overlap! Node [${node.start}, ${node.end}] is completely within query [${queryLeft}, ${queryRight}]. Return ${node.value}.`
      stepInfo.partialResults = [{ range: [node.start, node.end], value: node.value }]
      steps.push(stepInfo)
      return node.value
    }

    // Case 3: Partial overlap - recurse to children
    stepInfo.type = 'partial_overlap'
    stepInfo.description = `Partial overlap between node [${node.start}, ${node.end}] and query [${queryLeft}, ${queryRight}]. Check children.`
    steps.push(stepInfo)

    const leftSum = queryRangeSum(node.left, queryLeft, queryRight, steps)
    const rightSum = queryRangeSum(node.right, queryLeft, queryRight, steps)
    
    const totalSum = leftSum + rightSum
    steps.push({
      type: 'combine_results',
      currentNode: node.id,
      nodeRange: [node.start, node.end],
      nodeValue: node.value,
      queryRange: [queryLeft, queryRight],
      highlighted: new Set([node.id]),
      partialResults: [
        { range: [node.left.start, node.left.end], value: leftSum },
        { range: [node.right.start, node.right.end], value: rightSum }
      ],
      description: `Combining results from children: ${leftSum} + ${rightSum} = ${totalSum}`
    })

    return totalSum
  }

  // Generate query steps
  const generateSteps = useCallback((tree, left, right) => {
    if (!tree) return

    const steps = []
    
    steps.push({
      type: 'start',
      currentNode: tree.id,
      nodeRange: [tree.start, tree.end],
      nodeValue: tree.value,
      queryRange: [left, right],
      highlighted: new Set([tree.id]),
      partialResults: [],
      description: `Starting range sum query for range [${left}, ${right}] on segment tree.`
    })

    const result = queryRangeSum(tree, left, right, steps)
    
    steps.push({
      type: 'complete',
      currentNode: null,
      nodeRange: [0, 0],
      nodeValue: 0,
      queryRange: [left, right],
      highlighted: new Set(),
      partialResults: [{ range: [left, right], value: result }],
      description: `Query complete! Sum of range [${left}, ${right}] = ${result}`
    })

    setSteps(steps)
  }, [])

  // Initialize segment tree
  const initializeSegmentTree = useCallback(() => {
    const tree = buildSegmentTree(originalArray)
    setSegmentTree(tree)
    setCurrentStep(0)
    setCurrentNode(null)
    setHighlightedNodes(new Set())
    setQueryResult(null)
    setVisitedNodes([])
    setPartialResults([])
    setIsPlaying(false)
    generateSteps(tree, queryRange.left, queryRange.right)
  }, [originalArray, queryRange, generateSteps])

  // Update array value
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
      setPartialResults(step.partialResults || [])
      
      if (step.type === 'complete') {
        setQueryResult(step.partialResults[0]?.value)
      }
    }
  }, [currentStep, steps])

  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)
  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setQueryResult(null)
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
      if (step?.type === 'complete_overlap') {
        return 'fill-green-500 stroke-green-400 animate-pulse'
      } else if (step?.type === 'no_overlap') {
        return 'fill-red-500 stroke-red-400 animate-pulse'
      } else if (step?.type === 'partial_overlap') {
        return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
      }
      return 'fill-blue-500 stroke-blue-400 animate-pulse'
    }
    return 'fill-gray-500 stroke-gray-400'
  }

  // Render segment tree
  const renderSegmentTree = (node, x, y, level = 0, parentX = x, parentY = y) => {
    if (!node) return null

    const nodeWidth = 80
    const levelHeight = 100
    const horizontalSpacing = Math.pow(2, 4 - level) * 30

    return (
      <g key={node.id}>
        {/* Connection to parent */}
        {level > 0 && (
          <line
            x1={parentX}
            y1={parentY + 30}
            x2={x}
            y2={y - 30}
            stroke="#6B7280"
            strokeWidth="2"
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

        {/* Value label */}
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          className="fill-white text-sm font-bold"
        >
          {node.value}
        </text>

        {/* Query overlap indicator */}
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Segment Tree Range Query
                </h1>
                <p className="text-gray-400 text-sm">Efficient range sum queries with logarithmic time</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaChartLine className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Range Sum</span>
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
                Query Controls
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

              {/* Query Range */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Query Range
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400">Left</label>
                    <input
                      type="number"
                      min="0"
                      max={originalArray.length - 1}
                      value={queryRange.left}
                      onChange={(e) => setQueryRange(prev => ({ ...prev, left: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400">Right</label>
                    <input
                      type="number"
                      min="0"
                      max={originalArray.length - 1}
                      value={queryRange.right}
                      onChange={(e) => setQueryRange(prev => ({ ...prev, right: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Query: sum([{queryRange.left}, {queryRange.right}])
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

                <button
                  onClick={initializeSegmentTree}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Rebuild Tree & Query
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

              {/* Query Result */}
              {queryResult !== null && (
                <div className="mt-6 bg-green-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <FaCalculator className="w-4 h-4" />
                    Query Result:
                  </h3>
                  <div className="bg-green-800 rounded p-3 text-center">
                    <span className="text-3xl font-bold text-green-400">{queryResult}</span>
                  </div>
                  <p className="text-xs text-green-300 mt-2 text-center">
                    Sum of range [{queryRange.left}, {queryRange.right}]
                  </p>
                </div>
              )}

              {/* Partial Results */}
              {partialResults.length > 0 && (
                <div className="mt-6 bg-blue-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Partial Results:</h3>
                  <div className="space-y-1 text-sm">
                    {partialResults.map((result, index) => (
                      <div key={index} className="flex justify-between bg-blue-800 rounded px-2 py-1">
                        <span className="text-blue-300">[{result.range[0]}, {result.range[1]}]</span>
                        <span className="text-blue-400 font-bold">{result.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500"></div>
                    <span className="text-gray-300">Regular Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span className="text-gray-300">Complete Overlap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500"></div>
                    <span className="text-gray-300">Partial Overlap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span className="text-gray-300">No Overlap</span>
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
                  Segment Tree Visualization
                </h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Original Array */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Original Array:</h3>
                <div className="flex justify-center space-x-2">
                  {originalArray.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${
                        index >= queryRange.left && index <= queryRange.right
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {value}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{index}</span>
                    </div>
                  ))}
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

              {/* Query Cases */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Segment Tree Query Cases:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-green-800 rounded p-3">
                    <div className="text-green-400 font-medium">Complete Overlap</div>
                    <div className="text-gray-300">Node range ⊆ Query range<br/>Return node value</div>
                  </div>
                  <div className="bg-yellow-800 rounded p-3">
                    <div className="text-yellow-400 font-medium">Partial Overlap</div>
                    <div className="text-gray-300">Node range ∩ Query range ≠ ∅<br/>Query both children</div>
                  </div>
                  <div className="bg-red-800 rounded p-3">
                    <div className="text-red-400 font-medium">No Overlap</div>
                    <div className="text-gray-300">Node range ∩ Query range = ∅<br/>Return 0</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start segment tree range query'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Segment Tree Range Query</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(log n) - tree height is log n</p>
                  <p><strong>Space Complexity:</strong> O(4n) - for storing the tree</p>
                  <p><strong>Build Time:</strong> O(n log n) - build tree once</p>
                  <p><strong>Applications:</strong> Range sum queries, range minimum/maximum, lazy propagation</p>
                  <p><strong>Advantage:</strong> Efficient for multiple range queries on static/dynamic arrays</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SegmentTreeRangeQuery
