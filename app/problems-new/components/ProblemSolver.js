'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import ProblemDetail from '../components/ProblemDetail';
import CodeEditor from '../components/CodeEditor';
import { CodeExecutor } from '../utils/codeExecutor';
import { TestRunner } from '../utils/testRunner';
import { 
  FaColumns, 
  FaExpand, 
  FaCompress, 
  FaSpinner,
  FaArrowLeft,
  FaList
} from 'react-icons/fa';
import Link from 'next/link';

export default function ProblemSolver() {
  const { isDark } = useTheme();
  const params = useParams();
  const problemId = params?.id;
  
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState('split'); // 'split', 'problem-only', 'code-only'
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitResults, setSubmitResults] = useState(null);
  const [userInteractions, setUserInteractions] = useState({
    liked: false,
    bookmarked: false
  });

  // Initialize code executor and test runner
  const [codeExecutor] = useState(() => new CodeExecutor());
  const [testRunner] = useState(() => new TestRunner(codeExecutor));

  useEffect(() => {
    if (problemId) {
      fetchProblem(problemId);
      loadUserInteractions(problemId);
    }
  }, [problemId]);

  const fetchProblem = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/problems-new/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch problem: ${response.status}`);
      }
      
      const data = await response.json();
      setProblem(data.problem);
      
    } catch (err) {
      console.error('Error fetching problem:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserInteractions = (id) => {
    try {
      const liked = localStorage.getItem(`problem_liked_${id}`) === 'true';
      const bookmarked = localStorage.getItem(`problem_bookmarked_${id}`) === 'true';
      setUserInteractions({ liked, bookmarked });
    } catch (err) {
      console.error('Error loading user interactions:', err);
    }
  };

  const saveUserInteraction = (type, value) => {
    try {
      localStorage.setItem(`problem_${type}_${problemId}`, value.toString());
    } catch (err) {
      console.error('Error saving user interaction:', err);
    }
  };

  const handleToggleLike = () => {
    const newLiked = !userInteractions.liked;
    setUserInteractions(prev => ({ ...prev, liked: newLiked }));
    saveUserInteraction('liked', newLiked);
  };

  const handleToggleBookmark = () => {
    const newBookmarked = !userInteractions.bookmarked;
    setUserInteractions(prev => ({ ...prev, bookmarked: newBookmarked }));
    saveUserInteraction('bookmarked', newBookmarked);
  };

  const handleRunCode = async (codeData) => {
    try {
      setIsRunning(true);
      setRunResults(null);
      
      // Call the correct run API endpoint
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeData.code,
          language: codeData.language,
          problemId: problemId, // Use the problem ID from params
          customInput: codeData.input || undefined
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to run code: ${response.status}`);
      }
      
      const results = await response.json();
      
      if (results.status === 'error') {
        throw new Error(results.message || 'Code execution failed');
      }
      
      setRunResults(results);
      
    } catch (err) {
      console.error('Error running code:', err);
      setRunResults({
        status: 'error',
        message: err.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async (codeData) => {
    try {
      setIsSubmitting(true);
      setSubmitResults(null);
      
      // Call the correct submit API endpoint
      const response = await fetch('/api/execute/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeData.code,
          language: codeData.language,
          problemSlug: problem?.slug || problem?.id || problemId, // Try slug first, then id
          testType: 'submit'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit code: ${response.status}`);
      }
      
      const results = await response.json();
      
      if (!results.success) {
        throw new Error(results.message || 'Code submission failed');
      }
      
      setSubmitResults(results);
      
      // Update user stats if submission successful
      if (results.success && results.execution?.status === 'Accepted') {
        updateUserStats(results);
      }
      
    } catch (err) {
      console.error('Error submitting code:', err);
      setSubmitResults({
        success: false,
        message: err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserStats = (results) => {
    // Update local storage with submission results
    try {
      const submissionData = {
        problemId,
        timestamp: new Date().toISOString(),
        success: results.execution?.status === 'Accepted',
        status: results.execution?.status || 'Unknown',
        language: results.execution?.language || 'Unknown',
        executionTime: results.execution?.runtime || null,
        memoryUsage: results.execution?.memory || null,
        passedTests: results.execution?.passedTests || 0,
        totalTests: results.execution?.totalTests || 0
      };
      
      const submissions = JSON.parse(localStorage.getItem('user_submissions') || '[]');
      submissions.push(submissionData);
      localStorage.setItem('user_submissions', JSON.stringify(submissions));
      
      // Mark problem as solved if accepted
      if (results.execution?.status === 'Accepted') {
        const solvedProblems = JSON.parse(localStorage.getItem('solved_problems') || '[]');
        if (!solvedProblems.includes(problemId)) {
          solvedProblems.push(problemId);
          localStorage.setItem('solved_problems', JSON.stringify(solvedProblems));
        }
      }
      
    } catch (err) {
      console.error('Error updating user stats:', err);
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'problem-only':
        return 'grid-cols-1';
      case 'code-only':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1 lg:grid-cols-2';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 theme-accent" />
          <p className="text-lg theme-text">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2 theme-text">
            Problem Not Found
          </h2>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-2' : 'text-gray-1'}`}>
            {error}
          </p>
          <Link 
            href="/problems-new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-1' : 'bg-light-1'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-dark-2 border-dark-4' : 'bg-white border-light-4'} border-b sticky top-0 z-10`}>
        <div className="max-w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/problems-new"
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                  isDark ? 'hover:bg-dark-3 text-gray-2 hover:text-light-1' : 'hover:bg-light-2 text-gray-1 hover:text-dark-1'
                }`}
              >
                <FaArrowLeft className="mr-2" />
                <FaList className="mr-2" />
                Problems
              </Link>
              
              <div className={`h-6 w-px ${isDark ? 'bg-dark-4' : 'bg-light-4'}`} />
              
              <h1 className={`text-lg font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                {problem?.title || 'Problem'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Layout Controls */}
              <div className={`flex rounded-lg border ${isDark ? 'border-dark-4 bg-dark-3' : 'border-light-4 bg-light-2'}`}>
                <button
                  onClick={() => setLayout('problem-only')}
                  className={`p-2 rounded-l-lg transition-all duration-200 ${
                    layout === 'problem-only'
                      ? 'bg-blue-600 text-white'
                      : 'theme-text hover:theme-surface-elevated'
                  }`}
                  title="Problem Only"
                >
                  <FaExpand className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setLayout('split')}
                  className={`p-2 transition-all duration-200 ${
                    layout === 'split'
                      ? 'bg-blue-600 text-white'
                      : 'theme-text hover:theme-surface-elevated'
                  }`}
                  title="Split View"
                >
                  <FaColumns className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setLayout('code-only')}
                  className={`p-2 rounded-r-lg transition-all duration-200 ${
                    layout === 'code-only'
                      ? 'bg-blue-600 text-white'
                      : 'theme-text hover:theme-surface-elevated'
                  }`}
                  title="Code Only"
                >
                  <FaCompress className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="h-[calc(100vh-73px)] overflow-hidden">
        <div className={`grid ${getLayoutClasses()} h-full gap-1`}>
          {/* Problem Panel */}
          {(layout === 'split' || layout === 'problem-only') && (
            <motion.div
              key="problem-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden h-full"
            >
              <ProblemDetail
                problem={problem}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
                isLiked={userInteractions.liked}
                isBookmarked={userInteractions.bookmarked}
              />
            </motion.div>
          )}
          
          {/* Code Panel */}
          {(layout === 'split' || layout === 'code-only') && (
            <motion.div
              key="code-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden h-full p-4"
            >
              <CodeEditor
                problem={problem}
                onRunCode={handleRunCode}
                onSubmitCode={handleSubmitCode}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                runResults={runResults}
                submitResults={submitResults}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
