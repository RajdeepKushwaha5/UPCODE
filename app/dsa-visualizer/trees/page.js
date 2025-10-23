'use client';
import Link from 'next/link';

export default function TreesVisualizer() {
  const treeAlgorithms = [
    {
      title: "Binary Tree",
      description: "Basic tree structure with at most two children per node",
      complexity: { time: "O(n)", space: "O(h)" },
      path: "/dsa-visualizer/trees/binary-tree",
      difficulty: "Easy",
      concepts: ["Tree Basics", "Parent-Child", "Leaf Nodes", "Tree Height"]
    },
    {
      title: "Binary Search Tree",
      description: "Ordered binary tree for efficient searching and sorting",
      complexity: { time: "O(log n)", space: "O(h)" },
      path: "/dsa-visualizer/trees/binary-search-tree",
      difficulty: "Medium",
      concepts: ["BST Property", "In-order Traversal", "Search Efficiency"]
    },
    {
      title: "AVL Tree",
      description: "Self-balancing binary search tree with height balance",
      complexity: { time: "O(log n)", space: "O(log n)" },
      path: "/dsa-visualizer/trees/avl-tree",
      difficulty: "Hard",
      concepts: ["Self-Balancing", "Rotations", "Balance Factor"]
    },
    {
      title: "Heap",
      description: "Complete binary tree with heap property for priority queues",
      complexity: { time: "O(log n)", space: "O(1)" },
      path: "/dsa-visualizer/trees/heap",
      difficulty: "Medium",
      concepts: ["Complete Tree", "Heap Property", "Priority Queue"]
    },
    {
      title: "Tree Traversals",
      description: "Different algorithms to visit and process tree nodes",
      complexity: { time: "O(n)", space: "O(h)" },
      path: "/dsa-visualizer/trees/traversals",
      difficulty: "Easy",
      concepts: ["Inorder", "Preorder", "Postorder", "Level Order"]
    },
    {
      title: "Red-Black Tree",
      description: "Self-balancing binary search tree with color-coding",
      complexity: { time: "O(log n)", space: "O(log n)" },
      path: "/dsa-visualizer/trees/red-black-tree",
      difficulty: "Hard",
      concepts: ["Color Coding", "Red-Black Properties", "Balanced Height"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Tree Data Structures Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Master hierarchical data structures with interactive visualizations. Understand how trees organize data, 
            enable efficient operations, and form the foundation for advanced algorithms and data management.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Total Algorithms</h3>
            <p className="text-3xl font-bold text-green-400">{treeAlgorithms.length}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Tree Types</h3>
            <p className="text-3xl font-bold text-teal-400">5</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Difficulty Range</h3>
            <p className="text-lg text-slate-300">Easy - Hard</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Key Concepts</h3>
            <p className="text-lg text-slate-300">Hierarchical Structure</p>
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {treeAlgorithms.map((algorithm, index) => (
            <Link 
              key={index}
              href={algorithm.path}
              className="group theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-200">
                  {algorithm.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  algorithm.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                  algorithm.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {algorithm.difficulty}
                </span>
              </div>
              
              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                {algorithm.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Time Complexity:</span>
                  <span className="text-green-400 font-mono">{algorithm.complexity.time}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Space Complexity:</span>
                  <span className="text-teal-400 font-mono">{algorithm.complexity.space}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {algorithm.concepts.map((concept, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 theme-surface-elevated/50 text-slate-300 rounded text-xs"
                  >
                    {concept}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <span>Explore Visualization</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Tree Structure Fundamentals */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🌳</span>
              Tree Terminology
            </h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• <strong>Root:</strong> Top node with no parent</li>
              <li>• <strong>Leaf:</strong> Node with no children</li>
              <li>• <strong>Height:</strong> Longest path from root to leaf</li>
              <li>• <strong>Depth:</strong> Distance from root to a node</li>
              <li>• <strong>Subtree:</strong> Tree formed by a node and its descendants</li>
            </ul>
          </div>
          <div className="theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">⚡</span>
              Common Operations
            </h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• <strong>Insert:</strong> Add new nodes while maintaining structure</li>
              <li>• <strong>Delete:</strong> Remove nodes and reorganize tree</li>
              <li>• <strong>Search:</strong> Find specific values efficiently</li>
              <li>• <strong>Traverse:</strong> Visit all nodes in specific order</li>
              <li>• <strong>Balance:</strong> Maintain optimal tree shape</li>
            </ul>
          </div>
        </div>

        {/* Learning Path */}
        <div className="theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-2xl font-semibold text-white mb-4">📚 Recommended Learning Path</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h3 className="font-medium text-white">Master Binary Tree Basics</h3>
                <p className="text-slate-300 text-sm">Learn fundamental tree concepts, terminology, and basic operations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <h3 className="font-medium text-white">Explore Tree Traversals</h3>
                <p className="text-slate-300 text-sm">Understand different ways to visit nodes: inorder, preorder, postorder, level-order.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div>
                <h3 className="font-medium text-white">Learn Binary Search Trees</h3>
                <p className="text-slate-300 text-sm">Master ordered trees and their search, insertion, and deletion operations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <div>
                <h3 className="font-medium text-white">Understand Heaps</h3>
                <p className="text-slate-300 text-sm">Explore complete trees with heap property for priority queue implementations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
              <div>
                <h3 className="font-medium text-white">Advanced: Self-Balancing Trees</h3>
                <p className="text-slate-300 text-sm">Master AVL and Red-Black trees for guaranteed logarithmic operations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
