'use client';
import { useState } from 'react';

class CircularLinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class CircularLinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  append(data) {
    const newNode = new CircularLinkedListNode(data);
    
    if (!this.head) {
      this.head = newNode;
      newNode.next = newNode; // Point to itself
    } else {
      let current = this.head;
      while (current.next !== this.head) {
        current = current.next;
      }
      current.next = newNode;
      newNode.next = this.head;
    }
    this.size++;
    return this.toArray();
  }

  prepend(data) {
    const newNode = new CircularLinkedListNode(data);
    
    if (!this.head) {
      this.head = newNode;
      newNode.next = newNode;
    } else {
      let current = this.head;
      while (current.next !== this.head) {
        current = current.next;
      }
      newNode.next = this.head;
      current.next = newNode;
      this.head = newNode;
    }
    this.size++;
    return this.toArray();
  }

  delete(data) {
    if (!this.head) return [];

    if (this.head.data === data) {
      if (this.size === 1) {
        this.head = null;
      } else {
        let current = this.head;
        while (current.next !== this.head) {
          current = current.next;
        }
        current.next = this.head.next;
        this.head = this.head.next;
      }
      this.size--;
      return this.toArray();
    }

    let current = this.head;
    do {
      if (current.next.data === data) {
        current.next = current.next.next;
        this.size--;
        break;
      }
      current = current.next;
    } while (current !== this.head);
    
    return this.toArray();
  }

  toArray() {
    if (!this.head) return [];
    
    const result = [];
    let current = this.head;
    do {
      result.push(current.data);
      current = current.next;
    } while (current !== this.head);
    
    return result;
  }
}

export default function CircularLinkedListVisualization() {
  const [list, setList] = useState(new CircularLinkedList());
  const [nodes, setNodes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [animating, setAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [operation, setOperation] = useState('');
  const [traversing, setTraversing] = useState(false);
  const [currentTraversal, setCurrentTraversal] = useState(-1);

  const animateOperation = async (newNodes, highlightIndex = -1, operationType = '') => {
    setAnimating(true);
    setOperation(operationType);
    setHighlightedIndex(highlightIndex);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setNodes(newNodes);
    setHighlightedIndex(-1);
    setOperation('');
    setAnimating(false);
  };

  const handleAppend = async () => {
    if (inputValue.trim() && !animating) {
      const newNodes = list.append(parseInt(inputValue));
      await animateOperation(newNodes, newNodes.length - 1, 'append');
      setInputValue('');
    }
  };

  const handlePrepend = async () => {
    if (inputValue.trim() && !animating) {
      const newNodes = list.prepend(parseInt(inputValue));
      await animateOperation(newNodes, 0, 'prepend');
      setInputValue('');
    }
  };

  const handleDelete = async () => {
    if (inputValue.trim() && !animating) {
      const value = parseInt(inputValue);
      const oldIndex = nodes.findIndex(node => node === value);
      const newNodes = list.delete(value);
      await animateOperation(newNodes, oldIndex, 'delete');
      setInputValue('');
    }
  };

  const handleClear = () => {
    if (!animating && !traversing) {
      setList(new CircularLinkedList());
      setNodes([]);
    }
  };

  const handleTraverse = async () => {
    if (nodes.length === 0 || traversing || animating) return;
    
    setTraversing(true);
    
    // Traverse twice around the circle to show the circular nature
    const totalSteps = nodes.length * 2;
    
    for (let i = 0; i < totalSteps; i++) {
      setCurrentTraversal(i % nodes.length);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    setCurrentTraversal(-1);
    setTraversing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Circular Linked List Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Interactive visualization of circular linked list where the last node points back to the first
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
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
              disabled={animating || traversing}
            />
            
            <button
              onClick={handlePrepend}
              disabled={!inputValue.trim() || animating || traversing}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Prepend
            </button>
            
            <button
              onClick={handleAppend}
              disabled={!inputValue.trim() || animating || traversing}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Append
            </button>
            
            <button
              onClick={handleDelete}
              disabled={!inputValue.trim() || animating || traversing}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Delete
            </button>
            
            <button
              onClick={handleTraverse}
              disabled={nodes.length === 0 || animating || traversing}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Traverse
            </button>
            
            <button
              onClick={handleClear}
              disabled={animating || traversing}
              className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Clear
            </button>
          </div>
          
          {(operation || traversing) && (
            <div className="text-center mt-4">
              <span className="text-yellow-400 font-semibold">
                {traversing ? 'TRAVERSING...' : `Operation: ${operation.toUpperCase()}`}
              </span>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 min-h-96">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Circular List Visualization</h2>
          
          {nodes.length === 0 ? (
            <div className="text-center text-slate-400 text-xl py-16">
              List is empty. Add some nodes to see the circular structure!
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Circular arrangement */}
                <div 
                  className="relative"
                  style={{
                    width: `${Math.max(300, nodes.length * 60)}px`,
                    height: `${Math.max(300, nodes.length * 60)}px`
                  }}
                >
                  {nodes.map((nodeData, index) => {
                    const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
                    const radius = Math.max(120, nodes.length * 25);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <div key={index}>
                        {/* Node */}
                        <div
                          className={`
                            absolute bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center border-2 transition-all duration-500
                            ${highlightedIndex === index || currentTraversal === index
                              ? 'border-yellow-400 bg-yellow-500/20 scale-125' 
                              : 'border-purple-400'
                            }
                          `}
                          style={{
                            left: `calc(50% + ${x}px - 32px)`,
                            top: `calc(50% + ${y}px - 32px)`,
                          }}
                        >
                          <div className="text-white font-bold text-lg">
                            {nodeData}
                          </div>
                        </div>

                        {/* Arrow to next node */}
                        <div
                          className="absolute"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                          }}
                        >
                          {(() => {
                            const nextIndex = (index + 1) % nodes.length;
                            const nextAngle = (2 * Math.PI * nextIndex) / nodes.length - Math.PI / 2;
                            const nextX = Math.cos(nextAngle) * radius;
                            const nextY = Math.sin(nextAngle) * radius;
                            
                            const deltaX = nextX - x;
                            const deltaY = nextY - y;
                            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                            const arrowAngle = Math.atan2(deltaY, deltaX);
                            
                            return (
                              <div
                                className={`
                                  absolute h-1 transition-all duration-500 origin-left
                                  ${currentTraversal === index ? 'bg-yellow-400' : 'bg-purple-400'}
                                `}
                                style={{
                                  width: `${distance - 64}px`,
                                  transform: `rotate(${arrowAngle}rad) translateX(32px)`,
                                  left: '0px',
                                  top: '-2px',
                                }}
                              >
                                <div 
                                  className={`
                                    absolute right-0 top-1/2 transform -translate-y-1/2
                                    w-0 h-0 border-l-4 border-t-2 border-b-2 border-transparent
                                    ${currentTraversal === index ? 'border-l-yellow-400' : 'border-l-purple-400'}
                                  `}
                                  style={{
                                    right: '-4px'
                                  }}
                                ></div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}

                  {/* Head indicator */}
                  {nodes.length > 0 && (
                    <div
                      className="absolute text-green-400 font-bold text-sm"
                      style={{
                        left: `calc(50% + ${Math.cos(-Math.PI / 2) * Math.max(120, nodes.length * 25)}px - 20px)`,
                        top: `calc(50% + ${Math.sin(-Math.PI / 2) * Math.max(120, nodes.length * 25)}px - 40px)`,
                      }}
                    >
                      HEAD
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">List Properties</h3>
            <div className="space-y-2 text-slate-300">
              <div>Size: <span className="text-purple-400 font-bold">{nodes.length}</span></div>
              <div>Head: <span className="text-green-400 font-bold">{nodes.length > 0 ? nodes[0] : 'null'}</span></div>
              <div>Circular: <span className="text-yellow-400 font-bold">{nodes.length > 0 ? 'Yes' : 'No'}</span></div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Time Complexities</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <div>Append: <span className="text-yellow-400 font-bold">O(n)</span></div>
              <div>Prepend: <span className="text-yellow-400 font-bold">O(n)</span></div>
              <div>Delete: <span className="text-yellow-400 font-bold">O(n)</span></div>
              <div>Traverse: <span className="text-yellow-400 font-bold">O(n)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
