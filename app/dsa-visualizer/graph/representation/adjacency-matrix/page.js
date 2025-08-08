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
  FaTh,
  FaPlus,
  FaMinus
} from 'react-icons/fa'

const AdjacencyMatrix = () => {
  const router = useRouter()
  const [graph, setGraph] = useState({})
  const [nodes, setNodes] = useState([])
  const [matrix, setMatrix] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [isDirected, setIsDirected] = useState(false)
  const [isWeighted, setIsWeighted] = useState(false)
  const [selectedCell, setSelectedCell] = useState({ row: -1, col: -1 })
  const [newWeight, setNewWeight] = useState('1')

  // Generate sample graph
  const generateGraph = useCallback(() => {
    const nodeList = ['A', 'B', 'C', 'D']
    const edges = isDirected 
      ? [
          { from: 'A', to: 'B', weight: isWeighted ? 4 : 1 },
          { from: 'A', to: 'C', weight: isWeighted ? 2 : 1 },
          { from: 'B', to: 'C', weight: isWeighted ? 3 : 1 },
          { from: 'B', to: 'D', weight: isWeighted ? 5 : 1 },
          { from: 'C', to: 'D', weight: isWeighted ? 1 : 1 }
        ]
      : [
          { from: 'A', to: 'B', weight: isWeighted ? 4 : 1 },
          { from: 'A', to: 'C', weight: isWeighted ? 2 : 1 },
          { from: 'B', to: 'C', weight: isWeighted ? 3 : 1 },
          { from: 'C', to: 'D', weight: isWeighted ? 5 : 1 }
        ]

    // Create adjacency matrix
    const size = nodeList.length
    const newMatrix = Array(size).fill(null).map(() => Array(size).fill(0))
    
    edges.forEach(edge => {
      const fromIndex = nodeList.indexOf(edge.from)
      const toIndex = nodeList.indexOf(edge.to)
      
      newMatrix[fromIndex][toIndex] = edge.weight
      if (!isDirected) {
        newMatrix[toIndex][fromIndex] = edge.weight
      }
    })

    setNodes(nodeList)
    setMatrix(newMatrix)
    setCurrentStep(0)
    setIsPlaying(false)
    generateSteps(nodeList, newMatrix, edges)
  }, [isDirected, isWeighted])

  // Generate construction steps
  const generateSteps = (nodeList, finalMatrix, edges) => {
    const steps = []
    const size = nodeList.length
    let currentMatrix = Array(size).fill(null).map(() => Array(size).fill(0))
    
    steps.push({
      type: 'initial',
      matrix: currentMatrix.map(row => [...row]),
      description: `Initialize ${size}x${size} adjacency matrix with all zeros. Rows and columns represent vertices.`,
      highlightCell: null
    })

    edges.forEach((edge, index) => {
      const fromIndex = nodeList.indexOf(edge.from)
      const toIndex = nodeList.indexOf(edge.to)
      
      // Add edge
      currentMatrix[fromIndex][toIndex] = edge.weight
      steps.push({
        type: 'add_edge',
        matrix: currentMatrix.map(row => [...row]),
        description: `Add edge ${edge.from} → ${edge.to} ${isWeighted ? `(weight: ${edge.weight})` : ''}. Set matrix[${fromIndex}][${toIndex}] = ${edge.weight}`,
        highlightCell: { row: fromIndex, col: toIndex }
      })

      // Add reverse edge for undirected graph
      if (!isDirected) {
        currentMatrix[toIndex][fromIndex] = edge.weight
        steps.push({
          type: 'add_reverse',
          matrix: currentMatrix.map(row => [...row]),
          description: `Since graph is undirected, also set matrix[${toIndex}][${fromIndex}] = ${edge.weight}`,
          highlightCell: { row: toIndex, col: fromIndex }
        })
      }
    })

    steps.push({
      type: 'complete',
      matrix: currentMatrix.map(row => [...row]),
      description: `Adjacency matrix construction complete! Matrix shows ${isDirected ? 'directed' : 'undirected'} ${isWeighted ? 'weighted' : 'unweighted'} graph relationships.`,
      highlightCell: null
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

  // Manual matrix editing
  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col })
  }

  const updateCell = () => {
    if (selectedCell.row >= 0 && selectedCell.col >= 0) {
      const newMatrix = matrix.map(row => [...row])
      const weight = parseInt(newWeight) || 0
      newMatrix[selectedCell.row][selectedCell.col] = weight
      
      // Update reverse edge for undirected graph
      if (!isDirected && selectedCell.row !== selectedCell.col) {
        newMatrix[selectedCell.col][selectedCell.row] = weight
      }
      
      setMatrix(newMatrix)
      setSelectedCell({ row: -1, col: -1 })
    }
  }

  const clearCell = () => {
    if (selectedCell.row >= 0 && selectedCell.col >= 0) {
      const newMatrix = matrix.map(row => [...row])
      newMatrix[selectedCell.row][selectedCell.col] = 0
      
      // Clear reverse edge for undirected graph
      if (!isDirected && selectedCell.row !== selectedCell.col) {
        newMatrix[selectedCell.col][selectedCell.row] = 0
      }
      
      setMatrix(newMatrix)
      setSelectedCell({ row: -1, col: -1 })
    }
  }

  const getCellColor = (row, col, value) => {
    const currentMatrix = steps[currentStep]?.matrix || matrix
    const highlightCell = steps[currentStep]?.highlightCell
    
    if (highlightCell && highlightCell.row === row && highlightCell.col === col) {
      return 'bg-yellow-400 text-black font-bold animate-pulse'
    }
    if (selectedCell.row === row && selectedCell.col === col) {
      return 'bg-blue-500 text-white font-bold ring-2 ring-blue-300'
    }
    if (row === col) {
      return 'bg-gray-600 text-gray-300' // Diagonal
    }
    if (value > 0) {
      return isWeighted 
        ? `bg-green-500 text-white font-bold` 
        : 'bg-green-500 text-white font-bold'
    }
    return 'bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer'
  }

  const renderMatrix = () => {
    const displayMatrix = steps.length > 0 ? (steps[currentStep]?.matrix || matrix) : matrix
    
    return (
      <div className="flex flex-col items-center space-y-2">
        {/* Column headers */}
        <div className="flex space-x-2">
          <div className="w-12 h-12"></div>
          {nodes.map(node => (
            <div key={node} className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white font-bold rounded">
              {node}
            </div>
          ))}
        </div>
        
        {/* Matrix rows */}
        {displayMatrix.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-2">
            {/* Row header */}
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white font-bold rounded">
              {nodes[rowIndex]}
            </div>
            
            {/* Matrix cells */}
            {row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-12 h-12 flex items-center justify-center rounded border-2 border-gray-600 transition-all duration-300 ${getCellColor(rowIndex, colIndex, value)}`}
                onClick={() => !isPlaying && handleCellClick(rowIndex, colIndex)}
              >
                {value === 0 ? '0' : value}
              </div>
            ))}
          </div>
        ))}
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
                  Adjacency Matrix Representation
                </h1>
                <p className="text-gray-400 text-sm">2D matrix representation of graph connections</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaTh className="w-5 h-5 text-blue-400" />
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

              {/* Manual Editing */}
              {selectedCell.row >= 0 && selectedCell.col >= 0 && (
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">
                    Edit Cell [{nodes[selectedCell.row]}][{nodes[selectedCell.col]}]
                  </h3>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="number"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="flex-1 bg-gray-600 border border-gray-500 text-white px-2 py-1 rounded text-sm"
                      placeholder="Weight"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={updateCell}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <FaPlus className="w-3 h-3" />
                      Set
                    </button>
                    <button
                      onClick={clearCell}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <FaMinus className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Matrix Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-800 rounded border border-gray-600"></div>
                    <span className="text-gray-300">No Edge (0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-300">Edge Exists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span className="text-gray-300">Diagonal (Self-Loop)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-gray-300">Current Addition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Adjacency Matrix</h2>
                <div className="text-gray-300 text-sm">
                  {steps.length > 0 ? `Step ${currentStep + 1} of ${steps.length}` : 'Interactive Mode'}
                </div>
              </div>

              {/* Matrix Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  {renderMatrix()}
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">
                  Click any cell to edit the connection (interactive mode)
                </p>
              </div>

              {/* Matrix Properties */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Matrix Properties:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Graph Type:</div>
                    <div className="text-white font-bold">{isDirected ? 'Directed' : 'Undirected'}</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Edge Weights:</div>
                    <div className="text-white font-bold">{isWeighted ? 'Weighted' : 'Unweighted'}</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Matrix Size:</div>
                    <div className="text-white font-bold">{nodes.length}×{nodes.length}</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-gray-300">Symmetry:</div>
                    <div className="text-white font-bold">{isDirected ? 'Asymmetric' : 'Symmetric'}</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start the matrix construction demo'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Adjacency Matrix Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Space Complexity:</strong> O(V²) - Always uses V×V matrix</p>
                  <p><strong>Edge Lookup:</strong> O(1) - Direct array access</p>
                  <p><strong>Add Edge:</strong> O(1) - Single assignment</p>
                  <p><strong>Best For:</strong> Dense graphs, frequent edge queries</p>
                  <p><strong>Drawback:</strong> Wastes space for sparse graphs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdjacencyMatrix
