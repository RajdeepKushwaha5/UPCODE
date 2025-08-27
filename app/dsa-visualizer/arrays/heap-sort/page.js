'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function HeapSortVisualizer() {
  const [array, setArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [heapBoundary, setHeapBoundary] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithm, setAlgorithm] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate random array
  const generateArray = useCallback((size = 12) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setHeapBoundary(newArray.length - 1);
    setSwapCount(0);
    setComparisonCount(0);
    setCurrentPhase('');
    generateHeapSortSteps(newArray);
  }, []);

  // Generate heap sort algorithm steps
  const generateHeapSortSteps = useCallback((arr) => {
    const steps = [];
    const workingArray = [...arr];
    let swaps = 0;
    let comparisons = 0;
    const n = workingArray.length;

    // Helper function to heapify subtree rooted at index i
    const heapify = (array, n, i, phase) => {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      // Compare with left child
      if (left < n) {
        comparisons++;
        steps.push({
          type: 'compare',
          array: [...array],
          comparing: [largest, left],
          heapBoundary: phase === 'build' ? n - 1 : n - 1,
          swapCount: swaps,
          comparisonCount: comparisons,
          phase: phase,
          description: `Comparing parent ${array[largest]} with left child ${array[left]}`
        });

        if (array[left] > array[largest]) {
          largest = left;
          steps.push({
            type: 'new_largest',
            array: [...array],
            largest: largest,
            heapBoundary: phase === 'build' ? n - 1 : n - 1,
            swapCount: swaps,
            comparisonCount: comparisons,
            phase: phase,
            description: `Left child ${array[left]} is larger`
          });
        }
      }

      // Compare with right child
      if (right < n) {
        comparisons++;
        steps.push({
          type: 'compare',
          array: [...array],
          comparing: [largest, right],
          heapBoundary: phase === 'build' ? n - 1 : n - 1,
          swapCount: swaps,
          comparisonCount: comparisons,
          phase: phase,
          description: `Comparing largest ${array[largest]} with right child ${array[right]}`
        });

        if (array[right] > array[largest]) {
          largest = right;
          steps.push({
            type: 'new_largest',
            array: [...array],
            largest: largest,
            heapBoundary: phase === 'build' ? n - 1 : n - 1,
            swapCount: swaps,
            comparisonCount: comparisons,
            phase: phase,
            description: `Right child ${array[right]} is larger`
          });
        }
      }

      // Swap if needed
      if (largest !== i) {
        steps.push({
          type: 'swap_start',
          array: [...array],
          swapping: [i, largest],
          heapBoundary: phase === 'build' ? n - 1 : n - 1,
          swapCount: swaps,
          comparisonCount: comparisons,
          phase: phase,
          description: `Swapping ${array[i]} with ${array[largest]} to maintain heap property`
        });

        [array[i], array[largest]] = [array[largest], array[i]];
        swaps++;

        steps.push({
          type: 'swap_complete',
          array: [...array],
          heapBoundary: phase === 'build' ? n - 1 : n - 1,
          swapCount: swaps,
          comparisonCount: comparisons,
          phase: phase
        });

        // Recursively heapify affected subtree
        heapify(array, n, largest, phase);
      }
    };

    // Phase 1: Build Max Heap
    steps.push({
      type: 'phase_start',
      array: [...workingArray],
      heapBoundary: n - 1,
      swapCount: swaps,
      comparisonCount: comparisons,
      phase: 'Building Max Heap',
      description: 'Phase 1: Building max heap from unsorted array'
    });

    // Start from last non-leaf node and heapify all nodes
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({
        type: 'heapify_node',
        array: [...workingArray],
        heapifyRoot: i,
        heapBoundary: n - 1,
        swapCount: swaps,
        comparisonCount: comparisons,
        phase: 'Building Max Heap',
        description: `Heapifying subtree rooted at index ${i}`
      });
      
      heapify(workingArray, n, i, 'build');
    }

    steps.push({
      type: 'heap_built',
      array: [...workingArray],
      heapBoundary: n - 1,
      swapCount: swaps,
      comparisonCount: comparisons,
      phase: 'Max Heap Built',
      description: 'Max heap construction complete! Largest element is at root.'
    });

    // Phase 2: Extract elements one by one
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        type: 'extract_max',
        array: [...workingArray],
        swapping: [0, i],
        heapBoundary: i - 1,
        swapCount: swaps,
        comparisonCount: comparisons,
        phase: 'Extracting Maximum',
        description: `Moving maximum element ${workingArray[0]} to position ${i}`
      });

      // Move current root to end
      [workingArray[0], workingArray[i]] = [workingArray[i], workingArray[0]];
      swaps++;

      steps.push({
        type: 'max_extracted',
        array: [...workingArray],
        sorted: Array.from({length: n - i}, (_, idx) => n - 1 - idx),
        heapBoundary: i - 1,
        swapCount: swaps,
        comparisonCount: comparisons,
        phase: 'Extracting Maximum',
        description: `Element ${workingArray[i]} is now in its final sorted position`
      });

      // Heapify root
      if (i > 1) {
        steps.push({
          type: 'restore_heap',
          array: [...workingArray],
          heapBoundary: i - 1,
          swapCount: swaps,
          comparisonCount: comparisons,
          phase: 'Restoring Heap Property',
          description: 'Restoring heap property after extraction'
        });
        
        heapify(workingArray, i, 0, 'extract');
      }
    }

    // Final step
    steps.push({
      type: 'complete',
      array: [...workingArray],
      sorted: Array.from({length: n}, (_, i) => i),
      heapBoundary: -1,
      swapCount: swaps,
      comparisonCount: comparisons,
      phase: 'Sorting Complete',
      description: 'Heap sort complete! Array is now sorted in ascending order.'
    });

    setAlgorithm(steps);
    setTotalSteps(steps.length);
  }, []);

  // Execute algorithm step by step
  const executeStep = useCallback(() => {
    if (currentStep >= algorithm.length) {
      setIsPlaying(false);
      return;
    }

    const step = algorithm[currentStep];
    
    setSwapCount(step.swapCount || 0);
    setComparisonCount(step.comparisonCount || 0);
    setCurrentPhase(step.phase || '');
    setHeapBoundary(step.heapBoundary);
    
    // Reset visual states
    setComparing([]);
    setSwapping([]);
    
    switch (step.type) {
      case 'phase_start':
      case 'heap_built':
      case 'restore_heap':
        setArray(step.array);
        break;
      case 'heapify_node':
        setArray(step.array);
        break;
      case 'compare':
        setComparing(step.comparing);
        setArray(step.array);
        break;
      case 'new_largest':
        setArray(step.array);
        break;
      case 'swap_start':
      case 'extract_max':
        setSwapping(step.swapping);
        setArray(step.array);
        break;
      case 'swap_complete':
      case 'max_extracted':
        setSorted(step.sorted || []);
        setArray(step.array);
        break;
      case 'complete':
        setSorted(step.sorted);
        setArray(step.array);
        setComparing([]);
        setSwapping([]);
        break;
    }

    setCurrentStep(prev => prev + 1);
  }, [currentStep, algorithm]);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && !isPaused) {
      interval = setInterval(executeStep, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, speed, executeStep]);

  // Initialize array on component mount
  useEffect(() => {
    if (!isInitialized) {
      generateArray(12);
      setIsInitialized(true);
    }
  }, [generateArray]);

  const playPause = () => {
    if (isPlaying) {
      setIsPaused(!isPaused);
    } else {
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setHeapBoundary(array.length - 1);
    setSwapCount(0);
    setComparisonCount(0);
    setCurrentPhase('');
    generateArray(array.length);
  };

  const stepForward = () => {
    if (currentStep < algorithm.length) {
      executeStep();
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const prevStep = algorithm[currentStep - 1];
      
      if (prevStep) {
        setArray(prevStep.array);
        setSwapCount(prevStep.swapCount || 0);
        setComparisonCount(prevStep.comparisonCount || 0);
        setCurrentPhase(prevStep.phase || '');
        setHeapBoundary(prevStep.heapBoundary);
        // Reset visual states
        setComparing([]);
        setSwapping([]);
      }
    }
  };

  const getBarColor = (index) => {
    if (sorted.includes(index)) return 'bg-green-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (index > heapBoundary) return 'bg-green-500'; // Elements beyond heap boundary are sorted
    if (index === 0 && heapBoundary >= 0) return 'bg-blue-500'; // Root of heap
    return 'bg-purple-500';
  };

  const getBarHeight = (value) => {
    return `${(value / 320) * 100}%`;
  };

  // Helper function to get heap tree structure for visualization
  const getHeapLevel = (index) => {
    return Math.floor(Math.log2(index + 1));
  };

  const getHeapPosition = (index, level) => {
    const positionInLevel = index - (Math.pow(2, level) - 1);
    return positionInLevel;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer/arrays" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors duration-200">
            ← Back to Arrays
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Heap Sort Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Heap Sort uses a binary heap data structure to sort elements. It first builds a max heap, 
            then repeatedly extracts the maximum element and places it in the correct position.
          </p>
        </div>

        {/* Algorithm Info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-slate-300 text-sm">Best: O(n log n)</p>
            <p className="text-slate-300 text-sm">Average: O(n log n)</p>
            <p className="text-slate-300 text-sm">Worst: O(n log n)</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Space</h3>
            <p className="text-slate-300">O(1)</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Comparisons</h3>
            <p className="text-purple-400 text-2xl font-bold">{comparisonCount}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Swaps</h3>
            <p className="text-pink-400 text-2xl font-bold">{swapCount}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Phase</h3>
            <p className="text-blue-400 text-sm font-medium">{currentPhase || 'Ready'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
          <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
            <button
              onClick={playPause}
              disabled={currentStep >= algorithm.length && !isPaused}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isPlaying && !isPaused ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={stepBackward}
              disabled={currentStep <= 0}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              ← Step
            </button>
            
            <button
              onClick={stepForward}
              disabled={currentStep >= algorithm.length}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Step →
            </button>
            
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Reset
            </button>
            
            <button
              onClick={() => generateArray(array.length)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              New Array
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <label className="text-white">
              Speed:
              <input
                type="range"
                min="100"
                max="2000"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="ml-2"
              />
              <span className="ml-2 text-sm">{speed}ms</span>
            </label>
            
            <label className="text-white">
              Size:
              <select
                value={array.length}
                onChange={(e) => generateArray(Number(e.target.value))}
                className="ml-2 px-2 py-1 bg-slate-700 text-white rounded"
                disabled={isPlaying}
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>

          {algorithm.length > 0 && (
            <div className="mt-4 text-center">
              <div className="text-sm text-slate-400 mb-2">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              {currentStep > 0 && algorithm[currentStep - 1]?.description && (
                <div className="mt-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg p-2">
                  {algorithm[currentStep - 1].description}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Array Visualization</h3>
          
          {array.length > 0 && (
            <div className="flex justify-center items-end gap-1 mb-4" style={{ minHeight: '300px' }}>
              {array.map((value, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center group"
                  style={{ minWidth: '30px' }}
                >
                  <div
                    className={`w-8 transition-all duration-500 border-2 border-slate-600 ${getBarColor(index)}`}
                    style={{ height: getBarHeight(value) }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white">
                      {value}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{index}</div>
                  {index === 0 && heapBoundary >= 0 && (
                    <div className="text-xs text-blue-400 mt-1">root</div>
                  )}
                  {index === heapBoundary && heapBoundary > 0 && (
                    <div className="text-xs text-yellow-400 mt-1">boundary</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Heap boundary indicator */}
          {heapBoundary >= 0 && (
            <div className="text-center mb-4">
              <div className="text-sm text-slate-300">
                <span className="text-purple-400">Heap elements:</span> 0 to {heapBoundary}
                {heapBoundary < array.length - 1 && (
                  <>
                    {' | '}
                    <span className="text-green-400">Sorted elements:</span> {heapBoundary + 1} to {array.length - 1}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-slate-300">Unsorted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-slate-300">Comparing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-slate-300">Swapping</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-300">Heap Root</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-300">Sorted</span>
            </div>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-8 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">How Heap Sort Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-purple-400 mb-2">Phase 1: Build Max Heap</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Start from the last non-leaf node</li>
                <li>• Apply heapify operation on each node</li>
                <li>• Ensure parent is larger than children</li>
                <li>• Continue until entire array forms max heap</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-pink-400 mb-2">Phase 2: Extract Maximum</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Move root (maximum) to end of array</li>
                <li>• Reduce heap size by 1</li>
                <li>• Heapify the new root</li>
                <li>• Repeat until heap size is 1</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
