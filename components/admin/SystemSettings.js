"use client";
import { useState, useEffect } from "react";

export default function SystemSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchSettings, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSettings = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      
      console.log('Settings API response:', data); // Debug log
      
      if (data.success) {
        setSettings(data.settings);
        setLastUpdated(new Date(data.settings.lastUpdated || Date.now()));
      } else if (response.status === 401) {
        setError('Please login as an admin to access settings');
      } else if (response.status === 403) {
        setError('Admin privileges required to access settings');
      } else {
        setError(data.message || 'Failed to fetch settings');
        // Set default settings on error
        setSettings({
          siteName: "UPCODE",
          maintenanceMode: false,
          registrationEnabled: true,
          emailNotifications: true,
          contestRegistrationEnabled: true,
          premiumFeaturesEnabled: true,
          communityFeaturesEnabled: true,
          maxSubmissionsPerDay: 100,
          passwordMinLength: 8,
          requireEmailVerification: true,
          enableTwoFactorAuth: false,
          problemSubmissionEnabled: true,
          publicLeaderboards: true,
          allowGuestAccess: true
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError('Failed to connect to settings API');
      setSettings({
        siteName: "UPCODE",
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true,
        contestRegistrationEnabled: true,
        premiumFeaturesEnabled: true,
        communityFeaturesEnabled: true,
        maxSubmissionsPerDay: 100,
        passwordMinLength: 8,
        requireEmailVerification: true,
        enableTwoFactorAuth: false,
        problemSubmissionEnabled: true,
        publicLeaderboards: true,
        allowGuestAccess: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();
      
      console.log('Save settings response:', data); // Debug log
      
      if (data.success) {
        setSettings(data.settings);
        setLastUpdated(new Date(data.settings.lastUpdated || Date.now()));
        setError(null);
        alert("Settings saved successfully!");
      } else {
        setError(data.message || 'Failed to save settings');
        alert("Failed to save settings: " + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setError('Failed to save settings');
      alert("Error saving settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-gray-400">Loading settings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-gray-400">Configure platform settings and preferences</p>
        </div>
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6">
          <div className="text-red-400 font-semibold">Error Loading Settings</div>
          <div className="text-gray-400 text-sm mt-2">{error}</div>
          <button 
            onClick={fetchSettings}
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
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-gray-400">Configure platform settings and preferences</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <button 
          onClick={fetchSettings}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* General Settings */}
      <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName || ''}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="w-full px-4 py-2 theme-surface-elevated/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Maintenance Mode</h3>
              <p className="text-gray-400 text-sm">Enable to temporarily disable site access</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.maintenanceMode || false}
                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">User Registration</h3>
              <p className="text-gray-400 text-sm">Allow new users to register</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.registrationEnabled || false}
                onChange={(e) => handleInputChange('registrationEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Platform Features</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Contest Registration</h3>
              <p className="text-gray-400 text-sm">Allow users to register for contests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.contestRegistrationEnabled || false}
                onChange={(e) => handleInputChange('contestRegistrationEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Premium Features</h3>
              <p className="text-gray-400 text-sm">Enable premium subscription features</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.premiumFeaturesEnabled || false}
                onChange={(e) => handleInputChange('premiumFeaturesEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Community Features</h3>
              <p className="text-gray-400 text-sm">Enable discussions and community interactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.communityFeaturesEnabled || false}
                onChange={(e) => handleInputChange('communityFeaturesEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Problem Submissions</h3>
              <p className="text-gray-400 text-sm">Allow users to submit solutions to problems</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.problemSubmissionEnabled || false}
                onChange={(e) => handleInputChange('problemSubmissionEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Public Leaderboards</h3>
              <p className="text-gray-400 text-sm">Display public ranking and leaderboards</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.publicLeaderboards || false}
                onChange={(e) => handleInputChange('publicLeaderboards', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* System Limits */}
      <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">System Limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Max Submissions Per Day</label>
            <input
              type="number"
              value={settings.maxSubmissionsPerDay || 100}
              onChange={(e) => handleInputChange('maxSubmissionsPerDay', parseInt(e.target.value))}
              className="w-full px-4 py-2 theme-surface-elevated/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Minimum Password Length</label>
            <input
              type="number"
              value={settings.passwordMinLength || 8}
              onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
              className="w-full px-4 py-2 theme-surface-elevated/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Email Verification Required</h3>
              <p className="text-gray-400 text-sm">Require email verification for new accounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.requireEmailVerification || false}
                onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Two-Factor Authentication</h3>
              <p className="text-gray-400 text-sm">Enable 2FA option for enhanced security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.enableTwoFactorAuth || false}
                onChange={(e) => handleInputChange('enableTwoFactorAuth', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Guest Access</h3>
              <p className="text-gray-400 text-sm">Allow guests to browse problems without registration</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.allowGuestAccess || false}
                onChange={(e) => handleInputChange('allowGuestAccess', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 theme-surface-elevated/30 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Email Notifications</h3>
              <p className="text-gray-400 text-sm">Send system notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.emailNotifications || false}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSaveSettings}
          disabled={saving}
          className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
