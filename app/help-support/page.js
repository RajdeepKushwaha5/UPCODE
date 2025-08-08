'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaHeadset, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaHeadset className="text-4xl text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Help & Support
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Find answers to common questions, get support, and learn how to make the most of UPCODE
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2" id="faq">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-8">
                <FaQuestionCircle className="text-2xl text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-600/50 rounded-xl overflow-hidden bg-gray-700/30"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-600/30 transition-all duration-300"
                    >
                      <span className="text-white font-medium text-lg">{faq.question}</span>
                      {openFaq === index ? (
                        <FaChevronUp className="text-purple-400 transition-transform duration-300" />
                      ) : (
                        <FaChevronDown className="text-gray-400 transition-transform duration-300" />
                      )}
                    </button>

                    {openFaq === index && (
                      <div className="px-6 pb-4 animate-fadeIn">
                        <div className="border-t border-gray-600/30 pt-4">
                          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
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
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaHeadset className="text-purple-400" />
                Contact Support
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-purple-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Email Support</p>
                    <Link
                      href="mailto:support@upcode.com"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      support@upcode.com
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaClock className="text-purple-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Response Time</p>
                    <p className="text-gray-400">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>

              <div className="space-y-4">
                <Link
                  href="/register"
                  className="block w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 text-center font-medium"
                >
                  Create Account
                </Link>

                <Link
                  href="/problems"
                  className="block w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 text-center font-medium"
                >
                  Browse Problems
                </Link>

                <Link
                  href="/dsa-visualizer"
                  className="block w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 text-center font-medium"
                >
                  DSA Visualizer
                </Link>

                <Link
                  href="/dashboard"
                  className="block w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 text-center font-medium"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700" id="contact">
              <h3 className="text-xl font-bold text-white mb-6">Send us a Message</h3>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Describe your issue or question..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
            <p className="text-gray-400 mb-4">Comprehensive guides and tutorials</p>
            <Link
              href="/courses"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              View Courses →
            </Link>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-lg font-bold text-white mb-2">Community</h3>
            <p className="text-gray-400 mb-4">Connect with other developers</p>
            <Link
              href="/contests"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Join Contests →
            </Link>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl mb-4">💡</div>
            <h3 className="text-lg font-bold text-white mb-2">Tips & Tricks</h3>
            <p className="text-gray-400 mb-4">Improve your coding skills</p>
            <Link
              href="/interview"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
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
