'use client'
import { useState, useEffect } from 'react'
import { 
  PlayIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  TagIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

export default function ProblemDescription({ problem }) {
  if (!problem) return null

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-900/30 border-green-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30'  
      case 'hard': return 'text-red-400 bg-red-900/30 border-red-500/30'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30'
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-900 text-white p-6">
      {/* Problem Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-white">
            {problem.title}
          </h1>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        
        {/* Problem Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            <span>{problem.acceptanceRate}% Acceptance</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <span>{problem.totalSubmissions || 0} Submissions</span>
          </div>
          {problem.companies && problem.companies.length > 0 && (
            <div className="flex items-center gap-2">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span>{problem.companies.slice(0, 2).join(', ')}</span>
              {problem.companies.length > 2 && <span>+{problem.companies.length - 2}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Problem Description */}
      <div className="mb-8">
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>
      </div>

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Examples</h3>
          <div className="space-y-6">
            {problem.examples.map((example, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="font-medium text-gray-300 mb-2">Example {index + 1}:</div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">Input:</div>
                    <div className="bg-gray-900 rounded p-3 font-mono text-sm text-gray-300">
                      {example.input}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">Output:</div>
                    <div className="bg-gray-900 rounded p-3 font-mono text-sm text-gray-300">
                      {example.output}
                    </div>
                  </div>
                  
                  {example.explanation && (
                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">Explanation:</div>
                      <div className="text-gray-300 text-sm">
                        {example.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Constraints</h3>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <ul className="space-y-2">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="text-gray-300 text-sm font-mono">
                  • {constraint}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* YouTube Video Solution */}
      {problem.videoSolution && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Video Solution</h3>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${problem.videoSolution}`}
                title="Problem Solution Video"
                className="w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {problem.tags && problem.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-500/30"
              >
                <TagIcon className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Companies */}
      {problem.companies && problem.companies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Companies</h3>
          <div className="flex flex-wrap gap-2">
            {problem.companies.map((company, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-600"
              >
                <BuildingOfficeIcon className="w-3 h-3" />
                {company}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
