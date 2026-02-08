'use client'
import { useState } from 'react'
import { FaLinkedin, FaGithub, FaPuzzlePiece, FaTrophy, FaBriefcase, FaNewspaper, FaCrown, FaBuilding, FaRobot, FaVideo, FaLock, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';
import BrandCarousel from '../components/BrandCarousel';
import { useTheme } from '../contexts/ThemeContext';

const developers = [
  { name: "Rajdeep Singh", designation: "Creator", role: "Frontend and Backend Developer", linkedin: "https://www.linkedin.com/in/rajdeep-singh-b658a833a/", github: "RajdeepKushwaha5" },
];

export default function Home() {
  const { isDark } = useTheme();
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterName, setNewsletterName] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail) { setNewsletterMessage('Please enter your email address'); setNewsletterSuccess(false); return }
    if (!newsletterEmail.includes('@')) { setNewsletterMessage('Please enter a valid email address'); setNewsletterSuccess(false); return }
    setNewsletterLoading(true); setNewsletterMessage('')
    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, name: newsletterName || 'Newsletter Subscriber', preferences: { contests: true, tutorials: true, news: true } }),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) throw new Error('Server did not return JSON response');
      const data = await response.json()
      if (data.success) { setNewsletterMessage('Successfully subscribed! Check your email for confirmation.'); setNewsletterSuccess(true); setNewsletterEmail(''); setNewsletterName(''); }
      else { setNewsletterMessage(data.message || 'Failed to subscribe'); setNewsletterSuccess(false); }
    } catch (error) { setNewsletterMessage('An error occurred. Please try again later.'); setNewsletterSuccess(false); }
    finally { setNewsletterLoading(false) }
  }

  return (
    <>
      <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>

        {/* Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse"
            style={{ background: isDark ? 'rgba(96, 165, 250, 0.06)' : 'rgba(59, 130, 246, 0.06)' }} />
          <div className="absolute top-3/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse"
            style={{ background: isDark ? 'rgba(34, 211, 238, 0.05)' : 'rgba(6, 182, 212, 0.05)', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse"
            style={{ background: isDark ? 'rgba(99, 102, 241, 0.04)' : 'rgba(99, 102, 241, 0.04)', animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">

          {/* ============ HERO SECTION ============ */}
          <div className='flex justify-between items-center max-w-7xl mx-auto mb-32 max-lg:flex-col-reverse max-lg:gap-12 min-h-[80vh] max-lg:min-h-fit'>
            <div className='flex flex-col gap-8 items-start max-lg:items-center max-lg:text-center flex-1'>
              <div className="space-y-3">
                {[
                  { text: 'Think.', gradient: 'from-blue-500 via-cyan-500 to-teal-500', delay: '' },
                  { text: 'Code.', gradient: 'from-cyan-500 via-blue-500 to-indigo-500', delay: 'animation-delay-200' },
                  { text: 'Thrive.', gradient: 'from-teal-500 via-emerald-500 to-green-500', delay: 'animation-delay-500' },
                ].map(({ text, gradient, delay }) => (
                  <div key={text} className="overflow-hidden">
                    <h1 className={`text-7xl max-lg:text-6xl max-md:text-5xl max-sm:text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-mono tracking-tight animate-fade-in-up ${delay}`}>
                      {text}
                    </h1>
                  </div>
                ))}
              </div>

              <p className="text-lg max-md:text-base font-light leading-relaxed max-w-lg animate-fade-in-up animation-delay-1000"
                style={{ color: 'var(--text-secondary)' }}>
                Master coding challenges, compete in contests, and accelerate your programming journey with
                <span className="font-semibold" style={{ color: 'var(--accent)' }}> UPCODE</span>.
              </p>

              <div className="flex gap-4 max-sm:flex-col max-sm:w-full animate-fade-in-up animation-delay-1500">
                <Link href="/problems">
                  <button className="relative overflow-hidden text-white font-bold py-3.5 px-7 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
                    Start Coding
                  </button>
                </Link>
                <Link href="/learn">
                  <button className="font-semibold py-3.5 px-7 rounded-xl border hover:scale-105 active:scale-95 transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--surface-base)',
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                    Learn More
                  </button>
                </Link>
              </div>
            </div>

            {/* Logo */}
            <div className='flex-1 flex justify-center items-center relative'>
              <div className="relative animate-float">
                <div className="absolute inset-0 rounded-full blur-[80px] opacity-25 scale-150 animate-pulse"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #06b6d4, #10b981)' }} />
                <img src='/logo.png' alt='upcode_logo'
                  className='w-80 h-80 max-lg:w-72 max-lg:h-72 max-md:w-60 max-md:h-60 max-sm:w-52 max-sm:h-52 object-contain hover:scale-110 transition-all duration-500 relative z-10 filter drop-shadow-2xl' />
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-8 animate-pulse shadow-lg shadow-cyan-400/40" />
                  <div className="absolute bottom-0 left-1/2 w-2.5 h-2.5 bg-teal-400 rounded-full -translate-x-1/2 translate-y-8 animate-pulse shadow-lg shadow-teal-400/40" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute left-0 top-1/2 w-2 h-2 bg-blue-400 rounded-full -translate-x-8 -translate-y-1/2 animate-pulse shadow-lg shadow-blue-400/40" style={{ animationDelay: '1s' }} />
                  <div className="absolute right-0 top-1/2 w-2.5 h-2.5 bg-emerald-400 rounded-full translate-x-8 -translate-y-1/2 animate-pulse shadow-lg shadow-emerald-400/40" style={{ animationDelay: '1.5s' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ============ FEATURES SECTION ============ */}
          <div className="py-16 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent mb-4 font-mono">
                Explore Features
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Discover powerful tools designed to accelerate your coding journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {[
                { href: '/problems', title: 'Problems', desc: 'Dive into coding problems to master algorithms and data structures.', Icon: FaPuzzlePiece, gradient: 'from-blue-500 via-indigo-500 to-purple-500' },
                { href: '/contests', title: 'Contests', desc: 'Compete against top programmers and climb the leaderboard.', Icon: FaTrophy, gradient: 'from-cyan-500 via-sky-500 to-blue-500' },
                { href: '/interview', title: 'Interview Prep', desc: 'Ace coding interviews with curated questions and resources.', Icon: FaBriefcase, gradient: 'from-emerald-500 via-green-500 to-teal-500' },
                { href: '/news', title: 'News', desc: 'Stay updated with the latest industry trends and tech news.', Icon: FaNewspaper, gradient: 'from-orange-500 via-amber-500 to-red-500' },
              ].map(({ href, title, desc, Icon, gradient }) => (
                <Link key={href} href={href} className="group">
                  <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-400`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="text-white text-2xl" />
                      </div>
                      <h2 className="text-2xl font-bold mb-3 text-white font-mono tracking-wide">{title}</h2>
                      <p className="text-white/90 leading-relaxed text-sm">{desc}</p>
                      <div className="mt-5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-white font-semibold text-sm">Explore →</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ============ PREMIUM SECTION ============ */}
        <div className="relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-[80px] animate-pulse"
              style={{ background: isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)' }} />
            <div className="absolute top-40 right-10 w-72 h-72 rounded-full blur-[80px] animate-pulse"
              style={{ background: isDark ? 'rgba(34, 211, 238, 0.12)' : 'rgba(6, 182, 212, 0.08)', animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-6 py-24 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
                style={{
                  background: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid var(--border-primary)',
                }}>
                <span className="text-xl animate-pulse" style={{ color: 'var(--accent)' }}><FaCrown className="inline" /></span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Premium Access</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Unlock Your Full Coding Potential
              </h2>
              <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Get access to exclusive problems, advanced AI solutions, and premium company interview sets.
              </p>
            </div>

            {/* Premium Benefits */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { Icon: FaTrophy, badge: '500+ Problems', title: 'Exclusive Premium Problems', desc: 'Access 500+ extra problems not available to free users', accent: 'var(--accent)' },
                { Icon: FaBuilding, badge: 'FAANG Ready', title: 'Company-Specific Sets', desc: 'Solve problems asked by FAANG and top companies', accent: '#3b82f6' },
                { Icon: FaRobot, badge: 'AI Powered', title: 'Advanced AI Hints', desc: 'Step-by-step guidance and alternative approaches', accent: '#10b981' },
                { Icon: FaVideo, badge: 'HD Videos', title: 'Video Solutions', desc: 'Detailed explanations for every premium problem', accent: '#8b5cf6' },
              ].map(({ Icon, badge, title, desc, accent }) => (
                <div key={title} className="p-6 rounded-xl hover:scale-[1.03] transition-all duration-300 group"
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = accent + '60'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                >
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: accent + '15' }}>
                      <Icon className="text-2xl" style={{ color: accent }} />
                    </div>
                    <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ backgroundColor: accent + '15', color: accent }}>
                      {badge}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
              {/* Free */}
              <PricingCard
                plan="Free"
                price="₹0"
                period="/forever"
                badgeText="Current Plan"
                badgeColor="var(--success)"
                features={['10 coding problems', 'Basic solutions', 'Community support']}
                disabledFeatures={['Hard problems']}
                ctaText="Current Plan"
                ctaDisabled
                isDark={isDark}
              />
              {/* Monthly */}
              <PricingCard
                plan="Monthly Premium"
                price="₹999"
                period="/month"
                badgeText="Popular Choice"
                badgeColor="var(--accent)"
                features={['Everything in Free', '500+ premium problems', 'AI hints & guidance', 'Video solutions']}
                ctaText="Choose Monthly"
                ctaHref="/premium"
                isDark={isDark}
              />
              {/* Yearly */}
              <PricingCard
                plan="Yearly Premium"
                price="₹6,999"
                period="/year"
                badgeText="Most Popular"
                badgeColor="#06b6d4"
                features={['Everything in Monthly', 'Priority support', '1-on-1 mentorship', 'Resume review']}
                ctaText="Choose Yearly"
                ctaHref="/premium"
                highlighted
                savings="Save 42% • Only ₹583/month"
                isDark={isDark}
              />
            </div>

            {/* Trust */}
            <div className="text-center mt-14">
              <div className="flex items-center justify-center gap-3 mb-3">
                <FaShieldAlt style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>7-day money-back guarantee</span>
              </div>
              <p className="mb-5" style={{ color: 'var(--text-secondary)' }}>
                Join thousands of developers who upgraded to premium and landed their dream jobs.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
                {['Google', 'Amazon', 'Microsoft', 'Apple'].map(name => (
                  <div key={name} className="flex items-center gap-2 text-lg" style={{ color: 'var(--text-secondary)' }}>
                    <img src={`/${name.toLowerCase()}.svg`} alt={name} className="w-5 h-5" />
                    <span className="font-semibold">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============ TESTIMONIALS ============ */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`absolute w-${12 + i * 4} h-${12 + i * 4} rounded-full animate-background-drift animation-delay-${i * 500}`}
                style={{
                  background: isDark ? 'rgba(96, 165, 250, 0.04)' : 'rgba(59, 130, 246, 0.04)',
                  top: `${i * 20}%`, left: `${25 + i * 10}%`,
                }} />
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent font-mono">
              Trusted by developers worldwide
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light" style={{ color: 'var(--text-secondary)' }}>
              See what our community says about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              { name: 'Priya Sharma', role: 'Software Engineer at Google', text: '"UPCODE helped me land my dream job. The AI assistant and video tutorials made complex algorithms finally click."', initial: 'P', bg: 'var(--accent)' },
              { name: 'Rohit Negi', role: 'Senior Developer at Microsoft', text: '"The problem categorization and progressive difficulty on UPCODE made my interview prep incredibly efficient."', initial: 'R', bg: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
              { name: 'Ananya Gupta', role: 'Full Stack Developer at Amazon', text: '"Best coding platform I\'ve used. UPCODE\'s community discussions and premium features are worth every penny."', initial: 'A', bg: 'linear-gradient(135deg, #10b981, #059669)' },
              { name: 'Rahul Gandhi', role: 'Lead Engineer at Netflix', text: '"The mock interview feature on UPCODE is fantastic. It simulated real interview conditions and boosted my confidence."', initial: 'R', bg: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
              { name: 'Kavya Patel', role: 'Software Architect at Apple', text: '"UPCODE\'s premium features accelerated my learning exponentially. Video explanations are incredibly detailed."', initial: 'K', bg: '#0891b2' },
              { name: 'Aditya Tandon', role: 'Senior SDE at Amazon', text: '"From junior to senior engineer in 18 months. UPCODE\'s structured learning path made all the difference."', initial: 'A', bg: 'linear-gradient(135deg, #6366f1, #3b82f6)' },
            ].map(({ name, role, text, initial, bg }, idx) => (
              <div key={name} className={`group relative ${idx % 2 === 0 ? 'animate-testimonial-float' : 'animate-testimonial-drift'}`}
                style={{ animationDelay: `${idx * 200}ms` }}>
                <div className="relative rounded-2xl p-7 transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                >
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ background: bg }}>
                      {initial}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{name}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{role}</p>
                    </div>
                  </div>
                  <p className="leading-relaxed italic text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                  <div className="flex text-amber-400 text-sm">{"★".repeat(5)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {[
              { value: '50K+', label: 'Active Developers', gradient: 'from-blue-500 to-cyan-500' },
              { value: '1M+', label: 'Problems Solved', gradient: 'from-cyan-500 to-blue-500' },
              { value: '95%', label: 'Interview Success', gradient: 'from-blue-500 to-teal-500' },
              { value: '500+', label: 'Companies Hiring', gradient: 'from-teal-500 to-emerald-500' },
            ].map(({ value, label, gradient }, idx) => (
              <div key={label} className={`text-center animate-fade-in-up`} style={{ animationDelay: `${500 + idx * 200}ms` }}>
                <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-mono`}>
                  {value}
                </div>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Carousel */}
        <BrandCarousel />

        {/* ============ CREATOR SECTION ============ */}
        <div className="container mx-auto px-6 py-16 relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-mono">
            Meet The Creator
          </h2>
          <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
            {developers.map((dev) => (
              <DeveloperCard key={dev.name} {...dev} isDark={isDark} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

/* ============ PRICING CARD ============ */
function PricingCard({ plan, price, period, badgeText, badgeColor, features, disabledFeatures = [], ctaText, ctaHref, ctaDisabled, highlighted, savings, isDark }) {
  const Wrapper = ctaHref ? Link : 'div';
  return (
    <div className={`relative p-6 rounded-2xl transition-all duration-300 ${highlighted ? 'scale-[1.03] z-10' : 'hover:scale-[1.01]'}`}
      style={{
        backgroundColor: highlighted
          ? (isDark ? 'rgba(96, 165, 250, 0.05)' : 'rgba(59, 130, 246, 0.03)')
          : 'var(--surface-base)',
        border: highlighted ? `2px solid ${badgeColor}50` : '1px solid var(--border-primary)',
        boxShadow: highlighted ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      }}>
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <div className="text-white px-5 py-1.5 rounded-full font-bold text-xs shadow-md"
            style={{ background: 'linear-gradient(135deg, var(--accent), #06b6d4)' }}>
            Best Value
          </div>
        </div>
      )}
      <div className="text-center">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ backgroundColor: badgeColor + '15', color: badgeColor }}>
          {badgeText}
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{plan}</h3>
        <div className="mb-2">
          <span className="text-3xl font-bold" style={{ color: badgeColor }}>{price}</span>
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{period}</span>
        </div>
        {savings && <div className="text-xs font-semibold mb-4" style={{ color: 'var(--success)' }}>{savings}</div>}
        <ul className="space-y-2 mb-6 text-left text-sm">
          {features.map(f => (
            <li key={f} className="flex items-center gap-2">
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
            </li>
          ))}
          {disabledFeatures.map(f => (
            <li key={f} className="flex items-center gap-2">
              <span style={{ color: 'var(--text-disabled)' }}>✗</span>
              <span style={{ color: 'var(--text-disabled)' }}>{f}</span>
            </li>
          ))}
        </ul>
        {ctaDisabled ? (
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-default"
            style={{ backgroundColor: 'var(--success)', opacity: 0.7 }} disabled>
            {ctaText}
          </button>
        ) : (
          <Link href={ctaHref || '#'}>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
              {ctaText}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ============ DEVELOPER CARD ============ */
function DeveloperCard({ name, designation, role, linkedin, github, isDark }) {
  return (
    <div className='flex items-center w-full cursor-pointer group hover:ml-[15px] max-md:hover:ml-0 transition-all ease-in'>
      <div className='hidden md:flex rounded-full w-20 h-20 lg:w-28 lg:h-28 p-2 z-10 transition-all ease-in flex-shrink-0'
        style={{ background: 'linear-gradient(135deg, var(--accent-light), rgba(6, 182, 212, 0.3))' }}>
        <img src={`https://avatars.githubusercontent.com/${github}`} alt={name} className='w-full h-full object-cover rounded-full' style={{ border: '2px solid var(--surface-base)' }} />
      </div>
      <div className='flex flex-col md:flex-row flex-grow gap-3 md:gap-0 justify-between items-start md:items-center py-4 px-4 md:px-8 lg:px-12 md:ml-[-30px] rounded-xl md:rounded-r-full transition-all ease-in'
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-raised)';
          e.currentTarget.style.borderColor = 'var(--border-secondary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-base)';
          e.currentTarget.style.borderColor = 'var(--border-primary)';
        }}
      >
        <div className='flex md:hidden items-center gap-4 w-full'>
          <div className='rounded-full w-16 h-16 p-1 flex-shrink-0'
            style={{ background: 'linear-gradient(135deg, var(--accent-light), rgba(6, 182, 212, 0.3))' }}>
            <img src={`https://avatars.githubusercontent.com/${github}`} alt={name} className='w-full h-full object-cover rounded-full' style={{ border: '2px solid var(--surface-base)' }} />
          </div>
          <div className='flex-grow'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
              <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</h3>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-tertiary)' }}>({designation})</p>
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{role}</p>
          </div>
        </div>
        <div className='hidden md:flex flex-col'>
          <div className='flex items-center gap-2'>
            <h3 className="text-lg lg:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>({designation})</p>
          </div>
          <p className="text-sm lg:text-base" style={{ color: 'var(--text-secondary)' }}>{role}</p>
        </div>
        <div className='flex gap-3 md:gap-4 justify-center md:justify-end w-full md:w-auto'>
          <Link href={linkedin} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'linear-gradient(135deg, var(--accent-light), var(--accent-subtle))' }}
          >
            <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--accent)' }} />
          </Link>
          <Link href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-primary)' }}
          >
            <FaGithub className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--text-primary)' }} />
          </Link>
        </div>
      </div>
    </div>
  )
}
