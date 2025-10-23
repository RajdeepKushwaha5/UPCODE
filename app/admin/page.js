"use client";
// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import EnhancedProblemManagement from "@/components/admin/EnhancedProblemManagement";
import EnhancedUserManagement from "@/components/admin/EnhancedUserManagement";
import SubmissionActivityTracking from "@/components/admin/SubmissionActivityTracking";
import ContentEditorialManagement from "@/components/admin/ContentEditorialManagement";
import EnhancedPremiumControl from "@/components/admin/EnhancedPremiumControl";
import ComprehensiveContestManagement from "@/components/admin/ComprehensiveContestManagement";
import Analytics from "@/components/admin/Analytics";
import SystemSettings from "@/components/admin/SystemSettings";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check admin status
    checkAdminStatus();
  }, [session, status]);

  const checkAdminStatus = async () => {
    try {
      // Development bypass - remove in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment && !session) {
        console.log('Development mode: bypassing admin check');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/check-admin");
      const data = await response.json();

      if (data.isAdmin) {
        setIsAdmin(true);
      } else {
        router.push("/"); // Redirect non-admins to home
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      // In development, allow access for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: allowing admin access for testing');
        setIsAdmin(true);
      } else {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "problems":
        return <EnhancedProblemManagement />;
      case "users":
        return <EnhancedUserManagement />;
      case "submissions":
        return <SubmissionActivityTracking />;
      case "content":
        return <ContentEditorialManagement />;
      case "premium":
        return <EnhancedPremiumControl />;
      case "contests":
        return <ComprehensiveContestManagement />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <SystemSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="theme-text text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="theme-text-secondary">You don't have admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg">
      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          user={session?.user}
        />

        {/* Main Content Area */}
        <div className="flex-1 ml-64">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold theme-text">Admin Panel</h1>
                  <p className="theme-text-secondary mt-1">Platform Management & Control</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="theme-text font-medium">{session?.user?.email}</p>
                    <p className="theme-accent text-sm">Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {session?.user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Section Content */}
            <div className="theme-surface rounded-xl p-6 min-h-[600px] border theme-border">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
