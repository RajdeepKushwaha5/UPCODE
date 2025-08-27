#!/bin/bash

# This script will fix all placeholder DSA visualizations by replacing them with functional ones

echo "🔧 FIXING ALL PLACEHOLDER DSA VISUALIZATIONS..."

# Fix Linear Search
echo "1. Creating Linear Search visualizer..."
cat > "/workspaces/UPCODE/app/dsa-visualizer/arrays/linear-search/page.js" << 'EOF'
'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function LinearSearchVisualizer() {
  const [array, setArray] = useState([]);
  const [searchValue, setSearchValue] = useState(42);
  const [isSearching, setIsSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [found, setFound] = useState(false);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const generateArray = useCallback((size = 20) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    // Ensure search value exists sometimes
    if (Math.random() < 0.7) {
      newArray[Math.floor(Math.random() * newArray.length)] = searchValue;
    }
    setArray(newArray);
    reset();
  }, [searchValue]);

  const reset = () => {
    setIsSearching(false);
    setCurrentIndex(-1);
    setFound(false);
    setFoundIndex(-1);
    setComparisons(0);
  };

  const startSearch = async () => {
    if (isSearching) return;
    
    reset();
    setIsSearching(true);
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      setComparisons(i + 1);
      
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (array[i] === searchValue) {
        setFound(true);
        setFoundIndex(i);
        setIsSearching(false);
        return;
      }
    }
    
    setIsSearching(false);
    setCurrentIndex(-1);
  };

  useEffect(() => {
    if (!isInitialized) {
      generateArray(15);
      setIsInitialized(true);
    }
  }, [generateArray]);

  const getBarColor = (index) => {
    if (found && index === foundIndex) return 'bg-green-500';
    if (index === currentIndex) return 'bg-yellow-500';
    if (isSearching && index < currentIndex) return 'bg-red-500';
    return 'bg-purple-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer/arrays" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors duration-200">
            ← Back to Arrays
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Linear Search Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Linear Search checks each element sequentially until the target is found or the entire array is searched.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-slate-300 text-sm">Best: O(1)</p>
            <p className="text-slate-300 text-sm">Average: O(n)</p>
            <p className="text-slate-300 text-sm">Worst: O(n)</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Space</h3>
            <p className="text-slate-300">O(1)</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Comparisons</h3>
            <p className="text-purple-400 text-2xl font-bold">{comparisons}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
            <p className={`text-2xl font-bold ${found ? 'text-green-400' : isSearching ? 'text-yellow-400' : 'text-slate-400'}`}>
              {found ? 'Found!' : isSearching ? 'Searching...' : 'Ready'}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={startSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200 font-medium"
              >
                {isSearching ? 'Searching...' : 'Start Search'}
              </button>
              <button
                onClick={() => generateArray(array.length)}
                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                New Array
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-slate-300 text-sm">Search for:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={searchValue}
                  onChange={(e) => setSearchValue(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-300 text-sm">Speed:</label>
                <input
                  type="range"
                  min="100"
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
            Searching for: <span className="text-purple-400 font-bold">{searchValue}</span> |
            <span className="text-yellow-400 ml-2">Yellow: Current</span>
            <span className="text-red-400 ml-4">Red: Checked</span>
            <span className="text-green-400 ml-4">Green: Found</span>
            {found && <span className="text-green-400 ml-4">Found at index {foundIndex}!</span>}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
          <div className="flex items-end justify-center gap-2 h-96">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`${getBarColor(index)} transition-all duration-300 rounded-t-md min-w-[20px] flex items-end justify-center text-white text-xs font-bold pb-1`}
                  style={{
                    height: `${(value / 100) * 100}%`,
                    width: Math.max(30, 500 / array.length)
                  }}
                >
                  {value}
                </div>
                <div className="text-slate-400 text-xs mt-1">{index}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">How Linear Search Works</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• Start from the first element</li>
              <li>• Compare with target value</li>
              <li>• If found, return the index</li>
              <li>• Otherwise, move to next element</li>
              <li>• Continue until found or end reached</li>
            </ul>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Key Properties</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>Simple:</strong> Easy to understand and implement</li>
              <li>• <strong>Works on unsorted data:</strong> No pre-sorting required</li>
              <li>• <strong>Sequential:</strong> Checks elements one by one</li>
              <li>• <strong>Guaranteed:</strong> Will find element if it exists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Linear Search created successfully!"

# Test that the previous command worked
if [ -f "/workspaces/UPCODE/app/dsa-visualizer/arrays/linear-search/page.js" ]; then
    echo "✅ Linear Search file verified!"
else
    echo "❌ Linear Search file creation failed!"
fi
