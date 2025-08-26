"use client";
import { useState, useEffect } from "react";
import {
  UsersIcon,
  CodeBracketIcon,
  TrophyIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  FireIcon,
  CalendarDaysIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    dailyActiveUsers: 0,
    monthlyActiveUsers: 0,
    totalProblems: 0,
    submissionsToday: 0,
    pendingReviews: 0,
    activeContests: 0,
    premiumUsers: 0,
    revenueThisMonth: 0,
    totalSubmissions: 0,
    streakActivity: 0,
    dailyChallengeCompletion: 0,
    premiumConversionRate: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chartData, setChartData] = useState({
    userGrowth: [],
    submissionTrends: [],
    difficultyStats: []
  });

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates with interval
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchDashboardData(false); // Fetch without showing main loading state
      }, 30000); // Update every 30 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  const fetchDashboardData = async (showMainLoader = true) => {
    try {
      if (showMainLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      // Fetch real dashboard data from API
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
        setChartData(data.chartData);
        setLastUpdated(new Date());
      } else {
        console.error('Dashboard API error:', data.message);
        // Set empty state instead of mock data
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          dailyActiveUsers: 0,
          monthlyActiveUsers: 0,
          totalProblems: 0,
          submissionsToday: 0,
          pendingReviews: 0,
          activeContests: 0,
          premiumUsers: 0,
          revenueThisMonth: 0,
          totalSubmissions: 0,
          streakActivity: 0,
          dailyChallengeCompletion: 0,
          premiumConversionRate: 0
        });
        setRecentActivity([]);
        setChartData({ userGrowth: [], submissionTrends: [], difficultyStats: [] });
      }
      
      if (showMainLoader) {
        setLoading(false);
      }
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set error state instead of mock data
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        dailyActiveUsers: 0,
        monthlyActiveUsers: 0,
        totalProblems: 0,
        submissionsToday: 0,
        pendingReviews: 0,
        activeContests: 0,
        premiumUsers: 0,
        revenueThisMonth: 0,
        totalSubmissions: 0,
        streakActivity: 0,
        dailyChallengeCompletion: 0,
        premiumConversionRate: 0
      });
      setRecentActivity([{
        type: "error",
        message: "Failed to load dashboard data. Please refresh the page.",
        time: "now",
        priority: "high"
      }]);
      setChartData({ userGrowth: [], submissionTrends: [], difficultyStats: [] });
      
      if (showMainLoader) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-white">Loading dashboard data...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: UsersIcon,
      color: "bg-blue-500",
      change: "+12.3%",
      changeType: "positive",
      subtitle: "Registered users"
    },
    {
      title: "Daily Active Users",
      value: stats.dailyActiveUsers.toLocaleString(),
      icon: EyeIcon,
      color: "bg-green-500",
      change: "+8.7%",
      changeType: "positive",
      subtitle: "Active today"
    },
    {
      title: "Monthly Active Users", 
      value: stats.monthlyActiveUsers.toLocaleString(),
      icon: CalendarDaysIcon,
      color: "bg-indigo-500",
      change: "+15.2%",
      changeType: "positive",
      subtitle: "Active this month"
    },
    {
      title: "Total Problems",
      value: stats.totalProblems.toLocaleString(),
      icon: CodeBracketIcon,
      color: "bg-purple-500",
      change: "+15",
      changeType: "neutral",
      subtitle: "Available problems"
    },
    {
      title: "Submissions Today",
      value: stats.submissionsToday.toLocaleString(),
      icon: CheckCircleIcon,
      color: "bg-cyan-500",
      change: "+23.1%",
      changeType: "positive",
      subtitle: "Solutions submitted"
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      icon: StarIcon,
      color: "bg-yellow-500",
      change: "+18.9%",
      changeType: "positive",
      subtitle: "Subscription active"
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "bg-emerald-500",
      change: "+25.4%",
      changeType: "positive",
      subtitle: "This month"
    },
    {
      title: "Active Streaks",
      value: stats.streakActivity.toLocaleString(),
      icon: FireIcon,
      color: "bg-orange-500",
      change: "+12.8%",
      changeType: "positive",
      subtitle: "Users on streak"
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "user": return <UsersIcon className="w-4 h-4" />;
      case "problem": return <CodeBracketIcon className="w-4 h-4" />;
      case "contest": return <TrophyIcon className="w-4 h-4" />;
      case "review": return <CheckCircleIcon className="w-4 h-4" />;
      case "premium": return <StarIcon className="w-4 h-4" />;
      case "submission": return <CheckCircleIcon className="w-4 h-4" />;
      case "streak": return <FireIcon className="w-4 h-4" />;
      case "report": return <ExclamationTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type, priority) => {
    const baseColors = {
      user: "text-blue-400",
      problem: "text-purple-400", 
      contest: "text-yellow-400",
      review: "text-green-400",
      premium: "text-pink-400",
      submission: "text-cyan-400",
      streak: "text-orange-400",
      report: "text-red-400"
    };
    
    if (priority === "high") {
      return `${baseColors[type]} animate-pulse`;
    }
    return baseColors[type] || "text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of platform statistics and activity</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-slate-600 bg-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-800"
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              refreshing 
                ? 'bg-purple-600/50 text-gray-300 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {refreshing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${stat.changeType === 'positive' ? 'text-green-400 bg-green-400/10' :
                        stat.changeType === 'negative' ? 'text-red-400 bg-red-400/10' :
                          'text-gray-400 bg-gray-400/10'
                      }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="text-purple-400">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.message}</p>
                <p className="text-gray-400 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-left transition-colors">
            <h3 className="text-white font-medium">Add New Problem</h3>
            <p className="text-gray-400 text-sm">Create a new coding problem</p>
          </button>
          <button className="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-left transition-colors">
            <h3 className="text-white font-medium">Create Contest</h3>
            <p className="text-gray-400 text-sm">Setup a new programming contest</p>
          </button>
          <button className="p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-left transition-colors">
            <h3 className="text-white font-medium">Review Submissions</h3>
            <p className="text-gray-400 text-sm">Check pending code reviews</p>
          </button>
        </div>
      </div>
    </div>
  );
}
