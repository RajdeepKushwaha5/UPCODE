"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaClock,
  FaCode,
  FaPlay,
  FaStop,
  FaPaperPlane,
  FaTrophy,
  FaCrown,
  FaFire,
  FaBolt,
  FaChartLine,
  FaUsers,
  FaSpinner,
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaArrowLeft,
  FaRocket
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CodeEditorWindow from '@/components/shared/CodeEditorWindow';
import LanguagesDropdown from '@/components/shared/LanguagesDropdown';
import { languagesData } from '@/constants';

const ContestBattleArena = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestId = searchParams.get('contestId');

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(languagesData[0]);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const pollInterval = useRef(null);
  const timerInterval = useRef(null);

  useEffect(() => {
    if (!contestId || !session) {
      router.push('/contests');
      return;
    }

    fetchContestStatus();
    startPolling();
    startTimer();

    return () => {
      stopPolling();
      stopTimer();
    };
  }, [contestId, session]);

  const startPolling = () => {
    stopPolling();
    pollInterval.current = setInterval(fetchContestStatus, 3000);
  };

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    timerInterval.current = setInterval(updateTimer, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const fetchContestStatus = async () => {
    try {
      const response = await fetch(`/api/contest/modes?contestId=${contestId}`);
      const data = await response.json();

      if (data.success) {
        setContest(data.contest);

        if (data.contest.status === 'ended' && !showResults) {
          setShowResults(true);
          toast.success('Contest ended! Check results.');
        }
      } else {
        toast.error('Contest not found');
        router.push('/contests');
      }
    } catch (error) {
      console.error('Error fetching contest:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimer = () => {
    if (!contest || contest.status !== 'active' || !contest.startedAt) return;

    const startTime = new Date(contest.startedAt).getTime();
    const endTime = startTime + contest.duration;
    const now = Date.now();
    const remaining = Math.max(0, endTime - now);

    if (remaining === 0) {
      setTimeRemaining('00:00');
      if (contest.status === 'active') {
        toast.success('Time\'s up! Contest ended.');
        setShowResults(true);
      }
    } else {
      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  const submitCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contest/modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          contestId,
          submission: {
            problemId: contest.problems[selectedProblem]?.id,
            code,
            language: language.value
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Submission ${data.submission.status}! Score: ${data.submission.score}`);
        setSubmissions(prev => [...prev, data.submission]);

        if (data.contestEnded) {
          setShowResults(true);
          toast.success('Contest ended! Final results are ready.');
        }

        fetchContestStatus(); // Refresh contest state
      } else {
        toast.error(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setSubmitting(true);
    try {
      // Mock code execution - in real app, use Judge0 API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockOutputs = [
        'Hello World!',
        '[1, 2, 3]',
        'true',
        '42',
        'Test case passed ✓'
      ];

      setOutput(mockOutputs[Math.floor(Math.random() * mockOutputs.length)]);
      toast.success('Code executed successfully!');
    } catch (error) {
      toast.error('Execution failed');
      setOutput('Error: Compilation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const leaveContest = async () => {
    try {
      const response = await fetch('/api/contest/modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'leave',
          contestId
        })
      });

      if (response.ok) {
        toast.success('Left contest');
        router.push('/contests');
      }
    } catch (error) {
      toast.error('Failed to leave contest');
    }
  };

  const getCurrentUser = () => {
    return contest?.participants?.find(p => p.email === session?.user?.email);
  };

  const getLeaderboard = () => {
    if (!contest?.participants) return [];

    return [...contest.participants].sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;

      const aLastSubmission = a.submissions?.[a.submissions.length - 1];
      const bLastSubmission = b.submissions?.[b.submissions.length - 1];

      if (!aLastSubmission && !bLastSubmission) return 0;
      if (!aLastSubmission) return 1;
      if (!bLastSubmission) return -1;

      return new Date(aLastSubmission.submittedAt) - new Date(bLastSubmission.submittedAt);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'text-yellow-500';
      case 'active': return 'text-green-500';
      case 'ended': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaCrown className="text-yellow-500" />;
      case 2: return <FaTrophy className="text-gray-400" />;
      case 3: return <FaTrophy className="text-orange-600" />;
      default: return <span className="text-gray-500">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FaTimes className="text-6xl text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Contest not found</p>
          <button
            onClick={() => router.push('/contests')}
            className="px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  const currentUser = getCurrentUser();
  const leaderboard = getLeaderboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/contests')}
                className="p-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-colors"
              >
                <FaArrowLeft />
              </motion.button>

              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaFire className="text-orange-500" />
                  Contest Battle Arena
                </h1>
                <p className="text-gray-400 text-sm">
                  Contest ID: {contest.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              {contest.status === 'active' && timeRemaining && (
                <div className="bg-slate-700 rounded-xl px-4 py-2 flex items-center gap-2">
                  <FaClock className="text-yellow-500" />
                  <span className="font-mono text-white text-lg font-bold">
                    {timeRemaining}
                  </span>
                </div>
              )}

              {/* Status */}
              <div className={`px-4 py-2 rounded-xl font-medium ${getStatusColor(contest.status)} bg-slate-700`}>
                {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
              </div>

              {/* Leaderboard Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
              >
                <FaChartLine className="inline mr-2" />
                Leaderboard
              </motion.button>

              {/* Leave Contest */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={leaveContest}
                className="px-4 py-2 bg-red-600 rounded-xl text-white font-medium hover:bg-red-700 transition-colors"
              >
                Leave
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Selector */}
            {contest.problems && contest.problems.length > 1 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Problems</h3>
                <div className="flex gap-2">
                  {contest.problems.map((problem, index) => (
                    <motion.button
                      key={problem.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedProblem(index)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${selectedProblem === index
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                      Problem {index + 1}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Problem Statement */}
            {contest.problems && contest.problems[selectedProblem] && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {contest.problems[selectedProblem].title}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${contest.problems[selectedProblem].difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      contest.problems[selectedProblem].difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                    }`}>
                    {contest.problems[selectedProblem].difficulty}
                  </span>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {contest.problems[selectedProblem].description}
                </p>

                {/* Examples */}
                {contest.problems[selectedProblem].examples && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Examples:</h4>
                    {contest.problems[selectedProblem].examples.map((example, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-xl p-4 mb-3">
                        <div className="mb-2">
                          <span className="text-gray-400 font-medium">Input:</span>
                          <code className="block bg-slate-800 rounded p-2 mt-1 text-green-400 font-mono text-sm">
                            {example.input}
                          </code>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium">Output:</span>
                          <code className="block bg-slate-800 rounded p-2 mt-1 text-blue-400 font-mono text-sm">
                            {example.output}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {contest.problems[selectedProblem].constraints && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Constraints:</h4>
                    <ul className="space-y-1">
                      {contest.problems[selectedProblem].constraints.map((constraint, idx) => (
                        <li key={idx} className="text-gray-400 text-sm">
                          • {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Code Editor */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Code Editor</h3>
                <LanguagesDropdown
                  selectedLanguage={language}
                  onSelectChange={setLanguage}
                />
              </div>

              <div className="mb-4">
                <CodeEditorWindow
                  code={code}
                  onChange={setCode}
                  language={language?.value || 'python3'}
                  theme="vs-dark"
                />
              </div>

              {/* Custom Input */}
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">Custom Input:</label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full h-24 bg-slate-700 rounded-xl p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your test input here..."
                />
              </div>

              {/* Output */}
              {output && (
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Output:</label>
                  <div className="bg-slate-700 rounded-xl p-3">
                    <code className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                      {output}
                    </code>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={runCode}
                  disabled={submitting || contest.status !== 'active'}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    <>
                      <FaPlay className="inline mr-2" />
                      Run Code
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitCode}
                  disabled={submitting || contest.status !== 'active'}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    <>
                      <FaPaperPlane className="inline mr-2" />
                      Submit Solution
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            {currentUser && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaRocket className="text-blue-500" />
                  Your Stats
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className="text-white font-bold">{currentUser.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submissions:</span>
                    <span className="text-white font-bold">{currentUser.submissions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-white font-bold">{currentUser.rating}</span>
                  </div>
                  {currentUser.placement && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rank:</span>
                      <span className="text-white font-bold flex items-center gap-1">
                        {getRankIcon(currentUser.placement)}
                        #{currentUser.placement}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Live Leaderboard */}
            <AnimatePresence>
              {showLeaderboard && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaTrophy className="text-yellow-500" />
                    Live Leaderboard
                  </h3>

                  <div className="space-y-3">
                    {leaderboard.map((participant, index) => (
                      <motion.div
                        key={participant.email}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-xl ${participant.email === session?.user?.email
                            ? 'bg-purple-600/20 border border-purple-500/30'
                            : 'bg-slate-700/50'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-lg">
                              {getRankIcon(index + 1)}
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {participant.name}
                                {participant.email === session?.user?.email && (
                                  <span className="text-yellow-400 ml-1">⭐</span>
                                )}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {participant.submissions?.length || 0} submissions
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">{participant.score}</div>
                            <div className="text-gray-400 text-sm">pts</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contest Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaUsers className="text-green-500" />
                Contest Info
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-white font-medium">{contest.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Players:</span>
                  <span className="text-white font-medium">
                    {contest.participants.length}/{contest.maxPlayers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Problems:</span>
                  <span className="text-white font-medium">{contest.problems?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator:</span>
                  <span className="text-white font-medium">{contest.creatorName}</span>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            {submissions.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Your Submissions</h3>

                <div className="space-y-3">
                  {submissions.slice(-5).reverse().map((submission, index) => (
                    <div key={index} className="p-3 bg-slate-700/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          Problem {submission.problemId}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${submission.status === 'accepted'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                          }`}>
                          {submission.status === 'accepted' ? (
                            <><FaCheckCircle className="inline mr-1" />Accepted</>
                          ) : (
                            <><FaTimes className="inline mr-1" />Wrong</>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Score: {submission.score}</span>
                        <span>{submission.language}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && contest.results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-3xl p-8 max-w-2xl w-full border border-slate-700 max-h-[80vh] overflow-y-auto"
            >
              <div className="text-center mb-6">
                <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Contest Results</h2>
                <p className="text-gray-400">Final rankings and rating changes</p>
              </div>

              <div className="space-y-4 mb-6">
                {contest.results.rankings.map((participant, index) => (
                  <motion.div
                    key={participant.email}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl ${participant.email === session?.user?.email
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                        : 'bg-slate-700/50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {getRankIcon(index + 1)}
                        </div>
                        <div>
                          <div className="text-white font-bold">
                            {participant.name}
                            {participant.email === session?.user?.email && (
                              <span className="text-yellow-400 ml-2">⭐</span>
                            )}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {participant.submissions?.length || 0} submissions
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-white font-bold text-lg">{participant.score}</div>
                        <div className={`text-sm font-medium ${participant.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                          {participant.ratingChange >= 0 ? '+' : ''}{participant.ratingChange} rating
                        </div>
                        <div className="text-gray-400 text-xs">
                          New: {participant.newRating}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/contests')}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300"
                >
                  Back to Contests
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResults(false)}
                  className="px-6 py-3 bg-slate-700 rounded-xl font-medium text-white hover:bg-slate-600 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContestBattleArena;
