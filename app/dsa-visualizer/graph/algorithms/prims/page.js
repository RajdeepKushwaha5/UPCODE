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
  FaWeight
} from 'react-icons/fa'

const PrimsAlgorithm = () => {
  const router = useRouter()
  const [graph, setGraph] = useState([])
  const [edges, setEdges] = useState([])
  const [mst, setMst] = useState([])
  const [visitedNodes, setVisitedNodes] = useState(new Set())
  const [currentEdge, setCurrentEdge] = useState(null)
  const [priorityQueue, setPriorityQueue] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [startNode, setStartNode] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  // Generate weighted graph
  const generateGraph = useCallback(() => {
    const nodes = [
      { id: 0, x: 200, y: 100, label: 'A' },
      { id: 1, x: 100, y: 200, label: 'B' },
      { id: 2, x: 300, y: 200, label: 'C' },
      { id: 3, x: 200, y: 300, label: 'D' },
      { id: 4, x: 400, y: 300, label: 'E' }
    ]

    const edgeList = [
      { from: 0, to: 1, weight: 4, id: 'A-B' },
      { from: 0, to: 2, weight: 3, id: 'A-C' },
      { from: 1, to: 2, weight: 2, id: 'B-C' },
      { from: 1, to: 3, weight: 6, id: 'B-D' },
      { from: 2, to: 3, weight: 1, id: 'C-D' },
      { from: 2, to: 4, weight: 5, id: 'C-E' },
      { from: 3, to: 4, weight: 4, id: 'D-E' }
    ]

    setGraph(nodes)
    setEdges(edgeList)
    setMst([])
    setVisitedNodes(new Set())
    setCurrentEdge(null)
    setPriorityQueue([])
    setCurrentStep(0)
    setIsPlaying(false)
    setTotalCost(0)
    generateSteps(nodes, edgeList, startNode)
  }, [startNode])

  // Prim's algorithm implementation
  const generateSteps = (nodes, edgeList, start) => {
    const steps = []
    const visited = new Set()
    const pq = []
    let mstEdges = []
    let cost = 0

    steps.push({
      type: 'initial',
      visited: new Set(),
      mst: [],
      currentEdge: null,
      priorityQueue: [],
      totalCost: 0,
      description: `Starting Prim's algorithm from node ${nodes[start].label}. Initialize empty MST and mark start node as visited.`
    })

    // Start with the starting node
    visited.add(start)
    
    steps.push({
      type: 'start',
      visited: new Set([start]),
      mst: [],
      currentEdge: null,
      priorityQueue: [],
      totalCost: 0,
      description: `Mark node ${nodes[start].label} as visited. Add all edges from ${nodes[start].label} to priority queue.`
    })

    // Add all edges from start node to priority queue
    edgeList.forEach(edge => {
      if (edge.from === start) {
        pq.push({ ...edge, priority: edge.weight })
      } else if (edge.to === start) {
        pq.push({ from: edge.to, to: edge.from, weight: edge.weight, id: edge.id, priority: edge.weight })
      }
    })
    pq.sort((a, b) => a.priority - b.priority)

    steps.push({
      type: 'queue_update',
      visited: new Set([start]),
      mst: [],
      currentEdge: null,
      priorityQueue: [...pq],
      totalCost: 0,
      description: `Priority queue updated with edges from ${nodes[start].label}. Queue sorted by weight (ascending).`
    })

    while (pq.length > 0 && visited.size < nodes.length) {
      // Get minimum weight edge
      const minEdge = pq.shift()
      
      steps.push({
        type: 'examine_edge',
        visited: new Set(visited),
        mst: [...mstEdges],
        currentEdge: minEdge,
        priorityQueue: [...pq],
        totalCost: cost,
        description: `Examining minimum weight edge: ${nodes[minEdge.from].label} → ${nodes[minEdge.to].label} (weight: ${minEdge.weight})`
      })

      // Skip if both nodes are already visited (would create cycle)
      if (visited.has(minEdge.to)) {
        steps.push({
          type: 'reject_edge',
          visited: new Set(visited),
          mst: [...mstEdges],
          currentEdge: minEdge,
          priorityQueue: [...pq],
          totalCost: cost,
          description: `Rejecting edge ${nodes[minEdge.from].label} → ${nodes[minEdge.to].label}: both nodes already in MST (would create cycle)`
        })
        continue
      }

      // Accept edge into MST
      mstEdges.push(minEdge)
      cost += minEdge.weight
      visited.add(minEdge.to)

      steps.push({
        type: 'accept_edge',
        visited: new Set(visited),
        mst: [...mstEdges],
        currentEdge: minEdge,
        priorityQueue: [...pq],
        totalCost: cost,
        description: `Accepting edge ${nodes[minEdge.from].label} → ${nodes[minEdge.to].label}. Add to MST. Total cost: ${cost}. Mark ${nodes[minEdge.to].label} as visited.`
      })

      // Add new edges from the newly visited node
      const newEdges = []
      edgeList.forEach(edge => {
        if ((edge.from === minEdge.to && !visited.has(edge.to)) ||
            (edge.to === minEdge.to && !visited.has(edge.from))) {
          
          const newEdge = edge.from === minEdge.to 
            ? { ...edge, priority: edge.weight }
            : { from: edge.to, to: edge.from, weight: edge.weight, id: edge.id, priority: edge.weight }
          
          // Check if this edge is already in queue
          if (!pq.some(e => (e.from === newEdge.from && e.to === newEdge.to) || 
                           (e.from === newEdge.to && e.to === newEdge.from))) {
            pq.push(newEdge)
            newEdges.push(newEdge)
          }
        }
      })

      if (newEdges.length > 0) {
        pq.sort((a, b) => a.priority - b.priority)
        steps.push({
          type: 'add_edges',
          visited: new Set(visited),
          mst: [...mstEdges],
          currentEdge: null,
          priorityQueue: [...pq],
          totalCost: cost,
          description: `Added ${newEdges.length} new edge(s) from ${nodes[minEdge.to].label} to priority queue. Queue re-sorted by weight.`
        })
      }
    }

    steps.push({
      type: 'complete',
      visited: new Set(visited),
      mst: [...mstEdges],
      currentEdge: null,
      priorityQueue: [],
      totalCost: cost,
      description: `Prim's algorithm complete! MST contains ${mstEdges.length} edges with total cost ${cost}.`
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
      setVisitedNodes(step.visited)
      setMst(step.mst)
      setCurrentEdge(step.currentEdge)
      setPriorityQueue(step.priorityQueue)
      setTotalCost(step.totalCost)
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

  const getNodeColor = (nodeId) => {
    if (visitedNodes.has(nodeId)) return 'fill-green-500 stroke-green-400'
    return 'fill-blue-500 stroke-blue-400'
  }

  const getEdgeColor = (edge) => {
    if (currentEdge && 
        ((currentEdge.from === edge.from && currentEdge.to === edge.to) ||
         (currentEdge.from === edge.to && currentEdge.to === edge.from))) {
      return 'stroke-yellow-400 stroke-4 animate-pulse'
    }
    
    const isInMST = mst.some(mstEdge => 
      (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
      (mstEdge.from === edge.to && mstEdge.to === edge.from)
    )
    
    if (isInMST) return 'stroke-green-400 stroke-3'
    return 'stroke-gray-400 stroke-2'
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
      y2: toNode.y - unitY * radius,
      midX: (fromNode.x + toNode.x) / 2,
      midY: (fromNode.y + toNode.y) / 2
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
                  Prim's Algorithm
                </h1>
                <p className="text-gray-400 text-sm">Minimum Spanning Tree using greedy approach</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaTree className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">MST Algorithm</span>
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
              
              {/* Start Node Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Start Node: {graph[startNode]?.label || 'A'}
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, graph.length - 1)}
                  value={startNode}
                  onChange={(e) => setStartNode(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>A</span>
                  <span>E</span>
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

              {/* MST Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                  <FaWeight className="w-4 h-4" />
                  MST Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Edges in MST:</span>
                    <span className="text-white font-bold">{mst.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Cost:</span>
                    <span className="text-green-400 font-bold">{totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Visited Nodes:</span>
                    <span className="text-white font-bold">{visitedNodes.size}</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Unvisited Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Visited Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-gray-400"></div>
                    <span className="text-gray-300">Graph Edge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-green-400"></div>
                    <span className="text-gray-300">MST Edge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-yellow-400"></div>
                    <span className="text-gray-300">Current Edge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Graph Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Graph SVG */}
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <svg width="500" height="400" className="mx-auto">
                  {/* Edges */}
                  {edges.map(edge => {
                    const fromNode = graph[edge.from]
                    const toNode = graph[edge.to]
                    if (!fromNode || !toNode) return null
                    
                    const pos = getEdgePosition(fromNode, toNode)
                    
                    return (
                      <g key={edge.id}>
                        <line
                          x1={pos.x1}
                          y1={pos.y1}
                          x2={pos.x2}
                          y2={pos.y2}
                          className={getEdgeColor(edge)}
                        />
                        <text
                          x={pos.midX}
                          y={pos.midY - 5}
                          textAnchor="middle"
                          className="fill-white text-sm font-bold"
                        >
                          {edge.weight}
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Nodes */}
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

              {/* Priority Queue */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Priority Queue (Min-Heap by Weight)</h3>
                <div className="flex flex-wrap gap-2">
                  {priorityQueue.length === 0 ? (
                    <div className="text-gray-400 italic">Empty</div>
                  ) : (
                    priorityQueue.map((edge, index) => (
                      <div
                        key={`${edge.from}-${edge.to}-${index}`}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        {graph[edge.from]?.label}→{graph[edge.to]?.label} ({edge.weight})
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start Prim\'s algorithm'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Prim's Algorithm Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(E log V) with priority queue</p>
                  <p><strong>Space Complexity:</strong> O(V) for visited set and priority queue</p>
                  <p><strong>Type:</strong> Greedy algorithm for MST</p>
                  <p><strong>Approach:</strong> Grow MST one vertex at a time</p>
                  <p><strong>Key Insight:</strong> Always choose minimum weight edge to unvisited vertex</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrimsAlgorithm
