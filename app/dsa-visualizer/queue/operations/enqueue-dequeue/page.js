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
  FaPlus,
  FaMinus,
  FaArrowRight
} from 'react-icons/fa'

const QueueOperations = () => {
  const router = useRouter()
  const [queue, setQueue] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [front, setFront] = useState(0)
  const [rear, setRear] = useState(-1)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [operation, setOperation] = useState('')
  const [operationValue, setOperationValue] = useState('')
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [maxSize] = useState(8)
  const [newValue, setNewValue] = useState(42)

  // Generate initial demo operations
  const generateOperations = useCallback(() => {
    const operations = [
      { type: 'enqueue', value: 10 },
      { type: 'enqueue', value: 20 },
      { type: 'enqueue', value: 30 },
      { type: 'dequeue' },
      { type: 'enqueue', value: 40 },
      { type: 'enqueue', value: 50 },
      { type: 'dequeue' },
      { type: 'dequeue' },
      { type: 'enqueue', value: 60 },
    ]

    const steps = []
    let currentQueue = []
    let currentFront = 0
    let currentRear = -1

    steps.push({
      type: 'initial',
      queue: [],
      front: 0,
      rear: -1,
      highlight: -1,
      operation: 'initial',
      operationValue: '',
      description: 'Queue is empty. Front and Rear pointers are initialized.'
    })

    operations.forEach((op, index) => {
      if (op.type === 'enqueue') {
        if (currentQueue.length < maxSize) {
          currentQueue.push(op.value)
          currentRear++
          
          steps.push({
            type: 'enqueue',
            queue: [...currentQueue],
            front: currentFront,
            rear: currentRear,
            highlight: currentRear,
            operation: 'enqueue',
            operationValue: op.value.toString(),
            description: `Enqueue ${op.value}: Added to rear of queue. Rear = ${currentRear}`
          })
        } else {
          steps.push({
            type: 'overflow',
            queue: [...currentQueue],
            front: currentFront,
            rear: currentRear,
            highlight: -1,
            operation: 'overflow',
            operationValue: op.value.toString(),
            description: `Queue overflow! Cannot add ${op.value}. Queue is full.`
          })
        }
      } else if (op.type === 'dequeue') {
        if (currentQueue.length > 0) {
          const dequeuedValue = currentQueue.shift()
          if (currentQueue.length === 0) {
            currentFront = 0
            currentRear = -1
          } else {
            currentRear--
          }

          steps.push({
            type: 'dequeue',
            queue: [...currentQueue],
            front: currentFront,
            rear: currentRear,
            highlight: 0,
            operation: 'dequeue',
            operationValue: dequeuedValue.toString(),
            description: `Dequeue: Removed ${dequeuedValue} from front of queue. ${currentQueue.length > 0 ? `Rear = ${currentRear}` : 'Queue is now empty'}`
          })
        } else {
          steps.push({
            type: 'underflow',
            queue: [...currentQueue],
            front: currentFront,
            rear: currentRear,
            highlight: -1,
            operation: 'underflow',
            operationValue: '',
            description: 'Queue underflow! Cannot dequeue from empty queue.'
          })
        }
      }
    })

    setSteps(steps)
    // Set initial state
    setQueue([])
    setFront(0)
    setRear(-1)
    setHighlightIndex(-1)
    setOperation('initial')
    setOperationValue('')
    setCurrentStep(0)
    setIsPlaying(false)
  }, [maxSize])

  // Manual operations
  const enqueueValue = () => {
    if (queue.length < maxSize) {
      const newQueue = [...queue, newValue]
      setQueue(newQueue)
      setRear(newQueue.length - 1)
      setHighlightIndex(newQueue.length - 1)
      setOperation('enqueue')
      setOperationValue(newValue.toString())
      setNewValue(newValue + 1)
      
      setTimeout(() => setHighlightIndex(-1), 1000)
    }
  }

  const dequeueValue = () => {
    if (queue.length > 0) {
      const dequeuedValue = queue[0]
      const newQueue = queue.slice(1)
      setQueue(newQueue)
      setRear(newQueue.length - 1)
      setHighlightIndex(0)
      setOperation('dequeue')
      setOperationValue(dequeuedValue.toString())
      
      if (newQueue.length === 0) {
        setFront(0)
        setRear(-1)
      }

      setTimeout(() => setHighlightIndex(-1), 1000)
    }
  }

  const clearQueue = () => {
    setQueue([])
    setFront(0)
    setRear(-1)
    setHighlightIndex(-1)
    setOperation('clear')
    setOperationValue('')
  }

  // Initialize
  useEffect(() => {
    generateOperations()
  }, [generateOperations])

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
      setQueue(step.queue)
      setFront(step.front)
      setRear(step.rear)
      setHighlightIndex(step.highlight)
      setOperation(step.operation)
      setOperationValue(step.operationValue)
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

  const getQueueSlotColor = (index) => {
    if (index === highlightIndex && operation === 'enqueue') return 'bg-green-500 border-green-400'
    if (index === highlightIndex && operation === 'dequeue') return 'bg-red-500 border-red-400'
    if (index < queue.length) return 'bg-blue-500 border-blue-400'
    return 'bg-gray-600 border-gray-500'
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
                  Queue Operations
                </h1>
                <p className="text-gray-400 text-sm">FIFO (First In First Out) data structure operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaArrowRight className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Enqueue & Dequeue</span>
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

              {/* Manual Operations */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Manual Operations</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Value to enqueue"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={enqueueValue}
                      disabled={queue.length >= maxSize}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPlus className="w-3 h-3" />
                      Enqueue
                    </button>
                    <button
                      onClick={dequeueValue}
                      disabled={queue.length === 0}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaMinus className="w-3 h-3" />
                      Dequeue
                    </button>
                  </div>
                  <button
                    onClick={clearQueue}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    Clear Queue
                  </button>
                </div>
              </div>

              {/* Auto Demo Controls */}
              <div className="mb-6 pt-4 border-t border-gray-600">
                <h3 className="text-white font-medium mb-3">Auto Demo</h3>
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
                    onClick={generateOperations}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Generate New Demo
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
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

              {/* Queue Status */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Queue Status:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Size:</strong> {queue.length}/{maxSize}</p>
                  <p><strong>Front:</strong> {queue.length > 0 ? front : 'N/A'}</p>
                  <p><strong>Rear:</strong> {rear >= 0 ? rear : 'N/A'}</p>
                  <p><strong>Status:</strong> {queue.length === 0 ? 'Empty' : queue.length === maxSize ? 'Full' : 'Available'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Queue Visualization</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-gray-300 text-sm">
                    Operation: <span className="text-yellow-400 font-bold capitalize">{operation}</span>
                    {operationValue && <span className="text-cyan-400"> ({operationValue})</span>}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
              </div>

              {/* Queue Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex flex-col items-center">
                  {/* FIFO Direction Indicator */}
                  <div className="mb-8 flex items-center space-x-4">
                    <span className="text-green-400 font-medium">ENQUEUE (Rear)</span>
                    <FaArrowRight className="text-yellow-400" />
                    <div className="text-gray-300">[ QUEUE ]</div>
                    <FaArrowRight className="text-yellow-400" />
                    <span className="text-red-400 font-medium">DEQUEUE (Front)</span>
                  </div>

                  {/* Queue Array */}
                  <div className="flex items-center space-x-1 mb-8">
                    {Array.from({ length: maxSize }, (_, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-500 ${getQueueSlotColor(index)}`}
                        >
                          {index < queue.length ? queue[index] : ''}
                        </div>
                        <div className="text-gray-400 text-xs mt-2">{index}</div>
                        {index === front && queue.length > 0 && (
                          <div className="text-green-400 text-xs mt-1">FRONT</div>
                        )}
                        {index === rear && rear >= 0 && (
                          <div className="text-blue-400 text-xs mt-1">REAR</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pointers Visualization */}
                  <div className="flex justify-between w-full max-w-md text-center">
                    <div className="flex flex-col items-center">
                      <div className="text-green-400 font-bold text-lg">← ENQUEUE</div>
                      <div className="text-gray-400 text-sm">Add to rear</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-red-400 font-bold text-lg">DEQUEUE →</div>
                      <div className="text-gray-400 text-sm">Remove from front</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Use manual controls or play demo to see queue operations'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Queue Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(1) for both enqueue and dequeue</p>
                  <p><strong>Space Complexity:</strong> O(n) where n is the maximum queue size</p>
                  <p><strong>FIFO Principle:</strong> First In, First Out - elements are removed in the order they were added</p>
                  <p><strong>Applications:</strong> Task scheduling, breadth-first search, handling requests in servers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueueOperations
