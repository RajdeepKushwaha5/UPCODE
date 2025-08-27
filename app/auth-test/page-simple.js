'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AuthTestSimple() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState({});

  const testGoogleAuth = async () => {
    try {
      console.log('Testing Google OAuth...');
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/auth-test' 
      });
      
      setTestResults(prev => ({
        ...prev,
        google: { success: !result?.error, result }
      }));
      
      if (result?.ok && !result?.error) {
        window.location.reload(); // Refresh to show new session
      }
    } catch (error) {
      console.error('Google auth error:', error);
      setTestResults(prev => ({
        ...prev,
        google: { success: false, error: error.message }
      }));
    }
  };

  const testGitHubAuth = async () => {
    try {
      console.log('Testing GitHub OAuth...');
      const result = await signIn('github', { 
        redirect: false,
        callbackUrl: '/auth-test' 
      });
      
      setTestResults(prev => ({
        ...prev,
        github: { success: !result?.error, result }
      }));
      
      if (result?.ok && !result?.error) {
        window.location.reload(); // Refresh to show new session
      }
    } catch (error) {
      console.error('GitHub auth error:', error);
      setTestResults(prev => ({
        ...prev,
        github: { success: false, error: error.message }
      }));
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">OAuth Authentication Test</h1>
          <p className="text-gray-300">Test Google and GitHub OAuth integration</p>
        </div>

        {/* Session Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Current Session</h2>
          {session ? (
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-300 font-semibold">✅ Authenticated</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">User Info</h3>
                <p className="text-white">Email: {session.user.email}</p>
                <p className="text-white">Name: {session.user.name || 'Not provided'}</p>
                <p className="text-white">Provider: {session.user.provider || 'credentials'}</p>
                {session.user.image && (
                  <div className="mt-2">
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-300 font-semibold">❌ Not authenticated</p>
            </div>
          )}
        </div>

        {/* OAuth Testing */}
        {!session && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Test OAuth Providers</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Google OAuth Test */}
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Google OAuth</h3>
                
                <button
                  onClick={testGoogleAuth}
                  className="w-full py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors mb-4"
                >
                  Test Google Sign In
                </button>

                {testResults.google && (
                  <div className={`p-3 rounded-lg ${
                    testResults.google.success 
                      ? 'bg-green-500/20 border border-green-500/50' 
                      : 'bg-red-500/20 border border-red-500/50'
                  }`}>
                    <p className={`font-semibold ${
                      testResults.google.success ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {testResults.google.success ? '✅ Success' : '❌ Failed'}
                    </p>
                    {testResults.google.error && (
                      <p className="text-red-300 text-sm mt-1">
                        Error: {testResults.google.error}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* GitHub OAuth Test */}
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">GitHub OAuth</h3>
                
                <button
                  onClick={testGitHubAuth}
                  className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 mb-4"
                >
                  Test GitHub Sign In
                </button>

                {testResults.github && (
                  <div className={`p-3 rounded-lg ${
                    testResults.github.success 
                      ? 'bg-green-500/20 border border-green-500/50' 
                      : 'bg-red-500/20 border border-red-500/50'
                  }`}>
                    <p className={`font-semibold ${
                      testResults.github.success ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {testResults.github.success ? '✅ Success' : '❌ Failed'}
                    </p>
                    {testResults.github.error && (
                      <p className="text-red-300 text-sm mt-1">
                        Error: {testResults.github.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Debug Information */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Debug Information</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">Session Status</h3>
              <p className="text-white">Status: {status}</p>
              <p className="text-white">Has Session: {session ? 'Yes' : 'No'}</p>
            </div>
            
            {session && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">Session Data</h3>
                <pre className="text-sm text-gray-300 overflow-auto max-h-40">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
            
            {Object.keys(testResults).length > 0 && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">Test Results</h3>
                <pre className="text-sm text-gray-300 overflow-auto max-h-40">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
