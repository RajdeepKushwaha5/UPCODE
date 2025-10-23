'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FaThumbsUp, 
  FaThumbsDown, 
  FaShare, 
  FaBookmark, 
  FaEye, 
  FaStar, 
  FaClock, 
  FaCode, 
  FaGraduationCap,
  FaRobot,
  FaStickyNote,
  FaPaperPlane,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaBulb,
  FaQuestionCircle,
  FaYoutube
} from 'react-icons/fa';
import { 
  DIFFICULTY_COLORS, 
  COMPANIES 
} from '../utils/constants';

export default function ProblemDetail({ 
  problem,
  userStats = null,
  onToggleLike,
  onToggleBookmark,
  isLiked = false,
  isBookmarked = false
}) {
  const { isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('description');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userNotes, setUserNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [realtimeStats, setRealtimeStats] = useState(null);

  // Initialize AI assistant with problem context and fetch real-time stats
  useEffect(() => {
    if (problem) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Hello! I'm your AI assistant for "${problem.title}". I can help you understand the problem, suggest approaches, explain algorithms, and guide you through the solution. What would you like to know?`,
        timestamp: new Date()
      };
      setAiMessages([welcomeMessage]);
      loadUserNotes();
      fetchProblemStats();
      
      // Set up real-time stats updates every 15 seconds
      const statsInterval = setInterval(fetchProblemStats, 15000);
      return () => clearInterval(statsInterval);
    }
  }, [problem]);

  // Fetch real-time problem statistics
  const fetchProblemStats = async () => {
    if (!problem) return;
    
    try {
      const response = await fetch(`/api/problems/stats?problemId=${problem.id}&difficulty=${problem.difficulty}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRealtimeStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching problem stats:', error);
    }
  };

  // Load user notes from localStorage
  const loadUserNotes = () => {
    try {
      const saved = localStorage.getItem(`notes_${problem.id}`);
      if (saved) {
        setUserNotes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  // Save notes to localStorage
  const saveNotes = (notes) => {
    try {
      localStorage.setItem(`notes_${problem.id}`, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  // AI Assistant Functions
  const sendAiMessage = async () => {
    if (!aiInput.trim() || isAiLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: aiInput,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      // Simulate AI response with problem-specific context
      const aiResponse = await generateAiResponse(aiInput, problem);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setTimeout(() => {
        setAiMessages(prev => [...prev, aiMessage]);
        setIsAiLoading(false);
      }, 1000 + Math.random() * 2000); // Simulate thinking time

    } catch (error) {
      console.error('AI Error:', error);
      setIsAiLoading(false);
    }
  };

  // Generate AI response based on problem context
  const generateAiResponse = async (userInput, problemData) => {
    const input = userInput.toLowerCase();
    
    // Problem-specific responses
    if (input.includes('hint') || input.includes('help')) {
      return `Here are some hints for "${problemData.title}":\n\n${problemData.hints?.map((hint, i) => `${i + 1}. ${hint}`).join('\n') || '• Consider the problem constraints\n• Think about the most efficient approach\n• Break down the problem into smaller parts'}`;
    }
    
    if (input.includes('approach') || input.includes('algorithm')) {
      return `For this problem, I recommend the **${problemData.solution?.approach || 'optimal'}** approach:\n\n**Time Complexity:** ${problemData.solution?.timeComplexity || 'O(n)'}\n**Space Complexity:** ${problemData.solution?.spaceComplexity || 'O(1)'}\n\n**Strategy:**\n${problemData.solution?.explanation || 'Analyze the problem step by step and implement an efficient solution.'}`;
    }
    
    if (input.includes('example') || input.includes('test case')) {
      return `Let me walk you through an example:\n\n**Example:** ${problemData.testCases?.visible?.[0]?.input ? JSON.stringify(problemData.testCases.visible[0].input) : 'Input example'}\n**Expected Output:** ${problemData.testCases?.visible?.[0]?.output ? JSON.stringify(problemData.testCases.visible[0].output) : 'Output example'}\n\nTry tracing through this example step by step to understand the logic.`;
    }
    
    if (input.includes('complexity') || input.includes('optimization')) {
      return `**Time Complexity Analysis:**\n${problemData.solution?.timeComplexity || 'O(n)'} - This is optimal for this problem type.\n\n**Space Complexity:**\n${problemData.solution?.spaceComplexity || 'O(1)'}\n\n**Optimization Tips:**\n• Consider using hash maps for O(1) lookups\n• Think about whether you can solve it in a single pass\n• Look for patterns that can reduce complexity`;
    }
    
    if (input.includes('stuck') || input.includes('confused')) {
      return `Don't worry! Let's break this down:\n\n1. **Understand the problem:** ${problemData.description?.split('.')[0] || 'Read the problem statement carefully'}\n2. **Identify the pattern:** This is a ${problemData.category || 'algorithmic'} problem\n3. **Think about similar problems:** Have you solved problems with ${problemData.tags?.join(', ') || 'similar tags'}?\n4. **Start simple:** Can you solve a smaller version first?\n\nWhat specific part is confusing you?`;
    }
    
    // Default helpful response
    return `Great question! For "${problemData.title}", I can help you with:\n\n• **Understanding the problem** - Breaking down requirements\n• **Choosing an approach** - ${problemData.solution?.approach || 'Best strategy'}\n• **Implementation details** - Code structure and logic\n• **Optimization** - Improving time/space complexity\n• **Testing** - Verifying your solution\n\nWhat would you like to explore?`;
  };

  // Notes Functions
  const addNote = () => {
    if (!noteInput.trim()) return;

    const newNote = {
      id: Date.now(),
      text: noteInput,
      timestamp: new Date(),
      color: ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100'][Math.floor(Math.random() * 4)]
    };

    const updatedNotes = [...userNotes, newNote];
    setUserNotes(updatedNotes);
    saveNotes(updatedNotes);
    setNoteInput('');
  };

  const editNote = (noteId) => {
    const note = userNotes.find(n => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditingText(note.text);
    }
  };

  const saveEditedNote = () => {
    const updatedNotes = userNotes.map(note =>
      note.id === editingNoteId ? { ...note, text: editingText } : note
    );
    setUserNotes(updatedNotes);
    saveNotes(updatedNotes);
    setEditingNoteId(null);
    setEditingText('');
  };

  const deleteNote = (noteId) => {
    const updatedNotes = userNotes.filter(note => note.id !== noteId);
    setUserNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  // Format problem stats
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  const difficultyColor = DIFFICULTY_COLORS[problem?.difficulty?.toLowerCase()] || DIFFICULTY_COLORS.medium;

  const tabs = [
    { id: 'description', label: 'Description', icon: FaEye },
    { id: 'editorial', label: 'Editorial', icon: FaGraduationCap },
    { id: 'solutions', label: 'Solutions', icon: FaCode },
    { id: 'submissions', label: 'Submissions', icon: FaClock },
    { id: 'ai-assistant', label: 'AI Assistant', icon: FaRobot },
    { id: 'notes', label: 'Notes', icon: FaStickyNote }
  ];

  const renderDescription = () => {
    if (!problem?.description) return null;

    // Parse description and format examples
    const parts = problem.description.split(/(?=Example \d+:)/);
    const mainDescription = parts[0];
    const examples = parts.slice(1);

    return (
      <div className="space-y-6">
        {/* Main Description */}
        <div className="text-base leading-relaxed theme-text-secondary">
          {mainDescription.split('\n').map((line, index) => (
            <p key={index} className="mb-3">{line}</p>
          ))}
        </div>

        {/* Examples */}
        {examples.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Examples
            </h3>
            <div className="relative">
              <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-4 pr-2">
                {examples.map((example, index) => {
                  const lines = example.trim().split('\n');
                  return (
                    <div key={index} className="p-4 rounded-lg border theme-surface border theme-border">
                      {lines.map((line, lineIndex) => {
                        if (line.startsWith('Example')) {
                          return (
                            <h4 key={lineIndex} className="font-semibold mb-2 theme-text-secondary">
                              {line}
                            </h4>
                          );
                        }
                        if (line.startsWith('Input:') || line.startsWith('Output:')) {
                          const [label, ...rest] = line.split(':');
                          return (
                            <div key={lineIndex} className="mb-1">
                              <span className="font-medium text-green-400">
                                {label}:
                              </span>
                              <span className="ml-2 font-mono text-sm theme-text-secondary">
                                {rest.join(':')}
                              </span>
                            </div>
                          );
                        }
                        if (line.startsWith('Explanation:')) {
                          return (
                            <div key={lineIndex} className="mt-2">
                              <span className="font-medium text-yellow-400">
                                Explanation:
                              </span>
                              <span className="ml-2 theme-text-secondary">
                                {line.substring(12)}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <p key={lineIndex} className="theme-text-secondary">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              {/* Scroll indicator gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-800/80 to-transparent pointer-events-none rounded-b-lg"></div>
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem?.constraints && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Constraints
            </h3>
            <div className="p-4 rounded-lg border theme-surface border theme-border">
              {problem.constraints.map((constraint, index) => (
                <div key={index} className="font-mono text-sm theme-text-secondary">
                  • {constraint}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {problem?.tags && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-purple-900/30 theme-text-secondary border border theme-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAiAssistant = () => (
    <div className="h-full max-h-96 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 p-4 border rounded-lg theme-surface border theme-border">
        {aiMessages.map(message => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'theme-surface-elevated/50 theme-text-secondary border border theme-border'
            }`}>
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              <div className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isAiLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg theme-surface-elevated/50 border border theme-border">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse theme-text-secondary">AI is thinking...</div>
                <FaRobot className="animate-spin theme-accent" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
          placeholder="Ask me anything about this problem..."
          className="flex-1 p-3 rounded-lg border theme-surface border theme-border text-white placeholder-purple-300/70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isAiLoading}
        />
        <button
          onClick={sendAiMessage}
          disabled={!aiInput.trim() || isAiLoading}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaPaperPlane />
        </button>
      </div>

      {/* Quick Questions */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {['Need a hint?', 'Explain approach', 'Show example', 'I\'m stuck'].map(question => (
            <button
              key={question}
              onClick={() => {
                setAiInput(question);
                setTimeout(sendAiMessage, 100);
              }}
              className="px-3 py-1 text-xs rounded-full border transition-colors border theme-border hover:theme-surface-elevated/50 theme-text-secondary"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-4 max-h-full overflow-y-auto scrollbar-hide">
      {/* Add Note */}
      <div className="flex gap-2 sticky top-0 theme-bg/95 backdrop-blur-sm py-2 z-10">
        <input
          type="text"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addNote()}
          placeholder="Add a note about this problem..."
          className="flex-1 p-3 rounded-lg border theme-surface border theme-border text-white placeholder-purple-300/70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={addNote}
          className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-colors"
        >
          <FaPlus />
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {userNotes.map(note => (
          <div
            key={note.id}
            className="p-4 rounded-lg border theme-surface border theme-border"
          >
            {editingNoteId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full p-2 rounded border theme-surface-elevated/50 border theme-border text-white focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEditedNote}
                    className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded text-sm hover:from-blue-500 hover:to-cyan-500"
                  >
                    <FaSave className="mr-1" /> Save
                  </button>
                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                  >
                    <FaTimes className="mr-1" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm mb-2 theme-text-secondary">
                  {note.text}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs theme-text-secondary/70">
                    {new Date(note.timestamp).toLocaleString()}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => editNote(note.id)}
                      className="p-1 rounded text-xs hover:bg-blue-900/50 text-blue-400 hover:text-blue-300"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 rounded text-xs hover:bg-red-900/50 text-red-400 hover:text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {userNotes.length === 0 && (
          <div className="text-center py-8 theme-text-secondary/70">
            <FaStickyNote className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No notes yet. Add your first note above!</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-500"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border theme-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${difficultyColor.bg} ${difficultyColor.text}`}>
                  {problem?.difficulty || 'Medium'}
                </span>
                {problem?.isPremium && (
                  <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full">
                    Premium
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {problem?.id ? `${problem.id}. ` : ''}{problem?.title || 'Problem Title'}
              </h1>
              
              {/* Problem Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <FaThumbsUp className="text-green-400" />
                  <span className="theme-text-secondary">
                    {formatNumber(problem?.likes || Math.floor(Math.random() * 5000 + 1000))} 
                    ({((problem?.likes || 3000) / ((problem?.likes || 3000) + (problem?.dislikes || 500)) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEye className="text-blue-400" />
                  <span className="theme-text-secondary">
                    {formatNumber(realtimeStats?.totalSubmissions || problem?.totalSubmissions || Math.floor(Math.random() * 100000 + 50000))} submissions
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="theme-text-secondary">
                    {realtimeStats?.acceptanceRate ? `${realtimeStats.acceptanceRate}%` : (problem?.acceptanceRate ? `${problem.acceptanceRate}%` : `${Math.floor(Math.random() * 40 + 30)}%`)} acceptance
                  </span>
                </div>
                {realtimeStats && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Live</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={onToggleLike}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isLiked 
                    ? 'bg-green-600 text-white' 
                    : 'theme-surface hover:theme-surface-elevated/50 theme-text-secondary border border theme-border'
                }`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <FaThumbsUp className="w-4 h-4" />
              </button>
              
              <button
                onClick={onToggleBookmark}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isBookmarked 
                    ? 'bg-yellow-600 text-white' 
                    : 'theme-surface hover:theme-surface-elevated/50 theme-text-secondary border border theme-border'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <FaBookmark className="w-4 h-4" />
              </button>
              
              {/* YouTube Video Link */}
              {problem?.youtubeUrl && (
                <a
                  href={problem.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors border border-red-400/30"
                  title="Watch Solution Video"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              )}
              
              <button
                onClick={() => navigator.share?.({ 
                  title: problem?.title, 
                  url: window.location.href 
                })}
                className="p-2 rounded-lg theme-surface hover:theme-surface-elevated/50 theme-text-secondary border border theme-border transition-all duration-300"
                title="Share"
              >
                <FaShare className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Companies */}
          {problem?.companies && problem.companies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {problem.companies.slice(0, 5).map((company, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-md bg-blue-900/30 text-blue-300 border border-blue-400/30"
                >
                  {company}
                </span>
              ))}
              {problem.companies.length > 5 && (
                <span className="px-2 py-1 text-xs rounded-md theme-surface theme-text-secondary/70 border border-purple-400/20">
                  +{problem.companies.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="border-b border theme-border overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
                  selectedTab === tab.id
                    ? 'theme-accent theme-surface'
                    : 'theme-text-secondary hover:text-white hover:theme-surface/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {selectedTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
          <div className="max-h-full">
            {selectedTab === 'description' && renderDescription()}
            {selectedTab === 'editorial' && (
              <div className="text-center py-12 theme-text-secondary">
                <FaGraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Editorial content coming soon...</p>
              </div>
            )}
            {selectedTab === 'solutions' && (
              <div className="text-center py-12 theme-text-secondary">
                <FaCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Community solutions coming soon...</p>
              </div>
            )}
            {selectedTab === 'submissions' && (
              <div className="text-center py-12 theme-text-secondary">
                <FaClock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your submissions will appear here...</p>
              </div>
            )}
            {selectedTab === 'ai-assistant' && renderAiAssistant()}
            {selectedTab === 'notes' && renderNotes()}
          </div>
        </div>
      </div>
    </div>
  );
}
