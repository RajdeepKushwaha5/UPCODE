"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaTrophy,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCode,
  FaStar,
  FaChartLine,
  FaLightbulb,
  FaRocket,
  FaArrowLeft,
  FaPlay,
  FaShare,
  FaDownload
} from 'react-icons/fa';

export default function InterviewResults() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Mock results data
  const [results] = useState({
    score: 85,
    timeSpent: 2845, // seconds
    difficulty: "Medium",
    problemTitle: "Two Sum",
    company: "Google",
    mode: "Technical Coding",
    language: "JavaScript",
    status: "completed",
    feedback: {
      strengths: [
        "Good problem understanding",
        "Efficient algorithm choice",
        "Clean code structure",
        "Proper variable naming"
      ],
      improvements: [
        "Could optimize space complexity",
        "Add more edge case handling",
        "Consider alternative approaches"
      ],
      codeQuality: 8.5,
      efficiency: 7.8,
      problemSolving: 9.2,
      communication: 8.0
    },
    suggestions: [
      "Practice more hash table problems",
      "Focus on space optimization techniques",
      "Review edge case handling patterns"
    ]
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return "from-green-500 to-emerald-500";
    if (score >= 75) return "from-yellow-500 to-orange-500";
    if (score >= 60) return "from-orange-500 to-red-500";
    return "from-red-500 to-pink-500";
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-20 right-20 text-4xl animate-float animation-delay-1000">🎉</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-float animation-delay-500">⭐</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-float">🚀</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/interview')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft />
            Back to Interview Hub
          </button>

          <div className="flex gap-3">
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <FaShare />
              Share Results
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <FaDownload />
              Download Report
            </button>
          </div>
        </div>

        {/* Main Results Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 mb-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className={`w-32 h-32 bg-gradient-to-r ${getScoreGradient(results.score)} rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse`}>
              <span className="text-4xl font-black text-white">{results.score}%</span>
            </div>

            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Interview Complete!
            </h1>
            <p className="text-gray-400 text-xl">
              {results.company} • {results.mode} • {results.problemTitle}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FaClock className="text-2xl text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(results.timeSpent)}</div>
              <p className="text-gray-400 text-sm">Time Spent</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FaCode className="text-2xl text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{results.language}</div>
              <p className="text-gray-400 text-sm">Language Used</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FaTrophy className="text-2xl text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{results.difficulty}</div>
              <p className="text-gray-400 text-sm">Difficulty</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-2xl text-white" />
              </div>
              <div className="text-2xl font-bold text-green-400">Passed</div>
              <p className="text-gray-400 text-sm">Status</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Detailed Feedback */}
          <div className="space-y-6">

            {/* Performance Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 animate-fade-in-up animation-delay-200">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaChartLine className="text-purple-400" />
                Performance Breakdown
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Code Quality</span>
                    <span className="text-white font-bold">{results.feedback.codeQuality}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${results.feedback.codeQuality * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Efficiency</span>
                    <span className="text-white font-bold">{results.feedback.efficiency}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${results.feedback.efficiency * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Problem Solving</span>
                    <span className="text-white font-bold">{results.feedback.problemSolving}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${results.feedback.problemSolving * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Communication</span>
                    <span className="text-white font-bold">{results.feedback.communication}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${results.feedback.communication * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-3xl p-6 animate-fade-in-up animation-delay-300">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                Strengths
              </h3>
              <div className="space-y-2">
                {results.feedback.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 text-green-300">
                    <FaStar className="text-green-400 text-sm" />
                    {strength}
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-6 animate-fade-in-up animation-delay-400">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaLightbulb className="text-orange-400" />
                Areas for Improvement
              </h3>
              <div className="space-y-2">
                {results.feedback.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-2 text-orange-300">
                    <FaLightbulb className="text-orange-400 text-sm" />
                    {improvement}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* AI Suggestions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 animate-fade-in-up animation-delay-500">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaRocket className="text-purple-400" />
                Personalized Study Plan
              </h3>
              <div className="space-y-3">
                {results.suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-purple-300">{suggestion}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/problems?recommended=true"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Practice Recommended Problems
                </Link>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-6 animate-fade-in-up animation-delay-600">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaPlay className="text-blue-400" />
                What's Next?
              </h3>

              <div className="space-y-3">
                <Link
                  href="/interview"
                  className="block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  Take Another Interview
                </Link>

                <Link
                  href="/problems"
                  className="block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  Practice More Problems
                </Link>

                <Link
                  href="/interview/history"
                  className="block bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  View Interview History
                </Link>
              </div>
            </div>

            {/* Achievement Unlock */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-6 animate-fade-in-up animation-delay-700">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                  Achievement Unlocked!
                </h3>
                <p className="text-yellow-300 font-medium mb-1">First Technical Interview</p>
                <p className="text-gray-400 text-sm">
                  Completed your first coding interview with a score of {results.score}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
