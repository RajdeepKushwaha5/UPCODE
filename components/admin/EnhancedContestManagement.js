'use client'

import { useState, useEffect } from 'react';

export default function EnhancedContestManagement() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContest, setEditingContest] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'weekly',
    difficulty: 'Medium',
    prize: '$0',
    rating: '1200-2000'
  });

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      const response = await fetch('/api/admin/contests');
      if (response.ok) {
        const data = await response.json();
        setContests(data.contests || []);
      }
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingContest
        ? '/api/admin/contests'
        : '/api/admin/contests';

      const method = editingContest ? 'PUT' : 'POST';
      const payload = editingContest
        ? { contestId: editingContest.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadContests();
        resetForm();
        alert(`Contest ${editingContest ? 'updated' : 'created'} successfully!`);
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (contest) => {
    setEditingContest(contest);
    setFormData({
      title: contest.title,
      description: contest.description,
      start: new Date(contest.start).toISOString().slice(0, 16),
      end: new Date(contest.end).toISOString().slice(0, 16),
      type: contest.type,
      difficulty: contest.difficulty,
      prize: contest.prize,
      rating: contest.rating
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (contestId) => {
    if (!confirm('Are you sure you want to delete this contest?')) return;

    try {
      const response = await fetch('/api/admin/contests', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contestId }),
      });

      if (response.ok) {
        await loadContests();
        alert('Contest deleted successfully!');
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start: '',
      end: '',
      type: 'weekly',
      difficulty: 'Medium',
      prize: '$0',
      rating: '1200-2000'
    });
    setEditingContest(null);
    setShowCreateForm(false);
  };

  const syncExternalContests = async () => {
    try {
      const response = await fetch('/api/codeforces/contests');
      if (response.ok) {
        await loadContests();
        alert('External contests synced successfully!');
      }
    } catch (error) {
      alert('Error syncing external contests: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading contests...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Contest Management</h2>
          <p className="text-gray-400">Create and manage contests</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={syncExternalContests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Sync External Contests
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Contest
          </button>
        </div>
      </div>

      {/* Contest Creation/Edit Form */}
      {showCreateForm && (
        <div className="theme-surface-elevated/50 rounded-xl p-6 mb-6 border border theme-border">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingContest ? 'Edit Contest' : 'Create New Contest'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contest Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contest Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="educational">Educational</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 theme-surface border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prize
                </label>
                <input
                  type="text"
                  value={formData.prize}
                  onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating Range
                </label>
                <input
                  type="text"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingContest ? 'Update Contest' : 'Create Contest'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contests List */}
      <div className="theme-surface-elevated/30 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">All Contests</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="theme-surface">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {contests.map((contest) => (
                <tr key={contest.id} className="hover:theme-surface-elevated/30">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {contest.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(contest.start).toLocaleDateString()} - {new Date(contest.end).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${contest.status === 'live'
                        ? 'bg-green-100 text-green-800'
                        : contest.status === 'upcoming'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {contest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <span className="capitalize">{contest.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {contest.participants || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <span className="capitalize">{contest.source}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(contest)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contest.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {contests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400">No contests found</div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Contest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
