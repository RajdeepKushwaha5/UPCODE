'use client';
import Link from 'next/link';

export default function TreesVisualizer() {
  const treeTypes = [
    {
      title: "Binary Tree",
      description: "Basic tree structure with at most two children per node",
      path: "/dsa-visualizer/trees/binary-tree",
      color: "bg-green-100 border-green-200 hover:bg-green-200"
    },
    {
      title: "Binary Search Tree",
      description: "Ordered binary tree for efficient searching",
      path: "/dsa-visualizer/trees/binary-search-tree",
      color: "bg-blue-100 border-blue-200 hover:bg-blue-200"
    },
    {
      title: "AVL Tree",
      description: "Self-balancing binary search tree",
      path: "/dsa-visualizer/trees/avl-tree",
      color: "bg-purple-100 border-purple-200 hover:bg-purple-200"
    },
    {
      title: "Heap",
      description: "Complete binary tree with heap property",
      path: "/dsa-visualizer/trees/heap",
      color: "bg-red-100 border-red-200 hover:bg-red-200"
    },
    {
      title: "Tree Traversals",
      description: "Different ways to visit tree nodes",
      path: "/dsa-visualizer/trees/traversals",
      color: "bg-yellow-100 border-yellow-200 hover:bg-yellow-200"
    },
    {
      title: "Applications",
      description: "Real-world applications of tree structures",
      path: "/dsa-visualizer/trees/applications",
      color: "bg-indigo-100 border-indigo-200 hover:bg-indigo-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to DSA Visualizer
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Tree Data Structures
          </h1>
          <p className="text-xl text-gray-600">
            Explore hierarchical data structures and their operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treeTypes.map((tree, index) => (
            <Link key={index} href={tree.path}>
              <div className={`${tree.color} rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg cursor-pointer h-full`}>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {tree.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {tree.description}
                </p>
                <div className="flex justify-end">
                  <span className="text-gray-600 font-semibold">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Understanding Tree Structures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Concepts</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Node:</strong> Basic unit containing data</li>
                <li>• <strong>Root:</strong> Top node with no parent</li>
                <li>• <strong>Leaf:</strong> Node with no children</li>
                <li>• <strong>Height:</strong> Longest path from root to leaf</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Common Operations</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Insertion:</strong> Add new nodes</li>
                <li>• <strong>Deletion:</strong> Remove existing nodes</li>
                <li>• <strong>Search:</strong> Find specific values</li>
                <li>• <strong>Traversal:</strong> Visit all nodes systematically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
