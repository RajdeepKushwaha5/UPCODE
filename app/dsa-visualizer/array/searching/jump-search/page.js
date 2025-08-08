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
  FaSearch
} from 'react-icons/fa'

const JumpSearch = () => {
  const router = useRouter()
  const [array, setArray] = useState([])
  const [target, setTarget] = useState(50)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [jumpIndex, setJumpIndex] = useState(-1)
  const [searchRange, setSearchRange] = useState([])
  const [foundIndex, setFoundIndex] = useState(-1)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [arraySize, setArraySize] = useState(12)

  // Generate sorted array
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, (_, i) => (i + 1) * 8 + Math.floor(Math.random() * 5))
    newArray.sort((a, b) => a - b)
    
    setArray(newArray)
    setTarget(newArray[Math.floor(Math.random() * newArray.length)])
    setCurrentStep(0)
    setCurrentIndex(-1)
    setJumpIndex(-1)
    setSearchRange([])
    setFoundIndex(-1)
    setIsPlaying(false)
    generateSteps(newArray, target)
  }, [arraySize, target])

  // Generate jump search steps
  const generateSteps = (arr, searchTarget) => {
    const steps = []
    const n = arr.length
    const jumpSize = Math.floor(Math.sqrt(n))
    let step = jumpSize
    let prev = 0

    steps.push({
      type: 'initial',
      array: [...arr],
      target: searchTarget,
      current: -1,
      jump: -1,
      range: [],
      found: -1,
      jumpSize: jumpSize,
      description: `Starting Jump Search for ${searchTarget}. Jump size = √${n} = ${jumpSize}. Array is sorted.`
    })

    // Jump phase
    while (arr[Math.min(step, n) - 1] < searchTarget) {
      steps.push({
        type: 'jump',
        array: [...arr],
        target: searchTarget,
        current: Math.min(step, n) - 1,
        jump: step,
        range: [],
        found: -1,
        jumpSize: jumpSize,
        description: `Jumping to index ${Math.min(step, n) - 1}. Element ${arr[Math.min(step, n) - 1]} < ${searchTarget}, continue jumping.`
      })

      prev = step
      step += jumpSize

      if (prev >= n) {
        steps.push({
          type: 'not_found',
          array: [...arr],
          target: searchTarget,
          current: -1,
          jump: -1,
          range: [],
          found: -1,
          jumpSize: jumpSize,
          description: `Reached end of array. Element ${searchTarget} not found.`
        })
        setSteps(steps)
        return
      }
    }

    // Found the block, now linear search
    const blockStart = prev
    const blockEnd = Math.min(step, n) - 1

    steps.push({
      type: 'found_block',
      array: [...arr],
      target: searchTarget,
      current: blockEnd,
      jump: -1,
      range: Array.from({ length: blockEnd - blockStart + 1 }, (_, i) => blockStart + i),
      found: -1,
      jumpSize: jumpSize,
      description: `Found potential block! Element ${arr[blockEnd]} ≥ ${searchTarget}. Linear search in range [${blockStart}, ${blockEnd}].`
    })

    // Linear search in the identified block
    for (let i = blockStart; i <= blockEnd; i++) {
      steps.push({
        type: 'linear_search',
        array: [...arr],
        target: searchTarget,
        current: i,
        jump: -1,
        range: Array.from({ length: blockEnd - blockStart + 1 }, (_, idx) => blockStart + idx),
        found: -1,
        jumpSize: jumpSize,
        description: `Linear search: Checking element ${arr[i]} at index ${i}. ${arr[i] === searchTarget ? 'Found!' : arr[i] < searchTarget ? 'Too small, continue.' : 'Too large, element not in array.'}`
      })

      if (arr[i] === searchTarget) {
        steps.push({
          type: 'found',
          array: [...arr],
          target: searchTarget,
          current: i,
          jump: -1,
          range: [],
          found: i,
          jumpSize: jumpSize,
          description: `Element ${searchTarget} found at index ${i}!`
        })
        setSteps(steps)
        return
      }

      if (arr[i] > searchTarget) {
        break
      }
    }

    // Not found
    steps.push({
      type: 'not_found',
      array: [...arr],
      target: searchTarget,
      current: -1,
      jump: -1,
      range: [],
      found: -1,
      jumpSize: jumpSize,
      description: `Element ${searchTarget} not found in the array.`
    })

    setSteps(steps)
  }

  // Initialize
  useEffect(() => {
    generateArray()
  }, [generateArray])

  // Regenerate steps when target changes
  useEffect(() => {
    if (array.length > 0) {
      generateSteps(array, target)
      setCurrentStep(0)
      setIsPlaying(false)
    }
  }, [target, array])

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
      setCurrentIndex(step.current || -1)
      setJumpIndex(step.jump || -1)
      setSearchRange(step.range || [])
      setFoundIndex(step.found || -1)
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

  const getBarColor = (index) => {
    if (index === foundIndex) return 'bg-green-500'
    if (index === currentIndex) return 'bg-yellow-500'
    if (searchRange.includes(index)) return 'bg-purple-500'
    return 'bg-blue-500'
  }

  const getBarHeight = (value) => {
    const maxValue = Math.max(...array)
    return (value / maxValue) * 300
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
                  Jump Search
                </h1>
                <p className="text-gray-400 text-sm">O(√n) searching algorithm for sorted arrays</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaSearch className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Array Search</span>
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
              
              {/* Search Target */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Search Target: {target}
                </label>
                <input
                  type="range"
                  min={Math.min(...array) || 0}
                  max={Math.max(...array) || 100}
                  value={target}
                  onChange={(e) => setTarget(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{Math.min(...array) || 0}</span>
                  <span>{Math.max(...array) || 100}</span>
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
                  onClick={generateArray}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Generate New Array
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
                    Array Size: {arraySize}
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="16"
                    value={arraySize}
                    onChange={(e) => setArraySize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Jump Size:</h3>
                <p className="text-gray-300 text-sm">
                  √{arraySize} = {Math.floor(Math.sqrt(arraySize))}
                </p>
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
                    <span className="text-gray-300">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-300">Search Range</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-300">Found</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Visualization</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-gray-300 text-sm">
                    Target: <span className="text-yellow-400 font-bold">{target}</span>
                  </div>
                  <div className="text-gray-300 text-sm">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
              </div>

              {/* Array Visualization */}
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex items-end justify-center space-x-2 h-80">
                  {array.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-12 transition-all duration-500 ${getBarColor(index)} rounded-t-lg flex items-end justify-center text-white text-xs font-bold pb-1`}
                        style={{ height: `${getBarHeight(value)}px` }}
                      >
                        {value}
                      </div>
                      <div className="text-gray-400 text-xs mt-2">{index}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start the visualization'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Algorithm Information:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(√n) - Square root of array size</p>
                  <p><strong>Space Complexity:</strong> O(1) - Constant space</p>
                  <p><strong>Prerequisite:</strong> Array must be sorted</p>
                  <p><strong>How it works:</strong> Jump ahead by √n steps, then linear search in the identified block.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JumpSearch
