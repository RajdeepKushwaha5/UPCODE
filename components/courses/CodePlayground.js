'use client';
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodePlayground = ({ 
    initialCode = '', 
    language = 'cpp',
    title = 'Code Playground',
    expectedOutput = '',
    hints = [],
    testCases = []
}) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [currentHint, setCurrentHint] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState(14);

    const simulateCodeExecution = (userCode) => {
        // This is a simulation - in a real implementation, you'd send to a code execution service
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simple simulation logic
                if (userCode.includes('cout') && userCode.includes('Hello')) {
                    resolve('Hello, World!\n');
                } else if (userCode.includes('int main')) {
                    resolve('Program executed successfully!\n');
                } else if (userCode.trim() === '') {
                    resolve('Error: No code to execute\n');
                } else {
                    resolve('Output: Code executed\n');
                }
            }, 1500);
        });
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('Running code...\n');
        
        try {
            const result = await simulateCodeExecution(code);
            setOutput(result);
        } catch (error) {
            setOutput(`Error: ${error.message}\n`);
        } finally {
            setIsRunning(false);
        }
    };

    const resetCode = () => {
        setCode(initialCode);
        setOutput('');
        setCurrentHint(0);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(code);
    };

    const downloadCode = () => {
        const element = document.createElement('a');
        const file = new Blob([code], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `playground.${language}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const getLanguageIcon = (lang) => {
        const icons = {
            'cpp': '⚡',
            'javascript': '🟨',
            'python': '🐍',
            'java': '☕',
            'c': '🔧'
        };
        return icons[lang] || '💻';
    };

    const nextHint = () => {
        setCurrentHint((prev) => Math.min(prev + 1, hints.length - 1));
    };

    const prevHint = () => {
        setCurrentHint((prev) => Math.max(prev - 1, 0));
    };

    return (
        <div className={`
            bg-gradient-to-br from-slate-800/80 to-purple-800/20 border border-purple-500/30 rounded-xl overflow-hidden my-6
            ${isFullscreen ? 'fixed inset-4 z-50' : ''}
        `}>
            {/* Header */}
            <div className="theme-surface/90 px-6 py-4 border-b border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-lg">
                        {getLanguageIcon(language)}
                    </div>
                    <div>
                        <h3 className="text-white font-bold">{title}</h3>
                        <p className="text-slate-400 text-sm capitalize">{language} Playground</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <label className="text-slate-400">Size:</label>
                        <select 
                            value={fontSize} 
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="theme-surface-elevated text-white px-2 py-1 rounded text-sm"
                        >
                            <option value={12}>12px</option>
                            <option value={14}>14px</option>
                            <option value={16}>16px</option>
                            <option value={18}>18px</option>
                        </select>
                    </div>
                    
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:theme-surface-elevated rounded-lg transition-colors text-slate-400 hover:text-white"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isFullscreen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5M9 15H4.5M9 15v4.5M9 15l-5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`grid ${isFullscreen ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} h-96`}>
                {/* Code Editor */}
                <div className="flex flex-col">
                    <div className="theme-surface-elevated/50 px-4 py-2 border-b border-slate-600/50 flex items-center justify-between">
                        <span className="text-slate-300 text-sm font-medium">Editor</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={copyCode}
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                title="Copy Code"
                            >
                                Copy
                            </button>
                            <button
                                onClick={downloadCode}
                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                title="Download Code"
                            >
                                Download
                            </button>
                            <button
                                onClick={resetCode}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                title="Reset Code"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full p-4 theme-bg text-white font-mono resize-none border-none outline-none"
                            style={{ fontSize: `${fontSize}px` }}
                            placeholder="Enter your code here..."
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Output Panel */}
                <div className={`flex flex-col border-l border-slate-600/50 ${!isFullscreen && 'hidden lg:flex'}`}>
                    <div className="theme-surface-elevated/50 px-4 py-2 border-b border-slate-600/50 flex items-center justify-between">
                        <span className="text-slate-300 text-sm font-medium">Output</span>
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-sm hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isRunning ? (
                                <>
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Run Code
                                </>
                            )}
                        </button>
                    </div>
                    
                    <div className="flex-1 p-4 theme-bg overflow-y-auto">
                        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                            {output || 'Click "Run Code" to see the output...'}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Mobile Run Button */}
            {!isFullscreen && (
                <div className="lg:hidden theme-surface/90 px-4 py-3 border-t border-purple-500/30">
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                        {isRunning ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Running Code...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Run Code
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Mobile Output Panel */}
            {!isFullscreen && output && (
                <div className="lg:hidden theme-bg border-t border-slate-600/50">
                    <div className="theme-surface-elevated/50 px-4 py-2 border-b border-slate-600/50">
                        <span className="text-slate-300 text-sm font-medium">Output</span>
                    </div>
                    <div className="p-4 max-h-32 overflow-y-auto">
                        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                            {output}
                        </pre>
                    </div>
                </div>
            )}

            {/* Hints Panel */}
            {hints.length > 0 && (
                <div className="theme-surface/90 border-t border-purple-500/30 px-6 py-4">
                    <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                    >
                        <svg className={`w-4 h-4 transition-transform ${showHints ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Need a hint? ({hints.length} available)
                    </button>
                    
                    {showHints && (
                        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-yellow-400 font-medium">
                                    Hint {currentHint + 1} of {hints.length}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={prevHint}
                                        disabled={currentHint === 0}
                                        className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={nextHint}
                                        disabled={currentHint === hints.length - 1}
                                        className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                            <p className="text-yellow-200 text-sm leading-relaxed">
                                {hints[currentHint]}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Expected Output */}
            {expectedOutput && (
                <div className="theme-surface/90 border-t border-purple-500/30 px-6 py-4">
                    <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Expected Output:
                    </h4>
                    <pre className="text-green-300 font-mono text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                        {expectedOutput}
                    </pre>
                </div>
            )}

            {/* Fullscreen overlay */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
            )}
        </div>
    );
};

export default CodePlayground;
