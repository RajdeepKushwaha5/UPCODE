'use client'
import { useState } from 'react'
import { FaLinkedin, FaGithub, FaTwitter, FaMedium, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCode, FaGraduationCap, FaTrophy, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import BrandCarousel from '../components/BrandCarousel';

const developers = [
  { name: "Rajdeep Singh", designation: "Creator", role: "Frontend and Backend Developer", linkedin: "https://www.linkedin.com/in/rajdeep-singh-b658a833a/", github: "RajdeepKushwaha5" },
];

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterName, setNewsletterName] = useState('')
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
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          name: newsletterName || 'Newsletter Subscriber',
          preferences: {
            contests: true,
            tutorials: true,
            news: true,
          }
        }),
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON response');
      }

      const data = await response.json()

      if (data.success) {
        setNewsletterMessage('Successfully subscribed to newsletter! Check your email for confirmation.')
        setNewsletterSuccess(true)
        setNewsletterEmail('')
        setNewsletterName('')
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
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">

          {/* Hero Section */}
          <div className='flex justify-between items-center max-w-7xl mx-auto mb-32 max-lg:flex-col-reverse max-lg:gap-12 min-h-[80vh] max-lg:min-h-fit'>

            {/* Text Content */}
            <div className='flex flex-col gap-8 items-start max-lg:items-center max-lg:text-center flex-1'>

              {/* Main Heading with Staggered Animation */}
              <div className="space-y-4">
                <div className="overflow-hidden">
                  <h1 className="text-8xl max-lg:text-7xl max-md:text-6xl max-sm:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse font-mono tracking-tight">
                    Think.
                  </h1>
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-8xl max-lg:text-7xl max-md:text-6xl max-sm:text-5xl font-black bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse animation-delay-200 font-mono tracking-tight">
                    Code.
                  </h1>
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-8xl max-lg:text-7xl max-md:text-6xl max-sm:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse animation-delay-500 font-mono tracking-tight">
                    Thrive.
                  </h1>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-xl max-md:text-lg text-gray-300 font-light leading-relaxed max-w-lg animate-fade-in-up animation-delay-1000">
                Master coding challenges, compete in contests, and accelerate your programming journey with
                <span className="text-purple-400 font-semibold"> UPCODE</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-6 max-sm:flex-col max-sm:w-full animate-fade-in-up animation-delay-1500">
                <Link href="/problems" className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <button className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Start Coding 🚀
                  </button>
                </Link>

                <Link href="/learn" className="group">
                  <button className="bg-white/10 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
                    Learn More
                  </button>
                </Link>
              </div>

            </div>

            {/* Logo Section */}
            <div className='flex-1 flex justify-center items-center relative'>

              {/* Floating Animation Container */}
              <div className="relative animate-float">

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 scale-150 animate-pulse"></div>

                {/* Main Logo */}
                <img
                  src='/logo.png'
                  alt='upcode_logo'
                  className='w-96 h-96 max-lg:w-80 max-lg:h-80 max-md:w-72 max-md:h-72 max-sm:w-64 max-sm:h-64 object-contain hover:scale-110 transition-all duration-500 ease-out relative z-10 filter drop-shadow-2xl'
                />

                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-4 h-4 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-8 animate-pulse"></div>
                  <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-pink-400 rounded-full transform -translate-x-1/2 translate-y-8 animate-pulse delay-500"></div>
                  <div className="absolute left-0 top-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-8 -translate-y-1/2 animate-pulse delay-1000"></div>
                  <div className="absolute right-0 top-1/2 w-3 h-3 bg-yellow-400 rounded-full transform translate-x-8 -translate-y-1/2 animate-pulse delay-1500"></div>
                </div>

              </div>
            </div>
          </div>

          {/* Feature Cards Section */}
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 font-mono">
                Explore Features
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Discover powerful tools designed to accelerate your coding journey and enhance your programming skills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Link href="/problems" className="group">
                <FeatureCard
                  title="Problems"
                  description="Dive into a vast array of coding problems to hone your skills and master various algorithms and data structures."
                  icon="🧩"
                  gradient="from-purple-500 to-pink-500"
                />
              </Link>
              <Link href="/contests" className="group">
                <FeatureCard
                  title="Contests"
                  description="Put your skills to the test in our thrilling coding contests. Compete against top programmers and climb the leaderboard to showcase your talent."
                  icon="🏆"
                  gradient="from-blue-500 to-cyan-500"
                />
              </Link>
              <Link href="/interview" className="group">
                <FeatureCard
                  title="Interview Prep"
                  description="Ace your coding interviews with our curated collection of questions and resources tailored to help you succeed."
                  icon="💼"
                  gradient="from-green-500 to-emerald-500"
                />
              </Link>
              <Link href="/news" className="group">
                <FeatureCard
                  title="News"
                  description="Stay updated with the latest industry news, trends, and advancements in the world of technology and software development."
                  icon="📰"
                  gradient="from-orange-500 to-red-500"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Features Section */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
          </div>

          <div className="container mx-auto px-6 py-24 relative z-10">
            {/* Premium Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-2 rounded-full border border-purple-400/30 mb-6">
                <span className="text-2xl animate-pulse">👑</span>
                <span className="text-purple-300 font-medium">Premium Access</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Unlock Your Full Coding Potential
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Get access to exclusive problems, advanced AI solutions, and premium company interview sets.
              </p>
            </div>

            {/* Premium Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 text-center">
                <div className="text-4xl text-purple-400 mb-4">🏆</div>
                <div className="inline-block px-3 py-1 bg-purple-400/20 text-purple-300 text-xs font-semibold rounded-full mb-3">
                  500+ Problems
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Exclusive Premium Problems</h3>
                <p className="text-gray-300 text-sm">Access 500+ extra problems not available to free users</p>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 text-center">
                <div className="text-4xl text-blue-400 mb-4">🏢</div>
                <div className="inline-block px-3 py-1 bg-blue-400/20 text-blue-300 text-xs font-semibold rounded-full mb-3">
                  FAANG Ready
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Company-Specific Sets</h3>
                <p className="text-gray-300 text-sm">Solve problems asked by FAANG and top companies</p>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300 text-center">
                <div className="text-4xl text-pink-400 mb-4">🤖</div>
                <div className="inline-block px-3 py-1 bg-pink-400/20 text-pink-300 text-xs font-semibold rounded-full mb-3">
                  AI Powered
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Advanced AI Hints</h3>
                <p className="text-gray-300 text-sm">Step-by-step guidance and alternative approaches</p>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-300 text-center">
                <div className="text-4xl text-indigo-400 mb-4">📹</div>
                <div className="inline-block px-3 py-1 bg-indigo-400/20 text-indigo-300 text-xs font-semibold rounded-full mb-3">
                  HD Videos
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Video Solutions</h3>
                <p className="text-gray-300 text-sm">Detailed explanations for every premium problem</p>
              </div>
            </div>

            {/* Three-Tier Pricing */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className="bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/50 hover:border-green-400/60 transition-all duration-300 relative">
                <div className="text-center">
                  <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full mb-4">
                    Current Plan
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Free</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-green-400">₹0</span>
                    <span className="text-gray-300">/forever</span>
                  </div>
                  <ul className="space-y-2 mb-6 text-left text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">10 coding problems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">Basic solutions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">Community support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gray-500">✗</span>
                      <span className="text-gray-500">Hard problems</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all duration-300" disabled>
                    Current Plan
                  </button>
                </div>
              </div>

              {/* Monthly Plan */}
              <div className="bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/50 hover:border-purple-400/60 transition-all duration-300 relative">
                <div className="text-center">
                  <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full mb-4">
                    Popular Choice
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Monthly Premium</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-purple-400">₹999</span>
                    <span className="text-gray-300">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 text-left text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">Everything in Free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">500+ premium problems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">AI hints & guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">Video solutions</span>
                    </li>
                  </ul>
                  <Link href="/premium">
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300">
                      Choose Monthly
                    </button>
                  </Link>
                </div>
              </div>

              {/* Annual Plan */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-400/50 relative hover:border-purple-300/70 transition-all duration-300 scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold text-sm">
                    Best Value
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-block px-3 py-1 bg-purple-400/20 text-purple-300 text-xs font-semibold rounded-full mb-4">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Yearly Premium</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-purple-300">₹6,999</span>
                    <span className="text-gray-300">/year</span>
                  </div>
                  <div className="text-green-400 font-semibold mb-6 text-sm">Save 42% • Only ₹583/month</div>
                  
                  <ul className="space-y-2 mb-6 text-left text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">Everything in Monthly</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">Priority support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">1-on-1 mentorship</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-200">Resume review</span>
                    </li>
                  </ul>
                  
                  <Link href="/premium">
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                      Choose Yearly
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Success Stories */}
            <div className="text-center mt-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-green-400">🔒</span>
                <span className="text-gray-300">7-day money-back guarantee</span>
              </div>
              <p className="text-gray-300 mb-6">
                Join thousands of developers who upgraded to premium and landed their dream jobs.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 opacity-70">
                <div className="flex items-center gap-2 text-xl text-gray-300">
                  <span>🌐</span>
                  <span className="font-semibold">Google</span>
                </div>
                <div className="flex items-center gap-2 text-xl text-gray-300">
                  <span>📦</span>
                  <span className="font-semibold">Amazon</span>
                </div>
                <div className="flex items-center gap-2 text-xl text-gray-300">
                  <span>🔷</span>
                  <span className="font-semibold">Microsoft</span>
                </div>
                <div className="flex items-center gap-2 text-xl text-gray-300">
                  <span>🍎</span>
                  <span className="font-semibold">Apple</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-1/4 w-20 h-20 bg-purple-500/10 rounded-full animate-background-drift"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-pink-500/10 rounded-full animate-background-drift animation-delay-500"></div>
            <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-blue-500/10 rounded-full animate-background-drift animation-delay-1000"></div>
            <div className="absolute bottom-10 right-1/3 w-18 h-18 bg-indigo-500/10 rounded-full animate-background-drift animation-delay-1500"></div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-mono">
              Trusted by developers worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              See what our community says about their experience
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Testimonial 1 */}
            <div className="group relative animate-testimonial-float">
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 animate-testimonial-glow">
                <div className="flex items-center mb-6">
                  <div className="w-15 h-15 rounded-full mr-4 border-2 border-purple-400/30 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                    P
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Priya Sharma</h3>
                    <p className="text-gray-400 text-sm">Software Engineer at Google</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic mb-4">
                  "UPCODE helped me land my dream job. The AI assistant and video tutorials made complex algorithms finally click."
                </p>
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative animate-testimonial-drift animation-delay-500">
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 animate-testimonial-glow animation-delay-200">
                <div className="flex items-center mb-6">
                  <div className="w-15 h-15 rounded-full mr-4 border-2 border-purple-400/30 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    R
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Rohit Negi</h3>
                    <p className="text-gray-400 text-sm">Senior Developer at Microsoft</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic mb-4">
                  "The problem categorization and progressive difficulty on UPCODE made my interview prep incredibly efficient."
                </p>
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group relative animate-testimonial-float animation-delay-1000">
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 animate-testimonial-glow animation-delay-500">
                <div className="flex items-center mb-6">
                  <div className="w-15 h-15 rounded-full mr-4 border-2 border-purple-400/30 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Ananya Gupta</h3>
                    <p className="text-gray-400 text-sm">Full Stack Developer at Amazon</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic mb-4">
                  "Best coding platform I've used. UPCODE's community discussions and premium features are worth every penny."
                </p>
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="group relative animate-testimonial-drift animation-delay-1500">
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 animate-testimonial-glow animation-delay-1000">
                <div className="flex items-center mb-6">
                  <div className="w-15 h-15 rounded-full mr-4 border-2 border-purple-400/30 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                    R
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Rahul Gandhi</h3>
                    <p className="text-gray-400 text-sm">Lead Engineer at Netflix</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic mb-4">
                  "The mock interview feature on UPCODE is fantastic. It simulated real interview conditions and boosted my confidence."
                </p>
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="group relative animate-testimonial-float animation-delay-2000">
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 animate-testimonial-glow animation-delay-1500">
                <div className="flex items-center mb-6">
                  <div className="w-15 h-15 rounded-full mr-4 border-2 border-purple-400/30 bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    K
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Kavya Patel</h3>
                    <p className="text-gray-400 text-sm">Software Architect at Apple</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic mb-4">
                  "UPCODE's premium features accelerated my learning exponentially. Video explanations are incredibly detailed."
                </p>
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="group relative animate-testimonial-drift animation-delay-2500">
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 animate-testimonial-glow animation-delay-2000">
                <div className="flex items-center mb-6">
                  <div className="w-15 h-15 rounded-full mr-4 border-2 border-purple-400/30 bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Aditya Tandon</h3>
                    <p className="text-gray-400 text-sm">Senior SDE at Amazon</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic mb-4">
                  "From junior to senior engineer in 18 months. UPCODE's structured learning path made all the difference."
                </p>
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in-up animation-delay-500">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
                50K+
              </div>
              <p className="text-gray-400 mt-2">Active Developers</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-1000">
              <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent font-mono">
                1M+
              </div>
              <p className="text-gray-400 mt-2">Problems Solved</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-1500">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">
                95%
              </div>
              <p className="text-gray-400 mt-2">Interview Success</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-2000">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
                500+
              </div>
              <p className="text-gray-400 mt-2">Companies Hiring</p>
            </div>
          </div>
        </div>

        {/* Brand Carousel Section */}
        <BrandCarousel />

        {/* Creator Section */}
        <div className="container mx-auto px-6 py-16 relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
            Meet The Creator
          </h2>
          <div className="flex flex-col gap-4 md:gap-6 w-full max-w-4xl mx-auto">
            {developers.map((developer) => (
              <DeveloperCard key={developer.name} {...developer} />
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-purple-500/20">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full animate-background-drift"></div>
            <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-pink-500/5 rounded-full animate-background-drift animation-delay-1000"></div>
          </div>

          <div className="relative container mx-auto px-6 py-16">
            <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-12">

              {/* Company Info & Newsletter - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono mb-4">
                    UPCODE
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Master coding challenges, compete in contests, and accelerate your programming journey with the most comprehensive coding platform.
                  </p>
                </div>

                {/* Newsletter Subscription - Horizontal Layout */}
                <div className="relative">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl blur-xl animate-pulse"></div>

                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-testimonial-float flex-shrink-0">
                          <FaEnvelope className="text-white text-2xl" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Stay in the Loop
                          </h4>
                          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            Get exclusive coding challenges, expert tips, and career insights delivered weekly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Newsletter Form - Horizontal Layout */}
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col lg:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full bg-slate-700/50 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 pr-12"
                          disabled={newsletterLoading}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <FaEnvelope className="text-gray-400 text-lg" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={newsletterLoading || !newsletterEmail}
                        className="lg:w-auto w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-pos-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 relative overflow-hidden group whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10">
                          {newsletterLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Subscribing...
                            </span>
                          ) : (
                            'Subscribe Now'
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                      </button>
                    </form>

                    {/* Newsletter Message */}
                    {newsletterMessage && (
                      <div className={`mb-4 p-4 rounded-lg border ${newsletterSuccess
                        ? 'bg-green-600/20 border-green-600/30 text-green-300'
                        : 'bg-red-600/20 border-red-600/30 text-red-300'
                        }`}>
                        <p className="text-sm">{newsletterMessage}</p>
                      </div>
                    )}

                    {/* Features & Stats - Horizontal Layout */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                      {/* Features */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-300">Weekly Challenges</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-200"></div>
                          <span className="text-sm text-gray-300">Expert Tips</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-500"></div>
                          <span className="text-sm text-gray-300">Career Insights</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-1000"></div>
                          <span className="text-sm text-gray-300">No Spam</span>
                        </div>
                      </div>

                      {/* Subscriber Count */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm whitespace-nowrap">
                        <FaUsers className="text-purple-400" />
                        <span>25,000+ developers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <FaCode className="text-purple-400" />
                  Platform
                </h4>
                <ul className="space-y-3">
                  <li><Link href="/problems" className="text-gray-400 hover:text-purple-400 transition-colors">Problems</Link></li>
                  <li><Link href="/contests" className="text-gray-400 hover:text-purple-400 transition-colors">Contests</Link></li>
                  <li><Link href="/courses" className="text-gray-400 hover:text-purple-400 transition-colors">Courses</Link></li>
                  <li><Link href="/interview" className="text-gray-400 hover:text-purple-400 transition-colors">Interview</Link></li>
                  <li><Link href="/learn" className="text-gray-400 hover:text-purple-400 transition-colors">Learn</Link></li>
                  <li><Link href="/profile" className="text-gray-400 hover:text-purple-400 transition-colors">Profile</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <FaGraduationCap className="text-purple-400" />
                  Resources
                </h4>
                <ul className="space-y-3">
                  <li><Link href="/learn" className="text-gray-400 hover:text-purple-400 transition-colors">Docs</Link></li>
                  <li><Link href="/learn" className="text-gray-400 hover:text-purple-400 transition-colors">Tutorials</Link></li>
                  <li><Link href="/news" className="text-gray-400 hover:text-purple-400 transition-colors">Blog</Link></li>
                  <li><Link href="/help-support" className="text-gray-400 hover:text-purple-400 transition-colors">FAQ</Link></li>
                  <li><Link href="/news" className="text-gray-400 hover:text-purple-400 transition-colors">Community</Link></li>
                  <li><Link href="/help-support" className="text-gray-400 hover:text-purple-400 transition-colors">Support</Link></li>
                </ul>
              </div>

              {/* Contact & Social */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <FaUsers className="text-purple-400" />
                  Connect
                </h4>

                {/* Contact Info */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <FaEnvelope className="text-purple-400 flex-shrink-0" />
                    <span>upcode.noreply@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <FaPhone className="text-purple-400 flex-shrink-0" />
                    <span>+91 63764 62331</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <FaMapMarkerAlt className="text-purple-400 flex-shrink-0" />
                    <span>Jaipur, India</span>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h5 className="text-white font-semibold mb-4">Follow Us</h5>
                  <div className="flex gap-3 flex-wrap">
                    <a
                      href="mailto:rajdeepsingh10789@gmail.com"
                      title="Gmail"
                      className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-gray-600 hover:border-red-400 hover:scale-110 transition-all duration-200 group social-hover"
                    >
                      <FaEnvelope className="text-gray-400 group-hover:text-red-400" />
                    </a>
                    <a
                      href="https://x.com/rajdeeptwts"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Twitter/X"
                      className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-gray-600 hover:border-blue-400 hover:scale-110 transition-all duration-200 group social-hover"
                    >
                      <FaTwitter className="text-gray-400 group-hover:text-blue-400" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/rajdeep-singh-b658a833a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-gray-600 hover:border-blue-600 hover:scale-110 transition-all duration-200 group social-hover"
                    >
                      <FaLinkedin className="text-gray-400 group-hover:text-blue-600" />
                    </a>
                    <a
                      href="https://github.com/RajdeepKushwaha5"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                      className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-gray-600 hover:border-gray-300 hover:scale-110 transition-all duration-200 group social-hover"
                    >
                      <FaGithub className="text-gray-400 group-hover:text-gray-300" />
                    </a>
                    <a
                      href="https://medium.com/@rajdeep01"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Medium"
                      className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-gray-600 hover:border-green-400 hover:scale-110 transition-all duration-200 group social-hover"
                    >
                      <FaMedium className="text-gray-400 group-hover:text-green-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-400 text-sm">
                  © 2025 UPCODE. All rights reserved. | Made with ❤️ for developers
                </div>
                <div className="flex gap-6 text-sm">
                  <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</Link>
                  <Link href="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors">Cookie Policy</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function PremiumFeatureCard({ icon, title, subtitle, description, delay }) {
  return (
    <div
      className={`group cursor-pointer animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-800/50 to-indigo-800/50 rounded-3xl p-8 h-full border border-purple-400/30 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/30">

        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-purple-400/10 rounded-full blur-xl -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full blur-lg translate-y-4 -translate-x-4 group-hover:scale-125 transition-transform duration-500"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="text-6xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-bounce">
            {icon}
          </div>

          {/* Title and Subtitle */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-transparent font-space group-hover:scale-105 transition-transform duration-300">
              {title}
            </h3>
            <p className="text-purple-300 font-semibold text-lg group-hover:text-yellow-300 transition-colors duration-300 font-inter">
              {subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 font-inter">
            {description}
          </p>

          {/* Hover Arrow */}
          <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="text-yellow-400 font-semibold flex items-center gap-2">
              Learn More
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>

        {/* Premium Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-purple-500 text-black text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
          PREMIUM
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon, gradient }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 ease-out group-hover:animate-pulse`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-6xl mb-4 animate-bounce">{icon}</div>
        <h2 className="text-2xl font-bold mb-4 text-white font-mono tracking-wide group-hover:scale-110 transition-transform duration-300">
          {title}
        </h2>
        <p className="text-white text-opacity-90 leading-relaxed font-light group-hover:text-opacity-100 transition-all duration-300">
          {description}
        </p>

        {/* Hover Arrow */}
        <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
          <span className="text-white font-semibold">Explore →</span>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
    </div>
  );
}

function DeveloperCard({ name, designation, role, linkedin, github }) {
  return (
    <div className='flex items-center w-full cursor-pointer group hover:ml-[15px] max-md:hover:ml-0 transition-all ease-in'>
      {/* Avatar - Hidden on mobile, responsive sizes */}
      <div className='hidden md:flex rounded-full w-20 h-20 lg:w-28 lg:h-28 p-2 bg-gradient-to-r from-purple-200 to-pink-200 z-10 group-hover:from-purple-400 group-hover:to-pink-400 transition-all ease-in flex-shrink-0'>
        <img src={`https://avatars.githubusercontent.com/${github}`} alt={name} className='w-full h-full object-cover rounded-full border-2 border-white' />
      </div>
      
      {/* Card Content */}
      <div className='flex flex-col md:flex-row flex-grow gap-3 md:gap-0 justify-between items-start md:items-center bg-gradient-to-r from-slate-100 to-gray-100 hover:from-slate-800 hover:to-gray-900 py-4 px-4 md:px-8 lg:px-12 md:ml-[-30px] rounded-xl md:rounded-r-full transition-all ease-in border border-gray-200 hover:border-purple-400/50'>
        
        {/* Mobile Avatar - Only visible on mobile */}
        <div className='flex md:hidden items-center gap-4 w-full'>
          <div className='rounded-full w-16 h-16 p-1 bg-gradient-to-r from-purple-200 to-pink-200 group-hover:from-purple-400 group-hover:to-pink-400 transition-all ease-in flex-shrink-0'>
            <img src={`https://avatars.githubusercontent.com/${github}`} alt={name} className='w-full h-full object-cover rounded-full border-2 border-white' />
          </div>
          <div className='flex-grow'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-white transition-colors">{name}</h3>
              <p className="text-gray-500 text-xs sm:text-sm group-hover:text-gray-400 transition-colors">({designation})</p>
            </div>
            <p className="text-gray-700 text-sm group-hover:text-gray-300 transition-colors mt-1">{role}</p>
          </div>
        </div>

        {/* Desktop Content - Hidden on mobile */}
        <div className='hidden md:flex flex-col'>
          <div className='flex items-center gap-2'>
            <h3 className="text-lg lg:text-xl font-semibold mb-2 group-hover:text-white transition-colors">{name}</h3>
            <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">({designation})</p>
          </div>
          <p className="text-gray-700 text-sm lg:text-base group-hover:text-gray-300 transition-colors">{role}</p>
        </div>
        
        {/* Social Links */}
        <div className='flex gap-3 md:gap-4 lg:gap-5 justify-center md:justify-end w-full md:w-auto'>
          <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-600 hover:to-blue-700 rounded-full p-2 md:p-3 group-hover:from-blue-500 group-hover:to-blue-600 transition-all ease-in transform hover:scale-110">
            <FaLinkedin className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-700 group-hover:text-white hover:text-white transition-colors" />
          </Link>
          <Link href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-700 hover:to-gray-800 rounded-full p-2 md:p-3 group-hover:from-gray-600 group-hover:to-gray-700 transition-all ease-in transform hover:scale-110">
            <FaGithub className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-white hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}
