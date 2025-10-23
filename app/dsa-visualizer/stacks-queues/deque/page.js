'use client';
import { useState } from 'react';

class Deque {
  constructor() {
    this.items = [];
  }

  addFront(element) {
    this.items.unshift(element);
    return this.items;
  }

  addRear(element) {
    this.items.push(element);
    return this.items;
  }

  removeFront() {
    if (this.isEmpty()) return null;
    const item = this.items.shift();
    return { item, items: this.items };
  }

  removeRear() {
    if (this.isEmpty()) return null;
    const item = this.items.pop();
    return { item, items: this.items };
  }

  peekFront() {
    return this.isEmpty() ? null : this.items[0];
  }

  peekRear() {
    return this.isEmpty() ? null : this.items[this.items.length - 1];
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

export default function DequeVisualization() {
  const [deque, setDeque] = useState(new Deque());
  const [dequeItems, setDequeItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [animating, setAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [operation, setOperation] = useState('');
  const [removedItem, setRemovedItem] = useState(null);
  const [removedFrom, setRemovedFrom] = useState('');

  const animateOperation = async (newItems, highlightIndex = -1, operationType = '', removed = null, removedPosition = '') => {
    setAnimating(true);
    setOperation(operationType);
    setHighlightedIndex(highlightIndex);
    
    if (removed !== null) {
      setRemovedItem(removed);
      setRemovedFrom(removedPosition);
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setDequeItems(newItems);
    setHighlightedIndex(-1);
    setOperation('');
    setRemovedItem(null);
    setRemovedFrom('');
    setAnimating(false);
  };

  const handleAddFront = async () => {
    if (inputValue.trim() && !animating) {
      const newItems = deque.addFront(parseInt(inputValue));
      await animateOperation(newItems, 0, 'add-front');
      setInputValue('');
    }
  };

  const handleAddRear = async () => {
    if (inputValue.trim() && !animating) {
      const newItems = deque.addRear(parseInt(inputValue));
      await animateOperation(newItems, newItems.length - 1, 'add-rear');
      setInputValue('');
    }
  };

  const handleRemoveFront = async () => {
    if (!deque.isEmpty() && !animating) {
      const result = deque.removeFront();
      if (result) {
        await animateOperation(result.items, 0, 'remove-front', result.item, 'front');
      }
    }
  };

  const handleRemoveRear = async () => {
    if (!deque.isEmpty() && !animating) {
      const result = deque.removeRear();
      if (result) {
        await animateOperation(result.items, dequeItems.length - 1, 'remove-rear', result.item, 'rear');
      }
    }
  };

  const handlePeekFront = async () => {
    if (!deque.isEmpty() && !animating) {
      setAnimating(true);
      setOperation('peek-front');
      setHighlightedIndex(0);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHighlightedIndex(-1);
      setOperation('');
      setAnimating(false);
    }
  };

  const handlePeekRear = async () => {
    if (!deque.isEmpty() && !animating) {
      setAnimating(true);
      setOperation('peek-rear');
      setHighlightedIndex(dequeItems.length - 1);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHighlightedIndex(-1);
      setOperation('');
      setAnimating(false);
    }
  };

  const handleClear = () => {
    if (!animating) {
      setDeque(new Deque());
      setDequeItems([]);
      setRemovedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Double-Ended Queue (Deque) Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Operations allowed at both ends - Add/Remove from Front and Rear
          </p>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter number"
              className="px-4 py-2 theme-surface-elevated text-white rounded-lg border border-slate-600 focus:border-indigo-400 focus:outline-none"
              disabled={animating}
            />
            
            <div className="flex gap-2">
              <button
                onClick={handleAddFront}
                disabled={!inputValue.trim() || animating}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                Add Front
              </button>
              
              <button
                onClick={handleAddRear}
                disabled={!inputValue.trim() || animating}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                Add Rear
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleRemoveFront}
                disabled={deque.isEmpty() || animating}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                Remove Front
              </button>
              
              <button
                onClick={handleRemoveRear}
                disabled={deque.isEmpty() || animating}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                Remove Rear
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePeekFront}
                disabled={deque.isEmpty() || animating}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                Peek Front
              </button>
              
              <button
                onClick={handlePeekRear}
                disabled={deque.isEmpty() || animating}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                Peek Rear
              </button>
            </div>
            
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
                Operation: {operation.toUpperCase().replace('-', ' ')}
                {(operation === 'peek-front' || operation === 'peek-rear') && dequeItems.length > 0 && (
                  <span className="ml-2 text-white">
                    {operation === 'peek-front' ? `Front: ${deque.peekFront()}` : `Rear: ${deque.peekRear()}`}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 min-h-96">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Deque Structure</h2>
          
          <div className="flex flex-col items-center">
            {/* Front and Rear indicators */}
            {dequeItems.length > 0 && (
              <div className="flex items-center justify-between w-full max-w-4xl mb-4">
                <div className="text-green-400 font-bold text-sm text-center">
                  FRONT
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-green-400 mt-1 mx-auto"></div>
                </div>
                <div className="text-red-400 font-bold text-sm text-center">
                  REAR
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-red-400 mt-1 mx-auto"></div>
                </div>
              </div>
            )}
            
            {/* Deque items */}
            <div className="flex items-center justify-center">
              {dequeItems.length === 0 ? (
                <div className="text-center text-slate-400 text-xl py-16">
                  Deque is empty. Add elements from front or rear!
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {dequeItems.map((item, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`
                          w-16 h-16 theme-surface-elevated rounded-lg flex items-center justify-center border-2 transition-all duration-500
                          ${highlightedIndex === index
                            ? 'border-yellow-400 bg-yellow-500/20 scale-110' 
                            : 'border-indigo-400'
                          }
                        `}
                      >
                        <span className="text-white font-bold text-lg">{item}</span>
                      </div>
                      
                      {/* Position indicator */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-slate-400 text-xs">
                        {index === 0 ? 'F' : index === dequeItems.length - 1 ? 'R' : index}
                      </div>
                      
                      {/* Bidirectional arrows */}
                      {index < dequeItems.length - 1 && (
                        <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 flex flex-col items-center">
                          <div className="w-6 h-0.5 bg-indigo-400 mb-1"></div>
                          <div className="w-6 h-0.5 bg-indigo-400"></div>
                          {/* Arrow heads */}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-2 border-t-1 border-b-1 border-transparent border-l-indigo-400"></div>
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-2 border-t-1 border-b-1 border-transparent border-r-indigo-400"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Operation indicators */}
            {dequeItems.length > 0 && (
              <div className="flex items-center justify-between w-full max-w-4xl mt-6">
                <div className="text-center">
                  <div className="text-green-400 text-sm mb-2">← Front Operations</div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Add</div>
                    <div className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Remove</div>
                    <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Peek</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 text-sm mb-2">Rear Operations →</div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Add</div>
                    <div className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">Remove</div>
                    <div className="px-2 py-1 bg-purple-500/20 theme-accent text-xs rounded">Peek</div>
                  </div>
                </div>
              </div>
            )}

            {/* Removed item animation */}
            {removedItem && (
              <div className="text-center mt-6">
                <div className="inline-block bg-red-500/20 border-2 border-red-400 rounded-lg p-4 animate-pulse">
                  <span className="text-red-400 font-bold">
                    Removed from {removedFrom}: {removedItem}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Deque Properties</h3>
            <div className="space-y-2 text-slate-300">
              <div>Size: <span className="text-indigo-400 font-bold">{deque.size()}</span></div>
              <div>Front: <span className="text-green-400 font-bold">{deque.peekFront() || 'null'}</span></div>
              <div>Rear: <span className="text-red-400 font-bold">{deque.peekRear() || 'null'}</span></div>
              <div>Is Empty: <span className="text-yellow-400 font-bold">{deque.isEmpty() ? 'Yes' : 'No'}</span></div>
            </div>
          </div>
          
          <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Time Complexities</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <div>Add Front/Rear: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Remove Front/Rear: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Peek Front/Rear: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Space: <span className="text-yellow-400 font-bold">O(n)</span></div>
            </div>
          </div>
        </div>

        {/* Operations Comparison */}
        <div className="mt-8 theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Operations Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Add Front</div>
              <div className="text-slate-300 text-sm">Insert at beginning</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold mb-2">Add Rear</div>
              <div className="text-slate-300 text-sm">Insert at end</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-bold mb-2">Remove Front</div>
              <div className="text-slate-300 text-sm">Delete from beginning</div>
            </div>
            <div className="text-center">
              <div className="text-orange-400 font-bold mb-2">Remove Rear</div>
              <div className="text-slate-300 text-sm">Delete from end</div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Real-world Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-slate-300 text-sm text-center">
              <div className="text-green-400 font-bold mb-2">🖥️ Undo/Redo</div>
              <p>Text editor operations</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-blue-400 font-bold mb-2">🌐 Browser History</div>
              <p>Navigate back/forward</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="theme-accent font-bold mb-2">🎮 Game States</div>
              <p>Save/load game states</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-yellow-400 font-bold mb-2">🔄 Sliding Window</div>
              <p>Algorithm applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
