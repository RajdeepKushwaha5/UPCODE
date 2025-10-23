'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import TestResults from './TestResults';
import { 
  FaTag, 
  FaBuilding, 
  FaClock, 
  FaMemory,
  FaTrophy,
  FaYoutube,
  FaExternalLinkAlt,
  FaCode,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

export default function ProblemDescription({ 
  problem, 
  runResults, 
  submitResults, 
  submissionHistory 
}) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('description');
  const [showHiddenTests, setShowHiddenTests] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatConstraints = (constraints) => {
    if (!constraints) return [];
    if (Array.isArray(constraints)) return constraints;
    if (typeof constraints === 'string') {
      return constraints.split('\n').filter(c => c.trim());
    }
    return [];
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'examples', label: 'Examples' },
    { id: 'constraints', label: 'Constraints' },
    ...(runResults || submitResults ? [{ id: 'results', label: 'Results' }] : []),
    ...(submissionHistory.length > 0 ? [{ id: 'submissions', label: 'Submissions' }] : [])
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Problem header */}
      <div className="p-6 border-b border-opacity-20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-light-1' : 'text-dark-1'} mb-2`}>
              {problem.id}. {problem.title}
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className={`${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                {problem.acceptanceRate || 0}% Acceptance Rate
              </span>
            </div>
          </div>
          
          {problem.youtubeUrl && (
            <a
              href={problem.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              <FaYoutube />
              Video Solution
            </a>
          )}
        </div>

        {/* Tags and companies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {problem.tags?.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                isDark ? 'bg-purple-500/20 theme-text-secondary' : 'bg-purple-100 text-purple-700'
              }`}
            >
              <FaTag className="text-xs" />
              {tag}
            </span>
          ))}
        </div>

        {problem.companies && problem.companies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {problem.companies.slice(0, 5).map((company, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                  isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <FaBuilding className="text-xs" />
                {company}
              </span>
            ))}
            {problem.companies.length > 5 && (
              <span className={`text-xs ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                +{problem.companies.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${isDark ? 'border-dark-4' : 'border-light-4'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-purple-500 text-purple-500'
                : `border-transparent ${isDark ? 'text-light-2 hover:text-light-1' : 'text-dark-2 hover:text-dark-1'}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                <div className={`${isDark ? 'text-light-1' : 'text-dark-1'} leading-relaxed`}>
                  {problem.description ? (
                    <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                  ) : (
                    <p>Problem description not available.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'examples' && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-6"
            >
              {problem.examples?.map((example, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${isDark ? 'bg-dark-3' : 'bg-light-2'}`}
                >
                  <h3 className={`font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'} mb-3`}>
                    Example {index + 1}:
                  </h3>
                  
                  <div className="space-y-2">
                    <div>
                      <span className={`text-sm font-medium ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                        Input:
                      </span>
                      <pre className={`mt-1 p-2 rounded text-sm overflow-x-auto ${
                        isDark ? 'bg-dark-4 text-green-400' : 'bg-gray-100 text-green-600'
                      }`}>
                        {example.input}
                      </pre>
                    </div>
                    
                    <div>
                      <span className={`text-sm font-medium ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                        Output:
                      </span>
                      <pre className={`mt-1 p-2 rounded text-sm overflow-x-auto ${
                        isDark ? 'bg-dark-4 text-blue-400' : 'bg-gray-100 text-blue-600'
                      }`}>
                        {example.output}
                      </pre>
                    </div>
                    
                    {example.explanation && (
                      <div>
                        <span className={`text-sm font-medium ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                          Explanation:
                        </span>
                        <p className={`mt-1 text-sm ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(!problem.examples || problem.examples.length === 0) && (
                <p className={`text-center ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                  No examples available for this problem.
                </p>
              )}
            </motion.div>
          )}

          {activeTab === 'constraints' && (
            <motion.div
              key="constraints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <div className="space-y-6">
                {/* Problem constraints */}
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'} mb-3`}>
                    Constraints:
                  </h3>
                  <ul className={`space-y-1 ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                    {formatConstraints(problem.constraints).map((constraint, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span className="text-sm">{constraint}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {(!problem.constraints || formatConstraints(problem.constraints).length === 0) && (
                    <p className={`text-sm ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                      No specific constraints provided.
                    </p>
                  )}
                </div>

                {/* Time and memory limits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-3' : 'bg-light-2'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-orange-500" />
                      <span className={`font-medium ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                        Time Limit
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                      {problem.timeLimit || 1000}ms
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-3' : 'bg-light-2'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FaMemory className="text-blue-500" />
                      <span className={`font-medium ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                        Memory Limit
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                      {problem.memoryLimit || 256}MB
                    </p>
                  </div>
                </div>

                {/* Test cases info */}
                {problem.testCases && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                        Test Cases:
                      </h3>
                      <button
                        onClick={() => setShowHiddenTests(!showHiddenTests)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
                          isDark 
                            ? 'bg-dark-4 text-light-2 hover:bg-dark-5' 
                            : 'bg-light-3 text-dark-2 hover:bg-light-4'
                        }`}
                      >
                        {showHiddenTests ? <FaEyeSlash /> : <FaEye />}
                        {showHiddenTests ? 'Hide' : 'Show'} Hidden Tests
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {problem.testCases.map((testCase, index) => {
                        const isHidden = testCase.isHidden || index >= 2;
                        if (isHidden && !showHiddenTests) return null;
                        
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              isHidden 
                                ? isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'
                                : isDark ? 'bg-dark-3' : 'bg-light-2'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-sm font-medium ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                                Test Case {index + 1}
                              </span>
                              {isHidden && (
                                <span className="text-xs px-2 py-1 rounded bg-red-500 text-white">
                                  Hidden
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className={`text-xs ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                                  Input:
                                </span>
                                <pre className={`mt-1 p-2 rounded overflow-x-auto ${
                                  isDark ? 'bg-dark-4 text-green-400' : 'bg-gray-100 text-green-600'
                                }`}>
                                  {testCase.input}
                                </pre>
                              </div>
                              
                              <div>
                                <span className={`text-xs ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                                  Expected:
                                </span>
                                <pre className={`mt-1 p-2 rounded overflow-x-auto ${
                                  isDark ? 'bg-dark-4 text-blue-400' : 'bg-gray-100 text-blue-600'
                                }`}>
                                  {testCase.expectedOutput || testCase.output}
                                </pre>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'results' && (runResults || submitResults) && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <TestResults 
                runResults={runResults} 
                submitResults={submitResults} 
              />
            </motion.div>
          )}

          {activeTab === 'submissions' && submissionHistory.length > 0 && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <div className="space-y-3">
                {submissionHistory.map((submission, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${isDark ? 'bg-dark-3' : 'bg-light-2'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          submission.status === 'Accepted' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {submission.status}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                          {submission.language}
                        </span>
                      </div>
                      <span className={`text-xs ${isDark ? 'text-light-3' : 'text-dark-3'}`}>
                        {new Date(submission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    {submission.executionTime && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                          Runtime: {submission.executionTime}ms
                        </span>
                        {submission.memoryUsage && (
                          <span className={`${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                            Memory: {submission.memoryUsage}KB
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
