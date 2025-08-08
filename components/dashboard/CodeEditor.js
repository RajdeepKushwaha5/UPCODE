'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, CodeBracketIcon, PlayIcon, CommandLineIcon } from '@heroicons/react/24/outline'

// Monaco Editor will be loaded dynamically
let monaco = null
let MonacoEditor = null

// Load Monaco Editor dynamically
const loadMonaco = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    const [monacoModule, reactMonaco] = await Promise.all([
      import('monaco-editor'),
      import('@monaco-editor/react')
    ])
    
    monaco = monacoModule.default || monacoModule
    MonacoEditor = reactMonaco.default
    
    return { monaco, MonacoEditor }
  } catch (error) {
    console.error('Failed to load Monaco Editor:', error)
    return null
  }
}

const LANGUAGE_OPTIONS = [
  { id: 'javascript', name: 'JavaScript', extension: 'js', judge0Id: 63 },
  { id: 'python', name: 'Python', extension: 'py', judge0Id: 71 },
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

export default function CodeEditor({ 
  code, 
  onCodeChange, 
  language, 
  onLanguageChange,
  customInput,
  onCustomInputChange,
  isMobile = false 
}) {
  const [monacoLoaded, setMonacoLoaded] = useState(false)
  const [editor, setEditor] = useState(null)
  const [theme, setTheme] = useState('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [showSettings, setShowSettings] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [wordWrap, setWordWrap] = useState(false)
  const [minimap, setMinimap] = useState(!isMobile)
  
  const editorRef = useRef(null)
  const settingsRef = useRef(null)

  // Load Monaco Editor on mount
  useEffect(() => {
    loadMonaco().then((result) => {
      if (result) {
        setMonacoLoaded(true)
      }
    })
  }, [])

  // Handle editor mount
  const handleEditorDidMount = (editorInstance, monacoInstance) => {
    setEditor(editorInstance)
    editorRef.current = editorInstance

    // Configure editor options
    editorInstance.updateOptions({
      fontSize: fontSize,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 16, bottom: 16 },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      formatOnPaste: true,
      formatOnType: true
    })

    // Add keyboard shortcuts
    editorInstance.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
      // Auto-save is already handled by parent component
    })

    editorInstance.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Slash, () => {
      editorInstance.trigger('keyboard', 'editor.action.commentLine', {})
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
        wordWrap: wordWrap ? 'on' : 'off',
        minimap: { enabled: minimap }
      })
    }
  }, [editor, fontSize, wordWrap, minimap])

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
    // Map our language IDs to Monaco Editor language IDs
    const languageMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'csharp': 'csharp',
      'go': 'go',
      'rust': 'rust',
      'kotlin': 'kotlin',
      'swift': 'swift',
      'typescript': 'typescript',
      'php': 'php',
      'ruby': 'ruby'
    }
    
    return languageMap[language] || 'javascript'
  }

  const handleFormatCode = () => {
    if (editor) {
      editor.trigger('keyboard', 'editor.action.formatDocument', {})
    }
  }

  const insertTemplate = (template) => {
    if (editor) {
      const position = editor.getPosition()
      const range = {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      }
      
      editor.executeEdits('insert-template', [{
        range: range,
        text: template
      }])
      
      editor.focus()
    }
  }

  const getLanguageTemplates = () => {
    const templates = {
      javascript: [
        { name: 'For Loop', code: 'for (let i = 0; i < n; i++) {\n    \n}' },
        { name: 'Array Map', code: 'arr.map((item, index) => {\n    return item\n})' },
        { name: 'Try Catch', code: 'try {\n    \n} catch (error) {\n    console.error(error)\n}' }
      ],
      python: [
        { name: 'For Loop', code: 'for i in range(n):\n    ' },
        { name: 'List Comprehension', code: '[item for item in iterable if condition]' },
        { name: 'Try Except', code: 'try:\n    \nexcept Exception as e:\n    print(e)' }
      ],
      java: [
        { name: 'For Loop', code: 'for (int i = 0; i < n; i++) {\n    \n}' },
        { name: 'Try Catch', code: 'try {\n    \n} catch (Exception e) {\n    e.printStackTrace();\n}' }
      ],
      cpp: [
        { name: 'For Loop', code: 'for (int i = 0; i < n; i++) {\n    \n}' },
        { name: 'Vector', code: 'vector<int> vec;' }
      ]
    }
    
    return templates[language] || []
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

  if (!monacoLoaded || !MonacoEditor) {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3">
            <CodeBracketIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Code Editor</span>
            {!monacoLoaded && (
              <span className="text-xs text-yellow-500">(Loading...)</span>
            )}
          </div>
        </div>
        
        <FallbackEditor />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500 min-w-[120px]"
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-px h-6 bg-gray-600"></div>

          {/* Format Code Button */}
          <button
            onClick={handleFormatCode}
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Format Code (Shift+Alt+F)"
          >
            Format
          </button>

          {/* Custom Input Toggle */}
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              showCustomInput 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            title="Toggle Custom Input"
          >
            <CommandLineIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Templates Dropdown */}
          {getLanguageTemplates().length > 0 && (
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    insertTemplate(e.target.value)
                    e.target.value = ''
                  }
                }}
                className="bg-gray-700 text-gray-300 text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none"
                defaultValue=""
              >
                <option value="">Templates</option>
                {getLanguageTemplates().map((template, index) => (
                  <option key={index} value={template.code}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Editor Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
                <div className="p-3 space-y-4">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                      {THEMES.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Font Size: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      step="1"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={wordWrap}
                        onChange={(e) => setWordWrap(e.target.checked)}
                        className="rounded"
                      />
                      Word Wrap
                    </label>
                    
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={minimap}
                        onChange={(e) => setMinimap(e.target.checked)}
                        className="rounded"
                      />
                      Show Minimap
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
        <div className="border-b border-gray-700 bg-gray-800 p-3">
          <div className="flex items-center gap-2 mb-2">
            <CommandLineIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Custom Input</span>
          </div>
          <textarea
            value={customInput}
            onChange={(e) => onCustomInputChange(e.target.value)}
            placeholder="Enter custom test case input here..."
            className="w-full h-20 bg-gray-900 text-gray-300 text-sm p-2 border border-gray-600 rounded resize-none focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={getEditorLanguage()}
          theme={theme}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize,
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true }
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-700 bg-gray-800 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Language: {getCurrentLanguage().name}</span>
          <span>•</span>
          <span>Encoding: UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ctrl+Enter: Run</span>
          <span>•</span>
          <span>Ctrl+Shift+Enter: Submit</span>
        </div>
      </div>
    </div>
  )
}
