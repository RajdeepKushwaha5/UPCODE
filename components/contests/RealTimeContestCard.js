import { useState, useEffect } from 'react'
import { FaClock, FaTrophy, FaUsers, FaGlobe, FaFlag, FaCalendarAlt, FaFire } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

// Utility function to format time remaining
const formatTimeRemaining = (targetDate) => {
  const now = new Date().getTime()
  const timeLeft = targetDate.getTime() - now

  if (timeLeft <= 0) return { ended: true }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, ended: false }
}

const RealTimeContestCard = ({ contest }) => {
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const updateTimer = () => {
      const now = new Date()
      let targetDate

      if (contest.phase === 'BEFORE') {
        targetDate = new Date(contest.startTimeSeconds * 1000)
      } else if (contest.phase === 'CODING') {
        targetDate = new Date(contest.startTimeSeconds * 1000 + contest.durationSeconds * 1000)
      }

      if (targetDate) {
        setTimeRemaining(formatTimeRemaining(targetDate))
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [contest])

  // Safe date formatting helper
  const safeDateFormat = (date, options = {}) => {
    if (!isMounted) return '...'
    return date.toLocaleDateString('en-US', options)
  }

  const safeTimeFormat = (date, options = {}) => {
    if (!isMounted) return '...'
    return date.toLocaleTimeString('en-US', options)
  }

  const getContestStatus = () => {
    switch (contest.phase) {
      case 'BEFORE': return { status: 'upcoming', color: 'text-blue-500', bg: 'bg-blue-500/10' }
      case 'CODING': return { status: 'ongoing', color: 'text-green-500', bg: 'bg-green-500/10' }
      case 'FINISHED': return { status: 'ended', color: 'text-gray-500', bg: 'bg-gray-500/10' }
      default: return { status: 'unknown', color: 'text-gray-500', bg: 'bg-gray-500/10' }
    }
  }

  const { status, color, bg } = getContestStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Status indicator */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${color} ${bg} border border-current/20`}>
        {status.toUpperCase()}
      </div>

      <div className="relative p-6">
        {/* Contest icon and type */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform duration-300`}>
            <FaTrophy className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {contest.type || 'Programming Contest'}
            </p>
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
              {contest.name}
            </h3>
          </div>
        </div>

        {/* Contest duration and participants */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <FaClock className="w-4 h-4" />
            <span>{Math.floor(contest.durationSeconds / 3600)}h {Math.floor((contest.durationSeconds % 3600) / 60)}m</span>
          </div>
          {contest.participantCount && (
            <div className="flex items-center gap-1">
              <FaUsers className="w-4 h-4" />
              <span>{contest.participantCount.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Real-time countdown */}
        {timeRemaining && !timeRemaining.ended && (
          <motion.div
            key={`${timeRemaining.days}-${timeRemaining.hours}-${timeRemaining.minutes}-${timeRemaining.seconds}`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <FaFire className={`w-4 h-4 ${status === 'ongoing' ? 'text-orange-500' : 'text-blue-500'}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {status === 'upcoming' ? 'Starts in' : 'Ends in'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: timeRemaining.days, label: 'Days' },
                { value: timeRemaining.hours, label: 'Hours' },
                { value: timeRemaining.minutes, label: 'Mins' },
                { value: timeRemaining.seconds, label: 'Secs' }
              ].map((time, index) => (
                <div key={index} className="text-center">
                  <div className={`bg-gradient-to-br ${status === 'ongoing' ? 'from-orange-500 to-red-500' : 'from-blue-500 to-purple-500'} text-white rounded-lg px-2 py-1 font-bold text-sm`}>
                    {time.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contest date and time */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <FaCalendarAlt className="w-4 h-4" />
          <span>
            {safeDateFormat(new Date(contest.startTimeSeconds * 1000), {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })} at {safeTimeFormat(new Date(contest.startTimeSeconds * 1000), {
              hour: 'numeric',
              minute: '2-digit'
            })}
          </span>
        </div>

        {/* Action button */}
        {status === 'upcoming' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaCalendarAlt className="w-4 h-4" />
            Register / Set Reminder
          </motion.button>
        )}

        {status === 'ongoing' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaFire className="w-4 h-4" />
            Join Contest
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default RealTimeContestCard
