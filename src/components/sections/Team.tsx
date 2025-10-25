'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            About the Founder
          </h2>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
            Mapping the gap between AI models and enterprise reality
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-3xl shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Column: Profile picture, name, and LinkedIn link */}
            <div className="flex flex-col items-center space-y-6">
              {/* Profile Image */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-glow ring-4 ring-white/50">
                <Image 
                  src="/sanjeev-profile.png" 
                  alt="Sanjeev Kumar Singh"
                  width={256}
                  height={256}
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                  Sanjeev Kumar Singh
                </h3>
                <p className="text-base text-slate-600 mb-4">Founder, Aitechhive</p>
              </div>
              
              <a 
                href="https://www.linkedin.com/in/sanjeevlaughs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-base font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>

            {/* Right Column: Text content */}
            <div className="space-y-4 text-slate-700">
              <p className="text-base md:text-lg leading-relaxed">
                I&apos;m Sanjeev Kumar Singh. I spent over a decade keeping global banking systems alive — from London to Bengaluru. My question shifted: what happens when AI starts to do the monitoring, the alerts, the automation?
              </p>
              
              <p className="text-base md:text-lg leading-relaxed">
                I realised the gap isn&apos;t algorithms—it&apos;s controls, governance, explainability.
              </p>
              
              <p className="text-base md:text-lg leading-relaxed">
                AITECHHIVE exists because I&apos;m mapping that gap publicly. I write working-notes, I build prototype stacks, I surface what actually matters for regulated AI delivery.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
