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
    if (!newsletterEmail) { setNewsletterMessage('Please enter your email address'); setNewsletterSuccess(false); return; }
    if (!newsletterEmail.includes('@')) { setNewsletterMessage('Please enter a valid email address'); setNewsletterSuccess(false); return; }

    setNewsletterLoading(true)
    setNewsletterMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, name: 'Newsletter Subscriber', preferences: { contests: true, tutorials: true, news: true } }),
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
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-5 gap-10 mb-10">

          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <img src="/logo.png" alt="UPCODE" className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold font-space" style={{ color: 'var(--text-primary)' }}>
                UPCODE
              </span>
            </Link>
            <p className="leading-relaxed mb-6 max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
              Master coding challenges, compete in contests, and accelerate your programming journey with the most comprehensive coding platform.
            </p>

            {/* Newsletter */}
            <div className="mb-4">
              <h4 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--border-focus)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-primary)';
                    e.target.style.boxShadow = 'none';
                  }}
                  disabled={newsletterLoading}
                />
                <button
                  type="submit"
                  disabled={newsletterLoading || !newsletterEmail}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap hover:shadow-md active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
                >
                  {newsletterLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white"></div>
                      Subscribing...
                    </span>
                  ) : 'Subscribe'}
                </button>
              </form>

              {newsletterMessage && (
                <div
                  className="mt-2.5 p-2.5 rounded-lg text-xs font-medium"
                  style={{
                    backgroundColor: newsletterSuccess ? 'var(--success-light)' : 'var(--error-light)',
                    color: newsletterSuccess ? 'var(--success)' : 'var(--error)',
                    border: `1px solid ${newsletterSuccess ? 'var(--success)' : 'var(--error)'}20`,
                  }}
                >
                  {newsletterMessage}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/problems-new', label: 'Problems' },
                { href: '/contests', label: 'Contests' },
                { href: '/courses', label: 'Courses' },
                { href: '/interview', label: 'Interview' },
                { href: '/learn', label: 'Learn' },
                { href: '/profile', label: 'Profile' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Resources</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/dsa-visualizer', label: 'DSA Visualizer' },
                { href: '/courses', label: 'Tutorials' },
                { href: '/news', label: 'Blog' },
                { href: '/help-support#faq', label: 'FAQ' },
                { href: '/premium', label: 'Premium' },
                { href: '/help-support', label: 'Support' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Connect</h4>
            <div className="flex gap-2.5 flex-wrap">
              {[
                { href: 'https://github.com/RajdeepKushwaha5', Icon: FaGithub, label: 'GitHub', hover: 'var(--text-primary)' },
                { href: 'mailto:rajdeepsingh10789@gmail.com', Icon: FaEnvelope, label: 'Email', hover: '#ef4444' },
                { href: 'https://www.linkedin.com/in/rajdeep-singh-b658a833a/', Icon: FaLinkedin, label: 'LinkedIn', hover: '#0077b5' },
                { href: 'https://x.com/rajdeeptwts', Icon: FaTwitter, label: 'Twitter', hover: '#1da1f2' },
                { href: 'https://medium.com/@rajdeep01', Icon: FaMedium, label: 'Medium', hover: '#00ab6c' },
              ].map(({ href, Icon, label, hover }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('svg').style.color = hover;
                    e.currentTarget.style.borderColor = 'var(--border-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('svg').style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                  }}
                >
                  <Icon className="w-4 h-4 transition-colors" style={{ color: 'var(--text-secondary)' }} />
                </Link>
              ))}
            </div>

            {/* Status badge */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6" style={{ borderTop: '1px solid var(--divider)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              © 2024 UPCODE. All Rights Reserved.
            </p>
            <div className="flex items-center gap-5 text-xs">
              <Link
                href="/privacy"
                className="transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-tertiary)'}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-tertiary)'}
              >
                Terms of Service
              </Link>
              <div className="flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
                <span>Made with</span>
                <span className="text-red-500">♥</span>
                <span>by</span>
                <Link
                  href='https://github.com/RajdeepKushwaha5'
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
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
