"use client";
import { useState, useEffect } from "react";
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  StarIcon,
  FireIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function EnhancedUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPremium, setFilterPremium] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    bannedUsers: 0
  });

  const usersPerPage = 15;

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [currentPage, searchQuery, filterRole, filterStatus, filterPremium]);

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchUsers(false); // Refresh without showing loader
        fetchUserStats(false);
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, currentPage, searchQuery, filterRole, filterStatus, filterPremium]);

  const fetchUsers = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: usersPerPage,
        search: searchQuery,
        status: filterStatus,
        role: filterRole
      });

      if (filterPremium !== 'all') {
        params.append('premium', filterPremium);
      }

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (data.users) {
        // Transform the data to match our component structure
        const transformedUsers = data.users.map(user => ({
          _id: user.id || user._id,
          username: user.username || user.email.split('@')[0],
          email: user.email,
          role: user.role || 'user',
          status: user.isActive !== false ? 'active' : 'inactive',
          isPremium: user.isPremium || false,
          premiumExpiry: user.premiumExpiry ? new Date(user.premiumExpiry) : null,
          currentStreak: user.stats?.currentStreak || 0,
          totalXP: user.stats?.totalXP || 0,
          problemsSolved: user.stats?.problemsSolved || 0,
          lastActiveAt: user.stats?.lastActive ? new Date(user.stats.lastActive) : user.updatedAt ? new Date(user.updatedAt) : new Date(),
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          avatar: user.userInfo?.profilePicture || null,
          location: user.userInfo?.city && user.userInfo?.country ? `${user.userInfo.city}, ${user.userInfo.country}` : null
        }));

        setUsers(transformedUsers);
        setStats(prev => ({
          ...prev,
          totalUsers: data.pagination.total
        }));
        setTotalPages(data.pagination.pages);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch users:', data.error);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const fetchUserStats = async (showLoader = false) => {
    try {
      const response = await fetch('/api/admin/users/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        // Fallback stats calculation from current users
        const activeUsers = users.filter(u => u.status === 'active').length;
        const premiumUsers = users.filter(u => u.isPremium).length;
        const bannedUsers = users.filter(u => u.status === 'inactive' || u.status === 'banned').length;
        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
          activeUsers,
          premiumUsers,
          bannedUsers,
          newUsersToday: 0
        }));
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleBanUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          action: 'deactivate',
          data: { banReason }
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        setShowBanModal(false);
        setBanReason("");
        setSelectedUser(null);
        fetchUsers();
      } else {
        console.error('Failed to ban user:', data.error);
      }
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'activate'
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        fetchUsers();
      } else {
        console.error('Failed to unban user:', data.error);
      }
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  };

  const handlePremiumToggle = async (userId, isPremium) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'update',
          data: {
            user: {
              isPremium: !isPremium,
              premiumExpiry: !isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
            }
          }
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        fetchUsers();
      } else {
        console.error('Failed to update premium status:', data.error);
      }
    } catch (error) {
      console.error("Error updating premium status:", error);
    }
  };

  const handleResetStreak = async (userId) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'update',
          data: {
            user: { currentStreak: 0 }
          }
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        fetchUsers();
      } else {
        console.error('Failed to reset streak:', data.error);
      }
    } catch (error) {
      console.error("Error resetting streak:", error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-500/20 theme-accent";
      case "moderator": return "bg-blue-500/20 text-blue-400";
      case "user": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "inactive": return "bg-yellow-500/20 text-yellow-400";
      case "banned": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStreakColor = (streak) => {
    if (streak >= 50) return "text-orange-400";
    if (streak >= 20) return "text-yellow-400";
    if (streak >= 5) return "text-green-400";
    return "text-gray-400";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-white">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <p className="text-gray-400">Manage platform users, roles, and permissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="theme-surface-elevated/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{(stats.totalUsers || 0).toLocaleString()}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="theme-surface-elevated/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{(stats.activeUsers || 0).toLocaleString()}</p>
              </div>
              <ShieldCheckIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="theme-surface-elevated/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Premium Users</p>
                <p className="text-2xl font-bold text-white">{(stats.premiumUsers || 0).toLocaleString()}</p>
              </div>
              <StarIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="theme-surface-elevated/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Banned Users</p>
                <p className="text-2xl font-bold text-white">{(stats.bannedUsers || 0).toLocaleString()}</p>
              </div>
              <NoSymbolIcon className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full theme-surface-elevated border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="theme-surface-elevated border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="theme-surface-elevated border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>

        <select
          value={filterPremium}
          onChange={(e) => setFilterPremium(e.target.value)}
          className="theme-surface-elevated border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Memberships</option>
          <option value="premium">Premium Only</option>
          <option value="free">Free Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="theme-surface backdrop-blur-sm rounded-xl border border-slate-600/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="theme-surface-elevated/50">
              <tr>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">User</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Role</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Premium</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Streak</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">XP</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Last Active</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600/50">
              {users.map((user) => (
                <tr key={user._id} className="hover:theme-surface-elevated/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{user.username}</h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">{user.problemsSolved} problems solved</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                      {user.status === "banned" && user.banReason && (
                        <span className="ml-1" title={user.banReason}>ℹ️</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {user.isPremium ? (
                        <div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
                            <StarIcon className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Until {formatDate(user.premiumExpiry)}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400">
                          Free
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <FireIcon className={`w-4 h-4 ${getStreakColor(user.currentStreak)}`} />
                      <span className={`font-medium ${getStreakColor(user.currentStreak)}`}>
                        {user.currentStreak}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{(user.totalXP || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-white">{getTimeAgo(user.lastActiveAt)}</span>
                      <p className="text-gray-400 text-xs">{formatDate(user.lastActiveAt)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      
                      {user.status === "banned" ? (
                        <button
                          onClick={() => handleUnbanUser(user._id)}
                          className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                          title="Unban User"
                        >
                          <ShieldCheckIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowBanModal(true);
                          }}
                          className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                          title="Ban User"
                        >
                          <NoSymbolIcon className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handlePremiumToggle(user._id, user.isPremium)}
                        className={`p-1 rounded transition-colors ${
                          user.isPremium 
                            ? "text-yellow-400 hover:text-yellow-300" 
                            : "text-gray-400 hover:text-yellow-400"
                        }`}
                        title={user.isPremium ? "Downgrade Premium" : "Upgrade to Premium"}
                      >
                        <StarIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleResetStreak(user._id)}
                        className="text-orange-400 hover:text-orange-300 p-1 rounded transition-colors"
                        title="Reset Streak"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban User Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-surface rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Ban User</h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to ban "{selectedUser?.username}"?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for ban (required)
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
                className="w-full theme-surface-elevated border border-slate-600 text-white px-3 py-2 rounded-lg"
                placeholder="Enter the reason for banning this user..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason("");
                }}
                className="px-4 py-2 bg-slate-600 hover:theme-surface-elevated text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                disabled={!banReason.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="theme-surface rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-white text-xl font-semibold">{selectedUser.username}</h4>
                  <p className="text-gray-400">{selectedUser.email}</p>
                  <p className="text-gray-500 text-sm">
                    Member since {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="theme-surface-elevated/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedUser.problemsSolved}</p>
                  <p className="text-gray-400 text-sm">Problems Solved</p>
                </div>
                <div className="theme-surface-elevated/50 rounded-lg p-4 text-center">
                  <p className={`text-2xl font-bold ${getStreakColor(selectedUser.currentStreak)}`}>
                    {selectedUser.currentStreak}
                  </p>
                  <p className="text-gray-400 text-sm">Current Streak</p>
                </div>
                <div className="theme-surface-elevated/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{(selectedUser.totalXP || 0).toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Total XP</p>
                </div>
                <div className="theme-surface-elevated/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedUser.role}</p>
                  <p className="text-gray-400 text-sm">Role</p>
                </div>
              </div>

              {/* Account Info */}
              <div className="theme-surface-elevated/50 rounded-lg p-4">
                <h5 className="text-white font-medium mb-3">Account Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Status:</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400">Premium:</p>
                    <p className="text-white">
                      {selectedUser.isPremium ? `Yes (until ${formatDate(selectedUser.premiumExpiry)})` : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Last Active:</p>
                    <p className="text-white">{formatDate(selectedUser.lastActiveAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Location:</p>
                    <p className="text-white">{selectedUser.location || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {selectedUser.status === "banned" && selectedUser.banReason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h5 className="text-red-400 font-medium mb-2">Ban Reason</h5>
                  <p className="text-gray-300">{selectedUser.banReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
