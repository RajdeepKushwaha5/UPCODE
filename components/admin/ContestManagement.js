"use client";
import { useState, useEffect } from "react";

export default function ContestManagement() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data
    setTimeout(() => {
      setContests([
        {
          id: 1,
          title: "Weekly Challenge #23",
          status: "active",
          participants: 156,
          startDate: "2024-01-20",
          endDate: "2024-01-27",
          problems: 3
        },
        {
          id: 2,
          title: "Monthly Grand Contest",
          status: "upcoming",
          participants: 0,
          startDate: "2024-02-01",
          endDate: "2024-02-03",
          problems: 5
        }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contest Management</h1>
          <p className="text-gray-400">Create and manage programming contests</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Create Contest
        </button>
      </div>

      <div className="theme-surface backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="theme-surface-elevated/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contest</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Problems</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {contests.map((contest) => (
                <tr key={contest.id} className="hover:theme-surface-elevated/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{contest.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${contest.status === 'active' ? 'text-green-400 bg-green-400/10' :
                        contest.status === 'upcoming' ? 'text-blue-400 bg-blue-400/10' :
                          'text-gray-400 bg-gray-400/10'
                      }`}>
                      {contest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{contest.participants}</td>
                  <td className="px-6 py-4 text-gray-300">{contest.startDate} - {contest.endDate}</td>
                  <td className="px-6 py-4 text-gray-300">{contest.problems}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
