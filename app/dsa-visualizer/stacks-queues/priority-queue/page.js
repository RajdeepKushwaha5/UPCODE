'use client';
import { useState } from 'react';

class PriorityQueueElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const queueElement = new PriorityQueueElement(element, priority);
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      // Higher priority number = higher priority
      if (queueElement.priority > this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }

    return { items: this.items, insertIndex: added ? this.items.indexOf(queueElement) : this.items.length - 1 };
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const item = this.items.shift();
    return { item, items: this.items };
  }

  peek() {
    return this.isEmpty() ? null : this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  toArray() {
    return this.items;
  }
}

export default function PriorityQueueVisualization() {
  const [priorityQueue, setPriorityQueue] = useState(new PriorityQueue());
  const [queueItems, setQueueItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputPriority, setInputPriority] = useState('');
  const [animating, setAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [operation, setOperation] = useState('');
  const [dequeuedItem, setDequeuedItem] = useState(null);
  const [insertingIndex, setInsertingIndex] = useState(-1);

  const animateOperation = async (newItems, highlightIndex = -1, operationType = '', dequeued = null, insertIndex = -1) => {
    setAnimating(true);
    setOperation(operationType);
    setHighlightedIndex(highlightIndex);
    setInsertingIndex(insertIndex);
    
    if (dequeued !== null) {
      setDequeuedItem(dequeued);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setQueueItems(newItems);
    setHighlightedIndex(-1);
    setInsertingIndex(-1);
    setOperation('');
    setDequeuedItem(null);
    setAnimating(false);
  };

  const handleEnqueue = async () => {
    if (inputValue.trim() && inputPriority.trim() && !animating) {
      const result = priorityQueue.enqueue(parseInt(inputValue), parseInt(inputPriority));
      await animateOperation(result.items, result.insertIndex, 'enqueue', null, result.insertIndex);
      setInputValue('');
      setInputPriority('');
    }
  };

  const handleDequeue = async () => {
    if (!priorityQueue.isEmpty() && !animating) {
      const result = priorityQueue.dequeue();
      if (result) {
        await animateOperation(result.items, 0, 'dequeue', result.item);
      }
    }
  };

  const handlePeek = async () => {
    if (!priorityQueue.isEmpty() && !animating) {
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
      setPriorityQueue(new PriorityQueue());
      setQueueItems([]);
      setDequeuedItem(null);
    }
  };

  const getColorByPriority = (priority) => {
    if (priority >= 9) return 'border-red-400 bg-red-500/20 text-red-400';
    if (priority >= 7) return 'border-orange-400 bg-orange-500/20 text-orange-400';
    if (priority >= 5) return 'border-yellow-400 bg-yellow-500/20 text-yellow-400';
    if (priority >= 3) return 'border-green-400 bg-green-500/20 text-green-400';
    return 'border-blue-400 bg-blue-500/20 text-blue-400';
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Priority Queue Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Elements are served based on their priority, not their arrival time (Higher number = Higher priority)
          </p>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Element value"
              className="px-4 py-2 theme-surface-elevated text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
              disabled={animating}
            />
            
            <input
              type="number"
              value={inputPriority}
              onChange={(e) => setInputPriority(e.target.value)}
              placeholder="Priority (1-10)"
              min="1"
              max="10"
              className="px-4 py-2 theme-surface-elevated text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
              disabled={animating}
            />
            
            <button
              onClick={handleEnqueue}
              disabled={!inputValue.trim() || !inputPriority.trim() || animating}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Enqueue
            </button>
            
            <button
              onClick={handleDequeue}
              disabled={priorityQueue.isEmpty() || animating}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Dequeue
            </button>
            
            <button
              onClick={handlePeek}
              disabled={priorityQueue.isEmpty() || animating}
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
                  <span className="ml-2 text-white">
                    Highest Priority: {queueItems[0].element} (Priority: {queueItems[0].priority})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Priority Legend */}
        <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-slate-700">
          <h3 className="text-white font-bold mb-3 text-center">Priority Color Legend</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-red-400 bg-red-500/20"></div>
              <span className="text-slate-300 text-sm">Critical (9-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-orange-400 bg-orange-500/20"></div>
              <span className="text-slate-300 text-sm">High (7-8)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-yellow-400 bg-yellow-500/20"></div>
              <span className="text-slate-300 text-sm">Medium (5-6)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-green-400 bg-green-500/20"></div>
              <span className="text-slate-300 text-sm">Low (3-4)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-blue-400 bg-blue-500/20"></div>
              <span className="text-slate-300 text-sm">Minimal (1-2)</span>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 min-h-96">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Priority Queue Structure</h2>
          
          <div className="flex flex-col items-center">
            {/* Front indicator */}
            {queueItems.length > 0 && (
              <div className="mb-4 text-green-400 font-bold text-sm">
                HIGHEST PRIORITY
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-green-400 mt-1 mx-auto"></div>
              </div>
            )}
            
            {/* Queue items */}
            <div className="flex flex-col items-center space-y-3">
              {queueItems.length === 0 ? (
                <div className="text-center text-slate-400 text-xl py-16">
                  Priority Queue is empty. Add elements with their priorities!
                </div>
              ) : (
                queueItems.map((item, index) => (
                  <div key={index} className="relative flex items-center">
                    <div
                      className={`
                        w-20 h-16 rounded-lg flex flex-col items-center justify-center border-2 transition-all duration-500
                        ${highlightedIndex === index || insertingIndex === index
                          ? 'border-yellow-400 bg-yellow-500/20 scale-110' 
                          : getColorByPriority(item.priority)
                        }
                      `}
                    >
                      <span className="font-bold text-lg">{item.element}</span>
                      <span className="text-xs opacity-75">P:{item.priority}</span>
                    </div>
                    
                    {/* Priority indicator */}
                    <div className="ml-4 text-right">
                      <div className="text-sm font-bold text-white">Priority: {item.priority}</div>
                      <div className="text-xs text-slate-400">
                        {item.priority >= 9 ? 'Critical' : 
                         item.priority >= 7 ? 'High' :
                         item.priority >= 5 ? 'Medium' :
                         item.priority >= 3 ? 'Low' : 'Minimal'}
                      </div>
                    </div>
                    
                    {/* Position indicator */}
                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-slate-500 text-xs">
                      {index + 1}
                    </div>
                    
                    {/* Arrow between elements */}
                    {index < queueItems.length - 1 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-0.5 h-4 bg-purple-400"></div>
                        <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-purple-400 -mt-1 mx-auto"></div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Rear indicator */}
            {queueItems.length > 0 && (
              <div className="mt-4 text-red-400 font-bold text-sm">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-400 mb-1 mx-auto"></div>
                LOWEST PRIORITY
              </div>
            )}
          </div>

          {/* Dequeued item animation */}
          {dequeuedItem && (
            <div className="text-center mt-6">
              <div className="inline-block bg-red-500/20 border-2 border-red-400 rounded-lg p-4 animate-pulse">
                <span className="text-red-400 font-bold">
                  Dequeued: {dequeuedItem.element} (Priority: {dequeuedItem.priority})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Queue Properties</h3>
            <div className="space-y-2 text-slate-300">
              <div>Size: <span className="theme-accent font-bold">{priorityQueue.size()}</span></div>
              <div>Front: <span className="text-green-400 font-bold">
                {priorityQueue.peek() ? `${priorityQueue.peek().element} (P:${priorityQueue.peek().priority})` : 'null'}
              </span></div>
              <div>Is Empty: <span className="text-yellow-400 font-bold">{priorityQueue.isEmpty() ? 'Yes' : 'No'}</span></div>
              <div>Order: <span className="text-blue-400 font-bold">By Priority</span></div>
            </div>
          </div>
          
          <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Time Complexities</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <div>Enqueue: <span className="text-yellow-400 font-bold">O(n)</span></div>
              <div>Dequeue: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Peek: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Space: <span className="text-yellow-400 font-bold">O(n)</span></div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Real-world Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-slate-300 text-sm text-center">
              <div className="text-red-400 font-bold mb-2">🚨 Emergency Room</div>
              <p>Treating patients by urgency</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-orange-400 font-bold mb-2">⚙️ CPU Scheduling</div>
              <p>Process scheduling by priority</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-yellow-400 font-bold mb-2">📧 Email Systems</div>
              <p>Important emails first</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-green-400 font-bold mb-2">🔍 Dijkstra's Algorithm</div>
              <p>Shortest path finding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
