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
  FaProjectDiagram
} from 'react-icons/fa'

const GraphBFS = () => {
  const router = useRouter()
  const [graph, setGraph] = useState({})
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [startNode, setStartNode] = useState('A')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [queue, setQueue] = useState([])
  const [traversalResult, setTraversalResult] = useState([])
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)

  // Generate sample graph
  const generateGraph = useCallback(() => {
    const graphStructure = {
      'A': ['B', 'C'],
      'B': ['A', 'D', 'E'],
      'C': ['A', 'F'],
      'D': ['B'],
      'E': ['B', 'F'],
      'F': ['C', 'E']
    }

    const nodePositions = {
      'A': { x: 300, y: 100 },
      'B': { x: 150, y: 200 },
      'C': { x: 450, y: 200 },
      'D': { x: 75, y: 350 },
      'E': { x: 225, y: 350 },
      'F': { x: 450, y: 350 }
    }

    const nodeList = Object.keys(graphStructure).map(id => ({
      id,
      ...nodePositions[id]
    }))

    const edgeList = []
    Object.entries(graphStructure).forEach(([from, neighbors]) => {
      neighbors.forEach(to => {
        if (from < to) { // Avoid duplicate edges for undirected graph
          edgeList.push({
            from,
            to,
            id: `${from}-${to}`
          })
        }
      })
    })

    setGraph(graphStructure)
    setNodes(nodeList)
    setEdges(edgeList)
    setStartNode('A')
    setCurrentStep(0)
    setCurrentNode(null)
    setVisitedNodes([])
    setQueue([])
    setTraversalResult([])
    setIsPlaying(false)
    generateSteps(graphStructure, 'A')
  }, [])

  // Generate BFS traversal steps
  const generateSteps = (graph, start) => {
    const steps = []
    const visited = new Set()
    const queue = [start]
    const result = []
    
    steps.push({
      type: 'initial',
      current: null,
      visited: [],
      queue: [start],
      result: [],
      description: `Starting BFS from node ${start}. Initialize queue with starting node.`
    })

    while (queue.length > 0) {
      const current = queue.shift()
      
      steps.push({
        type: 'dequeue',
        current: current,
        visited: Array.from(visited),
        queue: [...queue],
        result: [...result],
        description: `Dequeue node ${current} from the front of the queue.`
      })

      if (!visited.has(current)) {
        visited.add(current)
        result.push(current)
        
        steps.push({
          type: 'visit',
          current: current,
          visited: Array.from(visited),
          queue: [...queue],
          result: [...result],
          description: `Visit node ${current}. Mark as visited and add to result.`
        })

        // Add unvisited neighbors to queue
        const neighbors = graph[current] || []
        const unvisitedNeighbors = neighbors.filter(neighbor => !visited.has(neighbor) && !queue.includes(neighbor))
        
        unvisitedNeighbors.forEach(neighbor => {
          queue.push(neighbor)
        })

        if (unvisitedNeighbors.length > 0) {
          steps.push({
            type: 'enqueue',
            current: current,
            visited: Array.from(visited),
            queue: [...queue],
            result: [...result],
            description: `Add unvisited neighbors of ${current} to queue: [${unvisitedNeighbors.join(', ')}]`
          })
        } else {
          steps.push({
            type: 'no_neighbors',
            current: current,
            visited: Array.from(visited),
            queue: [...queue],
            result: [...result],
            description: `No unvisited neighbors for node ${current}.`
          })
        }
      } else {
        steps.push({
          type: 'already_visited',
          current: current,
          visited: Array.from(visited),
          queue: [...queue],
          result: [...result],
          description: `Node ${current} already visited. Skip.`
        })
      }
    }

    steps.push({
      type: 'complete',
      current: null,
      visited: Array.from(visited),
      queue: [],
      result: [...result],
      description: `BFS traversal complete! Visited nodes in order: [${result.join(' → ')}]`
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
      setCurrentNode(step.current)
      setVisitedNodes(step.visited)
      setQueue(step.queue)
      setTraversalResult(step.result)
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
    generateSteps(graph, nodeId)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const getNodeColor = (nodeId) => {
    if (nodeId === currentNode) return 'bg-yellow-500 border-yellow-400 text-black'
    if (visitedNodes.includes(nodeId)) return 'bg-green-500 border-green-400'
    if (queue.includes(nodeId)) return 'bg-blue-400 border-blue-300'
    return 'bg-gray-500 border-gray-400'
  }

  const renderGraph = () => {
    return (
      <div className="relative">
        <svg width="600" height="450" viewBox="0 0 600 450">
          {/* Render edges */}
          {edges.map(edge => {
            const fromNode = nodes.find(n => n.id === edge.from)
            const toNode = nodes.find(n => n.id === edge.to)
            if (!fromNode || !toNode) return null

            return (
              <line
                key={edge.id}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#6B7280"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            )
          })}

          {/* Render nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                className={`${getNodeColor(node.id)} transition-all duration-500 stroke-2 cursor-pointer`}
                onClick={() => handleStartNodeChange(node.id)}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="fill-white font-bold text-lg pointer-events-none"
              >
                {node.id}
              </text>
              
              {/* Show visit order for visited nodes */}
              {visitedNodes.includes(node.id) && (
                <text
                  x={node.x}
                  y={node.y - 35}
                  textAnchor="middle"
                  className="fill-yellow-400 font-bold text-sm"
                >
                  {traversalResult.indexOf(node.id) + 1}
                </text>
              )}
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
                  Graph BFS (Breadth-First Search)
                </h1>
                <p className="text-gray-400 text-sm">Level-by-level graph traversal using a queue</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaProjectDiagram className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Graph Algorithm</span>
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
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Starting Node
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

              {/* Queue State */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Queue State:</h3>
                <div className="bg-gray-800 rounded p-3">
                  {queue.length > 0 ? (
                    <div className="flex gap-2">
                      <span className="text-gray-400 text-sm">Front →</span>
                      {queue.map((node, index) => (
                        <span
                          key={`${node}-${index}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-bold"
                        >
                          {node}
                        </span>
                      ))}
                      <span className="text-gray-400 text-sm">← Back</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Empty</span>
                  )}
                </div>
              </div>

              {/* Traversal Result */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Traversal Result:</h3>
                <div className="bg-gray-800 rounded p-3">
                  {traversalResult.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {traversalResult.map((node, index) => (
                        <span
                          key={node}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold"
                        >
                          {node}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Empty</span>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Color Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Unvisited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">In Queue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Visited</span>
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

              {/* Graph Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  {renderGraph()}
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">
                  Click any node to set it as the starting point
                </p>
              </div>

              {/* BFS Pattern */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">BFS Pattern:</h3>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="px-3 py-2 bg-blue-600 text-white rounded">Use Queue (FIFO)</div>
                  <div className="text-yellow-400">→</div>
                  <div className="px-3 py-2 bg-purple-600 text-white rounded">Visit Level by Level</div>
                  <div className="text-yellow-400">→</div>
                  <div className="px-3 py-2 bg-green-600 text-white rounded">Shortest Path</div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start the BFS traversal'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Algorithm Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(V + E) - Visit all vertices and edges</p>
                  <p><strong>Space Complexity:</strong> O(V) - Queue and visited set</p>
                  <p><strong>Use Cases:</strong> Shortest path in unweighted graphs, level-order traversal</p>
                  <p><strong>Data Structure:</strong> Queue (FIFO - First In, First Out)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphBFS
