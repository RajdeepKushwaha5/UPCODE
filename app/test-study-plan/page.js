'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function TestStudyPlan() {
  const { data: session, status } = useSession();
  const [apiStatus, setApiStatus] = useState('Not tested');

  const testAPI = async () => {
    try {
      setApiStatus('Testing...');

      const response = await fetch('/api/study-plans');

      if (!response.ok) {
        setApiStatus(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        setApiStatus(`Non-JSON response: ${text.substring(0, 100)}...`);
        return;
      }

      const data = await response.json();
      setApiStatus(`Success: ${JSON.stringify(data, null, 2)}`);

    } catch (error) {
      setApiStatus(`Exception: ${error.message}`);
    }
  };

  useEffect(() => {
    if (status !== 'loading' && session) {
      testAPI();
    }
  }, [session, status]);

  if (status === 'loading') {
    return <div className="p-8 text-white">Loading session...</div>;
  }

  if (!session) {
    return <div className="p-8 text-white">Not authenticated</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Study Plan API Test</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Session Status:</h2>
        <p>Status: {status}</p>
        <p>User: {session.user?.email}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">API Status:</h2>
        <pre className="bg-gray-800 p-4 rounded text-sm overflow-auto max-h-96">
          {apiStatus}
        </pre>
      </div>

      <button
        onClick={testAPI}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Test API Again
      </button>
    </div>
  );
}
