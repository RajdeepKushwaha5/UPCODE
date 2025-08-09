'use client';
import Link from 'next/link';

export default function HeapVisualizer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer/trees" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Trees
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Heap Visualization
          </h1>
          <p className="text-xl text-gray-600">
            Coming Soon: Min/Max heap operations and heapify process
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔺</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Under Development</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
