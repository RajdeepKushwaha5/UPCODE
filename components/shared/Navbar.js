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
  const { theme, isDark } = useTheme();
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
    <nav className="w-full theme-surface backdrop-blur-md theme-shadow sticky top-0 z-50 border-b theme-border">
      <div className='max-w-7xl mx-auto flex justify-between items-center px-6 py-4'>

        {/* Logo Section */}
        <Link href='/' className='flex items-center gap-4 group'>
          <div className='relative'>
            <img
              src='/logo.png'
              alt='upcode_logo'
              className='w-12 h-12 object-contain hover:scale-110 transition-all duration-300 ease-out filter drop-shadow-lg'
            />
          </div>
          <div className='flex flex-col'>
            <h1 className="text-2xl font-bold theme-text font-space tracking-tight">
              UPCODE
            </h1>
            <span className="text-xs theme-text-tertiary font-light tracking-widest uppercase">Think Code Thrive</span>
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
                  className="group relative flex items-center gap-2 p-2 rounded-xl theme-surface-elevated hover:opacity-80 transition-all duration-300"
                >
                  <div className="relative">
                    {/* Use pet emoji as the main profile button if available */}
                    {displayProfile?.petEmoji ? (
                      <div className="w-10 h-10 max-sm:w-8 max-sm:h-8 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full border-2 theme-border hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl max-sm:text-xl theme-shadow-lg relative overflow-hidden">
                        <span className="relative z-10 filter drop-shadow-sm">
                          {displayProfile.petEmoji}
                        </span>
                      </div>
                    ) : displayProfile?.image ? (
                      <img
                        src={displayProfile.image}
                        alt="profile"
                        className="w-10 h-10 max-sm:w-8 max-sm:h-8 object-cover rounded-full border-2 theme-border hover:scale-110 transition-all duration-300"
                      />
                    ) : (
                      <img
                        src="/profile.png"
                        alt="profile"
                        className="w-10 h-10 max-sm:w-8 max-sm:h-8 object-contain rounded-full border-2 theme-border hover:scale-110 transition-all duration-300"
                      />
                    )}
                  </div>

                  {/* User Info - Hidden on mobile */}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold theme-text">
                      {displayProfile?.name || session.user.name || 'User'}
                    </div>
                    {displayProfile && (
                      <div className="text-xs theme-text-secondary">
                        Rating: {displayProfile.currentRating} • {displayProfile.rank}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-72 theme-surface rounded-xl theme-shadow-lg border theme-border z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {/* Use pet emoji as primary avatar in dropdown */}
                          {displayProfile?.petEmoji ? (
                            <div className="w-12 h-12 bg-white/20 rounded-full border-2 border-white/50 flex items-center justify-center text-3xl shadow-xl">
                              <span className="filter drop-shadow-sm">
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
                        className="flex items-center gap-3 px-4 py-3 theme-text hover:theme-surface-elevated transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser className="theme-accent" />
                        <span>View Profile</span>
                      </Link>

                      <Link
                        href="/edit-profile"
                        className="flex items-center gap-3 px-4 py-3 theme-text hover:theme-surface-elevated transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaCog className="theme-accent" />
                        <span>Edit Profile</span>
                      </Link>

                      {/* Admin Panel Button - Only show for admin users */}
                      {displayProfile?.isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 theme-text hover:theme-surface-elevated transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaCrown className="text-yellow-500" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <div className="border-t theme-border my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                <img
                  src="/profile.png"
                  alt="profile"
                  className="w-10 h-10 max-sm:w-8 max-sm:h-8 object-contain rounded-full border-2 theme-border hover:scale-110 transition-all duration-300"
                />
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className='md:hidden'>
            <NavMenu user={userID} />
          </div>
        </div>
      </div>

    </nav>
  )
}

export default Navbar