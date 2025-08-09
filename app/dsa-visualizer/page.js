'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function DSAVisualizer() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      title: "Arrays",
      description: "Visualize array operations and sorting algorithms",
      icon: "📊",
      path: "/dsa-visualizer/arrays",
      topics: ["Bubble Sort", "Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort", "Insertion Sort", "Binary Search", "Linear Search"]
    },
    {
      title: "Trees",
      description: "Explore tree data structures and operations",
      icon: "🌳",
      path: "/dsa-visualizer/trees",
      topics: ["Binary Tree", "Binary Search Tree", "AVL Tree", "Heap", "Tree Traversals", "Applications"]
    },
    {
      title: "Linked Lists",
      description: "Understand linked list operations",
      icon: "🔗",
      path: "/dsa-visualizer/linked-lists",
      topics: ["Singly Linked List", "Doubly Linked List", "Circular Linked List"]
    },
    {
      title: "Stacks & Queues",
      description: "Learn stack and queue operations",
      icon: "📚",
      path: "/dsa-visualizer/stacks-queues",
      topics: ["Stack Operations", "Queue Operations", "Applications"]
    },
    {
      title: "Graphs",
      description: "Visualize graph algorithms",
      icon: "🕸️",
      path: "/dsa-visualizer/graphs",
      topics: ["BFS", "DFS", "Dijkstra", "Minimum Spanning Tree"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            DSA Visualizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive visualizations of data structures and algorithms to help you understand complex concepts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.path}
              className="group"
              onMouseEnter={() => setSelectedCategory(index)}
              onMouseLeave={() => setSelectedCategory(null)}
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-blue-200">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                </div>
                
                <div className={`transition-all duration-300 overflow-hidden ${
                  selectedCategory === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-800">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              How to Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Choose a Topic</h3>
                <p className="text-gray-600">Select from arrays, trees, graphs, and more</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">▶️</div>
                <h3 className="text-xl font-semibold mb-2">Watch & Learn</h3>
                <p className="text-gray-600">Step through algorithms with interactive animations</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="text-xl font-semibold mb-2">Understand</h3>
                <p className="text-gray-600">Gain deep insights into how algorithms work</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}