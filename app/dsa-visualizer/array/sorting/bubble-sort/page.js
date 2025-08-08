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
  FaChartBar
} from 'react-icons/fa'

const BubbleSort = () => {
  const router = useRouter()
  const [array, setArray] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [comparingIndices, setComparingIndices] = useState([])
  const [swappingIndices, setSwappingIndices] = useState([])
  const [sortedIndices, setSortedIndices] = useState([])
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [arraySize, setArraySize] = useState(8)

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100) + 10
    )
    setArray(newArray)
    setCurrentStep(0)
    setComparingIndices([])
    setSwappingIndices([])
    setSortedIndices([])
    setIsPlaying(false)
    generateSteps(newArray)
  }, [arraySize])

  // Generate bubble sort steps
  const generateSteps = (arr) => {
    const steps = []
    const tempArray = [...arr]
    const n = tempArray.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Add comparison step
        steps.push({
          type: 'compare',
          array: [...tempArray],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          description: `Comparing elements at indices ${j} and ${j + 1}: ${tempArray[j]} and ${tempArray[j + 1]}`
        })

        if (tempArray[j] > tempArray[j + 1]) {
          // Add swap step
          [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]]
          steps.push({
            type: 'swap',
            array: [...tempArray],
            comparing: [j, j + 1],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            description: `Swapping ${tempArray[j + 1]} and ${tempArray[j]}`
          })
        }
      }
      // Mark element as sorted
      steps.push({
        type: 'sorted',
        array: [...tempArray],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
        description: `Element at index ${n - 1 - i} is now in its correct position`
      })
    }

    // Mark all as sorted
    steps.push({
      type: 'complete',
      array: [...tempArray],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      description: 'Array is now completely sorted!'
    })

    setSteps(steps)
  }

  // Initialize
  useEffect(() => {
    generateArray()
  }, [generateArray])

  // Auto-play
  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, steps.length, speed])

  // Update visualization based on current step
  useEffect(() => {
    if (steps[currentStep]) {
      const step = steps[currentStep]
      setArray(step.array)
      setComparingIndices(step.comparing)
      setSwappingIndices(step.swapping)
      setSortedIndices(step.sorted)
    }
  }, [currentStep, steps])

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }
  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }
  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500'
    if (swappingIndices.includes(index)) return 'bg-red-500'
    if (comparingIndices.includes(index)) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const maxValue = Math.max(...array)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Bubble Sort Visualization
                </h1>
                <p className="text-gray-300 mt-1">
                  Watch how bubble sort works step by step
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaChartBar className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Array Sorting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleStepBackward}
                disabled={currentStep === 0}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <FaStepBackward className="w-4 h-4" />
              </button>

              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  disabled={currentStep >= steps.length}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaPlay className="w-4 h-4" />
                  Play
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaPause className="w-4 h-4" />
                  Pause
                </button>
              )}

              <button
                onClick={handleStepForward}
                disabled={currentStep >= steps.length - 1}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <FaStepForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaRedo className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Array Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-300 text-sm">Size:</label>
                <select
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-300 text-sm">Speed:</label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value={2000}>Slow</option>
                  <option value={1000}>Normal</option>
                  <option value={500}>Fast</option>
                  <option value={200}>Very Fast</option>
                </select>
              </div>

              <button
                onClick={generateArray}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaCogs className="w-4 h-4" />
                New Array
              </button>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Array Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Array Visualization</h3>
              <div className="flex items-end justify-center gap-2 h-64 mb-4">
                {array.map((value, index) => (
                  <div key={index} className="relative flex flex-col items-center">
                    <div
                      className={`${getBarColor(index)} transition-all duration-300 rounded-t-sm`}
                      style={{
                        height: `${(value / maxValue) * 200}px`,
                        width: `${Math.max(600 / array.length - 8, 20)}px`
                      }}
                    />
                    <div className="text-white text-xs mt-1 font-mono">{value}</div>
                    <div className="text-gray-400 text-xs">{index}</div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-300">Unsorted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-300">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-300">Swapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-300">Sorted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step Information */}
          <div className="space-y-6">
            {/* Current Step */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Step Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Step:</span>
                  <span className="text-white ml-2">{currentStep + 1} / {steps.length}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Progress:</span>
                  <div className="mt-1">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                {steps[currentStep] && (
                  <div>
                    <span className="text-gray-400 text-sm">Description:</span>
                    <p className="text-white text-sm mt-1 leading-relaxed">
                      {steps[currentStep].description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Algorithm Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Time Complexity:</span>
                  <span className="text-white ml-2">O(n²)</span>
                </div>
                <div>
                  <span className="text-gray-400">Space Complexity:</span>
                  <span className="text-white ml-2">O(1)</span>
                </div>
                <div>
                  <span className="text-gray-400">Stability:</span>
                  <span className="text-green-400 ml-2">Stable</span>
                </div>
                <div>
                  <span className="text-gray-400">In-place:</span>
                  <span className="text-green-400 ml-2">Yes</span>
                </div>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Pseudocode</h3>
              <pre className="text-gray-300 text-xs leading-relaxed overflow-x-auto">
                {`for i = 0 to n-2
  for j = 0 to n-2-i
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])
    end if
  end for
end for`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BubbleSort
