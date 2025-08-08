'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlay, FaPause, FaRedo, FaStepForward, FaStepBackward, FaArrowLeft, FaSearch } from 'react-icons/fa'

const LinearSearch = () => {
  const router = useRouter()
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 5])
  const [target, setTarget] = useState(22)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [found, setFound] = useState(false)
  const [foundIndex, setFoundIndex] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(500)
  const [comparisons, setComparisons] = useState(0)

  const resetAnimation = () => {
    setCurrentIndex(-1)
    setFound(false)
    setFoundIndex(-1)
    setIsRunning(false)
    setIsPaused(false)
    setStep(0)
    setComparisons(0)
  }

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1)
    setArray(newArray)
    setTarget(newArray[Math.floor(Math.random() * newArray.length)])
    resetAnimation()
  }

  const stepForward = () => {
    if (step >= array.length || found) return

    const nextStep = step
    setCurrentIndex(nextStep)
    setComparisons(prev => prev + 1)

    if (array[nextStep] === target) {
      setFound(true)
      setFoundIndex(nextStep)
      setIsRunning(false)
      return
    }

    setStep(nextStep + 1)

    if (nextStep + 1 >= array.length && !found) {
      setIsRunning(false)
    }
  }

  const stepBackward = () => {
    if (step <= 0) return

    const prevStep = step - 1
    setStep(prevStep)
    setCurrentIndex(prevStep - 1)
    setComparisons(prev => Math.max(0, prev - 1))
    setFound(false)
    setFoundIndex(-1)
  }

  const startAnimation = () => {
    if (found || step >= array.length) return

    setIsRunning(true)
    setIsPaused(false)
  }

  const pauseAnimation = () => {
    setIsRunning(false)
    setIsPaused(true)
  }

  useEffect(() => {
    let interval
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        stepForward()
      }, speed)
    }
    return () => clearInterval(interval)
  }, [isRunning, isPaused, step, speed, array, target, found])

  const getElementClass = (index) => {
    let baseClass = "flex items-center justify-center w-16 h-16 m-1 rounded-lg text-white font-bold text-lg transition-all duration-300 "

    if (found && index === foundIndex) {
      return baseClass + "bg-green-500 scale-110 shadow-lg"
    } else if (index === currentIndex) {
      return baseClass + "bg-red-500 scale-105 shadow-md"
    } else if (index < currentIndex) {
      return baseClass + "bg-gray-600"
    } else {
      return baseClass + "bg-blue-500"
    }
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
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <FaSearch className="text-blue-400" />
                  Linear Search
                </h1>
                <p className="text-gray-300 mt-1">
                  Sequential search through each element
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm">Time Complexity</div>
              <div className="text-white font-mono">O(n)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex justify-center items-center mb-8">
                <div className="flex flex-wrap justify-center">
                  {array.map((value, index) => (
                    <div key={index} className="relative">
                      <div className={getElementClass(index)}>
                        {value}
                      </div>
                      <div className="text-center text-gray-400 text-sm mt-2">
                        {index}
                      </div>
                      {index === currentIndex && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                            Checking
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Display */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-4 bg-gray-700 rounded-lg p-4">
                  <span className="text-gray-300">Target:</span>
                  <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold">
                    {target}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="text-center mb-6">
                {found ? (
                  <div className="text-green-400 text-lg font-semibold">
                    ✅ Element found at index {foundIndex}!
                  </div>
                ) : step >= array.length ? (
                  <div className="text-red-400 text-lg font-semibold">
                    ❌ Element not found in array
                  </div>
                ) : isRunning ? (
                  <div className="text-blue-400 text-lg font-semibold">
                    🔍 Searching... Current index: {currentIndex}
                  </div>
                ) : (
                  <div className="text-gray-400 text-lg">
                    Ready to search
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={isRunning ? pauseAnimation : startAnimation}
                  disabled={found || step >= array.length}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  {isRunning ? <FaPause /> : <FaPlay />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={stepForward}
                  disabled={isRunning || found || step >= array.length}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaStepForward />
                  Step
                </button>

                <button
                  onClick={stepBackward}
                  disabled={isRunning || step <= 0}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaStepBackward />
                  Back
                </button>

                <button
                  onClick={resetAnimation}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaRedo />
                  Reset
                </button>
              </div>

              {/* Speed Control */}
              <div className="flex justify-center items-center gap-4">
                <span className="text-gray-400">Speed:</span>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-gray-300 text-sm">{speed}ms</span>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Algorithm Info */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Algorithm Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Current Step:</span>
                  <span className="text-white ml-2">{step} / {array.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Comparisons:</span>
                  <span className="text-white ml-2">{comparisons}</span>
                </div>
                <div>
                  <span className="text-gray-400">Time Complexity:</span>
                  <span className="text-white ml-2">O(n)</span>
                </div>
                <div>
                  <span className="text-gray-400">Space Complexity:</span>
                  <span className="text-white ml-2">O(1)</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Controls</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Target Value:</label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => {
                      setTarget(Number(e.target.value))
                      resetAnimation()
                    }}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={generateRandomArray}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Generate Random Array
                </button>
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">How it Works</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>1. Start from the first element</p>
                <p>2. Compare with target value</p>
                <p>3. If match found, return index</p>
                <p>4. If not, move to next element</p>
                <p>5. Repeat until found or end reached</p>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-300">Unsearched</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-300">Currently Checking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span className="text-gray-300">Already Searched</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-300">Found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinearSearch
