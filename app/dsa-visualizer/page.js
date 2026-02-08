'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaChartBar, FaTree, FaLink, FaLayerGroup, FaBrain, FaBullseye, FaPlay, FaSearch, FaStream } from 'react-icons/fa';

export default function DSAVisualizer() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const categories = [
    {
      title: "Arrays & Sorting",
      description: "Master array operations and sorting algorithms with step-by-step animations",
      icon: <FaChartBar className="text-5xl" />,
      gradient: "from-purple-500 to-pink-500",
      path: "/dsa-visualizer/arrays",
      color: "purple",
      visualizations: 8,
      topics: [
        { name: "Bubble Sort", path: "/dsa-visualizer/arrays/bubble-sort", status: "✅" },
        { name: "Quick Sort", path: "/dsa-visualizer/arrays/quick-sort", status: "✅" },
        { name: "Merge Sort", path: "/dsa-visualizer/arrays/merge-sort", status: "✅" },
        { name: "Heap Sort", path: "/dsa-visualizer/arrays/heap-sort", status: "✅" },
        { name: "Selection Sort", path: "/dsa-visualizer/arrays/selection-sort", status: "✅" },
        { name: "Insertion Sort", path: "/dsa-visualizer/arrays/insertion-sort", status: "✅" },
        { name: "Binary Search", path: "/dsa-visualizer/arrays/binary-search", status: "✅" },
        { name: "Linear Search", path: "/dsa-visualizer/arrays/linear-search", status: "✅" }
      ]
    },
    {
      title: "Trees",
      description: "Explore tree data structures with interactive visualizations",
      icon: <FaTree className="text-5xl" />,
      gradient: "from-green-500 to-teal-500",
      path: "/dsa-visualizer/trees",
      color: "green",
      visualizations: 6,
      topics: [
        { name: "Binary Tree", path: "/dsa-visualizer/trees/binary-tree", status: "✅" },
        { name: "Binary Search Tree", path: "/dsa-visualizer/trees/binary-search-tree", status: "✅" },
        { name: "AVL Tree", path: "/dsa-visualizer/trees/avl-tree", status: "✅" },
        { name: "Heap", path: "/dsa-visualizer/trees/heap", status: "✅" },
        { name: "Tree Traversals", path: "/dsa-visualizer/trees/traversals", status: "✅" },
        { name: "Red-Black Tree", path: "/dsa-visualizer/trees/red-black-tree", status: "✅" }
      ]
    },
    {
      title: "Linked Lists",
      description: "Understand linked list operations and memory management",
      icon: <FaLink className="text-5xl" />,
      gradient: "from-blue-500 to-cyan-500",
      path: "/dsa-visualizer/linked-lists",
      color: "blue",
      visualizations: 3,
      topics: [
        { name: "Singly Linked List", path: "/dsa-visualizer/linked-lists/singly-linked-list", status: "✅" },
        { name: "Doubly Linked List", path: "/dsa-visualizer/linked-lists/doubly-linked-list", status: "✅" },
        { name: "Circular Linked List", path: "/dsa-visualizer/linked-lists/circular-linked-list", status: "✅" }
      ]
    },
    {
      title: "Stacks & Queues",
      description: "Learn LIFO and FIFO data structure operations",
      icon: <FaLayerGroup className="text-5xl" />,
      gradient: "from-orange-500 to-red-500",
      path: "/dsa-visualizer/stacks-queues",
      color: "orange",
      visualizations: 4,
      topics: [
        { name: "Stack Operations", path: "/dsa-visualizer/stacks-queues/stack", status: "✅" },
        { name: "Queue Operations", path: "/dsa-visualizer/stacks-queues/queue", status: "✅" },
        { name: "Priority Queue", path: "/dsa-visualizer/stacks-queues/priority-queue", status: "✅" },
        { name: "Double-ended Queue", path: "/dsa-visualizer/stacks-queues/deque", status: "✅" }
      ]
    },
    {
      title: "Graphs",
      description: "Visualize graph algorithms and pathfinding",
      icon: "🕸️",
      gradient: "from-indigo-500 to-purple-500",
      path: "/dsa-visualizer/graphs",
      color: "indigo",
      visualizations: 6,
      topics: [
        { name: "Depth First Search", path: "/dsa-visualizer/graphs/depth-first-search", status: "✅" },
        { name: "Breadth First Search", path: "/dsa-visualizer/graphs/breadth-first-search", status: "✅" },
        { name: "Dijkstra's Algorithm", path: "/dsa-visualizer/graphs/dijkstra-algorithm", status: "✅" },
        { name: "Kruskal's MST", path: "/dsa-visualizer/graphs/kruskal-algorithm", status: "✅" },
        { name: "Prim's MST", path: "/dsa-visualizer/graphs/prim-algorithm", status: "✅" },
        { name: "Floyd-Warshall", path: "/dsa-visualizer/graphs/floyd-warshall-algorithm", status: "✅" }
      ]
    },
    {
      title: "Dynamic Programming",
      description: "Master optimization problems with memoization",
      icon: "🧮",
      gradient: "from-pink-500 to-rose-500",
      path: "/dsa-visualizer/dynamic-programming",
      color: "pink",
      visualizations: 5,
      topics: [
        { name: "0/1 Knapsack", path: "/dsa-visualizer/dynamic-programming/knapsack-01", status: "✅" },
        { name: "Longest Common Subsequence", path: "/dsa-visualizer/dynamic-programming/longest-common-subsequence", status: "✅" },
        { name: "Fibonacci Sequence", path: "/dsa-visualizer/dynamic-programming/fibonacci", status: "✅" },
        { name: "Coin Change", path: "/dsa-visualizer/dynamic-programming/coin-change", status: "✅" },
        { name: "Edit Distance", path: "/dsa-visualizer/dynamic-programming/edit-distance", status: "✅" }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: { border: "border-purple-500/30", hover: "hover:border-purple-400" },
      green: { border: "border-green-500/30", hover: "hover:border-green-400" },
      blue: { border: "border-blue-500/30", hover: "hover:border-blue-400" },
      orange: { border: "border-orange-500/30", hover: "hover:border-orange-400" },
      indigo: { border: "border-indigo-500/30", hover: "hover:border-indigo-400" },
      pink: { border: "border-pink-500/30", hover: "hover:border-pink-400" }
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6">
            <FaBrain className="text-5xl mb-4 mx-auto animate-bounce" style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="text-6xl max-lg:text-5xl max-md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 font-mono tracking-tight">
            DSA VISUALIZER
          </h1>
          <p className="text-xl max-md:text-lg max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Master <span className="theme-accent font-semibold">Data Structures</span> and <span className="text-pink-400 font-semibold">Algorithms</span> through 
            interactive visualizations. See how your code comes to life!
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mt-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold theme-accent">{categories.reduce((sum, cat) => sum + cat.visualizations, 0)}+</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Visualizations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">{categories.length}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">Interactive</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Learning</div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => {
            const colorClasses = getColorClasses(category.color);
            const isSelected = selectedCategory === index;
            
            return (
              <div
                key={index}
                className={`group transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setSelectedCategory(index)}
                onMouseLeave={() => setSelectedCategory(null)}
              >
                <div className={`
                  relative theme-surface backdrop-blur-sm rounded-2xl p-6 h-full 
                  border-2 ${colorClasses.border} ${colorClasses.hover}
                  transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl
                  cursor-pointer overflow-hidden
                `}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--text-primary)' }}>
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300" style={{ color: 'var(--text-primary)' }}>
                        {category.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {category.description}
                      </p>
                      
                      {/* Visualization Count */}
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 theme-surface-elevated/50 rounded-full">
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{category.visualizations} Visualizations</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      </div>
                    </div>
                    
                    {/* Topics Preview */}
                    <div className={`transition-all duration-500 overflow-hidden ${
                      isSelected ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="border-t border-slate-600/50 pt-4">
                        <h4 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>Available Topics:</h4>
                        <div className="space-y-2">
                          {category.topics.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="flex items-center justify-between text-xs p-2 theme-surface-elevated/30 rounded-lg hover:theme-surface-elevated/50 transition-colors duration-200"
                            >
                              <span style={{ color: 'var(--text-secondary)' }}>{topic.name}</span>
                              <span className="text-lg">{topic.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <Link href={category.path} className="block mt-6">
                      <div className={`
                        text-center py-3 px-6 bg-gradient-to-r ${category.gradient} 
                        rounded-xl font-semibold text-white transform 
                        group-hover:scale-105 transition-all duration-300
                        hover:shadow-lg
                      `}>
                        <span className="flex items-center justify-center gap-2">
                          <span>Explore {category.title}</span>
                          <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="theme-surface/30 backdrop-blur-sm rounded-3xl p-8 border" style={{ borderColor: 'var(--border-primary)' }}>
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              How to Master DSA
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-white shadow-lg group-hover:shadow-purple-500/30 transition-shadow duration-300">
                  <FaBullseye />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:theme-accent transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>Choose Your Path</h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Select from arrays, trees, graphs, and advanced algorithms. Each path is carefully designed for progressive learning.
                </p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-white shadow-lg group-hover:shadow-green-500/30 transition-shadow duration-300">
                  <FaPlay />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>Interactive Learning</h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Step through algorithms with real-time animations. Control the speed, pause, and replay to understand every detail.
                </p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-white shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-300">
                  <FaBrain />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>Deep Understanding</h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Gain intuitive understanding of time complexity, space complexity, and optimal solutions through visualization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className={`mt-16 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            Popular Visualizations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Bubble Sort", path: "/dsa-visualizer/arrays/bubble-sort", icon: <FaStream className="text-3xl" /> },
              { name: "Binary Search", path: "/dsa-visualizer/arrays/binary-search", icon: <FaSearch className="text-3xl" /> },
              { name: "Binary Tree", path: "/dsa-visualizer/trees/binary-tree", icon: <FaTree className="text-3xl" /> },
              { name: "Stack Operations", path: "/dsa-visualizer/stacks-queues/stack", icon: <FaLayerGroup className="text-3xl" /> }
            ].map((item, index) => (
              <Link key={index} href={item.path}>
                <div className="group theme-surface backdrop-blur-sm rounded-xl p-6 border hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="text-center">
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--text-primary)' }}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300" style={{ color: 'var(--text-primary)' }}>
                      {item.name}
                    </h3>
                    <div className="mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Try it now →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Visualize?
            </h2>
            <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Start your journey with our most popular visualization and see algorithms come to life before your eyes!
            </p>
            <Link href="/dsa-visualizer/arrays/bubble-sort">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
                Start with Bubble Sort →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
