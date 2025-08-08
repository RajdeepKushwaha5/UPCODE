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
  FaSearch,
  FaTree
} from 'react-icons/fa'

const TrieInsertion = () => {
  const router = useRouter()
  const [trie, setTrie] = useState(null)
  const [insertWord, setInsertWord] = useState('CAT')
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [insertPath, setInsertPath] = useState([])
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [currentChar, setCurrentChar] = useState('')
  const [manualWord, setManualWord] = useState('')

  // Trie Node class
  class TrieNode {
    constructor(char = '', level = 0) {
      this.char = char
      this.level = level
      this.children = {}
      this.isEndOfWord = false
      this.words = [] // Store complete words that pass through this node
      this.id = `trie-${char}-${level}-${Date.now()}`
    }
  }

  // Initialize empty trie
  const initializeTrie = useCallback(() => {
    const root = new TrieNode('ROOT', 0)
    
    // Pre-populate with some words for demonstration
    const preWords = ['CAR', 'CARD', 'CARE', 'CAREFUL']
    let tempTrie = root
    
    preWords.forEach(word => {
      tempTrie = insertWordInTrie(tempTrie, word, false) // Silent insertion
    })
    
    setTrie(tempTrie)
    setCurrentStep(0)
    setCurrentNode(null)
    setInsertPath([])
    setHighlightedNodes(new Set())
    setCurrentChar('')
    setIsPlaying(false)
    generateSteps(tempTrie, insertWord)
  }, [insertWord])

  // Insert word into trie
  const insertWordInTrie = (root, word, trackSteps = true) => {
    const steps = trackSteps ? [] : null
    let current = root
    const path = []
    
    if (trackSteps) {
      steps.push({
        type: 'start',
        currentNode: 'ROOT',
        currentChar: '',
        path: [],
        highlighted: new Set(['ROOT']),
        word: word,
        description: `Starting insertion of word "${word}". Begin at root node.`
      })
    }

    for (let i = 0; i < word.length; i++) {
      const char = word[i].toUpperCase()
      path.push(char)
      
      if (trackSteps) {
        steps.push({
          type: 'check_char',
          currentNode: current.id,
          currentChar: char,
          path: [...path],
          highlighted: new Set([current.id]),
          word: word,
          description: `Processing character '${char}' at position ${i}. Check if child exists.`
        })
      }

      if (!current.children[char]) {
        // Create new node
        const newNode = new TrieNode(char, current.level + 1)
        current.children[char] = newNode
        
        if (trackSteps) {
          steps.push({
            type: 'create_node',
            currentNode: newNode.id,
            currentChar: char,
            path: [...path],
            highlighted: new Set([current.id, newNode.id]),
            word: word,
            description: `Character '${char}' not found. Create new node for '${char}'.`
          })
        }
      } else {
        if (trackSteps) {
          steps.push({
            type: 'node_exists',
            currentNode: current.children[char].id,
            currentChar: char,
            path: [...path],
            highlighted: new Set([current.id, current.children[char].id]),
            word: word,
            description: `Character '${char}' already exists. Move to existing node.`
          })
        }
      }
      
      current = current.children[char]
      current.words.push(word) // Track words passing through this node
    }

    // Mark end of word
    if (!current.isEndOfWord) {
      current.isEndOfWord = true
      if (trackSteps) {
        steps.push({
          type: 'mark_end',
          currentNode: current.id,
          currentChar: current.char,
          path: [...path],
          highlighted: new Set([current.id]),
          word: word,
          description: `Reached end of word "${word}". Mark current node as end-of-word.`
        })
      }
    } else {
      if (trackSteps) {
        steps.push({
          type: 'word_exists',
          currentNode: current.id,
          currentChar: current.char,
          path: [...path],
          highlighted: new Set([current.id]),
          word: word,
          description: `Word "${word}" already exists in trie. No changes needed.`
        })
      }
    }

    if (trackSteps) {
      steps.push({
        type: 'complete',
        currentNode: null,
        currentChar: '',
        path: [],
        highlighted: new Set(),
        word: word,
        description: `Insertion of "${word}" complete! Word is now stored in the trie.`
      })
      
      return { trie: root, steps }
    }
    
    return root
  }

  // Generate insertion steps
  const generateSteps = (trieRoot, word) => {
    if (!word || word.trim() === '') {
      setSteps([])
      return
    }

    const result = insertWordInTrie(cloneTrie(trieRoot), word.toUpperCase(), true)
    setSteps(result.steps)
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

  // Manual insertion
  const insertManualWord = () => {
    if (!manualWord || manualWord.trim() === '') return
    
    const word = manualWord.toUpperCase().trim()
    setInsertWord(word)
    setManualWord('')
    
    // Update trie with new word
    const newTrie = insertWordInTrie(cloneTrie(trie), word, false)
    setTrie(newTrie)
    generateSteps(newTrie, word)
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
      setInsertPath(step.path || [])
      setHighlightedNodes(step.highlighted || new Set())
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
    if (highlightedNodes.has(node.id)) {
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (node.isEndOfWord) {
      return 'fill-green-500 stroke-green-400'
    }
    if (node.char === 'ROOT') {
      return 'fill-blue-600 stroke-blue-400'
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
            stroke="#6B7280"
            strokeWidth="2"
          />
        )}

        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r="25"
          className={`${getNodeColor(node)} stroke-2 transition-all duration-500`}
        />

        {/* Node character */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="fill-white text-sm font-bold"
        >
          {node.char === 'ROOT' ? 'R' : node.char}
        </text>

        {/* End of word indicator */}
        {node.isEndOfWord && (
          <circle
            cx={x + 15}
            cy={y - 15}
            r="5"
            className="fill-green-400 stroke-green-300"
          />
        )}

        {/* Word count */}
        {node.words.length > 0 && (
          <text
            x={x}
            y={y + 45}
            textAnchor="middle"
            className="fill-cyan-400 text-xs"
          >
            {node.words.length}
          </text>
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

  // Get all words in trie (for display)
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Trie Insertion
                </h1>
                <p className="text-gray-400 text-sm">Insert words into prefix tree structure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaTree className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Prefix Tree</span>
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
              
              {/* Word Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select Word to Insert
                </label>
                <div className="space-y-2">
                  {['CAT', 'CAR', 'CARD', 'CARE', 'CAREFUL', 'DOG', 'DOOR'].map((word) => (
                    <button
                      key={word}
                      onClick={() => setInsertWord(word)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        insertWord === word 
                          ? 'bg-green-600 text-white' 
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
                  Insert Custom Word
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualWord}
                    onChange={(e) => setManualWord(e.target.value.replace(/[^A-Za-z]/g, ''))}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter word"
                    maxLength="15"
                  />
                  <button
                    onClick={insertManualWord}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: {insertWord}</p>
              </div>
              
              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pause : play}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                  Restart Algorithm
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

              {/* Current Character */}
              {currentChar && (
                <div className="mt-6 bg-green-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Current Character:</h3>
                  <div className="bg-green-800 rounded p-3 text-center">
                    <span className="text-3xl font-bold text-green-400">{currentChar}</span>
                  </div>
                </div>
              )}

              {/* Words in Trie */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Words in Trie ({allWords.length}):</h3>
                <div className="flex flex-wrap gap-1 text-sm">
                  {allWords.map((word, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
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
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Word Ending</span>
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
                  Trie Visualization
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

              {/* Current Path */}
              {insertPath.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Current Path:</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded font-bold text-sm">
                      ROOT
                    </span>
                    {insertPath.map((char, index) => (
                      <React.Fragment key={index}>
                        <span className="text-gray-400">→</span>
                        <span className={`px-3 py-1 rounded font-bold text-sm ${
                          index === insertPath.length - 1 ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {char}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start Trie insertion'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Trie Data Structure</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(m) - where m is length of word</p>
                  <p><strong>Space Complexity:</strong> O(ALPHABET_SIZE × N × M) - worst case</p>
                  <p><strong>Insertion:</strong> Create nodes for each character if not exists</p>
                  <p><strong>Use Cases:</strong> Autocomplete, spell checkers, IP routing, word games</p>
                  <p><strong>Advantage:</strong> Efficient prefix-based operations and word lookup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrieInsertion
