"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from "@heroicons/react/24/outline";

// Simple curriculum data
const curriculum = {
  javascript: {
    name: "JavaScript",
    icon: "⚡",
    color: "from-yellow-400 to-orange-500",
    lessons: [
      {
        title: "Variables and Data Types",
        content: "JavaScript variables can be declared with var, let, or const. Learn about different data types.",
        code: "let name = 'Alice';\nconst age = 25;\nvar isStudent = true;",
        quiz: {
          question: "Which keyword creates a block-scoped variable?",
          options: ["var", "let", "const", "all of the above"],
          correct: 1
        }
      },
      {
        title: "Functions",
        content: "Functions are reusable blocks of code that perform specific tasks.",
        code: "function greet(name) {\n  return 'Hello, ' + name;\n}\n\nconst result = greet('World');",
        quiz: {
          question: "What does a function return by default?",
          options: ["null", "undefined", "0", "false"],
          correct: 1
        }
      }
    ]
  },
  java: {
    name: "Java",
    icon: "☕",
    color: "from-orange-500 to-red-500",
    lessons: [
      {
        title: "Hello World",
        content: "Java is a class-based, object-oriented programming language.",
        code: "public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println(\"Hello World\");\n  }\n}",
        quiz: {
          question: "What is the entry point of a Java application?",
          options: ["start() method", "begin() method", "main() method", "run() method"],
          correct: 2
        }
      }
    ]
  }
};

export default function AITutorBoat() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const currentCurriculum = curriculum[selectedLanguage];
  const lesson = currentCurriculum.lessons[currentLesson];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === lesson.quiz.correct;
    setQuizResult(isCorrect ? 'correct' : 'incorrect');
    
    setTimeout(() => {
      if (isCorrect) {
        nextLesson();
      }
      setQuizResult(null);
      setSelectedAnswer(null);
      setShowQuiz(false);
    }, 2000);
  };

  const nextLesson = () => {
    if (currentLesson < currentCurriculum.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">AI Programming Tutor</h2>
          
          {/* Language Selection */}
          <div className="flex gap-3">
            {Object.entries(curriculum).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLanguage(key);
                  setCurrentLesson(0);
                  setShowQuiz(false);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedLanguage === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span>{lang.icon}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!showQuiz ? (
              <motion.div
                key="lesson"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Lesson Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      Lesson {currentLesson + 1}: {lesson.title}
                    </h3>
                    <div className="text-sm text-slate-400">
                      {currentLesson + 1} of {currentCurriculum.lessons.length}
                    </div>
                  </div>
                  <p className="text-slate-300">{lesson.content}</p>
                </div>

                {/* Code Example */}
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">Code Example</span>
                    <button className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm">
                      <PlayIcon className="w-4 h-4" />
                      Run
                    </button>
                  </div>
                  <pre className="text-green-300 text-sm overflow-x-auto">
                    <code>{lesson.code}</code>
                  </pre>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={prevLesson}
                    disabled={currentLesson === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Take Quiz
                  </button>
                  
                  <button
                    onClick={nextLesson}
                    disabled={currentLesson === currentCurriculum.lessons.length - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors"
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Quiz Time!</h3>
                  <p className="text-lg text-slate-300 mb-6">{lesson.quiz.question}</p>
                  
                  <div className="space-y-3">
                    {lesson.quiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedAnswer === index
                            ? quizResult === 'correct'
                              ? 'border-green-500 bg-green-500/20 text-green-300'
                              : 'border-red-500 bg-red-500/20 text-red-300'
                            : selectedAnswer === null
                            ? 'border-slate-600 bg-slate-700 hover:border-slate-500 text-white'
                            : 'border-slate-600 bg-slate-800 text-slate-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {quizResult && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${
                      quizResult === 'correct'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {quizResult === 'correct' ? '🎉 Correct! Moving to next lesson...' : '❌ Incorrect. Try again!'}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
