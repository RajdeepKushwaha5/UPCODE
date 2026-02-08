"use client";
import React from "react";
import Link from "next/link";

export default function ContestsListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Programming Contests</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Contest page is now working! Real-time features coming soon.
        </p>
        <div className="mt-8 text-center">
          <p className="text-gray-500">Page successfully loaded</p>
          <div className="mt-4">
            <Link href="/problems" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Go to Problems
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
