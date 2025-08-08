"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCode,
  FaUsers,
  FaCrown,
  FaFire,
  FaClock,
  FaTrophy,
  FaUserPlus,
  FaPlay,
  FaStop,
  FaShare,
  FaSignOutAlt,
  FaSpinner,
  FaRocket,
  FaBolt,
  FaGem,
  FaChartLine,
  FaStar
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ContestModes = () => {
  const { data: session } = useSession();
  const [activeContests, setActiveContests] = useState([]);
  const [availableContests, setAvailableContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [contestId, setContestId] = useState('');
  const pollInterval = useRef(null);

  const contestModes = [
    {
      id: 'codeduel',
      title: 'CodeDuel',
      icon: FaCode,
      players: '2 Players',
      tagline: 'Two coders. One challenge. Let the duel begin.',
      description: 'Step into the ring in this 1v1 coding showdown. Solve identical problems head-to-head and outpace your opponent in logic, speed, and accuracy. Ideal for friendly rivalries and testing sharp instincts.',
      duration: '30 min',
      problems: '1 Problem',
      difficulty: 'Fast-paced',
      color: 'from-red-600 to-orange-600',
      bgColor: 'bg-red-600/20',
      features: ['Head-to-head racing', 'Real-time performance', 'Quick victories'],
      maxPlayers: 2
    },
    {
      id: 'quadrush',
      title: 'QuadRush',
      icon: FaUsers,
      players: '4 Players',
      tagline: 'Four enter. One emerges as the brainiac.',
      description: 'Team up or compete solo in a four-way frenzy. Perfect for tight squads or mini tournaments. Real-time leaderboard updates keep the pressure on till the final compile.',
      duration: '45 min',
      problems: '2 Problems',
      difficulty: 'Balanced',
      color: 'from-blue-600 to-purple-600',
      bgColor: 'bg-blue-600/20',
      features: ['Squad battles', 'Progressive difficulty', 'Team coordination'],
      maxPlayers: 4
    },
    {
      id: 'codebattleground',
      title: 'CodeBattleground',
      icon: FaCrown,
      players: '100 Players',
      tagline: 'Welcome to the ultimate code royale.',
      description: 'This is war. 100 coders enter the arena, armed only with their skills. Solve dynamic problem sets, dodge trick questions, and climb the leaderboard as weaker players drop. Only one can reign supreme.',
      duration: '60 min',
      problems: '3 Problems',
      difficulty: 'Hardcore',
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-600/20',
      features: ['Battle royale style', 'Elimination rounds', 'Glory and fame'],
      maxPlayers: 100
    }
  ];

  // Fetch contests on mount and set up polling
  useEffect(() => {
    if (session) {
      fetchContests();
      startPolling();
    }
    return () => stopPolling();
  }, [session]);

  const startPolling = () => {
    stopPolling();
    pollInterval.current = setInterval(fetchContests, 5000); // Poll every 5 seconds
  };

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  };

  const fetchContests = async () => {
    try {
      const [activeRes, availableRes] = await Promise.all([
        fetch('/api/contest/modes?action=active'),
        fetch('/api/contest/modes?action=available')
      ]);

      if (activeRes.ok) {
        const activeData = await activeRes.json();
        setActiveContests(activeData.contests || []);
      }

      if (availableRes.ok) {
        const availableData = await availableRes.json();
        setAvailableContests(availableData.contests || []);
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
    }
  };

  const createContest = async (mode) => {
    if (!session) {
      toast.error('Please sign in to create contests');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contest/modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode.id,
          action: 'create'
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`${mode.title} contest created! Contest ID: ${data.contestId}`);
        setShowCreateModal(false);
        fetchContests();
      } else {
        toast.error(data.error || 'Failed to create contest');
      }
    } catch (error) {
      console.error('Error creating contest:', error);
      toast.error('Failed to create contest');
    } finally {
      setLoading(false);
    }
  };

  const joinContest = async (contestId) => {
    if (!session) {
      toast.error('Please sign in to join contests');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contest/modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          contestId
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Successfully joined contest!');
        if (data.autoStarted) {
          toast.success('Contest is starting now!');
        }
        setShowJoinModal(false);
        fetchContests();
      } else {
        toast.error(data.error || 'Failed to join contest');
      }
    } catch (error) {
      console.error('Error joining contest:', error);
      toast.error('Failed to join contest');
    } finally {
      setLoading(false);
    }
  };

  const joinByContestId = async () => {
    if (!contestId.trim()) {
      toast.error('Please enter a contest ID');
      return;
    }
    await joinContest(contestId.trim());
    setContestId('');
  };

  const inviteUser = async (contestId, username) => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contest/modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          contestId,
          inviteUsername: username
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Invitation sent to ${username}!`);
        setInviteUsername('');
      } else {
        toast.error(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const leaveContest = async (contestId) => {
    setLoading(true);
    try {
      const response = await fetch('/api/contest/modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'leave',
          contestId
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Left contest successfully');
        fetchContests();
      } else {
        toast.error(data.error || 'Failed to leave contest');
      }
    } catch (error) {
      console.error('Error leaving contest:', error);
      toast.error('Failed to leave contest');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'text-yellow-500 bg-yellow-500/20';
      case 'active': return 'text-green-500 bg-green-500/20';
      case 'ended': return 'text-gray-500 bg-gray-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const formatTimeRemaining = (startedAt, duration) => {
    const start = new Date(startedAt).getTime();
    const end = start + duration;
    const now = Date.now();
    const remaining = Math.max(0, end - now);

    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            <FaFire className="inline mr-4 text-orange-500" />
            Contest Modes
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your battle style and challenge coders worldwide in real-time competitions
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJoinModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300"
          >
            <FaUserPlus className="inline mr-2" />
            Join by Contest ID
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchContests}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300"
          >
            <FaRocket className="inline mr-2" />
            Refresh Contests
          </motion.button>
        </div>
      </div>

      {/* Contest Mode Cards */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {contestModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r opacity-30 group-hover:opacity-50 transition duration-1000 rounded-3xl blur-lg"
                style={{ background: `linear-gradient(135deg, ${mode.color.replace('from-', '').replace('to-', ', ')})` }}>
              </div>

              <div className={`relative bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 ${mode.bgColor} rounded-2xl`}>
                    <mode.icon className={`text-3xl bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{mode.players}</div>
                    <div className="font-semibold text-white">{mode.duration}</div>
                  </div>
                </div>

                {/* Title and Tagline */}
                <div className="mb-4">
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`}>
                    {mode.title}
                  </h3>
                  <p className="text-gray-300 font-medium italic mb-3">
                    "{mode.tagline}"
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {mode.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3">Features:</h4>
                  <div className="space-y-2">
                    {mode.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-300">
                        <FaBolt className="text-yellow-500 mr-2 text-sm" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{mode.problems}</div>
                    <div className="text-xs text-gray-400">Problems</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{mode.difficulty}</div>
                    <div className="text-xs text-gray-400">Difficulty</div>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedMode(mode);
                    setShowCreateModal(true);
                  }}
                  disabled={loading}
                  className={`w-full py-4 bg-gradient-to-r ${mode.color} rounded-2xl font-bold text-white hover:shadow-xl transition-all duration-300 disabled:opacity-50`}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    <>
                      <FaPlay className="inline mr-2" />
                      Create Battle
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Contests */}
      {activeContests.length > 0 && (
        <div className="max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <FaFire className="text-orange-500 mr-3" />
              Your Active Contests
            </h2>

            <div className="grid gap-6">
              {activeContests.map((contest) => (
                <motion.div
                  key={contest.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {contestModes.find(m => m.id === contest.mode)?.title || contest.mode}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(contest.status)}`}>
                          {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                        </span>
                        <span className="text-gray-400">
                          Players: {contest.participants.length}/{contest.maxPlayers}
                        </span>
                        {contest.status === 'active' && contest.startedAt && (
                          <span className="text-yellow-400 font-mono">
                            ⏱️ {formatTimeRemaining(contest.startedAt, contest.duration)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {contest.status === 'waiting' && contest.creator === session?.user?.email && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Username to invite"
                            value={inviteUsername}
                            onChange={(e) => setInviteUsername(e.target.value)}
                            className="px-3 py-2 bg-slate-600 rounded-lg text-white text-sm"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => inviteUser(contest.id, inviteUsername)}
                            className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <FaUserPlus className="inline mr-1" />
                            Invite
                          </motion.button>
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => leaveContest(contest.id)}
                        className="px-4 py-2 bg-red-600 rounded-lg text-white text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        <FaSignOutAlt className="inline mr-1" />
                        Leave
                      </motion.button>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {contest.participants.map((participant, idx) => (
                      <div key={idx} className="bg-slate-600/50 rounded-xl p-3 text-center">
                        <div className="text-white font-medium text-sm mb-1">
                          {participant.name}
                          {participant.email === session?.user?.email && (
                            <span className="text-yellow-400 ml-1">⭐</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Score: {participant.score}
                        </div>
                        {contest.status === 'active' && (
                          <div className="text-green-400 text-xs mt-1">
                            {participant.submissions?.length || 0} submissions
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Contest ID for sharing */}
                  <div className="mt-4 p-3 bg-slate-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Contest ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white text-sm">{contest.id}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            navigator.clipboard.writeText(contest.id);
                            toast.success('Contest ID copied!');
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FaShare />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Available Contests */}
      {availableContests.length > 0 && (
        <div className="max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <FaGem className="text-cyan-500 mr-3" />
              Available Contests
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableContests.map((contest) => (
                <motion.div
                  key={contest.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {contestModes.find(m => m.id === contest.mode)?.title || contest.mode}
                    </h3>
                    <div className="text-sm text-gray-400 mb-2">
                      by {contest.creatorName}
                    </div>
                    <div className="text-sm text-gray-400">
                      {contest.participants.length}/{contest.maxPlayers} players
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => joinContest(contest.id)}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mx-auto" />
                    ) : (
                      <>
                        <FaPlay className="inline mr-2" />
                        Join Contest
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {/* Create Contest Modal */}
        {showCreateModal && selectedMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-slate-700"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Create {selectedMode.title}
              </h3>
              <p className="text-gray-400 mb-6">
                Start a new {selectedMode.title} contest and invite other coders to join the battle!
              </p>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => createContest(selectedMode)}
                  disabled={loading}
                  className={`flex-1 py-3 bg-gradient-to-r ${selectedMode.color} rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50`}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    <>
                      <FaTrophy className="inline mr-2" />
                      Create Battle
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-slate-700 rounded-xl font-medium text-white hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Join Contest Modal */}
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-slate-700"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Join Contest
              </h3>
              <p className="text-gray-400 mb-6">
                Enter the contest ID to join an existing battle!
              </p>

              <input
                type="text"
                placeholder="Enter Contest ID"
                value={contestId}
                onChange={(e) => setContestId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 rounded-xl text-white placeholder-gray-400 border border-slate-600 focus:border-blue-500 focus:outline-none mb-6"
              />

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={joinByContestId}
                  disabled={loading || !contestId.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    <>
                      <FaUserPlus className="inline mr-2" />
                      Join Battle
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowJoinModal(false)}
                  className="px-6 py-3 bg-slate-700 rounded-xl font-medium text-white hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContestModes;
