'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function SelectionSortVisualizer() {
  const [array, setArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [comparing, setComparing] = useState([]);
  const [minimum, setMinimum] = useState(-1);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithm, setAlgorithm] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate random array
  const generateArray = useCallback((size = 20) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setComparing([]);
    setMinimum(-1);
    setSwapping([]);
    setSorted([]);
    setSwapCount(0);
    setComparisonCount(0);
    generateSelectionSortSteps(newArray);
  }, []);

  // Generate selection sort algorithm steps
  const generateSelectionSortSteps = useCallback((arr) => {
    const steps = [];
    const workingArray = [...arr];
    let swaps = 0;
    let comparisons = 0;

    for (let i = 0; i < workingArray.length - 1; i++) {
      // Start new pass - highlight current position
      steps.push({
        type: 'start_pass',
        array: [...workingArray],
        currentIndex: i,
        swapCount: swaps,
        comparisonCount: comparisons,
        description: `Pass ${i + 1}: Finding minimum element from position ${i}`
      });

      let minIndex = i;
      
      // Set initial minimum
      steps.push({
        type: 'set_minimum',
        array: [...workingArray],
        currentIndex: i,
        minimum: minIndex,
        swapCount: swaps,
        comparisonCount: comparisons
      });

      // Compare with rest of elements
      for (let j = i + 1; j < workingArray.length; j++) {
        comparisons++;
        
        steps.push({
          type: 'compare',
          array: [...workingArray],
          comparing: [minIndex, j],
          minimum: minIndex,
          currentIndex: i,
          swapCount: swaps,
          comparisonCount: comparisons,
          description: `Comparing ${workingArray[minIndex]} with ${workingArray[j]}`
        });

        if (workingArray[j] < workingArray[minIndex]) {
          minIndex = j;
          steps.push({
            type: 'new_minimum',
            array: [...workingArray],
            minimum: minIndex,
            currentIndex: i,
            swapCount: swaps,
            comparisonCount: comparisons,
            description: `New minimum found: ${workingArray[minIndex]}`
          });
        }
      }

      // Swap if needed
      if (minIndex !== i) {
        steps.push({
          type: 'swap_start',
          array: [...workingArray],
          swapping: [i, minIndex],
          minimum: minIndex,
          currentIndex: i,
          swapCount: swaps,
          comparisonCount: comparisons,
          description: `Swapping ${workingArray[i]} with ${workingArray[minIndex]}`
        });

        [workingArray[i], workingArray[minIndex]] = [workingArray[minIndex], workingArray[i]];
        swaps++;

        steps.push({
          type: 'swap_complete',
          array: [...workingArray],
          currentIndex: i,
          swapCount: swaps,
          comparisonCount: comparisons
        });
      }

      // Mark as sorted
      steps.push({
        type: 'mark_sorted',
        array: [...workingArray],
        sorted: Array.from({length: i + 1}, (_, idx) => idx),
        swapCount: swaps,
        comparisonCount: comparisons
      });
    }

    // Final step - all sorted
    steps.push({
      type: 'complete',
      array: [...workingArray],
      sorted: Array.from({length: workingArray.length}, (_, i) => i),
      swapCount: swaps,
      comparisonCount: comparisons,
      description: 'Selection sort complete!'
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
    
    // Reset visual states
    setComparing([]);
    setMinimum(-1);
    setSwapping([]);
    
    switch (step.type) {
      case 'start_pass':
        setArray(step.array);
        break;
      case 'set_minimum':
        setMinimum(step.minimum);
        setArray(step.array);
        break;
      case 'compare':
        setComparing(step.comparing);
        setMinimum(step.minimum);
        setArray(step.array);
        break;
      case 'new_minimum':
        setMinimum(step.minimum);
        setArray(step.array);
        break;
      case 'swap_start':
        setSwapping(step.swapping);
        setMinimum(step.minimum);
        setArray(step.array);
        break;
      case 'swap_complete':
        setSwapping([]);
        setArray(step.array);
        break;
      case 'mark_sorted':
        setSorted(step.sorted);
        setArray(step.array);
        break;
      case 'complete':
        setSorted(step.sorted);
        setArray(step.array);
        setComparing([]);
        setMinimum(-1);
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
      generateArray(20);
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
    setMinimum(-1);
    setSwapping([]);
    setSorted([]);
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
        setMinimum(-1);
        setSwapping([]);
      }
    }
  };

  const getBarColor = (index) => {
    if (sorted.includes(index)) return 'bg-green-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (minimum === index) return 'bg-blue-500';
    return 'bg-purple-500';
  };

  const getBarHeight = (value) => {
    return `${(value / 320) * 100}%`;
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer/arrays" className="inline-flex items-center theme-accent hover:theme-text-secondary mb-4 transition-colors duration-200">
            ← Back to Arrays
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Selection Sort Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Selection Sort finds the minimum element and places it at the beginning. It divides the array into 
            sorted and unsorted portions, repeatedly selecting the smallest element.
          </p>
        </div>

        {/* Algorithm Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-slate-300 text-sm">Best: O(n²)</p>
            <p className="text-slate-300 text-sm">Average: O(n²)</p>
            <p className="text-slate-300 text-sm">Worst: O(n²)</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Space Complexity</h3>
            <p className="text-slate-300">O(1)</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Comparisons</h3>
            <p className="theme-accent text-2xl font-bold">{comparisonCount}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Swaps</h3>
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
                  min="5"
                  max="50"
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
            <span className="text-blue-400 ml-2">Blue: Current Minimum</span>
            <span className="text-yellow-400 ml-4">Yellow: Comparing</span>
            <span className="text-red-400 ml-4">Red: Swapping</span>
            <span className="text-green-400 ml-4">Green: Sorted</span>
          </div>
        </div>

        {/* Visualization */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
          <div className="flex items-end justify-center gap-1 h-96">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`${getBarColor(index)} transition-all duration-300 rounded-t-md min-w-[4px] flex items-end justify-center text-white text-xs font-bold pb-1`}
                  style={{
                    height: getBarHeight(value),
                    width: Math.max(15, 600 / array.length)
                  }}
                >
                  {array.length <= 25 ? value : ''}
                </div>
                {array.length <= 20 && (
                  <div className="text-slate-400 text-xs mt-1">{index}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">How Selection Sort Works</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="theme-accent font-bold">1.</span>
                Find the minimum element in the unsorted portion
              </li>
              <li className="flex items-start gap-2">
                <span className="theme-accent font-bold">2.</span>
                Swap it with the first element of unsorted portion
              </li>
              <li className="flex items-start gap-2">
                <span className="theme-accent font-bold">3.</span>
                Move the boundary between sorted and unsorted
              </li>
              <li className="flex items-start gap-2">
                <span className="theme-accent font-bold">4.</span>
                Repeat until the entire array is sorted
              </li>
            </ul>
          </div>
          
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Key Properties</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>Time Complexity:</strong> Always O(n²), regardless of input</li>
              <li>• <strong>Space Complexity:</strong> O(1) - sorts in place</li>
              <li>• <strong>Stability:</strong> Not stable (doesn't preserve relative order)</li>
              <li>• <strong>Adaptive:</strong> No - doesn't perform better on nearly sorted data</li>
              <li>• <strong>Swaps:</strong> At most n-1 swaps (fewer than bubble sort)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}