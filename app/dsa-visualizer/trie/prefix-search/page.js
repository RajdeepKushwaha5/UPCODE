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
  FaSearch,
  FaTree,
  FaList,
  FaFilter
} from 'react-icons/fa'

const TriePrefixSearch = () => {
  const router = useRouter()
  const [trie, setTrie] = useState(null)
  const [searchPrefix, setSearchPrefix] = useState('CA')
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [searchPath, setSearchPath] = useState([])
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [prefixMatches, setPrefixMatches] = useState([])
  const [currentChar, setCurrentChar] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [manualPrefix, setManualPrefix] = useState('')
  const [collectedWords, setCollectedWords] = useState([])

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
    const words = [
      'CAR', 'CARD', 'CARE', 'CAREFUL', 'CARELESS', 'CART', 'CARTON',
      'CAT', 'CATCH', 'CATEGORY', 'CATERPILLAR',
      'DOG', 'DOOR', 'DANCE', 'DATA', 'DATABASE',
      'APPLE', 'APPLICATION', 'APPLY',
      'BOOK', 'BOOKING', 'BOOKSTORE'
    ]
    let tempTrie = root
    
    words.forEach(word => {
      tempTrie = insertWordInTrie(tempTrie, word)
    })
    
    setTrie(tempTrie)
    setCurrentStep(0)
    setCurrentNode(null)
    setSearchPath([])
    setHighlightedNodes(new Set())
    setPrefixMatches([])
    setCollectedWords([])
    setCurrentChar('')
    setSearchResult(null)
    setIsPlaying(false)
    generateSteps(tempTrie, searchPrefix)
  }, [searchPrefix])

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

  // Find all words with given prefix
  const findWordsWithPrefix = (root, prefix) => {
    const steps = []
    let current = root
    const path = []
    let found = true
    
    steps.push({
      type: 'start',
      currentNode: 'ROOT',
      currentChar: '',
      path: [],
      highlighted: new Set(['ROOT']),
      prefixMatches: [],
      collectedWords: [],
      prefix: prefix,
      result: null,
      description: `Starting prefix search for "${prefix}". Navigate to prefix end.`
    })

    // Step 1: Navigate to the end of prefix
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i].toUpperCase()
      path.push(char)
      
      steps.push({
        type: 'navigate_prefix',
        currentNode: current.id,
        currentChar: char,
        path: [...path],
        highlighted: new Set([current.id]),
        prefixMatches: [],
        collectedWords: [],
        prefix: prefix,
        result: null,
        description: `Looking for character '${char}' (${i + 1}/${prefix.length}) in prefix "${prefix}".`
      })

      if (!current.children[char]) {
        found = false
        steps.push({
          type: 'prefix_not_found',
          currentNode: current.id,
          currentChar: char,
          path: [...path],
          highlighted: new Set([current.id]),
          prefixMatches: [],
          collectedWords: [],
          prefix: prefix,
          result: false,
          description: `Character '${char}' not found! No words with prefix "${prefix}" exist.`
        })
        break
      }
      
      current = current.children[char]
      
      steps.push({
        type: 'prefix_char_found',
        currentNode: current.id,
        currentChar: char,
        path: [...path],
        highlighted: new Set([current.id]),
        prefixMatches: [],
        collectedWords: [],
        prefix: prefix,
        result: null,
        description: `Found character '${char}'. Continue to next character.`
      })
    }

    if (found) {
      steps.push({
        type: 'prefix_found',
        currentNode: current.id,
        currentChar: current.char,
        path: [...path],
        highlighted: new Set([current.id]),
        prefixMatches: [],
        collectedWords: [],
        prefix: prefix,
        result: true,
        description: `Prefix "${prefix}" found! Now collect all words from this subtree.`
      })

      // Step 2: Collect all words from this node (DFS traversal)
      const words = []
      const collectWords = (node, currentPrefix, stepPath = []) => {
        const nodeHighlight = new Set([node.id])
        
        if (node.isEndOfWord) {
          words.push(currentPrefix)
          steps.push({
            type: 'word_found',
            currentNode: node.id,
            currentChar: node.char,
            path: [...stepPath],
            highlighted: nodeHighlight,
            prefixMatches: [...words],
            collectedWords: [currentPrefix],
            prefix: prefix,
            result: true,
            description: `Found complete word: "${currentPrefix}". Add to results.`
          })
        }
        
        // Recursively visit children
        Object.keys(node.children).forEach(char => {
          const child = node.children[char]
          steps.push({
            type: 'explore_subtree',
            currentNode: child.id,
            currentChar: char,
            path: [...stepPath, char],
            highlighted: new Set([child.id]),
            prefixMatches: [...words],
            collectedWords: [],
            prefix: prefix,
            result: true,
            description: `Exploring subtree at '${char}' for more words with prefix "${prefix}".`
          })
          
          collectWords(child, currentPrefix + char, [...stepPath, char])
        })
      }
      
      collectWords(current, prefix.toUpperCase())
      
      steps.push({
        type: 'collection_complete',
        currentNode: null,
        currentChar: '',
        path: [],
        highlighted: new Set(),
        prefixMatches: words,
        collectedWords: words,
        prefix: prefix,
        result: true,
        description: `Collection complete! Found ${words.length} word${words.length !== 1 ? 's' : ''} with prefix "${prefix}".`
      })
    }

    steps.push({
      type: 'complete',
      currentNode: null,
      currentChar: '',
      path: [],
      highlighted: new Set(),
      prefixMatches: found ? words : [],
      collectedWords: found ? words : [],
      prefix: prefix,
      result: found,
      description: `Prefix search complete! ${found ? `Found ${words.length} matches` : 'No matches found'} for "${prefix}".`
    })

    return steps
  }

  // Generate prefix search steps
  const generateSteps = (trieRoot, prefix) => {
    if (!prefix || prefix.trim() === '') {
      setSteps([])
      return
    }

    const searchSteps = findWordsWithPrefix(trieRoot, prefix.toUpperCase())
    setSteps(searchSteps)
  }

  // Manual prefix search
  const searchManualPrefix = () => {
    if (!manualPrefix || manualPrefix.trim() === '') return
    
    const prefix = manualPrefix.toUpperCase().trim()
    setSearchPrefix(prefix)
    setManualPrefix('')
    generateSteps(trie, prefix)
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
      setSearchPath(step.path || [])
      setHighlightedNodes(step.highlighted || new Set())
      setSearchResult(step.result)
      setPrefixMatches(step.prefixMatches || [])
      setCollectedWords(step.collectedWords || [])
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
      if (collectedWords.length > 0 && node.isEndOfWord && collectedWords.includes(getWordFromPath(node))) {
        return 'fill-green-500 stroke-green-400 animate-pulse'
      }
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (searchPath.includes(node.char)) {
      return 'fill-blue-500 stroke-blue-400'
    }
    if (node.isEndOfWord && prefixMatches.length > 0) {
      const wordFromNode = getWordFromPath(node)
      if (prefixMatches.includes(wordFromNode)) {
        return 'fill-green-600 stroke-green-500'
      }
    }
    if (node.isEndOfWord) {
      return 'fill-gray-600 stroke-gray-500'
    }
    if (node.char === 'ROOT') {
      return 'fill-purple-600 stroke-purple-400'
    }
    return 'fill-gray-500 stroke-gray-400'
  }

  // Helper to get word from node path
  const getWordFromPath = (node) => {
    // This is a simplified version - in a real implementation,
    // you'd traverse up to build the complete word
    return ''
  }

  // Render trie visualization
  const renderTrie = (node, x, y, parentX = x, parentY = y, level = 0) => {
    if (!node) return null

    const children = Object.values(node.children)
    const childSpacing = Math.max(60, 300 / Math.pow(2, level))
    const levelHeight = 90
    
    return (
      <g key={node.id}>
        {/* Connection to parent */}
        {level > 0 && (
          <line
            x1={parentX}
            y1={parentY + 20}
            x2={x}
            y2={y - 20}
            stroke={searchPath.includes(node.char) ? '#3B82F6' : '#6B7280'}
            strokeWidth={searchPath.includes(node.char) ? '3' : '2'}
          />
        )}

        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r="20"
          className={`${getNodeColor(node)} stroke-2 transition-all duration-500`}
        />

        {/* Node character */}
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          className="fill-white text-sm font-bold"
        >
          {node.char === 'ROOT' ? 'R' : node.char}
        </text>

        {/* End of word indicator */}
        {node.isEndOfWord && (
          <circle
            cx={x + 12}
            cy={y - 12}
            r="3"
            className={`${prefixMatches.some(word => word.endsWith(node.char)) ? 'fill-green-400' : 'fill-gray-400'} stroke-2`}
          />
        )}

        {/* Current word indicator */}
        {collectedWords.length > 0 && node.isEndOfWord && (
          <circle
            cx={x}
            cy={y}
            r="25"
            className="fill-none stroke-green-400 stroke-2 animate-pulse"
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Trie Prefix Search
                </h1>
                <p className="text-gray-400 text-sm">Find all words starting with given prefix</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-300 text-sm">Prefix Matching</span>
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
                Prefix Controls
              </h2>
              
              {/* Prefix Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select Prefix to Search
                </label>
                <div className="space-y-2">
                  {['CA', 'CAR', 'CAT', 'DO', 'AP', 'BOO', 'DA'].map((prefix) => (
                    <button
                      key={prefix}
                      onClick={() => setSearchPrefix(prefix)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        searchPrefix === prefix 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {prefix}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Input */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Custom Prefix
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualPrefix}
                    onChange={(e) => setManualPrefix(e.target.value.replace(/[^A-Za-z]/g, ''))}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter prefix"
                    maxLength="10"
                  />
                  <button
                    onClick={searchManualPrefix}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaSearch className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: {searchPrefix}</p>
              </div>
              
              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pause : play}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                  Restart Search
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

              {/* Prefix Matches */}
              <div className="mt-6 bg-cyan-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                  <FaList className="w-4 h-4" />
                  Found Words ({prefixMatches.length}):
                </h3>
                <div className="flex flex-wrap gap-1 text-sm max-h-32 overflow-y-auto">
                  {prefixMatches.map((word, index) => (
                    <span 
                      key={index} 
                      className={`px-2 py-1 rounded text-xs ${
                        collectedWords.includes(word) ? 'bg-green-600 text-white animate-pulse' : 'bg-cyan-600 text-white'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Character */}
              {currentChar && (
                <div className="mt-6 bg-blue-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Current Character:</h3>
                  <div className="bg-blue-800 rounded p-3 text-center">
                    <span className="text-3xl font-bold text-blue-400">{currentChar}</span>
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
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Prefix Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <span className="text-gray-300">Match Word</span>
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
                  Trie Prefix Search Visualization
                </h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Trie Tree */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="overflow-x-auto">
                  <svg width="1000" height="500" className="mx-auto">
                    {trie && renderTrie(trie, 500, 60)}
                  </svg>
                </div>
              </div>

              {/* Current Search Path */}
              {searchPath.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Prefix Path:</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-600 text-white rounded font-bold text-sm">
                      ROOT
                    </span>
                    {searchPath.map((char, index) => (
                      <React.Fragment key={index}>
                        <span className="text-gray-400">→</span>
                        <span className={`px-3 py-1 rounded font-bold text-sm ${
                          index === searchPath.length - 1 ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {char}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">All Words ({allWords.length}):</h3>
                  <div className="flex flex-wrap gap-1 text-sm max-h-32 overflow-y-auto">
                    {allWords.map((word, index) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 rounded text-xs ${
                          word.startsWith(searchPrefix) ? 'bg-cyan-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-cyan-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Prefix Matches ({prefixMatches.length}):</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {prefixMatches.map((word, index) => (
                      <div key={index} className="flex items-center justify-between bg-cyan-800 rounded px-2 py-1">
                        <span className="text-cyan-300 font-medium">{word}</span>
                        <span className="text-xs text-cyan-400">{word.length} chars</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start Trie prefix search'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Trie Prefix Search Algorithm</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(p + n) - p is prefix length, n is number of matches</p>
                  <p><strong>Space Complexity:</strong> O(n) - for storing results</p>
                  <p><strong>Process:</strong> 1) Navigate to prefix end, 2) DFS collect all words from subtree</p>
                  <p><strong>Applications:</strong> Autocomplete, search suggestions, word games</p>
                  <p><strong>Advantage:</strong> Very efficient for prefix-based queries and suggestions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TriePrefixSearch
