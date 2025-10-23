"use client";
import { useState, useEffect } from "react";

export default function ThemeManagement() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data
    setTimeout(() => {
      setThemes([
        { id: 1, name: "Dark Theme", isDefault: true, active: true },
        { id: 2, name: "Light Theme", isDefault: false, active: true },
        { id: 3, name: "Purple Theme", isDefault: false, active: false }
      ]);
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
        <h1 className="text-2xl font-bold text-white">Theme Management</h1>
        <p className="text-gray-400">Manage platform themes and customization</p>
      </div>

      <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Available Themes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div key={theme.id} className="p-4 theme-surface-elevated/30 rounded-lg border border-slate-600">
              <h3 className="text-white font-medium mb-2">{theme.name}</h3>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs ${theme.isDefault ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                  {theme.isDefault ? 'Default' : 'Custom'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={theme.active} />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
