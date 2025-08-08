'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
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
  FaArrowLeft,
  FaChartLine,
  FaVideo,
  FaPalette,
  FaFire,
  FaQuestionCircle,
  FaRoute,
  FaFilter,
  FaCodeBranch,
  FaGift,
  FaHeadset,
  FaRocket,
  FaBolt
} from 'react-icons/fa'
import { useRouter } from 'next/navigation'

// Placeholder components
const PremiumPaymentButton = () => (
  <button className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg">
    Upgrade to Premium
  </button>
)

const PaymentDebugger = () => null

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

    <div className="space-y-3 mb-8">
      {plan.features.map((feature, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
          <span className="text-gray-300 text-sm">{feature}</span>
        </div>
      ))}
    </div>

    <button
      onClick={() => onSelect(plan)}
      className={`w-full py-3 rounded-lg font-semibold transition-all ${isPopular
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
          : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
    >
      {plan.price === 0 ? 'Current Plan' : 'Choose Plan'}
    </button>
  </motion.div>
)

const ComparisonTable = ({ features }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-8 overflow-x-auto">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Feature Comparison
      </h3>
      <div className="min-w-full">
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
        'AI-powered solutions',
        'Video explanations',
        'Mock interviews',
        'Priority support',
        'Multiple themes',
        'Advanced analytics'
      ]
    }
  ]

  const features = [
    { name: 'Problem Access', free: true, premium: true },
    { name: 'Video Solutions', free: false, premium: true },
    { name: 'AI Assistant', free: false, premium: true },
    { name: 'Mock Interviews', free: false, premium: true },
    { name: 'Multiple Themes', free: false, premium: true },
    { name: 'Priority Support', free: false, premium: true },
    { name: 'Advanced Analytics', free: false, premium: true },
    { name: 'Exclusive Problems', free: false, premium: true }
  ]

  const faqs = [
    {
      question: 'What makes UpCode Premium worth it?',
      answer: 'Premium gives you access to advanced features like AI-powered solutions, video explanations, mock interviews, and exclusive problem sets that significantly accelerate your learning.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes! You can cancel your subscription at any time. No questions asked, no hassle.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.'
    },
    {
      question: 'How does the AI assistant work?',
      answer: 'Our AI assistant provides step-by-step explanations, hints, and multiple solution approaches to help you understand problems deeply rather than just getting answers.'
    }
  ]

  const handlePlanSelect = async (plan) => {
    if (plan.price === 0) return

    setIsLoading(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Premium subscription activated!')
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <FaCrown className="text-6xl text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Level Up Your Coding Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who have accelerated their careers with our premium features,
              AI-powered assistance, and exclusive content.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan, idx) => (
            <PricingCard
              key={idx}
              plan={plan}
              isPopular={idx === 1}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <ComparisonTable features={features} />
        </div>

        {/* Features Showcase */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Premium Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FaRobot, title: 'AI Assistant', desc: 'Get intelligent hints and explanations' },
              { icon: FaVideo, title: 'Video Solutions', desc: 'Watch detailed problem walkthroughs' },
              { icon: FaUsers, title: 'Mock Interviews', desc: 'Practice with AI-powered interviews' },
              { icon: FaTrophy, title: 'Exclusive Problems', desc: 'Access premium problem sets' },
              { icon: FaPalette, title: 'Multiple Themes', desc: 'Customize your coding environment' },
              { icon: FaChartLine, title: 'Advanced Analytics', desc: 'Track your progress in detail' },
              { icon: FaLightbulb, title: 'Learning Paths', desc: 'Follow structured learning routes' },
              { icon: FaHeadset, title: 'Priority Support', desc: 'Get help when you need it most' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
              >
                <feature.icon className="text-3xl text-yellow-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800 rounded-xl p-6"
              >
                <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
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

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151'
          }
        }}
      />
    </div>
  )
}
