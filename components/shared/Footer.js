'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaGithub, FaEnvelope, FaLinkedin, FaTwitter, FaMedium } from 'react-icons/fa';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()

    if (!newsletterEmail) {
      setNewsletterMessage('Please enter your email address')
      setNewsletterSuccess(false)
      return
    }

    if (!newsletterEmail.includes('@')) {
      setNewsletterMessage('Please enter a valid email address')
      setNewsletterSuccess(false)
      return
    }

    setNewsletterLoading(true)
    setNewsletterMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          name: 'Newsletter Subscriber',
          preferences: {
            contests: true,
            tutorials: true,
            news: true,
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        setNewsletterMessage('Successfully subscribed! Check your email for confirmation.')
        setNewsletterSuccess(true)
        setNewsletterEmail('')
      } else {
        setNewsletterMessage(data.message || 'Failed to subscribe to newsletter')
        setNewsletterSuccess(false)
      }
    } catch (error) {
      setNewsletterMessage('An error occurred. Please try again later.')
      setNewsletterSuccess(false)
      console.error('Newsletter subscription error:', error)
    } finally {
      setNewsletterLoading(false)
    }
  }

  return (
    <footer className="theme-surface border-t theme-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-5 gap-8 mb-8">

          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black theme-text font-space mb-4">
              UPCODE
            </h3>
            <p className="theme-text-secondary leading-relaxed mb-6 max-w-md">
              Master coding challenges, compete in contests, and accelerate your programming journey with the most comprehensive coding platform.
            </p>

            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h4 className="theme-text font-semibold mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full theme-surface-elevated border theme-border rounded-lg px-4 py-3 theme-text placeholder:theme-text-tertiary focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    disabled={newsletterLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterLoading || !newsletterEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {newsletterLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>

              {/* Newsletter Message */}
              {newsletterMessage && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${newsletterSuccess
                  ? 'bg-green-600/20 border border-green-600/30 text-green-300'
                  : 'bg-red-600/20 border border-red-600/30 text-red-300'
                  }`}>
                  {newsletterMessage}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="theme-text font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/problems-new" className="theme-text-secondary hover:theme-accent transition-colors">Problems</Link></li>
              <li><Link href="/contests" className="theme-text-secondary hover:theme-accent transition-colors">Contests</Link></li>
              <li><Link href="/courses" className="theme-text-secondary hover:theme-accent transition-colors">Courses</Link></li>
              <li><Link href="/interview" className="theme-text-secondary hover:theme-accent transition-colors">Interview</Link></li>
              <li><Link href="/learn" className="theme-text-secondary hover:theme-accent transition-colors">Learn</Link></li>
              <li><Link href="/profile" className="theme-text-secondary hover:theme-accent transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="theme-text font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/dsa-visualizer" className="theme-text-secondary hover:theme-accent transition-colors">DSA Visualizer</Link></li>
              <li><Link href="/courses" className="theme-text-secondary hover:theme-accent transition-colors">Tutorials</Link></li>
              <li><Link href="/news" className="theme-text-secondary hover:theme-accent transition-colors">Blog</Link></li>
              <li><Link href="/help-support#faq" className="theme-text-secondary hover:theme-accent transition-colors">FAQ</Link></li>
              <li><Link href="/premium" className="theme-text-secondary hover:theme-accent transition-colors">Premium</Link></li>
              <li><Link href="/help-support" className="theme-text-secondary hover:theme-accent transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="theme-text font-semibold mb-4">Connect</h4>
            <div className="flex gap-3 flex-wrap">
              <Link href='https://github.com/RajdeepKushwaha5' target="_blank" rel="noopener noreferrer" title="GitHub">
                <FaGithub className="w-6 h-6 theme-text-secondary hover:theme-text transition-colors cursor-pointer" />
              </Link>
              <Link href='mailto:rajdeepsingh10789@gmail.com' title="Gmail">
                <FaEnvelope className="w-6 h-6 theme-text-secondary hover:text-red-500 transition-colors cursor-pointer" />
              </Link>
              <Link href='https://www.linkedin.com/in/rajdeep-singh-b658a833a/' target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <FaLinkedin className="w-6 h-6 theme-text-secondary hover:text-blue-500 transition-colors cursor-pointer" />
              </Link>
              <Link href='https://x.com/rajdeeptwts' target="_blank" rel="noopener noreferrer" title="Twitter/X">
                <FaTwitter className="w-6 h-6 theme-text-secondary hover:text-blue-400 transition-colors cursor-pointer" />
              </Link>
              <Link href='https://medium.com/@rajdeep01' target="_blank" rel="noopener noreferrer" title="Medium">
                <FaMedium className="w-6 h-6 theme-text-secondary hover:text-green-500 transition-colors cursor-pointer" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t theme-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="theme-text-secondary text-sm">
              2024 UPCODE. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="theme-text-secondary hover:theme-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="theme-text-secondary hover:theme-accent transition-colors">
                Terms of Service
              </Link>
              <div className="flex items-center gap-2 theme-text-secondary">
                <span>Made with</span>
                <span className="text-red-500">❤️</span>
                <span>by</span>
                <Link href='https://github.com/RajdeepKushwaha5' target="_blank" rel="noopener noreferrer" className="font-semibold theme-accent hover:underline">
                  RJDP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer