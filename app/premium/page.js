'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import PaymentModal from '../../components/PaymentModal'
import {
  FaCrown,
  FaCheck,
  FaTimes,
  FaLock,
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
  FaFire,
  FaQuestionCircle,
  FaFilter,
  FaHeadset,
  FaRocket,
  FaBolt,
  FaBuilding,
  FaPlay,
  FaChevronDown,
  FaStar,
  FaCreditCard,
  FaGoogle,
  FaAmazon,
  FaMicrosoft,
  FaApple,
  FaPaypal,
  FaGift
} from 'react-icons/fa'
import { SiNetflix, SiUber, SiSpotify } from 'react-icons/si'

export default function PremiumPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('annual')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState(null)
  const [selectedBilling, setSelectedBilling] = useState('monthly')

  // FAQ Data with dropdown functionality
  const faqs = [
    {
      id: 1,
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your premium subscription at any time. Your premium access will continue until the end of your current billing period, and you won't be charged again."
    },
    {
      id: 2,
      question: "Do I lose my progress if I downgrade?",
      answer: "No, you'll never lose your progress! All your solved problems, submission history, and statistics are permanently saved. You'll just lose access to premium-only features and problems."
    },
    {
      id: 3,
      question: "Is there a free trial?",
      answer: "Yes! We offer a 7-day free trial for new premium users. You can access all premium features during this period, and you won't be charged if you cancel before the trial ends."
    },
    {
      id: 4,
      question: "How do I upgrade?",
      answer: "Simply click the 'Upgrade to Premium' button, choose your plan, and complete the secure payment process. Your premium access will be activated immediately after successful payment."
    },
    {
      id: 5,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, UPI, and other local payment methods depending on your region."
    },
    {
      id: 6,
      question: "Is there a money-back guarantee?",
      answer: "Yes! We offer a 7-day money-back guarantee. If you're not satisfied with premium features, contact our support team within 7 days for a full refund."
    },
    {
      id: 7,
      question: "What's the difference between Monthly and Yearly plans?",
      answer: "Both plans include all premium features like 500+ problems, AI hints, and video solutions. The Yearly plan offers 42% savings plus exclusive features like 1-on-1 mentorship, resume review, and priority support."
    },
    {
      id: 8,
      question: "Are the problems updated regularly?",
      answer: "Absolutely! We add new problems weekly, including the latest questions from top tech companies. Premium users get early access to all new content and exclusive problem sets."
    },
    {
      id: 9,
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade mid-cycle, you'll be charged the pro-rated difference immediately. Downgrades take effect at your next billing cycle."
    },
    {
      id: 10,
      question: "Do you offer student discounts?",
      answer: "Yes! We offer a 50% student discount on all premium plans. Simply verify your student status with your .edu email address or student ID to get the discount code."
    }
  ]

  // Benefits data
  const benefits = [
    {
      icon: <FaTrophy className="text-4xl text-yellow-400" />,
      title: "Exclusive Premium Problems",
      description: "Access 500+ extra problems not available to free users",
      highlight: "500+ Problems"
    },
    {
      icon: <FaBuilding className="text-4xl text-blue-400" />,
      title: "Company-Specific Sets",
      description: "Solve problems asked by FAANG and top companies",
      highlight: "FAANG Ready"
    },
    {
      icon: <FaRobot className="text-4xl text-green-400" />,
      title: "Advanced AI Hints",
      description: "Step-by-step guidance and alternative approaches",
      highlight: "AI Powered"
    },
    {
      icon: <FaVideo className="text-4xl text-red-400" />,
      title: "Video Solutions",
      description: "Detailed explanations for every premium problem",
      highlight: "HD Videos"
    },
    {
      icon: <FaFilter className="text-4xl text-purple-400" />,
      title: "Premium-Only Filters",
      description: "Filter by company, difficulty, or frequency",
      highlight: "Smart Filters"
    },
    {
      icon: <FaGraduationCap className="text-4xl text-indigo-400" />,
      title: "In-Depth Editorials",
      description: "Master every concept with expert-written content",
      highlight: "Expert Content"
    },
    {
      icon: <FaChartLine className="text-4xl text-pink-400" />,
      title: "Performance Tracking",
      description: "Detailed insights to improve your problem-solving skills",
      highlight: "Analytics"
    },
    {
      icon: <FaRocket className="text-4xl text-orange-400" />,
      title: "Early Access Features",
      description: "Be the first to try new features before public release",
      highlight: "Beta Access"
    }
  ]

  // Testimonials
  const testimonials = [
    {
      name: "Arjun Kumar",
      role: "Software Engineer @ Amazon",
      rating: 5,
      comment: "Premium helped me crack my Amazon interview! The company-specific problems were exactly what I needed.",
      avatar: "https://i.pravatar.cc/100?img=1"
    },
    {
      name: "Priya Sharma",
      role: "Frontend Developer @ Google",
      rating: 5,
      comment: "Worth every penny. The AI hints are a game-changer for understanding complex algorithms.",
      avatar: "https://i.pravatar.cc/100?img=2"
    },
    {
      name: "Rohit Singh",
      role: "Full Stack @ Microsoft",
      rating: 5,
      comment: "The video explanations saved me hours of research. Got my dream job in 3 months!",
      avatar: "https://i.pravatar.cc/100?img=3"
    }
  ]

  // Company logos
  const companies = [
    { name: "Google", icon: <FaGoogle /> },
    { name: "Amazon", icon: <FaAmazon /> },
    { name: "Microsoft", icon: <FaMicrosoft /> },
    { name: "Apple", icon: <FaApple /> },
    { name: "Netflix", icon: <SiNetflix /> },
    { name: "Uber", icon: <SiUber /> },
    { name: "Spotify", icon: <SiSpotify /> }
  ]

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  const handleUpgrade = (plan, billing = 'monthly') => {
    if (!session) {
      toast.error('Please login to upgrade to premium')
      router.push('/login')
      return
    }
    
    setSelectedPaymentPlan(plan)
    setSelectedBilling(billing)
    setShowPaymentModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-6 py-2 rounded-full border border-yellow-400/30 mb-6">
              <FaCrown className="text-yellow-400" />
              <span className="text-yellow-400 font-medium">Premium Access</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Unlock Your Full Coding Potential 🚀
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Get access to exclusive problems, advanced AI solutions, and premium company interview sets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUpgrade('Premium', 'yearly')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 flex items-center gap-2"
              >
                <FaCrown />
                Upgrade to Premium
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 flex items-center gap-2"
              >
                <FaGift />
                Try Free for 7 Days
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Benefits Grid */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-yellow-400">Premium?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Unlock exclusive features designed to accelerate your coding journey and land your dream job.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full mb-3">
                    {benefit.highlight}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-yellow-400">Plan</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Flexible pricing options to fit your learning journey.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 relative"
            >
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full mb-4">
                  Current Plan
                </div>
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-green-400">₹0</span>
                  <span className="text-gray-400">/forever</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>10 coding problems</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Basic problem solutions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Community support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Progress tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaTimes className="text-gray-500" />
                    <span className="text-gray-500">Hard problems</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaTimes className="text-gray-500" />
                    <span className="text-gray-500">AI hints</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaTimes className="text-gray-500" />
                    <span className="text-gray-500">Video solutions</span>
                  </li>
                </ul>
                <button
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all duration-300"
                  disabled
                >
                  Current Plan
                </button>
              </div>
            </motion.div>

            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full mb-4">
                  Popular Choice
                </div>
                <h3 className="text-2xl font-bold mb-2">Monthly Premium</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-purple-400">₹999</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>500+ premium problems</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>All Hard problems unlocked</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>AI hints and guidance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Video solutions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Company-specific problems</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Premium filters & analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <button
                  onClick={() => handleUpgrade('Premium', 'monthly')}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Choose Monthly
                </button>
              </div>
            </motion.div>

            {/* Annual Plan */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 p-4 rounded-2xl border-2 border-yellow-400/50 relative hover:border-yellow-400 transition-all duration-300"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm">
                  Best Value
                </div>
              </div>
              
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full mb-4">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Yearly Premium</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-yellow-400">₹6,999</span>
                  <span className="text-gray-400">/year</span>
                </div>
                <div className="text-green-400 font-semibold mb-6">Save 42% • Only ₹583/month</div>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Everything in Monthly Premium</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Early access to new features</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Exclusive premium contests</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Advanced performance insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>1-on-1 mentorship sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Resume review & interview prep</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-400" />
                    <span>Certification upon completion</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleUpgrade('Premium', 'yearly')}
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
                >
                  Choose Yearly
                </button>
              </div>
            </motion.div>
          </div>

          {/* Payment Security */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaLock className="text-green-400" />
              <span className="text-gray-400">7-day money-back guarantee</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-gray-500">
              <FaCreditCard className="text-2xl" />
              <FaPaypal className="text-2xl" />
              <span className="text-sm">Secure payment powered by Razorpay</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Free vs Premium Comparison */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose the Perfect <span className="text-yellow-400">Plan</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Compare features across all our plans to find what works best for you.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full bg-gray-800/50 rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-gray-700/50">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold text-green-400">Free</th>
                  <th className="px-6 py-4 text-center font-bold text-purple-400">Monthly Premium</th>
                  <th className="px-6 py-4 text-center font-bold text-yellow-400">Yearly Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {[
                  { feature: "Problems Available", free: "10", monthly: "500+", yearly: "500+" },
                  { feature: "Hard Problems", free: false, monthly: true, yearly: true },
                  { feature: "Company Tags", free: false, monthly: true, yearly: true },
                  { feature: "AI Hints", free: false, monthly: true, yearly: true },
                  { feature: "Video Solutions", free: false, monthly: true, yearly: true },
                  { feature: "Premium Filters", free: false, monthly: true, yearly: true },
                  { feature: "Performance Analytics", free: "Basic", monthly: "Advanced", yearly: "Advanced" },
                  { feature: "Priority Support", free: false, monthly: false, yearly: true },
                  { feature: "1-on-1 Mentorship", free: false, monthly: false, yearly: true },
                  { feature: "Resume Review", free: false, monthly: false, yearly: true },
                  { feature: "Certification", free: false, monthly: false, yearly: true }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-700/25 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <FaCheck className="text-green-400 mx-auto" /> : <FaTimes className="text-gray-500 mx-auto" />
                      ) : (
                        <span className="text-green-400 font-semibold">{row.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.monthly === 'boolean' ? (
                        row.monthly ? <FaCheck className="text-green-400 mx-auto" /> : <FaTimes className="text-gray-500 mx-auto" />
                      ) : (
                        <span className="text-purple-400 font-semibold">{row.monthly}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.yearly === 'boolean' ? (
                        row.yearly ? <FaCheck className="text-green-400 mx-auto" /> : <FaTimes className="text-gray-500 mx-auto" />
                      ) : (
                        <span className="text-yellow-400 font-semibold">{row.yearly}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials & Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Success <span className="text-yellow-400">Stories</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of developers who upgraded to premium and landed their dream jobs.
            </p>
          </motion.div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Company Logos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-400 mb-8">Premium users got placed at:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {companies.map((company, index) => (
                <div key={index} className="flex items-center gap-2 text-2xl hover:opacity-100 transition-opacity">
                  {company.icon}
                  <span className="font-semibold">{company.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section with Dropdowns */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-yellow-400">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-yellow-400/30 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-700/25 transition-colors group"
                >
                  <span className="font-semibold text-lg flex items-center gap-3 group-hover:text-yellow-400 transition-colors">
                    <motion.div
                      animate={{ scale: expandedFaq === faq.id ? 1.2 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaQuestionCircle className="text-yellow-400" />
                    </motion.div>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ 
                      rotate: expandedFaq === faq.id ? 180 : 0,
                      scale: expandedFaq === faq.id ? 1.1 : 1 
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <FaChevronDown className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div 
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="px-6 pb-5 pt-2 text-gray-300 border-t border-gray-700/50 leading-relaxed"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call-to-Action */}
      <section className="py-20 bg-gradient-to-r from-yellow-400/10 to-orange-500/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Level Up? 🚀
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join thousands of developers who upgraded to premium and landed their dream jobs. 
              Start your premium journey today!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUpgrade('Premium', 'yearly')}
              className="px-12 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xl font-bold rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <FaCrown className="text-2xl" />
              Upgrade to Premium Now
              <FaRocket className="text-2xl" />
            </motion.button>

            <div className="mt-8 text-gray-400">
              <p>✨ 7-day free trial • 💰 Money-back guarantee • 🔒 Secure payment</p>
            </div>
          </motion.div>
        </div>
      </section>

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
