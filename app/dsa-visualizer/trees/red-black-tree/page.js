'use client';
import { useState } from 'react';

class RedBlackNode {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.color = 'RED'; // New nodes are always red initially
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.root = null;
    this.NIL = new RedBlackNode(null);
    this.NIL.color = 'BLACK';
    this.NIL.left = null;
    this.NIL.right = null;
  }

  leftRotate(x) {
    let y = x.right;
    x.right = y.left;
    
    if (y.left !== this.NIL) {
      y.left.parent = x;
    }
    
    y.parent = x.parent;
    
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    
    y.left = x;
    x.parent = y;
  }

  rightRotate(x) {
    let y = x.left;
    x.left = y.right;
    
    if (y.right !== this.NIL) {
      y.right.parent = x;
    }
    
    y.parent = x.parent;
    
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    
    y.right = x;
    x.parent = y;
  }

  insertFixup(z) {
    while (z.parent && z.parent.color === 'RED') {
      if (z.parent === z.parent.parent.left) {
        let y = z.parent.parent.right;
        
        if (y && y.color === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          z.parent.parent.color = 'RED';
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this.leftRotate(z);
          }
          z.parent.color = 'BLACK';
          z.parent.parent.color = 'RED';
          this.rightRotate(z.parent.parent);
        }
      } else {
        let y = z.parent.parent.left;
        
        if (y && y.color === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          z.parent.parent.color = 'RED';
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.rightRotate(z);
          }
          z.parent.color = 'BLACK';
          z.parent.parent.color = 'RED';
          this.leftRotate(z.parent.parent);
        }
      }
    }
    this.root.color = 'BLACK';
  }

  insert(data) {
    let node = new RedBlackNode(data);
    node.left = this.NIL;
    node.right = this.NIL;

    let y = null;
    let x = this.root;

    while (x !== null && x !== this.NIL) {
      y = x;
      if (node.data < x.data) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    node.parent = y;

    if (y === null) {
      this.root = node;
    } else if (node.data < y.data) {
      y.left = node;
    } else {
      y.right = node;
    }

    if (node.parent === null) {
      node.color = 'BLACK';
      return this.getTreeStructure();
    }

    if (node.parent.parent === null) {
      return this.getTreeStructure();
    }

    this.insertFixup(node);
    return this.getTreeStructure();
  }

  search(data, node = this.root) {
    if (node === null || node === this.NIL || node.data === data) {
      return node;
    }

    if (data < node.data) {
      return this.search(data, node.left);
    }
    
    return this.search(data, node.right);
  }

  getTreeStructure() {
    const result = [];
    const traverse = (node, level = 0, position = 'root') => {
      if (node && node !== this.NIL) {
        result.push({
          data: node.data,
          color: node.color,
          level: level,
          position: position
        });
        traverse(node.left, level + 1, 'left');
        traverse(node.right, level + 1, 'right');
      }
    };
    traverse(this.root);
    return result;
  }

  getHeight() {
    const getNodeHeight = (node) => {
      if (!node || node === this.NIL) return 0;
      return 1 + Math.max(getNodeHeight(node.left), getNodeHeight(node.right));
    };
    return getNodeHeight(this.root);
  }
}

export default function RedBlackTreeVisualization() {
  const [tree, setTree] = useState(new RedBlackTree());
  const [treeNodes, setTreeNodes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [animating, setAnimating] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [operation, setOperation] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const animateOperation = async (newNodes, highlightData = null, operationType = '', searchFound = null) => {
    setAnimating(true);
    setOperation(operationType);
    setHighlightedNode(highlightData);
    
    if (searchFound !== null) {
      setSearchResult(searchFound);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTreeNodes(newNodes);
    setHighlightedNode(null);
    setOperation('');
    
    if (operationType !== 'search') {
      setSearchResult(null);
    }
    
    setAnimating(false);
  };

  const handleInsert = async () => {
    if (inputValue.trim() && !animating) {
      const value = parseInt(inputValue);
      const newNodes = tree.insert(value);
      await animateOperation(newNodes, value, 'insert');
      setInputValue('');
    }
  };

  const handleSearch = async () => {
    if (inputValue.trim() && !animating) {
      const value = parseInt(inputValue);
      const foundNode = tree.search(value);
      const found = foundNode && foundNode !== tree.NIL;
      await animateOperation(treeNodes, value, 'search', found);
      setInputValue('');
    }
  };

  const handleClear = () => {
    if (!animating) {
      setTree(new RedBlackTree());
      setTreeNodes([]);
      setSearchResult(null);
    }
  };

  const renderNode = (nodeData, index) => {
    const isHighlighted = highlightedNode === nodeData.data;
    const isSearchResult = searchResult !== null && nodeData.data === highlightedNode;
    
    return (
      <div
        key={index}
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 transition-all duration-500
          ${nodeData.color === 'RED' 
            ? 'bg-red-500 border-red-400' 
            : 'bg-gray-800 border-gray-600'
          }
          ${isHighlighted || isSearchResult 
            ? 'scale-125 shadow-lg ring-4 ring-yellow-400' 
            : ''
          }
        `}
        style={{
          gridColumn: `${Math.pow(2, nodeData.level) + index}`,
          gridRow: nodeData.level + 1,
        }}
      >
        {nodeData.data}
        {nodeData.color === 'RED' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-white"></div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Red-Black Tree Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Self-balancing binary search tree with guaranteed O(log n) operations
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
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-red-400 focus:outline-none"
              disabled={animating}
            />
            
            <button
              onClick={handleInsert}
              disabled={!inputValue.trim() || animating}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Insert
            </button>
            
            <button
              onClick={handleSearch}
              disabled={!inputValue.trim() || animating}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Search
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
                {operation === 'search' && searchResult !== null && (
                  <span className="ml-2 text-white">
                    {searchResult ? 'Node Found!' : 'Node Not Found'}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Red-Black Tree Rules */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Red-Black Tree Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-300">1. Nodes are either red or black</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-800 rounded-full border border-gray-600"></div>
                <span className="text-slate-300">2. Root is always black</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-800 rounded-full border border-gray-600"></div>
                <span className="text-slate-300">3. All leaves (NIL) are black</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-300">4. Red node cannot have red children</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">5. Same black height for all paths</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 min-h-96">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Tree Structure</h2>
          
          {treeNodes.length === 0 ? (
            <div className="text-center text-slate-400 text-xl py-16">
              Tree is empty. Insert nodes to see the Red-Black Tree structure!
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative">
                {/* Tree visualization using CSS Grid approach */}
                <div 
                  className="grid gap-4 justify-center items-center"
                  style={{
                    gridTemplateColumns: `repeat(${Math.pow(2, tree.getHeight())}, 60px)`,
                    gridTemplateRows: `repeat(${tree.getHeight()}, 60px)`,
                  }}
                >
                  {treeNodes.map((nodeData, index) => {
                    // Calculate position based on level and in-order position
                    const levelWidth = Math.pow(2, tree.getHeight() - nodeData.level - 1);
                    const positionInLevel = Math.floor(index / Math.pow(2, nodeData.level));
                    const startCol = levelWidth + positionInLevel * (levelWidth * 2);
                    
                    return (
                      <div
                        key={index}
                        className={`
                          relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 transition-all duration-500
                          ${nodeData.color === 'RED' 
                            ? 'bg-red-500 border-red-400' 
                            : 'bg-gray-800 border-gray-600'
                          }
                          ${(highlightedNode === nodeData.data || (searchResult !== null && nodeData.data === highlightedNode))
                            ? 'scale-125 shadow-lg ring-4 ring-yellow-400' 
                            : ''
                          }
                        `}
                        style={{
                          gridColumn: startCol,
                          gridRow: nodeData.level + 1,
                        }}
                      >
                        {nodeData.data}
                        {nodeData.color === 'RED' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-white"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Tree Statistics</h3>
            <div className="space-y-2 text-slate-300">
              <div>Nodes: <span className="text-red-400 font-bold">{treeNodes.length}</span></div>
              <div>Height: <span className="text-yellow-400 font-bold">{tree.getHeight()}</span></div>
              <div>Root: <span className="text-green-400 font-bold">{tree.root ? tree.root.data : 'null'}</span></div>
              <div>Balanced: <span className="text-blue-400 font-bold">Yes</span></div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Time Complexities</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <div>Search: <span className="text-green-400 font-bold">O(log n)</span></div>
              <div>Insert: <span className="text-green-400 font-bold">O(log n)</span></div>
              <div>Delete: <span className="text-green-400 font-bold">O(log n)</span></div>
              <div>Space: <span className="text-yellow-400 font-bold">O(n)</span></div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Node Colors</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                <span className="text-slate-300">Red Node</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-800 rounded-full border border-gray-600"></div>
                <span className="text-slate-300">Black Node</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Highlighted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advantages */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Advantages of Red-Black Trees</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-slate-300 text-sm text-center">
              <div className="text-green-400 font-bold mb-2">⚡ Performance</div>
              <p>Guaranteed O(log n) operations</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-blue-400 font-bold mb-2">⚖️ Balanced</div>
              <p>Self-balancing structure</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-purple-400 font-bold mb-2">🔄 Dynamic</div>
              <p>Efficient insertions & deletions</p>
            </div>
            <div className="text-slate-300 text-sm text-center">
              <div className="text-yellow-400 font-bold mb-2">📊 Used In</div>
              <p>STL map, Java TreeMap</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
