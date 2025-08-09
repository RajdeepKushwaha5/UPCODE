'use client';
import Link from 'next/link';

export default function ArraysVisualizer() {
  const algorithms = [
    {
      title: "Bubble Sort",
      description: "Compare adjacent elements and swap if needed",
      complexity: "O(n²)",
      path: "/dsa-visualizer/arrays/bubble-sort",
      color: "bg-red-100 border-red-200 hover:bg-red-200"
    },
    {
      title: "Quick Sort",
      description: "Divide and conquer sorting algorithm",
      complexity: "O(n log n)",
      path: "/dsa-visualizer/arrays/quick-sort",
      color: "bg-blue-100 border-blue-200 hover:bg-blue-200"
    },
    {
      title: "Merge Sort",
      description: "Stable divide and conquer sorting",
      complexity: "O(n log n)",
      path: "/dsa-visualizer/arrays/merge-sort",
      color: "bg-green-100 border-green-200 hover:bg-green-200"
    },
    {
      title: "Heap Sort",
      description: "Heap-based sorting algorithm",
      complexity: "O(n log n)",
      path: "/dsa-visualizer/arrays/heap-sort",
      color: "bg-purple-100 border-purple-200 hover:bg-purple-200"
    },
    {
      title: "Selection Sort",
      description: "Find minimum and place at beginning",
      complexity: "O(n²)",
      path: "/dsa-visualizer/arrays/selection-sort",
      color: "bg-yellow-100 border-yellow-200 hover:bg-yellow-200"
    },
    {
      title: "Insertion Sort",
      description: "Build sorted array one element at a time",
      complexity: "O(n²)",
      path: "/dsa-visualizer/arrays/insertion-sort",
      color: "bg-pink-100 border-pink-200 hover:bg-pink-200"
    },
    {
      title: "Binary Search",
      description: "Search in sorted array by dividing",
      complexity: "O(log n)",
      path: "/dsa-visualizer/arrays/binary-search",
      color: "bg-indigo-100 border-indigo-200 hover:bg-indigo-200"
    },
    {
      title: "Linear Search",
      description: "Sequential search through elements",
      complexity: "O(n)",
      path: "/dsa-visualizer/arrays/linear-search",
      color: "bg-teal-100 border-teal-200 hover:bg-teal-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Array Algorithms
          </h1>
          <p className="text-xl text-gray-600">
            Visualize sorting and searching algorithms on arrays
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algorithm, index) => (
            <Link key={index} href={algorithm.path}>
              <div className={`${algorithm.color} rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg cursor-pointer h-full`}>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {algorithm.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {algorithm.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-mono">
                    {algorithm.complexity}
                  </span>
                  <span className="text-gray-600 font-semibold">
                    Visualize →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Understanding Array Algorithms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Sorting Algorithms</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Bubble Sort:</strong> Simple but inefficient O(n²)</li>
                <li>• <strong>Quick Sort:</strong> Fast average case O(n log n)</li>
                <li>• <strong>Merge Sort:</strong> Stable and consistent O(n log n)</li>
                <li>• <strong>Heap Sort:</strong> In-place O(n log n)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Search Algorithms</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Linear Search:</strong> Works on any array O(n)</li>
                <li>• <strong>Binary Search:</strong> Requires sorted array O(log n)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}