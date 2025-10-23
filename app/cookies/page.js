'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCookieBite, FaCog, FaChartLine, FaShieldAlt, FaToggleOn, FaToggleOff, FaArrowUp, FaInfoCircle } from 'react-icons/fa'
import Link from 'next/link'

export default function CookiePolicyPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, can't be disabled
    analytics: false,
    functional: false,
    marketing: false
  })

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)

    // Load saved preferences from localStorage
    const saved = localStorage.getItem('cookiePreferences')
    if (saved) {
      setCookiePreferences({ ...cookiePreferences, ...JSON.parse(saved) })
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleCookiePreference = (type) => {
    if (type === 'essential') return // Can't disable essential cookies
    
    const newPreferences = {
      ...cookiePreferences,
      [type]: !cookiePreferences[type]
    }
    setCookiePreferences(newPreferences)
    localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences))
  }

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    alert('Cookie preferences saved!')
  }

  const cookieTypes = [
    {
      title: "Essential Cookies",
      icon: <FaShieldAlt />,
      type: "essential",
      required: true,
      description: "These cookies are necessary for the website to function properly. They enable basic functionality like user authentication and security features.",
      examples: [
        "User authentication and login sessions",
        "Security tokens and CSRF protection",
        "Shopping cart and form submission data",
        "Language and region preferences",
        "Platform functionality and navigation"
      ],
      duration: "Session or up to 1 year"
    },
    {
      title: "Analytics Cookies",
      icon: <FaChartLine />,
      type: "analytics",
      required: false,
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      examples: [
        "Google Analytics for usage statistics",
        "Page view tracking and user behavior",
        "Performance monitoring and error tracking",
        "A/B testing and feature usage metrics",
        "Search query and result effectiveness"
      ],
      duration: "Up to 2 years"
    },
    {
      title: "Functional Cookies",
      icon: <FaCog />,
      type: "functional",
      required: false,
      description: "These cookies enhance your experience by remembering your preferences and providing personalized features.",
      examples: [
        "Theme preferences (dark/light mode)",
        "Code editor settings and preferences",
        "Problem difficulty and category filters",
        "Dashboard layout customizations",
        "Notification preferences"
      ],
      duration: "Up to 1 year"
    },
    {
      title: "Marketing Cookies",
      icon: <FaCookieBite />,
      type: "marketing",
      required: false,
      description: "These cookies are used to make advertising messages more relevant to you and track the effectiveness of our marketing campaigns.",
      examples: [
        "Social media integration cookies",
        "Newsletter signup tracking",
        "Referral source identification",
        "Campaign effectiveness measurement",
        "Personalized content recommendations"
      ],
      duration: "Up to 1 year"
    }
  ]

  const thirdPartyCookies = [
    {
      name: "Google Analytics",
      purpose: "Website analytics and performance monitoring",
      cookies: ["_ga", "_ga_*", "_gid", "_gat"],
      privacy: "https://policies.google.com/privacy"
    },
    {
      name: "Google OAuth",
      purpose: "Social login authentication",
      cookies: ["1P_JAR", "CONSENT", "NID"],
      privacy: "https://policies.google.com/privacy"
    },
    {
      name: "GitHub OAuth",
      purpose: "Social login authentication",
      cookies: ["logged_in", "_gh_sess", "user_session"],
      privacy: "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
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
              <FaCookieBite className="theme-accent text-2xl animate-pulse" />
              <span className="theme-text-secondary font-semibold text-lg">Cookie Management</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 font-mono"
            >
              Cookie Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Learn about how UPCODE uses cookies to enhance your experience and provide personalized features.
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

        {/* Cookie Preferences Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="container mx-auto px-6 mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 border border theme-border">
              <div className="text-center mb-8">
                <FaCog className="text-4xl theme-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Manage Your Cookie Preferences</h3>
                <p className="text-gray-300">
                  Control which cookies you want to allow. Essential cookies cannot be disabled as they are required for the website to function properly.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {cookieTypes.map((cookie, index) => (
                  <motion.div
                    key={cookie.type}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    className="theme-surface/80 rounded-xl p-6 border border-slate-600/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="theme-accent text-xl">{cookie.icon}</div>
                        <h4 className="text-lg font-semibold text-white">{cookie.title}</h4>
                        {cookie.required && (
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleCookiePreference(cookie.type)}
                        disabled={cookie.required}
                        className={`text-2xl transition-colors ${
                          cookiePreferences[cookie.type]
                            ? 'text-green-400 hover:text-green-300'
                            : 'text-gray-500 hover:text-gray-400'
                        } ${cookie.required ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                      >
                        {cookiePreferences[cookie.type] ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">{cookie.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={savePreferences}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cookie Types Detail */}
        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-12"
            >
              Types of Cookies We Use
            </motion.h2>

            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={cookie.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border theme-border hover:border-purple-400/40 transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                    {cookie.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{cookie.title}</h3>
                      {cookie.required && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">{cookie.description}</p>
                    <div className="theme-text-secondary text-sm">
                      <strong>Duration:</strong> {cookie.duration}
                    </div>
                  </div>
                </div>

                <div className="theme-surface-elevated/50 rounded-xl p-6">
                  <h4 className="theme-text-secondary font-semibold mb-4">Examples:</h4>
                  <ul className="space-y-2">
                    {cookie.examples.map((example, exampleIndex) => (
                      <motion.li
                        key={exampleIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: exampleIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{example}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8"
            >
              Third-Party Cookies
            </motion.h2>

            <div className="space-y-6">
              {thirdPartyCookies.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="theme-surface/80 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                      <p className="text-gray-300 text-sm mb-3">{service.purpose}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.cookies.map((cookie) => (
                          <span
                            key={cookie}
                            className="bg-purple-500/20 theme-text-secondary text-xs px-2 py-1 rounded"
                          >
                            {cookie}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={service.privacy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="theme-accent hover:theme-text-secondary text-sm flex items-center gap-1"
                    >
                      <FaInfoCircle />
                      Privacy Policy
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 pb-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 border border theme-border">
              <div className="text-center">
                <FaCookieBite className="text-4xl theme-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Questions About Our Cookie Usage?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  If you have questions about our cookie policy or need assistance managing your preferences, we're here to help.
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
          </div>
        </motion.div>

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
