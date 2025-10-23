'use client'
import React, { useState, useEffect, useRef } from 'react'
import { FaTimes, FaRobot, FaPaperPlane, FaCode,      if (percentage >= 90) {
  performanceEmoji = '🏆'
  performanceMessage = 'Outstanding! You are a natural!'
} else if (percentage >= 70) {
  performanceEmoji = '🎯'
  performanceMessage = 'Great job! You really understand this!'
} else if (percentage >= 50) {
  performanceEmoji = '👍'
  performanceMessage = 'Good effort! Keep practicing!'
} else {
  performanceEmoji = '💪'
  performanceMessage = 'Do not give up! Learning takes time!'
} rcle, FaCheckCircle, FaTimesCircle, FaTrophy, FaBookOpen } from 'react-icons/fa'
import { programmingCurriculum } from '../../data/programmingCurriculum'

const ProgrammingChatbot = ({ language, onClose, isOpen }) => {
  const [messages, setMessages] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [awaitingAnswer, setAwaitingAnswer] = useState(false)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [courseStarted, setCourseStarted] = useState(false)
  const messagesEndRef = useRef(null)

  const currentCurriculum = programmingCurriculum[language?.toLowerCase()]

  useEffect(() => {
    if (isOpen && currentCurriculum) {
      // Initialize with welcome message
      const welcomeMessage = `🎓 **Welcome to ${currentCurriculum.name} Programming!** ${currentCurriculum.icon}

I'm your personal AI tutor, and I'm excited to teach you ${currentCurriculum.name} from the ground up! 

**What you'll learn:**
${currentCurriculum.lessons.map((lesson, index) => `${index + 1}. ${lesson.title}`).join('\n')}

**How it works:**
📚 I'll teach you concepts step by step
❓ I'll ask questions to test your understanding  
🏆 You'll earn points for correct answers
🎯 We'll build your programming skills together!

**Ready to start your ${currentCurriculum.name} journey?**
Type **'yes'** to begin, or **'help'** for more options! 

Let's make you a ${currentCurriculum.name} programmer! 🚀`

      setMessages([
        {
          type: 'bot',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ])

      // Reset all state
      setCurrentLesson(0)
      setCurrentQuestionIndex(0)
      setScore(0)
      setTotalQuestions(0)
      setAwaitingAnswer(false)
      setLessonCompleted(false)
      setCourseStarted(false)
    }
  }, [isOpen, language])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (content, type = 'user') => {
    const newMessage = {
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const typeMessage = async (content, delay = 1000) => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, delay))
    addMessage(content, 'bot')
    setIsTyping(false)
  }

  const startLesson = async (lessonIndex) => {
    const lesson = currentCurriculum.lessons[lessonIndex]
    if (!lesson) return

    setCourseStarted(true)

    // Add lesson progress info
    const progressMessage = `📚 **Lesson ${lessonIndex + 1} of ${currentCurriculum.lessons.length}**
📖 **${lesson.title}**

${lesson.content}

${lesson.codeExample ? `💻 **Try this code:**\n\`\`\`${language}\n${lesson.codeExample}\n\`\`\`` : ''}

Ready to test your understanding? 🧠`

    await typeMessage(progressMessage)

    // Reset lesson stats
    setScore(0)
    setTotalQuestions(lesson.questions.length)

    setTimeout(() => {
      typeMessage("Let's see how well you understood this lesson! 💪")
      setTimeout(() => askQuestion(lessonIndex, 0), 1500)
    }, 2000)
  }

  const askQuestion = async (lessonIndex, questionIndex) => {
    const lesson = currentCurriculum.lessons[lessonIndex]
    const question = lesson.questions[questionIndex]

    if (!question) {
      // No more questions in this lesson
      const percentage = Math.round((score / totalQuestions) * 100)
      let performanceEmoji = '🎉'
      let performanceMessage = ''

      if (percentage >= 90) {
        performanceEmoji = '�'
        performanceMessage = 'Outstanding! You're a natural!'
      } else if (percentage >= 70) {
        performanceEmoji = '🎯'
        performanceMessage = 'Great job! You really understand this!'
      } else if (percentage >= 50) {
        performanceEmoji = '👍'
        performanceMessage = 'Good effort! Keep practicing!'
      } else {
        performanceEmoji = '💪'
        performanceMessage = 'Don\\'t give up! Learning takes time!'
      }

      await typeMessage(`${performanceEmoji} **Lesson Complete!**

**Your Score: ${score}/${totalQuestions} (${percentage}%)**
${performanceMessage}

**What's next?**
• Type **'next'** to continue to the next lesson
• Type **'review'** to go over this lesson again
• Type **'help'** for more options

Keep up the great work! 🚀`)

      setLessonCompleted(true)
      return
    }

    const optionsText = question.options.map((option, index) =>
      `**${String.fromCharCode(65 + index)}.** ${option}`
    ).join('\n')

    const questionMessage = `❓ **Question ${questionIndex + 1} of ${lesson.questions.length}**

${question.question}

${optionsText}

**Type the letter of your answer (A, B, C, or D):** 🤔`

    await typeMessage(questionMessage)
    setAwaitingAnswer(true)
  }

  const checkAnswer = async (userAnswer) => {
    const lesson = currentCurriculum.lessons[currentLesson]
    const question = lesson.questions[currentQuestionIndex]
    const correctIndex = question.correct
    const userIndex = userAnswer.toUpperCase().charCodeAt(0) - 65

    if (userIndex === correctIndex) {
      setScore(prev => prev + 1)
      await typeMessage(`✅ **Correct!** 🎉\n\n${question.explanation}\n\n**+1 point!** Keep it up! 💪`)
    } else {
      const correctLetter = String.fromCharCode(65 + correctIndex)
      await typeMessage(`❌ **Not quite right.** 😔\n\nThe correct answer is **${correctLetter}**. ${question.explanation}\n\nDon't worry, learning is a process! 🌱`)
    }

    setCurrentQuestionIndex(prev => prev + 1)
    setAwaitingAnswer(false)

    // Ask next question after delay
    setTimeout(() => {
      askQuestion(currentLesson, currentQuestionIndex + 1)
    }, 3000)
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    const userMessage = currentInput.trim()
    addMessage(userMessage)
    setCurrentInput('')

    // Handle different user inputs
    if (awaitingAnswer) {
      // User is answering a question
      if (['A', 'B', 'C', 'D'].includes(userMessage.toUpperCase())) {
        await checkAnswer(userMessage)
      } else {
        await typeMessage("Please answer with **A**, **B**, **C**, or **D** 😊\n\nTake your time and read the options carefully!")
      }
    } else if (lessonCompleted) {
      if (userMessage.toLowerCase().includes('next')) {
        if (currentLesson + 1 < currentCurriculum.lessons.length) {
          setCurrentLesson(prev => prev + 1)
          setCurrentQuestionIndex(0)
          setScore(0)
          setLessonCompleted(false)
          await typeMessage(`🎯 **Moving to Lesson ${currentLesson + 2}!**\n\nYou're making great progress! Let's continue building your ${currentCurriculum.name} skills! 🚀`)
          setTimeout(() => startLesson(currentLesson + 1), 1000)
        } else {
          await typeMessage(`🎓 **CONGRATULATIONS!** 🎉\n\nYou've completed the ${currentCurriculum.name} basics course!\n\n**What you've learned:**\n${currentCurriculum.lessons.map((lesson, index) => `✅ ${lesson.title}`).join('\n')}\n\n**Next Steps:**\n🔥 Practice coding on your own\n📚 Explore advanced ${currentCurriculum.name} topics\n💻 Build your own projects\n🌟 Keep learning and coding!\n\nYou're now ready to start your ${currentCurriculum.name} programming journey! 🚀`)
        }
      } else if (userMessage.toLowerCase().includes('review')) {
        setCurrentQuestionIndex(0)
        setScore(0)
        setLessonCompleted(false)
        await typeMessage(`📖 **Let's review this lesson!**\n\nRepetition is key to learning! Let's go through this again. �`)
        setTimeout(() => startLesson(currentLesson), 1000)
      } else {
        await typeMessage(`I understand you want to continue learning! 📚\n\nType **'next'** for the next lesson or **'review'** to practice this lesson again.\n\nWhat would you like to do? 🤔`)
      }
    } else if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('start') || userMessage.toLowerCase().includes('begin')) {
      if (!courseStarted) {
        await typeMessage(`🚀 **Excellent! Let's begin your ${currentCurriculum.name} journey!**\n\nI'll teach you step by step, and we'll have fun along the way! 😊`)
        setTimeout(() => startLesson(0), 1000)
      } else {
        await typeMessage("You're already in the course! Keep going with the current lesson! 💪")
      }
    } else if (userMessage.toLowerCase().includes('help')) {
      const helpMessage = `🆘 **Help Menu**

**During lessons:**
📖 Read carefully and take your time
🤔 Ask me questions if you need clarification

**During quizzes:**
🔤 Answer with A, B, C, or D
✅ Get instant feedback on your answers

**After completing a lesson:**
➡️ Type **'next'** for the next lesson
🔄 Type **'review'** to repeat the current lesson

**Anytime:**
🆘 Type **'help'** for this menu
🏁 Type **'start'** to begin the course

**Remember:** Learning programming takes practice! Don't worry if you don't get everything right away. I'm here to help you succeed! �🎯`

      await typeMessage(helpMessage)
    } else if (userMessage.toLowerCase().includes('explain') || userMessage.toLowerCase().includes('clarify')) {
      if (courseStarted) {
        await typeMessage(`🤔 **Need clarification?**\n\nI understand learning can be challenging! If you need me to explain a concept differently, let me know specifically what you'd like me to clarify.\n\nFor now, let's continue with the lesson. You're doing great! 💪`)
      } else {
        await typeMessage("I'd be happy to explain anything once we start the course! Type **'yes'** to begin learning! 📚")
      }
    } else {
      if (!courseStarted) {
        await typeMessage(`I'm excited to teach you ${currentCurriculum.name}! 🎓\n\nType **'yes'** to start the course, or **'help'** for more options.\n\nReady to become a programmer? 🚀`)
      } else {
        await typeMessage(`I understand you're engaged! 😊\n\nIf you need help, type **'help'**. Otherwise, let's focus on the current lesson.\n\nYou're doing great! Keep going! 💪`)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentCurriculum?.color || 'from-purple-600 to-blue-600'} p-6 rounded-t-3xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl animate-bounce">
                {currentCurriculum?.icon || '🤖'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {currentCurriculum?.name || 'Programming'} AI Tutor
                </h3>
                <p className="text-white/80 text-sm">Your Personal Programming Instructor</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Progress Indicator */}
              {courseStarted && (
                <div className="bg-white/20 rounded-lg px-3 py-2 text-white text-sm">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="text-sm" />
                    <span>Lesson {currentLesson + 1}/{currentCurriculum?.lessons?.length || 0}</span>
                  </div>
                  {totalQuestions > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <FaTrophy className="text-sm text-yellow-300" />
                      <span>{score}/{totalQuestions}</span>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {courseStarted && currentCurriculum?.lessons && (
            <div className="mt-4">
              <div className="flex justify-between text-white/80 text-xs mb-2">
                <span>Course Progress</span>
                <span>{Math.round(((currentLesson) / currentCurriculum.lessons.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${((currentLesson) / currentCurriculum.lessons.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${message.type === 'user'
                  ? 'bg-blue-600 text-white ml-4'
                  : 'bg-gray-800 text-gray-100 mr-4'
                  }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-100 p-4 rounded-2xl mr-4 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Tutor is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or answer..."
              className="flex-1 bg-gray-800 text-white p-4 rounded-2xl border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-4 rounded-2xl transition-colors flex items-center justify-center min-w-[60px]"
            >
              <FaPaperPlane />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {!courseStarted && (
              <button
                onClick={() => setCurrentInput('yes')}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                🚀 Start Course
              </button>
            )}

            <button
              onClick={() => setCurrentInput('help')}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
            >
              🆘 Help
            </button>

            {lessonCompleted && (
              <>
                {currentLesson + 1 < (currentCurriculum?.lessons?.length || 0) && (
                  <button
                    onClick={() => setCurrentInput('next')}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                  >
                    ➡️ Next Lesson
                  </button>
                )}
                <button
                  onClick={() => setCurrentInput('review')}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                >
                  🔄 Review
                </button>
              </>
            )}

            {awaitingAnswer && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                ⏰ Choose A, B, C, or D
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgrammingChatbot
