"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  FaSignInAlt,
  FaUsers,
  FaSpinner,
  FaArrowLeft,
  FaSearch,
  FaClock,
  FaUser,
  FaKey
} from 'react-icons/fa';

export default function JoinInterview() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Join interview state
  const [interviewId, setInterviewId] = useState('');
  const [candidateName, setCandidateName] = useState(session?.user?.name || '');
  const [isJoining, setIsJoining] = useState(false);
  const [foundInterview, setFoundInterview] = useState(null);

  // Search for interview
  const searchInterview = () => {
    if (!interviewId.trim()) {
      toast.error('Please enter an Interview ID');
      return;
    }

    try {
      // Get interviews from localStorage (replace with actual API)
      const interviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      const interview = interviews.find(i => i.id === interviewId.toUpperCase());

      if (interview) {
        setFoundInterview(interview);
        toast.success('Interview found!');
      } else {
        toast.error('Interview not found. Please check the ID and try again.');
        setFoundInterview(null);
      }
    } catch (error) {
      console.error('Error searching interview:', error);
      toast.error('Error searching for interview');
    }
  };

  // Join interview
  const joinInterview = async () => {
    if (!candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsJoining(true);

    try {
      // Add participant to interview (simulate API call)
      const interviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      const interviewIndex = interviews.findIndex(i => i.id === foundInterview.id);

      if (interviewIndex !== -1) {
        interviews[interviewIndex].participants.push({
          name: candidateName,
          email: session?.user?.email || null,
          joinedAt: new Date().toISOString()
        });
        localStorage.setItem('interviews', JSON.stringify(interviews));
      }

      toast.success('Joining interview...');

      // Navigate to interview session
      const params = new URLSearchParams({
        mode: foundInterview.type,
        company: foundInterview.company || 'general',
        role: foundInterview.role || 'Software Developer',
        interviewId: foundInterview.id,
        candidateName: candidateName
      });

      router.push(`/interview/session?${params.toString()}`);

    } catch (error) {
      console.error('Error joining interview:', error);
      toast.error('Failed to join interview');
    } finally {
      setIsJoining(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/interview')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-white text-2xl font-bold">Join Interview</h1>
              <p className="text-gray-400">Enter interview ID to join session</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <FaUser />
            <span>{session?.user?.name || 'Guest'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FaSignInAlt className="text-blue-400" />
            Join Interview Session
          </h2>

          {/* Interview ID Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Interview ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={interviewId}
                onChange={(e) => setInterviewId(e.target.value.toUpperCase())}
                placeholder="Enter Interview ID (e.g., ABC123DEF)"
                className="flex-1 bg-slate-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none font-mono text-lg"
                maxLength={12}
              />
              <button
                onClick={searchInterview}
                disabled={!interviewId.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                <FaSearch />
                Search
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Get this ID from the interview host
            </p>
          </div>

          {/* Found Interview Info */}
          {foundInterview && (
            <div className="mb-6 bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaUsers className="text-green-400" />
                Interview Found!
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-400">Title:</span>
                  <div className="text-white font-medium">{foundInterview.title}</div>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <div className="text-white">{foundInterview.type.replace('-', ' ')}</div>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <div className="text-white flex items-center gap-1">
                    <FaClock className="text-blue-400" />
                    {foundInterview.duration} minutes
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Difficulty:</span>
                  <div className="text-white">{foundInterview.difficulty}</div>
                </div>
              </div>

              {foundInterview.description && (
                <div className="mb-4">
                  <span className="text-gray-400">Description:</span>
                  <div className="text-white mt-1">{foundInterview.description}</div>
                </div>
              )}

              {foundInterview.participants.length > 0 && (
                <div>
                  <span className="text-gray-400">Participants ({foundInterview.participants.length}):</span>
                  <div className="mt-2 space-y-1">
                    {foundInterview.participants.map((participant, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FaUser className="text-blue-400" />
                        <span className="text-white">{participant.name}</span>
                        <span className="text-gray-400">joined at {new Date(participant.joinedAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Candidate Name Input */}
          {foundInterview && (
            <div className="mb-8">
              <label className="block text-white font-semibold mb-2">Your Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-slate-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <p className="text-gray-400 text-sm mt-2">
                This name will be visible to the interviewer
              </p>
            </div>
          )}

          {/* Join Button */}
          {foundInterview ? (
            <button
              onClick={joinInterview}
              disabled={isJoining || !candidateName.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isJoining ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Joining Interview...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Join Interview
                </>
              )}
            </button>
          ) : (
            <div className="text-center py-8">
              <FaSearch className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Enter an Interview ID to search for available sessions</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">How to Join:</h4>
            <ol className="text-gray-300 text-sm space-y-1">
              <li>1. Get the Interview ID from your interviewer</li>
              <li>2. Enter the ID above and click "Search"</li>
              <li>3. Confirm your name and click "Join Interview"</li>
              <li>4. Wait for the host to start the session</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
