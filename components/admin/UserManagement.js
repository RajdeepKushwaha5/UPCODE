"use client";
import { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  TrashIcon,
  EyeIcon,
  XCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Simulated data - replace with actual API call
      setTimeout(() => {
        setUsers([
          {
            id: 1,
            username: "john_doe",
            email: "john.doe@email.com",
            role: "user",
            status: "active",
            joinDate: "2024-01-15",
            lastActive: "2024-01-20",
            problemsSolved: 45,
            premium: false
          },
          {
            id: 2,
            username: "admin",
            email: "admin@upcode.com",
            role: "admin",
            status: "active",
            joinDate: "2024-01-01",
            lastActive: "2024-01-20",
            problemsSolved: 123,
            premium: true
          },
          {
            id: 3,
            username: "mike_coder",
            email: "mike@email.com",
            role: "user",
            status: "banned",
            joinDate: "2024-01-10",
            lastActive: "2024-01-18",
            problemsSolved: 23,
            premium: false
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "text-purple-400 bg-purple-400/10";
      case "moderator": return "text-blue-400 bg-blue-400/10";
      case "user": return "text-gray-400 bg-gray-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-400/10";
      case "banned": return "text-red-400 bg-red-400/10";
      case "suspended": return "text-yellow-400 bg-yellow-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const handleUserAction = (userId, action) => {
    // Implement actual user actions here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage platform users and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Export Users
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Send Notification
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="suspended">Suspended</option>
          </select>

          <div className="flex items-center space-x-2">
            <UserCircleIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">
              {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Problems Solved</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.username}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.problemsSolved}</td>
                  <td className="px-6 py-4 text-gray-300">{user.joinDate}</td>
                  <td className="px-6 py-4 text-gray-300">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    {user.premium ? (
                      <span className="text-yellow-400">⭐ Premium</span>
                    ) : (
                      <span className="text-gray-400">Free</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleUserAction(user.id, "view")}
                        className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded"
                        title="View Profile"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleUserAction(user.id, "promote")}
                        className="p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 rounded"
                        title="Promote Role"
                      >
                        <ShieldCheckIcon className="w-4 h-4" />
                      </button>
                      {user.status === "banned" ? (
                        <button 
                          onClick={() => handleUserAction(user.id, "unban")}
                          className="p-1 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded"
                          title="Unban User"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUserAction(user.id, "ban")}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
                          title="Ban User"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleUserAction(user.id, "delete")}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
                        title="Delete User"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-white">{users.length}</div>
          <div className="text-gray-400">Total Users</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-green-400">
            {users.filter(u => u.status === "active").length}
          </div>
          <div className="text-gray-400">Active Users</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-yellow-400">
            {users.filter(u => u.premium).length}
          </div>
          <div className="text-gray-400">Premium Users</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="text-2xl font-bold text-red-400">
            {users.filter(u => u.status === "banned").length}
          </div>
          <div className="text-gray-400">Banned Users</div>
        </div>
      </div>
    </div>
  );
}