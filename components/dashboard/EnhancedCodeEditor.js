'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { 
  ChevronDownIcon, 
  CodeBracketIcon, 
  PlayIcon, 
  CommandLineIcon,
  CogIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { getLanguageTemplate, getSupportedLanguages } from '../../utils/languageTemplates'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <div>Loading Editor...</div>
      </div>
    </div>
  )
})

const LANGUAGE_OPTIONS = [
  { id: 'javascript', name: 'JavaScript', extension: 'js', judge0Id: 63 },
  { id: 'python', name: 'Python 3', extension: 'py', judge0Id: 71 },
  { id: 'java', name: 'Java', extension: 'java', judge0Id: 62 },
  { id: 'cpp', name: 'C++', extension: 'cpp', judge0Id: 54 },
  { id: 'c', name: 'C', extension: 'c', judge0Id: 50 },
  { id: 'csharp', name: 'C#', extension: 'cs', judge0Id: 51 },
  { id: 'go', name: 'Go', extension: 'go', judge0Id: 60 },
  { id: 'rust', name: 'Rust', extension: 'rs', judge0Id: 73 },
  { id: 'kotlin', name: 'Kotlin', extension: 'kt', judge0Id: 78 },
  { id: 'swift', name: 'Swift', extension: 'swift', judge0Id: 83 },
  { id: 'typescript', name: 'TypeScript', extension: 'ts', judge0Id: 74 },
  { id: 'php', name: 'PHP', extension: 'php', judge0Id: 68 },
  { id: 'ruby', name: 'Ruby', extension: 'rb', judge0Id: 72 }
]

const THEMES = [
  { id: 'vs-dark', name: 'Dark (Default)' },
  { id: 'light', name: 'Light' },
  { id: 'hc-black', name: 'High Contrast Dark' },
  { id: 'hc-light', name: 'High Contrast Light' }
]

export default function EnhancedCodeEditor({ 
  language, 
  onLanguageChange, 
  code, 
  onCodeChange, 
  customInput, 
  onCustomInputChange,
  problem,
  isRunning = false,
  isSubmitting = false,
  onRun,
  onSubmit,
  onReset,
  isMobile = false
}) {
  const [editor, setEditor] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  
  // Editor settings
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('vs-dark')
  const [wordWrap, setWordWrap] = useState(false)
  const [minimap, setMinimap] = useState(true)
  const [autoComplete, setAutoComplete] = useState(true)
  
  const settingsRef = useRef(null)
  const customInputRef = useRef(null)

  // Load default template when language changes
  useEffect(() => {
    if (problem && language) {
      // Check if user has saved code for this problem-language combination
      const savedCode = localStorage.getItem(`problem-${problem.slug}-${language}`)
      
      if (!savedCode && !code.trim()) {
        // Load from problem's code templates first
        const templateFromProblem = problem.codeTemplates?.find(t => t.language === language)
        if (templateFromProblem) {
          onCodeChange(templateFromProblem.code)
        } else {
          // Fall back to default language template
          const defaultTemplate = getLanguageTemplate(language)
          if (defaultTemplate && defaultTemplate.template) {
            // Customize template based on problem if possible
            const customizedTemplate = customizeTemplateForProblem(defaultTemplate.template, problem)
            onCodeChange(customizedTemplate)
          }
        }
      }
    }
  }, [language, problem])

  // Customize template based on problem
  const customizeTemplateForProblem = (template, problem) => {
    if (!problem || !template) return template
    
    // This is a simplified version - you can make this more sophisticated
    // based on the problem's function signature, parameters, etc.
    return template
      .replace(/twoSum/g, problem.title.toLowerCase().replace(/\s+/g, ''))
      .replace(/Two Sum/g, problem.title)
  }

  // Auto-save code changes
  useEffect(() => {
    if (code && problem) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`problem-${problem.slug}-${language}`, code)
      }, 3000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [code, problem, language])

  const handleEditorDidMount = (editorInstance, monacoInstance) => {
    setEditor(editorInstance)

    // Configure editor
    editorInstance.updateOptions({
      fontSize: fontSize,
      theme: theme,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: minimap },
      suggestOnTriggerCharacters: autoComplete,
      quickSuggestions: autoComplete,
      parameterHints: { enabled: autoComplete },
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true
    })

    // Add keyboard shortcuts
    editorInstance.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
      // Auto-save is already handled
      return null
    })

    editorInstance.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Slash, () => {
      editorInstance.trigger('keyboard', 'editor.action.commentLine', {})
    })

    editorInstance.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyK, () => {
      editorInstance.trigger('keyboard', 'editor.action.formatDocument', {})
    })

    // Focus editor
    setTimeout(() => {
      editorInstance.focus()
    }, 100)
  }

  // Update editor options when settings change
  useEffect(() => {
    if (editor) {
      editor.updateOptions({
        fontSize: fontSize,
        theme: theme,
        wordWrap: wordWrap ? 'on' : 'off',
        minimap: { enabled: minimap },
        suggestOnTriggerCharacters: autoComplete,
        quickSuggestions: autoComplete,
        parameterHints: { enabled: autoComplete }
      })
    }
  }, [editor, fontSize, theme, wordWrap, minimap, autoComplete])

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getCurrentLanguage = () => {
    return LANGUAGE_OPTIONS.find(lang => lang.id === language) || LANGUAGE_OPTIONS[0]
  }

  const getEditorLanguage = () => {
    const languageMap = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'csharp': 'csharp',
      'go': 'go',
      'rust': 'rust',
      'kotlin': 'kotlin',
      'swift': 'swift',
      'php': 'php',
      'ruby': 'ruby'
    }
    return languageMap[language] || 'javascript'
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your code? This will restore the default template.')) {
      localStorage.removeItem(`problem-${problem.slug}-${language}`)
      
      // Load template
      const templateFromProblem = problem.codeTemplates?.find(t => t.language === language)
      if (templateFromProblem) {
        onCodeChange(templateFromProblem.code)
      } else {
        const defaultTemplate = getLanguageTemplate(language)
        if (defaultTemplate && defaultTemplate.template) {
          const customizedTemplate = customizeTemplateForProblem(defaultTemplate.template, problem)
          onCodeChange(customizedTemplate)
        }
      }
      
      onReset?.()
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      // You might want to show a toast here
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Fallback editor for when Monaco fails to load
  const FallbackEditor = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full bg-gray-900 text-gray-300 font-mono text-sm p-4 border border-gray-600 rounded resize-none focus:outline-none focus:border-blue-500"
          placeholder="// Write your code here..."
          spellCheck={false}
        />
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          <CodeBracketIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Code Editor</span>
          
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-700 text-gray-300 text-sm rounded px-3 py-1 border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none pr-8"
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Code */}
          <button
            onClick={copyCode}
            className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors"
            title="Copy code"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>

          {/* Custom Input Toggle */}
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={`p-1.5 rounded transition-colors ${
              showCustomInput 
                ? 'text-blue-400 bg-blue-900/30' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
            }`}
            title="Toggle custom input"
          >
            <CommandLineIcon className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors"
            title="Reset to default template"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded transition-colors ${
                showSettings 
                  ? 'text-blue-400 bg-blue-900/30' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              }`}
              title="Editor settings"
            >
              <CogIcon className="w-4 h-4" />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
                <div className="p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-white">Editor Settings</h3>
                  
                  {/* Theme */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full bg-gray-700 text-gray-300 text-xs rounded px-2 py-1 border border-gray-600"
                    >
                      {THEMES.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Word Wrap</span>
                      <input
                        type="checkbox"
                        checked={wordWrap}
                        onChange={(e) => setWordWrap(e.target.checked)}
                        className="rounded"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Minimap</span>
                      <input
                        type="checkbox"
                        checked={minimap}
                        onChange={(e) => setMinimap(e.target.checked)}
                        className="rounded"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Auto Complete</span>
                      <input
                        type="checkbox"
                        checked={autoComplete}
                        onChange={(e) => setAutoComplete(e.target.checked)}
                        className="rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Input Panel */}
      {showCustomInput && (
        <div className="border-b border-gray-700 bg-gray-800">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-400">Custom Input</label>
              <button
                onClick={() => setShowCustomInput(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <EyeSlashIcon className="w-4 h-4" />
              </button>
            </div>
            <textarea
              ref={customInputRef}
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder="Enter custom input for testing..."
              className="w-full h-20 bg-gray-900 text-gray-300 text-sm p-2 border border-gray-600 rounded resize-none focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 relative">
        <MonacoEditor
          height="100%"
          language={getEditorLanguage()}
          theme={theme}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize,
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            contextmenu: true,
            quickSuggestions: autoComplete,
            suggestOnTriggerCharacters: autoComplete,
            parameterHints: { enabled: autoComplete },
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            renderWhitespace: 'selection',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: 'active',
              highlightActiveIndentation: true
            }
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-700 bg-gray-800 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {getCurrentLanguage().name} • Auto-saved
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onRun}
              disabled={isRunning || !code.trim()}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  Run Code
                </>
              )}
            </button>
            
            <button
              onClick={onSubmit}
              disabled={isSubmitting || !code.trim()}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CodeBracketIcon className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
