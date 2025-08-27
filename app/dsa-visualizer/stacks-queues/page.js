'use client';
import Link from 'next/link';

export default function StacksQueuesVisualizer() {
  const algorithms = [
    {
      title: "Stack Operations",
      description: "LIFO data structure with push, pop, and peek operations",
      complexity: { time: "O(1)", space: "O(n)" },
      path: "/dsa-visualizer/stacks-queues/stack",
      difficulty: "Easy",
      concepts: ["LIFO", "Push", "Pop", "Peek", "Stack Overflow"]
    },
    {
      title: "Queue Operations",
      description: "FIFO data structure with enqueue and dequeue operations",
      complexity: { time: "O(1)", space: "O(n)" },
      path: "/dsa-visualizer/stacks-queues/queue",
      difficulty: "Easy",
      concepts: ["FIFO", "Enqueue", "Dequeue", "Front", "Rear"]
    },
    {
      title: "Priority Queue",
      description: "Queue where elements are served based on priority",
      complexity: { time: "O(log n)", space: "O(n)" },
      path: "/dsa-visualizer/stacks-queues/priority-queue",
      difficulty: "Medium",
      concepts: ["Priority", "Heap", "Extract Max", "Binary Heap"]
    },
    {
      title: "Double-ended Queue",
      description: "Queue that allows insertion and deletion from both ends",
      complexity: { time: "O(1)", space: "O(n)" },
      path: "/dsa-visualizer/stacks-queues/deque",
      difficulty: "Medium",
      concepts: ["Deque", "Front Operations", "Rear Operations", "Bidirectional"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
            Stacks & Queues Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Master LIFO and FIFO data structures with interactive visualizations. Understand how elements are added 
            and removed, and explore different types of stacks and queues used in computer science.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Total Algorithms</h3>
            <p className="text-3xl font-bold text-orange-400">{algorithms.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Data Structures</h3>
            <p className="text-3xl font-bold text-red-400">2</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Difficulty Range</h3>
            <p className="text-lg text-slate-300">Easy - Medium</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Key Concepts</h3>
            <p className="text-lg text-slate-300">LIFO & FIFO</p>
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {algorithms.map((algorithm, index) => (
            <Link 
              key={index}
              href={algorithm.path}
              className="group bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
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
                  <span className="text-orange-400 font-mono">{algorithm.complexity.time}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Space Complexity:</span>
                  <span className="text-red-400 font-mono">{algorithm.complexity.space}</span>
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
              
              <div className="mt-4 flex items-center text-orange-400 text-sm">
                <span>Explore Visualization</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Stack (LIFO)
            </h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• Last In, First Out principle</li>
              <li>• Operations: Push, Pop, Peek/Top</li>
              <li>• Use cases: Function calls, undo operations</li>
              <li>• Memory: Call stack, expression evaluation</li>
            </ul>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">➡️</span>
              Queue (FIFO)
            </h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• First In, First Out principle</li>
              <li>• Operations: Enqueue, Dequeue, Front</li>
              <li>• Use cases: Task scheduling, breadth-first search</li>
              <li>• Systems: CPU scheduling, printer queues</li>
            </ul>
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-2xl font-semibold text-white mb-4">📚 Recommended Learning Path</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h3 className="font-medium text-white">Master Stack Operations</h3>
                <p className="text-slate-300 text-sm">Learn LIFO principles, push/pop operations, and stack overflow concepts.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <h3 className="font-medium text-white">Understand Queue Operations</h3>
                <p className="text-slate-300 text-sm">Explore FIFO behavior, enqueue/dequeue operations, and queue applications.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div>
                <h3 className="font-medium text-white">Explore Priority Queue</h3>
                <p className="text-slate-300 text-sm">Learn about priority-based processing and heap-based implementations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <div>
                <h3 className="font-medium text-white">Advanced: Double-ended Queue</h3>
                <p className="text-slate-300 text-sm">Master bidirectional operations and deque applications in algorithms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
