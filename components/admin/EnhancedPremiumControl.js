"use client";
import { useState, useEffect } from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  GiftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

export default function EnhancedPremiumControl() {
  const [premiumStats, setPremiumStats] = useState({
    totalPremiumUsers: 0,
    activePremiumUsers: 0,
    expiredPremiumUsers: 0,
    expiringSoonUsers: 0,
    monthlyRevenue: 0,
    newPremiumThisMonth: 0,
    conversionRate: 0,
    churnRate: 0
  });
  
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('grant');
  const [actionData, setActionData] = useState({
    duration: 30,
    plan: 'monthly'
  });

  const filters = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active Premium' },
    { value: 'expired', label: 'Expired' },
    { value: 'expiring-soon', label: 'Expiring Soon' },
    { value: 'premium-history', label: 'Premium History' }
  ];

  useEffect(() => {
    fetchPremiumData();
  }, [currentPage, filterType, searchQuery]);

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchPremiumData(false); // Refresh without showing loader
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, currentPage, filterType, searchQuery]);

  const fetchPremiumData = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        filter: filterType,
        search: searchQuery
      });

      const response = await fetch(`/api/admin/premium?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setPremiumStats(data.stats);
        setSubscribers(data.users);
        setTotalPages(data.pagination.totalPages);
        setLastUpdated(new Date());
      } else {
        console.error("Failed to fetch premium data:", data.message);
        setPremiumStats({
          totalPremiumUsers: 0,
          activePremiumUsers: 0,
          expiredPremiumUsers: 0,
          expiringSoonUsers: 0,
          monthlyRevenue: 0,
          newPremiumThisMonth: 0,
          conversionRate: 0,
          churnRate: 0
        });
        setSubscribers([]);
      }
    } catch (error) {
      console.error("Error fetching premium data:", error);
      setPremiumStats({
        totalPremiumUsers: 0,
        activePremiumUsers: 0,
        expiredPremiumUsers: 0,
        expiringSoonUsers: 0,
        monthlyRevenue: 0,
        newPremiumThisMonth: 0,
        conversionRate: 0,
        churnRate: 0
      });
      setSubscribers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePremiumAction = async () => {
    try {
      const response = await fetch('/api/admin/premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: actionType,
          userId: selectedUser._id,
          duration: actionData.duration,
          plan: actionData.plan
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowActionModal(false);
        setSelectedUser(null);
        fetchPremiumData(); // Refresh data
        alert(`Premium ${actionType} completed successfully`);
      } else {
        alert(`Failed to ${actionType} premium: ${data.message}`);
      }
    } catch (error) {
      console.error("Error performing premium action:", error);
      alert("Error performing action. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3" style={{ color: 'var(--text-primary)' }}>Loading premium data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Premium Control</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage premium subscriptions and revenue</p>
          {lastUpdated && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded theme-border theme-surface-elevated text-purple-600 focus:ring-blue-500 focus:ring-offset-slate-800"
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={() => fetchPremiumData(true)}
            disabled={refreshing}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              refreshing 
                ? 'bg-blue-600/50 text-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {refreshing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Premium Users</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{premiumStats.totalPremiumUsers}</p>
            </div>
            <StarIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active Premium</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{premiumStats.activePremiumUsers}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Monthly Revenue</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>${premiumStats.monthlyRevenue}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Conversion Rate</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{premiumStats.conversionRate}%</p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="theme-surface backdrop-blur-sm rounded-xl border theme-border overflow-hidden">
        <div className="p-6 border-b theme-border">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Premium Users</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Manage premium subscriptions</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full theme-surface-elevated border theme-border rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="theme-surface-elevated border theme-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ color: 'var(--text-primary)' }}
            >
              {filters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b theme-border">
                  <th className="pb-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>User</th>
                  <th className="pb-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
                  <th className="pb-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Plan</th>
                  <th className="pb-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Expires</th>
                  <th className="pb-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((user) => (
                  <tr key={user._id} className="border-b theme-border">
                    <td className="py-4">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.username}</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4" style={{ color: 'var(--text-secondary)' }}>{user.premiumPlan}</td>
                    <td className="py-4" style={{ color: 'var(--text-secondary)' }}>
                      {user.premiumExpiry ? new Date(user.premiumExpiry).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setActionType(user.status === 'active' ? 'revoke' : 'grant');
                          setShowActionModal(true);
                        }}
                        className="theme-accent hover:theme-text-secondary text-sm"
                      >
                        {user.status === 'active' ? 'Revoke' : 'Grant'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-surface rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              {actionType === 'grant' ? 'Grant Premium' : 'Revoke Premium'}
            </h3>
            
            {actionType === 'grant' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Duration (days)</label>
                  <input
                    type="number"
                    value={actionData.duration}
                    onChange={(e) => setActionData(prev => ({...prev, duration: parseInt(e.target.value)}))}
                    className="w-full theme-surface-elevated border theme-border rounded-lg px-3 py-2"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Plan Type</label>
                  <select
                    value={actionData.plan}
                    onChange={(e) => setActionData(prev => ({...prev, plan: e.target.value}))}
                    className="w-full theme-surface-elevated border theme-border rounded-lg px-3 py-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 theme-surface-elevated hover:opacity-80 rounded-lg transition-colors" style={{ color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handlePremiumAction}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  actionType === 'grant'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {actionType === 'grant' ? 'Grant Premium' : 'Revoke Premium'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
