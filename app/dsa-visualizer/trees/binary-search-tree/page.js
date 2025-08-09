'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).substring(2, 9);
  }
}

export default function BSTVisualizer() {
  const [bst, setBst] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [operation, setOperation] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTarget, setSearchTarget] = useState('');
  const [searchPath, setSearchPath] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [treeHeight, setTreeHeight] = useState(0);
  const [nodeCount, setNodeCount] = useState(0);
  const [inorderResult, setInorderResult] = useState([]);
  const [validBST, setValidBST] = useState(true);

  // Calculate tree height
  const calculateHeight = (node) => {
    if (!node) return 0;
    return 1 + Math.max(calculateHeight(node.left), calculateHeight(node.right));
  };

  // Count nodes
  const countNodes = (node) => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  // Validate BST property
  const validateBST = (node, min = -Infinity, max = Infinity) => {
    if (!node) return true;
    if (node.value <= min || node.value >= max) return false;
    return validateBST(node.left, min, node.value) && 
           validateBST(node.right, node.value, max);
  };

  // Calculate node positions for visualization
  const calculatePositions = (node, x = 400, y = 50, level = 0, spacing = 200) => {
    if (!node) return {};
    
    const positions = {};
    positions[node.id] = { x, y, level };
    
    const levelSpacing = spacing / Math.pow(1.4, level);
    
    if (node.left) {
      Object.assign(positions, calculatePositions(node.left, x - levelSpacing, y + 80, level + 1, spacing));
    }
    
    if (node.right) {
      Object.assign(positions, calculatePositions(node.right, x + levelSpacing, y + 80, level + 1, spacing));
    }
    
    return positions;
  };

  // Insert node into BST
  const insertIntoBST = async (root, value, path = []) => {
    if (!root) {
      const newNode = new BSTNode(value);
      setHighlightedNodes([newNode.id]);
      await sleep(500);
      return newNode;
    }
    
    path.push(root.id);
    setSearchPath([...path]);
    setHighlightedNodes([root.id]);
    setComparisons(prev => prev + 1);
    await sleep(800);
    
    if (value < root.value) {
      root.left = await insertIntoBST(root.left, value, path);
    } else if (value > root.value) {
      root.right = await insertIntoBST(root.right, value, path);
    }
    
    return root;
  };

  // Search in BST
  const searchInBST = async (root, value, path = []) => {
    if (!root) {
      setOperation(`${value} not found in BST`);
      return { found: false, path };
    }
    
    path.push(root.id);
    setSearchPath([...path]);
    setHighlightedNodes([root.id]);
    setComparisons(prev => prev + 1);
    await sleep(800);
    
    if (root.value === value) {
      setOperation(`Found ${value}! (${comparisons + 1} comparisons)`);
      return { found: true, path, node: root };
    }
    
    if (value < root.value) {
      return searchInBST(root.left, value, path);
    } else {
      return searchInBST(root.right, value, path);
    }
  };

  // Find minimum value node
  const findMin = (node) => {
    while (node.left) {
      node = node.left;
    }
    return node;
  };

  // Delete from BST
  const deleteFromBST = (root, value) => {
    if (!root) return null;
    
    if (value < root.value) {
      root.left = deleteFromBST(root.left, value);
    } else if (value > root.value) {
      root.right = deleteFromBST(root.right, value);
    } else {
      // Node to be deleted found
      if (!root.left) return root.right;
      if (!root.right) return root.left;
      
      // Node with two children: Get the inorder successor
      const minRight = findMin(root.right);
      root.value = minRight.value;
      root.right = deleteFromBST(root.right, minRight.value);
    }
    
    return root;
  };

  // Inorder traversal to show sorted order
  const inorderTraversal = (node, result = []) => {
    if (!node) return result;
    
    inorderTraversal(node.left, result);
    result.push(node.value);
    inorderTraversal(node.right, result);
    
    return result;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Handle operations
  const handleInsert = async () => {
    if (!inputValue) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    setComparisons(0);
    setSearchPath([]);
    
    if (!bst) {
      const newRoot = new BSTNode(value);
      setBst(newRoot);
      setOperation(`Inserted ${value} as root`);
    } else {
      const newBst = await insertIntoBST(bst, value);
      setBst({ ...newBst });
      setOperation(`Inserted ${value} into BST`);
    }
    
    setInputValue('');
    setHighlightedNodes([]);
    setSearchPath([]);
    setIsAnimating(false);
  };

  const handleSearch = async () => {
    if (!searchTarget || !bst) return;
    
    const value = parseInt(searchTarget);
    setIsAnimating(true);
    setComparisons(0);
    setSearchPath([]);
    
    await searchInBST(bst, value);
    
    setIsAnimating(false);
  };

  const handleDelete = () => {
    if (!inputValue || !bst) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    
    const newBst = deleteFromBST(bst, value);
    setBst(newBst);
    setOperation(`Deleted ${value} from BST`);
    setInputValue('');
    setHighlightedNodes([]);
    setSearchPath([]);
    setIsAnimating(false);
  };

  const generateRandomBST = () => {
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 65, 75, 85];
    let newBst = null;
    
    values.forEach(value => {
      if (!newBst) {
        newBst = new BSTNode(value);
      } else {
        newBst = insertBSTSync(newBst, value);
      }
    });
    
    setBst(newBst);
    setHighlightedNodes([]);
    setSearchPath([]);
    setOperation('Generated random BST');
  };

  const insertBSTSync = (root, value) => {
    if (!root) return new BSTNode(value);
    
    if (value < root.value) {
      root.left = insertBSTSync(root.left, value);
    } else if (value > root.value) {
      root.right = insertBSTSync(root.right, value);
    }
    
    return root;
  };

  const clearBST = () => {
    setBst(null);
    setHighlightedNodes([]);
    setSearchPath([]);
    setOperation('');
    setInorderResult([]);
    setComparisons(0);
  };

  const showInorder = () => {
    if (!bst) return;
    const result = inorderTraversal(bst);
    setInorderResult(result);
    setOperation('Inorder traversal shows sorted order');
  };

  // Update positions and stats when BST changes
  useEffect(() => {
    if (bst) {
      const positions = calculatePositions(bst);
      setNodePositions(positions);
      setTreeHeight(calculateHeight(bst));
      setNodeCount(countNodes(bst));
      setValidBST(validateBST(bst));
      
      // Auto-update inorder if showing
      if (inorderResult.length > 0) {
        setInorderResult(inorderTraversal(bst));
      }
    } else {
      setNodePositions({});
      setTreeHeight(0);
      setNodeCount(0);
      setValidBST(true);
      setInorderResult([]);
    }
  }, [bst]);

  // Render tree connections
  const renderConnections = () => {
    const connections = [];
    
    const traverse = (node) => {
      if (!node) return;
      
      const nodePos = nodePositions[node.id];
      
      if (node.left) {
        const leftPos = nodePositions[node.left.id];
        connections.push(
          <line
            key={`${node.id}-${node.left.id}`}
            x1={nodePos.x}
            y1={nodePos.y}
            x2={leftPos.x}
            y2={leftPos.y}
            stroke="#64748b"
            strokeWidth="2"
            className="transition-all duration-300"
          />
        );
        traverse(node.left);
      }
      
      if (node.right) {
        const rightPos = nodePositions[node.right.id];
        connections.push(
          <line
            key={`${node.id}-${node.right.id}`}
            x1={nodePos.x}
            y1={nodePos.y}
            x2={rightPos.x}
            y2={rightPos.y}
            stroke="#64748b"
            strokeWidth="2"
            className="transition-all duration-300"
          />
        );
        traverse(node.right);
      }
    };
    
    if (bst) traverse(bst);
    return connections;
  };

  // Render tree nodes
  const renderNodes = () => {
    const nodes = [];
    
    const traverse = (node) => {
      if (!node) return;
      
      const pos = nodePositions[node.id];
      const isHighlighted = highlightedNodes.includes(node.id);
      const isInSearchPath = searchPath.includes(node.id);
      
      nodes.push(
        <g key={node.id} className="transition-all duration-300">
          <circle
            cx={pos.x}
            cy={pos.y}
            r="25"
            fill={isHighlighted ? '#f59e0b' : isInSearchPath ? '#3b82f6' : '#10b981'}
            stroke={isHighlighted ? '#d97706' : isInSearchPath ? '#2563eb' : '#059669'}
            strokeWidth="3"
            className="transition-all duration-300 hover:scale-110 cursor-pointer"
          />
          <text
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            className="fill-white font-bold text-sm pointer-events-none"
          >
            {node.value}
          </text>
        </g>
      );
      
      traverse(node.left);
      traverse(node.right);
    };
    
    if (bst) traverse(bst);
    return nodes;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Binary Search Tree Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            A Binary Search Tree (BST) is a binary tree where the left child is smaller than the parent, 
            and the right child is larger. This property enables efficient search, insertion, and deletion operations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Tree Height</h3>
            <p className="text-green-400 text-2xl font-bold">{treeHeight}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Node Count</h3>
            <p className="text-blue-400 text-2xl font-bold">{nodeCount}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Comparisons</h3>
            <p className="text-yellow-400 text-2xl font-bold">{comparisons}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Valid BST</h3>
            <p className={`text-2xl font-bold ${validBST ? 'text-green-400' : 'text-red-400'}`}>
              {validBST ? '✓' : '✗'}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Operation</h3>
            <p className="text-purple-400 text-sm">{operation || 'None'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Insert/Delete */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">BST Operations</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-green-500 focus:outline-none"
                  disabled={isAnimating}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleInsert}
                  disabled={isAnimating || !inputValue}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  Insert
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isAnimating || !inputValue || !bst}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Search */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Search</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  placeholder="Search value"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  disabled={isAnimating}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isAnimating || !searchTarget || !bst}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-semibold disabled:opacity-50"
              >
                🔍 Search
              </button>
            </div>

            {/* Tree Management */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Tree Management</h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={generateRandomBST}
                  disabled={isAnimating}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  🎲 Random BST
                </button>
                <button
                  onClick={clearBST}
                  disabled={isAnimating}
                  className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  🗑️ Clear BST
                </button>
              </div>
            </div>

            {/* Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Analysis</h3>
              <button
                onClick={showInorder}
                disabled={isAnimating || !bst}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 font-semibold disabled:opacity-50"
              >
                📊 Show Sorted Order
              </button>
            </div>
          </div>

          {/* Inorder Result */}
          {inorderResult.length > 0 && (
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border-t border-slate-600">
              <h4 className="text-white font-semibold mb-2">Inorder Traversal (Sorted Order):</h4>
              <div className="flex flex-wrap gap-2">
                {inorderResult.map((value, index) => (
                  <span
                    key={index}
                    className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-emerald-700"></div>
            <span className="text-slate-300 text-sm">BST Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-yellow-700"></div>
            <span className="text-slate-300 text-sm">Current/Highlighted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-700"></div>
            <span className="text-slate-300 text-sm">Search Path</span>
          </div>
        </div>

        {/* BST Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="min-h-[500px] overflow-auto">
            {bst ? (
              <svg width="800" height="500" className="mx-auto">
                {renderConnections()}
                {renderNodes()}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Empty BST</h3>
                  <p className="text-slate-400">Insert some nodes or generate a random BST to get started!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">Binary Search Tree Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-3">BST Properties:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Left subtree:</strong> All values &lt; parent</li>
                <li>• <strong>Right subtree:</strong> All values &gt; parent</li>
                <li>• <strong>Inorder traversal:</strong> Gives sorted sequence</li>
                <li>• <strong>Search/Insert/Delete:</strong> O(h) where h is height</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Time Complexities:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Search:</strong> O(log n) average, O(n) worst</li>
                <li>• <strong>Insert:</strong> O(log n) average, O(n) worst</li>
                <li>• <strong>Delete:</strong> O(log n) average, O(n) worst</li>
                <li>• <strong>Space:</strong> O(n) for storage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
