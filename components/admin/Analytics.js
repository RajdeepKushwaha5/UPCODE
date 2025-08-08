"use client";
import { useState, useEffect } from "react";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data
    setTimeout(() => {
      setAnalytics({
        dailyActiveUsers: 89,
        problemsSolvedToday: 234,
        newRegistrations: 12,
        serverUptime: "99.9%"
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
        <p className="text-gray-400">Platform performance and user analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-blue-400">{analytics.dailyActiveUsers}</div>
          <div className="text-gray-400">Daily Active Users</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-green-400">{analytics.problemsSolvedToday}</div>
          <div className="text-gray-400">Problems Solved Today</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-purple-400">{analytics.newRegistrations}</div>
          <div className="text-gray-400">New Registrations</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-yellow-400">{analytics.serverUptime}</div>
          <div className="text-gray-400">Server Uptime</div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Usage Trends</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Chart visualization would go here
        </div>
      </div>
    </div>
  );
}
