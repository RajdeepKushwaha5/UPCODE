'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa'

// Import available visualizations
import BubbleSort from '../../../array/sorting/bubble-sort/page'
import SelectionSort from '../../../array/sorting/selection-sort/page'
import InsertionSort from '../../../array/sorting/insertion-sort/page'
import MergeSort from '../../../array/sorting/merge-sort/page'
import QuickSort from '../../../array/sorting/quick-sort/page'
import HeapSort from '../../../array/sorting/heap-sort/page'
import BinarySearch from '../../../array/searching/binary-search/page'
import LinearSearch from '../../../array/searching/linear-search/page'
import JumpSearch from '../../../array/searching/jump-search/page'
import StackOperations from '../../../stack/operations/push-pop/page'
import QueueOperations from '../../../queue/operations/enqueue-dequeue/page'

const DSAVisualizerDynamic = () => {
  const router = useRouter()
  const params = useParams()

  const { category, subcategory, algorithm } = params

  // Map of available visualizations
  const visualizations = {
    'array': {
      'sorting': {
        'bubble-sort': BubbleSort,
        'selection-sort': SelectionSort,
        'insertion-sort': InsertionSort,
        'merge-sort': MergeSort,
        'quick-sort': QuickSort,
        'heap-sort': HeapSort,
      },
      'searching': {
        'binary-search': BinarySearch,
        'linear-search': LinearSearch,
        'jump-search': JumpSearch,
      }
    },
    'stack': {
      'operations': {
        'push-pop': StackOperations,
      }
    },
    'queue': {
      'operations': {
        'enqueue-dequeue': QueueOperations,
      }
    }
    // TODO: Add more categories (linkedlist, tree, graph)
  }

  // Get the component to render
  const getVisualizationComponent = () => {
    try {
      const categoryObj = visualizations[category]
      if (!categoryObj) return null

      const subcategoryObj = categoryObj[subcategory]
      if (!subcategoryObj) return null

      const Component = subcategoryObj[algorithm]
      return Component
    } catch (error) {
      return null
    }
  }

  const VisualizationComponent = getVisualizationComponent()

  // If component exists, render it
  if (VisualizationComponent) {
    return <VisualizationComponent />
  }

  // Otherwise show not found page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <FaExclamationTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Visualization Not Found
          </h1>
          <p className="text-gray-300 mb-6">
            The visualization for <span className="text-blue-400 font-mono">
              {category}/{subcategory}/{algorithm}
            </span> is not yet implemented.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <button
              onClick={() => router.push('/dsa-visualizer')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Browse All Visualizations
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-semibold mb-2 text-sm">Available Visualizations:</h3>
            <ul className="text-gray-300 text-xs space-y-1">
              <li>• Array → Sorting → Bubble Sort</li>
              <li>• Array → Sorting → Selection Sort</li>
              <li>• Array → Sorting → Insertion Sort</li>
              <li>• Array → Sorting → Merge Sort</li>
              <li>• Array → Sorting → Quick Sort</li>
              <li>• Array → Sorting → Heap Sort</li>
              <li>• Array → Searching → Linear Search</li>
              <li>• Array → Searching → Binary Search</li>
              <li>• Array → Searching → Jump Search</li>
              <li>• Stack → Operations → Push & Pop</li>
              <li>• Queue → Operations → Enqueue & Dequeue</li>
              <li>• Stack → Operations → Push & Pop</li>
              <li className="text-gray-500">• More coming soon...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DSAVisualizerDynamic
