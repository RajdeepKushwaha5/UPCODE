'use client'
import { useState, useEffect, useRef } from 'react'
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  PlayIcon, 
  BookOpenIcon, 
  LightBulbIcon, 
  TagIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  SparklesIcon,
  DocumentTextIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function EnhancedProblemDescription({ problem, notes, onNotesChange, isMobile = false }) {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    examples: true,
    constraints: true,
    hints: false,
    notes: false,
    related: false,
    companies: false,
    editorial: false
  })
  
  const [stickyHeader, setStickyHeader] = useState(false)
  const scrollContainerRef = useRef(null)

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      case 'Hard': return 'text-red-400 bg-red-900/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  const formatDescription = (description) => {
    if (!description) return ''
    // Convert markdown-like formatting to HTML
    return description
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 rounded text-blue-300">$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />')
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading problem...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className={`${stickyHeader ? 'shadow-lg border-b border-gray-700' : ''} bg-gray-900 transition-all duration-300`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-col gap-3">
            {/* Title and Difficulty */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold text-white leading-tight flex-1">
                {problem.id}. {problem.title}
              </h1>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <ChartBarIcon className="w-4 h-4" />
                <span>Acceptance: {problem.calculatedAcceptanceRate || problem.acceptanceRate}%</span>
              </div>
              
              {problem.stats && (
                <div className="flex items-center gap-1 text-gray-400">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>{problem.stats.totalSubmissions} submissions</span>
                </div>
              )}

              {problem.frequency && (
                <div className="flex items-center gap-1 text-gray-400">
                  <StarIcon className="w-4 h-4" />
                  <span>Frequency: {problem.frequency}/5</span>
                </div>
              )}

              {problem.isPremium && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <SparklesIcon className="w-4 h-4" />
                  <span>Premium</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {problem.tags && problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-md border border-blue-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Company Tags */}
            {problem.companies && problem.companies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                {problem.companies.slice(0, isMobile ? 3 : 6).map((company, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600"
                  >
                    {company}
                  </span>
                ))}
                {problem.companies.length > (isMobile ? 3 : 6) && (
                  <button
                    onClick={() => toggleSection('companies')}
                    className="px-2 py-1 text-gray-400 text-xs hover:text-gray-300"
                  >
                    +{problem.companies.length - (isMobile ? 3 : 6)} more
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {/* Problem Description */}
        <section>
          <button
            onClick={() => toggleSection('description')}
            className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Description
            </h2>
            {expandedSections.description ? (
              <ChevronUpIcon className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
            )}
          </button>
          
          {expandedSections.description && (
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: `<p>${formatDescription(problem.description)}</p>` 
                }}
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
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <PlayIcon className="w-5 h-5" />
                Examples
              </h2>
              {expandedSections.examples ? (
                <ChevronUpIcon className="w-5 h-5 flex-shrink-0" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
              )}
            </button>
            
            {expandedSections.examples && (
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-blue-400">Example {index + 1}:</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-300">Input: </span>
                        <code className="bg-gray-700 px-2 py-1 rounded text-green-300">
                          {example.input}
                        </code>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-300">Output: </span>
                        <code className="bg-gray-700 px-2 py-1 rounded text-blue-300">
                          {example.output}
                        </code>
                      </div>
                      
                      {example.explanation && (
                        <div>
                          <span className="font-medium text-gray-300">Explanation: </span>
                          <span className="text-gray-400">{example.explanation}</span>
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
        {problem.constraints && problem.constraints.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('constraints')}
              className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                Constraints
              </h2>
              {expandedSections.constraints ? (
                <ChevronUpIcon className="w-5 h-5 flex-shrink-0" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
              )}
            </button>
            
            {expandedSections.constraints && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <ul className="space-y-2">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <code className="text-yellow-300">{constraint}</code>
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
                <ChevronUpIcon className="w-5 h-5 flex-shrink-0" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
              )}
            </button>
            
            {expandedSections.hints && (
              <div className="space-y-3">
                {problem.hints.map((hint, index) => (
                  <div key={index} className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-bold mt-0.5 flex-shrink-0">
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

        {/* Editorial/Solution */}
        {problem.editorial && (
          <section>
            <button
              onClick={() => toggleSection('editorial')}
              className="flex items-center justify-between w-full text-left mb-3 text-white hover:text-blue-400 transition-colors"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5" />
                Editorial
                {problem.editorial.isPremium && (
                  <SparklesIcon className="w-4 h-4 text-yellow-400" />
                )}
              </h2>
              {expandedSections.editorial ? (
                <ChevronUpIcon className="w-5 h-5 flex-shrink-0" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
              )}
            </button>
            
            {expandedSections.editorial && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                {problem.editorial.isPremium ? (
                  <div className="text-center py-8">
                    <SparklesIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Premium Content</p>
                    <p className="text-sm text-gray-400">
                      Upgrade to Premium to access the editorial solution
                    </p>
                  </div>
                ) : (
                  <div 
                    className="text-gray-300 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formatDescription(problem.editorial.content) 
                    }}
                  />
                )}
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
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Personal Notes
            </h2>
            {expandedSections.notes ? (
              <ChevronUpIcon className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
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

        {/* Expanded Company Tags */}
        {expandedSections.companies && problem.companies && problem.companies.length > (isMobile ? 3 : 6) && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BuildingOfficeIcon className="w-5 h-5" />
              All Companies
            </h2>
            <div className="flex flex-wrap gap-2">
              {problem.companies.map((company, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600"
                >
                  {company}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Video Solution */}
        {problem.videoSolution && (
          <section>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <PlayIcon className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Video Solution</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">{problem.videoSolution.title}</p>
              <a
                href={problem.videoSolution.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Watch Solution
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
