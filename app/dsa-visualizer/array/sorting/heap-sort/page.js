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

const HeapSort = () => {
  const router = useRouter()
  const [array, setArray] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [heapIndices, setHeapIndices] = useState([])
  const [comparingIndices, setComparingIndices] = useState([])
  const [swappingIndices, setSwappingIndices] = useState([])
  const [sortedIndices, setSortedIndices] = useState([])
  const [rootIndex, setRootIndex] = useState(-1)
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
    setHeapIndices([])
    setComparingIndices([])
    setSwappingIndices([])
    setSortedIndices([])
    setRootIndex(-1)
    setIsPlaying(false)
    generateSteps(newArray)
  }, [arraySize])

  // Generate heap sort steps
  const generateSteps = (arr) => {
    const steps = []
    const tempArray = [...arr]
    const n = tempArray.length

    steps.push({
      type: 'initial',
      array: [...tempArray],
      heap: Array.from({ length: n }, (_, i) => i),
      comparing: [],
      swapping: [],
      sorted: [],
      root: -1,
      description: 'Starting Heap Sort. First, we will build a max heap from the array.'
    })

    // Build max heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(tempArray, n, i, steps, 'build')
    }

    steps.push({
      type: 'heap_built',
      array: [...tempArray],
      heap: Array.from({ length: n }, (_, i) => i),
      comparing: [],
      swapping: [],
      sorted: [],
      root: 0,
      description: 'Max heap built! The largest element is now at the root (index 0).'
    })

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      [tempArray[0], tempArray[i]] = [tempArray[i], tempArray[0]]
      
      steps.push({
        type: 'extract',
        array: [...tempArray],
        heap: Array.from({ length: i }, (_, idx) => idx),
        comparing: [],
        swapping: [0, i],
        sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
        root: -1,
        description: `Extracted maximum ${tempArray[i]} to position ${i}. Heap size reduced to ${i}.`
      })

      // Call heapify on the reduced heap
      heapify(tempArray, i, 0, steps, 'sort')
    }

    // Mark completion
    steps.push({
      type: 'complete',
      array: [...tempArray],
      heap: [],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      root: -1,
      description: 'Array is now completely sorted using Heap Sort!'
    })

    setSteps(steps)
  }

  const heapify = (arr, n, i, steps, phase) => {
    let largest = i // Initialize largest as root
    let left = 2 * i + 1 // left child
    let right = 2 * i + 2 // right child

    // Show current node being heapified
    steps.push({
      type: `${phase}_heapify_start`,
      array: [...arr],
      heap: Array.from({ length: n }, (_, idx) => idx),
      comparing: [i],
      swapping: [],
      sorted: phase === 'sort' ? Array.from({ length: arr.length - n }, (_, idx) => arr.length - 1 - idx) : [],
      root: phase === 'build' ? -1 : (i === 0 ? 0 : -1),
      description: `${phase === 'build' ? 'Building heap:' : 'Maintaining heap:'} Heapifying node ${i} (value: ${arr[i]})`
    })

    // Check if left child is larger than root
    if (left < n) {
      steps.push({
        type: `${phase}_compare_left`,
        array: [...arr],
        heap: Array.from({ length: n }, (_, idx) => idx),
        comparing: [i, left],
        swapping: [],
        sorted: phase === 'sort' ? Array.from({ length: arr.length - n }, (_, idx) => arr.length - 1 - idx) : [],
        root: phase === 'build' ? -1 : (i === 0 ? 0 : -1),
        description: `Comparing node ${i} (${arr[i]}) with left child ${left} (${arr[left]})`
      })

      if (arr[left] > arr[largest]) {
        largest = left
      }
    }

    // Check if right child is larger than current largest
    if (right < n) {
      steps.push({
        type: `${phase}_compare_right`,
        array: [...arr],
        heap: Array.from({ length: n }, (_, idx) => idx),
        comparing: [largest, right],
        swapping: [],
        sorted: phase === 'sort' ? Array.from({ length: arr.length - n }, (_, idx) => arr.length - 1 - idx) : [],
        root: phase === 'build' ? -1 : (i === 0 ? 0 : -1),
        description: `Comparing current largest ${largest} (${arr[largest]}) with right child ${right} (${arr[right]})`
      })

      if (arr[right] > arr[largest]) {
        largest = right
      }
    }

    // If largest is not root, swap and continue heapifying
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]]
      
      steps.push({
        type: `${phase}_swap`,
        array: [...arr],
        heap: Array.from({ length: n }, (_, idx) => idx),
        comparing: [],
        swapping: [i, largest],
        sorted: phase === 'sort' ? Array.from({ length: arr.length - n }, (_, idx) => arr.length - 1 - idx) : [],
        root: phase === 'build' ? -1 : (largest === 0 ? 0 : -1),
        description: `Swapping ${arr[i]} at position ${largest} with ${arr[largest]} at position ${i} to maintain heap property`
      })

      // Recursively heapify the affected sub-tree
      heapify(arr, n, largest, steps, phase)
    }
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
      setHeapIndices(step.heap || [])
      setComparingIndices(step.comparing || [])
      setSwappingIndices(step.swapping || [])
      setSortedIndices(step.sorted || [])
      setRootIndex(step.root || -1)
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
    if (swappingIndices.includes(index)) return 'bg-red-500'
    if (index === rootIndex) return 'bg-purple-500'
    if (comparingIndices.includes(index)) return 'bg-yellow-500'
    if (heapIndices.includes(index)) return 'bg-blue-500'
    return 'bg-gray-500'
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
                  Heap Sort
                </h1>
                <p className="text-gray-400 text-sm">O(n log n) heap-based sorting algorithm</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaChartBar className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Heap Visualization</span>
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
                    <span className="text-gray-300">Heap Elements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-300">Heap Root</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-300">Comparing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
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
                  <p><strong>Time Complexity:</strong> O(n log n) - Consistent performance</p>
                  <p><strong>Space Complexity:</strong> O(1) - In-place sorting</p>
                  <p><strong>Stability:</strong> Not stable (can change relative order of equal elements)</p>
                  <p><strong>How it works:</strong> Builds a max heap, then repeatedly extracts the maximum element to get sorted array.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeapSort
