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
  FaTrash,
  FaTree,
  FaExclamationTriangle
} from 'react-icons/fa'

const TrieDeletion = () => {
  const router = useRouter()
  const [trie, setTrie] = useState(null)
  const [deleteWord, setDeleteWord] = useState('CAR')
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [deletePath, setDeletePath] = useState([])
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [nodesToDelete, setNodesToDelete] = useState(new Set())
  const [currentChar, setCurrentChar] = useState('')
  const [deleteResult, setDeleteResult] = useState(null)
  const [manualWord, setManualWord] = useState('')

  // Trie Node class
  class TrieNode {
    constructor(char = '', level = 0) {
      this.char = char
      this.level = level
      this.children = {}
      this.isEndOfWord = false
      this.words = []
      this.id = `trie-${char}-${level}-${Date.now()}`
    }
  }

  // Initialize trie with sample data
  const initializeTrie = useCallback(() => {
    const root = new TrieNode('ROOT', 0)
    
    // Pre-populate with words
    const words = ['CAR', 'CARD', 'CARE', 'CAREFUL', 'CAT', 'CATCH', 'DOG', 'DOOR', 'DANCE']
    let tempTrie = root
    
    words.forEach(word => {
      tempTrie = insertWordInTrie(tempTrie, word)
    })
    
    setTrie(tempTrie)
    setCurrentStep(0)
    setCurrentNode(null)
    setDeletePath([])
    setHighlightedNodes(new Set())
    setNodesToDelete(new Set())
    setCurrentChar('')
    setDeleteResult(null)
    setIsPlaying(false)
    generateSteps(tempTrie, deleteWord)
  }, [deleteWord])

  // Insert word into trie (silent)
  const insertWordInTrie = (root, word) => {
    let current = root

    for (let i = 0; i < word.length; i++) {
      const char = word[i].toUpperCase()
      
      if (!current.children[char]) {
        const newNode = new TrieNode(char, current.level + 1)
        current.children[char] = newNode
      }
      
      current = current.children[char]
      current.words.push(word)
    }

    current.isEndOfWord = true
    return root
  }

  // Check if node has children
  const hasChildren = (node) => {
    return Object.keys(node.children).length > 0
  }

  // Delete word from trie
  const deleteWordFromTrie = (root, word) => {
    const steps = []
    let current = root
    const path = []
    const nodeStack = []
    let found = true
    
    steps.push({
      type: 'start',
      currentNode: 'ROOT',
      currentChar: '',
      path: [],
      highlighted: new Set(['ROOT']),
      nodesToDelete: new Set(),
      word: word,
      result: null,
      description: `Starting deletion of word "${word}". First, verify it exists.`
    })

    // Step 1: Find the word and build path
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toUpperCase()
      path.push(char)
      nodeStack.push(current)
      
      steps.push({
        type: 'traverse',
        currentNode: current.id,
        currentChar: char,
        path: [...path],
        highlighted: new Set([current.id]),
        nodesToDelete: new Set(),
        word: word,
        result: null,
        description: `Looking for character '${char}' at position ${i}.`
      })

      if (!current.children[char]) {
        found = false
        steps.push({
          type: 'not_found',
          currentNode: current.id,
          currentChar: char,
          path: [...path],
          highlighted: new Set([current.id]),
          nodesToDelete: new Set(),
          word: word,
          result: false,
          description: `Character '${char}' not found! Word "${word}" does not exist in trie.`
        })
        break
      }
      
      current = current.children[char]
    }

    if (found) {
      nodeStack.push(current)
      
      if (!current.isEndOfWord) {
        steps.push({
          type: 'not_complete_word',
          currentNode: current.id,
          currentChar: current.char,
          path: [...path],
          highlighted: new Set([current.id]),
          nodesToDelete: new Set(),
          word: word,
          result: false,
          description: `"${word}" exists as prefix but not as complete word. Cannot delete.`
        })
        found = false
      } else {
        steps.push({
          type: 'word_found',
          currentNode: current.id,
          currentChar: current.char,
          path: [...path],
          highlighted: new Set([current.id]),
          nodesToDelete: new Set(),
          word: word,
          result: null,
          description: `Word "${word}" found! Now determine what nodes to delete.`
        })

        // Step 2: Determine deletion strategy
        const toDelete = new Set()
        
        // Remove end-of-word marker first
        steps.push({
          type: 'remove_end_marker',
          currentNode: current.id,
          currentChar: current.char,
          path: [...path],
          highlighted: new Set([current.id]),
          nodesToDelete: new Set([current.id]),
          word: word,
          result: null,
          description: `Remove end-of-word marker from "${word}".`
        })

        // If current node has children, we can't delete it
        if (hasChildren(current)) {
          steps.push({
            type: 'has_children',
            currentNode: current.id,
            currentChar: current.char,
            path: [...path],
            highlighted: new Set([current.id]),
            nodesToDelete: new Set(),
            word: word,
            result: true,
            description: `Node has children (other words share this prefix). Only remove end-of-word marker.`
          })
        } else {
          // No children - can delete this node and possibly ancestors
          let deleteIndex = nodeStack.length - 1
          
          // Find how far back we can delete
          while (deleteIndex > 0) {
            const nodeToCheck = nodeStack[deleteIndex]
            const parent = nodeStack[deleteIndex - 1]
            
            if (nodeToCheck.isEndOfWord || hasChildren(nodeToCheck)) {
              break
            }
            
            toDelete.add(nodeToCheck.id)
            deleteIndex--
          }

          if (toDelete.size > 0) {
            steps.push({
              type: 'mark_for_deletion',
              currentNode: current.id,
              currentChar: current.char,
              path: [...path],
              highlighted: toDelete,
              nodesToDelete: toDelete,
              word: word,
              result: null,
              description: `Marking ${toDelete.size} nodes for deletion (no other words use them).`
            })

            steps.push({
              type: 'delete_nodes',
              currentNode: null,
              currentChar: '',
              path: [],
              highlighted: toDelete,
              nodesToDelete: toDelete,
              word: word,
              result: null,
              description: `Deleting marked nodes from trie.`
            })
          }
        }
      }
    }

    steps.push({
      type: 'complete',
      currentNode: null,
      currentChar: '',
      path: [],
      highlighted: new Set(),
      nodesToDelete: new Set(),
      word: word,
      result: found && current.isEndOfWord,
      description: `Deletion complete! "${word}" ${found && current.isEndOfWord ? 'successfully deleted' : 'not found or removed'} from trie.`
    })

    return steps
  }

  // Actually perform deletion on trie
  const performDeletion = (root, word) => {
    const deleteRecursive = (node, word, index) => {
      if (index === word.length) {
        // Reached end of word
        if (!node.isEndOfWord) {
          return false // Word doesn't exist
        }
        
        node.isEndOfWord = false
        node.words = node.words.filter(w => w !== word.toUpperCase())
        
        // Return true if node should be deleted (no children and not end of other word)
        return Object.keys(node.children).length === 0
      }

      const char = word[index].toUpperCase()
      const childNode = node.children[char]
      
      if (!childNode) {
        return false // Word doesn't exist
      }

      const shouldDeleteChild = deleteRecursive(childNode, word, index + 1)
      
      if (shouldDeleteChild) {
        delete node.children[char]
        // Return true if current node should also be deleted
        return !node.isEndOfWord && Object.keys(node.children).length === 0
      }

      return false
    }

    deleteRecursive(root, word, 0)
    return root
  }

  // Generate deletion steps
  const generateSteps = (trieRoot, word) => {
    if (!word || word.trim() === '') {
      setSteps([])
      return
    }

    const deleteSteps = deleteWordFromTrie(trieRoot, word.toUpperCase())
    setSteps(deleteSteps)
  }

  // Manual deletion
  const deleteManualWord = () => {
    if (!manualWord || manualWord.trim() === '') return
    
    const word = manualWord.toUpperCase().trim()
    setDeleteWord(word)
    setManualWord('')
    
    // Perform actual deletion on trie
    const newTrie = cloneTrie(trie)
    performDeletion(newTrie, word)
    setTrie(newTrie)
    
    generateSteps(newTrie, word)
  }

  // Clone trie structure
  const cloneTrie = (node) => {
    if (!node) return null
    
    const newNode = new TrieNode(node.char, node.level)
    newNode.isEndOfWord = node.isEndOfWord
    newNode.words = [...node.words]
    newNode.id = node.id
    
    Object.keys(node.children).forEach(char => {
      newNode.children[char] = cloneTrie(node.children[char])
    })
    
    return newNode
  }

  // Initialize
  useEffect(() => {
    initializeTrie()
  }, [initializeTrie])

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
      setCurrentNode(step.currentNode)
      setCurrentChar(step.currentChar)
      setDeletePath(step.path || [])
      setHighlightedNodes(step.highlighted || new Set())
      setNodesToDelete(step.nodesToDelete || new Set())
      setDeleteResult(step.result)
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

  // Get node color based on state
  const getNodeColor = (node) => {
    if (nodesToDelete.has(node.id)) {
      return 'fill-red-500 stroke-red-400 animate-pulse'
    }
    if (highlightedNodes.has(node.id)) {
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (deletePath.includes(node.char)) {
      return 'fill-orange-500 stroke-orange-400'
    }
    if (node.isEndOfWord) {
      return 'fill-green-500 stroke-green-400'
    }
    if (node.char === 'ROOT') {
      return 'fill-purple-600 stroke-purple-400'
    }
    return 'fill-gray-500 stroke-gray-400'
  }

  // Render trie visualization
  const renderTrie = (node, x, y, parentX = x, parentY = y, level = 0) => {
    if (!node) return null

    const children = Object.values(node.children)
    const childSpacing = Math.max(80, 400 / Math.pow(2, level))
    const levelHeight = 100
    
    return (
      <g key={node.id}>
        {/* Connection to parent */}
        {level > 0 && (
          <line
            x1={parentX}
            y1={parentY + 25}
            x2={x}
            y2={y - 25}
            stroke={deletePath.includes(node.char) ? '#F97316' : '#6B7280'}
            strokeWidth={deletePath.includes(node.char) ? '3' : '2'}
          />
        )}

        {/* Deletion indicator */}
        {nodesToDelete.has(node.id) && (
          <g>
            <line x1={x-20} y1={y-20} x2={x+20} y2={y+20} stroke="#EF4444" strokeWidth="4" />
            <line x1={x-20} y1={y+20} x2={x+20} y2={y-20} stroke="#EF4444" strokeWidth="4" />
          </g>
        )}

        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r="25"
          className={`${getNodeColor(node)} stroke-2 transition-all duration-500 ${nodesToDelete.has(node.id) ? 'opacity-50' : ''}`}
        />

        {/* Node character */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className={`fill-white text-sm font-bold ${nodesToDelete.has(node.id) ? 'opacity-50' : ''}`}
        >
          {node.char === 'ROOT' ? 'R' : node.char}
        </text>

        {/* End of word indicator */}
        {node.isEndOfWord && !nodesToDelete.has(node.id) && (
          <circle
            cx={x + 15}
            cy={y - 15}
            r="5"
            className="fill-green-400 stroke-green-300"
          />
        )}

        {/* Render children */}
        {children.map((child, index) => {
          const childX = x + (index - (children.length - 1) / 2) * childSpacing
          const childY = y + levelHeight
          
          return renderTrie(child, childX, childY, x, y, level + 1)
        })}
      </g>
    )
  }

  // Get all words in trie
  const getAllWords = (node, prefix = '', words = []) => {
    if (!node) return words
    
    if (node.isEndOfWord) {
      words.push(prefix)
    }
    
    Object.keys(node.children).forEach(char => {
      getAllWords(node.children[char], prefix + char, words)
    })
    
    return words
  }

  const allWords = trie ? getAllWords(trie) : []

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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Trie Deletion
                </h1>
                <p className="text-gray-400 text-sm">Delete words from trie with proper cleanup</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaTrash className="w-5 h-5 text-red-400" />
              <span className="text-gray-300 text-sm">Word Deletion</span>
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
                Delete Controls
              </h2>
              
              {/* Word Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select Word to Delete
                </label>
                <div className="space-y-2">
                  {allWords.slice(0, 8).map((word) => (
                    <button
                      key={word}
                      onClick={() => setDeleteWord(word)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        deleteWord === word 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Input */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Delete Custom Word
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualWord}
                    onChange={(e) => setManualWord(e.target.value.replace(/[^A-Za-z]/g, ''))}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter word"
                    maxLength="15"
                  />
                  <button
                    onClick={deleteManualWord}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: {deleteWord}</p>
              </div>
              
              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pause : play}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                  onClick={initializeTrie}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset Trie
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

              {/* Delete Result */}
              {deleteResult !== null && (
                <div className={`mt-6 rounded-lg p-4 ${deleteResult ? 'bg-green-700' : 'bg-orange-700'}`}>
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    {deleteResult ? <FaTree /> : <FaExclamationTriangle />}
                    Delete Result:
                  </h3>
                  <div className="bg-opacity-20 bg-black rounded p-3 text-center">
                    <span className={`font-bold ${deleteResult ? 'text-green-400' : 'text-orange-400'}`}>
                      {deleteWord} {deleteResult ? 'DELETED' : 'NOT FOUND'}
                    </span>
                  </div>
                </div>
              )}

              {/* Nodes to Delete */}
              {nodesToDelete.size > 0 && (
                <div className="mt-6 bg-red-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Nodes to Delete:</h3>
                  <div className="bg-red-800 rounded p-3">
                    <span className="text-red-400 font-bold">
                      {nodesToDelete.size} node{nodesToDelete.size !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Current Character */}
              {currentChar && (
                <div className="mt-6 bg-orange-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Processing Character:</h3>
                  <div className="bg-orange-800 rounded p-3 text-center">
                    <span className="text-3xl font-bold text-orange-400">{currentChar}</span>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-300">Root Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Regular Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">End of Word</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-300">Delete Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">To be Deleted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaTree className="w-5 h-5" />
                  Trie Deletion Visualization
                </h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Trie Tree */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <svg width="800" height="500" className="mx-auto">
                  {trie && renderTrie(trie, 400, 60)}
                </svg>
              </div>

              {/* Current Delete Path */}
              {deletePath.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Delete Path:</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-600 text-white rounded font-bold text-sm">
                      ROOT
                    </span>
                    {deletePath.map((char, index) => (
                      <React.Fragment key={index}>
                        <span className="text-gray-400">→</span>
                        <span className={`px-3 py-1 rounded font-bold text-sm ${
                          index === deletePath.length - 1 ? 'bg-yellow-600 text-white' : 'bg-orange-600 text-white'
                        }`}>
                          {char}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Words */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Remaining Words in Trie ({allWords.length}):</h3>
                <div className="flex flex-wrap gap-1 text-sm">
                  {allWords.map((word, index) => (
                    <span 
                      key={index} 
                      className={`px-2 py-1 rounded text-xs ${
                        word === deleteWord ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deletion Cases */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Trie Deletion Cases:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-green-400 font-medium">Case 1: Has Children</div>
                    <div className="text-gray-300">Only remove end-of-word marker</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-yellow-400 font-medium">Case 2: Leaf Node</div>
                    <div className="text-gray-300">Delete node and unused ancestors</div>
                  </div>
                  <div className="bg-gray-800 rounded p-3">
                    <div className="text-red-400 font-medium">Case 3: Not Found</div>
                    <div className="text-gray-300">Word doesn't exist in trie</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start Trie deletion'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Trie Deletion Algorithm</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(m) - where m is length of word to delete</p>
                  <p><strong>Space Complexity:</strong> O(m) - recursive call stack</p>
                  <p><strong>Strategy:</strong> Remove end-of-word marker, then delete unused nodes bottom-up</p>
                  <p><strong>Care:</strong> Don't delete nodes that are part of other words</p>
                  <p><strong>Applications:</strong> Dictionary management, autocomplete cleanup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrieDeletion
