"use client";
import { useState, useEffect } from "react";

export default function SystemSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      } else {
        console.error('Failed to fetch settings:', data.message);
        // Set default settings
        setSettings({
          siteName: "UPCODE",
          maintenanceMode: false,
          registrationEnabled: true,
          emailNotifications: true
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setSettings({
        siteName: "UPCODE",
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true
      });
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
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings: " + data.message);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    }
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
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-gray-400">Configure platform settings and preferences</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName || ''}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
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
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
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
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
