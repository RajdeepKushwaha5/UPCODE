'use client'
import { useState } from 'react'
import { 
  FaPlay, FaPaperPlane, FaSpinner, FaCheckCircle, 
  FaExclamationTriangle, FaClock, FaCode
} from 'react-icons/fa'

export default function RunSubmitButtons({ 
  onRun, 
  onSubmit, 
  isRunning = false, 
  isSubmitting = false,
  hasCode = true,
  lastRunStatus = null,
  disabled = false
}) {
  const [showRunTooltip, setShowRunTooltip] = useState(false)
  const [showSubmitTooltip, setShowSubmitTooltip] = useState(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="w-3 h-3 text-green-500" />
      case 'error':
        return <FaExclamationTriangle className="w-3 h-3 text-red-500" />
      case 'timeout':
        return <FaClock className="w-3 h-3 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Run Button */}
      <div className="relative">
        <button
          onClick={onRun}
          disabled={disabled || isRunning || isSubmitting || !hasCode}
          onMouseEnter={() => setShowRunTooltip(true)}
          onMouseLeave={() => setShowRunTooltip(false)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${isRunning 
              ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed' 
              : disabled || !hasCode
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-white hover:text-blue-400'
            }
            ${lastRunStatus === 'success' ? 'ring-1 ring-green-500/30' : ''}
            ${lastRunStatus === 'error' ? 'ring-1 ring-red-500/30' : ''}
          `}
        >
          {isRunning ? (
            <>
              <FaSpinner className="w-4 h-4 animate-spin" />
              Running
            </>
          ) : (
            <>
              <FaPlay className="w-4 h-4" />
              Run
              {lastRunStatus && getStatusIcon(lastRunStatus)}
            </>
          )}
        </button>

        {/* Run Tooltip */}
        {showRunTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg border border-gray-600 whitespace-nowrap z-10">
            <div className="text-center">
              <div className="font-medium">Run Code</div>
              <div className="text-gray-400 mt-1">
                Test with sample inputs
              </div>
              <div className="flex items-center justify-center gap-2 mt-1 text-gray-500">
                <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="relative">
        <button
          onClick={onSubmit}
          disabled={disabled || isRunning || isSubmitting || !hasCode}
          onMouseEnter={() => setShowSubmitTooltip(true)}
          onMouseLeave={() => setShowSubmitTooltip(false)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${isSubmitting 
              ? 'bg-green-500/20 text-green-400 cursor-not-allowed' 
              : disabled || !hasCode
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="w-4 h-4 animate-spin" />
              Submitting
            </>
          ) : (
            <>
              <FaPaperPlane className="w-4 h-4" />
              Submit
            </>
          )}
        </button>

        {/* Submit Tooltip */}
        {showSubmitTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg border border-gray-600 whitespace-nowrap z-10">
            <div className="text-center">
              <div className="font-medium">Submit Solution</div>
              <div className="text-gray-400 mt-1">
                Run against all test cases
              </div>
              <div className="flex items-center justify-center gap-2 mt-1 text-gray-500">
                <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Shift</kbd>
                <span>+</span>
                <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {(isRunning || isSubmitting) && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span>{isRunning ? 'Testing...' : 'Evaluating...'}</span>
        </div>
      )}

      {/* Code Status Indicator */}
      {!hasCode && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaCode className="w-3 h-3" />
          <span>Write code to continue</span>
        </div>
      )}
    </div>
  )
}

// Additional utility component for floating action buttons (mobile)
export function FloatingActionButtons({ 
  onRun, 
  onSubmit, 
  isRunning, 
  isSubmitting,
  hasCode,
  disabled 
}) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 md:hidden">
      <button
        onClick={onRun}
        disabled={disabled || isRunning || isSubmitting || !hasCode}
        className={`
          w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all
          ${isRunning 
            ? 'bg-blue-500/20 text-blue-400' 
            : disabled || !hasCode
            ? 'bg-gray-700 text-gray-500'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
          }
        `}
      >
        {isRunning ? (
          <FaSpinner className="w-5 h-5 animate-spin" />
        ) : (
          <FaPlay className="w-5 h-5" />
        )}
      </button>

      <button
        onClick={onSubmit}
        disabled={disabled || isRunning || isSubmitting || !hasCode}
        className={`
          w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all
          ${isSubmitting 
            ? 'bg-green-500/20 text-green-400' 
            : disabled || !hasCode
            ? 'bg-gray-700 text-gray-500'
            : 'bg-green-600 hover:bg-green-700 text-white'
          }
        `}
      >
        {isSubmitting ? (
          <FaSpinner className="w-5 h-5 animate-spin" />
        ) : (
          <FaPaperPlane className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
