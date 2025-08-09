"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaChartLine, FaTrophy, FaClock, FaHistory, FaPlay, FaEye } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function InterviewDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // days

  useEffect(() => {
    if (session?.user) {
      fetchInterviewData();
    }
  }, [session]);

  const fetchInterviewData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-interview/save');
      
      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews || []);
        setStats(data.stats || {});
      } else {
        toast.error('Failed to load interview data');
      }
    } catch (error) {
      console.error('Error fetching interview data:', error);
      toast.error('Error loading interview data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const prepareScoreProgressData = () => {
    if (!interviews.length) return null;

    const recentInterviews = interviews.slice(0, 10).reverse();
    
    return {
      labels: recentInterviews.map((_, index) => `Interview ${index + 1}`),
      datasets: [
        {
          label: 'Overall Score',
          data: recentInterviews.map(interview => interview.overallScore),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Technical Score',
          data: recentInterviews.map(interview => interview.analysis?.technicalScore || 0),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Communication Score',
          data: recentInterviews.map(interview => interview.analysis?.breakdown?.communication || 0),
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: false,
        },
      ],
    };
  };

  const prepareDifficultyData = () => {
    if (!stats?.difficultyStats) return null;

    return {
      labels: Object.keys(stats.difficultyStats).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          data: Object.values(stats.difficultyStats),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',  // Green for Easy
            'rgba(59, 130, 246, 0.8)',  // Blue for Medium  
            'rgba(239, 68, 68, 0.8)',   // Red for Hard
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareRoleData = () => {
    if (!stats?.roleStats) return null;

    const roleLabels = {
      frontend: 'Frontend',
      backend: 'Backend',
      fullstack: 'Full Stack',
      mobile: 'Mobile',
      devops: 'DevOps',
      datascience: 'Data Science'
    };

    return {
      labels: Object.keys(stats.roleStats).map(key => roleLabels[key] || key),
      datasets: [
        {
          data: Object.values(stats.roleStats),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(14, 165, 233, 0.8)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-blue-500 bg-blue-100';
      case 'hard': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!session?.user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your interview dashboard...</div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      title: {
        color: 'white',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Interview Dashboard
            </h1>
            <p className="text-gray-400">Track your AI interview progress and performance</p>
          </div>
          <button
            onClick={() => router.push('/ai-interview')}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <FaPlay />
            <span>New Interview</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Interviews</p>
                <p className="text-3xl font-bold text-white">{stats?.totalInterviews || 0}</p>
              </div>
              <FaHistory className="text-3xl text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats?.averageScore || 0)}`}>
                  {Math.round(stats?.averageScore || 0)}
                </p>
              </div>
              <FaChartLine className="text-3xl text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Best Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats?.bestScore || 0)}`}>
                  {stats?.bestScore || 0}
                </p>
              </div>
              <FaTrophy className="text-3xl text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Time</p>
                <p className="text-3xl font-bold text-white">
                  {stats?.formattedStats?.totalDuration || '0m'}
                </p>
              </div>
              <FaClock className="text-3xl text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {interviews.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Score Progress Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Score Progress</h3>
              {prepareScoreProgressData() && (
                <Line data={prepareScoreProgressData()} options={chartOptions} />
              )}
            </div>

            {/* Difficulty Distribution */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Difficulty Distribution</h3>
              {prepareDifficultyData() && (
                <div className="w-full max-w-sm mx-auto">
                  <Pie data={prepareDifficultyData()} options={pieOptions} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Role Distribution */}
        {stats?.roleStats && Object.keys(stats.roleStats).length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Role Focus</h3>
            <div className="w-full max-w-md mx-auto">
              <Pie data={prepareRoleData()} options={pieOptions} />
            </div>
          </div>
        )}

        {/* Interview History */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Interviews</h3>
            {interviews.length > 5 && (
              <button
                onClick={() => router.push('/ai-interview/history')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </button>
            )}
          </div>

          {interviews.length === 0 ? (
            <div className="text-center py-12">
              <FaHistory className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No interviews yet</p>
              <button
                onClick={() => router.push('/ai-interview')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.slice(0, 5).map((interview, index) => (
                <div key={interview._id || index} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(interview.difficulty)}`}>
                        {interview.difficulty?.charAt(0).toUpperCase() + interview.difficulty?.slice(1)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {interview.roleType?.charAt(0).toUpperCase() + interview.roleType?.slice(1)} Role
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatDuration(interview.duration)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {interview.questions?.length || 0} questions • Completed {new Date(interview.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(interview.overallScore)}`}>
                        {interview.overallScore}
                      </p>
                      <p className="text-gray-400 text-xs">Score</p>
                    </div>
                    <button
                      onClick={() => router.push(`/ai-interview/results/${interview._id}`)}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Improvement Insights */}
        {stats && stats.recentScores && stats.recentScores.length >= 3 && (
          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Trend</p>
                <p className={`text-lg font-semibold ${
                  stats.improvementTrend === 'improving' ? 'text-green-500' :
                  stats.improvementTrend === 'declining' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {stats.improvementTrend === 'improving' ? '📈 Improving' :
                   stats.improvementTrend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Recent Average</p>
                <p className={`text-lg font-semibold ${getScoreColor(stats.recentScores.slice(-3).reduce((a, b) => a + b, 0) / 3)}`}>
                  {Math.round(stats.recentScores.slice(-3).reduce((a, b) => a + b, 0) / 3)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Consistency</p>
                <p className="text-lg font-semibold text-blue-500">
                  {stats.recentScores.length >= 5 ? 'High' : 'Building'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
