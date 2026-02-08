"use client";
import { useState, useEffect } from "react";

export default function PremiumControl() {
  const [premiumStats, setPremiumStats] = useState({
    totalSubscribers: 0,
    monthlyRevenue: 0,
    churnRate: 0,
    newSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data
    setTimeout(() => {
      setPremiumStats({
        totalSubscribers: 147,
        monthlyRevenue: 2940,
        churnRate: 5.2,
        newSubscriptions: 23
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
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Premium Control</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage premium subscriptions and features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
          <div className="text-2xl font-bold text-yellow-400">{premiumStats.totalSubscribers}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Subscribers</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
          <div className="text-2xl font-bold text-green-400">${premiumStats.monthlyRevenue}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Monthly Revenue</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
          <div className="text-2xl font-bold text-red-400">{premiumStats.churnRate}%</div>
          <div style={{ color: 'var(--text-secondary)' }}>Churn Rate</div>
        </div>
        <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
          <div className="text-2xl font-bold text-blue-400">{premiumStats.newSubscriptions}</div>
          <div style={{ color: 'var(--text-secondary)' }}>New This Month</div>
        </div>
      </div>

      <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border theme-border">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Premium Features Control</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Advanced Problem Hints</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Allow premium users to access detailed hints</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Video Solutions</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Access to video explanations for problems</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
