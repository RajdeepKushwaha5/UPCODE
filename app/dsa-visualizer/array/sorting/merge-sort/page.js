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

const MergeSort = () => {
  const router = useRouter()
  const [array, setArray] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [dividingIndices, setDividingIndices] = useState([])
  const [mergingIndices, setMergingIndices] = useState([])
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
    setDividingIndices([])
    setMergingIndices([])
    setSortedIndices([])
    setIsPlaying(false)
    generateSteps(newArray)
  }, [arraySize])

  // Generate merge sort steps
  const generateSteps = (arr) => {
    const steps = []
    const tempArray = [...arr]
    const n = tempArray.length

    steps.push({
      type: 'initial',
      array: [...tempArray],
      dividing: [],
      merging: [],
      sorted: [],
      description: 'Starting Merge Sort. We will recursively divide the array into smaller subarrays.'
    })

    const mergeSort = (arr, left, right, depth = 0) => {
      if (left >= right) return

      const mid = Math.floor((left + right) / 2)

      // Show division
      steps.push({
        type: 'divide',
        array: [...tempArray],
        dividing: [left, mid, right],
        merging: [],
        sorted: [],
        description: `Dividing array from index ${left} to ${right} into two halves: [${left}, ${mid}] and [${mid + 1}, ${right}]`
      })

      // Recursively sort left half
      mergeSort(arr, left, mid, depth + 1)
      // Recursively sort right half
      mergeSort(arr, mid + 1, right, depth + 1)

      // Merge the sorted halves
      merge(arr, left, mid, right)
    }

    const merge = (arr, left, mid, right) => {
      const leftArr = []
      const rightArr = []

      // Copy data to temp arrays
      for (let i = left; i <= mid; i++) {
        leftArr.push(tempArray[i])
      }
      for (let i = mid + 1; i <= right; i++) {
        rightArr.push(tempArray[i])
      }

      steps.push({
        type: 'prepare_merge',
        array: [...tempArray],
        dividing: [],
        merging: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        sorted: [],
        description: `Merging subarrays [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`
      })

      let i = 0, j = 0, k = left

      // Merge the temp arrays back into tempArray[left..right]
      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          type: 'compare_merge',
          array: [...tempArray],
          dividing: [],
          merging: [left + i, mid + 1 + j],
          sorted: Array.from({ length: k - left }, (_, idx) => left + idx),
          description: `Comparing ${leftArr[i]} and ${rightArr[j]}. Selecting ${leftArr[i] <= rightArr[j] ? leftArr[i] : rightArr[j]}`
        })

        if (leftArr[i] <= rightArr[j]) {
          tempArray[k] = leftArr[i]
          i++
        } else {
          tempArray[k] = rightArr[j]
          j++
        }

        steps.push({
          type: 'place_element',
          array: [...tempArray],
          dividing: [],
          merging: [k],
          sorted: Array.from({ length: k - left + 1 }, (_, idx) => left + idx),
          description: `Placed ${tempArray[k]} at index ${k}`
        })

        k++
      }

      // Copy remaining elements of leftArr[], if any
      while (i < leftArr.length) {
        tempArray[k] = leftArr[i]
        steps.push({
          type: 'place_remaining',
          array: [...tempArray],
          dividing: [],
          merging: [k],
          sorted: Array.from({ length: k - left + 1 }, (_, idx) => left + idx),
          description: `Placing remaining element ${leftArr[i]} at index ${k}`
        })
        i++
        k++
      }

      // Copy remaining elements of rightArr[], if any
      while (j < rightArr.length) {
        tempArray[k] = rightArr[j]
        steps.push({
          type: 'place_remaining',
          array: [...tempArray],
          dividing: [],
          merging: [k],
          sorted: Array.from({ length: k - left + 1 }, (_, idx) => left + idx),
          description: `Placing remaining element ${rightArr[j]} at index ${k}`
        })
        j++
        k++
      }

      // Show merged subarray
      steps.push({
        type: 'merged',
        array: [...tempArray],
        dividing: [],
        merging: [],
        sorted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        description: `Merged subarray from index ${left} to ${right} is now sorted: [${tempArray.slice(left, right + 1).join(', ')}]`
      })
    }

    mergeSort(tempArray, 0, n - 1)

    // Mark completion
    steps.push({
      type: 'complete',
      array: [...tempArray],
      dividing: [],
      merging: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      description: 'Array is now completely sorted using Merge Sort!'
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
      setDividingIndices(step.dividing || [])
      setMergingIndices(step.merging || [])
      setSortedIndices(step.sorted || [])
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
    if (mergingIndices.includes(index)) return 'bg-purple-500'
    if (dividingIndices.includes(index)) return 'bg-yellow-500'
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
                  Merge Sort
                </h1>
                <p className="text-gray-400 text-sm">O(n log n) divide-and-conquer sorting algorithm</p>
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
                    min="4"
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
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-300">Dividing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-300">Merging</span>
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
                  <p><strong>Time Complexity:</strong> O(n log n) - Consistent performance</p>
                  <p><strong>Space Complexity:</strong> O(n) - Requires additional space</p>
                  <p><strong>Stability:</strong> Stable (maintains relative order of equal elements)</p>
                  <p><strong>How it works:</strong> Divides array into halves, recursively sorts them, then merges sorted halves back together.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MergeSort
