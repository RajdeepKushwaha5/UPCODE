'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthTestBothFlows() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testResults, setTestResults] = useState({});

  const testSignUp = async (provider) => {
    try {
      console.log(`Testing ${provider} OAuth SIGN UP flow...`);
      setTestResults(prev => ({
        ...prev,
        [provider + '_signup']: { testing: true }
      }));

      const result = await signIn(provider, { 
        callbackUrl: '/setup-profile',
        redirect: false // Stay on page to see result
      });
      
      setTestResults(prev => ({
        ...prev,
        [provider + '_signup']: { 
          success: !result?.error, 
          result,
          type: 'signup'
        }
      }));

      if (!result?.error && result?.url) {
        setTimeout(() => {
          window.location.href = result.url;
        }, 2000);
      }

    } catch (error) {
      console.error(`${provider} sign up error:`, error);
      setTestResults(prev => ({
        ...prev,
        [provider + '_signup']: { 
          success: false, 
          error: error.message,
          type: 'signup'
        }
      }));
    }
  };

  const testSignIn = async (provider) => {
    try {
      console.log(`Testing ${provider} OAuth SIGN IN flow...`);
      setTestResults(prev => ({
        ...prev,
        [provider + '_signin']: { testing: true }
      }));

      const result = await signIn(provider, { 
        callbackUrl: '/dashboard',
        redirect: false // Stay on page to see result
      });
      
      setTestResults(prev => ({
        ...prev,
        [provider + '_signin']: { 
          success: !result?.error, 
          result,
          type: 'signin'
        }
      }));

      if (!result?.error && result?.url) {
        setTimeout(() => {
          window.location.href = result.url;
        }, 2000);
      }

    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setTestResults(prev => ({
        ...prev,
        [provider + '_signin']: { 
          success: false, 
          error: error.message,
          type: 'signin'
        }
      }));
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading authentication status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">OAuth Sign Up & Sign In Test</h1>
          <p className="text-gray-300">Test both authentication flows comprehensively</p>
        </div>

        {/* Current Session */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Current Session Status</h2>
          {session ? (
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-300 font-semibold">✅ Authenticated</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-2">User Info</h3>
                  <p className="text-white text-sm">Email: {session.user.email}</p>
                  <p className="text-white text-sm">Name: {session.user.name || 'Not provided'}</p>
                  <p className="text-white text-sm">Provider: {session.user.provider || 'credentials'}</p>
                  <p className="text-white text-sm">Username: {session.user.username || 'Not set'}</p>
                  <p className="text-white text-sm">New User: {session.user.isNewUser ? 'Yes' : 'No'}</p>
                  <p className="text-white text-sm">Needs Setup: {session.user.needsProfileSetup ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-2">Actions</h3>
                  <button
                    onClick={() => signOut()}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-300 font-semibold">❌ Not authenticated - Ready for testing</p>
            </div>
          )}
        </div>

        {/* Testing Interface - Only show when not authenticated */}
        {!session && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sign Up Testing */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                🆕 Test OAuth Sign Up (New Users)
              </h2>
              <p className="text-gray-300 mb-6 text-sm">
                Use with NEW email addresses to test account creation flow.
              </p>

              <div className="space-y-4">
                {/* Google Sign Up */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-white rounded mr-3 flex items-center justify-center">
                      <span className="text-gray-800 font-bold text-sm">G</span>
                    </div>
                    <h3 className="text-white font-semibold">Google Sign Up</h3>
                  </div>
                  
                  <button
                    onClick={() => testSignUp('google')}
                    className="w-full py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors mb-3"
                    disabled={testResults['google_signup']?.testing}
                  >
                    {testResults['google_signup']?.testing ? 'Testing...' : 'Test Google Sign Up'}
                  </button>

                  {testResults['google_signup'] && (
                    <div className={`p-3 rounded-lg ${
                      testResults['google_signup'].success 
                        ? 'bg-green-500/20 border border-green-500/50' 
                        : 'bg-red-500/20 border border-red-500/50'
                    }`}>
                      <p className={`font-semibold text-sm ${
                        testResults['google_signup'].success ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {testResults['google_signup'].success ? '✅ Success' : '❌ Failed'}
                      </p>
                      {testResults['google_signup'].error && (
                        <p className="text-red-300 text-xs mt-1">
                          {testResults['google_signup'].error}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* GitHub Sign Up */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-900 rounded mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold">GitHub Sign Up</h3>
                  </div>
                  
                  <button
                    onClick={() => testSignUp('github')}
                    className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 mb-3"
                    disabled={testResults['github_signup']?.testing}
                  >
                    {testResults['github_signup']?.testing ? 'Testing...' : 'Test GitHub Sign Up'}
                  </button>

                  {testResults['github_signup'] && (
                    <div className={`p-3 rounded-lg ${
                      testResults['github_signup'].success 
                        ? 'bg-green-500/20 border border-green-500/50' 
                        : 'bg-red-500/20 border border-red-500/50'
                    }`}>
                      <p className={`font-semibold text-sm ${
                        testResults['github_signup'].success ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {testResults['github_signup'].success ? '✅ Success' : '❌ Failed'}
                      </p>
                      {testResults['github_signup'].error && (
                        <p className="text-red-300 text-xs mt-1">
                          {testResults['github_signup'].error}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sign In Testing */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                🔑 Test OAuth Sign In (Existing Users)
              </h2>
              <p className="text-gray-300 mb-6 text-sm">
                Use with EXISTING email addresses to test sign in flow.
              </p>

              <div className="space-y-4">
                {/* Google Sign In */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-white rounded mr-3 flex items-center justify-center">
                      <span className="text-gray-800 font-bold text-sm">G</span>
                    </div>
                    <h3 className="text-white font-semibold">Google Sign In</h3>
                  </div>
                  
                  <button
                    onClick={() => testSignIn('google')}
                    className="w-full py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors mb-3"
                    disabled={testResults['google_signin']?.testing}
                  >
                    {testResults['google_signin']?.testing ? 'Testing...' : 'Test Google Sign In'}
                  </button>

                  {testResults['google_signin'] && (
                    <div className={`p-3 rounded-lg ${
                      testResults['google_signin'].success 
                        ? 'bg-green-500/20 border border-green-500/50' 
                        : 'bg-red-500/20 border border-red-500/50'
                    }`}>
                      <p className={`font-semibold text-sm ${
                        testResults['google_signin'].success ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {testResults['google_signin'].success ? '✅ Success' : '❌ Failed'}
                      </p>
                      {testResults['google_signin'].error && (
                        <p className="text-red-300 text-xs mt-1">
                          {testResults['google_signin'].error}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* GitHub Sign In */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-900 rounded mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold">GitHub Sign In</h3>
                  </div>
                  
                  <button
                    onClick={() => testSignIn('github')}
                    className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 mb-3"
                    disabled={testResults['github_signin']?.testing}
                  >
                    {testResults['github_signin']?.testing ? 'Testing...' : 'Test GitHub Sign In'}
                  </button>

                  {testResults['github_signin'] && (
                    <div className={`p-3 rounded-lg ${
                      testResults['github_signin'].success 
                        ? 'bg-green-500/20 border border-green-500/50' 
                        : 'bg-red-500/20 border border-red-500/50'
                    }`}>
                      <p className={`font-semibold text-sm ${
                        testResults['github_signin'].success ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {testResults['github_signin'].success ? '✅ Success' : '❌ Failed'}
                      </p>
                      {testResults['github_signin'].error && (
                        <p className="text-red-300 text-xs mt-1">
                          {testResults['github_signin'].error}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Testing Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-green-400 font-semibold mb-2">For Sign Up Testing:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use a NEW email address not in the system</li>
                <li>• Should create a new user account automatically</li>
                <li>• Should redirect to profile setup page</li>
                <li>• Should show isNewUser: true in session</li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">For Sign In Testing:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use an EXISTING email address in the system</li>
                <li>• Should sign in to existing account</li>
                <li>• Should redirect to dashboard</li>
                <li>• Should show isNewUser: false in session</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors mr-4"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors mr-4"
          >
            Go to Login
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Register
          </button>
        </div>
      </div>
    </div>
  );
}
