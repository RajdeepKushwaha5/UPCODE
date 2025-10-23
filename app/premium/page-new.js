'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import PaymentModal from '../../components/PaymentModal'
import {
  FaCrown,
  FaCheck,
  FaTimes,
  FaLock,
  FaUnlock,
  FaCode,
  FaRobot,
  FaUsers,
  FaLightbulb,
  FaGraduationCap,
  FaTrophy,
  FaInfinity,
  FaArrowLeft
} from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const PricingCard = ({ plan, isPopular = false, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gray-800 rounded-xl p-8 border-2 relative ${isPopular
        ? 'border-yellow-400 shadow-2xl shadow-yellow-400/20'
        : 'border-gray-700'
      }`}
  >
    {isPopular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold">
          Most Popular
        </span>
      </div>
    )}

    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        {plan.icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      <p className="text-gray-400 mb-4">{plan.description}</p>
      <div className="mb-4">
        <span className="text-4xl font-bold text-white">${plan.price}</span>
        <span className="text-gray-400">/{plan.period}</span>
      </div>
    </div>

    <ul className="space-y-4 mb-8">
      {plan.features.map((feature, idx) => (
        <li key={idx} className="flex items-center gap-3">
          <FaCheck className="text-green-400 flex-shrink-0" />
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>

    <button
      onClick={() => onSelect(plan)}
      className={`w-full py-3 rounded-lg font-semibold transition-all ${isPopular
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
          : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
    >
      {plan.price === 0 ? 'Current Plan' : 'Get Started'}
    </button>
  </motion.div>
)

const FeatureComparison = () => {
  const features = [
    { name: 'Basic Problems Access', free: true, premium: true },
    { name: 'Code Execution', free: true, premium: true },
    { name: 'Basic Hints', free: true, premium: true },
    { name: 'Community Notes', free: true, premium: true },
    { name: 'Premium Problems (20+)', free: false, premium: true },
    { name: 'AI Assistant with 1s Response', free: false, premium: true },
    { name: 'Advanced AI Problem Generator', free: false, premium: true },
    { name: 'AI Solution Evaluation', free: false, premium: true },
    { name: 'Personalized Learning Path', free: false, premium: true },
    { name: 'Priority Support', free: false, premium: true },
    { name: 'Advanced Analytics', free: false, premium: true },
    { name: 'Unlimited Problem Generation', free: false, premium: true }
  ]

  return (
    <div className="bg-gray-800 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">Feature Comparison</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-4 text-gray-300">Feature</th>
              <th className="text-center py-4 text-gray-300">Free</th>
              <th className="text-center py-4 text-yellow-400">Premium</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => (
              <tr key={idx} className="border-b border-gray-700/50">
                <td className="py-4 text-gray-300">{feature.name}</td>
                <td className="text-center py-4">
                  {feature.free ? (
                    <FaCheck className="text-green-400 mx-auto" />
                  ) : (
                    <FaTimes className="text-red-400 mx-auto" />
                  )}
                </td>
                <td className="text-center py-4">
                  {feature.premium ? (
                    <FaCheck className="text-green-400 mx-auto" />
                  ) : (
                    <FaTimes className="text-red-400 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function PremiumPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState(null)
  const [selectedBilling, setSelectedBilling] = useState('monthly')

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started',
      icon: <FaCode className="text-4xl text-blue-400" />,
      features: [
        'Access to 18 coding problems',
        'Basic code execution',
        'Community notes access',
        'Basic hints system',
        'Standard response time'
      ]
    },
    {
      name: 'Premium',
      price: 9.99,
      period: 'month',
      description: 'Unlock your full potential',
      icon: <FaCrown className="text-4xl text-yellow-400" />,
      features: [
        'Access to all 38+ problems',
        'Premium exclusive problems',
        'AI Assistant with 1s response',
        'Advanced AI problem generator',
        'AI solution evaluation',
        'Personalized learning paths',
        'Advanced analytics dashboard',
        'Priority support',
        'Unlimited problem generation'
      ]
    }
  ]

  const handlePlanSelect = async (plan) => {
    setSelectedPlan(plan)

    if (plan.price === 0) {
      // Handle free plan
      return
    }

    if (!session) {
      alert('Please login to upgrade to premium')
      router.push('/login')
      return
    }

    // Set up payment modal
    setSelectedPaymentPlan('Premium')
    setSelectedBilling(plan.period === 'month' ? 'monthly' : 'yearly')
    setShowPaymentModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Upgrade to Premium</h1>
              <p className="text-gray-400">Unlock advanced features and exclusive content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <FaCrown className="text-6xl text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Supercharge Your Coding Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get access to premium problems, AI-powered assistance, and advanced features
              designed to accelerate your programming skills.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: <FaLock className="text-3xl text-yellow-400" />,
                title: '20+ Premium Problems',
                description: 'Exclusive challenging problems from top companies'
              },
              {
                icon: <FaRobot className="text-3xl theme-accent" />,
                title: 'AI Assistant',
                description: '1-second response time with smart problem-specific help'
              },
              {
                icon: <FaInfinity className="text-3xl text-blue-400" />,
                title: 'Unlimited Generation',
                description: 'Create infinite custom problems with AI'
              },
              {
                icon: <FaTrophy className="text-3xl text-green-400" />,
                title: 'Advanced Analytics',
                description: 'Track progress with detailed performance insights'
              }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-6"
              >
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isPopular={plan.name === 'Premium'}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <FeatureComparison />

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                question: 'Can I cancel anytime?',
                answer: 'Yes, you can cancel your premium subscription at any time. You\'ll continue to have access to premium features until the end of your billing period.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.'
              },
              {
                question: 'Do you offer student discounts?',
                answer: 'Yes! We offer a 50% discount for students with a valid .edu email address. Contact support for details.'
              },
              {
                question: 'Is there a free trial?',
                answer: 'Your free account gives you access to 18 problems to try out the platform. Premium unlocks all features immediately.'
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-6"
              >
                <h4 className="text-white font-semibold mb-2">{faq.question}</h4>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-xl p-8 max-w-2xl mx-auto"
          >
            <FaGraduationCap className="text-4xl text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Level Up?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of developers who have accelerated their careers with UpCode Premium.
            </p>
            <button
              onClick={() => handlePlanSelect(plans[1])}
              disabled={isLoading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Start Premium Today'}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPaymentPlan}
        billing={selectedBilling}
      />
    </div>
  )
}
