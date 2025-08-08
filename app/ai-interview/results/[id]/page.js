"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaChartBar, FaClock, FaQuestionCircle, FaTrophy } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function InterviewResultsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const interviewId = params?.id;

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingAnswer, setPlayingAnswer] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    if (session?.user && interviewId) {
      fetchInterviewDetails();
    }
  }, [session, interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai-interview/results/${interviewId}`);
      
      if (response.ok) {
        const data = await response.json();
        setInterview(data.interview);
      } else if (response.status === 404) {
        toast.error('Interview not found');
        router.push('/ai-interview/dashboard');
      } else {
        toast.error('Failed to load interview details');
      }
    } catch (error) {
      console.error('Error fetching interview details:', error);
      toast.error('Error loading interview details');
    } finally {
      setLoading(false);
    }
  };

  const playAnswer = (answerText, questionIndex) => {
    if (!speechSynthesis) return;

    if (playingAnswer === questionIndex) {
      speechSynthesis.cancel();
      setPlayingAnswer(null);
      return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(answerText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setPlayingAnswer(questionIndex);
    utterance.onend = () => setPlayingAnswer(null);
    utterance.onerror = () => setPlayingAnswer(null);
    
    speechSynthesis.speak(utterance);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-blue-500 bg-blue-100';
      case 'hard': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderScoreBreakdown = () => {
    if (!interview?.analysis?.breakdown) return null;

    const breakdown = interview.analysis.breakdown;
    
    const data = {
      labels: ['Technical', 'Behavioral', 'Communication', 'Problem Solving'],
      datasets: [
        {
          label: 'Scores',
          data: [
            breakdown.technical || 0,
            breakdown.behavioral || 0,
            breakdown.communication || 0,
            breakdown.problemSolving || 0,
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Performance Breakdown',
          color: 'white',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: 'white',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        x: {
          ticks: {
            color: 'white',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  if (!session?.user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading interview results...</div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Interview Not Found</h2>
          <button
            onClick={() => router.push('/ai-interview/dashboard')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Interview Results</h1>
              <p className="text-gray-400">
                Completed on {new Date(interview.completedAt).toLocaleDateString()} • 
                {formatDuration(interview.duration)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(interview.difficulty)}`}>
              {interview.difficulty?.charAt(0).toUpperCase() + interview.difficulty?.slice(1)}
            </span>
            <span className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
              {interview.roleType?.charAt(0).toUpperCase() + interview.roleType?.slice(1)}
            </span>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-gray-800 rounded-lg p-8 text-center mb-8">
          <div className={`text-6xl font-bold mb-4 ${getScoreColor(interview.overallScore)}`}>
            {interview.overallScore}
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Overall Performance</h2>
          <p className="text-gray-400">
            You scored {interview.overallScore} out of 100 points
          </p>
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            {renderScoreBreakdown()}
          </div>

          {/* Score Details */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Score Details</h3>
            <div className="space-y-4">
              {interview.analysis?.breakdown && Object.entries(interview.analysis.breakdown).map(([category, score]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">
                    {category === 'problemSolving' ? 'Problem Solving' : category}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getScoreColor(score).replace('text-', 'bg-')}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className={`font-semibold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis */}
        {interview.analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center">
                <FaTrophy className="mr-2" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {interview.analysis.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center">
                <FaChartBar className="mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {interview.analysis.weaknesses?.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-3 mt-1">!</span>
                    <span className="text-gray-300">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {interview.analysis?.recommendations && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interview.analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-700 rounded-lg">
                  <span className="text-blue-500 mt-1">→</span>
                  <span className="text-gray-300">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question & Answer Details */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Interview Questions & Answers</h3>
          <div className="space-y-6">
            {interview.answers?.map((answerData, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-blue-400 flex items-center">
                    <FaQuestionCircle className="mr-2" />
                    Question {index + 1}
                    <span className="ml-3 px-2 py-1 bg-gray-600 rounded text-sm">
                      {answerData.question?.type || 'General'}
                    </span>
                  </h4>
                  {answerData.evaluation?.score && (
                    <div className={`text-lg font-semibold ${getScoreColor(answerData.evaluation.score)}`}>
                      {answerData.evaluation.score}/100
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 font-medium mb-2">Question:</p>
                  <p className="text-gray-100 bg-gray-800 p-3 rounded">
                    {answerData.question?.question || answerData.question}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-300 font-medium">Your Answer:</p>
                    <button
                      onClick={() => playAnswer(answerData.answer, index)}
                      className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                      disabled={!speechSynthesis}
                    >
                      {playingAnswer === index ? <FaPause /> : <FaVolumeUp />}
                      <span>{playingAnswer === index ? 'Pause' : 'Listen'}</span>
                    </button>
                  </div>
                  <div className="text-gray-100 bg-gray-800 p-3 rounded max-h-40 overflow-y-auto">
                    {answerData.answer || 'No answer recorded'}
                  </div>
                </div>

                {answerData.evaluation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
                    <div>
                      <p className="text-gray-300 font-medium mb-2">Evaluation:</p>
                      <p className="text-gray-100 text-sm">{answerData.evaluation.feedback}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium mb-2">Assessment:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Technical Accuracy:</span>
                          <span className={answerData.evaluation.technicalAccuracy === 'High' ? 'text-green-500' : 
                                         answerData.evaluation.technicalAccuracy === 'Medium' ? 'text-yellow-500' : 'text-red-500'}>
                            {answerData.evaluation.technicalAccuracy}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Communication:</span>
                          <span className="text-blue-500">{answerData.evaluation.communicationClarity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <span className="text-purple-500">{answerData.evaluation.confidence}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <button
            onClick={() => router.push('/ai-interview')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <FaPlay />
            <span>Take Another Interview</span>
          </button>
          
          <button
            onClick={() => router.push('/ai-interview/dashboard')}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
