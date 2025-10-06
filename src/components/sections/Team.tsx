'use client'

import { motion } from 'framer-motion'

export function Team() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Meet the Team
          </h2>
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
            Passionate about making AI accessible to everyone
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-3xl shadow-xl"
        >
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-glow animate-gradient-flow">
                AT
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              AITECHHIVE Team
            </h3>
            <a 
              href="https://www.linkedin.com/in/sanjeevlaughs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-lg font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect on LinkedIn
            </a>
          </div>

          <div className="space-y-6 text-slate-700">
            <p className="text-lg md:text-xl leading-relaxed">
              Hey there! 👋 We're on a mission to demystify AI and make it accessible to everyone. 
              Whether you're a complete beginner or looking to deepen your understanding, we're here 
              to guide you through the fascinating world of artificial intelligence.
            </p>
            
            <p className="text-lg md:text-xl leading-relaxed">
              Every day, we break down complex AI concepts into simple, digestible pieces. Our approach? 
              Think of it as having a friendly conversation over coffee about the latest in AI - no 
              jargon, no overwhelm, just clear explanations that stick.
            </p>
            
            <p className="text-lg md:text-xl leading-relaxed">
              Join our growing community of curious minds who are learning AI together. We're not just 
              building a newsletter; we're building a hive of learners who support each other on this 
              incredible journey.
            </p>

            <div className="pt-6 border-t border-slate-200">
              <p className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                What makes us different?
              </p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <span>Daily, bite-sized lessons that fit into your busy schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <span>Real-world examples that make complex concepts click</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🤝</span>
                  <span>A supportive community that learns and grows together</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
