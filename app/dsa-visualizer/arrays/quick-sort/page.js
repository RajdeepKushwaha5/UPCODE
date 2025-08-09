'use client';
import Link from 'next/link';

export default function QuickSortVisualizer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer/arrays" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Arrays
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Quick Sort Visualization
          </h1>
          <p className="text-xl text-gray-600">
            Coming Soon: Interactive Quick Sort visualization with pivot selection
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Under Development</h2>
            <p className="text-gray-600 mb-6">
              Quick Sort visualization is being developed. Check back soon!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Sort Facts:</h3>
                <ul className="space-y-2 text-gray-600 text-left">
                  <li>• Average Time: O(n log n)</li>
                  <li>• Worst Time: O(n²)</li>
                  <li>• Space: O(log n)</li>
                  <li>• In-place: Yes</li>
                  <li>• Stable: No</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">How it works:</h3>
                <ul className="space-y-2 text-gray-600 text-left">
                  <li>• Choose a pivot element</li>
                  <li>• Partition around pivot</li>
                  <li>• Recursively sort subarrays</li>
                  <li>• Combine results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}