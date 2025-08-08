'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaCheck, 
  FaTimes, 
  FaClock, 
  FaMemory,
  FaCode,
  FaChevronDown,
  FaChevronRight,
  FaExclamationTriangle,
  FaSpinner,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

export default function TestResults({ runResults, submitResults }) {
  const { isDark } = useTheme();
  const [expandedTestCase, setExpandedTestCase] = useState(null);
  const [showHiddenTests, setShowHiddenTests] = useState(false);

  const results = submitResults || runResults;
  
  if (!results) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
        No results to display
      </div>
    );
  }

  const isRunResult = !!runResults && !submitResults;
  
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'OK':
      case 'ACCEPTED':
      case 'SUCCESS':
        return 'text-green-500';
      case 'WA':
      case 'WRONG ANSWER':
      case 'WRONGANSWER':
        return 'text-red-500';
      case 'TLE':
      case 'TIME LIMIT EXCEEDED':
      case 'TIMELIMITEXCEEDED':
        return 'text-orange-500';
      case 'RTE':
      case 'RUNTIME ERROR':
      case 'RUNTIMEERROR':
        return 'text-red-500';
      case 'CE':
      case 'COMPILATION ERROR':
      case 'COMPILATIONERROR':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'OK':
      case 'ACCEPTED':
      case 'SUCCESS':
        return <FaCheck className="text-green-500" />;
      case 'WA':
      case 'WRONG ANSWER':
      case 'WRONGANSWER':
        return <FaTimes className="text-red-500" />;
      case 'TLE':
      case 'TIME LIMIT EXCEEDED':
      case 'TIMELIMITEXCEEDED':
        return <FaClock className="text-orange-500" />;
      case 'RTE':
      case 'RUNTIME ERROR':
      case 'RUNTIMEERROR':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'CE':
      case 'COMPILATION ERROR':
      case 'COMPILATIONERROR':
        return <FaCode className="text-yellow-500" />;
      default:
        return <FaSpinner className="text-gray-500" />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    const statusMap = {
      'OK': 'Accepted',
      'WA': 'Wrong Answer',
      'TLE': 'Time Limit Exceeded',
      'RTE': 'Runtime Error',
      'CE': 'Compilation Error'
    };
    return statusMap[status.toUpperCase()] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Overall result header */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-3' : 'bg-light-2'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(results.status || results.result)}
            <h2 className={`text-lg font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
              {isRunResult ? 'Run Results' : 'Submission Results'}
            </h2>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            (results.status === 'Accepted' || results.success) 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {formatStatus(results.status || results.result || (results.success ? 'Success' : 'Failed'))}
          </div>
        </div>

        {/* Test case summary */}
        {(results.testResults || results.passedTests !== undefined) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-dark-4' : 'bg-light-3'}`}>
              <div className={`text-2xl font-bold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                {results.testResults?.passed || results.passedTests || 0}
              </div>
              <div className={`text-sm ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                Passed
              </div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-dark-4' : 'bg-light-3'}`}>
              <div className={`text-2xl font-bold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                {results.testResults?.total || results.totalTests || 0}
              </div>
              <div className={`text-sm ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                Total
              </div>
            </div>
            
            {(results.testResults?.runtime || results.executionTime || results.runtime) && (
              <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-dark-4' : 'bg-light-3'}`}>
                <div className={`text-2xl font-bold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                  {(results.testResults?.runtime || results.executionTime || results.runtime)?.replace('ms', '')}
                </div>
                <div className={`text-sm ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                  Runtime (ms)
                </div>
              </div>
            )}
            
            {(results.testResults?.memory || results.memoryUsage || results.memory) && (
              <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-dark-4' : 'bg-light-3'}`}>
                <div className={`text-2xl font-bold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                  {(results.testResults?.memory || results.memoryUsage || results.memory)?.replace('KB', '')}
                </div>
                <div className={`text-sm ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                  Memory (KB)
                </div>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        {(results.message || results.logs) && (
          <div className={`p-3 rounded-lg ${isDark ? 'bg-dark-4' : 'bg-light-3'}`}>
            <p className={`text-sm ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
              {results.message || results.logs}
            </p>
          </div>
        )}
      </div>

      {/* Error display */}
      {results.error && (
        <div className={`p-4 rounded-lg border-l-4 border-red-500 ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="text-red-500" />
            <h3 className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-700'}`}>
              Error
            </h3>
          </div>
          <pre className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'} overflow-x-auto`}>
            {results.error}
          </pre>
        </div>
      )}

      {/* Individual test case results */}
      {(results.testResults?.publicTestCases || results.testResults?.testCases || results.testCases) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
              Test Case Details
            </h3>
            
            {/* Toggle hidden tests button for submit results */}
            {!isRunResult && results.testResults?.hiddenSummary && (
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
            )}
          </div>

          {/* Hidden test summary */}
          {!isRunResult && results.testResults?.hiddenSummary && showHiddenTests && (
            <div className={`mb-4 p-4 rounded-lg ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FaEyeSlash className="text-orange-500" />
                <h4 className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                  Hidden Test Cases Summary
                </h4>
              </div>
              <p className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                Passed: {results.testResults.hiddenSummary.passed} / {results.testResults.hiddenSummary.total}
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                Hidden test case details are not shown to prevent solution reverse-engineering.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            {(results.testResults?.publicTestCases || results.testResults?.testCases || results.testCases).map((testCase, index) => {
              const isPassed = testCase.passed || testCase.status === 'OK' || testCase.status === 'passed';
              const isExpanded = expandedTestCase === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg overflow-hidden ${
                    isPassed 
                      ? isDark ? 'border-green-500/30 bg-green-900/10' : 'border-green-200 bg-green-50'
                      : isDark ? 'border-red-500/30 bg-red-900/10' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <button
                    onClick={() => setExpandedTestCase(isExpanded ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-opacity-80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isPassed ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      
                      <div>
                        <div className={`font-medium ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                          Test Case {testCase.testNumber || index + 1}
                        </div>
                        <div className={`text-sm ${
                          isPassed 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formatStatus(testCase.status || (isPassed ? 'OK' : 'WA'))}
                          {testCase.runtime && ` • ${testCase.runtime}`}
                          {testCase.memory && ` • ${testCase.memory}`}
                        </div>
                      </div>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronRight className={`${isDark ? 'text-light-2' : 'text-dark-2'}`} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`border-t ${isDark ? 'border-dark-4' : 'border-light-4'}`}
                      >
                        <div className="p-4 space-y-4">
                          {/* Input */}
                          {testCase.input !== undefined && (
                            <div>
                              <h4 className={`text-sm font-medium ${isDark ? 'text-light-2' : 'text-dark-2'} mb-2`}>
                                Input:
                              </h4>
                              <pre className={`p-3 rounded text-sm overflow-x-auto ${
                                isDark ? 'bg-dark-4 text-green-400' : 'bg-gray-100 text-green-600'
                              }`}>
                                {testCase.input}
                              </pre>
                            </div>
                          )}
                          
                          {/* Expected Output */}
                          {(testCase.expectedOutput !== undefined || testCase.expected !== undefined) && (
                            <div>
                              <h4 className={`text-sm font-medium ${isDark ? 'text-light-2' : 'text-dark-2'} mb-2`}>
                                Expected Output:
                              </h4>
                              <pre className={`p-3 rounded text-sm overflow-x-auto ${
                                isDark ? 'bg-dark-4 text-blue-400' : 'bg-gray-100 text-blue-600'
                              }`}>
                                {testCase.expectedOutput || testCase.expected}
                              </pre>
                            </div>
                          )}
                          
                          {/* Actual Output */}
                          {(testCase.actualOutput !== undefined || testCase.actual !== undefined) && (
                            <div>
                              <h4 className={`text-sm font-medium ${isDark ? 'text-light-2' : 'text-dark-2'} mb-2`}>
                                Your Output:
                              </h4>
                              <pre className={`p-3 rounded text-sm overflow-x-auto ${
                                isPassed 
                                  ? isDark ? 'bg-dark-4 text-blue-400' : 'bg-gray-100 text-blue-600'
                                  : isDark ? 'bg-dark-4 text-red-400' : 'bg-gray-100 text-red-600'
                              }`}>
                                {testCase.actualOutput || testCase.actual}
                              </pre>
                            </div>
                          )}
                          
                          {/* Error details */}
                          {testCase.error && (
                            <div>
                              <h4 className={`text-sm font-medium ${isDark ? 'text-light-2' : 'text-dark-2'} mb-2`}>
                                Error:
                              </h4>
                              <pre className={`p-3 rounded text-sm overflow-x-auto ${
                                isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
                              }`}>
                                {testCase.error}
                              </pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom input result */}
      {isRunResult && results.message?.includes('Custom input') && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <FaCode className="text-blue-500" />
            <h3 className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
              Custom Input Result
            </h3>
          </div>
          <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
            Your code executed successfully with custom input. Check the output above.
          </p>
        </div>
      )}
    </div>
  );
}
