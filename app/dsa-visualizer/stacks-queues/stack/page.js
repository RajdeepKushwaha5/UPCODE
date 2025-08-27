'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function StackVisualizer() {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operation, setOperation] = useState('');
  const [poppedElement, setPoppedElement] = useState(null);
  const [capacity, setCapacity] = useState(10);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize with sample data
  const initializeStack = useCallback(() => {
    setStack([10, 20, 30]);
    setOperation('');
    setPoppedElement(null);
  }, []);

  // Push operation
  const push = async (value) => {
    if (isAnimating || stack.length >= capacity) return;
    
    setIsAnimating(true);
    setOperation(`Pushing ${value} onto stack`);
    setPoppedElement(null);
    
    // Animation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setStack(prev => [...prev, parseInt(value)]);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setOperation('');
    setIsAnimating(false);
  };

  // Pop operation
  const pop = async () => {
    if (isAnimating || stack.length === 0) return;
    
    setIsAnimating(true);
    const topElement = stack[stack.length - 1];
    setOperation(`Popping ${topElement} from stack`);
    
    // Show popped element animation
    setPoppedElement(topElement);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStack(prev => prev.slice(0, -1));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setOperation('');
    setIsAnimating(false);
    
    // Clear popped element after animation
    setTimeout(() => setPoppedElement(null), 2000);
  };

  // Peek operation
  const peek = async () => {
    if (isAnimating || stack.length === 0) return;
    
    setIsAnimating(true);
    const topElement = stack[stack.length - 1];
    setOperation(`Peek: Top element is ${topElement}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOperation('');
    setIsAnimating(false);
  };

  // Clear stack
  const clearStack = () => {
    if (isAnimating) return;
    setStack([]);
    setOperation('Stack cleared');
    setPoppedElement(null);
    setTimeout(() => setOperation(''), 1000);
  };

  useEffect(() => {
    if (!isInitialized) {
      initializeStack();
      setIsInitialized(true);
    }
  }, [initializeStack]);

  const stackHeight = Math.max(300, stack.length * 60 + 100);
  const isEmpty = stack.length === 0;
  const isFull = stack.length >= capacity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer/stacks-queues" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors duration-200">
            ← Back to Stacks & Queues
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Stack Operations Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            A stack is a LIFO (Last In, First Out) data structure. Elements are added and removed from the top only.
            Perfect for function calls, expression evaluation, and undo operations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Stack Size</h3>
            <p className="text-purple-400 text-2xl font-bold">{stack.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Capacity</h3>
            <p className="text-blue-400 text-2xl font-bold">{capacity}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Top Element</h3>
            <p className="text-green-400 text-2xl font-bold">
              {isEmpty ? 'Empty' : stack[stack.length - 1]}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
            <p className={`text-2xl font-bold ${isEmpty ? 'text-red-400' : isFull ? 'text-yellow-400' : 'text-green-400'}`}>
              {isEmpty ? 'Empty' : isFull ? 'Full' : 'Active'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Push Operation */}
            <div>
              <h4 className="text-white font-semibold mb-3">Push Operation</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500"
                />
                <button
                  onClick={() => push(inputValue)}
                  disabled={isAnimating || !inputValue || isFull}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Push
                </button>
                <p className="text-xs text-slate-400">Time: O(1)</p>
              </div>
            </div>

            {/* Pop Operation */}
            <div>
              <h4 className="text-white font-semibold mb-3">Pop Operation</h4>
              <div className="space-y-2">
                <button
                  onClick={pop}
                  disabled={isAnimating || isEmpty}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Pop
                </button>
                {poppedElement && (
                  <div className="bg-red-100 text-red-800 px-3 py-2 rounded text-sm">
                    Popped: {poppedElement}
                  </div>
                )}
                <p className="text-xs text-slate-400">Time: O(1)</p>
              </div>
            </div>

            {/* Peek Operation */}
            <div>
              <h4 className="text-white font-semibold mb-3">Peek Operation</h4>
              <div className="space-y-2">
                <button
                  onClick={peek}
                  disabled={isAnimating || isEmpty}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Peek
                </button>
                <p className="text-xs text-slate-400">Time: O(1)</p>
              </div>
            </div>

            {/* Utility Operations */}
            <div>
              <h4 className="text-white font-semibold mb-3">Utility</h4>
              <div className="space-y-2">
                <button
                  onClick={initializeStack}
                  disabled={isAnimating}
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Reset
                </button>
                <button
                  onClick={clearStack}
                  disabled={isAnimating}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <label className="text-slate-300 text-xs">Capacity:</label>
                  <input
                    type="number"
                    min="5"
                    max="20"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 10)}
                    className="w-16 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Operation */}
        {operation && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-8">
            <p className="text-yellow-300 text-center font-semibold">{operation}</p>
          </div>
        )}

        {/* Stack Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 mb-8">
          <div className="flex justify-center items-end" style={{ minHeight: `${stackHeight}px` }}>
            <div className="relative">
              {/* Stack Base */}
              <div className="w-40 h-4 bg-slate-600 rounded-b-lg"></div>
              
              {/* Stack Elements */}
              <div className="flex flex-col-reverse">
                {stack.map((value, index) => (
                  <div
                    key={index}
                    className={`w-40 h-12 border-2 border-purple-500 flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                      index === stack.length - 1
                        ? 'bg-purple-600 text-white' // Top element
                        : 'bg-purple-500/80 text-white'
                    }`}
                    style={{
                      borderRadius: index === stack.length - 1 ? '8px 8px 0 0' : '0',
                    }}
                  >
                    {value}
                    {index === stack.length - 1 && (
                      <span className="absolute -right-16 text-purple-400 text-sm">← TOP</span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Empty Stack Message */}
              {isEmpty && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  Stack is Empty
                </div>
              )}
              
              {/* Stack Pointer */}
              <div className="absolute -left-8 flex flex-col-reverse">
                <div className="h-4"></div> {/* Base space */}
                {stack.map((_, index) => (
                  <div key={index} className="h-12 flex items-center">
                    <span className="text-slate-400 text-sm">{index}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span className="text-slate-300">Top Element</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500/80 rounded"></div>
              <span className="text-slate-300">Stack Elements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-600 rounded"></div>
              <span className="text-slate-300">Stack Base</span>
            </div>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Stack Operations</h3>
            <div className="space-y-3 text-slate-300">
              <div>
                <h4 className="font-semibold text-purple-400">Push(element)</h4>
                <p className="text-sm">Adds element to the top of the stack</p>
                <p className="text-xs text-slate-400">Time: O(1), Space: O(1)</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-400">Pop()</h4>
                <p className="text-sm">Removes and returns top element</p>
                <p className="text-xs text-slate-400">Time: O(1), Space: O(1)</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400">Peek()/Top()</h4>
                <p className="text-sm">Returns top element without removing</p>
                <p className="text-xs text-slate-400">Time: O(1), Space: O(1)</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400">isEmpty()</h4>
                <p className="text-sm">Checks if stack is empty</p>
                <p className="text-xs text-slate-400">Time: O(1), Space: O(1)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Applications</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• <strong>Function Calls:</strong> Call stack management</li>
              <li>• <strong>Expression Evaluation:</strong> Infix to postfix conversion</li>
              <li>• <strong>Parentheses Matching:</strong> Balanced brackets checking</li>
              <li>• <strong>Undo Operations:</strong> Text editors, IDEs</li>
              <li>• <strong>Browser History:</strong> Back button functionality</li>
              <li>• <strong>Recursion:</strong> Implementing recursive algorithms</li>
              <li>• <strong>Memory Management:</strong> Stack frames</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
