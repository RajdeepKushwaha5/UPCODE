"use client";
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check OAuth status
      const oauthResponse = await fetch('/api/auth/oauth-status');
      results.oauthStatus = await oauthResponse.json();

      // Test 2: Check providers
      const providersResponse = await fetch('/api/auth/providers');
      results.providers = await providersResponse.json();

      // Test 3: Check session
      const sessionResponse = await fetch('/api/auth/session');
      results.sessionEndpoint = await sessionResponse.json();

      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
      results.error = error.message;
      setTestResults(results);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleAuth = async () => {
    console.log('Testing Google authentication...');
    try {
      const result = await signIn('google', { 
        callbackUrl: '/auth-test',
        redirect: false 
      });
      console.log('Google auth result:', result);
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const testGitHubAuth = async () => {
    console.log('Testing GitHub authentication...');
    try {
      const result = await signIn('github', { 
        callbackUrl: '/auth-test',
        redirect: false 
      });
      console.log('GitHub auth result:', result);
    } catch (error) {
      console.error('GitHub auth error:', error);
    }
  };

  const testCredentialsAuth = async () => {
    console.log('Testing credentials authentication...');
    try {
      const result = await signIn('credentials', {
        email: 'test@example.com',
        password: 'testpassword',
        callbackUrl: '/auth-test',
        redirect: false
      });
      console.log('Credentials auth result:', result);
    } catch (error) {
      console.error('Credentials auth error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/auth-test', redirect: false });
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        {/* Current Session Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Session Status</h2>
          <p><strong>Status:</strong> {status}</p>
          {session && (
            <div className="mt-4">
              <p><strong>User:</strong> {session.user?.name || session.user?.email}</p>
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Provider:</strong> {session.user?.provider || 'credentials'}</p>
              <button 
                onClick={handleSignOut}
                className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">System Test Results</h2>
          {loading ? (
            <p>Running tests...</p>
          ) : (
            <pre className="text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          )}
          <button 
            onClick={runTests}
            className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Refresh Tests
          </button>
        </div>

        {/* Authentication Buttons */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
          <div className="space-y-4">
            <button 
              onClick={testGoogleAuth}
              className="w-full bg-white text-gray-800 font-semibold py-3 px-6 rounded flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Test Google Authentication</span>
            </button>

            <button 
              onClick={testGitHubAuth}
              className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded flex items-center justify-center space-x-3 border border-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span>Test GitHub Authentication</span>
            </button>

            <button 
              onClick={testCredentialsAuth}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded"
            >
              Test Credentials Authentication (Demo)
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <h3 className="font-semibold mb-2">Debug Instructions:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Open browser console (F12) to see detailed logs</li>
              <li>Check Network tab for failed requests</li>
              <li>Verify OAuth app settings in Google/GitHub consoles</li>
              <li>Ensure callback URLs match: http://localhost:3000/api/auth/callback/[provider]</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/login')}
            className="mr-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Go to Login Page
          </button>
          <button
            onClick={() => router.push('/register')}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Go to Register Page
          </button>
        </div>
      </div>
    </div>
  );
}
