'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaChevronRight,
  FaPlay,
  FaPause,
  FaRedo,
  FaStepForward,
  FaCogs,
  FaDatabase,
  FaSearch,
  FaSort,
  FaBars,
  FaTree,
  FaProjectDiagram
} from 'react-icons/fa'

const DSAVisualizer = () => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(null)

  const categories = [
    {
      id: 'array',
      title: 'Array',
      icon: <FaBars className="w-8 h-8" />,
      description: 'Linear data structure with elements stored in contiguous memory',
      color: 'from-blue-500 to-blue-700',
      subcategories: [
        {
          name: 'Searching',
          items: ['Linear Search', 'Binary Search', 'Jump Search', 'Exponential Search']
        },
        {
          name: 'Sorting',
          items: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort']
        },
        {
          name: 'Operations',
          items: ['Insertion', 'Deletion', 'Traversal', 'Rotation', 'Reversal']
        }
      ]
    },
    {
      id: 'stack',
      title: 'Stack',
      icon: <FaDatabase className="w-8 h-8" />,
      description: 'LIFO (Last In First Out) data structure',
      color: 'from-green-500 to-green-700',
      subcategories: [
        {
          name: 'Operations',
          items: ['Push & Pop', 'Peek', 'Is Empty', 'Is Full']
        },
        {
          name: 'Polish Notations',
          items: ['Postfix Evaluation', 'Prefix Evaluation', 'Infix to Postfix']
        },
        {
          name: 'Implementation',
          items: ['Using Array', 'Using Linked List']
        }
      ]
    },
    {
      id: 'queue',
      title: 'Queue',
      icon: <FaBars className="w-8 h-8 rotate-90" />,
      description: 'FIFO (First In First Out) data structure',
      color: 'from-yellow-500 to-yellow-700',
      subcategories: [
        {
          name: 'Operations',
          items: ['Enqueue & Dequeue', 'Peek Front', 'Is Empty', 'Is Full']
        },
        {
          name: 'Types',
          items: ['Simple Queue', 'Circular Queue', 'Priority Queue', 'Double Ended Queue']
        },
        {
          name: 'Implementation',
          items: ['Using Array', 'Using Linked List']
        }
      ]
    },
    {
      id: 'linkedlist',
      title: 'Linked List',
      icon: <FaProjectDiagram className="w-8 h-8" />,
      description: 'Dynamic linear data structure with nodes',
      color: 'from-purple-500 to-purple-700',
      subcategories: [
        {
          name: 'Types',
          items: ['Singly Linked List', 'Doubly Linked List', 'Circular Linked List']
        },
        {
          name: 'Operations',
          items: ['Traversal', 'Insertion', 'Deletion', 'Searching', 'Reverse', 'Merge']
        }
      ]
    },
    {
      id: 'tree',
      title: 'Tree',
      icon: <FaTree className="w-8 h-8" />,
      description: 'Hierarchical data structure with nodes',
      color: 'from-red-500 to-red-700',
      subcategories: [
        {
          name: 'Binary Tree',
          items: ['Structure & Properties', 'Types of Binary Trees']
        },
        {
          name: 'Binary Search Tree',
          items: ['Insertion', 'Deletion', 'Searching', 'Balancing (AVL)']
        },
        {
          name: 'Traversal',
          items: ['Pre-order', 'In-order', 'Post-order', 'Level-order (BFS)']
        },
        {
          name: 'Advanced Trees',
          items: ['Red-Black Trees', 'B-Trees', 'Trie', 'Segment Trees']
        }
      ]
    },
    {
      id: 'graph',
      title: 'Graph',
      icon: <FaProjectDiagram className="w-8 h-8" />,
      description: 'Non-linear data structure with vertices and edges',
      color: 'from-indigo-500 to-indigo-700',
      subcategories: [
        {
          name: 'Representation',
          items: ['Adjacency Matrix', 'Adjacency List']
        },
        {
          name: 'Traversal',
          items: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)']
        },
        {
          name: 'Algorithms',
          items: ['Dijkstra\'s Algorithm', 'Prim\'s Algorithm', 'Kruskal\'s Algorithm', 'Topological Sort']
        }
      ]
    }
  ]

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category)
  }

  const handleVisualizationClick = (categoryId, subcategoryName, itemName) => {
    // Convert to URL-friendly format
    const categorySlug = categoryId.toLowerCase()
    const subcategorySlug = subcategoryName.toLowerCase().replace(/\s+/g, '-')
    const itemSlug = itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    router.push(`/dsa-visualizer/${categorySlug}/${subcategorySlug}/${itemSlug}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              DSA Visualizer
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Interactive visual representations of data structures and algorithms
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FaPlay className="w-4 h-4 text-green-400" />
                <span>Interactive Simulations</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCogs className="w-4 h-4 text-blue-400" />
                <span>Step-by-Step Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStepForward className="w-4 h-4 text-purple-400" />
                <span>Real-time Visualization</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group">
              {/* Category Card */}
              <div
                className={`bg-gradient-to-br ${category.color} p-1 rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${selectedCategory?.id === category.id ? 'scale-105 shadow-2xl' : ''
                  }`}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="bg-gray-800 rounded-lg p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-white`}>
                      {category.icon}
                    </div>
                    <FaChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${selectedCategory?.id === category.id ? 'rotate-90' : ''
                        }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {category.description}
                  </p>

                  {/* Subcategory Counter */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {category.subcategories.reduce((acc, sub) => acc + sub.items.length, 0)} visualizations
                    </span>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color} animate-pulse`}></div>
                  </div>
                </div>
              </div>

              {/* Expanded Subcategories */}
              {selectedCategory?.id === category.id && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <div key={subIndex} className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
                      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                        {subcategory.name}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {subcategory.items.map((item, itemIndex) => (
                          <button
                            key={itemIndex}
                            onClick={() => handleVisualizationClick(category.id, subcategory.name, item)}
                            className="text-left text-sm text-gray-300 hover:text-white transition-colors duration-200 bg-gray-700/50 hover:bg-gray-700 rounded-md p-2 border border-transparent hover:border-gray-600"
                          >
                            <div className="flex items-center justify-between">
                              <span>{item}</span>
                              <FaChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Access Panel */}
        <div className="mt-16 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: 'Bubble Sort',
                category: 'array',
                subcategory: 'sorting',
                algorithm: 'bubble-sort',
                icon: <FaSort />,
                popular: true
              },
              {
                name: 'Binary Search',
                category: 'array',
                subcategory: 'searching',
                algorithm: 'binary-search',
                icon: <FaSearch />,
                popular: true
              },
              {
                name: 'Linear Search',
                category: 'array',
                subcategory: 'searching',
                algorithm: 'linear-search',
                icon: <FaSearch />,
                popular: true
              },
              {
                name: 'Stack Operations',
                category: 'stack',
                subcategory: 'operations',
                algorithm: 'push-pop',
                icon: <FaDatabase />,
                popular: true
              }
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(`/dsa-visualizer/${item.category}/${item.subcategory}/${item.algorithm}`)}
                className="bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 text-center transition-all duration-200 border border-gray-600/50 hover:border-gray-500 group"
              >
                <div className="text-purple-400 mb-2 flex justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-white text-sm font-medium">{item.name}</div>
                {item.popular && (
                  <div className="text-xs text-yellow-400 mt-1">Popular</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DSAVisualizer
