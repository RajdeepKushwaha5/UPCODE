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
  FaRoute
} from 'react-icons/fa'

const DijkstraAlgorithm = () => {
  const router = useRouter()
  const [graph, setGraph] = useState({})
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [startNode, setStartNode] = useState('A')
  const [targetNode, setTargetNode] = useState('F')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [distances, setDistances] = useState({})
  const [previous, setPrevious] = useState({})
  const [unvisited, setUnvisited] = useState([])
  const [shortestPath, setShortestPath] = useState([])
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)

  // Generate weighted graph for Dijkstra's algorithm
  const generateGraph = useCallback(() => {
    const graphStructure = {
      'A': [{ node: 'B', weight: 4 }, { node: 'C', weight: 2 }],
      'B': [{ node: 'A', weight: 4 }, { node: 'C', weight: 1 }, { node: 'D', weight: 5 }],
      'C': [{ node: 'A', weight: 2 }, { node: 'B', weight: 1 }, { node: 'D', weight: 8 }, { node: 'E', weight: 10 }],
      'D': [{ node: 'B', weight: 5 }, { node: 'C', weight: 8 }, { node: 'E', weight: 2 }, { node: 'F', weight: 6 }],
      'E': [{ node: 'C', weight: 10 }, { node: 'D', weight: 2 }, { node: 'F', weight: 3 }],
      'F': [{ node: 'D', weight: 6 }, { node: 'E', weight: 3 }]
    }

    const nodePositions = {
      'A': { x: 100, y: 150 },
      'B': { x: 250, y: 100 },
      'C': { x: 200, y: 250 },
      'D': { x: 400, y: 150 },
      'E': { x: 500, y: 250 },
      'F': { x: 550, y: 150 }
    }

    const nodeList = Object.keys(graphStructure).map(id => ({
      id,
      ...nodePositions[id]
    }))

    const edgeList = []
    Object.entries(graphStructure).forEach(([from, neighbors]) => {
      neighbors.forEach(({ node: to, weight }) => {
        if (from < to) { // Avoid duplicate edges for undirected graph
          edgeList.push({
            from,
            to,
            weight,
            id: `${from}-${to}`
          })
        }
      })
    })

    setGraph(graphStructure)
    setNodes(nodeList)
    setEdges(edgeList)
    setStartNode('A')
    setTargetNode('F')
    setCurrentStep(0)
    setCurrentNode(null)
    setVisitedNodes([])
    setDistances({})
    setPrevious({})
    setUnvisited([])
    setShortestPath([])
    setIsPlaying(false)
    generateSteps(graphStructure, 'A', 'F')
  }, [])

  // Generate Dijkstra's algorithm steps
  const generateSteps = (graph, start, target) => {
    const steps = []
    const distances = {}
    const previous = {}
    const visited = new Set()
    const unvisited = new Set(Object.keys(graph))
    
    // Initialize distances
    Object.keys(graph).forEach(node => {
      distances[node] = node === start ? 0 : Infinity
      previous[node] = null
    })

    steps.push({
      type: 'initial',
      current: null,
      visited: [],
      distances: { ...distances },
      previous: { ...previous },
      unvisited: Array.from(unvisited),
      shortestPath: [],
      description: `Initialize Dijkstra's algorithm. Set distance to ${start} = 0, all others = ∞`
    })

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = null
      let minDistance = Infinity
      
      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node]
          current = node
        }
      }

      if (current === null || distances[current] === Infinity) break

      steps.push({
        type: 'select',
        current: current,
        visited: Array.from(visited),
        distances: { ...distances },
        previous: { ...previous },
        unvisited: Array.from(unvisited),
        shortestPath: [],
        description: `Select unvisited node ${current} with minimum distance: ${distances[current]}`
      })

      unvisited.delete(current)
      visited.add(current)

      steps.push({
        type: 'visit',
        current: current,
        visited: Array.from(visited),
        distances: { ...distances },
        previous: { ...previous },
        unvisited: Array.from(unvisited),
        shortestPath: [],
        description: `Mark node ${current} as visited. Current shortest distance: ${distances[current]}`
      })

      if (current === target) {
        // Reconstruct path
        const path = []
        let pathNode = target
        while (pathNode !== null) {
          path.unshift(pathNode)
          pathNode = previous[pathNode]
        }

        steps.push({
          type: 'target_reached',
          current: current,
          visited: Array.from(visited),
          distances: { ...distances },
          previous: { ...previous },
          unvisited: Array.from(unvisited),
          shortestPath: path,
          description: `Target ${target} reached! Shortest path: ${path.join(' → ')}, Distance: ${distances[target]}`
        })
        break
      }

      // Update distances to neighbors
      const neighbors = graph[current] || []
      const updatedNeighbors = []

      neighbors.forEach(({ node: neighbor, weight }) => {
        if (!visited.has(neighbor)) {
          const newDistance = distances[current] + weight
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance
            previous[neighbor] = current
            updatedNeighbors.push({ node: neighbor, oldDist: distances[neighbor] === Infinity ? '∞' : distances[neighbor], newDist: newDistance })
          }
        }
      })

      if (updatedNeighbors.length > 0) {
        steps.push({
          type: 'update',
          current: current,
          visited: Array.from(visited),
          distances: { ...distances },
          previous: { ...previous },
          unvisited: Array.from(unvisited),
          shortestPath: [],
          description: `Update distances via ${current}: ${updatedNeighbors.map(u => `${u.node}: ${u.oldDist} → ${u.newDist}`).join(', ')}`
        })
      } else {
        steps.push({
          type: 'no_update',
          current: current,
          visited: Array.from(visited),
          distances: { ...distances },
          previous: { ...previous },
          unvisited: Array.from(unvisited),
          shortestPath: [],
          description: `No better paths found via ${current}`
        })
      }
    }

    // Final path reconstruction if not already done
    if (steps[steps.length - 1].type !== 'target_reached') {
      const path = []
      let pathNode = target
      while (pathNode !== null && previous[pathNode] !== undefined) {
        path.unshift(pathNode)
        pathNode = previous[pathNode]
      }
      if (pathNode === start) path.unshift(start)

      steps.push({
        type: 'complete',
        current: null,
        visited: Array.from(visited),
        distances: { ...distances },
        previous: { ...previous },
        unvisited: Array.from(unvisited),
        shortestPath: path,
        description: distances[target] === Infinity ? 
          `No path exists from ${start} to ${target}` :
          `Algorithm complete! Shortest path: ${path.join(' → ')}, Total distance: ${distances[target]}`
      })
    }

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
      setCurrentNode(step.current)
      setVisitedNodes(step.visited)
      setDistances(step.distances)
      setPrevious(step.previous)
      setUnvisited(step.unvisited)
      setShortestPath(step.shortestPath)
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

  const handleStartNodeChange = (nodeId) => {
    setStartNode(nodeId)
    generateSteps(graph, nodeId, targetNode)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handleTargetNodeChange = (nodeId) => {
    setTargetNode(nodeId)
    generateSteps(graph, startNode, nodeId)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const getNodeColor = (nodeId) => {
    if (shortestPath.includes(nodeId)) return 'bg-yellow-500 border-yellow-400 text-black'
    if (nodeId === currentNode) return 'bg-red-500 border-red-400'
    if (visitedNodes.includes(nodeId)) return 'bg-green-500 border-green-400'
    if (unvisited.includes(nodeId)) return 'bg-blue-500 border-blue-400'
    return 'bg-gray-500 border-gray-400'
  }

  const getEdgeColor = (edge) => {
    const { from, to } = edge
    if (shortestPath.length > 1) {
      for (let i = 0; i < shortestPath.length - 1; i++) {
        if ((shortestPath[i] === from && shortestPath[i + 1] === to) ||
            (shortestPath[i] === to && shortestPath[i + 1] === from)) {
          return '#FCD34D' // yellow
        }
      }
    }
    return '#6B7280' // gray
  }

  const renderGraph = () => {
    return (
      <div className="relative">
        <svg width="700" height="400" viewBox="0 0 700 400">
          {/* Render edges */}
          {edges.map(edge => {
            const fromNode = nodes.find(n => n.id === edge.from)
            const toNode = nodes.find(n => n.id === edge.to)
            if (!fromNode || !toNode) return null

            const midX = (fromNode.x + toNode.x) / 2
            const midY = (fromNode.y + toNode.y) / 2

            return (
              <g key={edge.id}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={getEdgeColor(edge)}
                  strokeWidth="3"
                  className="transition-all duration-500"
                />
                {/* Weight label */}
                <circle
                  cx={midX}
                  cy={midY}
                  r="15"
                  fill="#374151"
                  stroke="#6B7280"
                  strokeWidth="2"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className="fill-white font-bold text-sm"
                >
                  {edge.weight}
                </text>
              </g>
            )
          })}

          {/* Render nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="30"
                className={`${getNodeColor(node.id)} transition-all duration-500 stroke-2 cursor-pointer`}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="fill-white font-bold text-lg pointer-events-none"
              >
                {node.id}
              </text>
              
              {/* Distance label */}
              <text
                x={node.x}
                y={node.y - 45}
                textAnchor="middle"
                className="fill-cyan-400 font-bold text-sm"
              >
                {distances[node.id] === Infinity ? '∞' : distances[node.id]}
              </text>
            </g>
          ))}
        </svg>
      </div>
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
                  Dijkstra's Shortest Path
                </h1>
                <p className="text-gray-400 text-sm">Find shortest path in weighted graphs</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaRoute className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Pathfinding Algorithm</span>
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
              
              {/* Node Selection */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Start Node
                  </label>
                  <select
                    value={startNode}
                    onChange={(e) => handleStartNodeChange(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {nodes.map(node => (
                      <option key={node.id} value={node.id}>
                        Node {node.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Target Node
                  </label>
                  <select
                    value={targetNode}
                    onChange={(e) => handleTargetNodeChange(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {nodes.map(node => (
                      <option key={node.id} value={node.id}>
                        Node {node.id}
                      </option>
                    ))}
                  </select>
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
                  Reset Graph
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

              {/* Current Distances */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Distances:</h3>
                <div className="bg-gray-800 rounded p-3 space-y-2">
                  {Object.entries(distances).map(([node, dist]) => (
                    <div key={node} className="flex justify-between items-center">
                      <span className="text-gray-300">{node}:</span>
                      <span className={`font-bold ${visitedNodes.includes(node) ? 'text-green-400' : 'text-cyan-400'}`}>
                        {dist === Infinity ? '∞' : dist}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shortest Path */}
              {shortestPath.length > 0 && (
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Shortest Path:</h3>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="flex flex-wrap gap-2">
                      {shortestPath.map((node, index) => (
                        <React.Fragment key={node}>
                          <span className="px-2 py-1 bg-yellow-600 text-white rounded text-sm font-bold">
                            {node}
                          </span>
                          {index < shortestPath.length - 1 && (
                            <span className="text-yellow-400 self-center">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="mt-2 text-yellow-400 text-sm font-bold">
                      Total Distance: {distances[targetNode] === Infinity ? '∞' : distances[targetNode]}
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Color Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Unvisited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Shortest Path</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Weighted Graph Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Graph Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  {renderGraph()}
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">
                  Numbers above nodes show current shortest distances • Numbers on edges show weights
                </p>
              </div>

              {/* Algorithm Pattern */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Dijkstra's Pattern:</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="px-3 py-2 bg-blue-600 text-white rounded text-center">Initialize Distances</div>
                  <div className="px-3 py-2 bg-red-600 text-white rounded text-center">Pick Min Distance</div>
                  <div className="px-3 py-2 bg-green-600 text-white rounded text-center">Update Neighbors</div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start Dijkstra\'s algorithm'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Algorithm Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O((V + E) log V) with binary heap</p>
                  <p><strong>Space Complexity:</strong> O(V) for distances and previous arrays</p>
                  <p><strong>Requirement:</strong> Non-negative edge weights only</p>
                  <p><strong>Use Cases:</strong> GPS navigation, network routing, shortest path problems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DijkstraAlgorithm
