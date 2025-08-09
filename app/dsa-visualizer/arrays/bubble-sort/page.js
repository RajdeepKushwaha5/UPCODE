'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [algorithm, setAlgorithm] = useState([]);
  const [swapCount, setSwapCount] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);

  // Generate random array
  const generateArray = useCallback((size = 20) => {
    const newArray = Array.from({ length: size }, (_, i) => ({
      value: Math.floor(Math.random() * 300) + 10,
      id: i
    }));
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
    setCompleted([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
    setSwapCount(0);
    setComparisonCount(0);
    generateBubbleSortSteps(newArray);
  }, []);

  // Generate bubble sort algorithm steps
  const generateBubbleSortSteps = (arr) => {
    const steps = [];
    const arrayLength = arr.length;
    const tempArray = [...arr];
    let swaps = 0;
    let comparisons = 0;

    for (let i = 0; i < arrayLength - 1; i++) {
      for (let j = 0; j < arrayLength - i - 1; j++) {
        comparisons++;
        // Add comparison step
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          array: [...tempArray],
          message: `Comparing ${tempArray[j].value} and ${tempArray[j + 1].value}`,
          swapCount: swaps,
          comparisonCount: comparisons
        });

        if (tempArray[j].value > tempArray[j + 1].value) {
          swaps++;
          // Add swap step
          steps.push({
            type: 'swap',
            indices: [j, j + 1],
            array: [...tempArray],
            message: `Swapping ${tempArray[j].value} and ${tempArray[j + 1].value}`,
            swapCount: swaps,
            comparisonCount: comparisons
          });

          // Perform swap
          [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
        }
      }
      // Mark element as completed
      steps.push({
        type: 'complete',
        index: arrayLength - i - 1,
        array: [...tempArray],
        message: `Element ${tempArray[arrayLength - i - 1].value} is in its final position`,
        swapCount: swaps,
        comparisonCount: comparisons
      });
    }

    // Mark first element as completed
    if (arrayLength > 1) {
      steps.push({
        type: 'complete',
        index: 0,
        array: [...tempArray],
        message: 'Sorting completed!',
        swapCount: swaps,
        comparisonCount: comparisons
      });
    }

    setAlgorithm(steps);
    setTotalSteps(steps.length);
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
    
    switch (step.type) {
      case 'compare':
        setComparing(step.indices);
        setSwapping([]);
        break;
      case 'swap':
        setSwapping(step.indices);
        setComparing([]);
        setArray(step.array);
        break;
      case 'complete':
        setCompleted(prev => [...prev, step.index]);
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
    setComparing([]);
    setSwapping([]);
    setCompleted([]);
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
      
      // Reset visual states
      setComparing([]);
      setSwapping([]);
      
      // Reconstruct state at previous step
      if (prevStep) {
        setArray(prevStep.array);
        setSwapCount(prevStep.swapCount || 0);
        setComparisonCount(prevStep.comparisonCount || 0);
      }
    }
  };

  const getBarColor = (index) => {
    if (completed.includes(index)) return 'bg-green-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
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
            Bubble Sort Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. 
            The pass through the list is repeated until the list is sorted.
          </p>
        </div>

        {/* Algorithm Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-slate-300 text-sm">Best: O(n)</p>
            <p className="text-slate-300 text-sm">Average: O(n²)</p>
            <p className="text-slate-300 text-sm">Worst: O(n²)</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Space Complexity</h3>
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
              onClick={stepBackward}
              disabled={currentStep === 0}
              className="bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50 font-semibold"
            >
              ⏮️ Step Back
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
                min="100"
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
                max="50"
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
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300 text-sm">Unsorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-slate-300 text-sm">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-300 text-sm">Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300 text-sm">Sorted</span>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-end justify-center gap-1 h-80 overflow-x-auto pb-4">
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
                  width: `${Math.max(800 / array.length, 20)}px`,
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
          <h3 className="text-2xl font-bold text-white mb-4">How Bubble Sort Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-3">Algorithm Steps:</h4>
              <ol className="text-slate-300 space-y-2">
                <li>1. Start at the beginning of the array</li>
                <li>2. Compare adjacent elements</li>
                <li>3. If they are in wrong order, swap them</li>
                <li>4. Continue until end of array</li>
                <li>5. Repeat until no swaps needed</li>
              </ol>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pink-400 mb-3">Key Properties:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• Simple to understand and implement</li>
                <li>• Stable sorting algorithm</li>
                <li>• In-place sorting (O(1) space)</li>
                <li>• Inefficient for large datasets</li>
                <li>• Best for educational purposes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}