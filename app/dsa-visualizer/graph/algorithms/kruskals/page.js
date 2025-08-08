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
  FaWeight,
  FaLink
} from 'react-icons/fa'

const KruskalsAlgorithm = () => {
  const router = useRouter()
  const [graph, setGraph] = useState([])
  const [edges, setEdges] = useState([])
  const [sortedEdges, setSortedEdges] = useState([])
  const [mst, setMst] = useState([])
  const [currentEdge, setCurrentEdge] = useState(null)
  const [unionFind, setUnionFind] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [totalCost, setTotalCost] = useState(0)
  const [edgeIndex, setEdgeIndex] = useState(-1)

  // Union-Find data structure
  class UnionFind {
    constructor(nodes) {
      this.parent = {}
      this.rank = {}
      nodes.forEach(node => {
        this.parent[node.id] = node.id
        this.rank[node.id] = 0
      })
    }

    find(x) {
      if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]) // Path compression
      }
      return this.parent[x]
    }

    union(x, y) {
      const rootX = this.find(x)
      const rootY = this.find(y)

      if (rootX !== rootY) {
        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
          this.parent[rootX] = rootY
        } else if (this.rank[rootX] > this.rank[rootY]) {
          this.parent[rootY] = rootX
        } else {
          this.parent[rootY] = rootX
          this.rank[rootX]++
        }
        return true
      }
      return false
    }

    connected(x, y) {
      return this.find(x) === this.find(y)
    }

    getComponents() {
      const components = {}
      Object.keys(this.parent).forEach(node => {
        const root = this.find(parseInt(node))
        if (!components[root]) components[root] = []
        components[root].push(parseInt(node))
      })
      return components
    }
  }

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

    // Sort edges by weight
    const sorted = [...edgeList].sort((a, b) => a.weight - b.weight)

    setGraph(nodes)
    setEdges(edgeList)
    setSortedEdges(sorted)
    setMst([])
    setCurrentEdge(null)
    setCurrentStep(0)
    setIsPlaying(false)
    setTotalCost(0)
    setEdgeIndex(-1)
    generateSteps(nodes, sorted)
  }, [])

  // Kruskal's algorithm implementation
  const generateSteps = (nodes, sortedEdges) => {
    const steps = []
    const uf = new UnionFind(nodes)
    let mstEdges = []
    let cost = 0

    steps.push({
      type: 'initial',
      mst: [],
      currentEdge: null,
      unionFind: new UnionFind(nodes),
      totalCost: 0,
      edgeIndex: -1,
      description: `Starting Kruskal's algorithm. Edges sorted by weight: ${sortedEdges.map(e => `${nodes[e.from].label}-${nodes[e.to].label}(${e.weight})`).join(', ')}`
    })

    steps.push({
      type: 'sort_edges',
      mst: [],
      currentEdge: null,
      unionFind: new UnionFind(nodes),
      totalCost: 0,
      edgeIndex: -1,
      description: `Initialize Union-Find structure. Each node is initially its own component.`
    })

    sortedEdges.forEach((edge, index) => {
      steps.push({
        type: 'examine_edge',
        mst: [...mstEdges],
        currentEdge: edge,
        unionFind: { ...uf },
        totalCost: cost,
        edgeIndex: index,
        description: `Examining edge ${nodes[edge.from].label} → ${nodes[edge.to].label} (weight: ${edge.weight})`
      })

      const connected = uf.connected(edge.from, edge.to)
      
      if (connected) {
        steps.push({
          type: 'reject_edge',
          mst: [...mstEdges],
          currentEdge: edge,
          unionFind: { ...uf },
          totalCost: cost,
          edgeIndex: index,
          description: `Rejecting edge ${nodes[edge.from].label} → ${nodes[edge.to].label}: would create cycle (nodes already connected)`
        })
      } else {
        uf.union(edge.from, edge.to)
        mstEdges.push(edge)
        cost += edge.weight

        steps.push({
          type: 'accept_edge',
          mst: [...mstEdges],
          currentEdge: edge,
          unionFind: { ...uf },
          totalCost: cost,
          edgeIndex: index,
          description: `Accepting edge ${nodes[edge.from].label} → ${nodes[edge.to].label}. Union components. Total cost: ${cost}`
        })
      }

      if (mstEdges.length === nodes.length - 1) {
        steps.push({
          type: 'early_termination',
          mst: [...mstEdges],
          currentEdge: null,
          unionFind: { ...uf },
          totalCost: cost,
          edgeIndex: index,
          description: `MST complete with ${mstEdges.length} edges! Early termination - no need to check remaining edges.`
        })
        return
      }
    })

    if (mstEdges.length < nodes.length - 1) {
      steps.push({
        type: 'incomplete',
        mst: [...mstEdges],
        currentEdge: null,
        unionFind: { ...uf },
        totalCost: cost,
        edgeIndex: sortedEdges.length,
        description: `Graph is not connected - MST incomplete with only ${mstEdges.length} edges.`
      })
    } else {
      steps.push({
        type: 'complete',
        mst: [...mstEdges],
        currentEdge: null,
        unionFind: { ...uf },
        totalCost: cost,
        edgeIndex: sortedEdges.length,
        description: `Kruskal's algorithm complete! MST contains ${mstEdges.length} edges with total cost ${cost}.`
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
      setMst(step.mst)
      setCurrentEdge(step.currentEdge)
      setUnionFind(step.unionFind)
      setTotalCost(step.totalCost)
      setEdgeIndex(step.edgeIndex)
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
    if (!unionFind.parent) return 'fill-blue-500 stroke-blue-400'
    
    // Color nodes by their component
    const root = unionFind.find ? unionFind.find(nodeId) : nodeId
    const colors = {
      0: 'fill-red-500 stroke-red-400',
      1: 'fill-green-500 stroke-green-400', 
      2: 'fill-blue-500 stroke-blue-400',
      3: 'fill-yellow-500 stroke-yellow-400',
      4: 'fill-purple-500 stroke-purple-400'
    }
    return colors[root] || 'fill-gray-500 stroke-gray-400'
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
                  Kruskal's Algorithm
                </h1>
                <p className="text-gray-400 text-sm">Minimum Spanning Tree using Union-Find</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaLink className="w-5 h-5 text-purple-400" />
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
                    <span className="text-gray-300">Edge Examined:</span>
                    <span className="text-white font-bold">{edgeIndex >= 0 ? edgeIndex + 1 : 0}/{sortedEdges.length}</span>
                  </div>
                </div>
              </div>

              {/* Union-Find Status */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                  <FaLink className="w-4 h-4" />
                  Union-Find Components
                </h3>
                <div className="space-y-2 text-sm">
                  {unionFind.getComponents && Object.entries(unionFind.getComponents()).map(([root, nodes]) => (
                    <div key={root} className="flex items-center justify-between">
                      <span className="text-gray-300">Component {root}:</span>
                      <span className="text-white font-bold">
                        {nodes.map(nodeId => graph[nodeId]?.label).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Component 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Component 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Component 3</span>
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

              {/* Sorted Edges */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Edges Sorted by Weight</h3>
                <div className="flex flex-wrap gap-2">
                  {sortedEdges.map((edge, index) => {
                    let bgColor = 'bg-gray-600'
                    if (index === edgeIndex) bgColor = 'bg-yellow-500 text-black animate-pulse'
                    else if (index < edgeIndex) {
                      const isInMST = mst.some(mstEdge => 
                        (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
                        (mstEdge.from === edge.to && mstEdge.to === edge.from)
                      )
                      bgColor = isInMST ? 'bg-green-600' : 'bg-red-600'
                    }
                    
                    return (
                      <div
                        key={`${edge.from}-${edge.to}`}
                        className={`${bgColor} text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300`}
                      >
                        {graph[edge.from]?.label}-{graph[edge.to]?.label} ({edge.weight})
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  <span className="text-yellow-400">●</span> Current
                  <span className="text-green-400 ml-3">●</span> Accepted
                  <span className="text-red-400 ml-3">●</span> Rejected
                  <span className="text-gray-400 ml-3">●</span> Not yet examined
                </p>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start Kruskal\'s algorithm'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Kruskal's Algorithm Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(E log E) for sorting edges</p>
                  <p><strong>Space Complexity:</strong> O(V) for Union-Find structure</p>
                  <p><strong>Type:</strong> Greedy algorithm for MST</p>
                  <p><strong>Approach:</strong> Process edges in ascending weight order</p>
                  <p><strong>Key Insight:</strong> Use Union-Find to detect cycles efficiently</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KruskalsAlgorithm
