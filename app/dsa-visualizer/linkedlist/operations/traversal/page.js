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
  FaArrowRight
} from 'react-icons/fa'

const LinkedListTraversal = () => {
  const router = useRouter()
  const [linkedList, setLinkedList] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentNode, setCurrentNode] = useState(-1)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [listSize, setListSize] = useState(6)

  // Generate random linked list
  const generateLinkedList = useCallback(() => {
    const newList = Array.from({ length: listSize }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 90) + 10,
      next: i < listSize - 1 ? i + 1 : null
    }))
    
    setLinkedList(newList)
    setCurrentStep(0)
    setCurrentNode(-1)
    setVisitedNodes([])
    setIsPlaying(false)
    generateSteps(newList)
  }, [listSize])

  // Generate traversal steps
  const generateSteps = (list) => {
    const steps = []
    
    steps.push({
      type: 'initial',
      current: -1,
      visited: [],
      description: 'Starting linked list traversal. We will visit each node from head to tail.'
    })

    // Traverse the linked list
    list.forEach((node, index) => {
      steps.push({
        type: 'visit',
        current: index,
        visited: Array.from({ length: index }, (_, i) => i),
        description: `Visiting node ${index} with value ${node.value}. ${node.next !== null ? `Next node is at position ${node.next}` : 'This is the last node (tail)'}`
      })

      if (node.next !== null) {
        steps.push({
          type: 'move',
          current: index,
          visited: Array.from({ length: index + 1 }, (_, i) => i),
          description: `Moving from node ${index} to node ${node.next} using the next pointer`
        })
      }
    })

    steps.push({
      type: 'complete',
      current: -1,
      visited: Array.from({ length: list.length }, (_, i) => i),
      description: 'Traversal complete! All nodes have been visited.'
    })

    setSteps(steps)
  }

  // Initialize
  useEffect(() => {
    generateLinkedList()
  }, [generateLinkedList])

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

  const getNodeColor = (index) => {
    if (index === currentNode) return 'bg-yellow-500 border-yellow-400'
    if (visitedNodes.includes(index)) return 'bg-green-500 border-green-400'
    return 'bg-blue-500 border-blue-400'
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
                  Linked List Traversal
                </h1>
                <p className="text-gray-400 text-sm">O(n) sequential access data structure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaArrowRight className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Node Traversal</span>
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
                  onClick={generateLinkedList}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Generate New List
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

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    List Size: {listSize}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="8"
                    value={listSize}
                    onChange={(e) => setListSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Color Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-300">Unvisited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
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
                <h2 className="text-xl font-semibold text-white">Linked List Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Linked List Visualization */}
              <div className="bg-gray-900 rounded-lg p-8 overflow-x-auto">
                <div className="flex items-center justify-center space-x-4 min-w-max">
                  <div className="text-green-400 font-bold">HEAD</div>
                  <FaArrowRight className="text-green-400" />
                  
                  {linkedList.map((node, index) => (
                    <React.Fragment key={node.id}>
                      <div className={`flex items-center border-2 rounded-lg ${getNodeColor(index)} transition-all duration-500`}>
                        <div className="px-6 py-4 text-white font-bold">
                          {node.value}
                        </div>
                        <div className="border-l-2 border-current px-3 py-4 text-white text-sm">
                          {node.next !== null ? '→' : 'NULL'}
                        </div>
                      </div>
                      
                      {node.next !== null && (
                        <FaArrowRight className="text-blue-400" />
                      )}
                      
                      {node.next === null && (
                        <>
                          <FaArrowRight className="text-red-400" />
                          <div className="text-red-400 font-bold">NULL</div>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Node index labels */}
                <div className="flex items-center justify-center space-x-4 min-w-max mt-4">
                  <div className="w-12"></div>
                  <div className="w-4"></div>
                  {linkedList.map((_, index) => (
                    <React.Fragment key={index}>
                      <div className="text-gray-400 text-sm text-center w-20">
                        Node {index}
                      </div>
                      {index < linkedList.length - 1 && <div className="w-4"></div>}
                    </React.Fragment>
                  ))}
                  <div className="w-4"></div>
                  <div className="w-12"></div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start the traversal'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Linked List Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(n) - Must traverse sequentially</p>
                  <p><strong>Space Complexity:</strong> O(1) - Only need current pointer</p>
                  <p><strong>Access:</strong> Sequential only, no random access like arrays</p>
                  <p><strong>Structure:</strong> Each node contains data and a pointer to the next node</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkedListTraversal
