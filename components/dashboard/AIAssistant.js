'use client'
import { useState, useEffect } from 'react'
import { 
  SparklesIcon, 
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon,
  LightBulbIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'

export default function AIAssistant({ problem }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with welcome message
  useEffect(() => {
    if (problem) {
      setMessages([
        {
          id: 1,
          type: 'ai',
          content: `Hi! I'm your AI assistant for the "${problem.title}" problem. I can help you with:
          
• Understanding the problem requirements
• Explaining different approaches and algorithms
• Code optimization tips
• Time and space complexity analysis
• Common pitfalls and edge cases

What would you like to know about this ${problem.difficulty} level problem?`,
          timestamp: Date.now()
        }
      ])
    }
  }, [problem])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Create problem context for AI
      const problemContext = `
Problem: ${problem.title}
Difficulty: ${problem.difficulty}
Description: ${problem.description}
Examples: ${JSON.stringify(problem.examples)}
Constraints: ${problem.constraints?.join(', ')}
Tags: ${problem.tags?.join(', ')}
      `

      const response = await fetch('/api/ai/problem-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          problemContext,
          conversationHistory: messages.slice(-10) // Last 10 messages for context
        })
      })

      const data = await response.json()

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.response,
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(data.message || 'Failed to get AI response')
      }
    } catch (error) {
      console.error('AI Assistant error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    "What's the optimal approach for this problem?",
    "Can you explain the time complexity?",
    "What are common edge cases?",
    "Show me a step-by-step solution",
    "What data structures should I use?"
  ]

  const handleQuickQuestion = (question) => {
    setInput(question)
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-700 bg-gray-800">
        <SparklesIcon className="w-6 h-6 text-blue-400" />
        <div>
          <h3 className="font-semibold text-white">AI Problem Assistant</h3>
          <p className="text-sm text-gray-400">Get help with "{problem?.title}"</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-blue-500'
              }`}>
                {message.type === 'user' ? (
                  <UserIcon className="w-5 h-5 text-white" />
                ) : (
                  <CpuChipIcon className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 border border-gray-700'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="text-xs opacity-60 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <CpuChipIcon className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-400 text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-gray-700">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <LightBulbIcon className="w-4 h-4" />
              Quick Questions
            </h4>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full border border-gray-600 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this problem..."
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              rows="3"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            Send
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}
