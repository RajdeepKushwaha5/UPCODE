'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
    this.id = Math.random().toString(36).substring(2, 9);
  }
}

export default function BinaryTreeVisualizer() {
  const [tree, setTree] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [operation, setOperation] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [traversalResult, setTraversalResult] = useState([]);
  const [currentTraversal, setCurrentTraversal] = useState(null);
  const [searchTarget, setSearchTarget] = useState('');
  const [searchPath, setSearchPath] = useState([]);
  const [treeHeight, setTreeHeight] = useState(0);
  const [nodeCount, setNodeCount] = useState(0);

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

  // Calculate node positions for visualization
  const calculatePositions = (node, x = 400, y = 50, level = 0, spacing = 200) => {
    if (!node) return {};
    
    const positions = {};
    positions[node.id] = { x, y, level };
    
    const levelSpacing = spacing / Math.pow(1.5, level);
    
    if (node.left) {
      Object.assign(positions, calculatePositions(node.left, x - levelSpacing, y + 80, level + 1, spacing));
    }
    
    if (node.right) {
      Object.assign(positions, calculatePositions(node.right, x + levelSpacing, y + 80, level + 1, spacing));
    }
    
    return positions;
  };

  // Insert node
  const insertNode = (root, value) => {
    if (!root) return new TreeNode(value);
    
    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value);
    }
    
    return root;
  };

  // Search node
  const searchNode = async (root, value, path = []) => {
    if (!root) return { found: false, path };
    
    path.push(root.id);
    setSearchPath([...path]);
    setHighlightedNodes([root.id]);
    await sleep(800);
    
    if (root.value === value) {
      return { found: true, path, node: root };
    }
    
    if (value < root.value) {
      return searchNode(root.left, value, path);
    } else {
      return searchNode(root.right, value, path);
    }
  };

  // Delete node
  const deleteNode = (root, value) => {
    if (!root) return null;
    
    if (value < root.value) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value);
    } else {
      // Node to be deleted found
      if (!root.left) return root.right;
      if (!root.right) return root.left;
      
      // Node with two children: Get the inorder successor
      let minRight = root.right;
      while (minRight.left) {
        minRight = minRight.left;
      }
      
      root.value = minRight.value;
      root.right = deleteNode(root.right, minRight.value);
    }
    
    return root;
  };

  // Traversal algorithms
  const inorderTraversal = async (node, result = []) => {
    if (!node) return result;
    
    await inorderTraversal(node.left, result);
    
    setHighlightedNodes([node.id]);
    result.push(node.value);
    setTraversalResult([...result]);
    await sleep(1000);
    
    await inorderTraversal(node.right, result);
    
    return result;
  };

  const preorderTraversal = async (node, result = []) => {
    if (!node) return result;
    
    setHighlightedNodes([node.id]);
    result.push(node.value);
    setTraversalResult([...result]);
    await sleep(1000);
    
    await preorderTraversal(node.left, result);
    await preorderTraversal(node.right, result);
    
    return result;
  };

  const postorderTraversal = async (node, result = []) => {
    if (!node) return result;
    
    await postorderTraversal(node.left, result);
    await postorderTraversal(node.right, result);
    
    setHighlightedNodes([node.id]);
    result.push(node.value);
    setTraversalResult([...result]);
    await sleep(1000);
    
    return result;
  };

  const levelOrderTraversal = async (root) => {
    if (!root) return [];
    
    const queue = [root];
    const result = [];
    
    while (queue.length > 0) {
      const node = queue.shift();
      
      setHighlightedNodes([node.id]);
      result.push(node.value);
      setTraversalResult([...result]);
      await sleep(1000);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Handle operations
  const handleInsert = async () => {
    if (!inputValue) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    
    if (!tree) {
      const newRoot = new TreeNode(value);
      setTree(newRoot);
    } else {
      const newTree = insertNode(tree, value);
      setTree({ ...newTree });
    }
    
    setInputValue('');
    setIsAnimating(false);
  };

  const handleSearch = async () => {
    if (!searchTarget || !tree) return;
    
    const value = parseInt(searchTarget);
    setIsAnimating(true);
    setSearchPath([]);
    
    const result = await searchNode(tree, value);
    
    if (result.found) {
      setOperation(`Found ${value}!`);
    } else {
      setOperation(`${value} not found in tree`);
    }
    
    setIsAnimating(false);
  };

  const handleDelete = () => {
    if (!inputValue || !tree) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    
    const newTree = deleteNode(tree, value);
    setTree(newTree);
    setInputValue('');
    setIsAnimating(false);
  };

  const handleTraversal = async (type) => {
    if (!tree) return;
    
    setIsAnimating(true);
    setTraversalResult([]);
    setCurrentTraversal(type);
    
    let result = [];
    switch (type) {
      case 'inorder':
        result = await inorderTraversal(tree);
        break;
      case 'preorder':
        result = await preorderTraversal(tree);
        break;
      case 'postorder':
        result = await postorderTraversal(tree);
        break;
      case 'levelorder':
        result = await levelOrderTraversal(tree);
        break;
    }
    
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const generateRandomTree = () => {
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
    let newTree = null;
    
    values.forEach(value => {
      if (!newTree) {
        newTree = new TreeNode(value);
      } else {
        insertNode(newTree, value);
      }
    });
    
    setTree(newTree);
    setHighlightedNodes([]);
    setTraversalResult([]);
    setSearchPath([]);
    setOperation('');
  };

  const clearTree = () => {
    setTree(null);
    setHighlightedNodes([]);
    setTraversalResult([]);
    setSearchPath([]);
    setOperation('');
  };

  // Update positions and stats when tree changes
  useEffect(() => {
    if (tree) {
      const positions = calculatePositions(tree);
      setNodePositions(positions);
      setTreeHeight(calculateHeight(tree));
      setNodeCount(countNodes(tree));
    } else {
      setNodePositions({});
      setTreeHeight(0);
      setNodeCount(0);
    }
  }, [tree]);

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
    
    if (tree) traverse(tree);
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
            fill={isHighlighted ? '#f59e0b' : isInSearchPath ? '#3b82f6' : '#8b5cf6'}
            stroke={isHighlighted ? '#d97706' : isInSearchPath ? '#2563eb' : '#7c3aed'}
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
    
    if (tree) traverse(tree);
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Binary Tree Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            A binary tree is a hierarchical data structure where each node has at most two children (left and right). 
            Explore insertions, deletions, searches, and various tree traversals.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Tree Height</h3>
            <p className="text-purple-400 text-2xl font-bold">{treeHeight}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Node Count</h3>
            <p className="text-pink-400 text-2xl font-bold">{nodeCount}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Current Operation</h3>
            <p className="text-blue-400 text-sm">{operation || 'None'}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Traversal</h3>
            <p className="text-green-400 text-sm">{currentTraversal || 'None'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Insert/Delete */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Tree Operations</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
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
                  disabled={isAnimating || !inputValue || !tree}
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                  disabled={isAnimating}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isAnimating || !searchTarget || !tree}
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
                  onClick={generateRandomTree}
                  disabled={isAnimating}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  🎲 Random Tree
                </button>
                <button
                  onClick={clearTree}
                  disabled={isAnimating}
                  className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  🗑️ Clear Tree
                </button>
              </div>
            </div>
          </div>

          {/* Traversals */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-3">Tree Traversals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleTraversal('inorder')}
                disabled={isAnimating || !tree}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 font-semibold disabled:opacity-50"
              >
                Inorder
              </button>
              <button
                onClick={() => handleTraversal('preorder')}
                disabled={isAnimating || !tree}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 font-semibold disabled:opacity-50"
              >
                Preorder
              </button>
              <button
                onClick={() => handleTraversal('postorder')}
                disabled={isAnimating || !tree}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 font-semibold disabled:opacity-50"
              >
                Postorder
              </button>
              <button
                onClick={() => handleTraversal('levelorder')}
                disabled={isAnimating || !tree}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 font-semibold disabled:opacity-50"
              >
                Level Order
              </button>
            </div>
          </div>

          {/* Traversal Result */}
          {traversalResult.length > 0 && (
            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Traversal Result ({currentTraversal}):</h4>
              <div className="flex flex-wrap gap-2">
                {traversalResult.map((value, index) => (
                  <span
                    key={index}
                    className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
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
            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-purple-700"></div>
            <span className="text-slate-300 text-sm">Normal Node</span>
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

        {/* Tree Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="min-h-[500px] overflow-auto">
            {tree ? (
              <svg width="800" height="500" className="mx-auto">
                {renderConnections()}
                {renderNodes()}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌳</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Empty Tree</h3>
                  <p className="text-slate-400">Insert some nodes or generate a random tree to get started!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">Binary Tree Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-3">Traversal Types:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Inorder:</strong> Left → Root → Right</li>
                <li>• <strong>Preorder:</strong> Root → Left → Right</li>
                <li>• <strong>Postorder:</strong> Left → Right → Root</li>
                <li>• <strong>Level Order:</strong> Level by level (BFS)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pink-400 mb-3">Key Properties:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• Hierarchical data structure</li>
                <li>• Each node has at most 2 children</li>
                <li>• Root node at the top</li>
                <li>• Leaf nodes have no children</li>
                <li>• Used in expression parsing, Huffman coding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
