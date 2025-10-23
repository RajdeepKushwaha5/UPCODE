'use client';
import { useState, useEffect } from 'react';
import { getMockProblems, getDifficultyColor, getDifficultyBg } from '@/lib/problemsApi';

const ProblemRow = ({ problem, index, onProblemClick }) => {
  const getDifficultyIcon = (difficulty) => {
    const baseStyle = "w-2 h-2 rounded-full flex-shrink-0";
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return `${baseStyle} bg-green-500`;
      case 'medium':
        return `${baseStyle} bg-yellow-500`;
      case 'hard':
        return `${baseStyle} bg-red-500`;
      default:
        return `${baseStyle} bg-gray-500`;
    }
  };

  const getProgressBar = (acceptance_rate) => {
    const rate = parseFloat(acceptance_rate?.replace('%', '') || 0);
    const width = Math.min(rate, 100);

    let colorClass = 'bg-red-500';
    if (rate >= 60) colorClass = 'bg-green-500';
    else if (rate >= 40) colorClass = 'bg-yellow-500';

    return (
      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
    );
  };

  return (
    <div
      className="flex items-center p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-700/50 group cursor-pointer"
      onClick={() => onProblemClick(problem)}
    >
      {/* Problem Number */}
      <div className="w-12 text-gray-400 text-sm font-mono">
        {index + 1}.
      </div>

      {/* Problem Title */}
      <div className="flex-1 min-w-0 mr-4">
        <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors truncate">
          {problem.title}
        </h3>
        {problem.tags && (
          <div className="flex gap-1 mt-1">
            {problem.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Acceptance Rate */}
      <div className="w-20 text-right mr-6">
        <div className="text-gray-300 text-sm mb-1">
          {problem.acceptance_rate}
        </div>
        {getProgressBar(problem.acceptance_rate)}
      </div>

      {/* Difficulty */}
      <div className="w-16 mr-6">
        <div className="flex items-center gap-2">
          <div className={getDifficultyIcon(problem.difficulty)} />
          <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="w-16 flex justify-center">
        <div className="flex gap-1">
          {/* Mock status indicators */}
          <div className="w-2 h-6 bg-gray-600 rounded-sm" />
          <div className="w-2 h-6 bg-gray-600 rounded-sm" />
          <div className="w-2 h-6 bg-gray-600 rounded-sm" />
          <div className="w-2 h-6 bg-gray-600 rounded-sm" />
          <div className="w-2 h-6 bg-gray-600 rounded-sm" />
          <div className="w-2 h-6 bg-gray-600 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

const FilterBar = ({ filters, setFilters, problemCount, onGenerateProblem, generating }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-800/30">
      <div className="flex items-center gap-4">
        {/* Problem Source */}
        <select
          value={filters.source}
          onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="mock">Mock Problems</option>
          <option value="gemini">🤖 AI Generated</option>
          <option value="leetcode">LeetCode</option>
          <option value="codeforces">Codeforces</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Topic Filter */}
        <select
          value={filters.topic}
          onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Topics</option>
          <option value="arrays">Arrays</option>
          <option value="strings">Strings</option>
          <option value="dynamic-programming">Dynamic Programming</option>
          <option value="trees">Trees</option>
          <option value="graphs">Graphs</option>
        </select>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="bg-gray-700 text-white px-3 py-1.5 pl-8 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Generate AI Problem Button */}
        <button
          onClick={onGenerateProblem}
          disabled={generating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-purple-400 text-white px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {generating ? 'Generating...' : 'AI Problem'}
        </button>
      </div>

      {/* Problem Count */}
      <div className="text-gray-400 text-sm">
        {problemCount} problems
      </div>
    </div>
  );
};

const ProblemModal = ({ problem, isOpen, onClose }) => {
  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">{problem.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs ${getDifficultyBg(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="text-gray-400 text-sm">{problem.acceptance_rate}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">
              {problem.description || 'Problem description will be loaded here...'}
            </p>

            {problem.examples && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Examples:</h3>
                {problem.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-900 p-4 rounded mb-4">
                    <div className="mb-2">
                      <strong className="text-gray-300">Input:</strong>
                      <code className="ml-2 text-blue-400">{example.input}</code>
                    </div>
                    <div className="mb-2">
                      <strong className="text-gray-300">Output:</strong>
                      <code className="ml-2 text-green-400">{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div>
                        <strong className="text-gray-300">Explanation:</strong>
                        <span className="ml-2 text-gray-400">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {problem.constraints && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Constraints:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {problem.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}

            {problem.tags && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
              Solve Problem
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              View Solutions
            </button>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProblemsPanel() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    source: 'mock',
    difficulty: '',
    topic: '',
    search: ''
  });

  useEffect(() => {
    loadProblems();
  }, [filters.source]);

  useEffect(() => {
    filterProblems();
  }, [problems, filters]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/problems?source=${filters.source}&difficulty=${filters.difficulty}&topic=${filters.topic}`);
      const data = await response.json();

      if (data.success) {
        setProblems(data.problems);
      } else {
        setProblems(getMockProblems());
      }
    } catch (error) {
      console.error('Error loading problems:', error);
      setProblems(getMockProblems());
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = [...problems];

    if (filters.difficulty) {
      filtered = filtered.filter(problem =>
        problem.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    if (filters.search) {
      filtered = filtered.filter(problem =>
        problem.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        problem.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    setFilteredProblems(filtered);
  };

  const generateAIProblem = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          difficulty: filters.difficulty || 'medium',
          topic: filters.topic || 'algorithms'
        })
      });

      const data = await response.json();
      if (data.success && data.problems.length > 0) {
        setProblems(prev => [data.problems[0], ...prev]);
      }
    } catch (error) {
      console.error('Error generating problem:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleProblemClick = (problem) => {
    setSelectedProblem(problem);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <h2 className="text-white text-xl font-bold">Problems</h2>
          <p className="text-blue-100 text-sm mt-1">Choose a problem to start coding</p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          problemCount={filteredProblems.length}
          onGenerateProblem={generateAIProblem}
          generating={generating}
        />

        {/* Problems List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredProblems.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No problems found</div>
              <p className="text-gray-500 text-sm">Try adjusting your filters or generate an AI problem</p>
            </div>
          ) : (
            filteredProblems.map((problem, index) => (
              <ProblemRow
                key={problem.id || index}
                problem={problem}
                index={index}
                onProblemClick={handleProblemClick}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800/50 p-3 text-center border-t border-gray-700/50">
          <p className="text-gray-400 text-xs">
            Powered by UpCode • {filters.source === 'gemini' ? '🤖 AI Enhanced' : 'Updated daily'}
          </p>
        </div>
      </div>

      {/* Problem Modal */}
      <ProblemModal
        problem={selectedProblem}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
