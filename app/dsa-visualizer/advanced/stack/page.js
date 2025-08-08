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
  FaLayerGroup,
  FaPlus,
  FaMinus
} from 'react-icons/fa'

const StackVisualization = () => {
  const router = useRouter()
  const [stack, setStack] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [newElement, setNewElement] = useState('')
  const [isManualMode, setIsManualMode] = useState(true)
  const [maxSize, setMaxSize] = useState(8)
  const [currentOperation, setCurrentOperation] = useState('')

  // Generate demo operations
  const generateDemoOperations = useCallback(() => {
    const operations = [
      { type: 'push', value: 10 },
      { type: 'push', value: 20 },
      { type: 'push', value: 30 },
      { type: 'peek' },
      { type: 'push', value: 40 },
      { type: 'pop' },
      { type: 'pop' },
      { type: 'push', value: 50 },
      { type: 'peek' },
      { type: 'pop' },
      { type: 'pop' },
      { type: 'pop' }
    ]

    const steps = []
    let currentStack = []

    steps.push({
      type: 'initial',
      stack: [...currentStack],
      operation: '',
      description: 'Stack initialized. Stack follows LIFO (Last In, First Out) principle.',
      result: null
    })

    operations.forEach((op, index) => {
      if (op.type === 'push') {
        if (currentStack.length < maxSize) {
          currentStack.push(op.value)
          steps.push({
            type: 'push',
            stack: [...currentStack],
            operation: `Push ${op.value}`,
            description: `Push ${op.value} onto the stack. New element becomes the top.`,
            result: `Pushed ${op.value}`
          })
        } else {
          steps.push({
            type: 'overflow',
            stack: [...currentStack],
            operation: `Push ${op.value}`,
            description: `Cannot push ${op.value}. Stack overflow - maximum size (${maxSize}) reached.`,
            result: 'Stack Overflow'
          })
        }
      } else if (op.type === 'pop') {
        if (currentStack.length > 0) {
          const poppedValue = currentStack.pop()
          steps.push({
            type: 'pop',
            stack: [...currentStack],
            operation: 'Pop',
            description: `Pop the top element (${poppedValue}) from the stack.`,
            result: `Popped ${poppedValue}`
          })
        } else {
          steps.push({
            type: 'underflow',
            stack: [...currentStack],
            operation: 'Pop',
            description: 'Cannot pop from an empty stack. Stack underflow.',
            result: 'Stack Underflow'
          })
        }
      } else if (op.type === 'peek') {
        if (currentStack.length > 0) {
          const topValue = currentStack[currentStack.length - 1]
          steps.push({
            type: 'peek',
            stack: [...currentStack],
            operation: 'Peek',
            description: `Peek at the top element without removing it.`,
            result: `Top: ${topValue}`
          })
        } else {
          steps.push({
            type: 'peek_empty',
            stack: [...currentStack],
            operation: 'Peek',
            description: 'Cannot peek at empty stack.',
            result: 'Stack Empty'
          })
        }
      }
    })

    steps.push({
      type: 'complete',
      stack: [...currentStack],
      operation: '',
      description: 'Demo complete! Stack operations demonstrated.',
      result: null
    })

    setSteps(steps)
    setStack([])
    setCurrentStep(0)
    setIsPlaying(false)
  }, [maxSize])

  // Manual operations
  const pushElement = () => {
    if (!newElement.trim()) return
    if (stack.length >= maxSize) {
      setCurrentOperation('Stack Overflow - Maximum size reached!')
      return
    }
    
    const value = parseInt(newElement) || newElement
    setStack([...stack, value])
    setCurrentOperation(`Pushed ${value}`)
    setNewElement('')
  }

  const popElement = () => {
    if (stack.length === 0) {
      setCurrentOperation('Stack Underflow - Stack is empty!')
      return
    }
    
    const poppedValue = stack[stack.length - 1]
    setStack(stack.slice(0, -1))
    setCurrentOperation(`Popped ${poppedValue}`)
  }

  const peekElement = () => {
    if (stack.length === 0) {
      setCurrentOperation('Stack is empty!')
      return
    }
    
    const topValue = stack[stack.length - 1]
    setCurrentOperation(`Top element: ${topValue}`)
  }

  const clearStack = () => {
    setStack([])
    setCurrentOperation('Stack cleared')
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
      setStack(step.stack)
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
      setStack([])
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

  const renderStack = () => {
    const displayStack = isManualMode ? stack : (steps[currentStep]?.stack || [])
    
    return (
      <div className="flex flex-col items-center">
        <div className="text-gray-300 mb-4">
          <span className="font-bold">Top</span>
          <div className="w-8 h-8 border-l-2 border-gray-300 ml-4"></div>
        </div>
        
        <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 min-h-[400px] justify-end">
          {displayStack.length === 0 ? (
            <div className="text-gray-500 italic text-center py-8">
              Stack is empty
            </div>
          ) : (
            displayStack.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={`w-32 h-16 flex items-center justify-center text-white font-bold text-lg rounded-lg border-2 transition-all duration-500 ${
                  index === displayStack.length - 1 
                    ? 'bg-yellow-500 border-yellow-400 text-black transform scale-105' 
                    : 'bg-blue-500 border-blue-400'
                }`}
              >
                {item}
              </div>
            ))
          )}
        </div>
        
        <div className="text-gray-300 mt-4 text-center">
          <div className="w-8 h-8 border-l-2 border-gray-300 ml-4"></div>
          <span className="font-bold">Bottom</span>
          <div className="text-sm text-gray-500 mt-2">
            Size: {displayStack.length} / {maxSize}
          </div>
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
                  Stack Data Structure
                </h1>
                <p className="text-gray-400 text-sm">LIFO (Last In, First Out) linear data structure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaLayerGroup className="w-5 h-5 text-blue-400" />
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
                        onKeyPress={(e) => e.key === 'Enter' && pushElement()}
                        placeholder="Enter value"
                        className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={pushElement}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={popElement}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaMinus className="w-4 h-4" />
                      Pop
                    </button>
                    <button
                      onClick={peekElement}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Peek
                    </button>
                  </div>

                  <button
                    onClick={clearStack}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear Stack
                  </button>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Max Stack Size: {maxSize}
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="12"
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

              {/* Stack Operations */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Stack Operations</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><strong>Push:</strong> Add element to top</div>
                  <div><strong>Pop:</strong> Remove top element</div>
                  <div><strong>Peek:</strong> View top element</div>
                  <div><strong>IsEmpty:</strong> Check if stack is empty</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Stack Visualization</h2>
                <div className="text-gray-300 text-sm">
                  {!isManualMode && `Step ${currentStep + 1} of ${steps.length}`}
                  {isManualMode && 'Interactive Mode'}
                </div>
              </div>

              {/* Stack Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex justify-center">
                  {renderStack()}
                </div>
              </div>

              {/* LIFO Principle */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">LIFO Principle:</h3>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="px-3 py-2 bg-green-600 text-white rounded">Last In</div>
                  <div className="text-yellow-400">→</div>
                  <div className="px-3 py-2 bg-red-600 text-white rounded">First Out</div>
                </div>
                <p className="text-gray-300 text-sm mt-2 text-center">
                  The most recently added element is the first one to be removed
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
                <h3 className="text-white font-medium mb-2">Stack Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(1) for all operations</p>
                  <p><strong>Space Complexity:</strong> O(n) where n is number of elements</p>
                  <p><strong>Use Cases:</strong> Function calls, undo operations, expression evaluation</p>
                  <p><strong>Real Examples:</strong> Browser back button, function call stack, undo/redo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StackVisualization
