'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { 
  ChevronDownIcon, 
  PlayIcon, 
  PaperAirplaneIcon,
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { getProblemSpecificTemplate } from '../../utils/problemTemplates'

// Dynamically import Monaco Editor
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
  { id: 'javascript', name: 'JavaScript', judge0Id: 63 },
  { id: 'python', name: 'Python 3', judge0Id: 71 },
  { id: 'java', name: 'Java', judge0Id: 62 },
  { id: 'cpp', name: 'C++', judge0Id: 54 },
  { id: 'c', name: 'C', judge0Id: 50 },
  { id: 'csharp', name: 'C#', judge0Id: 51 },
  { id: 'go', name: 'Go', judge0Id: 60 },
  { id: 'rust', name: 'Rust', judge0Id: 73 }
]

export default function ProblemCodeEditor({ 
  problem,
  code, 
  onCodeChange, 
  language, 
  onLanguageChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting
}) {
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('vs-dark')
  const editorRef = useRef(null)

  // Load problem-specific template when language changes
  useEffect(() => {
    if (problem && language && !code.trim()) {
      const template = getProblemSpecificTemplate(problem.slug, language)
      if (template) {
        onCodeChange(template)
      }
    }
  }, [problem, language, code, onCodeChange])

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure editor
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun()
    })
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmit()
    })
  }

  const resetCode = () => {
    if (problem) {
      const template = getProblemSpecificTemplate(problem.slug, language)
      onCodeChange(template || '')
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 text-white px-3 py-1.5 pr-8 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Auto Status */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Auto</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
            title="Editor Settings"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={resetCode}
            className="p-1.5 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
            title="Reset to template"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-3 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Font Size:</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded text-sm"
              >
                <option value={12}>12</option>
                <option value={14}>14</option>
                <option value={16}>16</option>
                <option value={18}>18</option>
                <option value={20}>20</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded text-sm"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme={theme}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-3 border-t border-gray-700 bg-gray-800">
        <div className="text-xs text-gray-400">
          <span>Ln 1, Col 1</span>
          <span className="ml-4">Saved</span>
        </div>

        <div className="flex gap-3">
          {/* Run Button */}
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
            {isRunning ? 'Running...' : 'Run'}
          </button>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-4 h-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-700 bg-gray-800">
        <span className="mr-4">Ctrl+Enter: Run</span>
        <span>Ctrl+Shift+Enter: Submit</span>
      </div>
    </div>
  )
}
