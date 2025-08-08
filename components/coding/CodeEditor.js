'use client'
import { useEffect, useRef, useState } from 'react'
import { FaExpand, FaCompress, FaCog, FaCode } from 'react-icons/fa'

// Language configurations
const LANGUAGE_CONFIG = {
  javascript: {
    label: 'JavaScript',
    value: 'javascript',
    monacoLang: 'javascript',
    template: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
    
};`,
    judge0Id: 63
  },
  python: {
    label: 'Python3',
    value: 'python',
    monacoLang: 'python',
    template: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass`,
    judge0Id: 71
  },
  java: {
    label: 'Java',
    value: 'java',
    monacoLang: 'java',
    template: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
    judge0Id: 62
  },
  cpp: {
    label: 'C++',
    value: 'cpp',
    monacoLang: 'cpp',
    template: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`,
    judge0Id: 54
  },
  c: {
    label: 'C',
    value: 'c',
    monacoLang: 'c',
    template: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize){
    // Write your solution here
    
}`,
    judge0Id: 50
  }
}

export default function CodeEditor({ 
  problem,
  language = 'javascript',
  onLanguageChange,
  onCodeChange,
  initialCode,
  isFullscreen = false,
  onToggleFullscreen,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false
}) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('vs-dark')
  const [wordWrap, setWordWrap] = useState(false)
  const [minimap, setMinimap] = useState(true)

  // Get current language config
  const currentLang = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript

  // Initialize Monaco Editor
  useEffect(() => {
    let cleanup = null

    const initMonaco = async () => {
      if (typeof window === 'undefined') return

      try {
        // Import Monaco Editor
        const monaco = await import('monaco-editor')
        monacoRef.current = monaco

        // Configure Monaco for better performance
        monaco.editor.defineTheme('leetcode-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'comment', foreground: '6A9955' },
            { token: 'keyword', foreground: '569CD6' },
            { token: 'string', foreground: 'CE9178' },
            { token: 'number', foreground: 'B5CEA8' },
            { token: 'type', foreground: '4EC9B0' },
            { token: 'function', foreground: 'DCDCAA' }
          ],
          colors: {
            'editor.background': '#1E1E1E',
            'editor.foreground': '#D4D4D4',
            'editor.lineHighlightBackground': '#2D2D30',
            'editor.selectionBackground': '#264F78',
            'editor.inactiveSelectionBackground': '#3A3D41'
          }
        })

        if (editorRef.current) {
          const editor = monaco.editor.create(editorRef.current, {
            value: initialCode || currentLang.template,
            language: currentLang.monacoLang,
            theme: 'leetcode-dark',
            fontSize: fontSize,
            fontFamily: 'Consolas, "Courier New", monospace',
            lineNumbers: 'on',
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            contextmenu: true,
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            mouseWheelZoom: true,
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'mouseover',
            matchBrackets: 'always',
            autoIndent: 'advanced',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on'
          })

          // Add keyboard shortcuts
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            onRun?.()
          })

          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
            onSubmit?.()
          })

          // Listen for code changes
          editor.onDidChangeModelContent(() => {
            const value = editor.getValue()
            onCodeChange?.(value)
          })

          cleanup = () => {
            editor.dispose()
          }
        }

        setMounted(true)
      } catch (error) {
        console.error('Failed to load Monaco Editor:', error)
      }
    }

    initMonaco()

    return () => {
      cleanup?.()
    }
  }, [currentLang.monacoLang, fontSize, wordWrap, minimap])

  // Update editor language when changed
  useEffect(() => {
    if (monacoRef.current && editorRef.current && mounted) {
      const editor = monacoRef.current.editor.getModels()[0]
      if (editor) {
        monacoRef.current.editor.setModelLanguage(editor, currentLang.monacoLang)
      }
    }
  }, [language, mounted])

  const handleLanguageChange = (newLang) => {
    onLanguageChange?.(newLang)
    
    // Update editor with new template if no custom code
    if (monacoRef.current && editorRef.current) {
      const editor = monacoRef.current.editor.getModels()[0]
      if (editor) {
        const currentCode = editor.getValue().trim()
        const currentTemplate = LANGUAGE_CONFIG[language]?.template?.trim()
        
        // If current code is just the template, switch to new template
        if (currentCode === currentTemplate || !currentCode) {
          editor.setValue(LANGUAGE_CONFIG[newLang]?.template || '')
        }
      }
    }
  }

  const updateEditorSettings = () => {
    if (monacoRef.current && editorRef.current) {
      const editor = monacoRef.current.editor.getModels()[0]
      if (editor) {
        const editorInstance = monacoRef.current.editor.getEditors()[0]
        editorInstance.updateOptions({
          fontSize: fontSize,
          wordWrap: wordWrap ? 'on' : 'off',
          minimap: { enabled: minimap }
        })
      }
    }
  }

  useEffect(() => {
    updateEditorSettings()
  }, [fontSize, wordWrap, minimap])

  return (
    <div className={`flex flex-col h-full bg-gray-900 ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-400 flex items-center gap-2">
            <FaCode className="w-3 h-3" />
            {problem?.title || 'Problem'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Editor Settings"
            >
              <FaCog className="w-4 h-4" />
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-4 w-64 z-10">
                <h3 className="text-sm font-medium text-white mb-3">Editor Settings</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{fontSize}px</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">Word Wrap</label>
                    <input
                      type="checkbox"
                      checked={wordWrap}
                      onChange={(e) => setWordWrap(e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">Minimap</label>
                    <input
                      type="checkbox"
                      checked={minimap}
                      onChange={(e) => setMinimap(e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <div 
          ref={editorRef} 
          className="absolute inset-0"
          style={{ height: '100%', width: '100%' }}
        />
        
        {!mounted && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-gray-400 text-sm">Loading Editor...</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+Enter</kbd>
          <span>Run</span>
          <kbd className="px-2 py-1 bg-gray-700 rounded ml-3">Ctrl+Shift+Enter</kbd>
          <span>Submit</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Running...
              </>
            ) : (
              <>
                <FaCode className="w-3 h-3" />
                Run
              </>
            )}
          </button>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>

      {/* Click outside to close settings */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export { LANGUAGE_CONFIG }
