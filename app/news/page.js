'use client'
import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { FaFire, FaClock, FaBriefcase, FaNewspaper, FaExternalLinkAlt, FaHeart, FaComments, FaUser, FaExclamationCircle } from 'react-icons/fa';
import CommunitySection from '../../components/CommunitySection';

const NewsPage = () => {
  const [stories, setStories] = useState([]);
  const [selectedOption, setSelectedOption] = useState('top');
  const [pageTitle, setPageTitle] = useState('Top News Articles');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        let url;

        if (selectedOption === 'new') {
          url = 'https://hacker-news.firebaseio.com/v0/newstories.json';
        } else {
          url = `https://hacker-news.firebaseio.com/v0/${selectedOption}stories.json`;
        }

        // Add timeout and better error handling
        const response = await axios.get(url, {
          timeout: 10000, // 10 second timeout
          validateStatus: function (status) {
            return status >= 200 && status < 300; // default
          }
        });
        
        const storyIds = response.data;

        if (!Array.isArray(storyIds)) {
          console.warn(`No story IDs found for ${selectedOption}stories`);
          setStories([]);
          return;
        }

        // Fetch stories with individual error handling
        const storyPromises = storyIds.slice(0, 20).map(async (storyId) => {
          try {
            const response = await axios.get(
              `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
              { timeout: 5000 } // 5 second timeout for individual stories
            );
            return response.data;
          } catch (error) {
            console.warn(`Failed to fetch story ${storyId}:`, error.message);
            return null; // Return null for failed stories
          }
        });

        const stories = await Promise.allSettled(storyPromises);
        const validStories = stories
          .filter(result => result.status === 'fulfilled' && result.value !== null)
          .map(result => result.value)
          .filter(story => story && story.title); // Filter out invalid stories

        setStories(validStories);
      } catch (error) {
        console.error(`Error fetching ${selectedOption} story IDs:`, error);
        // Set empty stories array on error to prevent UI crashes
        setStories([]);
        
        // Set user-friendly error message
        let errorMessage = 'Unable to load news articles. ';
        if (error.code === 'ECONNABORTED') {
          errorMessage += 'Request timed out - please check your internet connection.';
        } else if (error.response) {
          errorMessage += `Server error (${error.response.status}). Please try again later.`;
        } else if (error.request) {
          errorMessage += 'Network error - please check your internet connection.';
        } else {
          errorMessage += 'An unexpected error occurred. Please try again.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedOption]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    const title = option === 'top' ? 'Top News Articles' : option === 'new' ? 'Newest Articles' : 'Job Listings';
    setPageTitle(title);
    document.title = title; 
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getIcon = (type) => {
    switch(type) {
      case 'top': return <FaFire className="text-orange-400" />;
      case 'new': return <FaClock className="text-blue-400" />;
      case 'job': return <FaBriefcase className="text-green-400" />;
      default: return <FaNewspaper className="theme-accent" />;
    }
  };

  const getCategoryGradient = (type) => {
    switch(type) {
      case 'top': return 'from-orange-500 to-red-500';
      case 'new': return 'from-blue-500 to-cyan-500';
      case 'job': return 'from-green-500 to-emerald-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-20 right-20 text-4xl animate-float animation-delay-1000">📰</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-float animation-delay-500">📊</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-float">💼</div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full border border theme-border backdrop-blur-sm animate-premium-glow">
            <span className="text-3xl animate-spin-slow">📡</span>
            <span className="text-white font-semibold font-space-grotesk">Tech News Hub</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-text-reveal font-space-grotesk tracking-tight mb-6">
            News
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed animate-fade-in-up animation-delay-500">
            Stay updated with the latest in <span className="theme-accent font-semibold">technology</span>, 
            <span className="text-pink-400 font-semibold"> programming</span>, and 
            <span className="text-blue-400 font-semibold"> career opportunities</span>
          </p>
        </div>

        {/* Category Selection */}
        <div className="max-w-2xl mx-auto mb-16 animate-fade-in-up animation-delay-1000">
          <div className="theme-surface/40 backdrop-blur-xl rounded-2xl border border-purple-400/20 p-2 shadow-2xl">
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'top', label: 'Top Stories', icon: FaFire, color: 'orange' },
                { key: 'new', label: 'Latest News', icon: FaClock, color: 'blue' },
                { key: 'job', label: 'Job Board', icon: FaBriefcase, color: 'green' }
              ].map((option) => {
                const IconComponent = option.icon;
                const isActive = selectedOption === option.key;
                
                return (
                  <button
                    key={option.key}
                    onClick={() => handleOptionChange(option.key)}
                    className={`
                      relative overflow-hidden py-4 px-6 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 font-inter
                      ${isActive 
                        ? `bg-gradient-to-r ${getCategoryGradient(option.key)} text-white shadow-lg shadow-${option.color}-500/25` 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <IconComponent className={`text-lg ${isActive ? 'animate-icon-bounce' : ''}`} />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shimmer"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-space-grotesk">
              {pageTitle}
            </h2>
          </div>
        </div>
        {/* News Articles Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border theme-border border-t-purple-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-pink-400/20 border-t-pink-400 rounded-full animate-spin animation-delay-500"></div>
              </div>
              <p className="text-gray-400 mt-6 font-inter text-lg">Loading latest stories...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaExclamationCircle className="text-red-500 text-6xl mb-6" />
              <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading News</h3>
              <p className="text-gray-400 text-center max-w-md mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          ) : stories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaNewspaper className="text-gray-400 text-6xl mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No Stories Available</h3>
              <p className="text-gray-400">Please try again later or select a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story, index) => (
                <NewsCard 
                  key={story.id} 
                  story={story} 
                  index={index} 
                  selectedOption={selectedOption}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Community Section */}
      <CommunitySection />
    </div>
  );
};

// News Card Component
const NewsCard = ({ story, index, selectedOption, formatTimeAgo }) => {
  const getCategoryColor = (type) => {
    switch(type) {
      case 'top': return 'from-orange-500/20 to-red-500/20';
      case 'new': return 'from-blue-500/20 to-cyan-500/20';
      case 'job': return 'from-green-500/20 to-emerald-500/20';
      default: return 'from-purple-500/20 to-pink-500/20';
    }
  };

  const getBorderColor = (type) => {
    switch(type) {
      case 'top': return 'border-orange-400/30 hover:border-orange-400/60';
      case 'new': return 'border-blue-400/30 hover:border-blue-400/60';
      case 'job': return 'border-green-400/30 hover:border-green-400/60';
      default: return 'border theme-border hover:border-purple-400/60';
    }
  };

  return (
    <a 
      href={story.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`
        relative overflow-hidden bg-gradient-to-br ${getCategoryColor(selectedOption)} 
        backdrop-blur-xl rounded-2xl border ${getBorderColor(selectedOption)} 
        transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 
        shadow-xl hover:shadow-2xl animate-card-glow p-6 h-full
      `}>
        
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-inter">
              {selectedOption === 'job' ? 'Career' : 'Tech News'}
            </span>
          </div>
          <FaExternalLinkAlt className="text-gray-500 group-hover:text-white transition-colors duration-300" />
        </div>

        {/* Article Title */}
        <h3 className="text-lg font-bold text-white mb-4 line-clamp-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 font-space-grotesk leading-tight">
          {story.title}
        </h3>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
          {story.by && (
            <div className="flex items-center gap-1">
              <FaUser className="text-xs" />
              <span className="font-medium group-hover:theme-text-secondary transition-colors duration-300">
                {story.by}
              </span>
            </div>
          )}
          
          {story.score && (
            <div className="flex items-center gap-1">
              <FaHeart className="text-xs text-red-400" />
              <span className="group-hover:text-red-300 transition-colors duration-300">
                {story.score}
              </span>
            </div>
          )}
          
          {story.descendants !== undefined && (
            <div className="flex items-center gap-1">
              <FaComments className="text-xs text-blue-400" />
              <span className="group-hover:text-blue-300 transition-colors duration-300">
                {story.descendants}
              </span>
            </div>
          )}
        </div>

        {/* Time Stamp */}
        {story.time && (
          <div className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-300 font-mono">
            {formatTimeAgo(story.time)}
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
        
        {/* Category Badge */}
        <div className={`
          absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold 
          bg-gradient-to-r ${selectedOption === 'top' ? 'from-orange-400 to-red-400' : 
                             selectedOption === 'new' ? 'from-blue-400 to-cyan-400' : 
                             'from-green-400 to-emerald-400'} 
          text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 
          transition-all duration-300 font-inter
        `}>
          {selectedOption === 'top' ? 'HOT' : selectedOption === 'new' ? 'NEW' : 'JOB'}
        </div>
      </div>
    </a>
  );
};

export default NewsPage;