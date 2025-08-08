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
  FaSearch,
  FaCrosshairs
} from 'react-icons/fa'

const BinarySearch = () => {
  const router = useRouter()
  const [array, setArray] = useState([])
  const [target, setTarget] = useState(42)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [left, setLeft] = useState(-1)
  const [right, setRight] = useState(-1)
  const [mid, setMid] = useState(-1)
  const [found, setFound] = useState(false)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [arraySize, setArraySize] = useState(10)

  // Generate sorted array
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, (_, i) => (i + 1) * 5)
    setArray(newArray)
    setTarget(newArray[Math.floor(Math.random() * newArray.length)])
    setCurrentStep(0)
    setLeft(-1)
    setRight(-1)
    setMid(-1)
    setFound(false)
    setIsPlaying(false)
    generateSteps(newArray, target)
  }, [arraySize, target])

  // Generate binary search steps
  const generateSteps = (arr, targetValue) => {
    const steps = []
    let leftIdx = 0
    let rightIdx = arr.length - 1
    let foundTarget = false

    steps.push({
      type: 'start',
      left: leftIdx,
      right: rightIdx,
      mid: -1,
      found: false,
      description: `Starting binary search for ${targetValue}. Initial range: [${leftIdx}, ${rightIdx}]`
    })

    while (leftIdx <= rightIdx && !foundTarget) {
      const midIdx = Math.floor((leftIdx + rightIdx) / 2)

      steps.push({
        type: 'calculate_mid',
        left: leftIdx,
        right: rightIdx,
        mid: midIdx,
        found: false,
        description: `Calculate mid = (${leftIdx} + ${rightIdx}) / 2 = ${midIdx}. Checking arr[${midIdx}] = ${arr[midIdx]}`
      })

      if (arr[midIdx] === targetValue) {
        foundTarget = true
        steps.push({
          type: 'found',
          left: leftIdx,
          right: rightIdx,
          mid: midIdx,
          found: true,
          description: `Found! arr[${midIdx}] = ${arr[midIdx]} equals target ${targetValue}`
        })
      } else if (arr[midIdx] < targetValue) {
        steps.push({
          type: 'go_right',
          left: leftIdx,
          right: rightIdx,
          mid: midIdx,
          found: false,
          description: `arr[${midIdx}] = ${arr[midIdx]} < ${targetValue}. Search right half: [${midIdx + 1}, ${rightIdx}]`
        })
        leftIdx = midIdx + 1
      } else {
        steps.push({
          type: 'go_left',
          left: leftIdx,
          right: rightIdx,
          mid: midIdx,
          found: false,
          description: `arr[${midIdx}] = ${arr[midIdx]} > ${targetValue}. Search left half: [${leftIdx}, ${midIdx - 1}]`
        })
        rightIdx = midIdx - 1
      }
    }

    if (!foundTarget) {
      steps.push({
        type: 'not_found',
        left: leftIdx,
        right: rightIdx,
        mid: -1,
        found: false,
        description: `Target ${targetValue} not found in the array`
      })
    }

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
      setLeft(step.left)
      setRight(step.right)
      setMid(step.mid)
      setFound(step.found)
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

  const handleTargetChange = (newTarget) => {
    setTarget(newTarget)
    generateSteps(array, newTarget)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const getBarColor = (index) => {
    if (found && index === mid) return 'bg-green-500'
    if (index === mid) return 'bg-yellow-500'
    if (index >= left && index <= right) return 'bg-blue-500'
    return 'bg-gray-600'
  }

  const getBarBorder = (index) => {
    if (index === left) return 'border-l-4 border-red-500'
    if (index === right) return 'border-r-4 border-red-500'
    return ''
  }

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
                  Binary Search Visualization
                </h1>
                <p className="text-gray-300 mt-1">
                  Watch how binary search efficiently finds elements in sorted arrays
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaSearch className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Array Searching</span>
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

            {/* Search Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-300 text-sm">Target:</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => handleTargetChange(Number(e.target.value))}
                  className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm w-16"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-300 text-sm">Size:</label>
                <select
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                  <option value={15}>15</option>
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
                </select>
              </div>

              <button
                onClick={generateArray}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaCrosshairs className="w-4 h-4" />
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
              <h3 className="text-white font-semibold mb-4">
                Array Visualization (Target: {target})
              </h3>
              <div className="flex items-end justify-center gap-2 h-40 mb-4">
                {array.map((value, index) => (
                  <div key={index} className="relative flex flex-col items-center">
                    <div
                      className={`${getBarColor(index)} ${getBarBorder(index)} transition-all duration-500 rounded-t-sm flex items-end justify-center`}
                      style={{
                        height: '80px',
                        width: `${Math.max(600 / array.length - 8, 30)}px`
                      }}
                    >
                      <span className="text-white text-sm font-bold mb-2">{value}</span>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">{index}</div>
                    {index === left && (
                      <div className="text-red-400 text-xs mt-1 font-bold">L</div>
                    )}
                    {index === right && (
                      <div className="text-red-400 text-xs mt-1 font-bold">R</div>
                    )}
                    {index === mid && (
                      <div className="text-yellow-400 text-xs mt-1 font-bold">M</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-600 rounded"></div>
                  <span className="text-gray-300">Out of Range</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-300">Search Range</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-300">Mid Point</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-300">Found</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-300">Left/Right Bounds</span>
                </div>
              </div>

              {/* Range Indicators */}
              <div className="mt-4 text-center">
                <div className="text-gray-300 text-sm">
                  Current Range: [{left >= 0 ? left : '?'}, {right >= 0 ? right : '?'}]
                  {mid >= 0 && ` | Mid: ${mid}`}
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
                  <span className="text-white ml-2">O(log n)</span>
                </div>
                <div>
                  <span className="text-gray-400">Space Complexity:</span>
                  <span className="text-white ml-2">O(1)</span>
                </div>
                <div>
                  <span className="text-gray-400">Requirement:</span>
                  <span className="text-yellow-400 ml-2">Sorted Array</span>
                </div>
                <div>
                  <span className="text-gray-400">Approach:</span>
                  <span className="text-white ml-2">Divide & Conquer</span>
                </div>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Pseudocode</h3>
              <pre className="text-gray-300 text-xs leading-relaxed overflow-x-auto">
                {`left = 0, right = n-1
while left <= right
  mid = (left + right) / 2
  if arr[mid] == target
    return mid
  else if arr[mid] < target
    left = mid + 1
  else
    right = mid - 1
return -1`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BinarySearch
