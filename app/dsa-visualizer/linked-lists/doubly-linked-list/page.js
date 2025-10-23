'use client';
import { useState, useEffect } from 'react';

class DoublyLinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(data) {
    const newNode = new DoublyLinkedListNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.size++;
    return this.toArray();
  }

  prepend(data) {
    const newNode = new DoublyLinkedListNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
    return this.toArray();
  }

  delete(data) {
    let current = this.head;
    while (current) {
      if (current.data === data) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }
        
        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }
        
        this.size--;
        return this.toArray();
      }
      current = current.next;
    }
    return this.toArray();
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push({
        data: current.data,
        hasNext: current.next !== null,
        hasPrev: current.prev !== null
      });
      current = current.next;
    }
    return result;
  }
}

export default function DoublyLinkedListVisualization() {
  const [list, setList] = useState(new DoublyLinkedList());
  const [nodes, setNodes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [animating, setAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [operation, setOperation] = useState('');

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
      const oldIndex = nodes.findIndex(node => node.data === value);
      const newNodes = list.delete(value);
      await animateOperation(newNodes, oldIndex, 'delete');
      setInputValue('');
    }
  };

  const handleClear = () => {
    if (!animating) {
      setList(new DoublyLinkedList());
      setNodes([]);
    }
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Doubly Linked List Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Interactive visualization of doubly linked list operations with bidirectional pointers
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
              className="px-4 py-2 theme-surface-elevated text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              disabled={animating}
            />
            
            <button
              onClick={handlePrepend}
              disabled={!inputValue.trim() || animating}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Prepend
            </button>
            
            <button
              onClick={handleAppend}
              disabled={!inputValue.trim() || animating}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Append
            </button>
            
            <button
              onClick={handleDelete}
              disabled={!inputValue.trim() || animating}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Delete
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
              </span>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 min-h-96">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">List Visualization</h2>
          
          {nodes.length === 0 ? (
            <div className="text-center text-slate-400 text-xl py-16">
              List is empty. Add some nodes to see the visualization!
            </div>
          ) : (
            <div className="flex items-center justify-center flex-wrap gap-4">
              {/* Head Label */}
              <div className="flex flex-col items-center mr-4">
                <div className="text-green-400 font-bold mb-2">HEAD</div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-green-400"></div>
              </div>

              {nodes.map((node, index) => (
                <div key={index} className="flex items-center">
                  {/* Node */}
                  <div
                    className={`
                      relative theme-surface-elevated rounded-lg p-4 border-2 transition-all duration-500
                      ${highlightedIndex === index 
                        ? 'border-yellow-400 bg-yellow-500/20 scale-110' 
                        : 'border-blue-400'
                      }
                    `}
                  >
                    {/* Previous pointer */}
                    <div className="absolute -top-6 left-2 text-xs text-slate-400">
                      prev
                    </div>
                    
                    {/* Node data */}
                    <div className="text-white font-bold text-xl text-center min-w-12">
                      {node.data}
                    </div>
                    
                    {/* Next pointer */}
                    <div className="absolute -bottom-6 right-2 text-xs text-slate-400">
                      next
                    </div>
                    
                    {/* Previous arrow (if not first node) */}
                    {index > 0 && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8">
                        <div className="w-6 h-0.5 bg-purple-400"></div>
                        <div className="w-0 h-0 border-r-2 border-t-1 border-b-1 border-transparent border-r-purple-400 absolute left-0 top-1/2 transform -translate-y-1/2"></div>
                      </div>
                    )}
                  </div>

                  {/* Forward arrow to next node */}
                  {index < nodes.length - 1 && (
                    <div className="flex items-center mx-2">
                      <div className="w-8 h-0.5 bg-blue-400"></div>
                      <div className="w-0 h-0 border-l-2 border-t-1 border-b-1 border-transparent border-l-blue-400"></div>
                    </div>
                  )}
                </div>
              ))}

              {/* Tail Label */}
              <div className="flex flex-col items-center ml-4">
                <div className="text-red-400 font-bold mb-2">TAIL</div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-400"></div>
              </div>
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">List Properties</h3>
            <div className="space-y-2 text-slate-300">
              <div>Size: <span className="text-blue-400 font-bold">{nodes.length}</span></div>
              <div>Head: <span className="text-green-400 font-bold">{nodes.length > 0 ? nodes[0].data : 'null'}</span></div>
              <div>Tail: <span className="text-red-400 font-bold">{nodes.length > 0 ? nodes[nodes.length - 1].data : 'null'}</span></div>
            </div>
          </div>
          
          <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Time Complexities</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <div>Append: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Prepend: <span className="text-green-400 font-bold">O(1)</span></div>
              <div>Delete: <span className="text-yellow-400 font-bold">O(n)</span></div>
              <div>Search: <span className="text-yellow-400 font-bold">O(n)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
