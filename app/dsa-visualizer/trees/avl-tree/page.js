'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.balanceFactor = 0;
    this.id = Math.random().toString(36).substring(2, 9);
  }
}

export default function AVLTreeVisualizer() {
  const [avlTree, setAvlTree] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [operation, setOperation] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotationType, setRotationType] = useState('');
  const [rotatingNodes, setRotatingNodes] = useState([]);
  const [treeHeight, setTreeHeight] = useState(0);
  const [nodeCount, setNodeCount] = useState(0);
  const [balanceInfo, setBalanceInfo] = useState({});
  const [stepByStep, setStepByStep] = useState(false);

  // Get height of node
  const getHeight = (node) => {
    return node ? node.height : 0;
  };

  // Calculate balance factor
  const getBalanceFactor = (node) => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  // Update height and balance factor
  const updateNode = (node) => {
    if (!node) return;
    
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    node.balanceFactor = getBalanceFactor(node);
  };

  // Right rotate
  const rightRotate = async (y) => {
    const x = y.left;
    const T2 = x.right;

    if (stepByStep) {
      setRotationType('Right Rotation');
      setRotatingNodes([y.id, x.id]);
      await sleep(1500);
    }

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    updateNode(y);
    updateNode(x);

    return x;
  };

  // Left rotate
  const leftRotate = async (x) => {
    const y = x.right;
    const T2 = y.left;

    if (stepByStep) {
      setRotationType('Left Rotation');
      setRotatingNodes([x.id, y.id]);
      await sleep(1500);
    }

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    updateNode(x);
    updateNode(y);

    return y;
  };

  // Insert into AVL tree
  const insertAVL = async (root, value) => {
    // 1. Normal BST insertion
    if (!root) {
      const newNode = new AVLNode(value);
      if (stepByStep) {
        setHighlightedNodes([newNode.id]);
        setOperation(`Inserted ${value} as new node`);
        await sleep(1000);
      }
      return newNode;
    }

    if (stepByStep) {
      setHighlightedNodes([root.id]);
      await sleep(800);
    }

    if (value < root.value) {
      root.left = await insertAVL(root.left, value);
    } else if (value > root.value) {
      root.right = await insertAVL(root.right, value);
    } else {
      return root; // Duplicate values not allowed
    }

    // 2. Update height of current node
    updateNode(root);

    // 3. Get balance factor
    const balance = getBalanceFactor(root);

    if (stepByStep) {
      setOperation(`Node ${root.value}: height=${root.height}, balance=${balance}`);
      await sleep(1000);
    }

    // 4. If unbalanced, there are 4 cases

    // Left Left Case
    if (balance > 1 && value < root.left.value) {
      if (stepByStep) {
        setOperation('Left-Left case detected - performing right rotation');
        await sleep(1000);
      }
      return await rightRotate(root);
    }

    // Right Right Case
    if (balance < -1 && value > root.right.value) {
      if (stepByStep) {
        setOperation('Right-Right case detected - performing left rotation');
        await sleep(1000);
      }
      return await leftRotate(root);
    }

    // Left Right Case
    if (balance > 1 && value > root.left.value) {
      if (stepByStep) {
        setOperation('Left-Right case detected - performing left-right rotation');
        await sleep(1000);
      }
      root.left = await leftRotate(root.left);
      return await rightRotate(root);
    }

    // Right Left Case
    if (balance < -1 && value < root.right.value) {
      if (stepByStep) {
        setOperation('Right-Left case detected - performing right-left rotation');
        await sleep(1000);
      }
      root.right = await rightRotate(root.right);
      return await leftRotate(root);
    }

    return root;
  };

  // Find minimum value node
  const findMin = (node) => {
    while (node.left) {
      node = node.left;
    }
    return node;
  };

  // Delete from AVL tree
  const deleteAVL = async (root, value) => {
    if (!root) return root;

    if (value < root.value) {
      root.left = await deleteAVL(root.left, value);
    } else if (value > root.value) {
      root.right = await deleteAVL(root.right, value);
    } else {
      // Node to be deleted found
      if (!root.left || !root.right) {
        const temp = root.left ? root.left : root.right;
        
        if (!temp) {
          root = null;
        } else {
          root = temp;
        }
      } else {
        const temp = findMin(root.right);
        root.value = temp.value;
        root.right = await deleteAVL(root.right, temp.value);
      }
    }

    if (!root) return root;

    // Update height
    updateNode(root);

    // Get balance factor
    const balance = getBalanceFactor(root);

    // Left Left Case
    if (balance > 1 && getBalanceFactor(root.left) >= 0) {
      return await rightRotate(root);
    }

    // Left Right Case
    if (balance > 1 && getBalanceFactor(root.left) < 0) {
      root.left = await leftRotate(root.left);
      return await rightRotate(root);
    }

    // Right Right Case
    if (balance < -1 && getBalanceFactor(root.right) <= 0) {
      return await leftRotate(root);
    }

    // Right Left Case
    if (balance < -1 && getBalanceFactor(root.right) > 0) {
      root.right = await rightRotate(root.right);
      return await leftRotate(root);
    }

    return root;
  };

  // Calculate node positions for visualization
  const calculatePositions = (node, x = 400, y = 50, level = 0, spacing = 200) => {
    if (!node) return {};
    
    const positions = {};
    positions[node.id] = { x, y, level, height: node.height, balance: node.balanceFactor };
    
    const levelSpacing = spacing / Math.pow(1.4, level);
    
    if (node.left) {
      Object.assign(positions, calculatePositions(node.left, x - levelSpacing, y + 80, level + 1, spacing));
    }
    
    if (node.right) {
      Object.assign(positions, calculatePositions(node.right, x + levelSpacing, y + 80, level + 1, spacing));
    }
    
    return positions;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Handle operations
  const handleInsert = async () => {
    if (!inputValue) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    setRotationType('');
    setRotatingNodes([]);
    
    if (!avlTree) {
      const newRoot = new AVLNode(value);
      setAvlTree(newRoot);
      setOperation(`Inserted ${value} as root`);
    } else {
      const newTree = await insertAVL(avlTree, value);
      setAvlTree({ ...newTree });
      setOperation(`Inserted ${value} into AVL tree`);
    }
    
    setInputValue('');
    setHighlightedNodes([]);
    setRotatingNodes([]);
    setRotationType('');
    setIsAnimating(false);
  };

  const handleDelete = async () => {
    if (!inputValue || !avlTree) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    
    const newTree = await deleteAVL(avlTree, value);
    setAvlTree(newTree);
    setOperation(`Deleted ${value} from AVL tree`);
    setInputValue('');
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const generateRandomAVL = async () => {
    const values = [50, 25, 75, 10, 30, 60, 80, 5, 15, 27, 35];
    let newTree = null;
    
    setIsAnimating(true);
    
    for (const value of values) {
      if (!newTree) {
        newTree = new AVLNode(value);
      } else {
        newTree = await insertAVL(newTree, value);
      }
      setAvlTree({ ...newTree });
      await sleep(300);
    }
    
    setOperation('Generated random AVL tree');
    setIsAnimating(false);
  };

  const clearTree = () => {
    setAvlTree(null);
    setHighlightedNodes([]);
    setOperation('');
    setRotationType('');
    setRotatingNodes([]);
  };

  // Count nodes
  const countNodes = (node) => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  // Calculate tree height
  const calculateTreeHeight = (node) => {
    if (!node) return 0;
    return 1 + Math.max(calculateTreeHeight(node.left), calculateTreeHeight(node.right));
  };

  // Update positions and stats when tree changes
  useEffect(() => {
    if (avlTree) {
      const positions = calculatePositions(avlTree);
      setNodePositions(positions);
      setTreeHeight(calculateTreeHeight(avlTree));
      setNodeCount(countNodes(avlTree));
      
      // Collect balance info
      const balanceData = {};
      const traverse = (node) => {
        if (!node) return;
        balanceData[node.id] = {
          height: node.height,
          balance: node.balanceFactor,
          isBalanced: Math.abs(node.balanceFactor) <= 1
        };
        traverse(node.left);
        traverse(node.right);
      };
      traverse(avlTree);
      setBalanceInfo(balanceData);
    } else {
      setNodePositions({});
      setTreeHeight(0);
      setNodeCount(0);
      setBalanceInfo({});
    }
  }, [avlTree]);

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
    
    if (avlTree) traverse(avlTree);
    return connections;
  };

  // Render tree nodes
  const renderNodes = () => {
    const nodes = [];
    
    const traverse = (node) => {
      if (!node) return;
      
      const pos = nodePositions[node.id];
      const balance = balanceInfo[node.id];
      const isHighlighted = highlightedNodes.includes(node.id);
      const isRotating = rotatingNodes.includes(node.id);
      const isUnbalanced = balance && !balance.isBalanced;
      
      // Node color based on balance
      let nodeColor = '#8b5cf6'; // Default purple
      if (isUnbalanced) nodeColor = '#ef4444'; // Red for unbalanced
      if (isHighlighted) nodeColor = '#f59e0b'; // Yellow for highlighted
      if (isRotating) nodeColor = '#10b981'; // Green for rotating
      
      nodes.push(
        <g key={node.id} className="transition-all duration-300">
          <circle
            cx={pos.x}
            cy={pos.y}
            r="25"
            fill={nodeColor}
            stroke={isUnbalanced ? '#dc2626' : isHighlighted ? '#d97706' : '#7c3aed'}
            strokeWidth="3"
            className={`transition-all duration-300 hover:scale-110 cursor-pointer ${isRotating ? 'animate-pulse' : ''}`}
          />
          <text
            x={pos.x}
            y={pos.y + 2}
            textAnchor="middle"
            className="fill-white font-bold text-sm pointer-events-none"
          >
            {node.value}
          </text>
          
          {/* Height and balance factor labels */}
          <text
            x={pos.x - 35}
            y={pos.y - 35}
            textAnchor="middle"
            className="fill-blue-400 font-semibold text-xs"
          >
            h:{node.height}
          </text>
          <text
            x={pos.x + 35}
            y={pos.y - 35}
            textAnchor="middle"
            className={`font-semibold text-xs ${isUnbalanced ? 'fill-red-400' : 'fill-green-400'}`}
          >
            b:{node.balanceFactor}
          </text>
        </g>
      );
      
      traverse(node.left);
      traverse(node.right);
    };
    
    if (avlTree) traverse(avlTree);
    return nodes;
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center theme-accent hover:theme-text-secondary mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AVL Tree Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            AVL Tree is a self-balancing binary search tree where the heights of the two child subtrees of any node 
            differ by at most one. Automatic rotations maintain balance for guaranteed O(log n) operations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Tree Height</h3>
            <p className="theme-accent text-2xl font-bold">{treeHeight}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Node Count</h3>
            <p className="text-pink-400 text-2xl font-bold">{nodeCount}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Current Operation</h3>
            <p className="text-blue-400 text-sm">{operation || 'None'}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Rotation Type</h3>
            <p className="text-green-400 text-sm">{rotationType || 'None'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Insert/Delete */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">AVL Operations</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
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
                  disabled={isAnimating || !inputValue || !avlTree}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Animation Control */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Animation</h3>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="stepByStep"
                  checked={stepByStep}
                  onChange={(e) => setStepByStep(e.target.checked)}
                  className="w-4 h-4 text-purple-600 theme-surface-elevated border-slate-600 rounded focus:ring-blue-500"
                  disabled={isAnimating}
                />
                <label htmlFor="stepByStep" className="text-slate-300 text-sm">
                  Step-by-step animation
                </label>
              </div>
              <p className="text-slate-400 text-xs">
                Enable to see detailed rotation process
              </p>
            </div>

            {/* Tree Management */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Tree Management</h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={generateRandomAVL}
                  disabled={isAnimating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  🎲 Random AVL
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

            {/* Balance Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Balance Status</h3>
              <div className="text-sm text-slate-300">
                <p>• h: height of node</p>
                <p>• b: balance factor</p>
                <p>• |b| ≤ 1 for AVL property</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-purple-700"></div>
            <span className="text-slate-300 text-sm">Balanced Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-red-700"></div>
            <span className="text-slate-300 text-sm">Unbalanced Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-yellow-700"></div>
            <span className="text-slate-300 text-sm">Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-emerald-700"></div>
            <span className="text-slate-300 text-sm">Rotating Node</span>
          </div>
        </div>

        {/* AVL Tree Visualization */}
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="min-h-[500px] overflow-auto">
            {avlTree ? (
              <svg width="800" height="500" className="mx-auto">
                {renderConnections()}
                {renderNodes()}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚖️</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Empty AVL Tree</h3>
                  <p className="text-slate-400">Insert some nodes or generate a random AVL tree to get started!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-8 theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-4">AVL Tree Rotations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold theme-accent mb-3">Rotation Cases:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Left-Left:</strong> Right rotation</li>
                <li>• <strong>Right-Right:</strong> Left rotation</li>
                <li>• <strong>Left-Right:</strong> Left-Right rotation</li>
                <li>• <strong>Right-Left:</strong> Right-Left rotation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pink-400 mb-3">AVL Properties:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• Balance factor: height(left) - height(right)</li>
                <li>• Valid balance factors: -1, 0, 1</li>
                <li>• Guaranteed O(log n) height</li>
                <li>• Automatic rebalancing after operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
