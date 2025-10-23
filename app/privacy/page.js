'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt, FaLock, FaUserShield, FaEye, FaCookieBite, FaEnvelope, FaArrowUp } from 'react-icons/fa'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
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
      title: "Information We Collect",
      icon: <FaUserShield />,
      content: `We collect information you provide directly to us, such as when you create an account, participate in interactive features, or communicate with us. This includes your name, email address, profile information, and any content you submit.`,
      details: [
        "Account registration information (name, email, username)",
        "Profile data and preferences",
        "Code submissions and solutions",
        "Contest participation data",
        "Communication records and support tickets"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <FaEye />,
      content: `We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and personalize your experience on UPCODE.`,
      details: [
        "Provide and maintain our coding platform services",
        "Process contest entries and calculate rankings",
        "Send important updates and notifications",
        "Improve our algorithms and user experience",
        "Provide customer support and respond to inquiries"
      ]
    },
    {
      title: "Data Security",
      icon: <FaLock />,
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.`,
      details: [
        "Encryption of data in transit and at rest",
        "Regular security audits and monitoring",
        "Access controls and authentication measures",
        "Secure database storage with MongoDB Atlas",
        "Regular backup and disaster recovery procedures"
      ]
    },
    {
      title: "Cookies and Tracking",
      icon: <FaCookieBite />,
      content: `We use cookies and similar tracking technologies to collect information about your browsing activities and to provide personalized experiences.`,
      details: [
        "Essential cookies for authentication and security",
        "Performance cookies to analyze usage patterns",
        "Functional cookies to remember your preferences",
        "Third-party analytics cookies (Google Analytics)",
        "Social media integration cookies"
      ]
    },
    {
      title: "Data Sharing",
      icon: <FaShieldAlt />,
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.`,
      details: [
        "Service providers who assist in our operations",
        "Legal compliance when required by law",
        "Protection of rights and safety of users",
        "Business transfers in case of merger or acquisition",
        "Aggregated, non-personal data for research"
      ]
    },
    {
      title: "Your Rights",
      icon: <FaUserShield />,
      content: `You have certain rights regarding your personal information, including the right to access, update, delete, and control how we use your data.`,
      details: [
        "Access and download your personal data",
        "Update or correct your information",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Data portability to other services"
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
              <FaShieldAlt className="theme-accent text-2xl animate-pulse" />
              <span className="theme-text-secondary font-semibold text-lg">Privacy & Security</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 font-mono"
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Your privacy is important to us. This policy explains how UPCODE collects, uses, and protects your personal information.
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

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="container mx-auto px-6 mb-16"
        >
          <div className="theme-surface/80 backdrop-blur-sm rounded-2xl p-6 border border theme-border">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaEye className="theme-accent" />
              Quick Navigation
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sections.map((section, index) => (
                <motion.a
                  key={section.title}
                  href={`#section-${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-gray-300 hover:theme-accent transition-colors p-2 rounded-lg hover:bg-purple-500/10"
                >
                  {section.icon}
                  <span className="text-sm">{section.title}</span>
                </motion.a>
              ))}
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
                  <h4 className="theme-text-secondary font-semibold mb-4">Key Points:</h4>
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
                <FaEnvelope className="text-4xl theme-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Questions About Your Privacy?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <a
                    href="mailto:privacy@upcode.dev"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Contact Privacy Team
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
