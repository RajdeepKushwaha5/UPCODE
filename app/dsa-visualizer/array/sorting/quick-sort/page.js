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

const QuickSort = () => {
  const router = useRouter()
  const [array, setArray] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [pivotIndex, setPivotIndex] = useState(-1)
  const [comparingIndices, setComparingIndices] = useState([])
  const [swappingIndices, setSwappingIndices] = useState([])
  const [sortedIndices, setSortedIndices] = useState([])
  const [partitionIndices, setPartitionIndices] = useState([])
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
    setPivotIndex(-1)
    setComparingIndices([])
    setSwappingIndices([])
    setSortedIndices([])
    setPartitionIndices([])
    setIsPlaying(false)
    generateSteps(newArray)
  }, [arraySize])

  // Generate quick sort steps
  const generateSteps = (arr) => {
    const steps = []
    const tempArray = [...arr]
    const n = tempArray.length

    steps.push({
      type: 'initial',
      array: [...tempArray],
      pivot: -1,
      comparing: [],
      swapping: [],
      sorted: [],
      partition: [],
      description: 'Starting Quick Sort. We will recursively partition the array around pivot elements.'
    })

    const quickSort = (arr, low, high) => {
      if (low < high) {
        // Partition the array and get pivot index
        const pivotIdx = partition(arr, low, high)
        
        // Mark pivot as sorted
        steps.push({
          type: 'pivot_sorted',
          array: [...tempArray],
          pivot: pivotIdx,
          comparing: [],
          swapping: [],
          sorted: [...sortedIndices, pivotIdx],
          partition: [],
          description: `Pivot element ${tempArray[pivotIdx]} is now in its correct position at index ${pivotIdx}`
        })

        // Recursively sort left part
        quickSort(arr, low, pivotIdx - 1)
        // Recursively sort right part
        quickSort(arr, pivotIdx + 1, high)
      } else if (low === high) {
        // Single element is already sorted
        steps.push({
          type: 'single_sorted',
          array: [...tempArray],
          pivot: -1,
          comparing: [],
          swapping: [],
          sorted: [...sortedIndices, low],
          partition: [],
          description: `Single element ${tempArray[low]} at index ${low} is already sorted`
        })
      }
    }

    const partition = (arr, low, high) => {
      // Choose the rightmost element as pivot
      const pivot = tempArray[high]
      
      steps.push({
        type: 'choose_pivot',
        array: [...tempArray],
        pivot: high,
        comparing: [],
        swapping: [],
        sorted: sortedIndices,
        partition: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        description: `Choosing pivot: ${pivot} at index ${high}. Partitioning elements from index ${low} to ${high}`
      })

      let i = low - 1 // Index of smaller element

      for (let j = low; j <= high - 1; j++) {
        // Show comparison
        steps.push({
          type: 'compare',
          array: [...tempArray],
          pivot: high,
          comparing: [j, high],
          swapping: [],
          sorted: sortedIndices,
          partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
          description: `Comparing ${tempArray[j]} at index ${j} with pivot ${pivot}. ${tempArray[j] <= pivot ? 'Element is ≤ pivot, will move to left partition' : 'Element is > pivot, stays in right partition'}`
        })

        // If current element is smaller than or equal to pivot
        if (tempArray[j] <= pivot) {
          i++
          if (i !== j) {
            // Swap elements
            [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]]
            
            steps.push({
              type: 'swap',
              array: [...tempArray],
              pivot: high,
              comparing: [],
              swapping: [i, j],
              sorted: sortedIndices,
              partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
              description: `Swapping ${tempArray[i]} and ${tempArray[j]} to move smaller element to left partition`
            })
          }
        }
      }

      // Place pivot in correct position
      [tempArray[i + 1], tempArray[high]] = [tempArray[high], tempArray[i + 1]]
      
      steps.push({
        type: 'place_pivot',
        array: [...tempArray],
        pivot: i + 1,
        comparing: [],
        swapping: [i + 1, high],
        sorted: sortedIndices,
        partition: [],
        description: `Placing pivot ${tempArray[i + 1]} at its correct position (index ${i + 1}). Left partition has elements ≤ pivot, right partition has elements > pivot`
      })

      return i + 1
    }

    quickSort(tempArray, 0, n - 1)

    // Mark completion
    steps.push({
      type: 'complete',
      array: [...tempArray],
      pivot: -1,
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      partition: [],
      description: 'Array is now completely sorted using Quick Sort!'
    })

    setSteps(steps)
  }

  // Initialize
  useEffect(() => {
    generateArray()
  }, [generateArray])

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
      setArray(step.array)
      setPivotIndex(step.pivot || -1)
      setComparingIndices(step.comparing || [])
      setSwappingIndices(step.swapping || [])
      setSortedIndices(step.sorted || [])
      setPartitionIndices(step.partition || [])
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
    if (sortedIndices.includes(index)) return 'bg-green-500'
    if (index === pivotIndex) return 'bg-red-500'
    if (swappingIndices.includes(index)) return 'bg-orange-500'
    if (comparingIndices.includes(index)) return 'bg-yellow-500'
    if (partitionIndices.includes(index)) return 'bg-purple-500'
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
                  Quick Sort
                </h1>
                <p className="text-gray-400 text-sm">O(n log n) average, divide-and-conquer sorting algorithm</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaChartBar className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Array Visualization</span>
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
                    min="5"
                    max="12"
                    value={arraySize}
                    onChange={(e) => setArraySize(parseInt(e.target.value))}
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
                    <span className="text-gray-300">Unsorted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-300">Partition Range</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-300">Pivot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-300">Comparing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-gray-300">Swapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-300">Sorted</span>
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
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
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
                  <p><strong>Time Complexity:</strong> O(n log n) average, O(n²) worst case</p>
                  <p><strong>Space Complexity:</strong> O(log n) - In-place with recursion stack</p>
                  <p><strong>Stability:</strong> Not stable (can change relative order of equal elements)</p>
                  <p><strong>How it works:</strong> Chooses a pivot, partitions array around it, then recursively sorts partitions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickSort
