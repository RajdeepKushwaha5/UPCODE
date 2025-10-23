'use client';
import Link from 'next/link';

export default function GraphsVisualizer() {
  const algorithms = [
    {
      title: "Depth First Search",
      description: "Explore graph vertices by going as deep as possible before backtracking",
      complexity: { time: "O(V + E)", space: "O(V)" },
      path: "/dsa-visualizer/graphs/depth-first-search",
      difficulty: "Medium",
      concepts: ["DFS", "Stack", "Recursion", "Backtracking", "Visited Nodes"]
    },
    {
      title: "Breadth First Search",
      description: "Explore graph vertices level by level using a queue",
      complexity: { time: "O(V + E)", space: "O(V)" },
      path: "/dsa-visualizer/graphs/breadth-first-search",
      difficulty: "Medium",
      concepts: ["BFS", "Queue", "Level Order", "Shortest Path", "Unweighted"]
    },
    {
      title: "Dijkstra's Algorithm",
      description: "Find shortest paths from a source vertex to all other vertices",
      complexity: { time: "O((V + E) log V)", space: "O(V)" },
      path: "/dsa-visualizer/graphs/dijkstra-algorithm",
      difficulty: "Hard",
      concepts: ["Shortest Path", "Priority Queue", "Weighted Graph", "Greedy"]
    },
    {
      title: "Kruskal's MST",
      description: "Find minimum spanning tree using edge sorting and union-find",
      complexity: { time: "O(E log E)", space: "O(V)" },
      path: "/dsa-visualizer/graphs/kruskal-algorithm",
      difficulty: "Hard",
      concepts: ["MST", "Union Find", "Edge Sorting", "Greedy", "Cycle Detection"]
    },
    {
      title: "Prim's MST",
      description: "Find minimum spanning tree by growing tree from a vertex",
      complexity: { time: "O(E log V)", space: "O(V)" },
      path: "/dsa-visualizer/graphs/prim-algorithm",
      difficulty: "Hard",
      concepts: ["MST", "Priority Queue", "Cut Property", "Greedy"]
    },
    {
      title: "Floyd-Warshall",
      description: "Find shortest paths between all pairs of vertices",
      complexity: { time: "O(V³)", space: "O(V²)" },
      path: "/dsa-visualizer/graphs/floyd-warshall-algorithm",
      difficulty: "Hard",
      concepts: ["All Pairs", "Dynamic Programming", "Transitive Closure"]
    }
  ];

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="inline-flex items-center theme-accent hover:theme-text-secondary mb-4 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Graph Algorithms Visualization
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Master graph algorithms with interactive visualizations. Explore traversal techniques, shortest path algorithms, 
            and minimum spanning tree construction with step-by-step animations.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Total Algorithms</h3>
            <p className="text-3xl font-bold theme-accent">{algorithms.length}</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
            <p className="text-3xl font-bold text-indigo-400">4</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Difficulty Range</h3>
            <p className="text-lg text-slate-300">Medium - Hard</p>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Key Concepts</h3>
            <p className="text-lg text-slate-300">Traversal & Optimization</p>
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {algorithms.map((algorithm, index) => (
            <Link 
              key={index}
              href={algorithm.path}
              className="group theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:theme-accent transition-colors duration-200">
                  {algorithm.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  <span className="theme-accent font-mono">{algorithm.complexity.time}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Space Complexity:</span>
                  <span className="text-indigo-400 font-mono">{algorithm.complexity.space}</span>
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
              
              <div className="mt-4 flex items-center theme-accent text-sm">
                <span>Explore Visualization</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Algorithm Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🔍</span>
              Traversal Algorithms
            </h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• <strong>DFS:</strong> Depth-first exploration using stack/recursion</li>
              <li>• <strong>BFS:</strong> Level-by-level exploration using queue</li>
              <li>• Applications: Connectivity, pathfinding, cycle detection</li>
            </ul>
          </div>
          <div className="theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">📏</span>
              Shortest Path Algorithms
            </h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>• <strong>Dijkstra:</strong> Single-source shortest paths (positive weights)</li>
              <li>• <strong>Floyd-Warshall:</strong> All-pairs shortest paths</li>
              <li>• Applications: Navigation, network routing, optimization</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-6 mb-8">
          <div className="theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🌳</span>
              Minimum Spanning Tree Algorithms
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• <strong>Kruskal's:</strong> Edge-based approach with union-find</li>
                <li>• <strong>Prim's:</strong> Vertex-based approach with priority queue</li>
              </ul>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Applications: Network design, clustering, circuit design</li>
                <li>• Both guarantee minimum cost spanning tree</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="theme-surface/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-2xl font-semibold text-white mb-4">📚 Recommended Learning Path</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h3 className="font-medium text-white">Start with Graph Traversals</h3>
                <p className="text-slate-300 text-sm">Master DFS and BFS - fundamental techniques for exploring graphs.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <h3 className="font-medium text-white">Learn Shortest Path Algorithms</h3>
                <p className="text-slate-300 text-sm">Understand Dijkstra's algorithm for single-source shortest paths.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div>
                <h3 className="font-medium text-white">Master MST Algorithms</h3>
                <p className="text-slate-300 text-sm">Explore Kruskal's and Prim's algorithms for minimum spanning trees.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <div>
                <h3 className="font-medium text-white">Advanced: All-Pairs Shortest Path</h3>
                <p className="text-slate-300 text-sm">Complete with Floyd-Warshall for comprehensive graph algorithms mastery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
