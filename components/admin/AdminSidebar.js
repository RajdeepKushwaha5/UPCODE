"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  HomeIcon,
  CodeBracketIcon,
  UsersIcon,
  ShieldCheckIcon,
  StarIcon,
  PaintBrushIcon,
  TrophyIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

export default function AdminSidebar({ activeSection, setActiveSection, user }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "problems", label: "Problem Management", icon: CodeBracketIcon },
    { id: "users", label: "User Management", icon: UsersIcon },
    { id: "submissions", label: "Submission Tracking", icon: DocumentTextIcon },
    { id: "content", label: "Content & Editorial", icon: ShieldCheckIcon },
    { id: "premium", label: "Premium Control", icon: StarIcon },
    { id: "contests", label: "Contest Management", icon: TrophyIcon },
    { id: "analytics", label: "Analytics & Reports", icon: ChartBarIcon },
    { id: "settings", label: "System Settings", icon: Cog6ToothIcon },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-sm border-r border-purple-500/20 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} z-50`}>
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="UPCODE" className="w-5 h-5 filter brightness-0 invert" />
              </div>
              <span className="text-white font-bold text-lg">UPCODE</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {!isCollapsed && (
          <div className="mt-2 text-xs text-purple-400">Admin Panel</div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-slate-800/50"
                }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-purple-500/20">
        {!isCollapsed && (
          <div className="mb-3 px-3 py-2">
            <div className="text-xs text-gray-400">Logged in as</div>
            <div className="text-sm text-white font-medium truncate">
              {user?.email}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Link href="/" className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}>
            <HomeIcon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">Back to Site</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
