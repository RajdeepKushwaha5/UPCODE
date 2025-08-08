"use client";
import { useState, useEffect } from "react";

export default function ContentModeration() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data
    setTimeout(() => {
      setReports([
        {
          id: 1,
          type: "Inappropriate Comment",
          content: "User reported for offensive language",
          reporter: "user123",
          reported: "baduser456",
          status: "pending",
          date: "2024-01-20"
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
      <div>
        <h1 className="text-2xl font-bold text-white">Content Moderation</h1>
        <p className="text-gray-400">Review and moderate user-generated content</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Pending Reports</h2>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="p-4 bg-slate-700/30 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">{report.type}</h3>
                  <p className="text-gray-400 text-sm">{report.content}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Reported by {report.reporter} • {report.date}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
