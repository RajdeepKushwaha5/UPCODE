'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FaPlay, 
  FaPaperPlane, 
  FaSpinner, 
  FaUndo, 
  FaTerminal,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaCode,
  FaClock,
  FaMemory
} from 'react-icons/fa';
import { SUPPORTED_LANGUAGES, CODE_TEMPLATES } from '../utils/constants';

export default function CodeEditor({ 
  problem, 
  onRunCode, 
  onSubmitCode, 
  isRunning = false, 
  isSubmitting = false,
  runResults = null,
  submitResults = null 
}) {
  const { isDark } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [userCode, setUserCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (problem) {
      // Load saved code or generate template
      loadUserCode();
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (runResults || submitResults) {
      setShowResults(true);
    }
  }, [runResults, submitResults]);

  const loadUserCode = () => {
    try {
      const savedCode = localStorage.getItem(`code_${problem._id}_${selectedLanguage}`);
      if (savedCode) {
        setUserCode(savedCode);
      } else {
        // Generate template for the selected language
        const template = generateCodeTemplate(selectedLanguage);
        setUserCode(template);
      }
    } catch (error) {
      console.error('Error loading user code:', error);
      const template = generateCodeTemplate(selectedLanguage);
      setUserCode(template);
    }
  };

  const generateCodeTemplate = (language) => {
    const functionName = problem.title?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'solution';
    
    // Check if problem has specific templates
    if (problem.codeTemplates) {
      const template = problem.codeTemplates.find(t => t.language === language);
      if (template) return template.code;
    }
    
    // Use default templates
    return CODE_TEMPLATES[language] ? CODE_TEMPLATES[language](functionName) : CODE_TEMPLATES.javascript(functionName);
  };

  const handleCodeChange = (value) => {
    setUserCode(value);
    saveUserCode(value);
  };

  const saveUserCode = (code) => {
    try {
      localStorage.setItem(`code_${problem._id}_${selectedLanguage}`, code);
    } catch (error) {
      console.error('Error saving user code:', error);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    // Save current code before switching
    if (userCode.trim()) {
      saveUserCode(userCode);
    }
    
    setSelectedLanguage(newLanguage);
    // Code will be loaded in the useEffect
  };

  const handleRunCode = () => {
    if (!userCode.trim()) {
      alert('Please write some code first!');
      return;
    }

    const codeData = {
      code: userCode,
      language: selectedLanguage,
      input: customInput || undefined,
      problemId: problem._id
    };

    onRunCode(codeData);
  };

  const handleSubmitCode = () => {
    if (!userCode.trim()) {
      alert('Please write some code first!');
      return;
    }

    const codeData = {
      code: userCode,
      language: selectedLanguage,
      problemId: problem._id
    };

    onSubmitCode(codeData);
  };

  const handleResetCode = () => {
    const template = generateCodeTemplate(selectedLanguage);
    setUserCode(template);
    saveUserCode(template);
  };

  const getLanguageDisplay = (langId) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.id === langId);
    return lang ? lang.name : langId;
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Code Editor */}
      <div className={`${isDark ? 'bg-dark-2 border-purple-600/20' : 'bg-white border-light-4'} rounded-xl border shadow-lg flex-1 flex flex-col min-h-0`}>
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-dark-4' : 'border-light-4'} flex-shrink-0`}>
          <div className="flex items-center gap-4">
            <h3 className={`font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
              Code Editor
            </h3>
            
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={`px-3 py-1 text-sm rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-dark-3 border-dark-4 text-light-1 focus:border-purple-400' 
                  : 'bg-white border-light-4 text-dark-1 focus:border-blue-500'
              }`}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCode}
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-300 hover:scale-105 ${
                isDark ? 'bg-dark-3 hover:bg-dark-4 text-gray-2' : 'bg-light-3 hover:bg-light-4 text-gray-1'
              }`}
              title="Reset to template"
            >
              <FaUndo className="w-3 h-3 mr-2" />
              Reset
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 min-h-0">
          <textarea
            value={userCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            className={`w-full h-full p-4 font-mono text-sm rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none scrollbar-hide ${
              isDark 
                ? 'bg-dark-3 text-green-400 border-dark-4 focus:border-purple-400' 
                : 'bg-light-2 text-gray-900 border-light-4 focus:border-blue-500'
            }`}
            placeholder={`Write your ${getLanguageDisplay(selectedLanguage)} solution here...`}
            spellCheck={false}
            style={{ minHeight: '300px' }}
          />
        </div>
      </div>

      {/* Custom Input Section */}
      <div className={`${isDark ? 'bg-dark-2 border-purple-600/20' : 'bg-white border-light-4'} rounded-xl border shadow-lg`}>
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-dark-4' : 'border-light-4'}`}>
          <h3 className={`font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>Custom Input</h3>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
              showCustomInput
                ? (isDark ? 'bg-blue-600 text-white' : 'bg-purple-500 text-white')
                : (isDark ? 'bg-dark-3 hover:bg-dark-4 text-gray-2' : 'bg-light-3 hover:bg-light-4 text-gray-1')
            }`}
          >
            <FaTerminal className="w-3 h-3 mr-2" />
            {showCustomInput ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {showCustomInput && (
          <div className="p-4">
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter your custom test input here..."
              className={`w-full h-20 p-3 font-mono text-sm rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none ${
                isDark 
                  ? 'bg-dark-3 text-light-1 border-dark-4 focus:border-purple-400' 
                  : 'bg-light-2 text-dark-1 border-light-4 focus:border-blue-500'
              }`}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            isRunning
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
          }`}
        >
          {isRunning ? <FaSpinner className="animate-spin" /> : <FaPlay />}
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>

        <button
          onClick={handleSubmitCode}
          disabled={isSubmitting}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            isSubmitting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
          }`}
        >
          {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
          <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
        </button>

        {(runResults || submitResults) && (
          <button
            onClick={() => setShowResults(!showResults)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              isDark ? 'bg-dark-3 hover:bg-dark-4 text-light-1' : 'bg-light-3 hover:bg-light-4 text-dark-1'
            }`}
          >
            {showResults ? <FaEyeSlash /> : <FaEye />}
            <span>{showResults ? 'Hide Results' : 'Show Results'}</span>
          </button>
        )}
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && (runResults || submitResults) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${isDark ? 'bg-dark-2 border-purple-600/20' : 'bg-white border-light-4'} rounded-xl border shadow-lg max-h-96 flex flex-col`}
          >
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-dark-4' : 'border-light-4'} flex-shrink-0`}>
              <h3 className={`font-semibold ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                {submitResults ? 'Submission Results' : 'Run Results'}
              </h3>
              <button
                onClick={() => setShowResults(false)}
                className={`text-sm ${isDark ? 'text-gray-2 hover:text-light-1' : 'text-gray-1 hover:text-dark-1'} transition-colors duration-300`}
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto scrollbar-hide">{/* Made this scrollable */}
              {/* Check for success in both run and submit results */}
              {(submitResults?.success !== false && runResults?.status === 'success') || 
               (submitResults?.success === true) ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-400">
                    <FaCheck className="w-4 h-4" />
                    <span className="font-medium">
                      {submitResults ? 
                        (submitResults.execution?.status === 'Accepted' ? 'Solution Accepted!' : `Status: ${submitResults.execution?.status}`) : 
                        'Code Executed Successfully!'
                      }
                    </span>
                  </div>
                  
                  {/* Performance Metrics */}
                  {(submitResults?.execution?.runtime || runResults?.summary) && (
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-blue-400" />
                        <span className={isDark ? 'text-gray-2' : 'text-gray-1'}>
                          Runtime: {submitResults?.execution?.runtime || 'N/A'}
                        </span>
                      </div>
                      {submitResults?.execution?.memory && (
                        <div className="flex items-center gap-2">
                          <FaMemory className="theme-accent" />
                          <span className={isDark ? 'text-gray-2' : 'text-gray-1'}>
                            Memory: {submitResults.execution.memory}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Test Cases Results */}
                  {(submitResults?.execution?.testCases || runResults?.results) && (
                    <div className="space-y-2">
                      <h4 className={`font-medium ${isDark ? 'text-light-1' : 'text-dark-1'}`}>
                        Test Cases: {
                          submitResults ? 
                            `${submitResults.execution.passedTests}/${submitResults.execution.totalTests} Passed` :
                            `${runResults.summary?.passed || 0}/${runResults.summary?.total || 0} Passed`
                        }
                      </h4>
                      {(submitResults?.execution?.testCases || runResults?.results || []).slice(0, 3).map((testCase, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            (testCase.passed === true || testCase.status === 'Accepted') 
                              ? (isDark ? 'bg-green-900/20 border-green-600/50' : 'bg-green-50 border-green-200')
                              : (isDark ? 'bg-red-900/20 border-red-600/50' : 'bg-red-50 border-red-200')
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className={`text-sm font-medium ${(testCase.passed === true || testCase.status === 'Accepted') ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                              {(testCase.passed === true || testCase.status === 'Accepted') ? (
                                <FaCheck className="w-4 h-4 text-green-400 mr-2" />
                              ) : (
                                <FaTimes className="w-4 h-4 text-red-400 mr-2" />
                              )}
                              Test Case {testCase.testId || index + 1}
                              {testCase.isCustom && (
                                <span className={`ml-2 px-2 py-1 text-xs rounded ${isDark ? 'bg-blue-600 text-blue-300' : 'bg-blue-200 text-blue-600'}`}>
                                  Custom
                                </span>
                              )}
                            </span>
                          </div>
                          
                          {testCase.input && (
                            <div className="text-xs space-y-1">
                              <div>
                                <span className="font-medium">Input: </span>
                                <code className={`${isDark ? 'text-cyan-300' : 'text-blue-600'}`}>{testCase.input}</code>
                              </div>
                              {testCase.expectedOutput && (
                                <div>
                                  <span className="font-medium">Expected: </span>
                                  <code className={`${isDark ? 'text-green-300' : 'text-green-600'}`}>{testCase.expectedOutput}</code>
                                </div>
                              )}
                              {testCase.actualOutput && (
                                <div>
                                  <span className="font-medium">Got: </span>
                                  <code className={`${(testCase.passed === true || testCase.status === 'Accepted') ? (isDark ? 'text-green-300' : 'text-green-600') : (isDark ? 'text-red-300' : 'text-red-600')}`}>
                                    {testCase.actualOutput}
                                  </code>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {testCase.error && (
                            <div className="mt-2">
                              <span className={`text-xs ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                                Error: {testCase.error}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <FaTimes className="w-4 h-4" />
                    <span className="font-medium">Error</span>
                  </div>
                  <div className={`${isDark ? 'bg-red-900/20 border-red-600/50' : 'bg-red-50 border-red-200'} border rounded-lg p-3`}>
                    <span className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                      {submitResults?.message || runResults?.message || 'An error occurred while executing your code'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
