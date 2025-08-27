'use client';
import Link from 'next/link';

export default function LinkedListsVisualizer() {
  const linkedListAlgorithms = [
    {
      title: "Singly Linked List",
      description: "Basic linked list with forward traversal and operations",
      complexity: { time: "O(n)", space: "O(1)" },
      path: "/dsa-visualizer/linked-lists/singly-linked-list",
      difficulty: "Easy",
      concepts: ["Node Structure", "Insert Operations", "Delete Operations", "Search"]
    },
    {
      title: "Doubly Linked List",
      description: "Bidirectional linked list with forward and backward traversal",
      complexity: { time: "O(n)", space: "O(1)" },
      path: "/dsa-visualizer/linked-lists/doubly-linked-list",
      difficulty: "Medium",
      concepts: ["Bidirectional Links", "Previous Pointers", "Efficient Deletion"]
    },
    {
      title: "Circular Linked List",
      description: "Linked list where the last node points back to the first",
      complexity: { time: "O(n)", space: "O(1)" },
      path: "/dsa-visualizer/linked-lists/circular-linked-list",
      difficulty: "Medium",
      concepts: ["Circular Structure", "Loop Detection", "Tail-to-Head Connection"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Linked Lists Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Master linked list data structures with interactive visualizations. Understand how nodes are connected, 
            how operations work, and the differences between various linked list types.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Total Algorithms</h3>
            <p className="text-3xl font-bold text-blue-400">{linkedListAlgorithms.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
            <p className="text-3xl font-bold text-cyan-400">3</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Difficulty Range</h3>
            <p className="text-lg text-slate-300">Easy - Medium</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Key Concepts</h3>
            <p className="text-lg text-slate-300">Pointers & Nodes</p>
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {linkedListAlgorithms.map((algorithm, index) => (
            <Link 
              key={index}
              href={algorithm.path}
              className="group bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                  {algorithm.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  algorithm.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                  'bg-yellow-500/20 text-yellow-400'
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
                  <span className="text-blue-400 font-mono">{algorithm.complexity.time}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Space Complexity:</span>
                  <span className="text-cyan-400 font-mono">{algorithm.complexity.space}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {algorithm.concepts.map((concept, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs"
                  >
                    {concept}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex items-center text-blue-400 text-sm">
                <span>Explore Visualization</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Learning Path */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-2xl font-semibold text-white mb-4">📚 Recommended Learning Path</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h3 className="font-medium text-white">Start with Singly Linked List</h3>
                <p className="text-slate-300 text-sm">Learn the fundamentals of linked lists, node structure, and basic operations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <h3 className="font-medium text-white">Progress to Doubly Linked List</h3>
                <p className="text-slate-300 text-sm">Understand bidirectional traversal and more complex pointer management.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div>
                <h3 className="font-medium text-white">Master Circular Linked List</h3>
                <p className="text-slate-300 text-sm">Explore circular structures and their unique properties and use cases.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
