'use client'
import { useState } from 'react'
import { FaCode, FaChevronDown } from 'react-icons/fa'

const LANGUAGES = [
  { 
    value: 'javascript', 
    label: 'JavaScript', 
    icon: '🟨',
    popularity: 95 
  },
  { 
    value: 'python', 
    label: 'Python3', 
    icon: '🐍',
    popularity: 98 
  },
  { 
    value: 'java', 
    label: 'Java', 
    icon: '☕',
    popularity: 85 
  },
  { 
    value: 'cpp', 
    label: 'C++', 
    icon: '⚡',
    popularity: 75 
  },
  { 
    value: 'c', 
    label: 'C', 
    icon: '🔧',
    popularity: 65 
  },
  { 
    value: 'csharp', 
    label: 'C#', 
    icon: '💜',
    popularity: 70 
  },
  { 
    value: 'go', 
    label: 'Go', 
    icon: '🐹',
    popularity: 60 
  },
  { 
    value: 'rust', 
    label: 'Rust', 
    icon: '🦀',
    popularity: 45 
  },
  { 
    value: 'swift', 
    label: 'Swift', 
    icon: '🍎',
    popularity: 40 
  },
  { 
    value: 'kotlin', 
    label: 'Kotlin', 
    icon: '🎯',
    popularity: 50 
  }
]

export default function LanguageSelector({ 
  selected = 'javascript', 
  onChange,
  compact = false 
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedLang = LANGUAGES.find(lang => lang.value === selected) || LANGUAGES[0]
  
  const handleSelect = (language) => {
    onChange?.(language.value)
    setIsOpen(false)
  }

  if (compact) {
    return (
      <select
        value={selected}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px]"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-w-[140px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedLang.icon}</span>
          <span className="text-sm font-medium">{selectedLang.label}</span>
        </div>
        <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 w-64 max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-gray-400 px-3 py-2 font-medium uppercase tracking-wide">
                Select Language
              </div>
              
              {LANGUAGES
                .sort((a, b) => b.popularity - a.popularity)
                .map(lang => (
                <button
                  key={lang.value}
                  onClick={() => handleSelect(lang)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selected === lang.value
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.icon}</span>
                    <span className="text-sm font-medium">{lang.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all"
                        style={{ width: `${lang.popularity}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {lang.popularity}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-700 p-2">
              <div className="text-xs text-gray-500 px-3 py-1">
                Popularity based on LeetCode usage
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export { LANGUAGES }
