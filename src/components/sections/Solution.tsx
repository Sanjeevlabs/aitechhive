'use client'

import { motion } from 'framer-motion'
import { LightBulbIcon } from '@heroicons/react/24/outline'

export function Solution() {
  return (
    <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-10 left-20 w-40 h-40 bg-green-100/40 rounded-full blur-3xl animate-parallax-float" />
      <div className="absolute bottom-10 right-20 w-36 h-36 bg-blue-100/40 rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-8 shadow-lg border border-green-200 float-animation"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <LightBulbIcon className="h-8 w-8 text-green-600" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-8 tracking-tight">
            Clarity is Here
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-neutral-600 space-y-8 max-w-4xl mx-auto leading-relaxed font-light"
        >
          <p>
            AITECHHIVE translates complex AI concepts into clear, digestible insights. We start with simple breakdowns that anyone can understand, then offer deep dives for those ready to go further.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="glass-card p-10 rounded-[2rem] shadow-2xl hover:shadow-[0_20px_60px_rgba(52,211,153,0.15)] transition-all duration-500 group-hover:scale-[1.02] relative overflow-hidden">
              {/* Adobe Express-style gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-emerald-100/20 to-teal-100/30 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-tl from-green-200/10 via-transparent to-blue-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <p className="relative z-10 text-xl md:text-2xl text-foreground font-medium">
                Every week: one tools-&amp;-skills edition (Weds) + one core-concept edition (Sun). Build your AI fluency, step by step.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}