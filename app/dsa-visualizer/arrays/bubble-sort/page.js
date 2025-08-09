'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [speed, setSpeed] = useState(500);

  useEffect(() => {
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 300) + 10);
    setArray(newArray);
    setSortedIndices([]);
    setCurrentIndices([]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIndices([j, j + 1]);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(speed);
        }
      }
      setSortedIndices(prev => [...prev, n - 1 - i]);
    }
    setSortedIndices(prev => [...prev, 0]);
    setCurrentIndices([]);
    setIsAnimating(false);
  };

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500';
    if (currentIndices.includes(index)) return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer/arrays" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Arrays
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bubble Sort Visualization
          </h1>
          <p className="text-xl text-gray-600">
            Watch how bubble sort compares adjacent elements and swaps them
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={bubbleSort}
              disabled={isAnimating}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold"
            >
              {isAnimating ? 'Sorting...' : 'Start Bubble Sort'}
            </button>
            <button
              onClick={generateRandomArray}
              disabled={isAnimating}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Generate New Array
            </button>
            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-semibold">Speed:</label>
              <input
                type="range"
                min="50"
                max="1000"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                disabled={isAnimating}
                className="w-32"
              />
              <span className="text-gray-600">{speed}ms</span>
            </div>
          </div>

          <div className="h-80 flex items-end justify-center gap-1 bg-gray-50 rounded-lg p-4">
            {array.map((value, index) => (
              <div
                key={index}
                className={`${getBarColor(index)} transition-all duration-200 rounded-t-lg flex items-end justify-center text-white text-xs font-bold`}
                style={{
                  height: `${value}px`,
                  width: '20px'
                }}
              >
                {value < 50 ? '' : value}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-700">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700">Sorted</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How Bubble Sort Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Algorithm Steps:</h3>
              <ol className="space-y-2 text-gray-600">
                <li>1. Compare adjacent elements</li>
                <li>2. Swap if left element is greater than right</li>
                <li>3. Continue through the array</li>
                <li>4. Repeat until no swaps are needed</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Complexity:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Time:</strong> O(n²) worst case</li>
                <li>• <strong>Space:</strong> O(1) constant</li>
                <li>• <strong>Stable:</strong> Yes</li>
                <li>• <strong>In-place:</strong> Yes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}