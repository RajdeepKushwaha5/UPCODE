'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaClock, FaCode, FaComments, FaDesktop, FaStar, FaCalendar, FaTrophy, FaChevronRight } from 'react-icons/fa';

export default function InterviewHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.id) {
      fetchInterviewHistory();
    }
  }, [session, status, router]);

  const fetchInterviewHistory = async () => {
    try {
      const response = await fetch(`/api/interview/history?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews || []);
      } else {
        console.error('Failed to fetch interview history');
        // If no interviews found, set empty array
        setInterviews([]);
      }
    } catch (error) {
      console.error('Error fetching interview history:', error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'technical-coding':
        return <FaCode className="text-blue-400" />;
      case 'system-design':
        return <FaDesktop className="text-green-400" />;
      case 'behavioral':
        return <FaComments className="text-purple-400" />;
      default:
        return <FaCode className="text-blue-400" />;
    }
  };

  const getModeLabel = (mode) => {
    switch (mode) {
      case 'technical-coding':
        return 'Technical Coding';
      case 'system-design':
        return 'System Design';
      case 'behavioral':
        return 'Behavioral';
      default:
        return 'Technical';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredInterviews = interviews.filter(interview => {
    if (filter === 'all') return true;
    return interview.mode === filter;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading interview history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FaClock className="text-purple-400" />
            Interview History
          </h1>
          <p className="text-slate-300">Track your interview progress and performance</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Interviews' },
            { key: 'technical-coding', label: 'Technical Coding' },
            { key: 'system-design', label: 'System Design' },
            { key: 'behavioral', label: 'Behavioral' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Interview List */}
        {filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <FaTrophy className="text-6xl text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Interviews Yet</h3>
            <p className="text-slate-400 mb-6">Start your first interview to see your history here</p>
            <button
              onClick={() => router.push('/interview')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start First Interview
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInterviews.map((interview, index) => (
              <div
                key={interview._id || index}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-colors cursor-pointer"
                onClick={() => router.push(`/interview/results/${interview._id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getModeIcon(interview.mode)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {getModeLabel(interview.mode)}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {interview.company !== 'general' ? interview.company : 'General Interview'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-slate-400">
                      <FaCalendar />
                      {new Date(interview.completedAt || interview.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <FaClock />
                      {formatDuration(interview.timeElapsed || 0)}
                    </div>
                    <div className={`flex items-center gap-1 font-semibold ${getScoreColor(interview.evaluation?.overallScore || 0)}`}>
                      <FaStar />
                      {interview.evaluation?.overallScore || 0}%
                    </div>
                    <FaChevronRight className="text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1">Questions</p>
                    <p className="text-white">{interview.questions?.length || 0} completed</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Performance</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (interview.evaluation?.overallScore || 0) >= 80
                              ? 'bg-green-400'
                              : (interview.evaluation?.overallScore || 0) >= 60
                              ? 'bg-yellow-400'
                              : 'bg-red-400'
                          }`}
                          style={{
                            width: `${interview.evaluation?.overallScore || 0}%`
                          }}
                        ></div>
                      </div>
                      <span className={`text-sm ${getScoreColor(interview.evaluation?.overallScore || 0)}`}>
                        {interview.evaluation?.overallScore || 0}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Feedback</p>
                    <p className="text-white">
                      {interview.evaluation?.feedback ? 'Available' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredInterviews.length > 0 && (
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {filteredInterviews.length}
                </p>
                <p className="text-slate-400 text-sm">Total Interviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {Math.round(
                    filteredInterviews.reduce((avg, interview) => 
                      avg + (interview.evaluation?.overallScore || 0), 0
                    ) / filteredInterviews.length
                  )}%
                </p>
                <p className="text-slate-400 text-sm">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {Math.round(
                    filteredInterviews.reduce((avg, interview) => 
                      avg + (interview.timeElapsed || 0), 0
                    ) / filteredInterviews.length / 60
                  )} min
                </p>
                <p className="text-slate-400 text-sm">Avg Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {filteredInterviews.filter(i => (i.evaluation?.overallScore || 0) >= 80).length}
                </p>
                <p className="text-slate-400 text-sm">Excellent Scores</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}