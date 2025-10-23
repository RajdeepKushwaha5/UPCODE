'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function InsertionSortVisualizer() {
  const [array, setArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [comparing, setComparing] = useState([]);
  const [inserting, setInserting] = useState(-1);
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
    setInserting(-1);
    setSorted([0]); // First element is always sorted
    setSwapCount(0);
    setComparisonCount(0);
    generateInsertionSortSteps(newArray);
  }, []);

  // Generate insertion sort algorithm steps
  const generateInsertionSortSteps = useCallback((arr) => {
    const steps = [];
    const workingArray = [...arr];
    let swaps = 0;
    let comparisons = 0;

    // First element is already sorted
    steps.push({
      type: 'start',
      array: [...workingArray],
      sorted: [0],
      swapCount: swaps,
      comparisonCount: comparisons
    });

    for (let i = 1; i < workingArray.length; i++) {
      // Pick the current element to insert
      steps.push({
        type: 'pick_element',
        array: [...workingArray],
        inserting: i,
        sorted: Array.from({length: i}, (_, idx) => idx),
        swapCount: swaps,
        comparisonCount: comparisons
      });

      let j = i - 1;
      const key = workingArray[i];

      // Compare and shift elements
      while (j >= 0 && workingArray[j] > key) {
        comparisons++;
        
        steps.push({
          type: 'compare',
          array: [...workingArray],
          comparing: [j, j + 1],
          inserting: i,
          sorted: Array.from({length: i}, (_, idx) => idx),
          swapCount: swaps,
          comparisonCount: comparisons
        });

        // Shift element to the right
        workingArray[j + 1] = workingArray[j];
        swaps++;

        steps.push({
          type: 'shift',
          array: [...workingArray],
          inserting: i,
          sorted: Array.from({length: i}, (_, idx) => idx),
          swapCount: swaps,
          comparisonCount: comparisons
        });

        j--;
      }

      // Insert the key at correct position
      workingArray[j + 1] = key;
      
      steps.push({
        type: 'insert',
        array: [...workingArray],
        sorted: Array.from({length: i + 1}, (_, idx) => idx),
        swapCount: swaps,
        comparisonCount: comparisons
      });
    }

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
    setComparing([]);
    setInserting(-1);
    
    switch (step.type) {
      case 'start':
        setSorted(step.sorted);
        setArray(step.array);
        break;
      case 'pick_element':
        setInserting(step.inserting);
        setSorted(step.sorted);
        setArray(step.array);
        break;
      case 'compare':
        setComparing(step.comparing);
        setInserting(step.inserting || -1);
        setSorted(step.sorted);
        setArray(step.array);
        break;
      case 'shift':
        setInserting(step.inserting);
        setSorted(step.sorted);
        setArray(step.array);
        break;
      case 'insert':
        setSorted(step.sorted);
        setArray(step.array);
        break;
    }
    setCurrentStep(prev => prev + 1);
  }, [currentStep, algorithm]);

  useEffect(() => {
    let interval;
    if (isPlaying && !isPaused) {
      interval = setInterval(executeStep, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, speed, executeStep]);

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
    setInserting(-1);
    setSorted([0]);
    setSwapCount(0);
    setComparisonCount(0);
    generateArray(array.length);
  };

  const getBarColor = (index) => {
    if (sorted.includes(index)) return 'bg-green-500';
    if (inserting === index) return 'bg-purple-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    return 'bg-slate-500';
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer/arrays" className="inline-flex items-center theme-accent hover:theme-text-secondary mb-4 transition-colors duration-200">
            ← Back to Arrays
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Insertion Sort Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Insertion Sort builds the sorted array one element at a time by inserting elements into their correct position.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-slate-300 text-sm">Best: O(n)</p>
            <p className="text-slate-300 text-sm">Average: O(n²)</p>
            <p className="text-slate-300 text-sm">Worst: O(n²)</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Comparisons</h3>
            <p className="theme-accent text-2xl font-bold">{comparisonCount}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Shifts</h3>
            <p className="text-pink-400 text-2xl font-bold">{swapCount}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <button onClick={playPause} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium">
              {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
            </button>
            <button onClick={reset} className="ml-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:theme-surface-elevated transition-colors duration-200">
              Reset
            </button>
          </div>
        </div>

        <div className="theme-surface backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
          <div className="flex items-end justify-center gap-1 h-96">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`${getBarColor(index)} transition-all duration-300 rounded-t-md min-w-[4px] flex items-end justify-center text-white text-xs font-bold pb-1`}
                  style={{
                    height: `${(value / 320) * 100}%`,
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
      </div>
    </div>
  );
}
