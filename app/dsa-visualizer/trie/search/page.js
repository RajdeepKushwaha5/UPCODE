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
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'

const TrieSearch = () => {
  const router = useRouter()
  const [trie, setTrie] = useState(null)
  const [searchWord, setSearchWord] = useState('CAR')
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [currentNode, setCurrentNode] = useState(null)
  const [searchPath, setSearchPath] = useState([])
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [currentChar, setCurrentChar] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [manualWord, setManualWord] = useState('')
  const [prefixMatches, setPrefixMatches] = useState([])

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
    const words = ['CAR', 'CARD', 'CARE', 'CAREFUL', 'CAT', 'CATCH', 'DOG', 'DOOR', 'DANCE', 'DATA']
    let tempTrie = root
    
    words.forEach(word => {
      tempTrie = insertWordInTrie(tempTrie, word)
    })
    
    setTrie(tempTrie)
    setCurrentStep(0)
    setCurrentNode(null)
    setSearchPath([])
    setHighlightedNodes(new Set())
    setCurrentChar('')
    setSearchResult(null)
    setPrefixMatches([])
    setIsPlaying(false)
    generateSteps(tempTrie, searchWord)
  }, [searchWord])

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

  // Search for word in trie
  const searchWordInTrie = (root, word) => {
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
      word: word,
      result: null,
      prefixMatches: [],
      description: `Starting search for word "${word}". Begin at root node.`
    })

    for (let i = 0; i < word.length; i++) {
      const char = word[i].toUpperCase()
      path.push(char)
      
      steps.push({
        type: 'check_char',
        currentNode: current.id,
        currentChar: char,
        path: [...path],
        highlighted: new Set([current.id]),
        word: word,
        result: null,
        prefixMatches: current.words || [],
        description: `Looking for character '${char}' at position ${i}. Check if child exists.`
      })

      if (!current.children[char]) {
        // Character not found
        found = false
        steps.push({
          type: 'char_not_found',
          currentNode: current.id,
          currentChar: char,
          path: [...path],
          highlighted: new Set([current.id]),
          word: word,
          result: false,
          prefixMatches: current.words || [],
          description: `Character '${char}' not found! Word "${word}" does not exist in trie.`
        })
        break
      } else {
        current = current.children[char]
        steps.push({
          type: 'char_found',
          currentNode: current.id,
          currentChar: char,
          path: [...path],
          highlighted: new Set([current.id]),
          word: word,
          result: null,
          prefixMatches: current.words || [],
          description: `Character '${char}' found! Moving to next node.`
        })
      }
    }

    if (found) {
      // Check if it's end of word
      const isCompleteWord = current.isEndOfWord
      
      steps.push({
        type: 'check_end_of_word',
        currentNode: current.id,
        currentChar: current.char,
        path: [...path],
        highlighted: new Set([current.id]),
        word: word,
        result: isCompleteWord,
        prefixMatches: current.words || [],
        description: `Reached end of search. ${isCompleteWord ? 
          `"${word}" is a complete word in the trie!` : 
          `"${word}" exists as a prefix but not as a complete word.`}`
      })
    }

    steps.push({
      type: 'complete',
      currentNode: null,
      currentChar: '',
      path: [],
      highlighted: new Set(),
      word: word,
      result: found && current.isEndOfWord,
      prefixMatches: found ? current.words || [] : [],
      description: `Search complete! "${word}" ${found && current.isEndOfWord ? 'FOUND' : 'NOT FOUND'} in trie.`
    })

    return steps
  }

  // Get all words with prefix
  const getWordsWithPrefix = (root, prefix) => {
    let current = root
    
    // Navigate to prefix
    for (let char of prefix.toUpperCase()) {
      if (!current.children[char]) {
        return []
      }
      current = current.children[char]
    }
    
    // Collect all words from this node
    const words = new Set()
    const collectWords = (node, currentPrefix) => {
      if (node.isEndOfWord) {
        words.add(currentPrefix)
      }
      
      Object.keys(node.children).forEach(char => {
        collectWords(node.children[char], currentPrefix + char)
      })
    }
    
    collectWords(current, prefix.toUpperCase())
    return Array.from(words)
  }

  // Generate search steps
  const generateSteps = (trieRoot, word) => {
    if (!word || word.trim() === '') {
      setSteps([])
      return
    }

    const searchSteps = searchWordInTrie(trieRoot, word.toUpperCase())
    setSteps(searchSteps)
  }

  // Manual search
  const searchManualWord = () => {
    if (!manualWord || manualWord.trim() === '') return
    
    const word = manualWord.toUpperCase().trim()
    setSearchWord(word)
    setManualWord('')
    generateSteps(trie, word)
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
      if (searchResult === false && highlightedNodes.has(node.id)) {
        return 'fill-red-500 stroke-red-400 animate-pulse'
      }
      return 'fill-yellow-500 stroke-yellow-400 animate-pulse'
    }
    if (searchPath.includes(node.char)) {
      return 'fill-blue-500 stroke-blue-400'
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
            stroke={searchPath.includes(node.char) ? '#3B82F6' : '#6B7280'}
            strokeWidth={searchPath.includes(node.char) ? '3' : '2'}
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

        {/* Search result indicator */}
        {highlightedNodes.has(node.id) && searchResult !== null && (
          searchResult ? (
            <FaCheckCircle className="w-6 h-6 text-green-400" style={{ x: x + 20, y: y - 30 }} />
          ) : (
            <FaTimesCircle className="w-6 h-6 text-red-400" style={{ x: x + 20, y: y - 30 }} />
          )
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Trie Search
                </h1>
                <p className="text-gray-400 text-sm">Search words and prefixes in trie structure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaSearch className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Word Search</span>
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
                Search Controls
              </h2>
              
              {/* Word Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select Word to Search
                </label>
                <div className="space-y-2">
                  {['CAR', 'CARD', 'CARE', 'CAT', 'DOG', 'DANCE', 'DOOR', 'TEST'].map((word) => (
                    <button
                      key={word}
                      onClick={() => setSearchWord(word)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        searchWord === word 
                          ? 'bg-blue-600 text-white' 
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
                  Search Custom Word
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualWord}
                    onChange={(e) => setManualWord(e.target.value.replace(/[^A-Za-z]/g, ''))}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter word"
                    maxLength="15"
                  />
                  <button
                    onClick={searchManualWord}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaSearch className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: {searchWord}</p>
              </div>
              
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

              {/* Search Result */}
              {searchResult !== null && (
                <div className={`mt-6 rounded-lg p-4 ${searchResult ? 'bg-green-700' : 'bg-red-700'}`}>
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    {searchResult ? <FaCheckCircle /> : <FaTimesCircle />}
                    Search Result:
                  </h3>
                  <div className="bg-opacity-20 bg-black rounded p-3 text-center">
                    <span className={`font-bold ${searchResult ? 'text-green-400' : 'text-red-400'}`}>
                      {searchWord} {searchResult ? 'FOUND' : 'NOT FOUND'}
                    </span>
                  </div>
                </div>
              )}

              {/* Prefix Matches */}
              {prefixMatches.length > 0 && (
                <div className="mt-6 bg-cyan-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Words with this prefix:</h3>
                  <div className="flex flex-wrap gap-1 text-sm">
                    {prefixMatches.slice(0, 8).map((word, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-cyan-600 text-white rounded text-xs"
                      >
                        {word}
                      </span>
                    ))}
                    {prefixMatches.length > 8 && (
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                        +{prefixMatches.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Current Character */}
              {currentChar && (
                <div className="mt-6 bg-blue-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Searching Character:</h3>
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
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">End of Word</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Search Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Current Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Search Failed</span>
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
                  Trie Search Visualization
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

              {/* Current Search Path */}
              {searchPath.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Search Path:</h3>
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

              {/* Available Words */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">All Words in Trie ({allWords.length}):</h3>
                <div className="flex flex-wrap gap-1 text-sm">
                  {allWords.map((word, index) => (
                    <span 
                      key={index} 
                      className={`px-2 py-1 rounded text-xs ${
                        word === searchWord ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Click play to start Trie search'}
                </p>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Trie Search Algorithm</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Time Complexity:</strong> O(m) - where m is length of search word</p>
                  <p><strong>Space Complexity:</strong> O(1) - only uses variables for traversal</p>
                  <p><strong>Process:</strong> Traverse character by character from root</p>
                  <p><strong>Applications:</strong> Autocomplete, spell checking, IP routing tables</p>
                  <p><strong>Advantage:</strong> Fast prefix-based searches and word validation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrieSearch
