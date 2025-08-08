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
  FaArrowRight
} from 'react-icons/fa'

const LinkedListInsertion = () => {
  const router = useRouter()
  const [linkedList, setLinkedList] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedNodes, setHighlightedNodes] = useState([])
  const [newNode, setNewNode] = useState(null)
  const [steps, setSteps] = useState([])
  const [speed, setSpeed] = useState(1000)
  const [manualValue, setManualValue] = useState(42)
  const [insertPosition, setInsertPosition] = useState(0)

  // Generate initial linked list
  const generateLinkedList = useCallback(() => {
    const initialList = [
      { id: 0, value: 10, next: 1 },
      { id: 1, value: 20, next: 2 },
      { id: 2, value: 30, next: null }
    ]
    
    setLinkedList(initialList)
    setCurrentStep(0)
    setHighlightedNodes([])
    setNewNode(null)
    setIsPlaying(false)
    generateDemoSteps(initialList)
  }, [])

  // Generate demo insertion steps
  const generateDemoSteps = (initialList) => {
    const steps = []
    const insertions = [
      { value: 15, position: 1, type: 'middle' },
      { value: 5, position: 0, type: 'beginning' },
      { value: 40, position: -1, type: 'end' }
    ]

    let currentList = [...initialList]
    let nextId = Math.max(...currentList.map(n => n.id)) + 1

    steps.push({
      type: 'initial',
      list: [...currentList],
      highlighted: [],
      newNode: null,
      description: 'Initial linked list with 3 nodes. We will demonstrate different insertion operations.'
    })

    insertions.forEach((insertion, index) => {
      if (insertion.type === 'beginning') {
        // Insert at beginning
        const newNodeObj = { id: nextId++, value: insertion.value, next: currentList[0]?.id || null }
        
        steps.push({
          type: 'create_node',
          list: [...currentList],
          highlighted: [],
          newNode: newNodeObj,
          description: `Creating new node with value ${insertion.value} to insert at the beginning`
        })

        steps.push({
          type: 'insert_beginning',
          list: [...currentList],
          highlighted: [0],
          newNode: newNodeObj,
          description: `Inserting at beginning: New node points to current head (${currentList[0]?.value})`
        })

        currentList.unshift(newNodeObj)
        // Update IDs to maintain order
        currentList = currentList.map((node, idx) => ({ ...node, id: idx, next: idx < currentList.length - 1 ? idx + 1 : null }))

        steps.push({
          type: 'update_head',
          list: [...currentList],
          highlighted: [0],
          newNode: null,
          description: `Head now points to new node. Insertion at beginning complete.`
        })

      } else if (insertion.type === 'middle') {
        // Insert in middle
        const newNodeObj = { id: nextId++, value: insertion.value, next: null }
        
        steps.push({
          type: 'create_node',
          list: [...currentList],
          highlighted: [],
          newNode: newNodeObj,
          description: `Creating new node with value ${insertion.value} to insert at position ${insertion.position}`
        })

        steps.push({
          type: 'traverse',
          list: [...currentList],
          highlighted: Array.from({ length: insertion.position }, (_, i) => i),
          newNode: newNodeObj,
          description: `Traversing to position ${insertion.position - 1} to find insertion point`
        })

        const prevNode = currentList[insertion.position - 1]
        const nextNode = currentList[insertion.position]

        steps.push({
          type: 'insert_middle',
          list: [...currentList],
          highlighted: [insertion.position - 1, insertion.position],
          newNode: newNodeObj,
          description: `Inserting between node ${prevNode.value} and node ${nextNode.value}`
        })

        // Insert the new node
        currentList.splice(insertion.position, 0, newNodeObj)
        // Update IDs and next pointers
        currentList = currentList.map((node, idx) => ({ ...node, id: idx, next: idx < currentList.length - 1 ? idx + 1 : null }))

        steps.push({
          type: 'update_pointers',
          list: [...currentList],
          highlighted: [insertion.position],
          newNode: null,
          description: `Updated pointers: Previous node now points to new node, new node points to next node`
        })

      } else if (insertion.type === 'end') {
        // Insert at end
        const newNodeObj = { id: nextId++, value: insertion.value, next: null }
        
        steps.push({
          type: 'create_node',
          list: [...currentList],
          highlighted: [],
          newNode: newNodeObj,
          description: `Creating new node with value ${insertion.value} to insert at the end`
        })

        const lastIndex = currentList.length - 1
        steps.push({
          type: 'find_tail',
          list: [...currentList],
          highlighted: [lastIndex],
          newNode: newNodeObj,
          description: `Finding tail node (${currentList[lastIndex].value}) to insert after`
        })

        currentList.push(newNodeObj)
        // Update IDs and next pointers
        currentList = currentList.map((node, idx) => ({ ...node, id: idx, next: idx < currentList.length - 1 ? idx + 1 : null }))

        steps.push({
          type: 'insert_end',
          list: [...currentList],
          highlighted: [currentList.length - 1],
          newNode: null,
          description: `Inserted at end: Previous tail now points to new node, new node points to NULL`
        })
      }
    })

    steps.push({
      type: 'complete',
      list: [...currentList],
      highlighted: [],
      newNode: null,
      description: 'All insertion operations complete! The linked list now has 6 nodes.'
    })

    setSteps(steps)
  }

  // Manual insertion
  const insertNode = () => {
    if (insertPosition < 0 || insertPosition > linkedList.length) return

    let newList = [...linkedList]
    const newNodeObj = { 
      id: Math.max(...newList.map(n => n.id), -1) + 1, 
      value: manualValue, 
      next: null 
    }

    if (insertPosition === 0) {
      // Insert at beginning
      newList.unshift(newNodeObj)
    } else if (insertPosition === linkedList.length) {
      // Insert at end
      newList.push(newNodeObj)
    } else {
      // Insert in middle
      newList.splice(insertPosition, 0, newNodeObj)
    }

    // Update IDs and next pointers
    newList = newList.map((node, idx) => ({ 
      ...node, 
      id: idx, 
      next: idx < newList.length - 1 ? idx + 1 : null 
    }))

    setLinkedList(newList)
    setHighlightedNodes([insertPosition])
    setManualValue(manualValue + 1)

    setTimeout(() => setHighlightedNodes([]), 1500)
  }

  // Initialize
  useEffect(() => {
    generateLinkedList()
  }, [generateLinkedList])

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
      setLinkedList(step.list)
      setHighlightedNodes(step.highlighted)
      setNewNode(step.newNode)
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

  const getNodeColor = (index) => {
    if (highlightedNodes.includes(index)) return 'bg-yellow-500 border-yellow-400'
    return 'bg-blue-500 border-blue-400'
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
                  Linked List Insertion
                </h1>
                <p className="text-gray-400 text-sm">Dynamic insertion operations in linked lists</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaPlus className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Node Insertion</span>
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

              {/* Manual Insertion */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Manual Insertion</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="number"
                      value={manualValue}
                      onChange={(e) => setManualValue(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Value to insert"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Position: {insertPosition}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={linkedList.length}
                      value={insertPosition}
                      onChange={(e) => setInsertPosition(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Beginning</span>
                      <span>End</span>
                    </div>
                  </div>
                  <button
                    onClick={insertNode}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPlus className="w-3 h-3" />
                    Insert Node
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
                    onClick={generateLinkedList}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Reset Demo
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

              {/* List Status */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">List Status:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Length:</strong> {linkedList.length} nodes</p>
                  <p><strong>Head:</strong> {linkedList[0]?.value || 'Empty'}</p>
                  <p><strong>Tail:</strong> {linkedList[linkedList.length - 1]?.value || 'Empty'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Linked List Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Linked List Visualization */}
              <div className="bg-gray-900 rounded-lg p-8 overflow-x-auto">
                <div className="flex flex-col items-center space-y-6">
                  {/* New Node (if creating) */}
                  {newNode && (
                    <div className="flex items-center space-x-4">
                      <div className="text-purple-400 font-bold">NEW NODE:</div>
                      <div className="flex items-center border-2 rounded-lg bg-purple-500 border-purple-400">
                        <div className="px-6 py-4 text-white font-bold">
                          {newNode.value}
                        </div>
                        <div className="border-l-2 border-current px-3 py-4 text-white text-sm">
                          {newNode.next !== null ? '→' : 'NULL'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main Linked List */}
                  <div className="flex items-center space-x-4 min-w-max">
                    <div className="text-green-400 font-bold">HEAD</div>
                    <FaArrowRight className="text-green-400" />
                    
                    {linkedList.map((node, index) => (
                      <React.Fragment key={node.id}>
                        <div className={`flex items-center border-2 rounded-lg ${getNodeColor(index)} transition-all duration-500`}>
                          <div className="px-6 py-4 text-white font-bold">
                            {node.value}
                          </div>
                          <div className="border-l-2 border-current px-3 py-4 text-white text-sm">
                            {node.next !== null ? '→' : 'NULL'}
                          </div>
                        </div>
                        
                        {node.next !== null && (
                          <FaArrowRight className="text-blue-400" />
                        )}
                        
                        {node.next === null && (
                          <>
                            <FaArrowRight className="text-red-400" />
                            <div className="text-red-400 font-bold">NULL</div>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Position indicators */}
                  <div className="flex items-center space-x-4 min-w-max">
                    <div className="w-12 text-xs text-gray-400 text-center">HEAD</div>
                    <div className="w-4"></div>
                    {linkedList.map((_, index) => (
                      <React.Fragment key={index}>
                        <div className="text-gray-400 text-sm text-center w-20">
                          Pos {index}
                        </div>
                        {index < linkedList.length - 1 && <div className="w-4"></div>}
                      </React.Fragment>
                    ))}
                    <div className="w-4"></div>
                    <div className="w-12 text-xs text-gray-400 text-center">NULL</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Use manual insertion or play demo to see insertion operations'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Insertion Complexity:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>At Beginning:</strong> O(1) - Just update head pointer</p>
                  <p><strong>At End:</strong> O(n) - Must traverse to find tail</p>
                  <p><strong>At Position:</strong> O(n) - Must traverse to position</p>
                  <p><strong>Memory:</strong> Dynamic allocation, grows as needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkedListInsertion
