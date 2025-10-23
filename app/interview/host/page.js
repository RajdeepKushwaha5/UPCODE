"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  FaVideo,
  FaUsers,
  FaKey,
  FaCopy,
  FaPlay,
  FaArrowLeft,
  FaSpinner,
  FaClock,
  FaCode,
  FaBrain,
  FaDesktop
} from 'react-icons/fa';

export default function HostInterview() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Interview creation state
  const [interviewData, setInterviewData] = useState({
    title: '',
    description: '',
    type: 'technical-coding',
    company: '',
    role: '',
    duration: 60,
    difficulty: 'medium'
  });

  // Generated interview state
  const [generatedInterview, setGeneratedInterview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const interviewTypes = [
    { id: 'technical-coding', name: 'Technical Coding', icon: FaCode, description: 'Algorithm and data structure problems' },
    { id: 'system-design', name: 'System Design', icon: FaDesktop, description: 'Architecture and scalability questions' },
    { id: 'behavioral', name: 'Behavioral', icon: FaBrain, description: 'Soft skills and experience questions' },
    { id: 'mixed', name: 'Mixed Interview', icon: FaUsers, description: 'Combination of all types' }
  ];

  const difficulties = ['easy', 'medium', 'hard'];
  const durations = [30, 45, 60, 90, 120];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setInterviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate interview ID and password
  const generateInterviewCredentials = () => {
    const id = Math.random().toString(36).substring(2, 15).toUpperCase();
    const password = Math.random().toString(36).substring(2, 10).toUpperCase();
    return { id, password };
  };

  // Create interview session
  const createInterview = async () => {
    if (!interviewData.title.trim()) {
      toast.error('Please provide an interview title');
      return;
    }

    setIsCreating(true);

    try {
      const credentials = generateInterviewCredentials();

      // Simulate API call (you would implement actual backend storage)
      const interview = {
        id: credentials.id,
        password: credentials.password,
        host: session?.user?.email || 'anonymous',
        ...interviewData,
        createdAt: new Date().toISOString(),
        status: 'waiting',
        participants: []
      };

      // Store in localStorage for demo (replace with actual API)
      const existingInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      existingInterviews.push(interview);
      localStorage.setItem('interviews', JSON.stringify(existingInterviews));

      setGeneratedInterview(interview);
      toast.success('Interview created successfully!');

    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('Failed to create interview');
    } finally {
      setIsCreating(false);
    }
  };

  // Copy credentials to clipboard
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Start interview as host
  const startInterviewAsHost = () => {
    const params = new URLSearchParams({
      mode: generatedInterview.type,
      company: generatedInterview.company || 'general',
      role: generatedInterview.role || 'Software Developer',
      interviewId: generatedInterview.id,
      isHost: 'true'
    });

    router.push(`/interview/session?${params.toString()}`);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl theme-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="theme-surface backdrop-blur-sm border-b border theme-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/interview')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-white text-2xl font-bold">Host Interview</h1>
              <p className="text-gray-400">Create and manage interview sessions</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <FaUsers />
            <span>{session?.user?.email || 'Guest'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!generatedInterview ? (
          /* Interview Creation Form */
          <div className="max-w-2xl mx-auto">
            <div className="theme-surface backdrop-blur-sm border border theme-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaVideo className="theme-accent" />
                Create New Interview
              </h2>

              {/* Interview Title */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">Interview Title</label>
                <input
                  type="text"
                  value={interviewData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Senior Frontend Developer Interview"
                  className="w-full theme-surface-elevated/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">Description (Optional)</label>
                <textarea
                  value={interviewData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the interview..."
                  rows={3}
                  className="w-full theme-surface-elevated/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Interview Type */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Interview Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {interviewTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleInputChange('type', type.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${interviewData.type === type.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 theme-surface-elevated/30 hover:border-purple-400'
                          }`}
                      >
                        <IconComponent className={`text-2xl mx-auto mb-2 ${interviewData.type === type.id ? 'theme-accent' : 'text-gray-400'
                          }`} />
                        <div className="text-white font-semibold text-sm">{type.name}</div>
                        <div className="text-gray-400 text-xs mt-1">{type.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Company & Role */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Company (Optional)</label>
                  <input
                    type="text"
                    value={interviewData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g., Google, Microsoft"
                    className="w-full theme-surface-elevated/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Role</label>
                  <input
                    type="text"
                    value={interviewData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    placeholder="e.g., Software Developer"
                    className="w-full theme-surface-elevated/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Duration & Difficulty */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-white font-semibold mb-2">Duration (minutes)</label>
                  <select
                    value={interviewData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="w-full theme-surface-elevated/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration} minutes</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Difficulty</label>
                  <select
                    value={interviewData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full theme-surface-elevated/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={createInterview}
                disabled={isCreating || !interviewData.title.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating Interview...
                  </>
                ) : (
                  <>
                    <FaVideo />
                    Create Interview
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Generated Interview Credentials */
          <div className="max-w-2xl mx-auto">
            <div className="theme-surface backdrop-blur-sm border border theme-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaKey className="text-green-400" />
                Interview Created Successfully!
              </h2>

              <div className="theme-surface-elevated/30 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">{generatedInterview.title}</h3>

                {/* Interview ID */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Interview ID</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-slate-600/50 border border-gray-600 rounded px-4 py-2 text-green-400 font-mono text-lg">
                      {generatedInterview.id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedInterview.id, 'Interview ID')}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Host Password</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-slate-600/50 border border-gray-600 rounded px-4 py-2 text-yellow-400 font-mono text-lg">
                      {generatedInterview.password}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedInterview.password, 'Password')}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>

                {/* Interview Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2">{generatedInterview.type.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white ml-2">{generatedInterview.duration} min</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Difficulty:</span>
                    <span className="text-white ml-2">{generatedInterview.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white ml-2">{new Date(generatedInterview.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-blue-400 font-semibold mb-2">Instructions for Candidates:</h4>
                <ol className="text-gray-300 text-sm space-y-1">
                  <li>1. Go to the "Join Interview" page</li>
                  <li>2. Enter the Interview ID: <code className="text-green-400">{generatedInterview.id}</code></li>
                  <li>3. No password required for candidates</li>
                  <li>4. Wait for the host to start the interview</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={startInterviewAsHost}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaPlay />
                  Start Interview
                </button>
                <button
                  onClick={() => setGeneratedInterview(null)}
                  className="bg-slate-600 hover:theme-surface-elevated text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
