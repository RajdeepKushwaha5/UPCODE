"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    setError(errorParam || 'An authentication error occurred');
  }, [searchParams]);

  const getErrorMessage = (error) => {
    switch (error) {
      case 'Configuration':
        return 'There was a problem with the authentication configuration.';
      case 'AccessDenied':
        return 'Access was denied. You may not have permission to access this resource.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'Default':
        return 'An unexpected authentication error occurred.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-red-400">Authentication Error</h1>
        <p className="text-lg mb-6 text-slate-300">
          {getErrorMessage(error)}
        </p>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </Link>
          <Link 
            href="/" 
            className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
