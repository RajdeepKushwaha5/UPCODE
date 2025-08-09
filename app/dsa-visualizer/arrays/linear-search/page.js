'use client';
import Link from 'next/link';

export default function LinearSearchVisualizer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer/arrays" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Arrays
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Linear Search Visualization
          </h1>
          <p className="text-xl text-gray-600">
            Coming Soon: Interactive Linear Search with sequential element checking
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Under Development</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Linear Search Facts:</h3>
                <ul className="space-y-2 text-gray-600 text-left">
                  <li>• Time: O(n)</li>
                  <li>• Space: O(1)</li>
                  <li>• Works on any array</li>
                  <li>• Simple algorithm</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Process:</h3>
                <ul className="space-y-2 text-gray-600 text-left">
                  <li>• Start from first element</li>
                  <li>• Compare with target</li>
                  <li>• Move to next element</li>
                  <li>• Continue until found</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
