"use client";
import { useState, useEffect } from "react";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalContests: 0,
    activeContests: 0,
    problemsSolvedToday: 0,
    newRegistrations: 0,
    dailyActiveUsers: 0,
    serverUptime: "99.9%",
    contestParticipation: [],
    userGrowth: [],
    problemDifficulty: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/analytics');
      console.log('Analytics API response status:', response.status); // Debug log
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login as an admin to view analytics');
        } else if (response.status === 403) {
          throw new Error('Admin privileges required to view analytics');
        } else {
          throw new Error(`Failed to fetch analytics data (${response.status})`);
        }
      }
      
      const data = await response.json();
      console.log('Analytics data received:', data); // Debug log
      
      setAnalytics(data.analytics || data || {}); // Handle different response formats
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
      // Set fallback data on error
      setAnalytics({
        totalUsers: 0,
        totalProblems: 0,
        totalContests: 0,
        activeContests: 0,
        problemsSolvedToday: 0,
        newRegistrations: 0,
        dailyActiveUsers: 0,
        serverUptime: "99.9%",
        contestParticipation: [],
        userGrowth: [],
        problemDifficulty: {}
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-gray-400">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-gray-400">Platform performance and user analytics</p>
        </div>
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6">
          <div className="text-red-400 font-semibold">Error Loading Analytics</div>
          <div className="text-gray-400 text-sm mt-2">{error}</div>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-gray-400">Platform performance and user analytics</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-blue-400">{analytics.totalUsers || 0}</div>
          <div className="text-gray-400">Total Users</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-green-400">{analytics.totalProblems || 0}</div>
          <div className="text-gray-400">Total Problems</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold theme-accent">{analytics.totalContests || 0}</div>
          <div className="text-gray-400">Total Contests</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-yellow-400">{analytics.activeContests || 0}</div>
          <div className="text-gray-400">Active Contests</div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-cyan-400">{analytics.dailyActiveUsers || 0}</div>
          <div className="text-gray-400">Daily Active Users</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-emerald-400">{analytics.problemsSolvedToday || 0}</div>
          <div className="text-gray-400">Problems Solved Today</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-indigo-400">{analytics.newRegistrations || 0}</div>
          <div className="text-gray-400">New Registrations</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-orange-400">{analytics.serverUptime || "99.9%"}</div>
          <div className="text-gray-400">Server Uptime</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Contest Participation</h2>
          <div className="h-64">
            {analytics.contestParticipation && analytics.contestParticipation.length > 0 ? (
              <div className="space-y-3">
                {analytics.contestParticipation.slice(0, 5).map((contest, index) => (
                  <div key={index} className="flex justify-between items-center p-3 theme-surface-elevated/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{contest.title}</div>
                      <div className="text-sm text-gray-400">{new Date(contest.start).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold theme-accent">{contest.participants || 0}</div>
                      <div className="text-xs text-gray-400">participants</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No contest data available
              </div>
            )}
          </div>
        </div>

        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Problem Difficulty Distribution</h2>
          <div className="h-64">
            {analytics.problemDifficulty && Object.keys(analytics.problemDifficulty).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analytics.problemDifficulty).map(([difficulty, count]) => {
                  const colors = {
                    Easy: 'bg-green-500',
                    Medium: 'bg-yellow-500', 
                    Hard: 'bg-red-500'
                  };
                  const total = Object.values(analytics.problemDifficulty).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  
                  return (
                    <div key={difficulty} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{difficulty}</span>
                        <span className="text-gray-400">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full theme-surface-elevated rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[difficulty] || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No problem difficulty data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">User Growth Trends</h2>
        <div className="h-64">
          {analytics.userGrowth && analytics.userGrowth.length > 0 ? (
            <div className="h-full flex items-end justify-between space-x-2">
              {analytics.userGrowth.slice(-12).map((data, index) => {
                const maxUsers = Math.max(...analytics.userGrowth.map(d => d.users));
                const height = maxUsers > 0 ? (data.users / maxUsers) * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-purple-500 rounded-t"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2 transform rotate-45 origin-left">
                      {data.month}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No user growth data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
