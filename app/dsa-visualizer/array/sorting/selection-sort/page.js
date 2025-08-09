'use client';
import Link from 'next/link';

export default function ArraySelectionSortVisualizer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/dsa-visualizer/arrays" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Arrays
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Selection Sort (Array)
          </h1>
          <p className="text-xl text-gray-600">
            Duplicate of Selection Sort - redirecting to main implementation
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Redirecting...</h2>
            <Link href="/dsa-visualizer/arrays/selection-sort" className="text-blue-600 hover:text-blue-800 font-semibold">
              Go to Selection Sort →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
