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
  FaSync,
  FaLink,
  FaPlus
} from 'react-icons/fa'

const CircularLinkedListOperations = () => {
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
  const [traverseCount, setTraverseCount] = useState(1)
  const [operationInfo, setOperationInfo] = useState('')
  const [manualValue, setManualValue] = useState('')

  // Circular Linked List Node class
  class CircularNode {
    constructor(data) {
      this.data = data
      this.next = null
      this.id = `node-${data}-${Date.now()}-${Math.random()}`
    }
  }

  // Circular Linked List class
  class CircularLinkedList {
    constructor() {
      this.head = null
      this.size = 0
    }

    // Insert at beginning
    insertAtBeginning(data, steps = []) {
      const newNode = new CircularNode(data)
      
      steps.push({
        type: 'create_node',
        currentNode: newNode.id,
        highlighted: new Set([newNode.id]),
        highlightedLinks: new Set(),
        operationInfo: `Created new node with data ${data}`,
        description: `Creating new node with value ${data}`
      })

      if (!this.head) {
        // First node - points to itself
        newNode.next = newNode
        this.head = newNode
        
        steps.push({
          type: 'first_node_self_link',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id]),
          highlightedLinks: new Set([`${newNode.id}-self`]),
          operationInfo: `First node: linking to itself to maintain circular structure`,
          description: `Empty list: new node points to itself, becomes head`
        })
      } else {
        // Find the last node (node that points to head)
        let last = this.head
        while (last.next !== this.head) {
          last = last.next
        }

        steps.push({
          type: 'find_last_node',
          currentNode: last.id,
          highlighted: new Set([last.id, this.head.id]),
          highlightedLinks: new Set([`${last.id}-head`]),
          operationInfo: `Found last node ${last.data} that points to head`,
          description: `Step 1: Find last node that points to current head`
        })

        // New node points to current head
        newNode.next = this.head
        
        steps.push({
          type: 'link_new_to_head',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id, this.head.id]),
          highlightedLinks: new Set([`${newNode.id}-head`]),
          operationInfo: `Linking new node to current head ${this.head.data}`,
          description: `Step 2: Set new node's next pointer to current head`
        })

        // Last node points to new node
        last.next = newNode
        
        steps.push({
          type: 'link_last_to_new',
          currentNode: last.id,
          highlighted: new Set([last.id, newNode.id]),
          highlightedLinks: new Set([`${last.id}-new`]),
          operationInfo: `Linking last node ${last.data} to new node`,
          description: `Step 3: Set last node's next pointer to new node`
        })

        // Update head
        this.head = newNode
        
        steps.push({
          type: 'update_head',
          currentNode: newNode.id,
          highlighted: new Set([newNode.id]),
          highlightedLinks: new Set(),
          operationInfo: `Updated head pointer to new node`,
          description: `Step 4: Update head pointer to new node`
        })
      }

      this.size++

      steps.push({
        type: 'complete',
        currentNode: null,
        highlighted: new Set(),
        highlightedLinks: new Set(),
        operationInfo: `Insertion complete. List size: ${this.size}`,
        description: `Successfully inserted ${data} at beginning. Circular structure maintained.`
      })
    }

    // Insert at end
    insertAtEnd(data, steps = []) {
      if (!this.head) {
        this.insertAtBeginning(data, steps)
        return
      }

      const newNode = new CircularNode(data)
      
      steps.push({
        type: 'create_node',
        currentNode: newNode.id,
        highlighted: new Set([newNode.id]),
        highlightedLinks: new Set(),
        operationInfo: `Created new node with data ${data}`,
        description: `Creating new node with value ${data}`
      })

      // Find the last node
      let last = this.head
      while (last.next !== this.head) {
        steps.push({
          type: 'traverse_to_end',
          currentNode: last.id,
          highlighted: new Set([last.id]),
          highlightedLinks: new Set([`${last.id}-next`]),
          operationInfo: `Traversing: current node ${last.data}, next is ${last.next.data}`,
          description: `Traversing to find last node. Currently at ${last.data}`
        })
        last = last.next
      }

      steps.push({
        type: 'found_last_node',
        currentNode: last.id,
        highlighted: new Set([last.id, this.head.id]),
        highlightedLinks: new Set([`${last.id}-head`]),
        operationInfo: `Found last node ${last.data} that points back to head`,
        description: `Found last node ${last.data}. It currently points to head.`
      })

      // New node points to head
      newNode.next = this.head
      
      steps.push({
        type: 'link_new_to_head',
        currentNode: newNode.id,
        highlighted: new Set([newNode.id, this.head.id]),
        highlightedLinks: new Set([`${newNode.id}-head`]),
        operationInfo: `Linking new node to head to maintain circular structure`,
        description: `Step 1: Set new node's next pointer to head`
      })

      // Last node points to new node
      last.next = newNode
      
      steps.push({
        type: 'link_last_to_new',
        currentNode: last.id,
        highlighted: new Set([last.id, newNode.id]),
        highlightedLinks: new Set([`${last.id}-new`]),
        operationInfo: `Linking previous last node ${last.data} to new node`,
        description: `Step 2: Set previous last node's next to new node`
      })

      this.size++

      steps.push({
        type: 'complete',
        currentNode: null,
        highlighted: new Set(),
        highlightedLinks: new Set(),
        operationInfo: `Insertion complete. List size: ${this.size}`,
        description: `Successfully inserted ${data} at end. Circular structure maintained.`
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

      // Case 1: Only one node
      if (this.head.next === this.head) {
        if (this.head.data === data) {
          steps.push({
            type: 'delete_only_node',
            currentNode: this.head.id,
            highlighted: new Set([this.head.id]),
            highlightedLinks: new Set(),
            operationInfo: `Deleting only node ${data}. List will become empty`,
            description: `Only one node in list. Deleting it makes list empty.`
          })
          
          this.head = null
          this.size--
          
          steps.push({
            type: 'complete',
            currentNode: null,
            highlighted: new Set(),
            highlightedLinks: new Set(),
            operationInfo: `Deletion complete. List is now empty`,
            description: `Successfully deleted ${data}. List is now empty.`
          })
          return
        } else {
          steps.push({
            type: 'not_found',
            currentNode: this.head.id,
            highlighted: new Set([this.head.id]),
            highlightedLinks: new Set(),
            operationInfo: `Value ${data} not found in single-node list`,
            description: `Value ${data} not found. Only node contains ${this.head.data}.`
          })
          return
        }
      }

      // Case 2: Delete head node
      if (this.head.data === data) {
        steps.push({
          type: 'delete_head_found',
          currentNode: this.head.id,
          highlighted: new Set([this.head.id]),
          highlightedLinks: new Set(),
          operationInfo: `Found head node to delete: ${data}`,
          description: `Found head node to delete. Need to update last node's pointer.`
        })

        // Find last node
        let last = this.head
        while (last.next !== this.head) {
          last = last.next
        }

        steps.push({
          type: 'found_last_for_head_delete',
          currentNode: last.id,
          highlighted: new Set([last.id, this.head.id]),
          highlightedLinks: new Set([`${last.id}-head`]),
          operationInfo: `Found last node ${last.data} that points to head`,
          description: `Found last node. Will update its pointer to new head.`
        })

        // Update last node to point to new head
        last.next = this.head.next
        
        steps.push({
          type: 'update_last_to_new_head',
          currentNode: last.id,
          highlighted: new Set([last.id, this.head.next.id]),
          highlightedLinks: new Set([`${last.id}-newhead`]),
          operationInfo: `Updated last node to point to new head ${this.head.next.data}`,
          description: `Updated last node's pointer to maintain circular structure.`
        })

        // Update head
        this.head = this.head.next
        
        steps.push({
          type: 'update_head_pointer',
          currentNode: this.head.id,
          highlighted: new Set([this.head.id]),
          highlightedLinks: new Set(),
          operationInfo: `Updated head pointer to ${this.head.data}`,
          description: `Updated head pointer to next node.`
        })

        this.size--

        steps.push({
          type: 'complete',
          currentNode: null,
          highlighted: new Set(),
          highlightedLinks: new Set(),
          operationInfo: `Deletion complete. List size: ${this.size}`,
          description: `Successfully deleted head node ${data}. Circular structure maintained.`
        })
        return
      }

      // Case 3: Delete non-head node
      let current = this.head
      let prev = null

      // Find the node to delete
      do {
        if (current.data === data) {
          break
        }
        
        steps.push({
          type: 'search_node',
          currentNode: current.id,
          highlighted: new Set([current.id]),
          highlightedLinks: new Set(),
          operationInfo: `Searching for ${data}. Current node: ${current.data}`,
          description: `Searching: comparing ${data} with ${current.data}`
        })

        prev = current
        current = current.next
      } while (current !== this.head)

      if (current === this.head) {
        steps.push({
          type: 'not_found',
          currentNode: null,
          highlighted: new Set(),
          highlightedLinks: new Set(),
          operationInfo: `Value ${data} not found in the list`,
          description: `Completed circular traversal. Value ${data} not found.`
        })
        return
      }

      steps.push({
        type: 'found_node_to_delete',
        currentNode: current.id,
        highlighted: new Set([current.id, prev.id]),
        highlightedLinks: new Set(),
        operationInfo: `Found node to delete: ${data}. Previous node: ${prev.data}`,
        description: `Found node to delete. Will link previous node to next node.`
      })

      // Link previous node to next node
      prev.next = current.next
      
      steps.push({
        type: 'link_prev_to_next',
        currentNode: prev.id,
        highlighted: new Set([prev.id, current.next.id]),
        highlightedLinks: new Set([`${prev.id}-next`]),
        operationInfo: `Linked previous node ${prev.data} to next node ${current.next.data}`,
        description: `Bypassed deleted node by linking previous to next.`
      })

      this.size--

      steps.push({
        type: 'complete',
        currentNode: null,
        highlighted: new Set(),
        highlightedLinks: new Set(),
        operationInfo: `Deletion complete. List size: ${this.size}`,
        description: `Successfully deleted ${data}. Circular structure maintained.`
      })
    }

    // Traverse the list (for demonstration)
    traverse(count, steps = []) {
      if (!this.head) {
        steps.push({
          type: 'empty_traverse',
          currentNode: null,
          highlighted: new Set(),
          highlightedLinks: new Set(),
          operationInfo: `Cannot traverse empty list`,
          description: `List is empty - nothing to traverse`
        })
        return
      }

      let current = this.head
      let visited = 0
      
      steps.push({
        type: 'start_traverse',
        currentNode: current.id,
        highlighted: new Set([current.id]),
        highlightedLinks: new Set(),
        operationInfo: `Starting traversal from head node ${current.data}`,
        description: `Beginning circular traversal from head node`
      })

      while (visited < count) {
        steps.push({
          type: 'visit_node',
          currentNode: current.id,
          highlighted: new Set([current.id]),
          highlightedLinks: new Set([`${current.id}-next`]),
          operationInfo: `Visiting node ${current.data} (visit ${visited + 1}/${count})`,
          description: `Visiting node ${current.data}. Move ${visited + 1} of ${count}.`
        })

        current = current.next
        visited++

        if (visited < count) {
          steps.push({
            type: 'move_next',
            currentNode: current.id,
            highlighted: new Set([current.id]),
            highlightedLinks: new Set(),
            operationInfo: `Moved to next node: ${current.data}`,
            description: `Moved to next node in circular list: ${current.data}`
          })
        }
      }

      steps.push({
        type: 'traverse_complete',
        currentNode: null,
        highlighted: new Set(),
        highlightedLinks: new Set(),
        operationInfo: `Traversal complete. Visited ${count} nodes in circular list`,
        description: `Completed ${count} moves through the circular list`
      })
    }

    // Convert to array for rendering (limit to avoid infinite loop)
    toArray(maxNodes = 20) {
      if (!this.head) return []
      
      const result = []
      let current = this.head
      let count = 0
      
      do {
        result.push(current)
        current = current.next
        count++
      } while (current !== this.head && count < maxNodes)
      
      return result
    }

    getSize() {
      return this.size
    }
  }

  // Initialize list
  const initializeList = useCallback(() => {
    const newList = new CircularLinkedList()
    
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

    const listCopy = new CircularLinkedList()
    listCopy.head = list.head
    listCopy.size = list.size

    const steps = []

    steps.push({
      type: 'start',
      currentNode: null,
      highlighted: new Set(),
      highlightedLinks: new Set(),
      operationInfo: `Starting ${operation} operation`,
      description: `Beginning ${operation} operation${value !== undefined ? ` with value ${value}` : ''}${operation === 'traverse' ? ` for ${traverseCount} steps` : ''}`
    })

    switch (operation) {
      case 'insert_beginning':
        listCopy.insertAtBeginning(value, steps)
        break
      case 'insert_end':
        listCopy.insertAtEnd(value, steps)
        break
      case 'delete':
        listCopy.delete(value, steps)
        break
      case 'traverse':
        listCopy.traverse(traverseCount, steps)
        break
    }

    setSteps(steps)
    setCurrentStep(0)
  }, [list, traverseCount])

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
    return 'fill-green-500 stroke-green-400'
  }

  // Get link color
  const getLinkColor = (linkId, isCircularLink = false) => {
    if (highlightedLinks.has(linkId)) {
      return 'stroke-yellow-400 stroke-4 animate-pulse'
    }
    return isCircularLink ? 'stroke-red-400 stroke-3' : 'stroke-gray-400 stroke-2'
  }

  // Render circular linked list
  const renderList = () => {
    if (!list) return null

    const nodes = list.toArray()
    if (nodes.length === 0) return null

    const centerX = 400
    const centerY = 300
    const radius = 150
    const nodeRadius = 30

    return (
      <g>
        {/* Render nodes in a circle */}
        {nodes.map((node, index) => {
          const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)

          // Calculate next node position for arrow
          const nextIndex = (index + 1) % nodes.length
          const nextAngle = (2 * Math.PI * nextIndex) / nodes.length - Math.PI / 2
          const nextX = centerX + radius * Math.cos(nextAngle)
          const nextY = centerY + radius * Math.sin(nextAngle)

          // Calculate arrow start and end points on node circumference
          const deltaX = nextX - x
          const deltaY = nextY - y
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
          const unitX = deltaX / distance
          const unitY = deltaY / distance

          const arrowStartX = x + nodeRadius * unitX
          const arrowStartY = y + nodeRadius * unitY
          const arrowEndX = nextX - nodeRadius * unitX
          const arrowEndY = nextY - nodeRadius * unitY

          const isCircularLink = nextIndex === 0 && index === nodes.length - 1

          return (
            <g key={node.id}>
              {/* Link to next node */}
              {nodes.length === 1 ? (
                // Self-loop for single node
                <path
                  d={`M ${x + nodeRadius} ${y} 
                      A 25 25 0 1 1 ${x} ${y + nodeRadius}
                      A 25 25 0 1 1 ${x - nodeRadius} ${y}
                      A 25 25 0 1 1 ${x} ${y - nodeRadius}
                      A 25 25 0 1 1 ${x + nodeRadius} ${y}`}
                  fill="none"
                  className={getLinkColor(`${node.id}-self`, true)}
                  markerEnd="url(#arrowhead)"
                />
              ) : (
                <line
                  x1={arrowStartX}
                  y1={arrowStartY}
                  x2={arrowEndX}
                  y2={arrowEndY}
                  className={getLinkColor(`${node.id}-next`, isCircularLink)}
                  markerEnd="url(#arrowhead)"
                />
              )}

              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r={nodeRadius}
                className={`${getNodeColor(node)} stroke-2 transition-all duration-500`}
              />

              {/* Node data */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                className="fill-white font-bold text-lg"
              >
                {node.data}
              </text>

              {/* Head indicator */}
              {node === list.head && (
                <text
                  x={x}
                  y={y - nodeRadius - 15}
                  textAnchor="middle"
                  className="fill-blue-400 font-bold text-sm"
                >
                  HEAD
                </text>
              )}

              {/* Node position label */}
              <text
                x={x}
                y={y + nodeRadius + 25}
                textAnchor="middle"
                className="fill-gray-400 text-xs"
              >
                {index}
              </text>
            </g>
          )
        })}

        {/* Arrow marker definition */}
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
              className="fill-current"
            />
          </marker>
        </defs>

        {/* Circular indicator in center */}
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          className="fill-red-500 opacity-50"
        />
        <text
          x={centerX}
          y={centerY + 4}
          textAnchor="middle"
          className="fill-white text-xs font-bold"
        >
          ↻
        </text>
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Circular Linked List
                </h1>
                <p className="text-gray-400 text-sm">Linked list with tail pointing back to head</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaSync className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Circular Structure</span>
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="insert_beginning">Insert at Beginning</option>
                  <option value="insert_end">Insert at End</option>
                  <option value="delete">Delete Value</option>
                  <option value="traverse">Traverse List</option>
                </select>
              </div>

              {/* Value Input (for insert/delete) */}
              {(operation === 'insert_beginning' || operation === 'insert_end' || operation === 'delete') && (
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
              )}

              {/* Traverse Count (for traverse) */}
              {operation === 'traverse' && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Steps to traverse: {traverseCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={traverseCount}
                    onChange={(e) => setTraverseCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Will traverse {traverseCount} nodes around the circle
                  </div>
                </div>
              )}

              {/* Manual Input */}
              {operation !== 'traverse' && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Manual Input
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={manualValue}
                      onChange={(e) => setManualValue(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                      placeholder="Enter value"
                    />
                    <button
                      onClick={executeManualOperation}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <button
                onClick={executeOperation}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors mb-6 flex items-center justify-center gap-2"
              >
                <FaSync className="w-4 h-4" />
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
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
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
              <div className="mt-6 bg-green-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">List Info:</h3>
                <div className="text-sm text-green-200 space-y-1">
                  <p>Size: {list?.getSize() || 0}</p>
                  <p>Head: {list?.head?.data || 'null'}</p>
                  <p>Circular: {list?.head ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span className="text-gray-300">Normal Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500"></div>
                    <span className="text-gray-300">Active Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span className="text-gray-300">Head Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-red-500"></div>
                    <span className="text-gray-300">Circular Link</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Circular Linked List Visualization</h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* List Visualization */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="flex justify-center">
                  <svg width="800" height="600" className="mx-auto">
                    {renderList()}
                  </svg>
                </div>
              </div>

              {/* Operation Info */}
              {operationInfo && (
                <div className="bg-green-700 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-2">Operation Status:</h3>
                  <p className="text-green-200">{operationInfo}</p>
                </div>
              )}

              {/* Circular List Properties */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Circular List Properties:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-green-800 rounded p-3">
                    <div className="text-green-400 font-medium">No NULL Pointers</div>
                    <div className="text-gray-300">Last node points back to head</div>
                  </div>
                  <div className="bg-blue-800 rounded p-3">
                    <div className="text-blue-400 font-medium">Infinite Traversal</div>
                    <div className="text-gray-300">Can traverse continuously in a loop</div>
                  </div>
                  <div className="bg-purple-800 rounded p-3">
                    <div className="text-purple-400 font-medium">Memory Efficient</div>
                    <div className="text-gray-300">No wasted pointer slots</div>
                  </div>
                  <div className="bg-yellow-800 rounded p-3">
                    <div className="text-yellow-400 font-medium">Queue Applications</div>
                    <div className="text-gray-300">Perfect for round-robin scheduling</div>
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
                <h3 className="text-white font-medium mb-2">Circular Linked List Analysis</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Advantages:</strong> No NULL checks, efficient memory usage, infinite traversal</p>
                  <p><strong>Insert at beginning/end:</strong> O(1) if tail pointer maintained, O(n) otherwise</p>
                  <p><strong>Delete:</strong> O(n) for search, O(1) for deletion once found</p>
                  <p><strong>Applications:</strong> Round-robin scheduling, music playlists, undo/redo operations</p>
                  <p><strong>Caution:</strong> Must break loop condition to avoid infinite traversal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircularLinkedListOperations
