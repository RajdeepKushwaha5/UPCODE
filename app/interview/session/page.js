"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useWebSocket } from "../../../hooks/useWebSocket";
import { useWebRTC } from "../../../hooks/useWebRTC";
import {
  FaPlay,
  FaStop,
  FaClock,
  FaCode,
  FaRobot,
  FaLightbulb,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaVolumeUp,
  FaVolumeOff,
  FaPaperPlane,
  FaSpinner,
  FaSyncAlt,
  FaUsers,
  FaComments,
  FaPhoneSlash
} from 'react-icons/fa';

export default function InterviewSession() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode') || 'technical-coding';
  const company = searchParams.get('company') || 'general';
  const selectedRole = searchParams.get('role') || 'Software Developer';
  
  // AI-generated interview state
  const isAiGenerated = searchParams.get('isAiGenerated') === 'true';
  const isRetry = searchParams.get('isRetry') === 'true';
  const originalSessionId = searchParams.get('originalSessionId');
  const topics = searchParams.get('topics') ? JSON.parse(searchParams.get('topics')) : [];
  const difficulty = searchParams.get('difficulty') || 'medium';
  const questionCount = parseInt(searchParams.get('questionCount') || '5');
  const preGeneratedQuestions = searchParams.get('questions') ? JSON.parse(searchParams.get('questions')) : [];

  // Interview state
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [showHint, setShowHint] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI interview specific state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [aiQuestions, setAiQuestions] = useState(preGeneratedQuestions);
  const [questionResponses, setQuestionResponses] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [questionHistory, setQuestionHistory] = useState([]);

  // Voice and AI features
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Voice conversation flow
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [conversationStep, setConversationStep] = useState('waiting'); // 'waiting', 'asking', 'listening', 'evaluating', 'responding'
  const [currentSpokenQuestion, setCurrentSpokenQuestion] = useState('');
  const [spokenAnswers, setSpokenAnswers] = useState([]);
  const [voiceQuestionCount, setVoiceQuestionCount] = useState(0);
  const [maxQuestions] = useState(5); // Number of questions in conversation
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // Refs for voice features
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const conversationTimeoutRef = useRef(null);

  // Real-time interview state
  const interviewId = searchParams.get('interviewId');
  const candidateName = searchParams.get('candidateName');
  const isHost = searchParams.get('isHost') === 'true';

  // Real-time communication state
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isRealTimeMode, setIsRealTimeMode] = useState(!!interviewId);
  const [interviewStatus, setInterviewStatus] = useState('waiting'); // 'waiting', 'active', 'ended'

  // Video/Audio refs and state
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef(new Map());
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // WebSocket and WebRTC setup
  const getWebSocketUrl = () => {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_WS_URL || `${protocol}//${window.location.hostname}:3001`
        : 'ws://localhost:3001';
      return host;
    }
    return 'ws://localhost:3001';
  };

  const websocketUrl = getWebSocketUrl();
  const { socket, connectionStatus, lastMessage, sendMessage } = useWebSocket(websocketUrl);
  const webRTC = useWebRTC(localVideoRef, remoteVideoRefs, socket, session?.user?.name || candidateName);
  
  // Extract WebRTC functions
  const { 
    localStream, 
    remoteStreams, 
    isVideoEnabled: videoEnabled, 
    isAudioEnabled: audioEnabled, 
    initializeLocalStream, 
    connectToParticipant, 
    toggleVideo, 
    toggleAudio,
    cleanup: cleanupWebRTC 
  } = webRTC;

  // Derived WebSocket connection state
  const wsConnected = connectionStatus === 'Connected';

  // Participant ID for this session
  const [participantId, setParticipantId] = useState(null);  // Mock problem data
  const problems = {
    'technical-coding': [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          }
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9"
        ],
        hints: [
          "Try using a hash map to store the numbers you've seen so far.",
          "For each number, check if (target - current number) exists in the hash map."
        ],
        startingCode: {
          javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
          python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
          java: `public int[] twoSum(int[] nums, int target) {
    // Write your solution here
    
}`
        }
      }
    ],
    'system-design': [
      {
        id: 1,
        title: "Design a URL Shortener",
        difficulty: "Medium",
        description: "Design a URL shortening service like bit.ly. The system should be able to shorten long URLs and redirect users when they access the short URL.",
        requirements: [
          "Shorten long URLs",
          "Redirect to original URL when accessing short URL",
          "Handle 100M URLs per day",
          "Support custom aliases",
          "Analytics (click tracking)"
        ],
        hints: [
          "Consider using base62 encoding for short URLs",
          "Think about database design and caching strategy",
          "Consider load balancing and horizontal scaling"
        ]
      }
    ],
    'behavioral': [
      {
        id: 1,
        title: "Tell me about a time you had to work with a difficult team member",
        category: "Teamwork",
        followUp: [
          "How did you handle the situation?",
          "What was the outcome?",
          "What would you do differently next time?"
        ],
        tips: [
          "Use the STAR method (Situation, Task, Action, Result)",
          "Focus on your actions and the positive outcome",
          "Show emotional intelligence and conflict resolution skills"
        ]
      }
    ]
  };

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechSynthesis = window.speechSynthesis;

      if (SpeechRecognition && SpeechSynthesis) {
        setVoiceSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (mode === 'behavioral') {
            setUserResponse(prev => prev + ' ' + transcript);
          } else {
            setUserMessage(transcript);
            handleSendMessage(transcript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast.error('Voice recognition failed. Please try again.');
        };
      }
    }
  }, [mode]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Generate AI question when starting interview
  const generateAiQuestion = async (difficulty = 'medium') => {
    setIsLoadingQuestion(true);
    try {
      const response = await fetch('/api/interview/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          company,
          difficulty,
          questionHistory
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (response.ok && data.success) {
        setCurrentProblem(data.question);
        setQuestionHistory(prev => [...prev, data.question.title]);

        if (data.question.startingCode) {
          setUserCode(data.question.startingCode[selectedLanguage] || '');
        }

        // Speak the question if speech is enabled
        if (speechEnabled && data.question.description) {
          speakText(`New ${mode.replace('-', ' ')} question: ${data.question.title}. ${data.question.description}`);
        }

        // Show different message based on source
        const message = data.metadata?.source === 'fallback'
          ? 'Question loaded (demo mode)'
          : 'New AI question generated!';
        toast.success(message);
      } else {
        // Handle API errors gracefully
        console.log('API error:', data.error || 'Unknown error');
        throw new Error(data.error || 'Failed to load question');
      }
    } catch (error) {
      console.error('Error generating question:', error);

      // Always show a user-friendly message
      toast.error('Loading demo question...');

      // Fallback to mock problem
      if (problems[mode]) {
        const randomProblem = problems[mode][Math.floor(Math.random() * problems[mode].length)];
        setCurrentProblem(randomProblem);
        if (randomProblem.startingCode) {
          setUserCode(randomProblem.startingCode[selectedLanguage] || '');
        }
        console.log('Loaded fallback question:', randomProblem.title);
      } else {
        // Ultimate fallback
        const defaultProblem = {
          title: "Two Sum",
          difficulty: "Easy",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }],
          constraints: ["2 <= nums.length <= 10^4"],
          hints: ["Try using a hash map"],
          startingCode: {
            javascript: "function twoSum(nums, target) {\n    // Write your solution here\n    \n}",
            python: "def two_sum(nums, target):\n    # Write your solution here\n    pass",
            java: "public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n    \n}"
          }
        };
        setCurrentProblem(defaultProblem);
        setUserCode(defaultProblem.startingCode[selectedLanguage] || '');
      }
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // Initialize with AI question or pre-generated questions
  useEffect(() => {
    if (isAiGenerated && aiQuestions.length > 0) {
      // Use pre-generated questions from AI
      setCurrentProblem(aiQuestions[0]);
      if (aiQuestions[0].starterCode) {
        setUserCode(aiQuestions[0].starterCode);
      }
      // Generate session ID for this interview
      setSessionId(`ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    } else if (mode && !currentProblem && !isLoadingQuestion) {
      // Generate single AI question (legacy behavior)
      generateAiQuestion();
    }
  }, [mode, selectedLanguage, isAiGenerated, aiQuestions]);

  // Handle AI question progression
  const nextAiQuestion = () => {
    if (currentQuestionIndex < aiQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentProblem(aiQuestions[nextIndex]);
      
      // Save current response
      const currentResponse = {
        questionId: aiQuestions[currentQuestionIndex].id,
        question: aiQuestions[currentQuestionIndex],
        response: mode === 'technical-coding' ? userCode : userResponse,
        timeSpent: timeElapsed
      };
      setQuestionResponses(prev => [...prev, currentResponse]);
      
      // Reset for next question
      if (aiQuestions[nextIndex].starterCode) {
        setUserCode(aiQuestions[nextIndex].starterCode);
      } else {
        setUserCode('');
      }
      setUserResponse('');
      setTimeElapsed(0);
      
      toast.success(`Question ${nextIndex + 1} of ${aiQuestions.length}`);
    } else {
      // Interview complete
      completeAiInterview();
    }
  };

  const completeAiInterview = async () => {
    // Save final response
    const finalResponse = {
      questionId: aiQuestions[currentQuestionIndex].id,
      question: aiQuestions[currentQuestionIndex],
      response: mode === 'technical-coding' ? userCode : userResponse,
      timeSpent: timeElapsed
    };
    
    const allResponses = [...questionResponses, finalResponse];
    
    // Calculate overall score (simplified)
    const overallScore = Math.floor(Math.random() * 40) + 60; // Simulated scoring
    
    // Save session if user is logged in
    if (session?.user?.id && sessionId) {
      try {
        await fetch('/api/interview/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'save-session',
            userId: session.user.id,
            interviewConfig: {
              sessionId: sessionId,
              mode: mode,
              topics: topics,
              difficulty: difficulty,
              questions: aiQuestions,
              responses: allResponses,
              overallScore: overallScore,
              timeElapsed: allResponses.reduce((sum, r) => sum + r.timeSpent, 0),
              isRetry: isRetry,
              originalSessionId: originalSessionId,
              completedAt: new Date()
            }
          }),
        });
        
        toast.success('Interview completed and saved!');
      } catch (error) {
        console.error('Error saving interview session:', error);
        toast.error('Interview completed but failed to save');
      }
    }
    
    // Show completion UI
    setIsActive(false);
    setIsSubmitting(false);
    
    toast.success(`🎉 Interview Complete! Score: ${overallScore}%`, {
      duration: 5000,
      position: 'top-center'
    });
    
    // Redirect after a delay
    setTimeout(() => {
      router.push('/interview');
    }, 3000);
  };

  // Handle WebRTC signaling messages
  const handleSignalingMessage = useCallback((data) => {
    if (!webRTC || !data) return;

    try {
      switch (data.type) {
        case 'webrtc-offer':
          if (data.offer && data.from) {
            webRTC.handleOffer(data.offer, data.from);
          }
          break;
        case 'webrtc-answer':
          if (data.answer && data.from) {
            webRTC.handleAnswer(data.answer, data.from);
          }
          break;
        case 'webrtc-ice-candidate':
          if (data.candidate && data.from) {
            webRTC.handleIceCandidate(data.candidate, data.from);
          }
          break;
        default:
          console.log('Unknown WebRTC signaling message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
    }
  }, [webRTC]);

  // Speech synthesis function
  // Enhanced text-to-speech function for conversation
  const speakText = useCallback((text, onEnd = null) => {
    if (!speechEnabled || !window.speechSynthesis) return;

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAiSpeaking(true);
      };

      utterance.onend = () => {
        setIsAiSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        setIsAiSpeaking(false);
        console.warn('Speech synthesis error:', event.error);
        // Continue without speech rather than breaking the app
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis not available:', error);
      setIsAiSpeaking(false);
      if (onEnd) onEnd();
    }
  }, [speechEnabled]);

  // Enhanced continuous voice recognition for conversation
  const startConversationListening = useCallback(() => {
    if (!recognitionRef.current || isAiSpeaking) return;

    try {
      setIsListening(true);
      setConversationStep('listening');

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript.trim()) {
          // Process the answer directly here to avoid circular dependencies
          handleSpokenAnswer(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setConversationStep('waiting');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      setConversationStep('waiting');
    }
  }, [isAiSpeaking]);

  // Handle spoken answer
  const handleSpokenAnswer = async (spokenAnswer) => {
    if (!spokenAnswer.trim() || conversationStep !== 'listening') return;

    setConversationStep('evaluating');
    setIsListening(false);

    // Add to conversation history
    const newAnswer = {
      question: currentSpokenQuestion,
      answer: spokenAnswer,
      timestamp: new Date().toISOString()
    };

    setSpokenAnswers(prev => [...prev, newAnswer]);

    try {
      // Evaluate the answer
      const evaluationResponse = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentSpokenQuestion,
          answer: spokenAnswer,
          context: selectedRole || 'Software Developer'
        })
      });

      if (evaluationResponse.ok) {
        const evalData = await evaluationResponse.json();

        // Speak the evaluation
        const feedbackText = `${evalData.correct ? 'Good answer!' : 'Let me provide some feedback.'} ${evalData.feedback}`;

        speakText(feedbackText, () => {
          // After feedback, generate next question or end conversation
          setTimeout(() => {
            if (voiceQuestionCount < maxQuestions - 1) {
              generateNextQuestion(spokenAnswer);
            } else {
              finishConversation();
            }
          }, 1000);
        });

      } else {
        throw new Error('Evaluation failed');
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      speakText("I couldn't evaluate that answer. Let me ask you another question.", () => {
        setTimeout(() => {
          if (voiceQuestionCount < maxQuestions - 1) {
            generateNextQuestion(spokenAnswer);
          } else {
            finishConversation();
          }
        }, 1000);
      });
    }
  };

  // Generate next question
  const generateNextQuestion = async (previousAnswer = '') => {
    setConversationStep('asking');
    setVoiceQuestionCount(prev => prev + 1);

    try {
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a follow-up interview question based on this previous answer: "${previousAnswer}". Make it relevant to ${selectedRole} role.`,
          conversationHistory: spokenAnswers.slice(-3),
          role: selectedRole || 'Software Developer'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const question = data.response || data.message || "Tell me about your experience with problem-solving.";

        setCurrentSpokenQuestion(question);

        // Speak the question
        speakText(question, () => {
          // After question is spoken, start listening for answer
          setTimeout(() => {
            startConversationListening();
          }, 500);
        });

      } else {
        throw new Error('Failed to generate question');
      }
    } catch (error) {
      console.error('Error generating question:', error);
      // Fallback question
      const fallbackQuestions = [
        "What programming languages are you most comfortable with?",
        "Describe a challenging project you've worked on.",
        "How do you approach debugging complex issues?",
        "What's your experience with version control systems?",
        "How do you stay updated with new technologies?"
      ];

      const question = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      setCurrentSpokenQuestion(question);

      speakText(question, () => {
        setTimeout(() => {
          startConversationListening();
        }, 500);
      });
    }
  };

  // Finish conversation
  const finishConversation = () => {
    setIsConversationMode(false);
    setConversationStep('waiting');
    setIsListening(false);
    stopListening();

    const endMessage = `Thank you for the interview! We've completed ${voiceQuestionCount + 1} questions. You can review your answers below or start a new conversation.`;
    speakText(endMessage);
  };

  // Legacy voice recognition for existing features
  const startListening = () => {
    if (!voiceSupported || !recognitionRef.current) {
      toast.error('Voice recognition not supported');
      return;
    }

    setIsListening(true);
    recognitionRef.current.start();
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Start voice conversation
  const startVoiceConversation = useCallback(() => {
    if (!voiceSupported) {
      toast.error('Voice features are not supported in your browser.');
      return;
    }

    setIsConversationMode(true);
    setConversationStep('asking');
    setVoiceQuestionCount(0);
    setSpokenAnswers([]);
    setCurrentSpokenQuestion('');

    // Start with welcome message and first question
    const welcomeMessage = `Hello! I'm your AI interviewer. We'll have a conversation where I'll ask you ${maxQuestions} questions about the ${selectedRole} role. Please answer verbally after each question. Let's begin!`;

    speakText(welcomeMessage, () => {
      setTimeout(() => {
        generateNextQuestion();
      }, 1000);
    });

  }, [voiceSupported, selectedRole, maxQuestions]);

  // Stop conversation
  const stopConversation = useCallback(() => {
    setIsConversationMode(false);
    setConversationStep('waiting');
    setIsListening(false);
    stopListening();
    window.speechSynthesis.cancel();

  }, [stopListening]);

  // Handle AI chat
  const handleSendMessage = async (message = userMessage) => {
    if (!message.trim() || isAiResponding) return;

    const newMessage = { role: 'user', content: message, timestamp: new Date() };
    setConversationHistory(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsAiResponding(true);

    try {
      const response = await fetch('/api/interview/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          currentQuestion: currentProblem,
          userMessage: message,
          conversationHistory
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          role: 'assistant',
          content: data.response.message,
          type: data.response.type,
          timestamp: new Date()
        };
        setConversationHistory(prev => [...prev, aiMessage]);

        // Speak AI response if enabled
        if (speechEnabled) {
          speakText(data.response.message);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsAiResponding(false);
    }
  };

  // Real-time WebRTC functions
  const joinRoom = () => {
    if (interviewId && localVideoRef.current) {
      joinInterview(interviewId);
    }
  };

  const leaveRoom = () => {
    leaveInterview();
  };

  const handleToggleAudio = () => {
    toggleAudio();
  };

  const handleToggleVideo = () => {
    toggleVideo();
  };

  const sendChatMessage = () => {
    if (chatMessage.trim() && wsConnection) {
      const message = {
        type: 'chat',
        interviewId,
        userId: 'user-' + Math.random().toString(36).substr(2, 9),
        message: chatMessage.trim(),
        timestamp: new Date().toISOString()
      };

      wsConnection.send(JSON.stringify(message));
      setChatMessage('');
    }
  };

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      const data = lastMessage;

      switch (data.type) {
        case 'participant-joined':
          setParticipants(prev => [...prev, data.participant]);
          break;
        case 'participant-left':
          setParticipants(prev => prev.filter(p => p.id !== data.participantId));
          break;
        case 'chat':
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            userId: data.userId,
            message: data.message,
            timestamp: data.timestamp
          }]);
          break;
        case 'webrtc-offer':
        case 'webrtc-answer':
        case 'webrtc-ice-candidate':
          // Handle WebRTC signaling messages
          handleSignalingMessage(data);
          break;
      }
    }
  }, [lastMessage, handleSignalingMessage]);

  // Auto-join interview when component mounts
  useEffect(() => {
    if (interviewId && mounted) {
      joinRoom();
    }

    return () => {
      if (mounted) {
        leaveRoom();
      }
    };
  }, [interviewId, mounted]);

  // Evaluate user response
  const evaluateResponse = async () => {
    setIsSubmitting(true);

    try {
      // For AI-generated interviews, handle progression differently
      if (isAiGenerated && aiQuestions.length > 1) {
        // This is a multi-question AI interview
        if (currentQuestionIndex < aiQuestions.length - 1) {
          // More questions remaining - move to next
          nextAiQuestion();
          return;
        } else {
          // Last question - complete interview
          completeAiInterview();
          return;
        }
      }

      // Legacy single-question evaluation
      const response = await fetch('/api/interview/evaluate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          userResponse: mode === 'technical-coding' ? userCode : userResponse,
          currentQuestion: currentProblem,
          codeSubmission: mode === 'technical-coding' ? userCode : undefined,
          language: selectedLanguage
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);

        // Speak evaluation summary if enabled
        if (speechEnabled) {
          const score = data.evaluation.score;
          const summary = `Your score is ${score} out of 100. ${score >= 80 ? 'Great job!' : score >= 60 ? 'Good effort, room for improvement.' : 'Keep practicing!'}`;
          speakText(summary);
        }

        toast.success(`Response evaluated! Score: ${data.evaluation.score}/100`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error evaluating response:', error);
      toast.error('Failed to evaluate response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setIsActive(true);
    speakText('Interview started! Good luck!');
    toast.success('Interview started! Good luck!', {
      position: 'top-center',
      duration: 3000,
    });
  };

  const endInterview = async () => {
    setIsActive(false);
    setIsSubmitting(true);

    // Save interview session
    if (session?.user?.id) {
      try {
        const sessionData = {
          userId: session.user.id,
          mode,
          company,
          questions: [currentProblem],
          responses: mode === 'technical-coding' ? [{ code: userCode, language: selectedLanguage }] : [{ text: userResponse }],
          evaluation: evaluation || { overallScore: 0 },
          timeElapsed,
          completedAt: new Date()
        };

        await fetch('/api/interview/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData),
        });
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      speakText('Interview completed! Redirecting to results.');
      toast.success('Interview completed! Redirecting to results...', {
        position: 'top-center',
        duration: 3000,
      });

      // Redirect to results page
      setTimeout(() => {
        router.push('/interview/results');
      }, 2000);
    }, 2000);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (currentProblem?.startingCode) {
      setUserCode(currentProblem.startingCode[lang] || '');
    }
  };

  const getAiHint = async () => {
    setShowHint(true);

    // Use AI chat for contextual hints
    await handleSendMessage("Can you give me a hint for this problem?");
  };

  // WebRTC interview functions
  const joinInterview = (roomId) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendMessage({
        type: 'join-room',
        roomId: roomId,
        userData: {
          name: session?.user?.name || candidateName,
          role: 'candidate'
        }
      });
      initializeLocalStream();
    }
  };

  const leaveInterview = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendMessage({
        type: 'leave-room'
      });
    }
    if (cleanupWebRTC) {
      cleanupWebRTC();
    }
    // Navigate back or end interview
    endInterview();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Problem not found</h1>
          <button
            onClick={() => router.push('/interview')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Interview Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/interview')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-white text-xl font-bold">
                {mode.replace('-', ' ').split(' ').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')} Interview
                {isRetry && (
                  <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                    RETRY
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-400 text-sm">
                  {company !== 'general' ? `${company.charAt(0).toUpperCase() + company.slice(1)} Style` : 'General Practice'}
                </p>
                {isAiGenerated && aiQuestions.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-400">
                      Question {currentQuestionIndex + 1} of {aiQuestions.length}
                    </span>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / aiQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {topics.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Topics:</span>
                    {topics.slice(0, 3).map((topic, idx) => (
                      <span key={idx} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                    {topics.length > 3 && (
                      <span className="text-xs text-gray-400">+{topics.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Voice Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-2 rounded-lg transition-colors ${speechEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                title={speechEnabled ? 'Disable speech' : 'Enable speech'}
              >
                {speechEnabled ? <FaVolumeUp /> : <FaVolumeOff />}
              </button>

              {voiceSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={!isActive}
                  className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-blue-500/20 text-blue-400'} disabled:opacity-50`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
              <FaClock className="text-purple-400" />
              <span className="text-white font-mono text-lg">{formatTime(timeElapsed)}</span>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-medium">{isActive ? 'Active' : 'Paused'}</span>
            </div>

            {/* Generate New Question */}
            <button
              onClick={() => generateAiQuestion()}
              disabled={isLoadingQuestion || isActive}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoadingQuestion ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
              New Question
            </button>

            {/* Control Button */}
            {!isActive ? (
              <button
                onClick={startInterview}
                disabled={!currentProblem}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
              >
                <FaPlay />
                Start Interview
              </button>
            ) : (
              <button
                onClick={endInterview}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
              >
                <FaStop />
                {isSubmitting ? 'Submitting...' : 'End Interview'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[calc(100vh-160px)]">

          {/* Problem Panel */}
          <div className="col-span-1 lg:col-span-4 bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6 overflow-y-auto max-h-96 lg:max-h-none">
            {isLoadingQuestion ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FaSpinner className="animate-spin text-4xl text-purple-400 mx-auto mb-4" />
                  <p className="text-white">Generating AI question...</p>
                </div>
              </div>
            ) : currentProblem ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{currentProblem.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${currentProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    currentProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                    {currentProblem.difficulty}
                  </span>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {currentProblem.description}
                </p>

                {/* Examples for coding problems */}
                {currentProblem.examples && (
                  <div className="mb-6">
                    <h3 className="text-white font-bold mb-3">Examples:</h3>
                    {currentProblem.examples.map((example, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-4 mb-3">
                        <div className="mb-2">
                          <span className="text-gray-400 text-sm">Input: </span>
                          <code className="text-green-400">{example.input}</code>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-400 text-sm">Output: </span>
                          <code className="text-blue-400">{example.output}</code>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="text-gray-400 text-sm">Explanation: </span>
                            <span className="text-gray-300">{example.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Requirements for system design */}
                {currentProblem.requirements && (
                  <div className="mb-6">
                    <h3 className="text-white font-bold mb-3">Requirements:</h3>
                    <ul className="space-y-2">
                      {currentProblem.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <FaCheckCircle className="text-green-400 text-sm" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up for behavioral */}
                {currentProblem.followUp && (
                  <div className="mb-6">
                    <h3 className="text-white font-bold mb-3">Follow-up Questions:</h3>
                    <ul className="space-y-2">
                      {currentProblem.followUp.map((question, index) => (
                        <li key={index} className="text-gray-300">
                          • {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Constraints */}
                {currentProblem.constraints && (
                  <div>
                    <h3 className="text-white font-bold mb-3">Constraints:</h3>
                    <ul className="space-y-1">
                      {currentProblem.constraints.map((constraint, index) => (
                        <li key={index} className="text-gray-400 text-sm">
                          • {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <FaCode className="text-4xl mx-auto mb-4" />
                  <p>No question available</p>
                </div>
              </div>
            )}
          </div>

          {/* Voice Conversation Panel */}
          <div className="col-span-1 lg:col-span-4 bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6 flex flex-col min-h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FaMicrophone className="text-green-400" />
                Voice Interview
              </h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${conversationStep === 'waiting' ? 'bg-gray-500/20 text-gray-400' :
                  conversationStep === 'asking' ? 'bg-blue-500/20 text-blue-400' :
                    conversationStep === 'listening' ? 'bg-green-500/20 text-green-400 animate-pulse' :
                      conversationStep === 'evaluating' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-purple-500/20 text-purple-400'
                  }`}>
                  {conversationStep === 'waiting' ? 'Ready' :
                    conversationStep === 'asking' ? 'AI Speaking' :
                      conversationStep === 'listening' ? 'Listening' :
                        conversationStep === 'evaluating' ? 'Evaluating' :
                          'Responding'}
                </span>
              </div>
            </div>

            {/* Conversation Status */}
            <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Questions Asked:</span>
                <span className="text-white font-bold">{voiceQuestionCount}/{maxQuestions}</span>
              </div>

              {isConversationMode && (
                <div className="space-y-2">
                  {currentSpokenQuestion && (
                    <div>
                      <span className="text-gray-400 text-sm">Current Question:</span>
                      <p className="text-gray-300 text-sm mt-1 italic">"{currentSpokenQuestion}"</p>
                    </div>
                  )}

                  {isAiSpeaking && (
                    <div className="flex items-center gap-2">
                      <FaVolumeUp className="text-blue-400 animate-pulse" />
                      <span className="text-blue-400 text-sm">AI is speaking...</span>
                    </div>
                  )}

                  {isListening && (
                    <div className="flex items-center gap-2">
                      <FaMicrophone className="text-green-400 animate-pulse" />
                      <span className="text-green-400 text-sm">Listening for your answer...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Voice Conversation Controls */}
            <div className="space-y-3">
              {!isConversationMode ? (
                <button
                  onClick={startVoiceConversation}
                  disabled={!voiceSupported}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaMicrophone />
                  Start Voice Interview
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={stopConversation}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <FaStop />
                    Stop Voice Interview
                  </button>

                  {conversationStep === 'listening' && (
                    <p className="text-center text-gray-400 text-sm">
                      🎤 Speak your answer now...
                    </p>
                  )}
                </div>
              )}

              {!voiceSupported && (
                <p className="text-yellow-400 text-sm text-center">
                  Voice features not supported in your browser
                </p>
              )}
            </div>

            {/* Conversation History */}
            {spokenAnswers.length > 0 && (
              <div className="mt-4 flex-1 overflow-y-auto">
                <h4 className="text-white font-semibold mb-2">Conversation History:</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {spokenAnswers.slice(-3).map((qa, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-3 text-sm">
                      <div className="mb-2">
                        <span className="text-purple-400 font-semibold">Q:</span>
                        <p className="text-gray-300 ml-4">{qa.question}</p>
                      </div>
                      <div>
                        <span className="text-green-400 font-semibold">A:</span>
                        <p className="text-gray-300 ml-4">{qa.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Response/Code Submission Panel */}
          <div className="col-span-1 lg:col-span-4 bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6 flex flex-col min-h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FaCode className="text-purple-400" />
                {mode === 'technical-coding' ? 'Code Editor' : 'Response Area'}
              </h3>
              <div className="flex items-center gap-2">
                {isAiGenerated && aiQuestions.length > 1 && (
                  <span className="text-sm text-purple-400">
                    {currentQuestionIndex + 1} of {aiQuestions.length}
                  </span>
                )}
              </div>
            </div>

            {/* Response Area */}
            <div className="flex-1 mb-4">
              {mode === 'technical-coding' ? (
                <div className="h-full">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Write your code solution here..."
                    className="w-full h-48 lg:h-64 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-gray-300 font-mono text-sm focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="h-full">
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Type your detailed response here..."
                    className="w-full h-48 lg:h-64 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-gray-300 text-sm focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-3">
                {currentProblem?.hints && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaLightbulb />
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                {isAiGenerated && currentQuestionIndex < aiQuestions.length - 1 && (
                  <button
                    onClick={() => evaluateResponse()}
                    disabled={isSubmitting || !isActive}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 lg:px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaArrowLeft className="rotate-180" />}
                    Next Question
                  </button>
                )}
                
                <button
                  onClick={() => evaluateResponse()}
                  disabled={isSubmitting || !isActive || (!userCode.trim() && !userResponse.trim())}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 lg:px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                  {isAiGenerated && currentQuestionIndex >= aiQuestions.length - 1 ? 'Complete Interview' : 'Submit Answer'}
                </button>
              </div>
            </div>

            {/* Hint Display */}
            {showHint && currentProblem?.hints && (
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">💡 Hints:</h4>
                <ul className="space-y-1">
                  {currentProblem.hints.map((hint, index) => (
                    <li key={index} className="text-yellow-300 text-sm">
                      • {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Response Display */}
            {aiResponse && (
              <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">🤖 AI Feedback:</h4>
                <p className="text-blue-300 text-sm">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Content Grid - Video & Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 h-auto lg:h-80">
          {/* Video Conference Panel */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6 flex flex-col min-h-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FaVideo className="text-blue-400" />
                Video Conference
              </h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${wsConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {wsConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 mb-4 max-h-48 overflow-y-auto">
              {/* Local Video */}
              <div className="relative bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-24 lg:h-32 object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                  You {!audioEnabled && '(Muted)'} {!videoEnabled && '(Camera Off)'}
                </div>
              </div>

              {/* Remote Videos */}
              {Array.from(remoteStreams.entries()).map(([participantId, stream], index) => (
                <div key={participantId} className="relative bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                  <video
                    ref={el => {
                      if (el) el.srcObject = stream;
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-24 lg:h-32 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                    {participantId || `Participant ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={handleToggleAudio}
                className={`p-3 rounded-full transition-colors ${audioEnabled
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                title={audioEnabled ? 'Mute' : 'Unmute'}
              >
                {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
              </button>

              <button
                onClick={handleToggleVideo}
                className={`p-3 rounded-full transition-colors ${videoEnabled
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
              </button>

              <button
                onClick={leaveRoom}
                className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                title="Leave interview"
              >
                <FaPhoneSlash />
              </button>
            </div>

            {/* Participants List */}
            <div className="border-t border-slate-700 pt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Participants ({participants.length})
              </h4>
              <div className="space-y-1">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${participant.connected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <span className="text-gray-300">{participant.name || 'Anonymous'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Chat Panel */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6 flex flex-col min-h-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FaComments className="text-green-400" />
                Live Chat
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {chatMessages.length} messages
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg p-3 lg:p-4 overflow-y-auto mb-4 space-y-2 lg:space-y-3 max-h-48 lg:max-h-64">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-400 py-4 lg:py-8">
                  <FaComments className="text-2xl lg:text-3xl mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-purple-400">
                        {msg.userId.includes('user-') ? 'Participant' : msg.userId}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-700 border border-purple-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none text-sm"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatMessage.trim() || !wsConnected}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
