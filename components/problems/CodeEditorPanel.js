'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import TestResults from './TestResults';
import { 
  FaPlay, 
  FaPaperPlane, 
  FaSpinner, 
  FaUndo, 
  FaCog,
  FaExpand,
  FaCompress,
  FaCode,
  FaTerminal,
  FaEyeSlash,
  FaEye
} from 'react-icons/fa';
import Editor from '@monaco-editor/react';

const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: 'js', judge0Id: 63 },
  { id: 'python', name: 'Python', extension: 'py', judge0Id: 71 },
  { id: 'java', name: 'Java', extension: 'java', judge0Id: 62 },
  { id: 'cpp', name: 'C++', extension: 'cpp', judge0Id: 54 },
  { id: 'c', name: 'C', extension: 'c', judge0Id: 50 },
  { id: 'csharp', name: 'C#', extension: 'cs', judge0Id: 51 },
  { id: 'go', name: 'Go', extension: 'go', judge0Id: 60 },
  { id: 'rust', name: 'Rust', extension: 'rs', judge0Id: 73 }
];

const DEFAULT_TEMPLATES = {
  javascript: (problemTitle) => `function ${problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}() {
    // Write your solution here
    
}`,
  python: (problemTitle) => `def ${problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}():
    # Write your solution here
    pass`,
  java: (problemTitle) => `class Solution {
    public void ${problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}() {
        // Write your solution here
        
    }
}`,
  cpp: (problemTitle) => `class Solution {
public:
    void ${problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}() {
        // Write your solution here
        
    }
};`,
  c: (problemTitle) => `#include <stdio.h>

int ${problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}() {
    // Write your solution here
    return 0;
}`,
  csharp: (problemTitle) => `public class Solution {
    public void ${problemTitle.charAt(0).toUpperCase() + problemTitle.slice(1).replace(/[^a-z0-9]/gi, '')}() {
        // Write your solution here
        
    }
}`,
  go: (problemTitle) => `package main

import "fmt"

func ${problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}() {
    // Write your solution here
    
}`,
  rust: (problemTitle) => `impl Solution {
    pub fn ${problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}() {
        // Write your solution here
        
    }
}`
};

export default function CodeEditorPanel({
  problem,
  code,
  language,
  customInput,
  isRunning,
  isSubmitting,
  onCodeChange,
  onLanguageChange,
  onCustomInputChange,
  onRun,
  onSubmit,
  runResults,
  submitResults
}) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('code');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    wordWrap: 'off',
    minimap: false,
    lineNumbers: 'on',
    folding: true
  });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const editorRef = useRef(null);

  const getCurrentLanguage = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.id === language) || SUPPORTED_LANGUAGES[0];
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmit();
    });
  };

  const handleLanguageChange = (newLanguage) => {
    onLanguageChange(newLanguage);
  };

  const resetCode = () => {
    if (problem?.codeTemplates) {
      const template = problem.codeTemplates.find(t => t.language === language);
      if (template) {
        onCodeChange(template.code);
        return;
      }
    }
    
    // Use default template
    const template = DEFAULT_TEMPLATES[language];
    if (template) {
      const code = template(problem?.title || 'solution');
      onCodeChange(code);
    }
  };

  const tabs = [
    { id: 'code', label: 'Code', icon: FaCode },
    { id: 'testcase', label: 'Testcase', icon: FaTerminal },
    ...(runResults || submitResults ? [{ id: 'result', label: 'Result', icon: null }] : [])
  ];

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-dark-2' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-dark-4' : 'border-light-4'}`}>
        <div className="flex items-center gap-4">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark 
                  ? 'bg-dark-3 border-dark-4 text-light-1' 
                  : 'bg-white border-light-4 text-dark-1'
              }`}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-save indicator */}
          <span className={`text-xs ${isDark ? 'text-light-3' : 'text-dark-3'}`}>
            Auto-saved
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-light-2 hover:text-light-1 hover:bg-dark-3' 
                : 'text-dark-2 hover:text-dark-1 hover:bg-light-2'
            }`}
            title="Editor Settings"
          >
            <FaCog />
          </button>

          {/* Reset code */}
          <button
            onClick={resetCode}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-light-2 hover:text-light-1 hover:bg-dark-3' 
                : 'text-dark-2 hover:text-dark-1 hover:bg-light-2'
            }`}
            title="Reset to Template"
          >
            <FaUndo />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-light-2 hover:text-light-1 hover:bg-dark-3' 
                : 'text-dark-2 hover:text-dark-1 hover:bg-light-2'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-b ${isDark ? 'border-dark-4 bg-dark-3' : 'border-light-4 bg-light-2'} p-4`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-light-1' : 'text-dark-1'} mb-1`}>
                  Font Size
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={editorSettings.fontSize}
                  onChange={(e) => setEditorSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <span className={`text-xs ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                  {editorSettings.fontSize}px
                </span>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-light-1' : 'text-dark-1'} mb-1`}>
                  Word Wrap
                </label>
                <select
                  value={editorSettings.wordWrap}
                  onChange={(e) => setEditorSettings(prev => ({ ...prev, wordWrap: e.target.value }))}
                  className={`w-full px-2 py-1 rounded text-sm ${
                    isDark ? 'bg-dark-4 text-light-1' : 'bg-white text-dark-1'
                  }`}
                >
                  <option value="off">Off</option>
                  <option value="on">On</option>
                  <option value="wordWrapColumn">Column</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className={`flex border-b ${isDark ? 'border-dark-4' : 'border-light-4'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-purple-500 text-purple-500'
                : `border-transparent ${isDark ? 'text-light-2 hover:text-light-1' : 'text-dark-2 hover:text-dark-1'}`
            }`}
          >
            {tab.icon && <tab.icon />}
            {tab.label}
            {tab.id === 'result' && (runResults || submitResults) && (
              <span className={`w-2 h-2 rounded-full ${
                (runResults?.success || submitResults?.success) ? 'bg-green-500' : 'bg-red-500'
              }`} />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getCurrentLanguage().id === 'cpp' ? 'cpp' : getCurrentLanguage().id}
                  value={code}
                  onChange={onCodeChange}
                  onMount={handleEditorDidMount}
                  theme={isDark ? 'vs-dark' : 'light'}
                  options={{
                    fontSize: editorSettings.fontSize,
                    wordWrap: editorSettings.wordWrap,
                    minimap: { enabled: editorSettings.minimap },
                    lineNumbers: editorSettings.lineNumbers,
                    folding: editorSettings.folding,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    parameterHints: { enabled: true },
                    bracketPairColorization: { enabled: true },
                    guides: {
                      bracketPairs: true,
                      indentation: true
                    }
                  }}
                />
              </div>
              
              {/* Action buttons */}
              <div className={`flex items-center justify-between p-4 border-t ${isDark ? 'border-dark-4' : 'border-light-4'}`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      showCustomInput
                        ? 'bg-purple-500 text-white'
                        : isDark 
                          ? 'bg-dark-3 text-light-2 hover:bg-dark-4' 
                          : 'bg-light-2 text-dark-2 hover:bg-light-3'
                    }`}
                  >
                    {showCustomInput ? <FaEyeSlash /> : <FaEye />}
                    Custom Input
                  </button>
                  
                  <span className={`text-xs ${isDark ? 'text-light-3' : 'text-dark-3'}`}>
                    Ctrl+Enter to run • Ctrl+Shift+Enter to submit
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={onRun}
                    disabled={isRunning || isSubmitting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isRunning
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isRunning ? <FaSpinner className="animate-spin" /> : <FaPlay />}
                    {isRunning ? 'Running...' : 'Run'}
                  </button>
                  
                  <button
                    onClick={onSubmit}
                    disabled={isRunning || isSubmitting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'testcase' && (
            <motion.div
              key="testcase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col p-4"
            >
              <div className="mb-4">
                <label className={`block text-sm font-medium ${isDark ? 'text-light-1' : 'text-dark-1'} mb-2`}>
                  Custom Input (Optional)
                </label>
                <textarea
                  value={customInput}
                  onChange={(e) => onCustomInputChange(e.target.value)}
                  placeholder="Enter your custom input here..."
                  className={`w-full h-32 p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark 
                      ? 'bg-dark-3 border-dark-4 text-light-1 placeholder-light-3' 
                      : 'bg-white border-light-4 text-dark-1 placeholder-dark-3'
                  }`}
                />
              </div>
              
              <div className="flex-1">
                <h3 className={`text-sm font-medium ${isDark ? 'text-light-1' : 'text-dark-1'} mb-3`}>
                  Sample Test Cases:
                </h3>
                
                <div className="space-y-3">
                  {problem?.testCases?.slice(0, 2).map((testCase, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${isDark ? 'bg-dark-3' : 'bg-light-2'}`}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className={`text-xs font-medium ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                            Input:
                          </span>
                          <pre className={`mt-1 p-2 rounded text-xs overflow-x-auto ${
                            isDark ? 'bg-dark-4 text-green-400' : 'bg-gray-100 text-green-600'
                          }`}>
                            {testCase.input}
                          </pre>
                        </div>
                        
                        <div>
                          <span className={`text-xs font-medium ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                            Expected Output:
                          </span>
                          <pre className={`mt-1 p-2 rounded text-xs overflow-x-auto ${
                            isDark ? 'bg-dark-4 text-blue-400' : 'bg-gray-100 text-blue-600'
                          }`}>
                            {testCase.expectedOutput || testCase.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className={`text-center ${isDark ? 'text-light-2' : 'text-dark-2'}`}>
                      No test cases available
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'result' && (runResults || submitResults) && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto p-4"
            >
              <TestResults 
                runResults={runResults} 
                submitResults={submitResults} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
