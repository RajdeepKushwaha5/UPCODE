'use client'

import { motion } from 'framer-motion'
import { 
  FaGoogle, 
  FaAmazon, 
  FaMicrosoft, 
  FaApple,
  FaPaypal
} from 'react-icons/fa'
import { 
  SiNetflix, 
  SiMeta, 
  SiInstagram, 
  SiX, 
  SiSalesforce 
} from 'react-icons/si'

const brands = [
  { name: 'Google', icon: <FaGoogle />, color: '#4285F4' },
  { name: 'Netflix', icon: <SiNetflix />, color: '#E50914' },
  { name: 'Meta', icon: <SiMeta />, color: '#1877F2' },
  { name: 'Instagram', icon: <SiInstagram />, color: '#E4405F' },
  { name: 'X', icon: <SiX />, color: '#000000' },
  { name: 'PayPal', icon: <FaPaypal />, color: '#00457C' },
  { name: 'Salesforce', icon: <SiSalesforce />, color: '#00A1E0' },
  { name: 'Amazon', icon: <FaAmazon />, color: '#FF9900' },
  { name: 'Microsoft', icon: <FaMicrosoft />, color: '#00A4EF' },
  { name: 'Apple', icon: <FaApple />, color: '#000000' }
]

// Duplicate brands for seamless looping
const duplicatedBrands = [...brands, ...brands, ...brands]

export default function BrandCarousel() {
  return (
    <section className="py-20 overflow-hidden bg-gradient-to-br from-slate-950/50 via-purple-950/10 to-slate-950/50 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500/5 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full animate-spin-slow"></div>
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-mono">
            Trusted by Developers at
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of developers who are working at top tech companies worldwide
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Gradient Overlays for Smooth Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none"></div>

          {/* Main Carousel */}
          <motion.div
            className="flex gap-8 md:gap-12 lg:gap-16"
            animate={{
              x: [0, -100 * brands.length]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <motion.div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 flex items-center justify-center group-hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 rounded-2xl"></div>
                  
                  {/* Brand Icon */}
                  <div 
                    className="text-4xl md:text-5xl lg:text-6xl text-gray-400 group-hover:text-white transition-all duration-300 relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0))',
                    }}
                  >
                    {brand.icon}
                  </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 bg-clip-border animate-gradient-x"></div>
                  </div>
                </div>

                {/* Brand Name */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="text-center mt-4"
                >
                  <p className="text-sm md:text-base font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
                    {brand.name}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm md:text-base">50,000+ Developers</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-500"></div>
              <span className="text-sm md:text-base">1000+ Companies</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
              <span className="text-sm md:text-base">95% Success Rate</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  )
}
