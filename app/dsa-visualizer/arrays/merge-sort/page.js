'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function MergeSortVisualizer() {
  const [array, setArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [comparing, setComparing] = useState([]);
  const [merging, setMerging] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [algorithm, setAlgorithm] = useState([]);
  const [swapCount, setSwapCount] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [recursionDepth, setRecursionDepth] = useState(0);
  const [subarrays, setSubarrays] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate merge sort algorithm steps
  const generateMergeSortSteps = useCallback((arr) => {
    const steps = [];
    let comparisons = 0;
    let swaps = 0;
    let maxDepth = 0;

    const mergeSort = (array, left, right, depth = 0) => {
      maxDepth = Math.max(maxDepth, depth);
      
      if (left >= right) return;

      // Add divide step
      const mid = Math.floor((left + right) / 2);
      steps.push({
        type: 'divide',
        left,
        right,
        mid,
        array: [...array],
        message: `Dividing array from index ${left} to ${right}`,
        comparisonCount: comparisons,
        swapCount: swaps,
        depth
      });

      // Recursively sort left and right halves
      mergeSort(array, left, mid, depth + 1);
      mergeSort(array, mid + 1, right, depth + 1);

      // Merge the sorted halves
      merge(array, left, mid, right, depth);
    };

    const merge = (array, left, mid, right, depth) => {
      const leftArray = [];
      const rightArray = [];

      // Copy data to temp arrays
      for (let i = left; i <= mid; i++) {
        leftArray.push({...array[i]});
      }
      for (let i = mid + 1; i <= right; i++) {
        rightArray.push({...array[i]});
      }

      let i = 0, j = 0, k = left;

      // Add merge start step
      steps.push({
        type: 'merge_start',
        left,
        right,
        mid,
        array: [...array],
        leftArray: [...leftArray],
        rightArray: [...rightArray],
        message: `Starting to merge subarrays [${left}-${mid}] and [${mid + 1}-${right}]`,
        comparisonCount: comparisons,
        swapCount: swaps,
        depth
      });

      // Merge the temp arrays back into array[left..right]
      while (i < leftArray.length && j < rightArray.length) {
        comparisons++;
        
        // Add comparison step
        steps.push({
          type: 'compare',
          comparing: [left + i, mid + 1 + j],
          array: [...array],
          message: `Comparing ${leftArray[i].value} and ${rightArray[j].value}`,
          comparisonCount: comparisons,
          swapCount: swaps,
          depth
        });

        if (leftArray[i].value <= rightArray[j].value) {
          array[k] = leftArray[i];
          i++;
        } else {
          array[k] = rightArray[j];
          j++;
        }
        
        swaps++;
        // Add merge step
        steps.push({
          type: 'merge',
          merging: [k],
          array: [...array],
          message: `Placing ${array[k].value} at position ${k}`,
          comparisonCount: comparisons,
          swapCount: swaps,
          depth
        });

        k++;
      }

      // Copy remaining elements of leftArray
      while (i < leftArray.length) {
        array[k] = leftArray[i];
        swaps++;
        steps.push({
          type: 'merge',
          merging: [k],
          array: [...array],
          message: `Placing remaining element ${array[k].value} at position ${k}`,
          comparisonCount: comparisons,
          swapCount: swaps,
          depth
        });
        i++;
        k++;
      }

      // Copy remaining elements of rightArray
      while (j < rightArray.length) {
        array[k] = rightArray[j];
        swaps++;
        steps.push({
          type: 'merge',
          merging: [k],
          array: [...array],
          message: `Placing remaining element ${array[k].value} at position ${k}`,
          comparisonCount: comparisons,
          swapCount: swaps,
          depth
        });
        j++;
        k++;
      }

      // Add merge complete step
      steps.push({
        type: 'merge_complete',
        left,
        right,
        array: [...array],
        message: `Completed merging subarray [${left}-${right}]`,
        comparisonCount: comparisons,
        swapCount: swaps,
        depth
      });
    };

    const tempArray = arr.map(item => ({...item}));
    mergeSort(tempArray, 0, arr.length - 1);

    // Add final completion step
    steps.push({
      type: 'complete',
      array: [...tempArray],
      message: 'Merge sort completed!',
      comparisonCount: comparisons,
      swapCount: swaps,
      depth: 0
    });

    setAlgorithm(steps);
    setTotalSteps(steps.length);
    setRecursionDepth(maxDepth);
  }, []);

  // Generate random array
  const generateArray = useCallback((size = 16) => {
    const newArray = Array.from({ length: size }, (_, i) => ({
      value: Math.floor(Math.random() * 300) + 10,
      id: i
    }));
    setArray(newArray);
    setComparing([]);
    setMerging([]);
    setCompleted([]);
    setSubarrays([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
    setSwapCount(0);
    setComparisonCount(0);
    setRecursionDepth(0);
    generateMergeSortSteps(newArray);
  }, [generateMergeSortSteps]);
  
  // Execute algorithm step by step
  const executeStep = useCallback(() => {
    if (currentStep >= algorithm.length) {
      setIsPlaying(false);
      return;
    }

    const step = algorithm[currentStep];
    
    setSwapCount(step.swapCount || 0);
    setComparisonCount(step.comparisonCount || 0);
    
    // Reset visual states
    setComparing([]);
    setMerging([]);
    setSubarrays([]);
    
    switch (step.type) {
      case 'divide':
        setSubarrays([{ left: step.left, right: step.right, mid: step.mid }]);
        break;
      case 'merge_start':
        setSubarrays([
          { left: step.left, right: step.mid, type: 'left' },
          { left: step.mid + 1, right: step.right, type: 'right' }
        ]);
        break;
      case 'compare':
        setComparing(step.comparing);
        setArray(step.array);
        break;
      case 'merge':
        setMerging(step.merging);
        setArray(step.array);
        break;
      case 'merge_complete':
        setCompleted(prev => [...new Set([...prev, ...Array.from({length: step.right - step.left + 1}, (_, i) => step.left + i)])]);
        setArray(step.array);
        break;
      case 'complete':
        setCompleted(Array.from({length: step.array.length}, (_, i) => i));
        setArray(step.array);
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
      generateArray(16);
      setIsInitialized(true);
    }
  }, [generateArray, isInitialized]);

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
    setMerging([]);
    setCompleted([]);
    setSubarrays([]);
    setSwapCount(0);
    setComparisonCount(0);
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
        // Reset visual states
        setComparing([]);
        setMerging([]);
        setSubarrays([]);
      }
    }
  };

  const getBarColor = (index) => {
    if (completed.includes(index)) return 'bg-green-500';
    if (merging.includes(index)) return 'bg-blue-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    return 'bg-purple-500';
  };

  const getBarHeight = (value) => {
    return `${(value / 320) * 100}%`;
  };

  const getSubarrayColor = (type) => {
    if (type === 'left') return 'border-t-4 border-blue-400';
    if (type === 'right') return 'border-t-4 border-red-400';
    return 'border-t-4 border-yellow-400';
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center theme-accent hover:theme-text-secondary mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Merge Sort Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Merge Sort uses a divide-and-conquer approach to sort arrays. It divides the array into smaller subarrays, 
            sorts them recursively, and then merges them back together in sorted order.
          </p>
        </div>

        {/* Algorithm Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-slate-300 text-sm">Best: O(n log n)</p>
            <p className="text-slate-300 text-sm">Average: O(n log n)</p>
            <p className="text-slate-300 text-sm">Worst: O(n log n)</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Space Complexity</h3>
            <p className="text-slate-300">O(n)</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Comparisons</h3>
            <p className="theme-accent text-2xl font-bold">{comparisonCount}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Array Access</h3>
            <p className="text-pink-400 text-2xl font-bold">{swapCount}</p>
          </div>
        </div>

        {/* Array Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={playPause}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
              >
                {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:theme-surface-elevated transition-colors duration-200"
              >
                Reset
              </button>
              <button
                onClick={stepBackward}
                disabled={currentStep === 0}
                className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:theme-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ← Step
              </button>
              <button
                onClick={stepForward}
                disabled={currentStep >= algorithm.length}
                className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:theme-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Step →
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-slate-300 text-sm">Size:</label>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={array.length}
                  onChange={(e) => generateArray(parseInt(e.target.value))}
                  className="w-24 accent-purple-500"
                />
                <span className="text-slate-300 text-sm w-8">{array.length}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-slate-300 text-sm">Speed:</label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-24 accent-purple-500"
                />
                <span className="text-slate-300 text-sm w-12">{speed}ms</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-slate-400">
            Step {currentStep} of {totalSteps} | 
            <span className="text-yellow-400 ml-2">Yellow: Comparing</span>
            <span className="text-blue-400 ml-4">Blue: Merging</span>
            <span className="text-green-400 ml-4">Green: Completed</span>
          </div>
        </div>

        {/* Visualization */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
          <div className="relative">
            {/* Subarray indicators */}
            {subarrays.map((subarray, index) => (
              <div
                key={index}
                className={`absolute top-0 h-1 ${getSubarrayColor(subarray.type)}`}
                style={{
                  left: `${(subarray.left / array.length) * 100}%`,
                  width: `${((subarray.right - subarray.left + 1) / array.length) * 100}%`
                }}
              />
            ))}
            
            {/* Array bars */}
            <div className="flex items-end justify-center gap-1 h-96 pt-4">
              {array.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`${getBarColor(index)} transition-all duration-300 rounded-t-md min-w-[4px] flex items-end justify-center text-white text-xs font-bold pb-1`}
                    style={{
                      height: getBarHeight(value),
                      width: Math.max(20, 600 / array.length)
                    }}
                  >
                    {array.length <= 32 ? value : ''}
                  </div>
                  {array.length <= 20 && (
                    <div className="text-slate-400 text-xs mt-1">{index}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">How Merge Sort Works</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="theme-accent font-bold">1.</span>
                Divide the array into two halves recursively
              </li>
              <li className="flex items-start gap-2">
                <span className="theme-accent font-bold">2.</span>
                Continue dividing until each subarray has one element
              </li>
              <li className="flex items-start gap-2">
                <span className="theme-accent font-bold">3.</span>
                Merge subarrays back together in sorted order
              </li>
              <li className="flex items-start gap-2">
                <span className="theme-accent font-bold">4.</span>
                Compare elements and place smaller one first
              </li>
            </ul>
          </div>
          
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Key Properties</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>Stable:</strong> Equal elements maintain relative order</li>
              <li>• <strong>Consistent:</strong> O(n log n) time complexity always</li>
              <li>• <strong>Divide & Conquer:</strong> Recursive problem solving</li>
              <li>• <strong>Memory:</strong> Requires O(n) additional space</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}