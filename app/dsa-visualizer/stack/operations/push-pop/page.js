'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaEye,
  FaTrash,
  FaDatabase,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'

const StackOperations = () => {
  const router = useRouter()
  const [stack, setStack] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [maxSize, setMaxSize] = useState(8)
  const [message, setMessage] = useState('')
  const [animatingIndex, setAnimatingIndex] = useState(-1)
  const [operation, setOperation] = useState('')

  const showMessage = (msg, type = 'info') => {
    setMessage({ text: msg, type })
    setTimeout(() => setMessage(''), 3000)
  }

  const push = () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value', 'error')
      return
    }

    if (stack.length >= maxSize) {
      showMessage('Stack Overflow! Cannot push more elements', 'error')
      return
    }

    const newValue = inputValue.trim()
    setOperation('push')
    setAnimatingIndex(stack.length)

    setTimeout(() => {
      setStack(prev => [...prev, newValue])
      setInputValue('')
      setAnimatingIndex(-1)
      setOperation('')
      showMessage(`Pushed "${newValue}" to stack`, 'success')
    }, 500)
  }

  const pop = () => {
    if (stack.length === 0) {
      showMessage('Stack Underflow! Cannot pop from empty stack', 'error')
      return
    }

    const poppedValue = stack[stack.length - 1]
    setOperation('pop')
    setAnimatingIndex(stack.length - 1)

    setTimeout(() => {
      setStack(prev => prev.slice(0, -1))
      setAnimatingIndex(-1)
      setOperation('')
      showMessage(`Popped "${poppedValue}" from stack`, 'success')
    }, 500)
  }

  const peek = () => {
    if (stack.length === 0) {
      showMessage('Stack is empty! Nothing to peek', 'error')
      return
    }

    const topValue = stack[stack.length - 1]
    setOperation('peek')
    setAnimatingIndex(stack.length - 1)

    setTimeout(() => {
      setAnimatingIndex(-1)
      setOperation('')
      showMessage(`Top element is "${topValue}"`, 'info')
    }, 1000)
  }

  const clear = () => {
    setStack([])
    setMessage('')
    showMessage('Stack cleared', 'info')
  }

  const isEmpty = () => {
    const empty = stack.length === 0
    showMessage(empty ? 'Stack is empty' : 'Stack is not empty', 'info')
  }

  const isFull = () => {
    const full = stack.length >= maxSize
    showMessage(full ? 'Stack is full' : 'Stack is not full', 'info')
  }

  const getElementStyle = (index) => {
    let baseStyle = "transition-all duration-500 transform"

    if (animatingIndex === index) {
      if (operation === 'push') {
        return `${baseStyle} scale-110 shadow-lg bg-green-500 animate-bounce`
      } else if (operation === 'pop') {
        return `${baseStyle} scale-75 opacity-50 bg-red-500`
      } else if (operation === 'peek') {
        return `${baseStyle} scale-110 shadow-lg bg-yellow-500 animate-pulse`
      }
    }

    return `${baseStyle} bg-blue-500 hover:bg-blue-600`
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Stack Operations
                </h1>
                <p className="text-gray-300 mt-1">
                  Interactive stack visualization with push, pop, and peek operations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaDatabase className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">LIFO Data Structure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Stack Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Stack Visualization</h3>
                <div className="text-sm text-gray-400">
                  Size: {stack.length} / {maxSize}
                </div>
              </div>

              {/* Stack Container */}
              <div className="relative">
                {/* Stack Base */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Empty Stack Indicator */}
                    {stack.length === 0 && (
                      <div className="w-32 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <FaDatabase className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm">Empty Stack</div>
                        </div>
                      </div>
                    )}

                    {/* Stack Elements */}
                    {stack.length > 0 && (
                      <div className="flex flex-col-reverse items-center gap-1">
                        {/* Stack Base Line */}
                        <div className="w-36 h-2 bg-gray-600 rounded-full"></div>

                        {/* Stack Elements */}
                        {stack.map((value, index) => (
                          <div
                            key={`${value}-${index}`}
                            className={`
                              w-32 h-12 rounded-lg flex items-center justify-center
                              text-white font-semibold border-2 border-white/20
                              ${getElementStyle(index)}
                            `}
                          >
                            {value}
                          </div>
                        ))}

                        {/* Top Indicator */}
                        {stack.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <FaArrowUp className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm font-semibold">TOP</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Max Capacity Indicator */}
                    <div className="absolute -right-16 top-0 flex flex-col items-center text-xs text-gray-500">
                      <div className="writing-mode-vertical text-orientation-mixed">
                        Max: {maxSize}
                      </div>
                      <div className="w-px h-64 bg-gray-600 mt-2"></div>
                    </div>
                  </div>
                </div>

                {/* LIFO Indicator */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-full">
                    <FaArrowUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Last In, First Out (LIFO)</span>
                    <FaArrowDown className="w-4 h-4 text-red-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Input Controls */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Operations</h3>

              {/* Push Operation */}
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Push Element</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && push()}
                      placeholder="Enter value"
                      className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={push}
                      disabled={operation === 'push'}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                    >
                      <FaPlus className="w-4 h-4" />
                      Push
                    </button>
                  </div>
                </div>

                {/* Other Operations */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={pop}
                    disabled={stack.length === 0 || operation === 'pop'}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaMinus className="w-3 h-3" />
                    Pop
                  </button>

                  <button
                    onClick={peek}
                    disabled={stack.length === 0 || operation === 'peek'}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaEye className="w-3 h-3" />
                    Peek
                  </button>

                  <button
                    onClick={isEmpty}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors text-sm"
                  >
                    Is Empty?
                  </button>

                  <button
                    onClick={isFull}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors text-sm"
                  >
                    Is Full?
                  </button>
                </div>

                <button
                  onClick={clear}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <FaTrash className="w-4 h-4" />
                  Clear Stack
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Settings</h3>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Max Stack Size</label>
                <select
                  value={maxSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value)
                    setMaxSize(newSize)
                    if (stack.length > newSize) {
                      setStack(prev => prev.slice(0, newSize))
                      showMessage(`Stack trimmed to ${newSize} elements`, 'info')
                    }
                  }}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>

            {/* Stack Info */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Stack Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Size:</span>
                  <span className="text-white">{stack.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Capacity:</span>
                  <span className="text-white">{maxSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Is Empty:</span>
                  <span className={stack.length === 0 ? "text-green-400" : "text-red-400"}>
                    {stack.length === 0 ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Is Full:</span>
                  <span className={stack.length >= maxSize ? "text-red-400" : "text-green-400"}>
                    {stack.length >= maxSize ? "Yes" : "No"}
                  </span>
                </div>
                {stack.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Top Element:</span>
                    <span className="text-yellow-400 font-semibold">{stack[stack.length - 1]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Algorithm Complexity */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Time Complexity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Push:</span>
                  <span className="text-green-400">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pop:</span>
                  <span className="text-green-400">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Peek/Top:</span>
                  <span className="text-green-400">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Is Empty:</span>
                  <span className="text-green-400">O(1)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="fixed bottom-6 right-6 max-w-sm">
            <div className={`
              p-4 rounded-lg border shadow-lg animate-slideInRight
              ${message.type === 'success' ? 'bg-green-800 border-green-600 text-green-100' : ''}
              ${message.type === 'error' ? 'bg-red-800 border-red-600 text-red-100' : ''}
              ${message.type === 'info' ? 'bg-blue-800 border-blue-600 text-blue-100' : ''}
            `}>
              {message.text}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StackOperations
