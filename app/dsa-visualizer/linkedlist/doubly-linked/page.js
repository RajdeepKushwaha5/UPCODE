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
  FaLink,
  FaArrowRight,
  FaPlus
} from 'react-icons/fa'

const DoublyLinkedListOperations = () => {
  const router = useRouter()
  const [list, setList] = useState(null)
  const [operation, setOperation] = useState('insert')
  const [value, setValue] = useState(10)
  const [position, setPosition] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [highlightedLinks, setHighlightedLinks] = useState(new Set())
  const [operationInfo, setOperationInfo] = useState('')
  const [manualValue, setManualValue] = useState('')

  // Doubly Linked List Node class
  class DoublyNode {
    constructor(data) {
      this.data = data
      this.prev = null
      this.next = null
      this.id = `node-${data}-${Date.now()}-${Math.random()}`
    }
  }

  // Doubly Linked List class
  class DoublyLinkedList {
    constructor() {
      this.head = null
      this.tail = null
      this.size = 0
    }

    // Insert at beginning
    insertAtBeginning(data, steps = []) {
      const newNode = new DoublyNode(data)
      
      steps.push({
        type: 'create_node',
        currentNode: newNode.id,
        highlighted: new Set([newNode.id]),
        highlightedLinks: new Set(),
        operationInfo: `Created new node with data ${data}`,
        description: `Creating new node with value ${data}`
      })

      if (!this.head) {
        this.head = newNode
        this.tail = newNode
        
        steps.push({
          type: 'set_head_tail',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id]),
          highlightedLinks: new Set(),
          operationInfo: `List was empty. Set both head and tail to new node`,
          description: `Empty list: setting new node as both head and tail`
        })
      } else {
        steps.push({
          type: 'link_next',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id, this.head.id]),
          highlightedLinks: new Set([`${newNode.id}-next`]),
          operationInfo: `Linking new node's next to current head`,
          description: `Step 1: Set new node's next pointer to current head`
        })

        newNode.next = this.head
        
        steps.push({
          type: 'link_prev',
          currentNode: this.head.id,
          highlighted: new Set([newNode.id, this.head.id]),
          highlightedLinks: new Set([`${this.head.id}-prev`]),
          operationInfo: `Linking current head's prev to new node`,
          description: `Step 2: Set current head's prev pointer to new node`
        })

        this.head.prev = newNode
        
        steps.push({
          type: 'update_head',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id]),
          highlightedLinks: new Set(),
          operationInfo: `Updated head pointer to new node`,
          description: `Step 3: Update head pointer to new node`
        })

        this.head = newNode
      }

      this.size++

      steps.push({
        type: 'complete',
        currentNode: null,
        highlighted: new Set(),
        highlightedLinks: new Set(),
        operationInfo: `Insertion complete. List size: ${this.size}`,
        description: `Successfully inserted ${data} at the beginning. New size: ${this.size}`
      })
    }

    // Insert at end
    insertAtEnd(data, steps = []) {
      const newNode = new DoublyNode(data)
      
      steps.push({
        type: 'create_node',
        currentNode: newNode.id,
        highlighted: new Set([newNode.id]),
        highlightedLinks: new Set(),
        operationInfo: `Created new node with data ${data}`,
        description: `Creating new node with value ${data}`
      })

      if (!this.head) {
        this.head = newNode
        this.tail = newNode
        
        steps.push({
          type: 'set_head_tail',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id]),
          highlightedLinks: new Set(),
          operationInfo: `List was empty. Set both head and tail to new node`,
          description: `Empty list: setting new node as both head and tail`
        })
      } else {
        steps.push({
          type: 'link_prev_tail',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id, this.tail.id]),
          highlightedLinks: new Set([`${newNode.id}-prev`]),
          operationInfo: `Linking new node's prev to current tail`,
          description: `Step 1: Set new node's prev pointer to current tail`
        })

        newNode.prev = this.tail
        
        steps.push({
          type: 'link_next_tail',
          currentNode: this.tail.id,
          highlighted: new Set([newNode.id, this.tail.id]),
          highlightedLinks: new Set([`${this.tail.id}-next`]),
          operationInfo: `Linking current tail's next to new node`,
          description: `Step 2: Set current tail's next pointer to new node`
        })

        this.tail.next = newNode
        
        steps.push({
          type: 'update_tail',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id]),
          highlightedLinks: new Set(),
          operationInfo: `Updated tail pointer to new node`,
          description: `Step 3: Update tail pointer to new node`
        })

        this.tail = newNode
      }

      this.size++

      steps.push({
        type: 'complete',
        currentNode: null,
        highlighted: new Set(),
        highlightedLinks: new Set(),
        operationInfo: `Insertion complete. List size: ${this.size}`,
        description: `Successfully inserted ${data} at the end. New size: ${this.size}`
      })
    }

    // Insert at position
    insertAtPosition(data, pos, steps = []) {
      if (pos < 0 || pos > this.size) {
        steps.push({
          type: 'error',
          currentNode: null,
          highlighted: new Set(),
          highlightedLinks: new Set(),
          operationInfo: `Invalid position ${pos}. Must be between 0 and ${this.size}`,
          description: `Error: Position ${pos} is out of bounds`
        })
        return
      }

      if (pos === 0) {
        this.insertAtBeginning(data, steps)
        return
      }

      if (pos === this.size) {
        this.insertAtEnd(data, steps)
        return
      }

      const newNode = new DoublyNode(data)
      
      steps.push({
        type: 'create_node',
        currentNode: newNode.id,
        highlighted: new Set([newNode.id]),
        highlightedLinks: new Set(),
        operationInfo: `Created new node with data ${data}`,
        description: `Creating new node with value ${data} for position ${pos}`
      })

      let current = this.head
      
      for (let i = 0; i < pos; i++) {
        steps.push({
          type: 'traverse',
          currentNode: current.id,
          highlighted: new Set([current.id]),
          highlightedLinks: new Set(),
          operationInfo: `Traversing to position ${pos}. Currently at position ${i}`,
          description: `Traversing: currently at position ${i}, target position ${pos}`
        })
        current = current.next
      }

      steps.push({
        type: 'found_position',
        currentNode: current.id,
        highlighted: new Set([current.id]),
        highlightedLinks: new Set(),
        operationInfo: `Found position ${pos}. Node to be shifted: ${current.data}`,
        description: `Reached position ${pos}. Will insert before node ${current.data}`
      })

      // Link new node
      newNode.next = current
      newNode.prev = current.prev

      steps.push({
        type: 'link_new_node',
        currentNode: newNode.id,
        highlighted: new Set([newNode.id, current.id, current.prev?.id].filter(Boolean)),
        highlightedLinks: new Set([`${newNode.id}-next`, `${newNode.id}-prev`]),
        operationInfo: `Linked new node between ${current.prev?.data || 'null'} and ${current.data}`,
        description: `Step 1: Set new node's next to current, prev to current's prev`
      })

      if (current.prev) {
        current.prev.next = newNode
      }
      current.prev = newNode

      steps.push({
        type: 'update_links',
        currentNode: newNode.id,
        highlighted: new Set([newNode.id, current.id]),
        highlightedLinks: new Set([`${current.id}-prev`, `${newNode.prev?.id || 'null'}-next`]),
        operationInfo: `Updated adjacent nodes to point to new node`,
        description: `Step 2: Update adjacent nodes' pointers to new node`
      })

      this.size++

      steps.push({
        type: 'complete',
        currentNode: null,
        highlighted: new Set(),
        highlightedLinks: new Set(),
        operationInfo: `Insertion complete. List size: ${this.size}`,
        description: `Successfully inserted ${data} at position ${pos}. New size: ${this.size}`
      })
    }

    // Delete node with value
    delete(data, steps = []) {
      if (!this.head) {
        steps.push({
          type: 'empty_list',
          currentNode: null,
          highlighted: new Set(),
          highlightedLinks: new Set(),
          operationInfo: `List is empty. Nothing to delete`,
          description: `Cannot delete from empty list`
        })
        return
      }

      let current = this.head
      let position = 0

      // Find the node
      while (current && current.data !== data) {
        steps.push({
          type: 'search',
          currentNode: current.id,
          highlighted: new Set([current.id]),
          highlightedLinks: new Set(),
          operationInfo: `Searching for ${data}. Current node: ${current.data}`,
          description: `Searching: comparing ${data} with ${current.data}`
        })
        current = current.next
        position++
      }

      if (!current) {
        steps.push({
          type: 'not_found',
          currentNode: null,
          highlighted: new Set(),
          highlightedLinks: new Set(),
          operationInfo: `Value ${data} not found in the list`,
          description: `Node with value ${data} not found`
        })
        return
      }

      steps.push({
        type: 'found',
        currentNode: current.id,
        highlighted: new Set([current.id]),
        highlightedLinks: new Set(),
        operationInfo: `Found node ${data} at position ${position}`,
        description: `Found node with value ${data} at position ${position}`
      })

      // Case 1: Only one node
      if (this.size === 1) {
        this.head = null
        this.tail = null
        
        steps.push({
          type: 'delete_only_node',
          currentNode: current.id,
          highlighted: new Set([current.id]),
          highlightedLinks: new Set(),
          operationInfo: `Deleting only node. List will become empty`,
          description: `Only one node in list. Setting head and tail to null`
        })
      }
      // Case 2: Delete head
      else if (current === this.head) {
        this.head = current.next
        this.head.prev = null
        
        steps.push({
          type: 'delete_head',
          currentNode: current.id,
          highlighted: new Set([current.id, this.head.id]),
          highlightedLinks: new Set([`${this.head.id}-prev`]),
          operationInfo: `Deleting head node. New head: ${this.head.data}`,
          description: `Deleting head: update head pointer and set new head's prev to null`
        })
      }
      // Case 3: Delete tail
      else if (current === this.tail) {
        this.tail = current.prev
        this.tail.next = null
        
        steps.push({
          type: 'delete_tail',
          currentNode: current.id,
          highlighted: new Set([current.id, this.tail.id]),
          highlightedLinks: new Set([`${this.tail.id}-next`]),
          operationInfo: `Deleting tail node. New tail: ${this.tail.data}`,
          description: `Deleting tail: update tail pointer and set new tail's next to null`
        })
      }
      // Case 4: Delete middle node
      else {
        current.prev.next = current.next
        current.next.prev = current.prev
        
        steps.push({
          type: 'delete_middle',
          currentNode: current.id,
          highlighted: new Set([current.id, current.prev.id, current.next.id]),
          highlightedLinks: new Set([`${current.prev.id}-next`, `${current.next.id}-prev`]),
          operationInfo: `Deleting middle node. Linking ${current.prev.data} to ${current.next.data}`,
          description: `Deleting middle node: link previous and next nodes together`
        })
      }

      this.size--

      steps.push({
        type: 'complete',
        currentNode: null,
        highlighted: new Set(),
        highlightedLinks: new Set(),
        operationInfo: `Deletion complete. List size: ${this.size}`,
        description: `Successfully deleted ${data}. New size: ${this.size}`
      })
    }

    // Convert to array for rendering
    toArray() {
      const result = []
      let current = this.head
      while (current) {
        result.push(current)
        current = current.next
      }
      return result
    }

    // Get size
    getSize() {
      return this.size
    }
  }

  // Initialize list
  const initializeList = useCallback(() => {
    const newList = new DoublyLinkedList()
    
    // Add some initial values
    const initialValues = [20, 30, 40]
    initialValues.forEach(val => {
      const steps = []
      newList.insertAtEnd(val, steps)
    })
    
    setList(newList)
    setCurrentStep(0)
    setCurrentNode(null)
    setHighlightedNodes(new Set())
    setHighlightedLinks(new Set())
    setOperationInfo('')
    setIsPlaying(false)
    setSteps([])
  }, [])

  // Generate operation steps
  const generateOperationSteps = useCallback((operation, value, position) => {
    if (!list) return

    const listCopy = new DoublyLinkedList()
    listCopy.head = list.head
    listCopy.tail = list.tail
    listCopy.size = list.size

    const steps = []

    steps.push({
      type: 'start',
      currentNode: null,
      highlighted: new Set(),
      highlightedLinks: new Set(),
      operationInfo: `Starting ${operation} operation`,
      description: `Beginning ${operation} operation with value ${value}${position !== undefined ? ` at position ${position}` : ''}`
    })

    switch (operation) {
      case 'insert_beginning':
        listCopy.insertAtBeginning(value, steps)
        break
      case 'insert_end':
        listCopy.insertAtEnd(value, steps)
        break
      case 'insert_position':
        listCopy.insertAtPosition(value, position, steps)
        break
      case 'delete':
        listCopy.delete(value, steps)
        break
    }

    setSteps(steps)
    setCurrentStep(0)
  }, [list])

  // Execute operation
  const executeOperation = () => {
    if (!list) return

    generateOperationSteps(operation, value, position)
  }

  // Execute manual operation
  const executeManualOperation = () => {
    const val = parseInt(manualValue)
    if (isNaN(val)) return
    
    setValue(val)
    setManualValue('')
    
    setTimeout(() => {
      generateOperationSteps(operation, val, position)
    }, 100)
  }

  // Initialize
  useEffect(() => {
    initializeList()
  }, [initializeList])

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

  // Update visualization state
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setCurrentNode(step.currentNode)
      setHighlightedNodes(step.highlighted || new Set())
      setHighlightedLinks(step.highlightedLinks || new Set())
      setOperationInfo(step.operationInfo || '')
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

  // Get node color
  const getNodeColor = (node) => {
    if (highlightedNodes.has(node.id)) {
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    return 'fill-blue-500 stroke-blue-400'
  }

  // Get link color
  const getLinkColor = (linkId) => {
    if (highlightedLinks.has(linkId)) {
      return 'stroke-yellow-400 stroke-4 animate-pulse'
    }
    return 'stroke-gray-400 stroke-2'
  }

  // Render doubly linked list
  const renderList = () => {
    if (!list) return null

    const nodes = list.toArray()
    const nodeWidth = 80
    const nodeHeight = 60
    const spacing = 150

    return (
      <g>
        {/* Render nodes and links */}
        {nodes.map((node, index) => {
          const x = 100 + index * spacing
          const y = 200

          return (
            <g key={node.id}>
              {/* Next pointer line */}
              {node.next && (
                <>
                  <line
                    x1={x + nodeWidth / 2}
                    y1={y}
                    x2={x + spacing - nodeWidth / 2}
                    y2={y}
                    className={getLinkColor(`${node.id}-next`)}
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x={x + spacing / 2}
                    y={y - 15}
                    textAnchor="middle"
                    className="fill-gray-400 text-xs"
                  >
                    next
                  </text>
                </>
              )}

              {/* Prev pointer line */}
              {node.prev && (
                <>
                  <line
                    x1={x - nodeWidth / 2}
                    y1={y + 20}
                    x2={x - spacing + nodeWidth / 2}
                    y2={y + 20}
                    className={getLinkColor(`${node.id}-prev`)}
                    markerEnd="url(#arrowhead-back)"
                  />
                  <text
                    x={x - spacing / 2}
                    y={y + 40}
                    textAnchor="middle"
                    className="fill-gray-400 text-xs"
                  >
                    prev
                  </text>
                </>
              )}

              {/* Node */}
              <rect
                x={x - nodeWidth / 2}
                y={y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx="8"
                className={`${getNodeColor(node)} stroke-2 transition-all duration-500`}
              />

              {/* Data */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                className="fill-white font-bold text-lg"
              >
                {node.data}
              </text>

              {/* Node indicators */}
              {node === list.head && (
                <text
                  x={x}
                  y={y - nodeHeight / 2 - 10}
                  textAnchor="middle"
                  className="fill-green-400 font-bold text-sm"
                >
                  HEAD
                </text>
              )}

              {node === list.tail && (
                <text
                  x={x}
                  y={y + nodeHeight / 2 + 20}
                  textAnchor="middle"
                  className="fill-red-400 font-bold text-sm"
                >
                  TAIL
                </text>
              )}
            </g>
          )
        })}

        {/* Arrow markers */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className="fill-gray-400"
            />
          </marker>
          <marker
            id="arrowhead-back"
            markerWidth="10"
            markerHeight="7"
            refX="1"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="10 0, 0 3.5, 10 7"
              className="fill-gray-400"
            />
          </marker>
        </defs>
      </g>
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Doubly Linked List
                </h1>
                <p className="text-gray-400 text-sm">Bidirectional linked list with prev/next pointers</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaLink className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-sm">Bidirectional Links</span>
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
                Operations
              </h2>
              
              {/* Operation Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Operation Type
                </label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="insert_beginning">Insert at Beginning</option>
                  <option value="insert_end">Insert at End</option>
                  <option value="insert_position">Insert at Position</option>
                  <option value="delete">Delete Value</option>
                </select>
              </div>

              {/* Value Input */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Value: {value}
                </label>
                <input
                  type="range"
                  min="1"
                  max="99"
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Position Input (for insert at position) */}
              {operation === 'insert_position' && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Position: {position}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={list?.getSize() || 0}
                    value={position}
                    onChange={(e) => setPosition(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Max position: {list?.getSize() || 0}
                  </div>
                </div>
              )}

              {/* Manual Input */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Manual Input
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter value"
                  />
                  <button
                    onClick={executeManualOperation}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Execute Button */}
              <button
                onClick={executeOperation}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors mb-6 flex items-center justify-center gap-2"
              >
                <FaArrowRight className="w-4 h-4" />
                Execute {operation.replace('_', ' ').toUpperCase()}
              </button>
              
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
                  onClick={initializeList}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset List
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
              </div>

              {/* List Info */}
              <div className="mt-6 bg-purple-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">List Info:</h3>
                <div className="text-sm text-purple-200 space-y-1">
                  <p>Size: {list?.getSize() || 0}</p>
                  <p>Head: {list?.head?.data || 'null'}</p>
                  <p>Tail: {list?.tail?.data || 'null'}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span className="text-gray-300">Normal Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500"></div>
                    <span className="text-gray-300">Active Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span className="text-gray-300">Head Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span className="text-gray-300">Tail Node</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Doubly Linked List Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* List Visualization */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="overflow-x-auto">
                  <svg width="1200" height="400" className="mx-auto">
                    {renderList()}
                  </svg>
                </div>
              </div>

              {/* Operation Info */}
              {operationInfo && (
                <div className="bg-purple-700 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-2">Operation Status:</h3>
                  <p className="text-purple-200">{operationInfo}</p>
                </div>
              )}

              {/* Doubly Linked List Operations */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Doubly Linked List Operations:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-green-800 rounded p-3">
                    <div className="text-green-400 font-medium">Insert Beginning</div>
                    <div className="text-gray-300">O(1) - Update head and first node's prev</div>
                  </div>
                  <div className="bg-blue-800 rounded p-3">
                    <div className="text-blue-400 font-medium">Insert End</div>
                    <div className="text-gray-300">O(1) - Update tail and last node's next</div>
                  </div>
                  <div className="bg-yellow-800 rounded p-3">
                    <div className="text-yellow-400 font-medium">Insert Position</div>
                    <div className="text-gray-300">O(n) - Traverse to position, update 4 pointers</div>
                  </div>
                  <div className="bg-red-800 rounded p-3">
                    <div className="text-red-400 font-medium">Delete</div>
                    <div className="text-gray-300">O(n) - Find node, update adjacent pointers</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Select an operation to begin visualization'}
                </p>
              </div>

              {/* Algorithm Analysis */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Doubly Linked List Properties</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Advantages:</strong> Bidirectional traversal, O(1) deletion if node reference known</p>
                  <p><strong>Memory:</strong> Extra space for prev pointer (double space overhead)</p>
                  <p><strong>Insert/Delete at ends:</strong> O(1) - direct head/tail access</p>
                  <p><strong>Search:</strong> O(n) - linear traversal required</p>
                  <p><strong>Applications:</strong> Undo operations, music playlists, browser history</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoublyLinkedListOperations
