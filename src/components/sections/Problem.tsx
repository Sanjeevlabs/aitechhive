'use client'

import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function Problem() {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-red-50/50 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-amber-50/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-xl mb-8 shadow-lg border border-amber-200 float-animation"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <ExclamationTriangleIcon className="h-8 w-8 text-amber-600" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-8 tracking-tight">
            Tired of being locked out by jargon?
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
            You&apos;re interested in AI — but most articles assume you&apos;re already an expert. We start where you are.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="glass-card p-10 rounded-[2rem] shadow-2xl hover:shadow-[0_20px_60px_rgba(255,159,64,0.15)] transition-all duration-500 group-hover:scale-[1.02] relative overflow-hidden">
              {/* Adobe Express-style gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-orange-100/20 to-red-100/30 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-tl from-amber-200/10 via-transparent to-orange-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <blockquote className="relative z-10 text-2xl md:text-3xl font-medium text-foreground italic">
                &quot;The frustration is real: you want to understand AI&apos;s potential, but the learning curve feels impossibly steep.&quot;
              </blockquote>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}