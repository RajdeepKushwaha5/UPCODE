'use client'
import { useState } from 'react'
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  LightBulbIcon, 
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const tabs = [
  { id: 'description', name: 'Description', icon: BookOpenIcon },
  { id: 'editorial', name: 'Editorial', icon: AcademicCapIcon },
  { id: 'solutions', name: 'Solutions', icon: LightBulbIcon },
  { id: 'submissions', name: 'Submissions', icon: DocumentTextIcon },
  { id: 'ai-assistant', name: 'AI Assistant', icon: SparklesIcon }
]

export default function ProblemTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-700 bg-gray-800">
      <nav className="flex space-x-8 px-6" aria-label="Problem sections">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
