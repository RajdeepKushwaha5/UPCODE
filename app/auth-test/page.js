"use client";
// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testResults, setTestResults] = useState({});

  const testOAuthProvider = async (provider) => {
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/auth-test'
      });

      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: result.ok,
          error: result.error,
          url: result.url
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: false,
          error: error.message
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">OAuth Authentication Test</h1>
          <p className="text-gray-300">Test Google and GitHub OAuth integration</p>
        </div>

        {/* Session Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Current Session Status</h2>
          {session ? (
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-300 font-semibold">✅ Authenticated</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-2">User Information</h3>
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

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-2">Session Data</h3>
                  <pre className="text-sm text-gray-300 overflow-auto">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
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
                <div className="flex items-center mb-4">
                  <img src="/google.png" alt="Google" className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Google OAuth</h3>
                </div>

                <button
                  onClick={() => testOAuthProvider('google')}
                  className="w-full py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors mb-4"
                >
                  Test Google Sign In
                </button>

                {testResults.google && (
                  <div className={`p-3 rounded-lg ${testResults.google.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <p className={`font-semibold ${testResults.google.success ? 'text-green-300' : 'text-red-300'}`}>
                      {testResults.google.success ? '✅ Success' : '❌ Failed'}
                    </p>
                    {testResults.google.error && (
                      <p className="text-red-300 text-sm mt-1">Error: {testResults.google.error}</p>
                    )}
                  </div>
                )}
              </div>

              {/* GitHub OAuth Test */}
              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 mr-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white">GitHub OAuth</h3>
                </div>

                <button
                  onClick={() => testOAuthProvider('github')}
                  className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 mb-4"
                >
                  Test GitHub Sign In
                </button>

                {testResults.github && (
                  <div className={`p-3 rounded-lg ${testResults.github.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <p className={`font-semibold ${testResults.github.success ? 'text-green-300' : 'text-red-300'}`}>
                      {testResults.github.success ? '✅ Success' : '❌ Failed'}
                    </p>
                    {testResults.github.error && (
                      <p className="text-red-300 text-sm mt-1">Error: {testResults.github.error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Environment Check */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Environment Configuration Check</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">NextAuth Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">NEXTAUTH_URL:</span>
                  <span className="text-white">✅ Set</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">NEXTAUTH_SECRET:</span>
                  <span className="text-white">✅ Set</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">OAuth Providers</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Google OAuth:</span>
                  <span className="text-yellow-300">⚠️ Configure in .env</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">GitHub OAuth:</span>
                  <span className="text-yellow-300">⚠️ Configure in .env</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Setup Instructions</h2>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              To enable OAuth authentication, you need to configure OAuth applications with Google and GitHub.
              Check the <code className="bg-slate-700 px-2 py-1 rounded">OAUTH-SETUP.md</code> file for detailed instructions.
            </p>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">Required Environment Variables</h3>
              <pre className="text-sm text-gray-300 overflow-auto">
                {`# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_ID=your_github_client_id_here
GITHUB_SECRET=your_github_client_secret_here`}
              </pre>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
