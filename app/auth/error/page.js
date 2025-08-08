"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
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
