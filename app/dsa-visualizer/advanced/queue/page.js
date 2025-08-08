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
  FaStream,
  FaPlus,
  FaMinus
} from 'react-icons/fa'

const QueueVisualization = () => {
  const router = useRouter()
  const [queue, setQueue] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [newElement, setNewElement] = useState('')
  const [isManualMode, setIsManualMode] = useState(true)
  const [maxSize, setMaxSize] = useState(8)
  const [currentOperation, setCurrentOperation] = useState('')
  const [frontIndex, setFrontIndex] = useState(0)
  const [rearIndex, setRearIndex] = useState(-1)

  // Generate demo operations
  const generateDemoOperations = useCallback(() => {
    const operations = [
      { type: 'enqueue', value: 10 },
      { type: 'enqueue', value: 20 },
      { type: 'enqueue', value: 30 },
      { type: 'front' },
      { type: 'enqueue', value: 40 },
      { type: 'dequeue' },
      { type: 'dequeue' },
      { type: 'enqueue', value: 50 },
      { type: 'front' },
      { type: 'enqueue', value: 60 },
      { type: 'dequeue' },
      { type: 'dequeue' },
      { type: 'dequeue' },
      { type: 'dequeue' }
    ]

    const steps = []
    let currentQueue = []

    steps.push({
      type: 'initial',
      queue: [...currentQueue],
      operation: '',
      description: 'Queue initialized. Queue follows FIFO (First In, First Out) principle.',
      result: null,
      frontIndex: 0,
      rearIndex: -1
    })

    operations.forEach((op, index) => {
      if (op.type === 'enqueue') {
        if (currentQueue.length < maxSize) {
          currentQueue.push(op.value)
          steps.push({
            type: 'enqueue',
            queue: [...currentQueue],
            operation: `Enqueue ${op.value}`,
            description: `Enqueue ${op.value} at the rear of the queue.`,
            result: `Enqueued ${op.value}`,
            frontIndex: 0,
            rearIndex: currentQueue.length - 1
          })
        } else {
          steps.push({
            type: 'overflow',
            queue: [...currentQueue],
            operation: `Enqueue ${op.value}`,
            description: `Cannot enqueue ${op.value}. Queue overflow - maximum size (${maxSize}) reached.`,
            result: 'Queue Overflow',
            frontIndex: 0,
            rearIndex: currentQueue.length - 1
          })
        }
      } else if (op.type === 'dequeue') {
        if (currentQueue.length > 0) {
          const dequeuedValue = currentQueue.shift()
          steps.push({
            type: 'dequeue',
            queue: [...currentQueue],
            operation: 'Dequeue',
            description: `Dequeue the front element (${dequeuedValue}) from the queue.`,
            result: `Dequeued ${dequeuedValue}`,
            frontIndex: 0,
            rearIndex: Math.max(-1, currentQueue.length - 1)
          })
        } else {
          steps.push({
            type: 'underflow',
            queue: [...currentQueue],
            operation: 'Dequeue',
            description: 'Cannot dequeue from an empty queue. Queue underflow.',
            result: 'Queue Underflow',
            frontIndex: 0,
            rearIndex: -1
          })
        }
      } else if (op.type === 'front') {
        if (currentQueue.length > 0) {
          const frontValue = currentQueue[0]
          steps.push({
            type: 'front',
            queue: [...currentQueue],
            operation: 'Front',
            description: `Peek at the front element without removing it.`,
            result: `Front: ${frontValue}`,
            frontIndex: 0,
            rearIndex: currentQueue.length - 1
          })
        } else {
          steps.push({
            type: 'front_empty',
            queue: [...currentQueue],
            operation: 'Front',
            description: 'Cannot peek at empty queue.',
            result: 'Queue Empty',
            frontIndex: 0,
            rearIndex: -1
          })
        }
      }
    })

    steps.push({
      type: 'complete',
      queue: [...currentQueue],
      operation: '',
      description: 'Demo complete! Queue operations demonstrated.',
      result: null,
      frontIndex: 0,
      rearIndex: Math.max(-1, currentQueue.length - 1)
    })

    setSteps(steps)
    setQueue([])
    setFrontIndex(0)
    setRearIndex(-1)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [maxSize])

  // Manual operations
  const enqueueElement = () => {
    if (!newElement.trim()) return
    if (queue.length >= maxSize) {
      setCurrentOperation('Queue Overflow - Maximum size reached!')
      return
    }
    
    const value = parseInt(newElement) || newElement
    const newQueue = [...queue, value]
    setQueue(newQueue)
    setRearIndex(newQueue.length - 1)
    setCurrentOperation(`Enqueued ${value}`)
    setNewElement('')
  }

  const dequeueElement = () => {
    if (queue.length === 0) {
      setCurrentOperation('Queue Underflow - Queue is empty!')
      return
    }
    
    const dequeuedValue = queue[0]
    const newQueue = queue.slice(1)
    setQueue(newQueue)
    setRearIndex(Math.max(-1, newQueue.length - 1))
    setCurrentOperation(`Dequeued ${dequeuedValue}`)
  }

  const frontElement = () => {
    if (queue.length === 0) {
      setCurrentOperation('Queue is empty!')
      return
    }
    
    const frontValue = queue[0]
    setCurrentOperation(`Front element: ${frontValue}`)
  }

  const clearQueue = () => {
    setQueue([])
    setFrontIndex(0)
    setRearIndex(-1)
    setCurrentOperation('Queue cleared')
  }

  // Initialize
  useEffect(() => {
    generateDemoOperations()
  }, [generateDemoOperations])

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
    if (!isManualMode && steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setQueue(step.queue)
      setFrontIndex(step.frontIndex)
      setRearIndex(step.rearIndex)
      setCurrentOperation(step.result || '')
    }
  }, [currentStep, steps, isManualMode])

  const play = () => {
    setIsManualMode(false)
    setIsPlaying(true)
  }
  const pause = () => setIsPlaying(false)
  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    if (!isManualMode) {
      setQueue([])
      setFrontIndex(0)
      setRearIndex(-1)
      setCurrentOperation('')
    }
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

  const switchToManual = () => {
    setIsManualMode(true)
    setIsPlaying(false)
    setCurrentOperation('')
  }

  const renderQueue = () => {
    const displayQueue = isManualMode ? queue : (steps[currentStep]?.queue || [])
    const displayFront = isManualMode ? frontIndex : (steps[currentStep]?.frontIndex || 0)
    const displayRear = isManualMode ? rearIndex : (steps[currentStep]?.rearIndex || -1)
    
    return (
      <div className="flex flex-col items-center">
        {/* Front indicator */}
        <div className="text-gray-300 mb-4 flex items-center">
          <span className="font-bold mr-4">FRONT</span>
          <div className="w-8 h-0 border-b-2 border-gray-300"></div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-gray-300"></div>
        </div>
        
        <div className="flex items-center space-x-4 min-w-max min-h-[200px]">
          {displayQueue.length === 0 ? (
            <div className="text-gray-500 italic text-center py-8 px-16 border-2 border-dashed border-gray-600 rounded-lg">
              Queue is empty
            </div>
          ) : (
            displayQueue.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={`w-20 h-16 flex items-center justify-center text-white font-bold text-lg rounded-lg border-2 transition-all duration-500 ${
                  index === 0 
                    ? 'bg-green-500 border-green-400 transform scale-105' 
                    : index === displayQueue.length - 1
                    ? 'bg-yellow-500 border-yellow-400 text-black'
                    : 'bg-blue-500 border-blue-400'
                }`}
              >
                {item}
              </div>
            ))
          )}
        </div>
        
        {/* Rear indicator */}
        <div className="text-gray-300 mt-4 flex items-center">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-300"></div>
          <div className="w-8 h-0 border-t-2 border-gray-300"></div>
          <span className="font-bold ml-4">REAR</span>
        </div>
        
        <div className="text-sm text-gray-500 mt-4">
          Size: {displayQueue.length} / {maxSize}
        </div>
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
                  Queue Data Structure
                </h1>
                <p className="text-gray-400 text-sm">FIFO (First In, First Out) linear data structure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaStream className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Data Structure</span>
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
              
              {/* Mode Selection */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <button
                    onClick={switchToManual}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                      isManualMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    onClick={() => setIsManualMode(false)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                      !isManualMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Demo
                  </button>
                </div>
              </div>

              {isManualMode ? (
                /* Manual Controls */
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      New Element
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newElement}
                        onChange={(e) => setNewElement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && enqueueElement()}
                        placeholder="Enter value"
                        className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={enqueueElement}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={dequeueElement}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaMinus className="w-4 h-4" />
                      Dequeue
                    </button>
                    <button
                      onClick={frontElement}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Front
                    </button>
                  </div>

                  <button
                    onClick={clearQueue}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear Queue
                  </button>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Max Queue Size: {maxSize}
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="10"
                      value={maxSize}
                      onChange={(e) => setMaxSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              ) : (
                /* Demo Controls */
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
                    onClick={generateDemoOperations}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    New Demo
                  </button>

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
              )}

              {/* Current Operation */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Last Operation:</h3>
                <div className="bg-gray-800 rounded p-3">
                  <span className="text-green-400 font-medium">
                    {currentOperation || 'No operations yet'}
                  </span>
                </div>
              </div>

              {/* Queue Operations */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Queue Operations</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><strong>Enqueue:</strong> Add element to rear</div>
                  <div><strong>Dequeue:</strong> Remove front element</div>
                  <div><strong>Front:</strong> View front element</div>
                  <div><strong>IsEmpty:</strong> Check if queue is empty</div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Color Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-300">Front Element</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-300">Rear Element</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-300">Queue Elements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Queue Visualization</h2>
                <div className="text-gray-300 text-sm">
                  {!isManualMode && `Step ${currentStep + 1} of ${steps.length}`}
                  {isManualMode && 'Interactive Mode'}
                </div>
              </div>

              {/* Queue Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  {renderQueue()}
                </div>
              </div>

              {/* FIFO Principle */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">FIFO Principle:</h3>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="px-3 py-2 bg-green-600 text-white rounded">First In</div>
                  <div className="text-yellow-400">→</div>
                  <div className="px-3 py-2 bg-red-600 text-white rounded">First Out</div>
                </div>
                <p className="text-gray-300 text-sm mt-2 text-center">
                  The first element added is the first one to be removed
                </p>
              </div>

              {/* Current Step Description (Demo mode only) */}
              {!isManualMode && (
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Current Step:</h3>
                  <p className="text-gray-300">
                    {steps[currentStep]?.description || 'Click play to start the demo'}
                  </p>
                </div>
              )}

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Queue Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(1) for all operations</p>
                  <p><strong>Space Complexity:</strong> O(n) where n is number of elements</p>
                  <p><strong>Use Cases:</strong> Task scheduling, breadth-first search, buffer for data streams</p>
                  <p><strong>Real Examples:</strong> Print queue, process scheduling, keyboard buffer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueueVisualization
