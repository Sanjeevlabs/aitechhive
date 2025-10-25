'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Team() {
  return (
    <section id="team" className="py-20 px-6 bg-gradient-to-br from-yellow-50/40 via-amber-50/30 to-orange-50/20 relative overflow-hidden">
      {/* Energetic decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-yellow-300/20 to-amber-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Meet the Founder 🚀
          </motion.h2>
          <p className="text-base md:text-lg text-slate-700 font-medium">
            Bridging the gap between AI innovation and enterprise reality—one working note at a time!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-10 rounded-2xl shadow-xl border-2 border-amber-200/50 bg-white/80 backdrop-blur-sm"
        >
          <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
            {/* Left Column: Profile picture, name, and LinkedIn link */}
            <div className="flex flex-col items-center space-y-5">
              {/* Profile Image with energetic border */}
              <motion.div 
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg ring-4 ring-amber-400/50"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src="/sanjeev-profile.png" 
                  alt="Sanjeev Kumar Singh"
                  width={192}
                  height={192}
                  className="object-cover"
                  priority
                />
              </motion.div>
              
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
                  Sanjeev Kumar Singh
                </h3>
                <p className="text-sm font-semibold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-3">
                  Founder & Chief Explorer
                </p>
              </div>
              
              <motion.a 
                href="https://www.linkedin.com/in/sanjeevlaughs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Let&apos;s Connect
              </motion.a>
            </div>

            {/* Right Column: Enthusiastic text content */}
            <div className="space-y-4 text-slate-700">
              <motion.p 
                className="text-sm md:text-base leading-relaxed"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                💡 <strong>The Spark:</strong> A decade of keeping global banking systems alive—from London&apos;s trading floors to Bengaluru&apos;s tech hubs. Then came the game-changing question: <em>&quot;What happens when AI takes over monitoring, alerts, and automation?&quot;</em>
              </motion.p>
              
              <motion.p 
                className="text-sm md:text-base leading-relaxed"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                🎯 <strong>The Mission:</strong> The real challenge isn&apos;t building smarter algorithms—it&apos;s mastering <span className="font-semibold text-amber-700">controls, governance, and explainability</span>. That&apos;s where the magic (and the struggle) happens!
              </motion.p>
              
              <motion.p 
                className="text-sm md:text-base leading-relaxed"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                🚀 <strong>The Journey:</strong> AITECHHIVE is my public lab—documenting every insight, every prototype, every &quot;aha!&quot; moment in deploying AI within regulated environments. It&apos;s raw, real, and built for people who understand that <span className="font-semibold text-amber-700">implementation beats theory</span> every single time.
              </motion.p>

              <motion.div
                className="pt-4 border-t border-amber-200/50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-sm italic text-slate-600">
                  &quot;Let&apos;s turn the complexity of regulated AI into something we can actually ship. Together.&quot; ✨
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
