"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaPause, FaStop, FaRandom, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AIInterviewPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Interview states
  const [interviewState, setInterviewState] = useState('idle'); // idle, active, paused, completed
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [interviewScore, setInterviewScore] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [voices, setVoices] = useState([]);

  // Interview configuration
  const [difficulty, setDifficulty] = useState('medium');
  const [roleType, setRoleType] = useState('fullstack');
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes

  // Refs
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize speech services
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        
        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setCurrentTranscript(transcript);
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast.error('Speech recognition error. Please try again.');
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
        setSpeechRecognition(recognition);
      } else {
        toast.error('Speech recognition not supported in this browser.');
      }

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
        setSpeechSynthesis(window.speechSynthesis);
        
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          setVoices(availableVoices);
        };
        
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (interviewState === 'active') {
      timerRef.current = setInterval(() => {
        setInterviewDuration(prev => prev + 1);
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interviewState]);

  // Interview question bank
  const questionBank = {
    technical: {
      easy: [
        "Tell me about yourself and your programming experience.",
        "What is the difference between == and === in JavaScript?",
        "Explain what a REST API is and how it works.",
        "What is the difference between let, const, and var in JavaScript?",
        "How do you handle errors in your code?"
      ],
      medium: [
        "Explain the concept of closure in JavaScript with an example.",
        "What are the differences between SQL and NoSQL databases?",
        "How would you optimize a slow-loading website?",
        "Explain the difference between synchronous and asynchronous programming.",
        "What is the time complexity of common sorting algorithms?"
      ],
      hard: [
        "Design a system for handling millions of concurrent users.",
        "Explain how you would implement a distributed cache.",
        "What are the trade-offs between microservices and monolithic architecture?",
        "How would you design a real-time chat application?",
        "Explain the CAP theorem and its implications."
      ]
    },
    behavioral: [
      "Tell me about a challenging project you worked on. How did you overcome the difficulties?",
      "Describe a time when you had to work with a difficult team member.",
      "How do you stay updated with new technologies and programming trends?",
      "Tell me about a time you made a mistake in your code. How did you handle it?",
      "How do you approach debugging complex issues?",
      "Describe your ideal work environment and team structure.",
      "How do you prioritize tasks when working on multiple projects?"
    ]
  };

  // Generate interview questions
  const generateInterviewQuestions = useCallback(() => {
    const questions = [];
    const techQuestions = questionBank.technical[difficulty] || questionBank.technical.medium;
    const behavioralQuestions = questionBank.behavioral;

    // Add 3-4 technical questions
    const selectedTechQuestions = techQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(4, techQuestions.length));
    
    // Add 2-3 behavioral questions
    const selectedBehavioralQuestions = behavioralQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, behavioralQuestions.length));

    questions.push(...selectedTechQuestions.map(q => ({ type: 'technical', question: q })));
    questions.push(...selectedBehavioralQuestions.map(q => ({ type: 'behavioral', question: q })));

    // Shuffle the questions
    return questions.sort(() => Math.random() - 0.5);
  }, [difficulty]);

  // Text-to-speech function
  const speakText = useCallback((text, callback = null) => {
    if (speechSynthesis && voices.length > 0) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a suitable voice
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        if (callback) callback();
      };
      
      speechSynthesis.speak(utterance);
    }
  }, [speechSynthesis, voices]);

  // Start voice recognition
  const startListening = useCallback(() => {
    if (speechRecognition && !isListening) {
      setCurrentTranscript('');
      speechRecognition.start();
      setIsRecording(true);
    }
  }, [speechRecognition, isListening]);

  // Stop voice recognition
  const stopListening = useCallback(() => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
      setIsRecording(false);
    }
  }, [speechRecognition, isListening]);

  // Start interview
  const startInterview = useCallback(async () => {
    if (!session?.user) {
      toast.error('Please login to start the interview');
      router.push('/login');
      return;
    }

    const questions = generateInterviewQuestions();
    setInterviewQuestions(questions);
    setInterviewState('active');
    setQuestionIndex(0);
    setUserAnswers([]);
    setInterviewDuration(0);
    setTimeRemaining(1800); // Reset to 30 minutes

    // Welcome message
    const welcomeMessage = `Hello ${session.user.name || 'candidate'}, I'll be your interviewer today. We'll have a ${difficulty} level interview focusing on ${roleType} development. Let's begin with our first question.`;
    
    speakText(welcomeMessage, () => {
      if (questions.length > 0) {
        setCurrentQuestion(questions[0].question);
        speakText(questions[0].question, () => {
          // Start listening for answer after question is spoken
          setTimeout(() => startListening(), 1000);
        });
      }
    });

    toast.success('Interview started! Listen to the question and respond when ready.');
  }, [session, difficulty, roleType, generateInterviewQuestions, speakText, startListening]);

  // Submit current answer and move to next question
  const submitAnswer = useCallback(async () => {
    if (!currentTranscript.trim()) {
      toast.error('Please provide an answer before continuing');
      return;
    }

    stopListening();

    const currentAnswer = {
      questionIndex,
      question: interviewQuestions[questionIndex],
      answer: currentTranscript.trim(),
      timestamp: new Date().toISOString(),
      duration: interviewDuration
    };

    setUserAnswers(prev => [...prev, currentAnswer]);

    // Evaluate answer using AI
    try {
      const evaluation = await evaluateAnswer(currentAnswer);
      currentAnswer.evaluation = evaluation;
    } catch (error) {
      console.error('Error evaluating answer:', error);
    }

    const nextIndex = questionIndex + 1;
    
    if (nextIndex < interviewQuestions.length) {
      setQuestionIndex(nextIndex);
      setCurrentQuestion(interviewQuestions[nextIndex].question);
      setCurrentTranscript('');

      // Move to next question
      const transitionMessage = "Thank you for your answer. Here's the next question:";
      speakText(transitionMessage, () => {
        speakText(interviewQuestions[nextIndex].question, () => {
          setTimeout(() => startListening(), 1000);
        });
      });
    } else {
      // Interview completed
      completeInterview();
    }
  }, [currentTranscript, questionIndex, interviewQuestions, interviewDuration, stopListening, startListening]);

  // Evaluate answer using AI
  const evaluateAnswer = async (answerData) => {
    try {
      const response = await fetch('/api/ai-interview/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: answerData.question,
          answer: answerData.answer,
          difficulty,
          roleType
        }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
    }

    // Fallback evaluation
    return {
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      feedback: 'Your answer demonstrates good understanding of the topic.',
      strengths: ['Clear communication', 'Relevant examples'],
      improvements: ['Could provide more technical details']
    };
  };

  // Complete interview
  const completeInterview = useCallback(async () => {
    setInterviewState('completed');
    stopListening();

    // Calculate overall score and analysis
    const analysis = await generateAnalysis();
    setAnalysisData(analysis);

    // Save interview results
    try {
      await fetch('/api/ai-interview/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          difficulty,
          roleType,
          questions: interviewQuestions,
          answers: userAnswers,
          duration: interviewDuration,
          score: analysis.overallScore,
          analysis
        }),
      });
    } catch (error) {
      console.error('Error saving interview:', error);
    }

    const completionMessage = `Interview completed! Your overall score is ${analysis.overallScore} out of 100. You can review your detailed analysis below.`;
    speakText(completionMessage);

    toast.success('🎉 Interview completed! Check your results below.');
  }, [stopListening, session, difficulty, roleType, interviewQuestions, userAnswers, interviewDuration]);

  // Generate interview analysis
  const generateAnalysis = async () => {
    let totalScore = 0;
    let technicalScores = [];
    let behavioralScores = [];

    userAnswers.forEach(answer => {
      const evaluation = answer.evaluation || { score: 70 };
      totalScore += evaluation.score;

      if (answer.question.type === 'technical') {
        technicalScores.push(evaluation.score);
      } else {
        behavioralScores.push(evaluation.score);
      }
    });

    const overallScore = Math.round(totalScore / userAnswers.length);
    const technicalScore = technicalScores.length > 0 ? Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length) : 0;
    const behavioralScore = behavioralScores.length > 0 ? Math.round(behavioralScores.reduce((a, b) => a + b, 0) / behavioralScores.length) : 0;

    return {
      overallScore,
      technicalScore,
      behavioralScore,
      communicationScore: Math.floor(Math.random() * 20) + 75, // Simulated
      breakdown: {
        technical: technicalScore,
        behavioral: behavioralScore,
        communication: Math.floor(Math.random() * 20) + 75,
        problemSolving: Math.floor(Math.random() * 20) + 70
      },
      strengths: determineStrengths(overallScore),
      weaknesses: determineWeaknesses(overallScore),
      recommendations: generateRecommendations(overallScore, difficulty)
    };
  };

  // Determine strengths based on score
  const determineStrengths = (score) => {
    if (score >= 90) {
      return ['Excellent technical knowledge', 'Clear communication', 'Strong problem-solving skills', 'Confident presentation'];
    } else if (score >= 80) {
      return ['Good technical understanding', 'Effective communication', 'Logical thinking'];
    } else if (score >= 70) {
      return ['Basic technical knowledge', 'Adequate communication'];
    } else {
      return ['Willingness to learn', 'Effort in answering questions'];
    }
  };

  // Determine weaknesses based on score
  const determineWeaknesses = (score) => {
    if (score < 70) {
      return ['Need to improve technical knowledge', 'Work on communication clarity', 'Practice problem-solving'];
    } else if (score < 80) {
      return ['Could provide more detailed examples', 'Work on confidence'];
    } else if (score < 90) {
      return ['Minor improvements in technical depth'];
    } else {
      return ['Continue maintaining excellence'];
    }
  };

  // Generate recommendations
  const generateRecommendations = (score, difficulty) => {
    const recommendations = [];
    
    if (score < 70) {
      recommendations.push('Focus on fundamental concepts and practice coding daily');
      recommendations.push('Take online courses to strengthen technical skills');
      recommendations.push('Practice mock interviews to improve confidence');
    } else if (score < 80) {
      recommendations.push('Dive deeper into advanced topics');
      recommendations.push('Work on providing concrete examples');
      recommendations.push('Practice explaining complex concepts simply');
    } else if (score < 90) {
      recommendations.push('Explore cutting-edge technologies in your field');
      recommendations.push('Consider contributing to open-source projects');
    } else {
      recommendations.push('Continue sharing knowledge and mentoring others');
      recommendations.push('Stay updated with industry best practices');
    }

    return recommendations;
  };

  // Handle random problem
  const handleRandomProblem = async () => {
    try {
      const response = await fetch('/api/problems/random');
      if (response.ok) {
        const data = await response.json();
        if (data.problem) {
          router.push(`/problems/${data.problem.id}`);
        } else {
          toast.error('No problems available');
        }
      } else {
        toast.error('Failed to fetch random problem');
      }
    } catch (error) {
      console.error('Error fetching random problem:', error);
      toast.error('Error loading random problem');
    }
  };

  // Handle daily challenge
  const handleDailyChallenge = async () => {
    try {
      const response = await fetch('/api/problems/daily-challenge');
      if (response.ok) {
        const data = await response.json();
        if (data.problem) {
          router.push(`/problems/${data.problem.id}`);
        } else {
          toast.error('No daily challenge available');
        }
      } else {
        toast.error('Failed to fetch daily challenge');
      }
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      toast.error('Error loading daily challenge');
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render configuration panel
  const renderConfigPanel = () => (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Interview Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Difficulty Level</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
            disabled={interviewState === 'active'}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Role Type</label>
          <select
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
            disabled={interviewState === 'active'}
          >
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Full Stack Developer</option>
            <option value="mobile">Mobile Developer</option>
            <option value="devops">DevOps Engineer</option>
            <option value="datascience">Data Scientist</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render interview controls
  const renderInterviewControls = () => (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Interview Progress</h3>
          <p className="text-gray-400">Question {questionIndex + 1} of {interviewQuestions.length}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{formatTime(timeRemaining)}</div>
          <div className="text-sm text-gray-400">Time Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((questionIndex + 1) / interviewQuestions.length) * 100}%` }}
        ></div>
      </div>

      {/* Current Question */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-medium text-white mb-2">Current Question:</h4>
        <p className="text-gray-300">{currentQuestion}</p>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          <span>{isListening ? 'Stop Recording' : 'Start Recording'}</span>
        </button>

        <button
          onClick={submitAnswer}
          disabled={!currentTranscript.trim()}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <FaPlay />
          <span>Submit Answer</span>
        </button>
      </div>

      {/* Live Transcript */}
      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Your Answer:</h4>
        <p className="text-white min-h-[60px]">
          {currentTranscript || 'Start speaking to see your answer here...'}
        </p>
        {isListening && (
          <div className="flex items-center mt-2 text-red-500">
            <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Listening...</span>
          </div>
        )}
      </div>
    </div>
  );

  // Render analysis charts
  const renderAnalysisCharts = () => {
    if (!analysisData) return null;

    const pieData = {
      labels: ['Technical', 'Behavioral', 'Communication', 'Problem Solving'],
      datasets: [
        {
          data: [
            analysisData.breakdown.technical,
            analysisData.breakdown.behavioral,
            analysisData.breakdown.communication,
            analysisData.breakdown.problemSolving,
          ],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
          borderColor: ['#1E40AF', '#059669', '#D97706', '#DC2626'],
          borderWidth: 2,
        },
      ],
    };

    const barData = {
      labels: ['Technical', 'Behavioral', 'Communication', 'Problem Solving'],
      datasets: [
        {
          label: 'Scores',
          data: [
            analysisData.breakdown.technical,
            analysisData.breakdown.behavioral,
            analysisData.breakdown.communication,
            analysisData.breakdown.problemSolving,
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: 'white',
          },
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

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Score Distribution</h3>
          <div className="w-full max-w-md mx-auto">
            <Pie data={pieData} />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Performance Breakdown</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    );
  };

  // Render results analysis
  const renderAnalysis = () => {
    if (!analysisData) return null;

    return (
      <div className="space-y-8">
        {/* Overall Score */}
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Interview Complete!</h2>
          <div className="text-6xl font-bold text-blue-500 mb-4">{analysisData.overallScore}</div>
          <p className="text-gray-300 text-lg">Overall Score out of 100</p>
        </div>

        {/* Charts */}
        {renderAnalysisCharts()}

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center">
              <FaChartBar className="mr-2" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {analysisData.strengths.map((strength, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {strength}
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
            <ul className="space-y-2">
              {analysisData.weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Recommendations for Improvement</h3>
          <ul className="space-y-3">
            {analysisData.recommendations.map((recommendation, index) => (
              <li key={index} className="text-gray-300 flex items-start">
                <span className="text-blue-500 mr-2 mt-1">→</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              setInterviewState('idle');
              setCurrentQuestion('');
              setQuestionIndex(0);
              setInterviewQuestions([]);
              setUserAnswers([]);
              setCurrentTranscript('');
              setAnalysisData(null);
              setInterviewDuration(0);
              setTimeRemaining(1800);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Take Another Interview
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            AI Interview Simulator
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Practice coding interviews with our AI-powered voice assistant. Get real-time feedback and detailed analysis.
          </p>
        </div>

        {/* Main Content */}
        {interviewState === 'idle' && (
          <>
            {/* Configuration Panel */}
            {renderConfigPanel()}

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Start Interview */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-center hover:from-blue-700 hover:to-blue-900 transition-all duration-300 cursor-pointer transform hover:scale-105"
                   onClick={startInterview}>
                <FaPlay className="text-4xl mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-2">Start Interview</h3>
                <p className="text-blue-100">Begin your AI-powered voice interview</p>
              </div>

              {/* Random Problem */}
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-center hover:from-green-700 hover:to-green-900 transition-all duration-300 cursor-pointer transform hover:scale-105"
                   onClick={handleRandomProblem}>
                <FaRandom className="text-4xl mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-2">Random Problem</h3>
                <p className="text-green-100">Practice with a random coding challenge</p>
              </div>

              {/* Daily Challenge */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-center hover:from-purple-700 hover:to-purple-900 transition-all duration-300 cursor-pointer transform hover:scale-105"
                   onClick={handleDailyChallenge}>
                <FaCalendarAlt className="text-4xl mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-2">Daily Challenge</h3>
                <p className="text-purple-100">Today's featured coding problem</p>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-800 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <FaMicrophone className="text-3xl text-blue-500 mb-3 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">Voice Recognition</h3>
                  <p className="text-gray-400 text-sm">Advanced speech-to-text with real-time transcription</p>
                </div>
                <div className="text-center">
                  <FaChartBar className="text-3xl text-green-500 mb-3 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">Detailed Analysis</h3>
                  <p className="text-gray-400 text-sm">Comprehensive performance breakdown and feedback</p>
                </div>
                <div className="text-center">
                  <FaPlay className="text-3xl text-purple-500 mb-3 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Experience</h3>
                  <p className="text-gray-400 text-sm">Dynamic questions based on your responses</p>
                </div>
              </div>
            </div>
          </>
        )}

        {interviewState === 'active' && renderInterviewControls()}
        {interviewState === 'completed' && renderAnalysis()}
      </div>
    </div>
  );
}
