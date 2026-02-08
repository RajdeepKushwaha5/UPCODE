"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "../../lib/axios";
import Chart from "chart.js/auto";
import { toast, Toaster } from "react-hot-toast";
import { FaFire, FaCrown, FaTrophy, FaCode, FaChartLine, FaEdit, FaSave, FaTimes, FaGraduationCap, FaUsers, FaClock, FaLightbulb, FaRocket, FaHeart, FaStar, FaGift, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

export default function ProfileSection() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Profile edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedPetEmoji, setSelectedPetEmoji] = useState("🐱");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // User data state
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    petEmoji: "🐱",
    problemsSolved: {
      total: 0,
      easy: 0,
      medium: 0,
      hard: 0
    },
    streakDays: 0,
    currentRating: 0,
    weeklyGoal: 5,
    completedToday: 0,
    strongAreas: [],
    weakAreas: [],
    badges: [],
    joinDate: new Date(),
    isPremium: false
  });

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pet emoji options
  const petEmojis = ["🐱", "🐶", "🐰", "🐯", "🐻", "🦊", "🐼", "🐨", "🐸", "🐙", "🦄", "🐲", "🦁", "🐮", "🐷", "🐹", "🐺", "🦝", "🦒", "🐘"];

  // Fetch user data
  async function fetchUserInfo() {
    try {
      setLoading(true);
      const response = await axios.get("/api/getUserInfo");
      const data = response.data;

      // Handle null or empty data from API
      const safeData = data || {};

      // Set default values for new users
      const defaultUserData = {
        name: safeData.name || session?.user?.name || "User",
        username: safeData.username || session?.user?.email?.split('@')[0] || "",
        email: safeData.email || session?.user?.email || "",
        petEmoji: safeData.petEmoji || "🐱",
        problemsSolved: {
          total: safeData.problemsSolved?.total || 0,
          easy: safeData.problemsSolved?.easy || 0,
          medium: safeData.problemsSolved?.medium || 0,
          hard: safeData.problemsSolved?.hard || 0
        },
        streakDays: safeData.streakDays || 0,
        currentRating: safeData.currentRating || 800,
        weeklyGoal: safeData.weeklyGoal || 5,
        completedToday: safeData.completedToday || 0,
        strongAreas: safeData.strongAreas || [],
        weakAreas: safeData.weakAreas || ["Arrays", "Dynamic Programming", "Graph Theory"],
        badges: safeData.badges || [],
        joinDate: safeData.joinDate ? new Date(safeData.joinDate) : new Date(),
        isPremium: safeData.isPremium || false
      };

      setUserData(defaultUserData);
      setEditName(defaultUserData.name);
      setSelectedPetEmoji(defaultUserData.petEmoji);

      // Fetch bookmarked problems
      await fetchBookmarkedProblems();

    } catch (error) {
      console.error("Error fetching user info:", error);
      // Set default values for error case
      const fallbackUserData = {
        name: session?.user?.name || "User",
        username: session?.user?.email?.split('@')[0] || "user",
        email: session?.user?.email || "",
        petEmoji: "🐱",
        problemsSolved: {
          total: 0,
          easy: 0,
          medium: 0,
          hard: 0
        },
        streakDays: 0,
        currentRating: 800,
        weeklyGoal: 5,
        completedToday: 0,
        strongAreas: [],
        weakAreas: ["Arrays", "Dynamic Programming", "Graph Theory"],
        badges: [],
        joinDate: new Date(),
        isPremium: false
      };

      setUserData(fallbackUserData);
      setEditName(fallbackUserData.name);
      setSelectedPetEmoji(fallbackUserData.petEmoji);
    } finally {
      setLoading(false);
    }
  }

  // Fetch bookmarked problems
  async function fetchBookmarkedProblems() {
    try {
      const response = await axios.get("/api/user/bookmarks");
      const data = response.data;
      setBookmarkedQuestions(data.bookmarkedQuestions || []);
    } catch (error) {
      console.error("Error fetching bookmarked problems:", error);
      setBookmarkedQuestions([]);
    }
  }  // Update user profile
  async function updateProfile(updates) {
    try {
      await axios.post("/api/updateProfile", updates);
      toast.success("Profile updated successfully!", {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#ffffff',
          fontWeight: 'bold',
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  }

  // Handle name save
  const handleNameSave = () => {
    setUserData({ ...userData, name: editName });
    updateProfile({ name: editName });
    setIsEditingName(false);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setSelectedPetEmoji(emoji);
    setUserData({ ...userData, petEmoji: emoji });
    updateProfile({ petEmoji: emoji });
    setShowEmojiPicker(false);
    toast.success(`Pet emoji updated to ${emoji}!`);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUserInfo();
    }
  }, [status, router]);

  // Create rating chart
  useEffect(() => {
    if (!loading && userData.currentRating >= 0) {
      createRatingChart();
    }
  }, [loading, userData.currentRating]);

  function createRatingChart() {
    const ratingsData = [800, 850, 900, 950, 1000, 1100, 1200, userData.currentRating || 0];

    const chartData = {
      labels: ratingsData.map((_, index) => index + 1),
      datasets: [
        {
          label: "Contest Ratings",
          data: ratingsData,
          borderColor: "rgba(147, 51, 234, 1)",
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "rgba(147, 51, 234, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Contest Number",
            color: 'rgb(156, 163, 175)'
          },
          ticks: {
            color: 'rgb(156, 163, 175)'
          },
          grid: {
            color: "rgba(156, 163, 175, 0.1)"
          },
        },
        y: {
          title: {
            display: true,
            text: "Rating",
            color: 'rgb(156, 163, 175)'
          },
          ticks: {
            color: 'rgb(156, 163, 175)'
          },
          grid: {
            color: 'rgba(156, 163, 175, 0.1)'
          }
        },
      },
    };

    const ctx = document.getElementById("contestRatingChart");
    if (ctx) {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions,
      });
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaRocket className="text-3xl animate-bounce" style={{ color: 'var(--accent)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const progressPercentage = userData.weeklyGoal > 0 ? (userData.completedToday / userData.weeklyGoal) * 100 : 0;

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Pet Emoji Avatar */}
              <div className="relative group">
                <div
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-4xl cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                  onClick={() => setShowEmojiPicker(true)}
                >
                  {userData.petEmoji}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                  ✓
                </div>
              </div>

              {/* Welcome Message */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-3xl font-black bg-transparent border-b-2 border-purple-400 focus:outline-none focus:border-pink-400 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        autoFocus
                      />
                      <button
                        onClick={handleNameSave}
                        className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                      >
                        <FaSave className="text-white" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setEditName(userData.name);
                        }}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                      >
                        <FaTimes className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Welcome back, {userData.name}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors group"
                      >
                        <FaEdit className="group-hover:theme-accent" style={{ color: 'var(--text-secondary)' }} />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  @{userData.username} • Member since {
                    userData.joinDate && userData.joinDate instanceof Date 
                      ? userData.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : userData.joinDate 
                        ? new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : 'Recently'
                  }
                  {userData.isPremium && (
                    <span className="ml-2 inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-sm font-bold">
                      <FaCrown className="text-xs" />
                      PREMIUM
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer group">
                <div className="flex items-center gap-2 mb-1">
                  <FaFire className="text-white text-xl group-hover:animate-bounce" />
                  <span className="text-2xl font-black text-white">{userData.streakDays}</span>
                </div>
                <p className="text-orange-100 text-sm font-medium">Day Streak</p>
              </div>

              <div className="theme-surface backdrop-blur-sm border border theme-border rounded-2xl p-4 text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  {userData.currentRating}
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Problem Solving Progress */}
            <div className="theme-surface backdrop-blur-sm border border theme-border rounded-3xl p-6 hover:border theme-border transition-all duration-300 animate-fade-in-up animation-delay-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <FaCode className="theme-accent" />
                Problem Solving Progress
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black text-white">{userData.problemsSolved.total}</span>
                  </div>
                  <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>Total Solved</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black text-white">{userData.problemsSolved.easy}</span>
                  </div>
                  <p className="text-green-400 font-medium">Easy</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black text-white">{userData.problemsSolved.medium}</span>
                  </div>
                  <p className="text-yellow-400 font-medium">Medium</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black text-white">{userData.problemsSolved.hard}</span>
                  </div>
                  <p className="text-red-400 font-medium">Hard</p>
                </div>
              </div>

              {/* Weekly Goal Progress */}
              <div className="theme-surface-elevated/30 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Weekly Goal Progress</span>
                  <span className="theme-accent font-bold">{userData.completedToday}/{userData.weeklyGoal}</span>
                </div>
                <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: 'var(--surface-raised)' }}>
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strong Areas */}
              <div className="theme-surface backdrop-blur-sm border border-green-500/20 rounded-3xl p-6 hover:border-green-400/50 transition-all duration-300 animate-fade-in-up animation-delay-400">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaCheckCircle className="text-green-400" />
                  Strong Areas
                </h3>
                {userData.strongAreas.length > 0 ? (
                  <div className="space-y-2">
                    {userData.strongAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-2 bg-green-500/10 rounded-lg p-2">
                        <FaStar className="text-green-400 text-sm" />
                        <span className="text-green-300 font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaLightbulb className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Keep solving problems to discover your strengths!</p>
                  </div>
                )}
              </div>

              {/* Weak Areas */}
              <div className="theme-surface backdrop-blur-sm border border-orange-500/20 rounded-3xl p-6 hover:border-orange-400/50 transition-all duration-300 animate-fade-in-up animation-delay-500">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaChartLine className="text-orange-400" />
                  Areas to Improve
                </h3>
                {userData.weakAreas.length > 0 ? (
                  <div className="space-y-2">
                    {userData.weakAreas.map((area, index) => (
                      <div key={index} className="flex items-center justify-between bg-orange-500/10 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <FaRocket className="text-orange-400 text-sm" />
                          <span className="text-orange-300 font-medium">{area}</span>
                        </div>
                        <Link href={`/problems?topic=${area.toLowerCase()}`} className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded transition-colors">
                          Practice
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaTrophy className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>You're doing great! No weak areas identified yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Chart */}
            <div className="theme-surface backdrop-blur-sm border border theme-border rounded-3xl p-6 hover:border theme-border transition-all duration-300 animate-fade-in-up animation-delay-600">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <FaChartLine className="theme-accent" />
                Rating Progress
              </h2>
              <div className="w-full">
                <canvas id="contestRatingChart"></canvas>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="theme-surface backdrop-blur-sm border border theme-border rounded-3xl p-6 hover:border theme-border transition-all duration-300 animate-fade-in-up animation-delay-300">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FaRocket className="theme-accent" />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link href="/problems" className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 hover:from-purple-700 hover:to-pink-700 rounded-xl p-3 transition-all duration-300 hover:scale-105 group">
                  <FaCode className="text-white" />
                  <span className="text-white font-medium">Resume Practice</span>
                  <FaRocket className="text-white ml-auto group-hover:animate-bounce" />
                </Link>

                <Link href="/problems?daily=true" className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl p-3 transition-all duration-300 hover:scale-105 group">
                  <FaCalendarAlt className="text-white" />
                  <span className="text-white font-medium">Daily Challenge</span>
                  <FaGift className="text-white ml-auto group-hover:animate-bounce" />
                </Link>

                <Link href="/contests" className="flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-xl p-3 transition-all duration-300 hover:scale-105 group">
                  <FaTrophy className="text-white" />
                  <span className="text-white font-medium">Join Contest</span>
                  <FaCrown className="text-white ml-auto group-hover:animate-bounce" />
                </Link>

                <Link href="/interview" className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl p-3 transition-all duration-300 hover:scale-105 group">
                  <FaUsers className="text-white" />
                  <span className="text-white font-medium">Mock Interview</span>
                  <FaGraduationCap className="text-white ml-auto group-hover:animate-bounce" />
                </Link>
              </div>
            </div>

            {/* Achievements & Badges */}
            <div className="theme-surface backdrop-blur-sm border border-yellow-500/20 rounded-3xl p-6 hover:border-yellow-400/50 transition-all duration-300 animate-fade-in-up animation-delay-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FaTrophy className="text-yellow-400" />
                Achievements
              </h3>

              {userData.badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {userData.badges.map((badge, index) => (
                    <div key={index} className="text-center group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-2xl">{badge.icon}</span>
                      </div>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{badge.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaTrophy className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Start solving problems to earn your first badge!</p>
                </div>
              )}

              {/* Locked badges preview */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>Coming Soon:</p>
                <div className="grid grid-cols-3 gap-3">
                  {[<FaTrophy key="t" className="text-yellow-400" />, <FaFire key="f" className="text-orange-400" />, <FaStar key="s" className="text-blue-400" />].map((icon, index) => (
                    <div key={index} className="text-center opacity-50">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-1" style={{ backgroundColor: 'var(--surface-raised)' }}>
                        <span className="text-lg">{icon}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Locked</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Upgrade */}
            {!userData.isPremium && (
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-6 hover:border-yellow-400/50 transition-all duration-300 animate-fade-in-up animation-delay-800">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaCrown className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Unlock AI assistance, premium problems, and advanced analytics
                  </p>
                  <Link href="/premium" className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                    Upgrade Now
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bookmarked Questions Section */}
        <div className="mt-8 theme-surface backdrop-blur-sm border border-yellow-500/20 rounded-3xl p-6 hover:border-yellow-400/50 transition-all duration-300 animate-fade-in-up animation-delay-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <FaHeart className="text-yellow-400" />
            Bookmarked Questions
          </h2>

          {bookmarkedQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedQuestions.map((question, index) => (
                <Link
                  key={index}
                  href={`/problems/${question.id}`}
                  className="block p-4 theme-surface-elevated/50 hover:theme-surface-elevated/80 rounded-lg border hover:border-yellow-400/50 transition-all duration-300 group"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium group-hover:text-yellow-300 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {question.title}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                        question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                      }`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span>#{question.id}</span>
                    <span>•</span>
                    <span>{question.acceptanceRate}% acceptance</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaHeart className="text-6xl mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>No bookmarked questions yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>Bookmark problems you want to revisit later</p>
              <Link
                href="/problems"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <FaRocket />
                Browse Problems
              </Link>
            </div>
          )}
        </div>

        {/* Next Contest Countdown */}
        <div className="mt-8 theme-surface backdrop-blur-sm border border-blue-500/20 rounded-3xl p-6 hover:border-blue-400/50 transition-all duration-300 animate-fade-in-up animation-delay-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <FaClock className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Next Contest</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Weekly Challenge #156</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                2d 14h 32m
              </div>
              <Link href="/contests" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View Details →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="theme-bg border border-purple-500/30 rounded-3xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Choose Your Pet</h2>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="hover:text-white text-2xl" style={{ color: 'var(--text-secondary)' }}
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {petEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`w-12 h-12 text-2xl rounded-xl hover:bg-purple-500/20 transition-all duration-300 hover:scale-110 ${selectedPetEmoji === emoji ? 'bg-purple-500/30 scale-110' : ''
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
