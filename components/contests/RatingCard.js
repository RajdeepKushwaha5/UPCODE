import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaTrophy, FaChartLine, FaArrowDown, FaAward, FaBullseye, FaStar } from 'react-icons/fa';

const RatingCard = () => {
  const { data: session } = useSession();
  const [ratingData, setRatingData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchRatingData();
    }
  }, [session]);

  const fetchRatingData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contest/ratings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRatingData(data.stats);
      }
    } catch (error) {
      console.error('Error fetching rating data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <FaTrophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Your Rating</h3>
          <p className="text-gray-400">Sign in to view your contest rating</p>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-12 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="flex space-x-4">
            <div className="h-16 bg-gray-700 rounded flex-1"></div>
            <div className="h-16 bg-gray-700 rounded flex-1"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  const getTierColor = (tier) => {
    const colors = {
      'Bronze': 'from-amber-600 to-orange-600',
      'Silver': 'from-gray-400 to-gray-600',
      'Gold': 'from-yellow-400 to-yellow-600',
      'Platinum': 'from-cyan-400 to-blue-500',
      'Diamond': 'from-blue-400 to-indigo-600',
      'Master': 'from-purple-500 to-pink-600',
      'Grandmaster': 'from-red-500 to-pink-500'
    };
    return colors[tier] || 'from-gray-600 to-gray-800';
  };

  const getTierIcon = (tier) => {
    if (tier === 'Grandmaster' || tier === 'Master') return <FaStar className="w-5 h-5" />;
    if (tier === 'Diamond' || tier === 'Platinum') return <FaAward className="w-5 h-5" />;
    return <FaTrophy className="w-5 h-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Your Rating</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchRatingData}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Refresh
        </motion.button>
      </div>

      {ratingData ? (
        <>
          {/* Current Rating */}
          <div className="text-center mb-6">
            <div className={`w-20 h-20 mx-auto mb-3 bg-gradient-to-r ${getTierColor(ratingData.tier)} rounded-full flex items-center justify-center`}>
              <div className="text-white">
                {getTierIcon(ratingData.tier)}
              </div>
            </div>

            <div className="text-3xl font-bold text-white mb-1">
              {ratingData.rating}
            </div>

            <div className="text-gray-300 mb-1">
              {ratingData.tier}
            </div>

            <div className="text-sm text-gray-400">
              Rank #{ratingData.rank}
            </div>
          </div>

          {/* Progress to Next Tier */}
          {ratingData.nextTier && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{ratingData.tier}</span>
                <span>{ratingData.nextTier}</span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max(10, 100 - (ratingData.pointsToNextTier / 100))}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-2 bg-gradient-to-r ${getTierColor(ratingData.nextTier)} rounded-full`}
                />
              </div>

              <div className="text-xs text-gray-400 mt-1 text-center">
                {ratingData.pointsToNextTier} points to {ratingData.nextTier}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700/50 rounded-lg p-3 text-center">
              <div className="text-blue-400 text-lg font-bold">
                {ratingData.contestsPlayed}
              </div>
              <div className="text-gray-400 text-xs">Contests</div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-3 text-center">
              <div className="text-green-400 text-lg font-bold">
                {ratingData.winRate}%
              </div>
              <div className="text-gray-400 text-xs">Win Rate</div>
            </div>
          </div>

          {/* Recent Form */}
          {ratingData.recentForm && ratingData.recentForm.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Recent Form</div>
              <div className="flex space-x-1">
                {ratingData.recentForm.slice(-8).map((contest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${contest.isWin
                      ? 'bg-green-500 text-white'
                      : contest.isTop3
                        ? 'bg-yellow-500 text-gray-900'
                        : contest.ratingChange > 0
                          ? 'bg-blue-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    title={`Placement: ${contest.placement}, Rating ${contest.ratingChange > 0 ? '+' : ''}${contest.ratingChange}`}
                  >
                    {contest.isWin ? '1' : contest.isTop3 ? '3' : contest.ratingChange > 0 ? '+' : '-'}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Best Rating:</span>
              <span className="text-yellow-400">{ratingData.bestRating}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Placement:</span>
              <span>{ratingData.averagePlacement}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <FaBullseye className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-white font-bold mb-2">Start Your Journey</h4>
          <p className="text-gray-400 text-sm mb-4">
            Participate in contests to earn your rating
          </p>
          <div className="text-2xl font-bold text-gray-300 mb-1">1200</div>
          <div className="text-gray-400 text-sm">Starting Rating</div>
        </div>
      )}
    </motion.div>
  );
};

export default RatingCard;
