import { useState, useEffect } from 'react'
import { FaTrophy, FaMedal, FaFlag, FaGlobe, FaUsers, FaChartLine, FaStar } from 'react-icons/fa'
import { motion } from 'framer-motion'

const RankingCard = ({ rank, user, isIndian = false }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaTrophy className="w-5 h-5 text-yellow-500" />
      case 2: return <FaMedal className="w-5 h-5 text-gray-400" />
      case 3: return <FaMedal className="w-5 h-5 text-amber-600" />
      default: return <span className="font-bold text-lg">{rank}</span>
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 2400) return 'text-red-500'
    if (rating >= 2100) return 'text-orange-500'
    if (rating >= 1900) return 'text-purple-500'
    if (rating >= 1600) return 'text-blue-500'
    if (rating >= 1400) return 'text-cyan-500'
    if (rating >= 1200) return 'text-green-500'
    return 'text-gray-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className={`group flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:shadow-md ${rank <= 3
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }`}
    >
      {/* Rank indicator */}
      <div className="flex items-center justify-center w-8 h-8">
        {getRankIcon(rank)}
      </div>

      {/* User avatar */}
      <div className="relative">
        <img
          src={user.avatar || '/profile.png'}
          alt={user.handle}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition-colors duration-300"
        />
        {isIndian && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <FaFlag className="w-2 h-2 text-white" />
          </div>
        )}
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {user.handle}
          </h4>
          {user.maxRating && user.maxRating >= 2400 && (
            <FaStar className="w-3 h-3 text-yellow-500" />
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className={`font-semibold ${getRatingColor(user.rating)}`}>
            {user.rating}
          </span>
          {user.maxRating && user.maxRating !== user.rating && (
            <span className="text-gray-500 dark:text-gray-400">
              (max: {user.maxRating})
            </span>
          )}
        </div>
      </div>

      {/* Country flag for global rankings */}
      {!isIndian && user.country && (
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {user.country}
        </div>
      )}
    </motion.div>
  )
}

const RankingsSection = () => {
  const [activeTab, setActiveTab] = useState('global')
  const [globalRankings, setGlobalRankings] = useState([])
  const [indianRankings, setIndianRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    try {
      setLoading(true)

      // Fetch global rankings
      const globalResponse = await fetch('https://codeforces.com/api/user.ratedList?activeOnly=true')
      const globalData = await globalResponse.json()

      if (globalData.status === 'OK') {
        setGlobalRankings(globalData.result.slice(0, 50)) // Top 50 global

        // Filter Indian users from the global rankings
        const indianUsers = globalData.result
          .filter(user => user.country === 'India')
          .slice(0, 30) // Top 30 Indian users

        setIndianRankings(indianUsers)
      }
    } catch (error) {
      console.error('Error fetching rankings:', error)
      // Fallback data in case of API failure
      setGlobalRankings([])
      setIndianRankings([])
    } finally {
      setLoading(false)
    }
  }

  const currentRankings = activeTab === 'global' ? globalRankings : indianRankings

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FaChartLine className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Top Coders
          </h2>
        </div>

        {/* Tab selector */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${activeTab === 'global'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <FaGlobe className="w-4 h-4" />
            Global
          </button>
          <button
            onClick={() => setActiveTab('indian')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${activeTab === 'indian'
                ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <FaFlag className="w-4 h-4" />
            Indian
          </button>
        </div>
      </div>

      {/* Rankings list */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentRankings.length > 0 ? (
          <div className="space-y-2">
            {currentRankings.map((user, index) => (
              <RankingCard
                key={user.handle}
                rank={index + 1}
                user={user}
                isIndian={activeTab === 'indian'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No rankings available</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Data from Codeforces API</span>
          <button
            onClick={fetchRankings}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

export default RankingsSection
