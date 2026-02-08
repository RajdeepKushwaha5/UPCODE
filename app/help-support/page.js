'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaHeadset, FaEnvelope, FaPhone, FaClock, FaBook, FaUsers, FaLightbulb } from 'react-icons/fa'

const HelpSupport = () => {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "How do I get started with UPCODE?",
      answer: "Getting started is easy! First, create an account by clicking the 'Register' button. Once registered, you can explore our problems, take courses, participate in contests, and track your progress on the dashboard. We recommend starting with our beginner-friendly problems to get familiar with the platform."
    },
    {
      question: "Is UPCODE free to use?",
      answer: "Yes! UPCODE offers a comprehensive free tier with access to problems, contests, and basic features. We also offer premium subscriptions with additional benefits like advanced analytics, exclusive contests, and priority support."
    },
    {
      question: "How does the contest system work?",
      answer: "Our contests are timed coding competitions where you solve problems to earn points. Contests vary in duration (1-3 hours typically) and difficulty. You can participate in live contests or practice with past contest problems. Rankings are based on solve time and problem difficulty."
    },
    {
      question: "Can I submit solutions in multiple programming languages?",
      answer: "Absolutely! We support multiple programming languages including Python, Java, C++, JavaScript, C#, Go, Rust, and more. You can choose your preferred language for each problem submission."
    },
    {
      question: "How is my code evaluated?",
      answer: "Your code is automatically tested against multiple test cases including edge cases. We check for correctness, time complexity, and space complexity. You'll receive immediate feedback on your submission with details about passed/failed test cases."
    },
    {
      question: "What is the DSA Visualizer?",
      answer: "Our DSA Visualizer is an interactive tool that helps you understand data structures and algorithms through visual animations. You can see step-by-step execution of sorting algorithms, search operations, stack/queue operations, and more."
    },
    {
      question: "How do I track my progress?",
      answer: "Your dashboard provides comprehensive progress tracking including problems solved, contest performance, skill ratings, and learning streaks. You can also view detailed analytics of your coding patterns and areas for improvement."
    },
    {
      question: "Can I get hints for problems?",
      answer: "Yes! Most problems include progressive hints that you can unlock if you're stuck. We also have discussion forums where you can get help from the community while avoiding direct spoilers."
    },
    {
      question: "What should I do if I encounter a bug?",
      answer: "If you find a bug, please report it through our contact form below or email us directly. Include details about what you were doing when the bug occurred, your browser/device information, and any error messages you saw."
    },
    {
      question: "How can I contribute to UPCODE?",
      answer: "We welcome contributions! You can suggest new problems, report bugs, participate in our community discussions, or reach out to us about collaboration opportunities. Check our GitHub repository for technical contributions."
    },
    {
      question: "Is there a mobile app?",
      answer: "Currently, UPCODE is available as a responsive web application that works great on mobile browsers. We're working on dedicated mobile apps for iOS and Android - stay tuned for updates!"
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link via email. If you don't receive the email, check your spam folder or contact support."
    }
  ]

  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaHeadset className="text-4xl theme-accent" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Help & Support
            </h1>
          </div>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Find answers to common questions, get support, and learn how to make the most of UPCODE
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2" id="faq">
            <div className="theme-surface rounded-2xl p-8 border" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center gap-3 mb-8">
                <FaQuestionCircle className="text-2xl theme-accent" />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-raised)' }}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between transition-all duration-300" style={{ color: 'var(--text-primary)' }}
                    >
                      <span className="font-medium text-lg">{faq.question}</span>
                      {openFaq === index ? (
                        <FaChevronUp className="theme-accent transition-transform duration-300" />
                      ) : (
                        <FaChevronDown style={{ color: 'var(--text-secondary)' }} className="transition-transform duration-300" />
                      )}
                    </button>

                    {openFaq === index && (
                      <div className="px-6 pb-4 animate-fadeIn">
                        <div className="border-t pt-4" style={{ borderColor: 'var(--border-primary)' }}>
                          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="theme-surface rounded-2xl p-6 border" style={{ borderColor: 'var(--border-primary)' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FaHeadset className="theme-accent" />
                Contact Support
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaEnvelope className="theme-accent mt-1" />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Email Support</p>
                    <Link
                      href="mailto:support@upcode.com"
                      className="hover:theme-accent transition-colors" style={{ color: 'var(--text-secondary)' }}>
                      support@upcode.com
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaClock className="theme-accent mt-1" />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Response Time</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="theme-surface rounded-2xl p-6 border" style={{ borderColor: 'var(--border-primary)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>

              <div className="space-y-4">
                <Link
                  href="/register"
                  className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-center font-medium"
                >
                  Create Account
                </Link>

                <Link
                  href="/problems"
                  className="block w-full px-4 py-3 rounded-lg transition-all duration-300 text-center font-medium" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-primary)' }}
                >
                  Browse Problems
                </Link>

                <Link
                  href="/dsa-visualizer"
                  className="block w-full px-4 py-3 rounded-lg transition-all duration-300 text-center font-medium" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-primary)' }}
                >
                  DSA Visualizer
                </Link>

                <Link
                  href="/dashboard"
                  className="block w-full px-4 py-3 rounded-lg transition-all duration-300 text-center font-medium" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-primary)' }}
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div className="theme-surface rounded-2xl p-6 border" style={{ borderColor: 'var(--border-primary)' }} id="contact">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send us a Message</h3>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                  >
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                    placeholder="Describe your issue or question..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="theme-surface rounded-xl p-6 border text-center" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 text-white text-xl">
              <FaBook />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Documentation</h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Comprehensive guides and tutorials</p>
            <Link
              href="/courses"
              className="theme-accent hover:theme-text-secondary transition-colors font-medium"
            >
              View Courses →
            </Link>
          </div>

          <div className="theme-surface rounded-xl p-6 border text-center" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-white text-xl">
              <FaUsers />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Community</h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Connect with other developers</p>
            <Link
              href="/contests"
              className="theme-accent hover:theme-text-secondary transition-colors font-medium"
            >
              Join Contests →
            </Link>
          </div>

          <div className="theme-surface rounded-xl p-6 border text-center" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4 text-white text-xl">
              <FaLightbulb />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Tips & Tricks</h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Improve your coding skills</p>
            <Link
              href="/interview"
              className="theme-accent hover:theme-text-secondary transition-colors font-medium"
            >
              Interview Prep →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpSupport
