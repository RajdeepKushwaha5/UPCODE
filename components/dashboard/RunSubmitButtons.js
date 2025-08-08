'use client'
import { useState } from 'react'
import { 
  PlayIcon, 
  PaperAirplaneIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

export default function RunSubmitButtons({ 
  onRun, 
  onSubmit, 
  onReset,
  isRunning = false,
  isSubmitting = false,
  hasCode = false,
  lastRunStatus = null,
  isMobile = false 
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleReset = () => {
    if (showResetConfirm) {
      onReset()
      setShowResetConfirm(false)
    } else {
      setShowResetConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowResetConfirm(false), 3000)
    }
  }

  const getRunButtonColor = () => {
    if (lastRunStatus === 'success') {
      return 'bg-green-600 hover:bg-green-700 border-green-500'
    } else if (lastRunStatus === 'error') {
      return 'bg-red-600 hover:bg-red-700 border-red-500'
    }
    return 'bg-blue-600 hover:bg-blue-700 border-blue-500'
  }

  const getRunButtonIcon = () => {
    if (isRunning) {
      return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    } else if (lastRunStatus === 'success') {
      return <CheckCircleIcon className="w-4 h-4" />
    } else if (lastRunStatus === 'error') {
      return <XCircleIcon className="w-4 h-4" />
    }
    return <PlayIcon className="w-4 h-4" />
  }

  const getSubmitButtonIcon = () => {
    if (isSubmitting) {
      return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    }
    return <PaperAirplaneIcon className="w-4 h-4" />
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={!hasCode || isRunning || isSubmitting}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-white transition-all duration-200 shadow-lg ${
            !hasCode || isRunning || isSubmitting
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : getRunButtonColor()
          }`}
          title="Run Code (Ctrl+Enter)"
        >
          {getRunButtonIcon()}
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!hasCode || isRunning || isSubmitting}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-white transition-all duration-200 shadow-lg ${
            !hasCode || isRunning || isSubmitting
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-green-600 hover:bg-green-700 border-green-500'
          }`}
          title="Submit Solution (Ctrl+Shift+Enter)"
        >
          {getSubmitButtonIcon()}
          <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={isRunning || isSubmitting}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            showResetConfirm
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          } ${
            isRunning || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Reset to starter code"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>{showResetConfirm ? 'Confirm Reset' : 'Reset'}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {/* Run Code Button */}
      <button
        onClick={onRun}
        disabled={!hasCode || isRunning || isSubmitting}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 border ${
          !hasCode || isRunning || isSubmitting
            ? 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
            : getRunButtonColor()
        }`}
        title="Run Code (Ctrl+Enter)"
      >
        {getRunButtonIcon()}
        <span className="hidden sm:inline">
          {isRunning ? 'Running...' : 'Run Code'}
        </span>
        <span className="sm:hidden">Run</span>
      </button>

      {/* Submit Solution Button */}
      <button
        onClick={onSubmit}
        disabled={!hasCode || isRunning || isSubmitting}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 border ${
          !hasCode || isRunning || isSubmitting
            ? 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
            : 'bg-green-600 hover:bg-green-700 border-green-500 shadow-md hover:shadow-lg'
        }`}
        title="Submit Solution (Ctrl+Shift+Enter)"
      >
        {getSubmitButtonIcon()}
        <span className="hidden sm:inline">
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </span>
        <span className="sm:hidden">Submit</span>
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        disabled={isRunning || isSubmitting}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          showResetConfirm
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
        } ${
          isRunning || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title="Reset to starter code"
      >
        <ArrowPathIcon className="w-4 h-4" />
        <span className="hidden md:inline">
          {showResetConfirm ? 'Confirm Reset' : 'Reset'}
        </span>
      </button>

      {/* Keyboard Shortcuts Hint */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 ml-2">
        <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs">
          Ctrl+Enter
        </kbd>
        <span>Run</span>
        <span className="text-gray-600">•</span>
        <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs">
          Ctrl+⇧+Enter
        </kbd>
        <span>Submit</span>
      </div>
    </div>
  )
}
