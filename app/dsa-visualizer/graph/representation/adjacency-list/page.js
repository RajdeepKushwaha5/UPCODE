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
  FaList,
  FaArrowRight,
  FaPlus,
  FaMinus
} from 'react-icons/fa'

const AdjacencyList = () => {
  const router = useRouter()
  const [adjacencyList, setAdjacencyList] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [isDirected, setIsDirected] = useState(false)
  const [isWeighted, setIsWeighted] = useState(false)
  const [highlightedEdge, setHighlightedEdge] = useState(null)
  const [selectedNode, setSelectedNode] = useState('')
  const [targetNode, setTargetNode] = useState('')
  const [edgeWeight, setEdgeWeight] = useState('1')

  // Generate sample graph
  const generateGraph = useCallback(() => {
    const edges = isDirected 
      ? [
          { from: 'A', to: 'B', weight: isWeighted ? 4 : 1 },
          { from: 'A', to: 'C', weight: isWeighted ? 2 : 1 },
          { from: 'B', to: 'C', weight: isWeighted ? 3 : 1 },
          { from: 'B', to: 'D', weight: isWeighted ? 5 : 1 },
          { from: 'C', to: 'D', weight: isWeighted ? 1 : 1 },
          { from: 'D', to: 'A', weight: isWeighted ? 6 : 1 }
        ]
      : [
          { from: 'A', to: 'B', weight: isWeighted ? 4 : 1 },
          { from: 'A', to: 'C', weight: isWeighted ? 2 : 1 },
          { from: 'B', to: 'C', weight: isWeighted ? 3 : 1 },
          { from: 'C', to: 'D', weight: isWeighted ? 5 : 1 },
          { from: 'B', to: 'D', weight: isWeighted ? 7 : 1 }
        ]

    // Initialize empty adjacency list
    const nodes = ['A', 'B', 'C', 'D']
    const newAdjList = {}
    nodes.forEach(node => {
      newAdjList[node] = []
    })

    // Add edges to adjacency list
    edges.forEach(edge => {
      const edgeData = isWeighted ? { node: edge.to, weight: edge.weight } : edge.to
      newAdjList[edge.from].push(edgeData)
      
      if (!isDirected) {
        const reverseEdgeData = isWeighted ? { node: edge.from, weight: edge.weight } : edge.from
        newAdjList[edge.to].push(reverseEdgeData)
      }
    })

    setAdjacencyList(newAdjList)
    setCurrentStep(0)
    setIsPlaying(false)
    setHighlightedEdge(null)
    generateSteps(nodes, edges)
  }, [isDirected, isWeighted])

  // Generate construction steps
  const generateSteps = (nodes, edges) => {
    const steps = []
    let currentList = {}
    
    // Initialize with empty lists
    nodes.forEach(node => {
      currentList[node] = []
    })
    
    steps.push({
      type: 'initial',
      adjacencyList: JSON.parse(JSON.stringify(currentList)),
      description: `Initialize empty adjacency list for nodes: ${nodes.join(', ')}. Each node starts with an empty list.`,
      highlightedEdge: null
    })

    edges.forEach((edge, index) => {
      // Add edge from source to target
      const edgeData = isWeighted ? { node: edge.to, weight: edge.weight } : edge.to
      currentList[edge.from].push(edgeData)
      
      steps.push({
        type: 'add_edge',
        adjacencyList: JSON.parse(JSON.stringify(currentList)),
        description: `Add edge ${edge.from} → ${edge.to} ${isWeighted ? `(weight: ${edge.weight})` : ''}. Add '${edge.to}' to ${edge.from}'s adjacency list.`,
        highlightedEdge: { from: edge.from, to: edge.to }
      })

      // Add reverse edge for undirected graph
      if (!isDirected) {
        const reverseEdgeData = isWeighted ? { node: edge.from, weight: edge.weight } : edge.from
        currentList[edge.to].push(reverseEdgeData)
        
        steps.push({
          type: 'add_reverse',
          adjacencyList: JSON.parse(JSON.stringify(currentList)),
          description: `Since graph is undirected, also add '${edge.from}' to ${edge.to}'s adjacency list.`,
          highlightedEdge: { from: edge.to, to: edge.from }
        })
      }
    })

    steps.push({
      type: 'complete',
      adjacencyList: JSON.parse(JSON.stringify(currentList)),
      description: `Adjacency list construction complete! Each node's list contains its ${isDirected ? 'outgoing' : 'adjacent'} neighbors.`,
      highlightedEdge: null
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

  // Update highlight based on current step
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setHighlightedEdge(step.highlightedEdge)
    }
  }, [currentStep, steps])

  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)
  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setHighlightedEdge(null)
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

  // Manual edge operations
  const addEdge = () => {
    if (selectedNode && targetNode) {
      const newList = JSON.parse(JSON.stringify(adjacencyList))
      const weight = parseInt(edgeWeight) || 1
      
      // Check if edge already exists
      const edgeExists = newList[selectedNode]?.some(neighbor => 
        typeof neighbor === 'string' ? neighbor === targetNode : neighbor.node === targetNode
      )
      
      if (!edgeExists) {
        if (!newList[selectedNode]) newList[selectedNode] = []
        if (!newList[targetNode]) newList[targetNode] = []
        
        const edgeData = isWeighted ? { node: targetNode, weight } : targetNode
        newList[selectedNode].push(edgeData)
        
        if (!isDirected && selectedNode !== targetNode) {
          const reverseEdgeData = isWeighted ? { node: selectedNode, weight } : selectedNode
          newList[targetNode].push(reverseEdgeData)
        }
        
        setAdjacencyList(newList)
      }
      
      setSelectedNode('')
      setTargetNode('')
    }
  }

  const removeEdge = () => {
    if (selectedNode && targetNode) {
      const newList = JSON.parse(JSON.stringify(adjacencyList))
      
      if (newList[selectedNode]) {
        newList[selectedNode] = newList[selectedNode].filter(neighbor => 
          typeof neighbor === 'string' ? neighbor !== targetNode : neighbor.node !== targetNode
        )
        
        if (!isDirected && newList[targetNode]) {
          newList[targetNode] = newList[targetNode].filter(neighbor => 
            typeof neighbor === 'string' ? neighbor !== selectedNode : neighbor.node !== selectedNode
          )
        }
        
        setAdjacencyList(newList)
      }
      
      setSelectedNode('')
      setTargetNode('')
    }
  }

  const getHighlightColor = (from, to) => {
    if (highlightedEdge && highlightedEdge.from === from && highlightedEdge.to === to) {
      return 'bg-yellow-400 text-black animate-pulse'
    }
    return 'bg-blue-600 hover:bg-blue-700'
  }

  const renderAdjacencyList = () => {
    const displayList = steps.length > 0 ? (steps[currentStep]?.adjacencyList || adjacencyList) : adjacencyList
    
    return (
      <div className="space-y-4">
        {Object.entries(displayList).map(([node, neighbors]) => (
          <div key={node} className="bg-gray-800 rounded-lg border border-gray-600 p-4">
            <div className="flex items-center space-x-4">
              {/* Node */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {node}
                </div>
              </div>
              
              {/* Arrow */}
              <FaArrowRight className="text-gray-400 flex-shrink-0" />
              
              {/* Adjacency List */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {neighbors.length === 0 ? (
                  <div className="text-gray-500 italic">Empty</div>
                ) : (
                  neighbors.map((neighbor, index) => {
                    const targetNode = typeof neighbor === 'string' ? neighbor : neighbor.node
                    const weight = typeof neighbor === 'object' ? neighbor.weight : null
                    
                    return (
                      <React.Fragment key={index}>
                        <div className={`px-3 py-2 rounded-lg text-white font-medium transition-colors ${getHighlightColor(node, targetNode)}`}>
                          {targetNode}{weight && ` (${weight})`}
                        </div>
                        {index < neighbors.length - 1 && (
                          <FaArrowRight className="text-gray-500" />
                        )}
                      </React.Fragment>
                    )
                  })
                )}
                
                {neighbors.length === 0 && (
                  <div className="w-16 h-8 bg-gray-700 rounded border-2 border-dashed border-gray-500 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">NULL</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const allNodes = Object.keys(adjacencyList).sort()

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
                  Adjacency List Representation
                </h1>
                <p className="text-gray-400 text-sm">Space-efficient linked list representation of graph</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaList className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Graph Representation</span>
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
              
              {/* Graph Settings */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-sm font-medium">Directed Graph</label>
                  <button
                    onClick={() => setIsDirected(!isDirected)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isDirected ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isDirected ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-sm font-medium">Weighted Graph</label>
                  <button
                    onClick={() => setIsWeighted(!isWeighted)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isWeighted ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isWeighted ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
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
                  Generate New Graph
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

              {/* Manual Edge Operations */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Manual Operations</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-300 text-xs mb-1">From Node</label>
                    <select
                      value={selectedNode}
                      onChange={(e) => setSelectedNode(e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 text-white px-2 py-1 rounded text-sm"
                    >
                      <option value="">Select...</option>
                      {allNodes.map(node => (
                        <option key={node} value={node}>{node}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-xs mb-1">To Node</label>
                    <select
                      value={targetNode}
                      onChange={(e) => setTargetNode(e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 text-white px-2 py-1 rounded text-sm"
                    >
                      <option value="">Select...</option>
                      {allNodes.map(node => (
                        <option key={node} value={node}>{node}</option>
                      ))}
                    </select>
                  </div>
                  
                  {isWeighted && (
                    <div>
                      <label className="block text-gray-300 text-xs mb-1">Weight</label>
                      <input
                        type="number"
                        value={edgeWeight}
                        onChange={(e) => setEdgeWeight(e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 text-white px-2 py-1 rounded text-sm"
                        placeholder="1"
                      />
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={addEdge}
                      disabled={!selectedNode || !targetNode}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <FaPlus className="w-3 h-3" />
                      Add
                    </button>
                    <button
                      onClick={removeEdge}
                      disabled={!selectedNode || !targetNode}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <FaMinus className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">List Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-300">Source Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-gray-300">Adjacent Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-gray-300">Current Addition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded border border-dashed border-gray-500"></div>
                    <span className="text-gray-300">Empty List</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Adjacency List</h2>
                <div className="text-gray-300 text-sm">
                  {steps.length > 0 ? `Step ${currentStep + 1} of ${steps.length}` : 'Interactive Mode'}
                </div>
              </div>

              {/* Adjacency List Visualization */}
              <div className="bg-gray-900 rounded-lg p-6">
                {renderAdjacencyList()}
              </div>

              {/* List Statistics */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">List Statistics:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Total Nodes:</div>
                    <div className="text-white font-bold">{Object.keys(adjacencyList).length}</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Total Edges:</div>
                    <div className="text-white font-bold">
                      {Object.values(adjacencyList).reduce((sum, list) => sum + list.length, 0) / (isDirected ? 1 : 2)}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Graph Type:</div>
                    <div className="text-white font-bold">{isDirected ? 'Directed' : 'Undirected'}</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Weighted:</div>
                    <div className="text-white font-bold">{isWeighted ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start the adjacency list construction demo'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Adjacency List Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Space Complexity:</strong> O(V + E) - Only stores existing edges</p>
                  <p><strong>Edge Lookup:</strong> O(degree) - Must search through neighbor list</p>
                  <p><strong>Add Edge:</strong> O(1) - Add to end of list</p>
                  <p><strong>Best For:</strong> Sparse graphs, traversal algorithms</p>
                  <p><strong>Advantage:</strong> Space efficient, fast iteration over neighbors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdjacencyList
