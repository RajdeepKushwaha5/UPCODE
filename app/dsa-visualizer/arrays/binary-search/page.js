'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [middle, setMiddle] = useState(null);
  const [found, setFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSteps, setSearchSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate sorted array
  const generateArray = useCallback((size = 15) => {
    const newArray = Array.from({length: size}, (_, i) => (i + 1) * 5);
    setArray(newArray);
    reset();
  }, []);

  // Reset search state
  const reset = () => {
    setLeft(null);
    setRight(null);
    setMiddle(null);
    setFound(null);
    setIsSearching(false);
    setSearchSteps([]);
    setCurrentStep(0);
    setComparisons(0);
  };

  // Binary search algorithm
  const binarySearch = async (arr, target, leftIdx = 0, rightIdx = arr.length - 1) => {
    const steps = [];
    let left = leftIdx;
    let right = rightIdx;
    let comparisons = 0;

    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      comparisons++;

      steps.push({
        left,
        right,
        middle,
        value: arr[middle],
        comparison: arr[middle] === target ? 'equal' : arr[middle] < target ? 'less' : 'greater',
        found: arr[middle] === target ? middle : null
      });

      if (arr[middle] === target) {
        break;
      } else if (arr[middle] < target) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }

    if (steps[steps.length - 1]?.found === null) {
      steps.push({
        left: null,
        right: null,
        middle: null,
        value: null,
        comparison: 'not_found',
        found: null
      });
    }

    return { steps, comparisons };
  };

  // Start search
  const startSearch = async () => {
    if (!target || target === '') return;
    
    const targetNum = parseInt(target);
    setIsSearching(true);
    reset();
    
    const { steps, comparisons: totalComparisons } = await binarySearch(array, targetNum);
    setSearchSteps(steps);
    setComparisons(totalComparisons);
    
    // Animate steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setLeft(step.left);
      setRight(step.right);
      setMiddle(step.middle);
      setCurrentStep(i);
      
      if (step.found !== null) {
        setFound(step.found);
      }
      
      await sleep(1200);
    }
    
    setIsSearching(false);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Initialize array on component mount
  useEffect(() => {
    if (!isInitialized) {
      generateArray(15); // Initialize with default size
      setIsInitialized(true);
    }
  }, []); // Remove generateArray dependency to avoid infinite loops

  // Get bar color based on state
  const getBarColor = (index) => {
    if (found === index) return 'bg-green-500 border-green-300';
    if (middle === index) return 'bg-yellow-500 border-yellow-300';
    if (left !== null && right !== null && index >= left && index <= right) {
      return 'bg-blue-500 border-blue-300';
    }
    return 'bg-slate-600 border-slate-400';
  };

  const getBarHeight = (value) => {
    const maxValue = Math.max(...array);
    return `${(value / maxValue) * 100}%`;
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center theme-accent hover:theme-text-secondary mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Binary Search Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Binary Search is an efficient algorithm for finding an item from a sorted list of items. 
            It works by repeatedly dividing the search space in half until the target is found.
          </p>
        </div>

        {/* Algorithm Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-slate-300">O(log n)</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Space Complexity</h3>
            <p className="text-slate-300">O(1)</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Comparisons</h3>
            <p className="text-blue-400 text-2xl font-bold">{comparisons}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
            <p className="text-slate-300">
              {found !== null ? '✅ Found!' : isSearching ? '🔍 Searching...' : '⏳ Ready'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-white font-semibold">Target:</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Enter target value"
                className="px-3 py-2 theme-surface-elevated text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                disabled={isSearching}
              />
            </div>
            <button
              onClick={startSearch}
              disabled={isSearching || !target}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-transform duration-200 font-semibold disabled:opacity-50"
            >
              🔍 Search
            </button>
            <button
              onClick={() => generateArray(array.length)}
              disabled={isSearching}
              className="theme-surface-elevated text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors duration-200 font-semibold disabled:opacity-50"
            >
              🎲 New Array
            </button>
            <button
              onClick={reset}
              disabled={isSearching}
              className="theme-surface-elevated text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors duration-200 font-semibold disabled:opacity-50"
            >
              🔄 Reset
            </button>
          </div>

          {/* Array Size Control */}
          <div className="flex items-center gap-4">
            <label className="text-white font-semibold">Array Size:</label>
            <input
              type="range"
              min="10"
              max="20"
              value={array.length}
              onChange={(e) => generateArray(parseInt(e.target.value))}
              className="flex-1 max-w-xs"
              disabled={isSearching}
            />
            <span className="text-slate-300 font-mono">{array.length}</span>
          </div>
        </div>

        {/* Current Step Info */}
        {searchSteps.length > 0 && (
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Search Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Left Boundary</p>
                <p className="text-blue-400 text-xl font-bold">
                  {left !== null ? `Index ${left} (${array[left]})` : 'None'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Middle (Checking)</p>
                <p className="text-yellow-400 text-xl font-bold">
                  {middle !== null ? `Index ${middle} (${array[middle]})` : 'None'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Right Boundary</p>
                <p className="text-blue-400 text-xl font-bold">
                  {right !== null ? `Index ${right} (${array[right]})` : 'None'}
                </p>
              </div>
            </div>
            
            {/* Step Details */}
            {currentStep < searchSteps.length && (
              <div className="mt-4 p-4 theme-surface-elevated/50 rounded-lg">
                <p className="text-white font-semibold">
                  Step {currentStep + 1}: {
                    searchSteps[currentStep]?.comparison === 'equal' ? 
                      `Found target ${target}!` :
                    searchSteps[currentStep]?.comparison === 'less' ? 
                      `${searchSteps[currentStep]?.value} < ${target}, search right half` :
                    searchSteps[currentStep]?.comparison === 'greater' ? 
                      `${searchSteps[currentStep]?.value} > ${target}, search left half` :
                      `Target ${target} not found in array`
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 border-2 border-blue-300 rounded"></div>
            <span className="text-slate-300 text-sm">Search Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-300 rounded"></div>
            <span className="text-slate-300 text-sm">Middle Element</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 border-2 border-green-300 rounded"></div>
            <span className="text-slate-300 text-sm">Target Found</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-600 border-2 border-slate-400 rounded"></div>
            <span className="text-slate-300 text-sm">Out of Range</span>
          </div>
        </div>

        {/* Visualization */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-end justify-center gap-1 h-64 mb-4">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-8 border-2 transition-all duration-500 ${getBarColor(index)}`}
                  style={{ height: getBarHeight(value) }}
                ></div>
                <span className="text-white text-xs mt-2 font-mono">{value}</span>
                <span className="text-slate-400 text-xs">{index}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-8 theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">How Binary Search Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Algorithm Steps:</h4>
              <ol className="text-slate-300 space-y-2">
                <li>1. Start with the entire sorted array</li>
                <li>2. Find the middle element</li>
                <li>3. Compare middle with target</li>
                <li>4. If equal, target found!</li>
                <li>5. If target is smaller, search left half</li>
                <li>6. If target is larger, search right half</li>
                <li>7. Repeat until found or range is empty</li>
              </ol>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">Key Points:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Prerequisite:</strong> Array must be sorted</li>
                <li>• <strong>Efficiency:</strong> Eliminates half the data each step</li>
                <li>• <strong>Time Complexity:</strong> O(log n) - very fast!</li>
                <li>• <strong>Space Complexity:</strong> O(1) - constant space</li>
                <li>• <strong>Use Case:</strong> Large sorted datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
