'use client';

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import NavLinks from './NavLinks'
import NavMenu from './NavMenu'
import ThemeButton from './ThemeButton'
import { useTheme } from '../../contexts/ThemeContext'
import { FaSignOutAlt, FaUser, FaCog, FaCrown } from 'react-icons/fa'

const Navbar = () => {
  const { data: session, status } = useSession();
  const userID = session?.user?._id;
  const { isDark } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayProfile = userProfile || (session?.user ? {
    name: session.user.name || 'User',
    petEmoji: '🐱',
    currentRating: 800,
    rank: 'Beginner',
    username: session.user.username || session.user.email?.split('@')[0],
    image: session.user.image
  } : null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.email && !loading) {
        setLoading(true);
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.user);
            if (data.user.needsProfileSetup && window.location.pathname !== '/setup-profile') {
              window.location.href = '/setup-profile';
            }
          } else {
            setUserProfile({
              name: session.user.name || 'User',
              petEmoji: '🐱',
              currentRating: 800,
              rank: 'Beginner',
              username: session.user.username || session.user.email?.split('@')[0],
              image: session.user.image
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile({
            name: session.user.name || 'User',
            petEmoji: '🐱',
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
      const interval = setInterval(fetchUserProfile, 300000);
      return () => clearInterval(interval);
    }
  }, [session, status]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/', redirect: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl border-b'
          : 'backdrop-blur-sm'
      }`}
      style={{
        backgroundColor: scrolled
          ? (isDark ? 'rgba(12, 12, 20, 0.85)' : 'rgba(248, 250, 252, 0.85)')
          : (isDark ? 'rgba(12, 12, 20, 0.6)' : 'rgba(248, 250, 252, 0.6)'),
        borderColor: scrolled ? 'var(--border-primary)' : 'transparent',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className='max-w-7xl mx-auto flex justify-between items-center px-6 py-3'>

        {/* Logo */}
        <Link href='/' className='flex items-center gap-3 group'>
          <div className='relative'>
            <img
              src='/logo.png'
              alt='upcode_logo'
              className='w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md'
            />
          </div>
          <div className='flex flex-col'>
            <h1 className="text-xl font-bold font-space tracking-tight" style={{ color: 'var(--text-primary)' }}>
              UPCODE
            </h1>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: 'var(--text-tertiary)' }}>
              Think Code Thrive
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className='hidden md:flex'>
          <NavLinks user={userID} />
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-2.5'>
          <ThemeButton />

          {/* Profile Section */}
          <div className="relative user-menu">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="group relative flex items-center gap-2 py-1.5 px-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div className="relative">
                    {displayProfile?.petEmoji ? (
                      <div
                        className="w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-full flex items-center justify-center text-xl max-sm:text-lg"
                        style={{
                          background: 'linear-gradient(135deg, var(--accent), #06b6d4)',
                          border: '2px solid var(--border-primary)',
                        }}
                      >
                        <span className="filter drop-shadow-sm">{displayProfile.petEmoji}</span>
                      </div>
                    ) : displayProfile?.image ? (
                      <img
                        src={displayProfile.image}
                        alt="profile"
                        className="w-9 h-9 max-sm:w-8 max-sm:h-8 object-cover rounded-full"
                        style={{ border: '2px solid var(--border-primary)' }}
                      />
                    ) : (
                      <img
                        src="/profile.png"
                        alt="profile"
                        className="w-9 h-9 max-sm:w-8 max-sm:h-8 object-contain rounded-full"
                        style={{ border: '2px solid var(--border-primary)' }}
                      />
                    )}
                  </div>

                  {/* User Info - Hidden on mobile */}
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {displayProfile?.name || session.user.name || 'User'}
                    </div>
                    {displayProfile && (
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {displayProfile.currentRating} • {displayProfile.rank}
                      </div>
                    )}
                  </div>

                  {/* Dropdown chevron */}
                  <svg
                    className={`w-3.5 h-3.5 hidden lg:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-tertiary)' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden z-50 animate-scale-in"
                    style={{
                      backgroundColor: 'var(--surface-base)',
                      border: '1px solid var(--border-primary)',
                      boxShadow: 'var(--shadow-xl)',
                    }}
                  >
                    {/* User Info Header */}
                    <div className="p-4" style={{ background: 'linear-gradient(135deg, var(--accent), #0891b2)' }}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {displayProfile?.petEmoji ? (
                            <div className="w-12 h-12 bg-white/20 rounded-full border-2 border-white/40 flex items-center justify-center text-2xl shadow-lg">
                              <span className="filter drop-shadow-sm">{displayProfile.petEmoji}</span>
                            </div>
                          ) : displayProfile?.image ? (
                            <img src={displayProfile.image} alt="profile" className="w-12 h-12 object-cover rounded-full border-2 border-white/40" />
                          ) : (
                            <img src="/profile.png" alt="profile" className="w-12 h-12 object-contain rounded-full border-2 border-white/40" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {displayProfile?.name || session.user.name || 'User'}
                          </div>
                          <div className="text-sm text-white/80">
                            @{displayProfile?.username || session.user.username || session.user.email?.split('@')[0]}
                          </div>
                        </div>
                      </div>

                      {displayProfile && (
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                            <div className="text-base font-bold text-white">{displayProfile.currentRating}</div>
                            <div className="text-[10px] text-white/70">Rating</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                            <div className="text-base font-bold text-white">{displayProfile.problemsSolved?.total || 0}</div>
                            <div className="text-[10px] text-white/70">Solved</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                            <div className="text-base font-bold text-white">{displayProfile.streakDays || 0}</div>
                            <div className="text-[10px] text-white/70">Streak</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1.5">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        onClick={() => setShowUserMenu(false)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-raised)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FaUser style={{ color: 'var(--accent)' }} />
                        <span className="text-sm">View Profile</span>
                      </Link>

                      <Link
                        href="/edit-profile"
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        onClick={() => setShowUserMenu(false)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-raised)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FaCog style={{ color: 'var(--accent)' }} />
                        <span className="text-sm">Edit Profile</span>
                      </Link>

                      {displayProfile?.isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => setShowUserMenu(false)}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-raised)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <FaCrown className="text-amber-500" />
                          <span className="text-sm">Admin Panel</span>
                        </Link>
                      )}

                      <div className="mx-4 my-1.5" style={{ borderTop: '1px solid var(--divider)' }} />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors"
                        style={{ color: 'var(--error)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--error-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FaSignOutAlt />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button
                  className="flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                    color: '#ffffff',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span>Sign In</span>
                </button>
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
