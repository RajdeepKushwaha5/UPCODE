'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

export default function SinglyLinkedListVisualizer() {
  const [list, setList] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [insertPosition, setInsertPosition] = useState(0);
  const [deletePosition, setDeletePosition] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [operation, setOperation] = useState('');
  const [listSize, setListSize] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Convert linked list to array for visualization
  const listToArray = useCallback((head) => {
    const arr = [];
    let current = head;
    while (current) {
      arr.push(current.val);
      current = current.next;
    }
    return arr;
  }, []);

  // Create linked list from array
  const arrayToList = useCallback((arr) => {
    if (arr.length === 0) return null;
    
    const head = new ListNode(arr[0]);
    let current = head;
    
    for (let i = 1; i < arr.length; i++) {
      current.next = new ListNode(arr[i]);
      current = current.next;
    }
    
    return head;
  }, []);

  // Initialize with sample data
  const initializeList = useCallback(() => {
    const sampleData = [10, 20, 30, 40];
    const head = arrayToList(sampleData);
    setList(head);
    setListSize(sampleData.length);
  }, [arrayToList]);

  // Insert at head
  const insertAtHead = async (value) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOperation(`Inserting ${value} at head`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newNode = new ListNode(parseInt(value));
    newNode.next = list;
    setList(newNode);
    setListSize(prev => prev + 1);
    
    setHighlightedNode(0);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHighlightedNode(-1);
    setOperation('');
    setIsAnimating(false);
  };

  // Insert at tail
  const insertAtTail = async (value) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOperation(`Inserting ${value} at tail`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newNode = new ListNode(parseInt(value));
    
    if (!list) {
      setList(newNode);
      setListSize(1);
    } else {
      let current = list;
      let position = 0;
      
      while (current.next) {
        setHighlightedNode(position);
        await new Promise(resolve => setTimeout(resolve, 300));
        current = current.next;
        position++;
      }
      
      current.next = newNode;
      setListSize(prev => prev + 1);
      setHighlightedNode(position + 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setHighlightedNode(-1);
    setOperation('');
    setIsAnimating(false);
  };

  // Insert at position
  const insertAtPosition = async (value, pos) => {
    if (isAnimating || pos < 0) return;
    setIsAnimating(true);
    setOperation(`Inserting ${value} at position ${pos}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (pos === 0) {
      await insertAtHead(value);
      return;
    }
    
    const newNode = new ListNode(parseInt(value));
    let current = list;
    let position = 0;
    
    // Traverse to position - 1
    while (current && position < pos - 1) {
      setHighlightedNode(position);
      await new Promise(resolve => setTimeout(resolve, 300));
      current = current.next;
      position++;
    }
    
    if (current) {
      newNode.next = current.next;
      current.next = newNode;
      setListSize(prev => prev + 1);
      setHighlightedNode(pos);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setHighlightedNode(-1);
    setOperation('');
    setIsAnimating(false);
  };

  // Delete from head
  const deleteFromHead = async () => {
    if (isAnimating || !list) return;
    setIsAnimating(true);
    setOperation('Deleting from head');
    
    setHighlightedNode(0);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setList(list.next);
    setListSize(prev => prev - 1);
    
    setHighlightedNode(-1);
    setOperation('');
    setIsAnimating(false);
  };

  // Delete from position
  const deleteFromPosition = async (pos) => {
    if (isAnimating || !list || pos < 0) return;
    setIsAnimating(true);
    setOperation(`Deleting from position ${pos}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (pos === 0) {
      await deleteFromHead();
      return;
    }
    
    let current = list;
    let position = 0;
    
    // Traverse to position - 1
    while (current && position < pos - 1) {
      setHighlightedNode(position);
      await new Promise(resolve => setTimeout(resolve, 300));
      current = current.next;
      position++;
    }
    
    if (current && current.next) {
      setHighlightedNode(pos);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      current.next = current.next.next;
      setListSize(prev => prev - 1);
    }
    
    setHighlightedNode(-1);
    setOperation('');
    setIsAnimating(false);
  };

  // Search for value
  const searchInList = async (value) => {
    if (isAnimating || !list) return;
    setIsAnimating(true);
    setOperation(`Searching for ${value}`);
    
    let current = list;
    let position = 0;
    
    while (current) {
      setHighlightedNode(position);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (current.val === parseInt(value)) {
        setOperation(`Found ${value} at position ${position}!`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
      }
      
      current = current.next;
      position++;
    }
    
    if (!current) {
      setOperation(`${value} not found in the list`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setHighlightedNode(-1);
    setOperation('');
    setIsAnimating(false);
  };

  useEffect(() => {
    if (!isInitialized) {
      initializeList();
      setIsInitialized(true);
    }
  }, [initializeList]);

  const listArray = listToArray(list);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer/linked-lists" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors duration-200">
            ← Back to Linked Lists
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Singly Linked List Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            A singly linked list is a linear data structure where elements are stored in nodes, 
            and each node contains data and a pointer to the next node.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">List Size</h3>
            <p className="text-purple-400 text-2xl font-bold">{listSize}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Current Operation</h3>
            <p className="text-slate-300 text-sm">{operation || 'Ready'}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Memory</h3>
            <p className="text-slate-300">O(n)</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Insert Operations */}
            <div>
              <h4 className="text-white font-semibold mb-3">Insert Operations</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={() => insertAtHead(inputValue)}
                  disabled={isAnimating || !inputValue}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Insert at Head
                </button>
                <button
                  onClick={() => insertAtTail(inputValue)}
                  disabled={isAnimating || !inputValue}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Insert at Tail
                </button>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={insertPosition}
                    onChange={(e) => setInsertPosition(parseInt(e.target.value) || 0)}
                    placeholder="Pos"
                    className="w-16 px-2 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500"
                  />
                  <button
                    onClick={() => insertAtPosition(inputValue, insertPosition)}
                    disabled={isAnimating || !inputValue}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    Insert at Pos
                  </button>
                </div>
              </div>
            </div>

            {/* Delete Operations */}
            <div>
              <h4 className="text-white font-semibold mb-3">Delete Operations</h4>
              <div className="space-y-2">
                <button
                  onClick={deleteFromHead}
                  disabled={isAnimating || listSize === 0}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Delete from Head
                </button>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={deletePosition}
                    onChange={(e) => setDeletePosition(parseInt(e.target.value) || 0)}
                    placeholder="Position"
                    className="w-20 px-2 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500"
                  />
                  <button
                    onClick={() => deleteFromPosition(deletePosition)}
                    disabled={isAnimating || listSize === 0}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    Delete from Pos
                  </button>
                </div>
              </div>
            </div>

            {/* Search Operations */}
            <div>
              <h4 className="text-white font-semibold mb-3">Search Operations</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search value"
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500"
                />
                <button
                  onClick={() => searchInList(searchValue)}
                  disabled={isAnimating || !searchValue || listSize === 0}
                  className="w-full px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Utility */}
            <div>
              <h4 className="text-white font-semibold mb-3">Utility</h4>
              <div className="space-y-2">
                <button
                  onClick={initializeList}
                  disabled={isAnimating}
                  className="w-full px-3 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Reset List
                </button>
                <button
                  onClick={() => {
                    setList(null);
                    setListSize(0);
                  }}
                  disabled={isAnimating}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 mb-8">
          <div className="min-h-[200px] flex items-center justify-center overflow-x-auto">
            {listArray.length === 0 ? (
              <div className="text-slate-400 text-xl">List is empty</div>
            ) : (
              <div className="flex items-center gap-4">
                {listArray.map((value, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`relative px-6 py-4 rounded-lg border-2 transition-all duration-300 ${
                        highlightedNode === index
                          ? 'bg-yellow-500 border-yellow-400 text-black transform scale-110'
                          : 'bg-purple-600 border-purple-500 text-white'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg">{value}</div>
                        <div className="text-xs opacity-75">Index: {index}</div>
                      </div>
                    </div>
                    {index < listArray.length - 1 && (
                      <div className="flex items-center mx-2">
                        <div className="w-8 h-0.5 bg-slate-400"></div>
                        <div className="w-0 h-0 border-l-4 border-l-slate-400 border-y-2 border-y-transparent ml-1"></div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="ml-4 px-4 py-4 bg-slate-700 rounded-lg border-2 border-slate-600 text-slate-400">
                  NULL
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Operations & Complexity</h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between">
                <span>Insert at Head:</span>
                <span className="text-green-400">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span>Insert at Tail:</span>
                <span className="text-yellow-400">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span>Insert at Position:</span>
                <span className="text-yellow-400">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span>Delete from Head:</span>
                <span className="text-green-400">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span>Delete from Position:</span>
                <span className="text-yellow-400">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span>Search:</span>
                <span className="text-red-400">O(n)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Key Properties</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>Dynamic Size:</strong> Can grow/shrink during runtime</li>
              <li>• <strong>Memory Efficient:</strong> Only allocates needed memory</li>
              <li>• <strong>Sequential Access:</strong> Must traverse from head</li>
              <li>• <strong>No Random Access:</strong> Cannot directly access by index</li>
              <li>• <strong>Cache Unfriendly:</strong> Nodes may not be contiguous</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
