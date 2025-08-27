'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function TreeTraversalsVisualizer() {
  const [tree, setTree] = useState(null);
  const [traversalType, setTraversalType] = useState('inorder');
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [traversalResult, setTraversalResult] = useState([]);
  const [speed, setSpeed] = useState(800);
  const [isInitialized, setIsInitialized] = useState(false);

  // Tree node class
  class TreeNode {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
      this.x = 0;
      this.y = 0;
    }
  }

  // Create a sample binary tree
  const createSampleTree = useCallback(() => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.left = new TreeNode(6);
    root.right.right = new TreeNode(7);
    
    // Calculate positions for visualization
    const calculatePositions = (node, x, y, offset) => {
      if (!node) return;
      node.x = x;
      node.y = y;
      if (node.left) calculatePositions(node.left, x - offset, y + 80, offset / 2);
      if (node.right) calculatePositions(node.right, x + offset, y + 80, offset / 2);
    };
    
    calculatePositions(root, 400, 50, 150);
    return root;
  }, []);

  // Traversal algorithms
  const inorderTraversal = useCallback(async (node, result = []) => {
    if (!node) return result;
    
    await inorderTraversal(node.left, result);
    
    setCurrentNode(node.val);
    setVisitedNodes(prev => [...prev, node.val]);
    result.push(node.val);
    setTraversalResult([...result]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    await inorderTraversal(node.right, result);
    return result;
  }, [speed]);

  const preorderTraversal = useCallback(async (node, result = []) => {
    if (!node) return result;
    
    setCurrentNode(node.val);
    setVisitedNodes(prev => [...prev, node.val]);
    result.push(node.val);
    setTraversalResult([...result]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    await preorderTraversal(node.left, result);
    await preorderTraversal(node.right, result);
    return result;
  }, [speed]);

  const postorderTraversal = useCallback(async (node, result = []) => {
    if (!node) return result;
    
    await postorderTraversal(node.left, result);
    await postorderTraversal(node.right, result);
    
    setCurrentNode(node.val);
    setVisitedNodes(prev => [...prev, node.val]);
    result.push(node.val);
    setTraversalResult([...result]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    return result;
  }, [speed]);

  const levelorderTraversal = useCallback(async (root) => {
    if (!root) return [];
    
    const queue = [root];
    const result = [];
    
    while (queue.length > 0) {
      const node = queue.shift();
      
      setCurrentNode(node.val);
      setVisitedNodes(prev => [...prev, node.val]);
      result.push(node.val);
      setTraversalResult([...result]);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  }, [speed]);

  const startTraversal = async () => {
    if (isTraversing || !tree) return;
    
    setIsTraversing(true);
    setCurrentNode(null);
    setVisitedNodes([]);
    setTraversalResult([]);
    
    try {
      switch (traversalType) {
        case 'inorder':
          await inorderTraversal(tree);
          break;
        case 'preorder':
          await preorderTraversal(tree);
          break;
        case 'postorder':
          await postorderTraversal(tree);
          break;
        case 'levelorder':
          await levelorderTraversal(tree);
          break;
      }
    } finally {
      setCurrentNode(null);
      setIsTraversing(false);
    }
  };

  const reset = () => {
    setIsTraversing(false);
    setCurrentNode(null);
    setVisitedNodes([]);
    setTraversalResult([]);
  };

  useEffect(() => {
    if (!isInitialized) {
      setTree(createSampleTree());
      setIsInitialized(true);
    }
  }, [createSampleTree]);

  const getNodeColor = (nodeVal) => {
    if (currentNode === nodeVal) return 'fill-yellow-400 stroke-yellow-600';
    if (visitedNodes.includes(nodeVal)) return 'fill-green-400 stroke-green-600';
    return 'fill-purple-400 stroke-purple-600';
  };

  const renderTree = (node) => {
    if (!node) return null;
    
    return (
      <g key={node.val}>
        {/* Edges */}
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#6B7280"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="#6B7280"
            strokeWidth="2"
          />
        )}
        
        {/* Node circle */}
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          className={`${getNodeColor(node.val)} stroke-2 transition-all duration-300`}
        />
        
        {/* Node value */}
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-bold text-lg"
        >
          {node.val}
        </text>
        
        {/* Recursively render children */}
        {node.left && renderTree(node.left)}
        {node.right && renderTree(node.right)}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer/trees" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors duration-200">
            ← Back to Trees
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Tree Traversals Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Explore different ways to visit all nodes in a binary tree: Inorder (left-root-right), 
            Preorder (root-left-right), Postorder (left-right-root), and Level-order (breadth-first).
          </p>
        </div>

        {/* Algorithm Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Traversal Type</h3>
            <select
              value={traversalType}
              onChange={(e) => setTraversalType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500"
            >
              <option value="inorder">Inorder (L-Root-R)</option>
              <option value="preorder">Preorder (Root-L-R)</option>
              <option value="postorder">Postorder (L-R-Root)</option>
              <option value="levelorder">Level-order (BFS)</option>
            </select>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Speed</h3>
            <input
              type="range"
              min="200"
              max="2000"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-slate-400 text-sm mt-1">{speed}ms</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Visited Nodes</h3>
            <p className="text-purple-400 text-2xl font-bold">{visitedNodes.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Controls</h3>
            <div className="flex gap-2">
              <button
                onClick={startTraversal}
                disabled={isTraversing}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200"
              >
                Start
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 mb-8">
          <svg width="800" height="350" className="mx-auto">
            {tree && renderTree(tree)}
          </svg>
          
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Unvisited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-slate-300">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">Visited</span>
            </div>
          </div>
        </div>

        {/* Traversal Result */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Traversal Result</h3>
          <div className="flex flex-wrap gap-2">
            {traversalResult.map((val, index) => (
              <div
                key={index}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg font-mono"
              >
                {val}
              </div>
            ))}
          </div>
          {traversalResult.length === 0 && (
            <p className="text-slate-400">Click "Start" to begin traversal</p>
          )}
        </div>

        {/* Algorithm Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Traversal Types</h3>
            <div className="space-y-4 text-slate-300">
              <div>
                <h4 className="font-semibold text-purple-400">Inorder (L-Root-R)</h4>
                <p className="text-sm">Left subtree → Root → Right subtree</p>
                <p className="text-xs text-slate-400">Result: 4, 2, 5, 1, 6, 3, 7</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400">Preorder (Root-L-R)</h4>
                <p className="text-sm">Root → Left subtree → Right subtree</p>
                <p className="text-xs text-slate-400">Result: 1, 2, 4, 5, 3, 6, 7</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400">Postorder (L-R-Root)</h4>
                <p className="text-sm">Left subtree → Right subtree → Root</p>
                <p className="text-xs text-slate-400">Result: 4, 5, 2, 6, 7, 3, 1</p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400">Level-order (BFS)</h4>
                <p className="text-sm">Visit nodes level by level</p>
                <p className="text-xs text-slate-400">Result: 1, 2, 3, 4, 5, 6, 7</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Applications</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• <strong>Inorder:</strong> Get sorted values from BST</li>
              <li>• <strong>Preorder:</strong> Create copy of tree, prefix expressions</li>
              <li>• <strong>Postorder:</strong> Delete tree, postfix expressions</li>
              <li>• <strong>Level-order:</strong> Print tree by levels, BFS</li>
              <li>• <strong>Time Complexity:</strong> O(n) for all traversals</li>
              <li>• <strong>Space Complexity:</strong> O(h) where h is height</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
