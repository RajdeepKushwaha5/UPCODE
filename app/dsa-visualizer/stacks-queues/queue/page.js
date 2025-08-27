'use client';
import { useState } from 'react';

class Queue {
  constructor() {
    this.items = [];
    this.front = 0;
    this.rear = -1;
    this.size = 0;
  }

  enqueue(element) {
    this.items.push(element);
    this.rear++;
    this.size++;
    return this.items;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    
    const item = this.items[this.front];
    this.front++;
    this.size--;
    
    // Reset pointers if queue becomes empty
    if (this.size === 0) {
      this.front = 0;
      this.rear = -1;
      this.items = [];
    }
    
    return { item, queue: this.items.slice(this.front) };
  }

  peek() {
    return this.isEmpty() ? null : this.items[this.front];
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }

  toArray() {
    return this.isEmpty() ? [] : this.items.slice(this.front);
  }
}

export default function QueueVisualization() {
  const [queue, setQueue] = useState(new Queue());
  const [queueItems, setQueueItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [animating, setAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [operation, setOperation] = useState('');
  const [dequeuedItem, setDequeuedItem] = useState(null);

  const animateOperation = async (newItems, highlightIndex = -1, operationType = '', dequeued = null) => {
    setAnimating(true);
    setOperation(operationType);
    setHighlightedIndex(highlightIndex);
    
    if (dequeued !== null) {
      setDequeuedItem(dequeued);
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setQueueItems(newItems);
    setHighlightedIndex(-1);
    setOperation('');
    setDequeuedItem(null);
    setAnimating(false);
  };

  const handleEnqueue = async () => {
    if (inputValue.trim() && !animating) {
      const newItems = queue.enqueue(parseInt(inputValue));
      await animateOperation(queue.toArray(), queue.toArray().length - 1, 'enqueue');
      setInputValue('');
    }
  };

  const handleDequeue = async () => {
    if (!queue.isEmpty() && !animating) {
      const result = queue.dequeue();
      if (result) {
        await animateOperation(result.queue, 0, 'dequeue', result.item);
      }
    }
  };

  const handlePeek = async () => {
    if (!queue.isEmpty() && !animating) {
      setAnimating(true);
      setOperation('peek');
      setHighlightedIndex(0);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHighlightedIndex(-1);
      setOperation('');
      setAnimating(false);
    }
  };

  const handleClear = () => {
    if (!animating) {
      setQueue(new Queue());
      setQueueItems([]);
      setDequeuedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Queue Data Structure Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            First In, First Out (FIFO) - Elements are added at the rear and removed from the front
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter number"
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              disabled={animating}
            />
            
            <button
              onClick={handleEnqueue}
              disabled={!inputValue.trim() || animating}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Enqueue
            </button>
            
            <button
              onClick={handleDequeue}
              disabled={queue.isEmpty() || animating}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Dequeue
            </button>
            
            <button
              onClick={handlePeek}
              disabled={queue.isEmpty() || animating}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Peek
            </button>
            
            <button
              onClick={handleClear}
              disabled={animating}
              className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Clear
            </button>
          </div>
          
          {operation && (
            <div className="text-center mt-4">
              <span className="text-yellow-400 font-semibold">
                Operation: {operation.toUpperCase()}
                {operation === 'peek' && queueItems.length > 0 && (
                  <span className="ml-2 text-white">Front element: {queueItems[0]}</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 min-h-96">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Queue Structure</h2>
          
          <div className="flex items-center justify-center mb-8">
            {/* Front indicator */}
            {queueItems.length > 0 && (
              <div className="mr-4 text-green-400 font-bold text-sm">
                FRONT
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-green-400 mt-1 mx-auto"></div>
              </div>
            )}
            
            {/* Queue items */}
            <div className="flex items-center space-x-2">
              {queueItems.length === 0 ? (
                <div className="text-center text-slate-400 text-xl py-16">
                  Queue is empty. Use Enqueue to add elements!
                </div>
              ) : (
                queueItems.map((item, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`
                        w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center border-2 transition-all duration-500
                        ${highlightedIndex === index
                          ? 'border-yellow-400 bg-yellow-500/20 scale-110' 
                          : 'border-blue-400'
                        }
                      `}
                    >
                      <span className="text-white font-bold text-lg">{item}</span>
                    </div>
                    
                    {/* Arrow between elements */}
                    {index < queueItems.length - 1 && (
                      <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <div className="w-6 h-0.5 bg-blue-400"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-2 border-t-1 border-b-1 border-transparent border-l-blue-400"></div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Rear indicator */}
            {queueItems.length > 0 && (
              <div className="ml-4 text-red-400 font-bold text-sm">
                REAR
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-red-400 mt-1 mx-auto"></div>
              </div>
            )}
          </div>

          {/* Dequeued item animation */}
          {dequeuedItem && (
            <div className="text-center mb-4">
              <div className="inline-block bg-red-500/20 border-2 border-red-400 rounded-lg p-4 animate-pulse">
                <span className="text-red-400 font-bold">Dequeued: {dequeuedItem}</span>
              </div>
            </div>
          )}

          {/* Operation descriptions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-bold mb-2">Enqueue</h4>
              <p className="text-slate-300 text-sm">Add element to the rear</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-400 font-bold mb-2">Dequeue</h4>
              <p className="text-slate-300 text-sm">Remove element from front</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-bold mb-2">Peek</h4>
              <p className="text-slate-300 text-sm">View front element</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold mb-2">FIFO</h4>
              <p className="text-slate-300 text-sm">First In, First Out</p>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Queue Properties</h3>
            <div className="space-y-2 text-slate-300">
              <div>Size: <span className="text-blue-400 font-bold">{queue.getSize()}</span></div>
              <div>Front: <span className="text-green-400 font-bold">{queue.peek() || 'null'}</span></div>
              <div>Is Empty: <span className="text-yellow-400 font-bold">{queue.isEmpty() ? 'Yes' : 'No'}</span></div>
              <div>Principle: <span className="text-purple-400 font-bold">FIFO</span></div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Time Complexities</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <div>Enqueue: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Dequeue: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Peek: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Space: <span className="text-yellow-400 font-bold">O(n)</span></div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Real-world Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-slate-300 text-sm text-center">
              <div className="text-blue-400 font-bold mb-2">🖨️ Print Queue</div>
              <p>Managing print jobs in order</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-green-400 font-bold mb-2">🌐 Web Server</div>
              <p>Handling HTTP requests</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-yellow-400 font-bold mb-2">📞 Call Center</div>
              <p>Managing incoming calls</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-purple-400 font-bold mb-2">🔄 BFS Algorithm</div>
              <p>Breadth-First Search</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
