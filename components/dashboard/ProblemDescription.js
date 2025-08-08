'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, ChevronUpIcon, PlayIcon, BookOpenIcon, LightBulbIcon, TagIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default function ProblemDescription({ problem, notes, onNotesChange, isMobile = false }) {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    examples: true,
    constraints: true,
    hints: false,
    notes: false,
    related: false,
    companies: false
  })
  
  const [stickyHeader, setStickyHeader] = useState(false)
  const scrollContainerRef = useRef(null)
  const headerRef = useRef(null)

  // Handle scroll for sticky header
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop
      setStickyHeader(scrollTop > 20)
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const formatExampleText = (text) => {
    if (!text) return ''
    return text.replace(/\n/g, '<br />').replace(/  /g, '&nbsp;&nbsp;')
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      case 'Hard': return 'text-red-400 bg-red-900/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  const renderCompanyTags = () => {
    if (!problem.companies || problem.companies.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {problem.companies.slice(0, isMobile ? 4 : 8).map((company, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600"
          >
            {company}
          </span>
        ))}
        {problem.companies.length > 8 && (
          <span className="px-2 py-1 text-gray-400 text-xs">
            +{problem.companies.length - 8} more
          </span>
        )}
      </div>
    )
  }

  const renderRelatedProblems = () => {
    if (!problem.relatedProblems || problem.relatedProblems.length === 0) {
      return (
        <div className="text-gray-400 text-sm italic">
          No related problems available
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {problem.relatedProblems.map((relatedProblem, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${
                relatedProblem.difficulty === 'Easy' 
                  ? 'bg-green-500'
                  : relatedProblem.difficulty === 'Medium'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}></span>
              <span className="text-white text-sm font-medium">
                {relatedProblem.title}
              </span>
            </div>
            <span className="text-gray-400 text-xs">
              {relatedProblem.difficulty}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Sticky Header */}
      <div
        ref={headerRef}
        className={`${
          stickyHeader ? 'sticky top-0 z-10 shadow-lg' : ''
        } bg-gray-900 border-b border-gray-700 px-4 py-4 transition-all duration-200`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-2 leading-tight">
              {problem.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                problem.difficulty === 'Easy' 
                  ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                  : problem.difficulty === 'Medium'
                  ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
                  : 'bg-red-900/50 text-red-300 border border-red-500/30'
              }`}>
                {problem.difficulty}
              </span>
              
              <div className="text-sm text-gray-400">
                Acceptance: <span className="text-white font-medium">{problem.acceptanceRate}%</span>
              </div>
              
              {problem.totalSubmissions && (
                <div className="text-sm text-gray-400">
                  Submissions: <span className="text-white font-medium">{problem.totalSubmissions.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {renderCompanyTags()}
          </div>
          
          {problem.videoSolution && (
            <button
              onClick={() => window.open(problem.videoSolution, '_blank')}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors ml-4"
            >
              <PlayIcon className="w-4 h-4" />
              Video Solution
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-6"
      >
        {/* Problem Description */}
        <section>
          <button
            onClick={() => toggleSection('description')}
            className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5" />
              Problem Description
            </h2>
            {expandedSections.description ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          
          {expandedSections.description && (
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: problem.description }}
              />
            </div>
          )}
        </section>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('examples')}
              className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
            >
              <h2 className="text-lg font-semibold">Examples</h2>
              {expandedSections.examples ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
            
            {expandedSections.examples && (
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-400 mb-2">
                      Example {index + 1}:
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Input:</div>
                        <div className="bg-gray-900 p-3 rounded border text-sm font-mono text-green-400">
                          {example.input}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Output:</div>
                        <div className="bg-gray-900 p-3 rounded border text-sm font-mono text-blue-400">
                          {example.output}
                        </div>
                      </div>
                      
                      {example.explanation && (
                        <div>
                          <div className="text-sm font-medium text-gray-400 mb-1">Explanation:</div>
                          <div 
                            className="text-gray-300 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatExampleText(example.explanation) }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Constraints */}
        {problem.constraints && (
          <section>
            <button
              onClick={() => toggleSection('constraints')}
              className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
            >
              <h2 className="text-lg font-semibold">Constraints</h2>
              {expandedSections.constraints ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
            
            {expandedSections.constraints && (
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <ul className="text-gray-300 text-sm space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span className="font-mono">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Hints */}
        {problem.hints && problem.hints.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('hints')}
              className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <LightBulbIcon className="w-5 h-5" />
                Hints ({problem.hints.length})
              </h2>
              {expandedSections.hints ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
            
            {expandedSections.hints && (
              <div className="space-y-3">
                {problem.hints.map((hint, index) => (
                  <div key={index} className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <div className="text-gray-300 text-sm leading-relaxed">
                        {hint}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Personal Notes */}
        <section>
          <button
            onClick={() => toggleSection('notes')}
            className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
          >
            <h2 className="text-lg font-semibold">Personal Notes</h2>
            {expandedSections.notes ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          
          {expandedSections.notes && (
            <div>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Add your personal notes, approach, or insights here..."
                className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Notes are automatically saved locally
              </div>
            </div>
          )}
        </section>

        {/* Related Problems */}
        <section>
          <button
            onClick={() => toggleSection('related')}
            className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
          >
            <h2 className="text-lg font-semibold">Related Problems</h2>
            {expandedSections.related ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          
          {expandedSections.related && renderRelatedProblems()}
        </section>
      </div>
    </div>
  )
}
