'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaThumbsUp, 
  FaCheck,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaCode,
  FaQuestionCircle,
  FaLightbulb,
  FaBullhorn,
  FaExclamationTriangle,
  FaTimes,
  FaImage,
  FaPaperPlane,
  FaTrash,
  FaEdit,
  FaReply,
  FaHeart,
  FaFire,
  FaStar,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa';
import Image from 'next/image';

const CommunitySection = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [postingLoading, setPostingLoading] = useState(false);

  // Create post form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'discussion',
    tags: '',
    difficulty: 'beginner',
    images: []
  });

  const categories = [
    { id: 'all', label: 'All Posts', icon: FaBullhorn, color: 'from-purple-500 to-pink-500' },
    { id: 'discussion', label: 'Discussion', icon: FaComment, color: 'from-blue-500 to-cyan-500' },
    { id: 'help', label: 'Help & Support', icon: FaQuestionCircle, color: 'from-red-500 to-orange-500' },
    { id: 'showcase', label: 'Showcase', icon: FaLightbulb, color: 'from-yellow-500 to-amber-500' },
    { id: 'news', label: 'News & Updates', icon: FaBullhorn, color: 'from-green-500 to-emerald-500' },
    { id: 'tutorial', label: 'Tutorials', icon: FaCode, color: 'from-indigo-500 to-purple-500' },
    { id: 'feedback', label: 'Feedback', icon: FaExclamationTriangle, color: 'from-pink-500 to-rose-500' }
  ];

  const difficultyLevels = [
    { id: 'beginner', label: 'Beginner', color: 'text-green-500 bg-green-50 border-green-200' },
    { id: 'intermediate', label: 'Intermediate', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { id: 'advanced', label: 'Advanced', color: 'text-red-600 bg-red-50 border-red-200' },
    { id: 'expert', label: 'Expert', color: 'text-purple-600 bg-purple-50 border-purple-200' }
  ];

  // Fetch posts
  const fetchPosts = async (reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: reset ? '1' : page.toString(),
        limit: '10',
        sort: sortBy,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await fetch(`/api/community/posts?${params}`);
      const data = await response.json();

      if (reset) {
        setPosts(data.posts || []);
        setPage(1);
      } else {
        setPosts(prev => [...prev, ...(data.posts || [])]);
      }
      
      setHasMore(data.pagination?.hasNext || false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, [selectedCategory, sortBy, searchQuery]);

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!session) return;

    try {
      setPostingLoading(true);
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newPost,
          tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (response.ok) {
        setNewPost({
          title: '',
          content: '',
          category: 'discussion',
          tags: '',
          difficulty: 'beginner',
          images: []
        });
        setShowCreatePost(false);
        fetchPosts(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setPostingLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!session || !confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPosts(true);
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  // Vote on post
  const handleVote = async (postId, type) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/community/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        fetchPosts(true);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  // Toggle bookmark
  const handleBookmark = async (postId) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/community/posts/${postId}/bookmark`, {
        method: 'POST'
      });

      if (response.ok) {
        fetchPosts(true);
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(date);
  };

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-20 right-20 text-4xl animate-float animation-delay-1000">💬</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-float animation-delay-500">🚀</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-float">💡</div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full border border theme-border backdrop-blur-sm animate-premium-glow">
            <span className="text-3xl animate-spin-slow">🌟</span>
            <span className="text-white font-semibold font-space-grotesk">Community Hub</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-text-reveal font-space-grotesk tracking-tight mb-6">
            Connect
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed animate-fade-in-up animation-delay-500">
            Join our vibrant community of <span className="theme-accent font-semibold">developers</span>, 
            <span className="text-pink-400 font-semibold"> share knowledge</span>, and 
            <span className="text-blue-400 font-semibold"> grow together</span>
          </p>
          
          {session && (
            <div className="mt-8 animate-fade-in-up animation-delay-1000">
              <button
                onClick={() => setShowCreatePost(true)}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 flex items-center gap-3 mx-auto transform hover:scale-105"
              >
                <FaPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-lg">Create Post</span>
              </button>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-lg border border theme-border rounded-3xl shadow-2xl p-8 mb-12 animate-fade-in-up animation-delay-700">
          
          {/* Search */}
          <div className="relative mb-8">
            <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 theme-accent" />
            <input
              type="text"
              placeholder="Search posts, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 theme-bg/50 border border-purple-500/30 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 font-inter"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'theme-surface text-gray-300 hover:theme-surface-elevated/50 border border-slate-600/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 group-hover:animate-bounce" />
                  <span className="font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <FaSort className="theme-accent" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="theme-bg/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
            >
              <option value="newest">🕒 Newest First</option>
              <option value="oldest">⏰ Oldest First</option>
              <option value="popular">🔥 Most Popular</option>
              <option value="votes">👍 Most Voted</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post._id} className="group bg-gradient-to-r from-slate-800/50 to-purple-800/30 backdrop-blur-lg border border theme-border rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 p-8 transform hover:scale-[1.02] animate-fade-in-up">
              
              {/* Post Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {post.author?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{post.author?.name || 'Anonymous'}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>{formatTimeAgo(post.createdAt)}</span>
                      {post.isResolved && (
                        <span className="flex items-center gap-1 text-green-400">
                          <FaCheck className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                      {post.isPinned && (
                        <span className="flex items-center gap-1 text-yellow-400">
                          <FaStar className="w-3 h-3" />
                          Pinned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Difficulty Badge */}
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    difficultyLevels.find(d => d.id === post.difficulty)?.color || 'text-gray-400 bg-gray-800 border-gray-600'
                  }`}>
                    {post.difficulty}
                  </span>
                  
                  {/* Category Badge */}
                  <span className={`px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${
                    categories.find(c => c.id === post.category)?.color || 'from-gray-500 to-gray-600'
                  }`}>
                    {post.category}
                  </span>

                  {/* Delete button for post author */}
                  {session && session.user.email === post.author?.email && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                      title="Delete post"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:theme-text-secondary transition-colors">{post.title}</h2>
              <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">{post.content}</p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 theme-text-secondary rounded-lg text-sm border border-purple-500/30">
                      <FaTag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-6 border-t border theme-border">
                <div className="flex items-center gap-8">
                  {/* Voting */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVote(post._id, 'upvote')}
                      className="group flex items-center gap-2 text-gray-400 hover:text-green-400 transition-all duration-300 disabled:opacity-50"
                      disabled={!session}
                    >
                      <FaThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">{post.voteScore || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(post._id, 'downvote')}
                      className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      disabled={!session}
                    >
                      <FaThumbsDown className="w-5 h-5 hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaComment className="w-5 h-5" />
                    <span className="font-semibold">{post.stats?.replyCount || 0}</span>
                  </div>

                  {/* Views */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaEye className="w-5 h-5" />
                    <span className="font-semibold">{post.stats?.viewCount || 0}</span>
                  </div>
                </div>

                {/* Bookmark */}
                {session && (
                  <button
                    onClick={() => handleBookmark(post._id)}
                    className="text-gray-400 hover:text-yellow-400 transition-colors p-2 hover:bg-yellow-500/10 rounded-lg"
                  >
                    <FaBookmark className="w-5 h-5 hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12 animate-fade-in-up">
            <button
              onClick={() => {
                setPage(prev => prev + 1);
                fetchPosts();
              }}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? '🔄 Loading...' : '📚 Load More Posts'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-white mb-2">No posts found</h3>
            <p className="text-gray-400 mb-8">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to start a discussion!'}
            </p>
            {session && (
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Create First Post
              </button>
            )}
          </div>
        )}

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gradient-to-br from-slate-800 to-purple-800 border border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Create New Post
                  </h3>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      📝 Title *
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 theme-bg/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter your post title..."
                      required
                      maxLength={200}
                    />
                  </div>

                  {/* Category and Difficulty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        🏷️ Category
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 theme-bg/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      >
                        {categories.slice(1).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        ⭐ Difficulty
                      </label>
                      <select
                        value={newPost.difficulty}
                        onChange={(e) => setNewPost(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="w-full px-4 py-3 theme-bg/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      >
                        {difficultyLevels.map(level => (
                          <option key={level.id} value={level.id}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      💭 Content *
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-4 py-3 theme-bg/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 h-40 resize-none"
                      placeholder="Share your thoughts, ask for help, or start a discussion..."
                      required
                      maxLength={5000}
                    />
                    <div className="text-right text-sm text-gray-400 mt-2">
                      {newPost.content.length}/5000
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      🏷️ Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newPost.tags}
                      onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-3 theme-bg/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="javascript, react, help, beginner..."
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreatePost(false)}
                      className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={postingLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {postingLoading ? (
                        <span>🔄 Creating...</span>
                      ) : (
                        <>
                          <FaPaperPlane className="w-4 h-4" />
                          Create Post
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Login prompt for non-authenticated users */}
        {!session && (
          <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-lg border border theme-border rounded-3xl shadow-2xl p-8 text-center mt-12 animate-fade-in-up">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold text-white mb-3">Join the Community</h3>
            <p className="text-gray-300 mb-6 text-lg">
              Sign in to create posts, vote, and participate in discussions
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105"
            >
              🚀 Sign In to Join
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySection;
