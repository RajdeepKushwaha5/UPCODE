'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaArrowRight, FaArrowLeft, FaBrain, FaGoogle,
  FaAmazon, FaMicrosoft, FaApple, FaFacebook, FaClock,
  FaCalendarAlt, FaStar, FaRocket, FaCrown, FaLock,
  FaTrophy, FaCertificate
} from 'react-icons/fa';
import { SiNetflix, SiUber } from 'react-icons/si';
import { toast } from 'react-hot-toast';

const StudyPlanCreator = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    goal: {
      type: '',
      company: '',
      timeline: 30,
      difficulty: 'intermediate'
    },
    timeAvailability: {
      hoursPerDay: 1,
      daysPerWeek: 7,
      preferredTime: 'flexible'
    },
    focusAreas: [],
    isPremium: false
  });

  const companies = [
    { name: 'Google', icon: FaGoogle, color: 'text-blue-500' },
    { name: 'Amazon', icon: FaAmazon, color: 'text-orange-500' },
    { name: 'Microsoft', icon: FaMicrosoft, color: 'text-blue-600' },
    { name: 'Apple', icon: FaApple, color: 'text-gray-400' },
    { name: 'Meta', icon: FaFacebook, color: 'text-blue-500' },
    { name: 'Netflix', icon: SiNetflix, color: 'text-red-500' },
    { name: 'Uber', icon: SiUber, color: 'text-black' },
    { name: 'General', icon: FaStar, color: 'text-yellow-500' }
  ];

  const goalTypes = [
    {
      type: 'interview',
      title: 'Interview Preparation',
      description: 'Prepare for technical interviews at top companies',
      icon: FaBrain,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'contest',
      title: 'Contest Preparation',
      description: 'Improve competitive programming skills',
      icon: FaTrophy,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      type: 'skill_improvement',
      title: 'Skill Enhancement',
      description: 'Master specific algorithms and data structures',
      icon: FaRocket,
      color: 'from-purple-500 to-pink-500'
    },
    {
      type: 'certification',
      title: 'Certification Prep',
      description: 'Prepare for coding certifications and assessments',
      icon: FaCertificate,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const focusTopics = [
    'Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming',
    'Sorting & Searching', 'Hash Tables', 'Recursion & Backtracking',
    'Greedy Algorithms', 'System Design', 'Object-Oriented Design',
    'Bit Manipulation', 'Math & Statistics', 'Two Pointers', 'Sliding Window'
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.goal.type) {
        toast.error('Please fill in all required fields');
        return;
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting study plan:', error);
      toast.error('Failed to create study plan');
    }
  };

  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleFocusArea = (topic) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(topic)
        ? prev.focusAreas.filter(t => t !== topic)
        : [...prev.focusAreas, topic]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaBrain className="text-purple-400" />
              Create AI Study Plan
            </h2>
            <p className="text-gray-400 mt-1">Step {currentStep} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">What's your goal?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goalTypes.map((goal) => (
                    <motion.div
                      key={goal.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateFormData('goal.type', goal.type)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.goal.type === goal.type
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                        }`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${goal.color} rounded-lg flex items-center justify-center mb-3`}>
                        <goal.icon className="text-white text-xl" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">{goal.title}</h4>
                      <p className="text-gray-400 text-sm">{goal.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Study Plan Name *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="e.g., Google SDE Interview Prep"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Target Company & Timeline</h3>

                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Target Company</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {companies.map((company) => (
                      <motion.div
                        key={company.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateFormData('goal.company', company.name)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.goal.company === company.name
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                      >
                        <company.icon className={`text-2xl ${company.color}`} />
                        <span className="text-white text-sm">{company.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Timeline (Days)
                    </label>
                    <select
                      value={formData.goal.timeline}
                      onChange={(e) => updateFormData('goal.timeline', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value={30}>30 Days (1 Month)</option>
                      <option value={60}>60 Days (2 Months)</option>
                      <option value={90}>90 Days (3 Months)</option>
                      <option value={180}>180 Days (6 Months)</option>
                      <option value={365}>365 Days (1 Year)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.goal.difficulty}
                      onChange={(e) => updateFormData('goal.difficulty', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Time Availability</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Hours per Day
                    </label>
                    <select
                      value={formData.timeAvailability.hoursPerDay}
                      onChange={(e) => updateFormData('timeAvailability.hoursPerDay', parseFloat(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value={0.5}>30 minutes</option>
                      <option value={1}>1 hour</option>
                      <option value={1.5}>1.5 hours</option>
                      <option value={2}>2 hours</option>
                      <option value={3}>3 hours</option>
                      <option value={4}>4+ hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Days per Week
                    </label>
                    <select
                      value={formData.timeAvailability.daysPerWeek}
                      onChange={(e) => updateFormData('timeAvailability.daysPerWeek', parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value={3}>3 days (Weekends)</option>
                      <option value={5}>5 days (Weekdays)</option>
                      <option value={6}>6 days</option>
                      <option value={7}>7 days (Daily)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Preferred Study Time
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['morning', 'afternoon', 'evening', 'flexible'].map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateFormData('timeAvailability.preferredTime', time)}
                        className={`p-3 rounded-lg border transition-all capitalize ${formData.timeAvailability.preferredTime === time
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-gray-700 hover:border-gray-600 text-gray-300'
                          }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Focus Areas</h3>
                <p className="text-gray-400 mb-6">Select topics you want to focus on (optional)</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {focusTopics.map((topic) => (
                    <motion.button
                      key={topic}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleFocusArea(topic)}
                      className={`p-3 rounded-lg border transition-all text-sm ${formData.focusAreas.includes(topic)
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-700 hover:border-gray-600 text-gray-300'
                        }`}
                    >
                      {topic}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Premium Features Preview */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaCrown className="text-yellow-400 text-xl" />
                  <h4 className="text-yellow-100 font-semibold">Premium Features Available</h4>
                </div>
                <div className="space-y-2 text-sm text-yellow-200/80">
                  <p>• Advanced AI personalization & adaptation</p>
                  <p>• Mock interview scheduling</p>
                  <p>• Detailed performance analytics</p>
                  <p>• Priority support</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="premiumPlan"
                    checked={formData.isPremium}
                    onChange={(e) => updateFormData('isPremium', e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="premiumPlan" className="text-yellow-100 text-sm">
                    Enable Premium Features (Requires Premium Subscription)
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentStep === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-white hover:bg-gray-700'
              }`}
          >
            <FaArrowLeft />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            {currentStep === 4 ? 'Create Plan' : 'Next'}
            <FaArrowRight />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudyPlanCreator;
