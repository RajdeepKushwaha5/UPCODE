'use client'
import React, { useState } from 'react';
import { FaTimes, FaCode, FaReact, FaPython, FaJsSquare, FaDatabase, FaCloud, FaRocket, FaUsers, FaBrain, FaComments, FaCog } from 'react-icons/fa';

const TopicSelectionModal = ({ isOpen, onClose, onStartInterview, interviewType }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);

  const topicOptions = {
    'technical-coding': [
      { id: 'javascript', name: 'JavaScript', icon: FaJsSquare, color: 'text-yellow-400' },
      { id: 'python', name: 'Python', icon: FaPython, color: 'text-blue-400' },
      { id: 'react', name: 'React', icon: FaReact, color: 'text-cyan-400' },
      { id: 'data-structures', name: 'Data Structures', icon: FaCog, color: 'text-green-400' },
      { id: 'algorithms', name: 'Algorithms', icon: FaBrain, color: 'text-purple-400' }
    ],
    'system-design': [
      { id: 'scalability', name: 'Scalability', icon: FaRocket, color: 'text-red-400' },
      { id: 'databases', name: 'Databases', icon: FaDatabase, color: 'text-blue-400' },
      { id: 'microservices', name: 'Microservices', icon: FaCloud, color: 'text-green-400' }
    ],
    'behavioral': [
      { id: 'leadership', name: 'Leadership', icon: FaUsers, color: 'text-purple-400' },
      { id: 'problem-solving', name: 'Problem Solving', icon: FaBrain, color: 'text-orange-400' },
      { id: 'communication', name: 'Communication', icon: FaComments, color: 'text-blue-400' }
    ]
  };

  const currentTopics = topicOptions[interviewType] || topicOptions['technical-coding'];

  const toggleTopic = (topicId) => {
    setSelectedTopics(prev => 
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleStartInterview = () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic');
      return;
    }

    onStartInterview({
      topics: selectedTopics,
      difficulty,
      questionCount,
      interviewType
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-purple-500/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Customize Your Interview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Topics Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Select Topics (Choose 1 or more)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentTopics.map((topic) => {
              const IconComponent = topic.icon;
              const isSelected = selectedTopics.includes(topic.id);
              
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 bg-slate-700/30 text-gray-300 hover:border-purple-400'
                  }`}
                >
                  <IconComponent className={`text-2xl mx-auto mb-2 ${isSelected ? 'text-purple-400' : topic.color}`} />
                  <div className="text-sm font-semibold">{topic.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Difficulty Level</h3>
          <div className="grid grid-cols-3 gap-3">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                  difficulty === level
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-600 bg-slate-700/30 text-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="font-semibold capitalize">{level}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {level === 'easy' && '15 min per question'}
                  {level === 'medium' && '25 min per question'}
                  {level === 'hard' && '35 min per question'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Number of Questions</h3>
          <div className="flex gap-3">
            {[3, 5, 7, 10].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                  questionCount === count
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-600 bg-slate-700/30 text-gray-300 hover:border-purple-400'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Summary */}
        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <h4 className="text-white font-semibold mb-2">Interview Summary</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p><span className="text-purple-400">Topics:</span> {selectedTopics.length > 0 ? selectedTopics.join(', ') : 'None selected'}</p>
            <p><span className="text-purple-400">Difficulty:</span> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
            <p><span className="text-purple-400">Questions:</span> {questionCount}</p>
            <p><span className="text-purple-400">Estimated Time:</span> {questionCount * (difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35)} minutes</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleStartInterview}
            disabled={selectedTopics.length === 0}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start AI Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelectionModal;
