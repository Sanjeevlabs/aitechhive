'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Team() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            About the Founder
          </h2>
          <p className="text-base md:text-lg text-slate-600">
            Mapping the gap between AI models and enterprise reality
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-10 rounded-2xl shadow-lg"
        >
          <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
            {/* Left Column: Profile picture, name, and LinkedIn link */}
            <div className="flex flex-col items-center space-y-5">
              {/* Profile Image */}
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-md ring-2 ring-white/50">
                <Image 
                  src="/sanjeev-profile.png" 
                  alt="Sanjeev Kumar Singh"
                  width={192}
                  height={192}
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
                  Sanjeev Kumar Singh
                </h3>
                <p className="text-sm text-slate-500 mb-3">Founder</p>
              </div>
              
              <a 
                href="https://www.linkedin.com/in/sanjeevlaughs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>

            {/* Right Column: Text content */}
            <div className="space-y-3 text-slate-700">
              <p className="text-sm md:text-base leading-relaxed">
                Over a decade keeping global banking systems alive — from London to Bengaluru. Then the question shifted: what happens when AI does the monitoring, alerts, automation?
              </p>
              
              <p className="text-sm md:text-base leading-relaxed">
                The gap isn&apos;t algorithms—it&apos;s controls, governance, explainability.
              </p>
              
              <p className="text-sm md:text-base leading-relaxed">
                AITECHHIVE maps that gap publicly through working-notes, prototype stacks, and insights that matter for regulated AI delivery.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
