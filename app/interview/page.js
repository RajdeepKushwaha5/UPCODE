"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "../../lib/axios";
import { toast, Toaster } from "react-hot-toast";
import TopicSelectionModal from "../../components/interview/TopicSelectionModal";
import {
    FaRobot,
    FaCode,
    FaNetworkWired,
    FaComments,
    FaGoogle,
    FaAmazon,
    FaMicrosoft,
    FaApple,
    FaFacebook,
    FaClock,
    FaTrophy,
    FaStar,
    FaCrown,
    FaPlay,
    FaHistory,
    FaChartLine,
    FaLightbulb,
    FaFire,
    FaGem,
    FaRocket,
    FaVideo,
    FaFileAlt,
    FaBrain,
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaPencilAlt,
    FaBookOpen,
    FaUsers,
    FaRedo
} from 'react-icons/fa';

export default function InterviewPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State management
    const [activeTab, setActiveTab] = useState("modes");
    const [selectedCompany, setSelectedCompany] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [selectedMode, setSelectedMode] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // Interview statistics
    const [stats, setStats] = useState({
        totalInterviews: 0,
        avgScore: 0,
        bestScore: 0,
        completionRate: 0,
        strongAreas: [],
        weakAreas: []
    });

    // Company data
    const companies = [
        { name: "Google", icon: FaGoogle, color: "from-blue-500 to-green-500", problems: 245 },
        { name: "Amazon", icon: FaAmazon, color: "from-orange-500 to-yellow-500", problems: 189 },
        { name: "Microsoft", icon: FaMicrosoft, color: "from-blue-600 to-cyan-500", problems: 156 },
        { name: "Meta", icon: FaFacebook, color: "from-blue-500 to-blue-700", problems: 134 },
        { name: "Apple", icon: FaApple, color: "from-gray-600 to-gray-800", problems: 98 }
    ];

    // Interview modes
    const interviewModes = [
        {
            title: "Technical Coding",
            description: "Time-limited coding problems with AI evaluation",
            icon: FaCode,
            color: "from-blue-600 to-blue-700",
            features: ["Easy, Medium, Hard problems", "Real-time AI feedback", "Code optimization tips"],
            premium: false
        },
        {
            title: "System Design",
            description: "Large-scale design problems with diagram tools",
            icon: FaNetworkWired,
            color: "from-green-600 to-blue-600",
            features: ["Scalability challenges", "Diagram tools", "AI feedback"],
            premium: true
        },
        {
            title: "Behavioral Interview",
            description: "HR-style questions with sentiment analysis",
            icon: FaComments,
            color: "from-orange-600 to-red-600",
            features: ["Communication analysis", "Confidence scoring", "Personalized tips"],
            premium: false
        }
    ];

    // Interview hosting options
    const hostingOptions = [
        {
            title: "Host Interview",
            description: "Create and manage interview sessions with candidates",
            icon: FaVideo,
            color: "from-blue-600 to-indigo-600",
            features: ["Generate unique interview ID", "Host password protection", "Real-time candidate monitoring", "Multiple interview types"],
            action: () => router.push('/interview/host'),
            buttonText: "Create Interview"
        },
        {
            title: "Join Interview",
            description: "Join an existing interview session as a candidate",
            icon: FaRocket,
            color: "from-emerald-600 to-cyan-600",
            features: ["Enter interview ID", "No registration required", "Real-time participation", "Voice conversation support"],
            action: () => router.push('/interview/join'),
            buttonText: "Join Session"
        }
    ];

    // Recent interviews mock data
    const recentInterviews = [
        {
            id: 1,
            company: "Google",
            type: "Technical Coding",
            score: 85,
            date: "2025-08-01",
            duration: "45 min",
            status: "completed"
        },
        {
            id: 2,
            company: "Amazon",
            type: "System Design",
            score: 78,
            date: "2025-07-30",
            duration: "60 min",
            status: "completed"
        },
        {
            id: 3,
            company: "Microsoft",
            type: "Behavioral",
            score: 92,
            date: "2025-07-28",
            duration: "30 min",
            status: "completed"
        }
    ];

    // Remove the redirect - allow users to view the page
    // useEffect(() => {
    //     if (status === "unauthenticated") {
    //         router.push("/login");
    //     }
    // }, [status, router]);

    // Load interview history
    const loadInterviewHistory = async () => {
        if (!session?.user?.id) return;
        
        setIsLoadingHistory(true);
        try {
            const response = await axios.get(`/api/interview/history?userId=${session.user.id}&limit=10`);
            if (response.data.success) {
                setInterviewHistory(response.data.history);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error loading interview history:', error);
            toast.error('Failed to load interview history');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            loadInterviewHistory();
        }
    }, [session?.user?.id]);

    const handleStartInterview = (mode, company = null, isPremium = false) => {
        // Check authentication before allowing to use functionality
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (isPremium && !session?.user?.isPremium) {
            setShowPremiumModal(true);
            return;
        }

        // Store mode for topic selection
        setSelectedMode(mode);
        setShowTopicModal(true);
    };

    const handleTopicSelectionComplete = async (interviewConfig) => {
        setShowTopicModal(false);
        setLoading(true);

        try {
            // Generate AI questions based on selected topics
            const response = await axios.post('/api/interview/generate-questions', {
                topics: interviewConfig.topics,
                difficulty: interviewConfig.difficulty,
                questionCount: interviewConfig.questionCount,
                interviewType: interviewConfig.interviewType
            });

            if (response.data.success) {
                // Navigate to interview session with generated questions
                const params = new URLSearchParams({
                    mode: interviewConfig.interviewType,
                    topics: JSON.stringify(interviewConfig.topics),
                    difficulty: interviewConfig.difficulty,
                    questionCount: interviewConfig.questionCount.toString(),
                    questions: JSON.stringify(response.data.questions),
                    isAiGenerated: 'true'
                });

                router.push(`/interview/session?${params.toString()}`);
            } else {
                throw new Error(response.data.error || 'Failed to generate questions');
            }
        } catch (error) {
            console.error('Error generating interview questions:', error);
            toast.error('Failed to generate interview questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRetryInterview = async (sessionId) => {
        setLoading(true);
        try {
            // Ensure we have a valid session and user ID
            if (!session?.user?.id) {
                toast.error('Please sign in to retry an interview');
                return;
            }

            const response = await fetch('/api/interview/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'retry',
                    userId: session.user.id,
                    sessionId: sessionId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server error: ${response.status}`);
            }

            if (data.success) {
                const retryConfig = data.retryConfig;
                
                // Generate new questions for retry
                const questionsResponse = await fetch('/api/interview/generate-questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        topics: retryConfig.topics,
                        difficulty: retryConfig.difficulty,
                        questionCount: retryConfig.questionCount,
                        interviewType: retryConfig.interviewType
                    })
                });

                const questionsData = await questionsResponse.json();

                if (!questionsResponse.ok) {
                    throw new Error(questionsData.error || 'Failed to generate retry questions');
                }

                if (questionsData.success) {
                    const params = new URLSearchParams({
                        mode: retryConfig.interviewType,
                        topics: JSON.stringify(retryConfig.topics),
                        difficulty: retryConfig.difficulty,
                        questionCount: retryConfig.questionCount.toString(),
                        questions: JSON.stringify(questionsData.questions),
                        isAiGenerated: 'true',
                        isRetry: 'true',
                        originalSessionId: sessionId
                    });

                    toast.success('Starting retry interview...');
                    router.push(`/interview/session?${params.toString()}`);
                } else {
                    throw new Error('Failed to generate retry questions');
                }
            } else {
                throw new Error('Failed to configure retry interview');
            }
        } catch (error) {
            console.error('Error starting retry interview:', error);
            
            // Provide more specific error messages
            if (error.message.includes('400')) {
                toast.error('Invalid request. Please try again.');
            } else if (error.message.includes('404')) {
                toast.error('Original interview session not found.');
            } else if (error.message.includes('500')) {
                toast.error('Server error. Please try again later.');
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error(error.message || 'Failed to start retry interview. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStartInterview_old = (mode, company = null, isPremium = false) => {
        // Check authentication before allowing to use functionality
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (isPremium && !session?.user?.isPremium) {
            setShowPremiumModal(true);
            return;
        }

        // Map mode titles to proper route parameters
        let modeParam = '';
        if (typeof mode === 'string') {
            modeParam = mode.toLowerCase().replace(' ', '-');
        } else if (mode.title) {
            const modeTitle = mode.title.toLowerCase();
            if (modeTitle.includes('technical') || modeTitle.includes('coding')) {
                modeParam = 'technical-coding';
            } else if (modeTitle.includes('system') || modeTitle.includes('design')) {
                modeParam = 'system-design';
            } else if (modeTitle.includes('behavioral')) {
                modeParam = 'behavioral';
            } else {
                modeParam = 'technical-coding'; // default
            }
        }

        // Navigate to interview interface
        const params = new URLSearchParams({
            mode: modeParam,
            ...(company && { company: company.toLowerCase() })
        });

        router.push(`/interview/session?${params.toString()}`);
    };

    const getCompanyIcon = (companyName) => {
        const company = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
        return company ? company.icon : FaRocket;
    };

    const getScoreColor = (score) => {
        if (score >= 90) return "text-green-400";
        if (score >= 75) return "text-yellow-400";
        return "text-red-400";
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen theme-bg flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="text-4xl animate-bounce">🤖</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen theme-bg relative overflow-hidden">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute top-20 right-20 text-4xl animate-float animation-delay-1000">🎯</div>
                <div className="absolute bottom-20 left-20 text-3xl animate-float animation-delay-500">🧠</div>
                <div className="absolute top-1/3 right-1/3 text-2xl animate-float">🚀</div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl">
                            🤖
                        </div>
                        <div>
                            <h1 className="text-5xl font-black theme-text">
                                AI Mock Interviews
                            </h1>
                            <p className="text-gray-400 text-xl mt-2">
                                Practice with AI-powered interviews and get hired at top companies
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                        <div className="theme-surface backdrop-blur-sm border border theme-border rounded-2xl p-4">
                            <div className="text-2xl font-black theme-accent">
                                {stats.totalInterviews}
                            </div>
                            <p className="text-gray-400 text-sm">Interviews Taken</p>
                        </div>
                        <div className="theme-surface backdrop-blur-sm border border-green-500/20 rounded-2xl p-4">
                            <div className="text-2xl font-black text-green-400">
                                {stats.avgScore}%
                            </div>
                            <p className="text-gray-400 text-sm">Average Score</p>
                        </div>
                        <div className="theme-surface backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4">
                            <div className="text-2xl font-black text-yellow-400">
                                {stats.bestScore}%
                            </div>
                            <p className="text-gray-400 text-sm">Best Score</p>
                        </div>
                        <div className="theme-surface backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4">
                            <div className="text-2xl font-black text-blue-400">
                                {stats.completionRate}%
                            </div>
                            <p className="text-gray-400 text-sm">Completion Rate</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8 animate-fade-in-up animation-delay-200">
                    <div className="theme-surface backdrop-blur-sm border border theme-border rounded-2xl p-2 flex gap-2">
                        {["modes", "companies", "history"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "text-gray-400 hover:text-white hover:theme-surface-elevated/50"
                                    }`}
                            >
                                {tab === "modes" && <FaRobot className="inline mr-2" />}
                                {tab === "companies" && <FaGoogle className="inline mr-2" />}
                                {tab === "history" && <FaHistory className="inline mr-2" />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Interview Modes Tab */}
                {activeTab === "modes" && (
                    <div className="animate-fade-in-up animation-delay-300">
                        {/* Featured AI Voice Interview */}
                        <div className="mb-12">
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                            <FaBrain className="text-3xl text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-bold text-white mb-4">🎤 AI Voice Interview</h2>
                                    <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                                        Experience the future of interview preparation with our AI-powered voice assistant. 
                                        Get real-time feedback and detailed performance analysis.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                                            🗣️ Voice Recognition
                                        </span>
                                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                                            📊 Real-time Analysis
                                        </span>
                                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                                            🎯 Personalized Feedback
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={() => router.push('/ai-interview')}
                                            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center gap-3"
                                        >
                                            <FaPlay />
                                            Start AI Interview
                                        </button>
                                        <button
                                            onClick={() => router.push('/ai-interview/dashboard')}
                                            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 flex items-center gap-3"
                                        >
                                            <FaChartLine />
                                            View Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {interviewModes.map((mode, index) => (
                                <div
                                    key={index}
                                    className="theme-surface backdrop-blur-sm border border theme-border rounded-3xl p-8 hover:border theme-border transition-all duration-300 hover:scale-105 group"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-r ${mode.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <mode.icon className="text-2xl text-white" />
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="text-2xl font-bold text-white">{mode.title}</h3>
                                        {mode.premium && (
                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <FaCrown className="text-xs" />
                                                PRO
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-gray-400 mb-6">{mode.description}</p>

                                    <div className="space-y-2 mb-6">
                                        {mode.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                <FaCheckCircle className="text-green-400 text-xs" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleStartInterview(mode, null, mode.premium)}
                                        className={`w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${mode.premium
                                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                    >
                                        <FaPlay className="inline mr-2" />
                                        Start Interview
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Interview Hosting Options */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                <FaUsers className="text-blue-400" />
                                Interview Sessions
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                {hostingOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        className="theme-surface backdrop-blur-sm border border theme-border rounded-3xl p-8 hover:border theme-border transition-all duration-300 hover:scale-105 group"
                                    >
                                        <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <option.icon className="text-2xl text-white" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-3">{option.title}</h3>
                                        <p className="text-gray-400 mb-6">{option.description}</p>

                                        <div className="space-y-2 mb-6">
                                            {option.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                    <FaCheckCircle className="text-green-400 text-xs" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={option.action}
                                            className={`w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r ${option.color} text-white`}
                                        >
                                            <option.icon className="inline mr-2" />
                                            {option.buttonText}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Start Section */}
                        <div className="theme-surface backdrop-blur-sm border border theme-border rounded-3xl p-8">
                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                <FaRocket className="theme-accent" />
                                Quick Start
                            </h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <button
                                    onClick={() => router.push('/ai-interview')}
                                    className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FaBrain className="text-xl text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white">AI Voice Interview</h3>
                                            <p className="theme-text-secondary text-sm">Voice-powered AI interview</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleStartInterview({ title: "Random Technical" })}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FaCode className="text-xl text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white">Random Problem</h3>
                                            <p className="text-green-100 text-sm">Get a surprise coding challenge</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleStartInterview({ title: "Daily Challenge" })}
                                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FaCalendarAlt className="text-xl text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white">Daily Challenge</h3>
                                            <p className="text-red-100 text-sm">Today's featured problem</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => router.push('/problems/random')}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FaRedo className="text-xl text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white">Random Problem</h3>
                                            <p className="text-blue-100 text-sm">Practice with any problem</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Companies Tab */}
                {activeTab === "companies" && (
                    <div className="animate-fade-in-up animation-delay-300">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                                <FaGoogle className="theme-accent" />
                                Company-Specific Interviews
                            </h2>
                            <p className="text-gray-400 text-lg">
                                Practice with problems commonly asked by top tech companies
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companies.map((company, index) => (
                                <div
                                    key={index}
                                    className="theme-surface backdrop-blur-sm border border theme-border rounded-3xl p-6 hover:border theme-border transition-all duration-300 hover:scale-105 group"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${company.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <company.icon className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                                            <p className="text-gray-400">{company.problems} problems</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center theme-surface-elevated/30 rounded-lg p-3">
                                            <span className="text-gray-300">DSA Problems</span>
                                            <span className="theme-accent font-bold">{Math.floor(company.problems * 0.6)}</span>
                                        </div>
                                        <div className="flex justify-between items-center theme-surface-elevated/30 rounded-lg p-3">
                                            <span className="text-gray-300">System Design</span>
                                            <span className="text-blue-400 font-bold">{Math.floor(company.problems * 0.3)}</span>
                                        </div>
                                        <div className="flex justify-between items-center theme-surface-elevated/30 rounded-lg p-3">
                                            <span className="text-gray-300">Behavioral</span>
                                            <span className="text-green-400 font-bold">{Math.floor(company.problems * 0.1)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleStartInterview({ title: "Company Interview" }, company.name)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <FaPlay className="inline mr-2" />
                                        Start {company.name} Interview
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Premium Company Features */}
                        <div className="mt-12 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-8">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                    <FaCrown className="text-3xl text-white" />
                                </div>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                                    Premium Company Insights
                                </h3>
                                <p className="text-gray-400 text-lg">
                                    Get insider knowledge and advanced preparation tools
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center">
                                    <FaBrain className="text-4xl text-yellow-400 mx-auto mb-3" />
                                    <h4 className="text-xl font-bold text-white mb-2">Hiring Patterns</h4>
                                    <p className="text-gray-400 text-sm">Analysis of company-specific interview trends</p>
                                </div>
                                <div className="text-center">
                                    <FaFileAlt className="text-4xl text-orange-400 mx-auto mb-3" />
                                    <h4 className="text-xl font-bold text-white mb-2">Resume Review</h4>
                                    <p className="text-gray-400 text-sm">AI-powered resume optimization for each company</p>
                                </div>
                                <div className="text-center">
                                    <FaVideo className="text-4xl theme-accent mx-auto mb-3" />
                                    <h4 className="text-xl font-bold text-white mb-2">Video Interviews</h4>
                                    <p className="text-gray-400 text-sm">Practice with video-based mock interviews</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/premium"
                                    className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105"
                                >
                                    <FaCrown className="inline mr-2" />
                                    Upgrade to Premium
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <div className="animate-fade-in-up animation-delay-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                    <FaHistory className="theme-accent" />
                                    Interview History
                                </h2>
                                <p className="text-gray-400">
                                    Track your progress and review past performances
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <select
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                    className="theme-surface border border theme-border rounded-xl px-4 py-2 theme-text focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="all">All Companies</option>
                                    {companies.map(company => (
                                        <option key={company.name} value={company.name.toLowerCase()}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                    className="theme-surface border border theme-border rounded-xl px-4 py-2 theme-text focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="all">All Types</option>
                                    <option value="technical">Technical</option>
                                    <option value="system">System Design</option>
                                    <option value="behavioral">Behavioral</option>
                                </select>
                            </div>
                        </div>

                                        {recentInterviews.length > 0 ? (
                                            <div className="space-y-4">
                                                {recentInterviews.map((interview, index) => {
                                                    const CompanyIcon = getCompanyIcon(interview.company);
                                                    return (
                                                        <div
                                                            key={interview.sessionId || interview.id}
                                                            className="theme-surface backdrop-blur-sm border border theme-border rounded-2xl p-6 hover:border theme-border transition-all duration-300 hover:scale-[1.02]"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                                                        <CompanyIcon className="text-xl text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-xl font-bold text-white">
                                                                            {interview.company || 'General'} - {interview.mode || interview.type}
                                                                        </h3>
                                                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                                                            <span className="flex items-center gap-1">
                                                                                <FaCalendarAlt />
                                                                                {interview.completedAt ? new Date(interview.completedAt).toLocaleDateString() : interview.date}
                                                                            </span>
                                                                            <span className="flex items-center gap-1">
                                                                                <FaClock />
                                                                                {interview.timeElapsed ? `${Math.floor(interview.timeElapsed / 60)} min` : interview.duration}
                                                                            </span>
                                                                            {interview.topics && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <FaBrain />
                                                                                    {interview.topics.join(', ')}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-center">
                                                                        <div className={`text-2xl font-bold ${getScoreColor(interview.overallScore || interview.score)}`}>
                                                                            {interview.overallScore || interview.score}%
                                                                        </div>
                                                                        <p className="text-gray-400 text-sm">Score</p>
                                                                    </div>

                                                                    <div className="flex gap-2">
                                                                        <button 
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                                                            onClick={() => toast.info('Review feature coming soon!')}
                                                                        >
                                                                            <FaEye />
                                                                            Review
                                                                        </button>
                                                                        <button 
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                                                            onClick={() => handleRetryInterview(interview.sessionId || interview.id)}
                                                                            disabled={loading}
                                                                        >
                                                                            <FaRedo />
                                                                            Retry
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <FaHistory className="text-6xl text-gray-600 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-3">No Interview History</h3>
                                <p className="text-gray-400 mb-6">Start your first mock interview to track your progress</p>
                                <button
                                    onClick={() => setActiveTab("modes")}
                                    className="bg-blue-600 hover:bg-blue-700 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                                >
                                    <FaPlay className="inline mr-2" />
                                    Start Your First Interview
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* AI Features Section */}
                <div className="mt-16 theme-surface backdrop-blur-sm border border theme-border rounded-3xl p-8 animate-fade-in-up animation-delay-600">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                        <FaRobot className="theme-accent" />
                        AI-Powered Features
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FaBrain className="text-2xl text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Real-time Analysis</h3>
                            <p className="text-gray-400 text-sm">Get instant feedback on your coding approach and solutions</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FaLightbulb className="text-2xl text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Smart Hints</h3>
                            <p className="text-gray-400 text-sm">Receive contextual hints without spoiling the solution</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FaChartLine className="text-2xl text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Performance Tracking</h3>
                            <p className="text-gray-400 text-sm">Monitor your improvement across different problem categories</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FaTrophy className="text-2xl text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Personalized Plans</h3>
                            <p className="text-gray-400 text-sm">Get custom practice recommendations based on your weak areas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Modal */}
            {showPremiumModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="theme-bg border border-purple-500/30 rounded-3xl p-8 max-w-md w-full">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <FaCrown className="text-3xl text-white" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                                Premium Feature
                            </h2>
                            <p className="text-gray-400 mb-6">
                                This feature is available for Premium users only. Upgrade now to unlock system design interviews and advanced features.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPremiumModal(false)}
                                    className="flex-1 theme-surface-elevated hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <Link
                                    href="/premium"
                                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all text-center"
                                >
                                    Upgrade Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Topic Selection Modal */}
            <TopicSelectionModal
                isOpen={showTopicModal}
                onClose={() => setShowTopicModal(false)}
                onStartInterview={handleTopicSelectionComplete}
                interviewType={selectedMode?.title === 'Technical Coding Interview' ? 'technical-coding' : 
                              selectedMode?.title === 'System Design Interview' ? 'system-design' : 
                              selectedMode?.title === 'Behavioral Interview' ? 'behavioral' : 'technical-coding'}
            />

            {/* Toast notifications */}
            <Toaster />
        </div>
    );
}