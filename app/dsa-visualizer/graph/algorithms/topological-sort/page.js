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
  FaSortNumericDown,
  FaProjectDiagram
} from 'react-icons/fa'

const TopologicalSort = () => {
  const router = useRouter()
  const [graph, setGraph] = useState([])
  const [adjacencyList, setAdjacencyList] = useState({})
  const [inDegree, setInDegree] = useState({})
  const [queue, setQueue] = useState([])
  const [result, setResult] = useState([])
  const [currentNode, setCurrentNode] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [algorithm, setAlgorithm] = useState('kahn') // 'kahn' or 'dfs'
  const [visitedNodes, setVisitedNodes] = useState(new Set())
  const [processingStack, setProcessingStack] = useState([])

  // Generate DAG (Directed Acyclic Graph)
  const generateGraph = useCallback(() => {
    const nodes = [
      { id: 0, x: 100, y: 100, label: 'A' },
      { id: 1, x: 300, y: 100, label: 'B' },
      { id: 2, x: 200, y: 200, label: 'C' },
      { id: 3, x: 400, y: 200, label: 'D' },
      { id: 4, x: 150, y: 300, label: 'E' },
      { id: 5, x: 350, y: 300, label: 'F' }
    ]

    // DAG edges (dependencies)
    const edges = [
      { from: 0, to: 2, label: 'A→C' }, // A depends on C
      { from: 1, to: 2, label: 'B→C' }, // B depends on C  
      { from: 1, to: 3, label: 'B→D' }, // B depends on D
      { from: 2, to: 4, label: 'C→E' }, // C depends on E
      { from: 2, to: 5, label: 'C→F' }, // C depends on F
      { from: 3, to: 5, label: 'D→F' }  // D depends on F
    ]

    // Create adjacency list
    const adjList = {}
    const inDeg = {}
    
    nodes.forEach(node => {
      adjList[node.id] = []
      inDeg[node.id] = 0
    })

    edges.forEach(edge => {
      adjList[edge.from].push(edge.to)
      inDeg[edge.to]++
    })

    setGraph(nodes)
    setAdjacencyList(adjList)
    setInDegree(inDeg)
    setQueue([])
    setResult([])
    setCurrentNode(null)
    setCurrentStep(0)
    setIsPlaying(false)
    setVisitedNodes(new Set())
    setProcessingStack([])
    
    if (algorithm === 'kahn') {
      generateKahnsSteps(nodes, adjList, { ...inDeg })
    } else {
      generateDFSSteps(nodes, adjList)
    }
  }, [algorithm])

  // Kahn's algorithm (BFS-based)
  const generateKahnsSteps = (nodes, adjList, inDegree) => {
    const steps = []
    const result = []
    const queue = []
    const currentInDegree = { ...inDegree }

    steps.push({
      type: 'initial',
      inDegree: { ...currentInDegree },
      queue: [],
      result: [],
      currentNode: null,
      description: 'Initialize in-degree for each node. In-degree = number of incoming edges.'
    })

    // Find nodes with 0 in-degree
    Object.keys(currentInDegree).forEach(nodeId => {
      if (currentInDegree[nodeId] === 0) {
        queue.push(parseInt(nodeId))
      }
    })

    steps.push({
      type: 'find_sources',
      inDegree: { ...currentInDegree },
      queue: [...queue],
      result: [],
      currentNode: null,
      description: `Found nodes with 0 in-degree (no dependencies): ${queue.map(id => nodes[id].label).join(', ')}`
    })

    while (queue.length > 0) {
      const current = queue.shift()
      result.push(current)

      steps.push({
        type: 'process_node',
        inDegree: { ...currentInDegree },
        queue: [...queue],
        result: [...result],
        currentNode: current,
        description: `Process node ${nodes[current].label}. Add to topological order.`
      })

      // Reduce in-degree of adjacent nodes
      adjList[current].forEach(neighbor => {
        currentInDegree[neighbor]--
        
        steps.push({
          type: 'reduce_indegree',
          inDegree: { ...currentInDegree },
          queue: [...queue],
          result: [...result],
          currentNode: current,
          neighbor: neighbor,
          description: `Reduce in-degree of ${nodes[neighbor].label} to ${currentInDegree[neighbor]} (removed dependency from ${nodes[current].label})`
        })

        if (currentInDegree[neighbor] === 0) {
          queue.push(neighbor)
          steps.push({
            type: 'add_to_queue',
            inDegree: { ...currentInDegree },
            queue: [...queue],
            result: [...result],
            currentNode: current,
            neighbor: neighbor,
            description: `${nodes[neighbor].label} has 0 in-degree now - add to queue for processing`
          })
        }
      })
    }

    const isValidSort = result.length === nodes.length
    steps.push({
      type: 'complete',
      inDegree: { ...currentInDegree },
      queue: [],
      result: [...result],
      currentNode: null,
      description: isValidSort 
        ? `Topological sort complete! Order: ${result.map(id => nodes[id].label).join(' → ')}`
        : 'Graph contains cycle - topological sort impossible!'
    })

    setSteps(steps)
  }

  // DFS-based topological sort
  const generateDFSSteps = (nodes, adjList) => {
    const steps = []
    const visited = new Set()
    const recStack = new Set()
    const result = []

    steps.push({
      type: 'initial',
      visited: new Set(),
      recStack: new Set(),
      result: [],
      currentNode: null,
      description: 'DFS-based topological sort. Use recursion stack to detect cycles.'
    })

    const dfs = (nodeId) => {
      if (recStack.has(nodeId)) {
        steps.push({
          type: 'cycle_detected',
          visited: new Set(visited),
          recStack: new Set(recStack),
          result: [...result],
          currentNode: nodeId,
          description: `Cycle detected! Node ${nodes[nodeId].label} is in recursion stack.`
        })
        return false
      }

      if (visited.has(nodeId)) return true

      visited.add(nodeId)
      recStack.add(nodeId)

      steps.push({
        type: 'visit_node',
        visited: new Set(visited),
        recStack: new Set(recStack),
        result: [...result],
        currentNode: nodeId,
        description: `Visit node ${nodes[nodeId].label}. Add to recursion stack.`
      })

      // Visit all neighbors
      for (const neighbor of adjList[nodeId]) {
        if (!dfs(neighbor)) return false
      }

      recStack.delete(nodeId)
      result.unshift(nodeId) // Add to front for reverse postorder

      steps.push({
        type: 'finish_node',
        visited: new Set(visited),
        recStack: new Set(recStack),
        result: [...result],
        currentNode: nodeId,
        description: `Finish processing ${nodes[nodeId].label}. Remove from stack, add to result.`
      })

      return true
    }

    let isValidSort = true
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (!dfs(node.id)) {
          isValidSort = false
          break
        }
      }
    }

    steps.push({
      type: 'complete',
      visited: new Set(visited),
      recStack: new Set(),
      result: [...result],
      currentNode: null,
      description: isValidSort 
        ? `DFS topological sort complete! Order: ${result.map(id => nodes[id].label).join(' → ')}`
        : 'Graph contains cycle - topological sort impossible!'
    })

    setSteps(steps)
  }

  // Initialize
  useEffect(() => {
    generateGraph()
  }, [generateGraph])

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
      setResult(step.result || [])
      
      if (algorithm === 'kahn') {
        setInDegree(step.inDegree || {})
        setQueue(step.queue || [])
      } else {
        setVisitedNodes(step.visited || new Set())
        setProcessingStack(step.recStack || new Set())
      }
    }
  }, [currentStep, steps, algorithm])

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

  const getNodeColor = (nodeId) => {
    if (currentNode === nodeId) return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    
    if (algorithm === 'kahn') {
      if (result.includes(nodeId)) return 'fill-green-500 stroke-green-400'
      if (queue.includes(nodeId)) return 'fill-blue-500 stroke-blue-400'
      return 'fill-gray-500 stroke-gray-400'
    } else {
      if (processingStack.has(nodeId)) return 'fill-red-500 stroke-red-400'
      if (visitedNodes.has(nodeId)) return 'fill-green-500 stroke-green-400'
      return 'fill-gray-500 stroke-gray-400'
    }
  }

  const getEdgePosition = (fromNode, toNode) => {
    const dx = toNode.x - fromNode.x
    const dy = toNode.y - fromNode.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const unitX = dx / length
    const unitY = dy / length
    const radius = 25
    
    return {
      x1: fromNode.x + unitX * radius,
      y1: fromNode.y + unitY * radius,
      x2: toNode.x - unitX * radius,
      y2: toNode.y - unitY * radius
    }
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
                  Topological Sort
                </h1>
                <p className="text-gray-400 text-sm">Linear ordering of vertices in DAG</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaSortNumericDown className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-sm">Graph Ordering</span>
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
              
              {/* Algorithm Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Algorithm
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setAlgorithm('kahn')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      algorithm === 'kahn' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    Kahn's (BFS)
                  </button>
                  <button
                    onClick={() => setAlgorithm('dfs')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      algorithm === 'dfs' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    DFS
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
                  onClick={generateGraph}
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

              {/* Algorithm-specific info */}
              {algorithm === 'kahn' ? (
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Kahn's Algorithm State</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-300">Queue: </span>
                      <span className="text-blue-400 font-bold">
                        {queue.map(id => graph[id]?.label).join(', ') || 'Empty'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-300">In-Degrees: </span>
                      <div className="text-white text-xs">
                        {Object.entries(inDegree).map(([nodeId, degree]) => (
                          <span key={nodeId} className="mr-2">
                            {graph[nodeId]?.label}: {degree}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">DFS State</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-300">Visited: </span>
                      <span className="text-green-400 font-bold">
                        {Array.from(visitedNodes).map(id => graph[id]?.label).join(', ') || 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-300">Rec Stack: </span>
                      <span className="text-red-400 font-bold">
                        {Array.from(processingStack).map(id => graph[id]?.label).join(', ') || 'Empty'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Unprocessed</span>
                  </div>
                  {algorithm === 'kahn' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300">In Queue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">In Result</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-gray-300">In Rec Stack</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">Visited</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Current Node</span>
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
                  <FaProjectDiagram className="w-5 h-5" />
                  DAG Visualization
                </h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Graph SVG */}
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <svg width="500" height="400" className="mx-auto">
                  {/* Draw edges with arrows */}
                  {Object.entries(adjacencyList).map(([fromId, neighbors]) => 
                    neighbors.map(toId => {
                      const fromNode = graph[parseInt(fromId)]
                      const toNode = graph[toId]
                      if (!fromNode || !toNode) return null
                      
                      const pos = getEdgePosition(fromNode, toNode)
                      
                      return (
                        <g key={`${fromId}-${toId}`}>
                          <line
                            x1={pos.x1}
                            y1={pos.y1}
                            x2={pos.x2}
                            y2={pos.y2}
                            stroke="#6B7280"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                          />
                        </g>
                      )
                    })
                  )}
                  
                  {/* Arrow marker definition */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="10"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="#6B7280"
                      />
                    </marker>
                  </defs>
                  
                  {/* Draw nodes */}
                  {graph.map(node => (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="25"
                        className={`${getNodeColor(node.id)} stroke-2 transition-all duration-500`}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="fill-white text-lg font-bold"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Topological Order */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Topological Order</h3>
                <div className="flex items-center space-x-2">
                  {result.length === 0 ? (
                    <div className="text-gray-400 italic">No nodes processed yet</div>
                  ) : (
                    result.map((nodeId, index) => (
                      <React.Fragment key={nodeId}>
                        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">
                          {graph[nodeId]?.label}
                        </div>
                        {index < result.length - 1 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start topological sorting'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">
                  {algorithm === 'kahn' ? "Kahn's Algorithm" : "DFS-based Topological Sort"}
                </h3>
                <div className="text-gray-300 text-sm space-y-1">
                  {algorithm === 'kahn' ? (
                    <>
                      <p><strong>Time Complexity:</strong> O(V + E) - Linear in vertices and edges</p>
                      <p><strong>Space Complexity:</strong> O(V) - Queue and in-degree array</p>
                      <p><strong>Approach:</strong> Remove nodes with 0 in-degree iteratively</p>
                      <p><strong>Cycle Detection:</strong> If result length < V, cycle exists</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Time Complexity:</strong> O(V + E) - DFS traversal</p>
                      <p><strong>Space Complexity:</strong> O(V) - Recursion stack</p>
                      <p><strong>Approach:</strong> DFS with reverse postorder</p>
                      <p><strong>Cycle Detection:</strong> Node in recursion stack = back edge</p>
                    </>
                  )}
                  <p><strong>Use Cases:</strong> Task scheduling, dependency resolution, build systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopologicalSort
