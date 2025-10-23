'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function HeapVisualizer() {
  const [heap, setHeap] = useState([]);
  const [heapType, setHeapType] = useState('max'); // 'max' or 'min'
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [operation, setOperation] = useState('');
  const [arrayRepresentation, setArrayRepresentation] = useState([]);
  const [heapifySteps, setHeapifySteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [extractedElements, setExtractedElements] = useState([]);

  // Helper functions
  const getParentIndex = (i) => Math.floor((i - 1) / 2);
  const getLeftChildIndex = (i) => 2 * i + 1;
  const getRightChildIndex = (i) => 2 * i + 2;

  const hasParent = (i) => getParentIndex(i) >= 0;
  const hasLeftChild = (i) => getLeftChildIndex(i) < heap.length;
  const hasRightChild = (i) => getRightChildIndex(i) < heap.length;

  const parent = (i) => heap[getParentIndex(i)];
  const leftChild = (i) => heap[getLeftChildIndex(i)];
  const rightChild = (i) => heap[getRightChildIndex(i)];

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Compare function based on heap type
  const compare = (a, b) => {
    if (heapType === 'max') {
      return a > b;
    } else {
      return a < b;
    }
  };

  // Swap elements in heap
  const swapElements = async (index1, index2) => {
    setComparingIndices([index1, index2]);
    await sleep(800);
    
    const newHeap = [...heap];
    [newHeap[index1], newHeap[index2]] = [newHeap[index2], newHeap[index1]];
    setHeap(newHeap);
    
    await sleep(500);
    setComparingIndices([]);
  };

  // Heapify up (bubble up)
  const heapifyUp = async (index = heap.length - 1) => {
    if (!hasParent(index)) return;
    
    setHighlightedIndices([index, getParentIndex(index)]);
    setOperation(`Comparing ${heap[index]} with parent ${parent(index)}`);
    await sleep(1000);
    
    if (compare(heap[index], parent(index))) {
      setOperation(`Swapping ${heap[index]} with ${parent(index)}`);
      await swapElements(index, getParentIndex(index));
      await heapifyUp(getParentIndex(index));
    } else {
      setOperation(`Heap property satisfied at index ${index}`);
      await sleep(800);
    }
  };

  // Heapify down (bubble down)
  const heapifyDown = async (index = 0) => {
    let targetIndex = index;
    
    if (hasLeftChild(index)) {
      setHighlightedIndices([index, getLeftChildIndex(index)]);
      setOperation(`Comparing ${heap[index]} with left child ${leftChild(index)}`);
      await sleep(800);
      
      if (compare(leftChild(index), heap[targetIndex])) {
        targetIndex = getLeftChildIndex(index);
      }
    }
    
    if (hasRightChild(index)) {
      setHighlightedIndices([index, getRightChildIndex(index)]);
      setOperation(`Comparing ${heap[targetIndex]} with right child ${rightChild(index)}`);
      await sleep(800);
      
      if (compare(rightChild(index), heap[targetIndex])) {
        targetIndex = getRightChildIndex(index);
      }
    }
    
    if (targetIndex !== index) {
      setOperation(`Swapping ${heap[index]} with ${heap[targetIndex]}`);
      await swapElements(index, targetIndex);
      await heapifyDown(targetIndex);
    } else {
      setOperation(`Heap property satisfied at index ${index}`);
      await sleep(800);
    }
  };

  // Insert element into heap
  const insertElement = async () => {
    if (!inputValue) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    setOperation(`Inserting ${value} into ${heapType} heap`);
    
    const newHeap = [...heap, value];
    setHeap(newHeap);
    setHighlightedIndices([newHeap.length - 1]);
    
    await sleep(1000);
    await heapifyUp(newHeap.length - 1);
    
    setHighlightedIndices([]);
    setOperation(`Successfully inserted ${value}`);
    setInputValue('');
    setIsAnimating(false);
  };

  // Extract root element
  const extractRoot = async () => {
    if (heap.length === 0) return;
    
    setIsAnimating(true);
    const root = heap[0];
    setOperation(`Extracting ${heapType === 'max' ? 'maximum' : 'minimum'} element: ${root}`);
    
    // Add to extracted elements
    setExtractedElements(prev => [...prev, root]);
    
    if (heap.length === 1) {
      setHeap([]);
      setOperation(`Heap is now empty`);
      setIsAnimating(false);
      return;
    }
    
    // Move last element to root
    const newHeap = [...heap];
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    setHeap(newHeap);
    
    setHighlightedIndices([0]);
    setOperation(`Moved last element ${newHeap[0]} to root position`);
    await sleep(1000);
    
    await heapifyDown(0);
    
    setHighlightedIndices([]);
    setOperation(`Successfully extracted ${root}`);
    setIsAnimating(false);
  };

  // Build heap from array
  const buildHeap = async (arr) => {
    const newHeap = [...arr];
    setHeap(newHeap);
    setIsAnimating(true);
    setOperation(`Building ${heapType} heap from array`);
    
    // Start from last non-leaf node and heapify down
    const startIndex = Math.floor(newHeap.length / 2) - 1;
    
    for (let i = startIndex; i >= 0; i--) {
      setHighlightedIndices([i]);
      setOperation(`Heapifying subtree rooted at index ${i}`);
      await sleep(1000);
      await heapifyDown(i);
    }
    
    setHighlightedIndices([]);
    setOperation(`Heap construction complete`);
    setIsAnimating(false);
  };

  // Generate random heap
  const generateRandomHeap = () => {
    const values = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
    buildHeap(values);
  };

  // Clear heap
  const clearHeap = () => {
    setHeap([]);
    setExtractedElements([]);
    setHighlightedIndices([]);
    setComparingIndices([]);
    setOperation('');
  };

  // Toggle heap type
  const toggleHeapType = () => {
    if (isAnimating) return;
    
    const newType = heapType === 'max' ? 'min' : 'max';
    setHeapType(newType);
    
    if (heap.length > 0) {
      buildHeap(heap);
    }
  };

  // Calculate positions for tree visualization
  const calculatePositions = () => {
    const positions = [];
    const levels = Math.ceil(Math.log2(heap.length + 1));
    const treeWidth = 800;
    const treeHeight = 400;
    
    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const positionInLevel = i - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      
      const x = (treeWidth / (totalInLevel + 1)) * (positionInLevel + 1);
      const y = 50 + (level * (treeHeight / levels));
      
      positions.push({ x, y, level });
    }
    
    return positions;
  };

  // Render heap as tree
  const renderHeapTree = () => {
    if (heap.length === 0) return null;
    
    const positions = calculatePositions();
    const connections = [];
    const nodes = [];
    
    // Draw connections
    for (let i = 0; i < heap.length; i++) {
      const pos = positions[i];
      
      // Left child connection
      const leftChildIdx = getLeftChildIndex(i);
      if (leftChildIdx < heap.length) {
        const leftPos = positions[leftChildIdx];
        connections.push(
          <line
            key={`conn-${i}-${leftChildIdx}`}
            x1={pos.x}
            y1={pos.y}
            x2={leftPos.x}
            y2={leftPos.y}
            stroke="#64748b"
            strokeWidth="2"
          />
        );
      }
      
      // Right child connection
      const rightChildIdx = getRightChildIndex(i);
      if (rightChildIdx < heap.length) {
        const rightPos = positions[rightChildIdx];
        connections.push(
          <line
            key={`conn-${i}-${rightChildIdx}`}
            x1={pos.x}
            y1={pos.y}
            x2={rightPos.x}
            y2={rightPos.y}
            stroke="#64748b"
            strokeWidth="2"
          />
        );
      }
    }
    
    // Draw nodes
    for (let i = 0; i < heap.length; i++) {
      const pos = positions[i];
      const isHighlighted = highlightedIndices.includes(i);
      const isComparing = comparingIndices.includes(i);
      const isRoot = i === 0;
      
      let nodeColor = '#8b5cf6'; // Default purple
      if (isRoot) nodeColor = heapType === 'max' ? '#ef4444' : '#10b981'; // Red for max root, green for min root
      if (isHighlighted) nodeColor = '#f59e0b'; // Yellow for highlighted
      if (isComparing) nodeColor = '#3b82f6'; // Blue for comparing
      
      nodes.push(
        <g key={`node-${i}`}>
          <circle
            cx={pos.x}
            cy={pos.y}
            r="25"
            fill={nodeColor}
            stroke={isRoot ? '#ffffff' : '#7c3aed'}
            strokeWidth={isRoot ? "4" : "2"}
            className="transition-all duration-300 hover:scale-110"
          />
          <text
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            className="fill-white font-bold text-sm pointer-events-none"
          >
            {heap[i]}
          </text>
          <text
            x={pos.x}
            y={pos.y - 35}
            textAnchor="middle"
            className="fill-slate-400 font-semibold text-xs"
          >
            {i}
          </text>
        </g>
      );
    }
    
    return (
      <svg width="800" height="400" className="mx-auto">
        {connections}
        {nodes}
      </svg>
    );
  };

  // Update array representation when heap changes
  useEffect(() => {
    setArrayRepresentation([...heap]);
  }, [heap]);

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center theme-accent hover:theme-text-secondary mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Heap Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            A heap is a complete binary tree that satisfies the heap property. Max heap: parent ≥ children, 
            Min heap: parent ≤ children. Perfect for priority queues and heap sort algorithm.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Heap Size</h3>
            <p className="text-red-400 text-2xl font-bold">{heap.length}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Heap Type</h3>
            <p className="text-pink-400 text-2xl font-bold capitalize">{heapType}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Root Element</h3>
            <p className="text-blue-400 text-2xl font-bold">{heap.length > 0 ? heap[0] : 'None'}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Operation</h3>
            <p className="text-green-400 text-sm">{operation || 'None'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Insert */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Insert Element</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                  disabled={isAnimating}
                />
              </div>
              <button
                onClick={insertElement}
                disabled={isAnimating || !inputValue}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-200 font-semibold disabled:opacity-50"
              >
                ➕ Insert
              </button>
            </div>

            {/* Extract */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Extract Root</h3>
              <p className="text-slate-400 text-sm mb-3">
                Extract {heapType === 'max' ? 'maximum' : 'minimum'} element
              </p>
              <button
                onClick={extractRoot}
                disabled={isAnimating || heap.length === 0}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors duration-200 font-semibold disabled:opacity-50"
              >
                ⬆️ Extract {heapType === 'max' ? 'Max' : 'Min'}
              </button>
            </div>

            {/* Heap Type */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Heap Type</h3>
              <button
                onClick={toggleHeapType}
                disabled={isAnimating}
                className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 font-semibold disabled:opacity-50 mb-3 ${
                  heapType === 'max' 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                🔄 {heapType === 'max' ? 'Max Heap' : 'Min Heap'}
              </button>
              <p className="text-slate-400 text-xs">
                Click to toggle between max and min heap
              </p>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={generateRandomHeap}
                  disabled={isAnimating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  🎲 Random Heap
                </button>
                <button
                  onClick={clearHeap}
                  disabled={isAnimating}
                  className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  🗑️ Clear Heap
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Array Representation */}
        {arrayRepresentation.length > 0 && (
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Array Representation</h3>
            <div className="flex flex-wrap gap-2">
              {arrayRepresentation.map((value, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-lg font-bold text-center min-w-[50px] transition-all duration-300 ${
                    highlightedIndices.includes(index) 
                      ? 'bg-yellow-500 text-black' 
                      : comparingIndices.includes(index)
                      ? 'bg-blue-500 text-white'
                      : index === 0
                      ? heapType === 'max' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div className="text-sm">{value}</div>
                  <div className="text-xs opacity-70">{index}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Elements */}
        {extractedElements.length > 0 && (
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Extracted Elements (Sorted Order)</h3>
            <div className="flex flex-wrap gap-2">
              {extractedElements.map((value, index) => (
                <div
                  key={index}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full border-2 ${heapType === 'max' ? 'bg-red-500 border-red-700' : 'bg-green-500 border-green-700'}`}></div>
            <span className="text-slate-300 text-sm">Root ({heapType === 'max' ? 'Maximum' : 'Minimum'})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-purple-700"></div>
            <span className="text-slate-300 text-sm">Heap Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-yellow-700"></div>
            <span className="text-slate-300 text-sm">Highlighted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-700"></div>
            <span className="text-slate-300 text-sm">Comparing</span>
          </div>
        </div>

        {/* Heap Visualization */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="min-h-[400px] overflow-auto">
            {heap.length > 0 ? (
              renderHeapTree()
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔺</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Empty Heap</h3>
                  <p className="text-slate-400">Insert some elements or generate a random heap to get started!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-8 theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">Heap Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-red-400 mb-3">Heap Properties:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Complete Binary Tree:</strong> All levels filled except possibly last</li>
                <li>• <strong>Max Heap:</strong> Parent ≥ children</li>
                <li>• <strong>Min Heap:</strong> Parent ≤ children</li>
                <li>• <strong>Array Implementation:</strong> Parent at i, children at 2i+1, 2i+2</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pink-400 mb-3">Time Complexities:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Insert:</strong> O(log n) - heapify up</li>
                <li>• <strong>Extract:</strong> O(log n) - heapify down</li>
                <li>• <strong>Peek Root:</strong> O(1) - constant time</li>
                <li>• <strong>Build Heap:</strong> O(n) - bottom-up construction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
