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
        <div style={{ color: 'var(--text-primary)' }}>Loading contests...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Contest Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create and manage contests</p>
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
          <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {editingContest ? 'Edit Contest' : 'Create New Contest'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Contest Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border theme-border rounded-lg focus:border-blue-500 focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Contest Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border theme-border rounded-lg focus:border-blue-500 focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="educational">Educational</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 theme-surface border theme-border rounded-lg focus:border-blue-500 focus:outline-none"
                style={{ color: 'var(--text-primary)' }}
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border theme-border rounded-lg focus:border-blue-500 focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border theme-border rounded-lg focus:border-blue-500 focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border theme-border rounded-lg focus:border-blue-500 focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Prize
                </label>
                <input
                  type="text"
                  value={formData.prize}
                  onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border theme-border rounded-lg focus:border-blue-500 focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Rating Range
                </label>
                <input
                  type="text"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3 py-2 theme-surface border theme-border rounded-lg focus:border-blue-500 focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
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
                className="px-6 py-2 theme-surface-elevated rounded-lg hover:opacity-80 transition-colors" style={{ color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contests List */}
      <div className="theme-surface-elevated/30 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b theme-border">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>All Contests</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="theme-surface">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Contest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {contests.map((contest) => (
                <tr key={contest.id} className="hover:theme-surface-elevated/30">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {contest.title}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="capitalize">{contest.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {contest.participants || 0}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
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
            <div style={{ color: 'var(--text-secondary)' }}>No contests found</div>
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
