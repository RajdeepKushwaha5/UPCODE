'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function QuickSortVisualizer() {
  const [array, setArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [pivotIndex, setPivotIndex] = useState(null);
  const [leftPointer, setLeftPointer] = useState(null);
  const [rightPointer, setRightPointer] = useState(null);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [partitions, setPartitions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [algorithm, setAlgorithm] = useState([]);
  const [swapCount, setSwapCount] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [recursionDepth, setRecursionDepth] = useState(0);

  // Generate random array
  const generateArray = useCallback((size = 20) => {
    const newArray = Array.from({ length: size }, (_, i) => ({
      value: Math.floor(Math.random() * 300) + 10,
      id: i
    }));
    setArray(newArray);
    setPivotIndex(null);
    setLeftPointer(null);
    setRightPointer(null);
    setComparing([]);
    setSwapping([]);
    setCompleted([]);
    setPartitions([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
    setSwapCount(0);
    setComparisonCount(0);
    setRecursionDepth(0);
    generateQuickSortSteps(newArray);
  }, []);

  // Generate quick sort algorithm steps
  const generateQuickSortSteps = (arr) => {
    const steps = [];
    const tempArray = [...arr];
    let swaps = 0;
    let comparisons = 0;
    let maxDepth = 0;

    const quickSort = (array, low, high, depth = 0) => {
      maxDepth = Math.max(maxDepth, depth);
      
      if (low < high) {
        steps.push({
          type: 'partition_start',
          low,
          high,
          array: [...array],
          message: `Starting partition from index ${low} to ${high}`,
          swapCount: swaps,
          comparisonCount: comparisons,
          depth
        });

        const pivotIdx = partition(array, low, high, depth);
        
        steps.push({
          type: 'partition_complete',
          pivotIndex: pivotIdx,
          low,
          high,
          array: [...array],
          message: `Pivot ${array[pivotIdx].value} is now in its correct position`,
          swapCount: swaps,
          comparisonCount: comparisons,
          depth
        });

        // Recursively sort left and right subarrays
        quickSort(array, low, pivotIdx - 1, depth + 1);
        quickSort(array, pivotIdx + 1, high, depth + 1);
      } else if (low === high) {
        steps.push({
          type: 'single_element',
          index: low,
          array: [...array],
          message: `Single element ${array[low]?.value} is already sorted`,
          swapCount: swaps,
          comparisonCount: comparisons,
          depth
        });
      }
    };

    const partition = (array, low, high, depth) => {
      const pivot = array[high];
      
      steps.push({
        type: 'choose_pivot',
        pivotIndex: high,
        low,
        high,
        array: [...array],
        message: `Choosing ${pivot.value} as pivot`,
        swapCount: swaps,
        comparisonCount: comparisons,
        depth
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        
        steps.push({
          type: 'compare',
          comparing: [j, high],
          leftPointer: i + 1,
          rightPointer: j,
          pivotIndex: high,
          array: [...array],
          message: `Comparing ${array[j].value} with pivot ${pivot.value}`,
          swapCount: swaps,
          comparisonCount: comparisons,
          depth
        });

        if (array[j].value < pivot.value) {
          i++;
          if (i !== j) {
            swaps++;
            steps.push({
              type: 'swap',
              swapping: [i, j],
              pivotIndex: high,
              array: [...array],
              message: `Swapping ${array[i].value} and ${array[j].value}`,
              swapCount: swaps,
              comparisonCount: comparisons,
              depth
            });

            [array[i], array[j]] = [array[j], array[i]];
          }
        }
      }

      // Place pivot in correct position
      swaps++;
      steps.push({
        type: 'place_pivot',
        swapping: [i + 1, high],
        pivotIndex: i + 1,
        array: [...array],
        message: `Placing pivot ${pivot.value} in its correct position`,
        swapCount: swaps,
        comparisonCount: comparisons,
        depth
      });

      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      
      return i + 1;
    };

    quickSort(tempArray, 0, tempArray.length - 1);

    // Mark all elements as completed
    steps.push({
      type: 'completed',
      array: [...tempArray],
      message: 'Quick Sort completed!',
      swapCount: swaps,
      comparisonCount: comparisons,
      depth: 0
    });

    setAlgorithm(steps);
    setTotalSteps(steps.length);
    setRecursionDepth(maxDepth);
  };

  // Execute algorithm step by step
  const executeStep = useCallback(() => {
    if (currentStep >= algorithm.length) {
      setIsPlaying(false);
      return;
    }

    const step = algorithm[currentStep];
    
    setSwapCount(step.swapCount || 0);
    setComparisonCount(step.comparisonCount || 0);
    
    // Reset all visual states
    setPivotIndex(null);
    setLeftPointer(null);
    setRightPointer(null);
    setComparing([]);
    setSwapping([]);
    setPartitions([]);
    
    switch (step.type) {
      case 'partition_start':
        setPartitions([{ low: step.low, high: step.high }]);
        break;
      case 'choose_pivot':
        setPivotIndex(step.pivotIndex);
        setPartitions([{ low: step.low, high: step.high }]);
        break;
      case 'compare':
        setComparing(step.comparing);
        setPivotIndex(step.pivotIndex);
        setLeftPointer(step.leftPointer);
        setRightPointer(step.rightPointer);
        break;
      case 'swap':
        setSwapping(step.swapping);
        setPivotIndex(step.pivotIndex);
        setArray(step.array);
        break;
      case 'place_pivot':
        setSwapping(step.swapping);
        setArray(step.array);
        break;
      case 'partition_complete':
        setPivotIndex(step.pivotIndex);
        setCompleted(prev => [...prev, step.pivotIndex]);
        break;
      case 'single_element':
        setCompleted(prev => [...prev, step.index]);
        break;
      case 'completed':
        setCompleted(Array.from({ length: step.array.length }, (_, i) => i));
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
    generateArray();
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
    setPivotIndex(null);
    setLeftPointer(null);
    setRightPointer(null);
    setComparing([]);
    setSwapping([]);
    setCompleted([]);
    setPartitions([]);
    setSwapCount(0);
    setComparisonCount(0);
    generateArray(array.length);
  };

  const stepForward = () => {
    if (currentStep < algorithm.length) {
      executeStep();
    }
  };

  const getBarColor = (index) => {
    if (completed.includes(index)) return 'bg-green-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (pivotIndex === index) return 'bg-orange-500';
    if (leftPointer === index) return 'bg-blue-500';
    if (rightPointer === index) return 'bg-cyan-500';
    return 'bg-purple-500';
  };

  const getBarHeight = (value) => {
    return `${(value / 320) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Quick Sort Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it. 
            Elements smaller than pivot go to the left, larger elements go to the right.
          </p>
        </div>

        {/* Algorithm Info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-slate-300 text-sm">Best: O(n log n)</p>
            <p className="text-slate-300 text-sm">Average: O(n log n)</p>
            <p className="text-slate-300 text-sm">Worst: O(n²)</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Space Complexity</h3>
            <p className="text-slate-300">O(log n)</p>
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
            <h3 className="text-lg font-semibold text-white mb-2">Max Depth</h3>
            <p className="text-blue-400 text-2xl font-bold">{recursionDepth}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={playPause}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-200 font-semibold"
            >
              {isPlaying && !isPaused ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button
              onClick={reset}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200 font-semibold"
            >
              🔄 Reset
            </button>
            <button
              onClick={stepForward}
              disabled={currentStep >= algorithm.length}
              className="bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50 font-semibold"
            >
              ⏭️ Step Forward
            </button>
            <button
              onClick={() => generateArray(20)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-semibold"
            >
              🎲 Random Array
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-slate-300 font-semibold">Speed:</label>
              <input
                type="range"
                min="200"
                max="2000"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32 accent-purple-500"
              />
              <span className="text-slate-300 text-sm min-w-[60px]">{speed}ms</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-slate-300 font-semibold">Array Size:</label>
              <input
                type="range"
                min="5"
                max="30"
                value={array.length}
                onChange={(e) => generateArray(Number(e.target.value))}
                className="w-32 accent-purple-500"
                disabled={isPlaying}
              />
              <span className="text-slate-300 text-sm min-w-[30px]">{array.length}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Progress: {currentStep} / {totalSteps}</span>
              <span>{totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Unsorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-slate-300">Pivot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Left Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-500 rounded"></div>
            <span className="text-slate-300">Right Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-slate-300">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-300">Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">Sorted</span>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-end justify-center gap-1 h-80 overflow-x-auto pb-4 relative">
            {/* Partition indicators */}
            {partitions.map((partition, idx) => (
              <div
                key={idx}
                className="absolute top-0 border-t-4 border-yellow-400 opacity-50"
                style={{
                  left: `${(partition.low / array.length) * 100}%`,
                  width: `${((partition.high - partition.low + 1) / array.length) * 100}%`
                }}
              />
            ))}
            
            {array.map((item, index) => (
              <div
                key={item.id}
                className={`
                  ${getBarColor(index)} 
                  transition-all duration-300 ease-in-out
                  rounded-t-md relative group cursor-pointer
                  transform hover:scale-105
                `}
                style={{
                  height: getBarHeight(item.value),
                  width: `${Math.max(600 / array.length, 20)}px`,
                  minWidth: '20px'
                }}
              >
                {/* Value label */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 px-2 py-1 rounded">
                  {item.value}
                </div>
                {/* Index label */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-400">
                  {index}
                </div>
                {/* Special indicators */}
                {pivotIndex === index && (
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold">P</div>
                )}
                {leftPointer === index && (
                  <div className="absolute top-1 left-1 text-xs text-white font-bold">L</div>
                )}
                {rightPointer === index && (
                  <div className="absolute top-1 right-1 text-xs text-white font-bold">R</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Info */}
        {currentStep > 0 && algorithm[currentStep - 1] && (
          <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h4 className="text-lg font-semibold text-white mb-2">Current Step:</h4>
            <p className="text-slate-300">{algorithm[currentStep - 1].message}</p>
          </div>
        )}

        {/* Algorithm Explanation */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">How Quick Sort Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-3">Algorithm Steps:</h4>
              <ol className="text-slate-300 space-y-2">
                <li>1. Choose a pivot element (usually last element)</li>
                <li>2. Partition array around pivot</li>
                <li>3. Elements ≤ pivot go left, others go right</li>
                <li>4. Recursively sort left and right subarrays</li>
                <li>5. Combine sorted subarrays</li>
              </ol>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pink-400 mb-3">Key Properties:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• Divide and conquer approach</li>
                <li>• In-place sorting algorithm</li>
                <li>• Not stable (relative order may change)</li>
                <li>• Average case is very efficient</li>
                <li>• Worst case when pivot is always min/max</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
      </div>
    </div>
  );
}