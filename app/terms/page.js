'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGavel, FaUserCheck, FaExclamationTriangle, FaCrown, FaHandshake, FaArrowUp, FaBalanceScale } from 'react-icons/fa'
import Link from 'next/link'

export default function TermsOfServicePage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <FaHandshake />,
      content: `By accessing and using UPCODE, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service constitute a legally binding agreement between you and UPCODE.`,
      details: [
        "Agreement becomes effective upon first use of the platform",
        "Continued use constitutes acceptance of any updates to terms",
        "Users must be at least 13 years old to use the service",
        "Parents/guardians must agree to terms for users under 18",
        "Commercial use requires explicit written permission"
      ]
    },
    {
      title: "User Responsibilities",
      icon: <FaUserCheck />,
      content: `You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to use UPCODE in compliance with all applicable laws.`,
      details: [
        "Maintain accurate and up-to-date account information",
        "Keep login credentials secure and confidential",
        "Notify us immediately of any unauthorized account access",
        "Comply with all applicable local, national, and international laws",
        "Use the platform only for legitimate educational purposes"
      ]
    },
    {
      title: "Code of Conduct",
      icon: <FaExclamationTriangle />,
      content: `Users must maintain respectful behavior and follow community guidelines. Harassment, cheating, or malicious activities are strictly prohibited and may result in account suspension.`,
      details: [
        "No harassment, bullying, or discriminatory behavior",
        "Prohibition of cheating in contests and assessments",
        "No sharing of solutions during active contests",
        "Respect intellectual property and copyrights",
        "Report violations through proper channels"
      ]
    },
    {
      title: "Premium Services",
      icon: <FaCrown />,
      content: `Premium subscriptions provide access to additional features and content. Billing is processed monthly or annually based on your chosen plan. Cancellations take effect at the end of the current billing cycle.`,
      details: [
        "Access to premium problems and advanced features",
        "Monthly or annual billing cycles available",
        "Automatic renewal unless cancelled",
        "Cancellation takes effect at end of billing period",
        "No refunds for partial months unless required by law"
      ]
    },
    {
      title: "Intellectual Property",
      icon: <FaBalanceScale />,
      content: `UPCODE owns all rights to the platform, including problems, solutions, and educational content. Users retain ownership of their original code submissions but grant us license to use them for platform operations.`,
      details: [
        "UPCODE retains all platform intellectual property rights",
        "Users own their original code and submissions",
        "Limited license granted for platform functionality",
        "Respect for third-party intellectual property required",
        "DMCA compliance for copyright issues"
      ]
    },
    {
      title: "Service Availability",
      icon: <FaGavel />,
      content: `While we strive for maximum uptime, UPCODE is provided "as is" without warranties. We reserve the right to modify, suspend, or discontinue services with reasonable notice.`,
      details: [
        "Service provided on an 'as is' basis",
        "No guarantee of uninterrupted service availability",
        "Regular maintenance windows may cause temporary outages",
        "Right to modify or discontinue features with notice",
        "Users responsible for backing up their own data"
      ]
    }
  ]

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-16"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-8 py-3 rounded-full border border theme-border mb-8"
            >
              <FaGavel className="theme-accent text-2xl animate-pulse" />
              <span className="theme-text-secondary font-semibold text-lg">Legal Agreement</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 font-mono"
            >
              Terms of Service
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Please read these terms carefully before using UPCODE. By using our platform, you agree to be bound by these terms and conditions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-gray-400 text-sm mt-4"
            >
              Last updated: January 2025 • Effective Date: January 1, 2025
            </motion.div>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="container mx-auto px-6 mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/30">
              <div className="flex items-start gap-4">
                <FaExclamationTriangle className="text-orange-400 text-2xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Important Legal Notice</h3>
                  <p className="text-gray-300 leading-relaxed">
                    These terms constitute a legally binding agreement. If you do not agree to these terms, please do not use UPCODE. 
                    For questions about these terms, contact our legal team at <a href="mailto:legal@upcode.dev" className="text-orange-400 hover:text-orange-300">legal@upcode.dev</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="container mx-auto px-6 pb-20">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                id={`section-${index}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border theme-border hover:border-purple-400/40 transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-3">{section.title}</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">{section.content}</p>
                  </div>
                </div>

                <div className="theme-surface-elevated/50 rounded-xl p-6 ml-16">
                  <h4 className="theme-text-secondary font-semibold mb-4">Key Requirements:</h4>
                  <ul className="space-y-2">
                    {section.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 border border theme-border">
              <div className="text-center">
                <FaBalanceScale className="text-4xl theme-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Our legal team is here to help clarify any questions you may have about these Terms of Service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <a
                    href="mailto:legal@upcode.dev"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Contact Legal Team
                  </a>
                  <Link
                    href="/help-support"
                    className="theme-accent hover:theme-text-secondary font-semibold transition-colors"
                  >
                    Visit Help Center →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-8"
          >
            <div className="theme-surface backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
              <p className="text-gray-400 text-sm leading-relaxed text-center">
                <strong>Disclaimer:</strong> These Terms of Service are effective as of the date listed above. 
                UPCODE reserves the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification.
                Your continued use of the platform after such modifications constitutes acceptance of the updated terms.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </div>
    </div>
  )
}
