'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DynamicProgramming() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const algorithms = [
    {
      name: "0/1 Knapsack",
      description: "Find the optimal way to fill a knapsack with maximum value",
      path: "/dsa-visualizer/dynamic-programming/knapsack-01",
      icon: "🎒",
      difficulty: "Hard",
      timeComplexity: "O(n×W)",
      spaceComplexity: "O(n×W)",
      status: "✅"
    },
    {
      name: "Longest Common Subsequence",
      description: "Find the longest subsequence common to two sequences",
      path: "/dsa-visualizer/dynamic-programming/longest-common-subsequence",
      icon: "📝",
      difficulty: "Medium",
      timeComplexity: "O(m×n)",
      spaceComplexity: "O(m×n)",
      status: "✅"
    },
    {
      name: "Fibonacci Sequence",
      description: "Calculate Fibonacci numbers using memoization and tabulation",
      path: "/dsa-visualizer/dynamic-programming/fibonacci",
      icon: "🌀",
      difficulty: "Easy",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      status: "✅"
    },
    {
      name: "Coin Change",
      description: "Find minimum coins needed to make a given amount",
      path: "/dsa-visualizer/dynamic-programming/coin-change",
      icon: "🪙",
      difficulty: "Medium",
      timeComplexity: "O(n×amount)",
      spaceComplexity: "O(amount)",
      status: "✅"
    },
    {
      name: "Edit Distance",
      description: "Calculate minimum operations to transform one string to another",
      path: "/dsa-visualizer/dynamic-programming/edit-distance",
      icon: "✏️",
      difficulty: "Medium",
      timeComplexity: "O(m×n)",
      spaceComplexity: "O(m×n)",
      status: "✅"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'Hard': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/dsa-visualizer" className="inline-flex items-center theme-accent hover:theme-text-secondary mb-6 transition-colors duration-200">
            ← Back to DSA Visualizer
          </Link>
          <div className="text-center">
            <div className="text-6xl mb-6">🧮</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Dynamic Programming
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Master optimization problems through interactive visualizations of memoization and tabulation techniques
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-pink-400">{algorithms.length}</div>
            <div className="text-slate-400 text-sm">Algorithms</div>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold theme-accent">5</div>
            <div className="text-slate-400 text-sm">Visualizations</div>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-blue-400">100%</div>
            <div className="text-slate-400 text-sm">Complete</div>
          </div>
          <div className="theme-surface backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-green-400">Ready</div>
            <div className="text-slate-400 text-sm">Status</div>
          </div>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {algorithms.map((algorithm, index) => (
            <Link
              key={algorithm.name}
              href={algorithm.path}
              className={`group block transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/20 h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{algorithm.icon}</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(algorithm.difficulty)}`}>
                      {algorithm.difficulty}
                    </span>
                    <span className="text-green-400 text-lg">{algorithm.status}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:theme-accent transition-colors duration-200">
                  {algorithm.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {algorithm.description}
                </p>

                {/* Complexity Info */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Time Complexity:</span>
                    <span className="theme-accent font-mono">{algorithm.timeComplexity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Space Complexity:</span>
                    <span className="text-pink-400 font-mono">{algorithm.spaceComplexity}</span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="mt-4 flex items-center theme-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>Explore Visualization</span>
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="theme-surface backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-6">What is Dynamic Programming?</h3>
            <div className="space-y-4 text-slate-300">
              <p>
                Dynamic Programming is an algorithmic paradigm that solves complex problems by breaking them down 
                into simpler subproblems and storing the results to avoid redundant calculations.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold theme-accent">Key Principles:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Overlapping Subproblems:</strong> Same subproblems solved multiple times</li>
                  <li>• <strong>Optimal Substructure:</strong> Optimal solution contains optimal solutions to subproblems</li>
                  <li>• <strong>Memoization:</strong> Top-down approach with caching</li>
                  <li>• <strong>Tabulation:</strong> Bottom-up approach building solutions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="theme-surface backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-6">Learning Path</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-slate-300">Start with Fibonacci - Learn basic memoization</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-slate-300">Try Coin Change - Understand tabulation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 theme-accent flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-slate-300">Explore LCS - Work with 2D problems</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-sm font-bold">4</div>
                <span className="text-slate-300">Master Knapsack - Complex optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
