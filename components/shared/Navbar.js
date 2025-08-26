'use client';

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import NavLinks from './NavLinks'
import Image from 'next/image'
import NavMenu from './NavMenu'
import ThemeButton from './ThemeButton'
import { useTheme } from '../../contexts/ThemeContext'
import { FaSignOutAlt, FaUser, FaCog, FaCrown } from 'react-icons/fa'

const Navbar = () => {
  const { data: session, status } = useSession();
  const userID = session?.user?._id;
  const { themeColors } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create fallback profile data immediately when session is available
  const displayProfile = userProfile || (session?.user ? {
    name: session.user.name || 'User',
    petEmoji: '🐱', // Default pet emoji
    currentRating: 800,
    rank: 'Beginner',
    username: session.user.username || session.user.email?.split('@')[0],
    image: session.user.image
  } : null);

  // Fetch real-time user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.email && !loading) {
        setLoading(true);
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.user);

            // Redirect to profile setup if needed
            if (data.user.needsProfileSetup && window.location.pathname !== '/setup-profile') {
              window.location.href = '/setup-profile';
            }
          } else {
            // If profile API fails, use fallback data from session
            setUserProfile({
              name: session.user.name || 'User',
              petEmoji: '🐱', // Default pet emoji
              currentRating: 800,
              rank: 'Beginner',
              username: session.user.username || session.user.email?.split('@')[0],
              image: session.user.image
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to session data on error
          setUserProfile({
            name: session.user.name || 'User',
            petEmoji: '🐱', // Default pet emoji
            currentRating: 800,
            rank: 'Beginner',
            username: session.user.username || session.user.email?.split('@')[0],
            image: session.user.image
          });
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
      // Refresh profile data every 5 minutes
      const interval = setInterval(fetchUserProfile, 300000);
      return () => clearInterval(interval);
    }
  }, [session, status]);

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <nav className={`w-full bg-gradient-to-r ${themeColors.secondary} backdrop-blur-md shadow-2xl sticky top-0 z-50 border-b border-${themeColors.accent}/20`}>
      <div className='max-w-7xl mx-auto flex justify-between items-center px-6 py-4'>

        {/* Logo Section */}
        <Link href='/' className='flex items-center gap-4 group'>
          <div className='relative'>
            <img
              src='/logo.png'
              alt='upcode_logo'
              className='w-12 h-12 object-contain animate-pulse hover:animate-spin hover:scale-110 transition-all duration-500 ease-out filter drop-shadow-lg'
            />
            <div className={`absolute inset-0 bg-${themeColors.accent}/20 rounded-full blur-xl group-hover:bg-${themeColors.accent}/30 transition-all duration-300`}></div>
          </div>
          <div className='flex flex-col'>
            <h1 className={`text-2xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent font-mono tracking-wide`}>
              UPCODE
            </h1>
            <span className={`text-xs text-${themeColors.textSecondary} font-light tracking-widest`}>THINK CODE THRIVE</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className='hidden md:flex'>
          <NavLinks user={userID} />
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-3'>

          {/* Theme Button */}
          <ThemeButton />

          {/* Profile Section */}
          <div className="relative user-menu">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="group relative flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="relative">
                    {/* Use pet emoji as the main profile button if available */}
                    {displayProfile?.petEmoji ? (
                      <div className="w-10 h-10 max-sm:w-8 max-sm:h-8 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 rounded-full border-2 border-purple-500/50 hover:border-purple-500 transition-all duration-300 group-hover:scale-110 flex items-center justify-center text-2xl max-sm:text-xl shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                        <span className="relative z-10 filter drop-shadow-sm">
                          {displayProfile.petEmoji}
                        </span>
                      </div>
                    ) : displayProfile?.image ? (
                      <img
                        src={displayProfile.image}
                        alt="profile"
                        className="w-10 h-10 max-sm:w-8 max-sm:h-8 object-cover rounded-full border-2 border-purple-500/50 hover:border-purple-500 transition-all duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <img
                        src="/profile.png"
                        alt="profile"
                        className="w-10 h-10 max-sm:w-8 max-sm:h-8 object-contain rounded-full border-2 border-purple-500/50 hover:border-purple-500 transition-all duration-300 group-hover:scale-110"
                      />
                    )}
                    <div className={`absolute inset-0 bg-purple-500/20 rounded-full blur-md group-hover:bg-purple-500/40 transition-all duration-300`}></div>
                  </div>

                  {/* User Info - Hidden on mobile */}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {displayProfile?.name || session.user.name || 'User'}
                    </div>
                    {displayProfile && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Rating: {displayProfile.currentRating} • {displayProfile.rank}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {/* Use pet emoji as primary avatar in dropdown */}
                          {displayProfile?.petEmoji ? (
                            <div className="w-12 h-12 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-full border-2 border-white/50 flex items-center justify-center text-3xl shadow-xl relative overflow-hidden backdrop-blur-sm">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
                              <span className="relative z-10 filter drop-shadow-sm">
                                {displayProfile.petEmoji}
                              </span>
                            </div>
                          ) : displayProfile?.image ? (
                            <img
                              src={displayProfile.image}
                              alt="profile"
                              className="w-12 h-12 object-cover rounded-full border-2 border-white/50"
                            />
                          ) : (
                            <img
                              src="/profile.png"
                              alt="profile"
                              className="w-12 h-12 object-contain rounded-full border-2 border-white/50"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {displayProfile?.name || session.user.name || 'User'}
                          </div>
                          <div className="text-sm opacity-90">
                            @{displayProfile?.username || session.user.username || session.user.email?.split('@')[0]}
                          </div>
                        </div>
                      </div>

                      {/* Real-time Stats */}
                      {displayProfile && (
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white/10 rounded-lg p-2">
                            <div className="text-lg font-bold">{displayProfile.currentRating}</div>
                            <div className="text-xs opacity-80">Rating</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2">
                            <div className="text-lg font-bold">{displayProfile.problemsSolved?.total || 0}</div>
                            <div className="text-xs opacity-80">Solved</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2">
                            <div className="text-lg font-bold">{displayProfile.streakDays || 0}</div>
                            <div className="text-xs opacity-80">Streak</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser className="text-purple-500" />
                        <span>View Profile</span>
                      </Link>

                      <Link
                        href="/edit-profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaCog className="text-purple-500" />
                        <span>Edit Profile</span>
                      </Link>

                      {/* Admin Panel Button - Only show for admin users */}
                      {displayProfile?.isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaCrown className="text-yellow-500" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="group relative">
                <div className="relative">
                  <img
                    src="/profile.png"
                    alt="profile"
                    className="w-10 h-10 max-sm:w-8 max-sm:h-8 object-contain rounded-full border-2 border-purple-500/50 hover:border-purple-500 transition-all duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md group-hover:bg-purple-500/40 transition-all duration-300"></div>
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className='md:hidden'>
            <NavMenu user={userID} />
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className={`h-0.5 bg-gradient-to-r from-transparent via-${themeColors.accent} to-transparent animate-pulse`}></div>
    </nav>
  )
}

export default Navbar