'use client';
import { useState, useEffect } from 'react';

const InteractiveQuiz = ({ 
    questions = [], 
    title = "Quick Quiz", 
    onComplete = null,
    showProgress = true 
}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        return correctAnswers;
    };

    const handleSubmit = () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        setShowResults(true);
        
        if (onComplete) {
            onComplete({
                score: finalScore,
                total: questions.length,
                percentage: Math.round((finalScore / questions.length) * 100),
                timeSpent
            });
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);
        setScore(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'text-green-400';
        if (percentage >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreMessage = (percentage) => {
        if (percentage >= 90) return "Excellent! You've mastered this topic! 🎉";
        if (percentage >= 80) return "Great job! You have a solid understanding! 👏";
        if (percentage >= 60) return "Good work! Consider reviewing the material. 📚";
        return "Keep studying! You'll get there! 💪";
    };

    if (questions.length === 0) {
        return (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 my-6">
                <div className="text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <h3 className="text-white font-semibold mb-2">Interactive Quiz</h3>
                    <p className="text-slate-400">No questions available for this lesson.</p>
                </div>
            </div>
        );
    }

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        
        return (
            <div className="bg-gradient-to-br from-slate-800/80 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 my-6">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">
                        {percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '😅'}
                    </div>
                    <h3 className="text-white font-bold text-2xl mb-2">Quiz Complete!</h3>
                    <p className="text-slate-300">{getScoreMessage(percentage)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <div className={`text-2xl font-bold mb-1 ${getScoreColor(percentage)}`}>
                            {score}/{questions.length}
                        </div>
                        <div className="text-slate-400 text-sm">Correct Answers</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <div className={`text-2xl font-bold mb-1 ${getScoreColor(percentage)}`}>
                            {percentage}%
                        </div>
                        <div className="text-slate-400 text-sm">Score</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold mb-1 text-blue-400">
                            {formatTime(timeSpent)}
                        </div>
                        <div className="text-slate-400 text-sm">Time Taken</div>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {questions.map((question, index) => {
                        const userAnswer = selectedAnswers[index];
                        const isCorrect = userAnswer === question.correctAnswer;
                        
                        return (
                            <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`
                                        flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                                        ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                                    `}>
                                        {isCorrect ? '✓' : '✗'}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-white font-medium mb-2">
                                            {index + 1}. {question.question}
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="text-green-400">
                                                ✓ Correct: {question.options[question.correctAnswer]}
                                            </div>
                                            {!isCorrect && (
                                                <div className="text-red-400">
                                                    ✗ Your answer: {question.options[userAnswer] || 'Not answered'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={resetQuiz}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 my-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🧠</span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">{title}</h3>
                        <p className="text-slate-400 text-sm">
                            Question {currentQuestion + 1} of {questions.length}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-blue-400 font-mono text-sm">⏱️ {formatTime(timeSpent)}</div>
                </div>
            </div>

            {/* Progress bar */}
            {showProgress && (
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Question */}
            <div className="mb-6">
                <h4 className="text-white text-lg font-medium mb-4 leading-relaxed">
                    {currentQ.question}
                </h4>

                <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(currentQuestion, index)}
                            className={`
                                w-full p-4 rounded-lg text-left transition-all duration-200 border-2
                                ${selectedAnswers[currentQuestion] === index 
                                    ? 'border-purple-500 bg-purple-500/20 text-white' 
                                    : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-purple-400 hover:bg-slate-600/50'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold
                                    ${selectedAnswers[currentQuestion] === index 
                                        ? 'border-purple-500 bg-purple-500 text-white' 
                                        : 'border-slate-500'
                                    }
                                `}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className="flex-grow">{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                <div className="flex gap-2">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`
                                w-3 h-3 rounded-full transition-colors
                                ${index < currentQuestion ? 'bg-green-500' : 
                                  index === currentQuestion ? 'bg-purple-500' : 'bg-slate-600'}
                            `}
                        />
                    ))}
                </div>

                {currentQuestion === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(selectedAnswers).length !== questions.length}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default InteractiveQuiz;
