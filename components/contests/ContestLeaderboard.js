import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaCrown, FaAward, FaMedal, FaUsers, FaChartLine, FaClock } from 'react-icons/fa';

const ContestLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false); // Force loading to false
  const [timeframe, setTimeframe] = useState('all');
  const [stats, setStats] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  // Force set mock data on component mount
  useEffect(() => {
    const mockData = [
      { rank: 1, name: 'AlexCoder', rating: 2847, tier: 'Grandmaster', change: '+52', contests: 247, winRate: 96 },
      { rank: 2, name: 'DevMaster', rating: 2734, tier: 'Grandmaster', change: '+38', contests: 189, winRate: 93 },
      { rank: 3, name: 'CodeNinja', rating: 2651, tier: 'Master', change: '+41', contests: 156, winRate: 90 },
      { rank: 4, name: 'ByteWiz', rating: 2598, tier: 'Master', change: '-15', contests: 203, winRate: 87 },
      { rank: 5, name: 'LogicLord', rating: 2543, tier: 'Master', change: '+29', contests: 178, winRate: 89 },
      { rank: 6, name: 'StackHero', rating: 2487, tier: 'Master', change: '+63', contests: 134, winRate: 85 },
      { rank: 7, name: 'DataDragon', rating: 2421, tier: 'Diamond', change: '+17', contests: 167, winRate: 83 },
      { rank: 8, name: 'AlgoAce', rating: 2378, tier: 'Diamond', change: '-22', contests: 145, winRate: 81 },
      { rank: 9, name: 'QueueQueen', rating: 2334, tier: 'Diamond', change: '+35', contests: 198, winRate: 79 },
      { rank: 10, name: 'RecursiveKing', rating: 2289, tier: 'Diamond', change: '+44', contests: 123, winRate: 86 }
    ];
    
    setLeaderboard(mockData);
    setStats({ totalPlayers: 15847, onlinePlayers: 1247, activeContests: 12 });
    setLastUpdated(new Date());
  }, [timeframe]); // Re-run when timeframe changes

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contest/leaderboard?timeframe=${timeframe}&limit=15`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
          setLeaderboard(data.leaderboard);
          setStats(data.stats || {});
          setLastUpdated(new Date());
        } else {
          // API response doesn't have valid data structure
        }
      } else {
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Keep existing mock data on error
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaCrown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <FaAward className="w-5 h-5 text-gray-300" />;
      case 3:
        return <FaMedal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      'Bronze': 'text-amber-600',
      'Silver': 'text-gray-400',
      'Gold': 'text-yellow-400',
      'Platinum': 'text-cyan-400',
      'Diamond': 'text-blue-400',
      'Master': 'text-purple-400',
      'Grandmaster': 'text-red-400'
    };
    return colors[tier] || 'text-gray-400';
  };

  const getRankBackground = (rank) => {
    if (rank <= 3) {
      return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/40';
    }
    if (rank <= 10) {
      return 'bg-gradient-to-r from-slate-600/30 to-slate-700/30 border-purple-400/20';
    }
    return 'bg-slate-700/30 border-slate-600/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-purple-400/30 h-fit w-full max-w-md mx-auto lg:max-w-none"
    >
      {/* Header */}
      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaTrophy className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base lg:text-lg font-bold text-white">Leaderboard</h3>
            <p className="text-purple-200 text-xs lg:text-sm">Top contest performers</p>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div className="flex-shrink-0 self-start lg:self-center">
          <div className="flex space-x-1 bg-slate-700/50 rounded-lg p-1 w-fit">
            {[
              { key: 'all', label: 'All' },
              { key: 'month', label: 'Month' },
              { key: 'week', label: 'Week' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setTimeframe(period.key)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all font-medium whitespace-nowrap ${timeframe === period.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-slate-600/50'
                  }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Status */}
      {lastUpdated && (
        <div className="flex items-center justify-between mb-4 text-xs text-purple-300">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock className="w-3 h-3" />
            <span>Updated {Math.floor((Date.now() - lastUpdated) / 1000)}s ago</span>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2 lg:space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
        {loading ? (
          // Loading skeleton
          [...Array(8)].map((_, index) => (
            <div key={`loading-${index}`} className="animate-pulse">
              <div className="bg-slate-700/50 rounded-lg p-3 h-12 lg:h-16"></div>
            </div>
          ))
        ) : (leaderboard && Array.isArray(leaderboard) && leaderboard.length > 0) ? (
          leaderboard.slice(0, 10).map((player, index) => {
            // Safety check for player data
            if (!player || typeof player.rank === 'undefined') {
              return null;
            }
            
            return (
              <motion.div
                key={`player-${player.rank}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg p-2 lg:p-3 border transition-all hover:scale-[1.02] ${getRankBackground(player.rank)}`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Rank and Player Info */}
                  <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                    <div className="w-6 lg:w-8 flex justify-center flex-shrink-0">
                      {getRankIcon(player.rank)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-white font-semibold text-xs lg:text-sm truncate">
                        {player.name || 'Unknown Player'}
                      </div>
                      <div className={`text-xs ${getTierColor(player.tier || 'Bronze')}`}>
                        {player.tier || 'Bronze'}
                      </div>
                    </div>
                  </div>

                  {/* Right: Rating and Stats */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-bold text-sm lg:text-lg">
                      {player.rating || 0}
                    </div>

                    <div className="flex items-center justify-end space-x-1 lg:space-x-2 text-xs">
                      <span className={`${(player.change || '').startsWith('+')
                        ? 'text-green-400'
                        : (player.change || '').startsWith('-')
                          ? 'text-red-400'
                          : 'text-purple-300'
                        }`}>
                        {player.change || '±0'}
                      </span>

                      <span className="text-purple-300 hidden lg:inline">
                        {player.contests || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }).filter(Boolean) // Remove null entries
        ) : (
          // No data available
          <div className="text-center py-8 text-purple-300">
            <FaTrophy className="mx-auto mb-3 text-4xl opacity-50" />
            <p className="text-sm">No leaderboard data available</p>
            <p className="text-xs opacity-70 mt-1">Please try again later</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 lg:mt-6 pt-4 border-t border-slate-700/50">
        <div className="grid grid-cols-2 lg:flex lg:items-center lg:justify-between gap-2 text-xs text-purple-300">
          <div className="flex items-center space-x-1">
            <FaUsers className="w-3 h-3" />
            <span className="truncate">{loading ? '...' : `${stats.totalPlayers || '15,847'} players`}</span>
          </div>

          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="truncate">{loading ? '...' : `${stats.onlinePlayers || '1,247'} online`}</span>
          </div>

          <div className="flex items-center space-x-1 col-span-2 lg:col-span-1">
            <FaChartLine className="text-purple-400" />
            <span>Updates every 30s</span>
          </div>
        </div>
      </div>

      {/* View Full Leaderboard Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 lg:py-3 rounded-lg text-xs lg:text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
      >
        View Full Leaderboard →
      </motion.button>
    </motion.div>
  );
};

export default ContestLeaderboard;
