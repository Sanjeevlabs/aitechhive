'use client'

import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function Problem() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-[#1a1a1a] transition-theme relative overflow-hidden">
      {/* Subtle decorative elements - Adobe Express inspired */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-amber-100/50 dark:bg-amber-900/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-100/50 dark:bg-purple-900/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-xl mb-8 shadow-lg border border-amber-200 dark:border-amber-800"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <ExclamationTriangleIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-8 tracking-tight">
            Tired of the Wall of Jargon?
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 space-y-8 max-w-4xl mx-auto leading-relaxed font-light"
        >
          <p>
            You&apos;re excited about AI, but every article feels like it&apos;s written for PhD researchers. 
            Dense technical papers, confusing acronyms, and explanations that assume you already know everything.
          </p>
          
          <motion.blockquote 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-medium text-foreground italic glass-card p-10 rounded-2xl shadow-xl"
          >
            &quot;The frustration is real: you want to understand AI&apos;s potential, but the learning curve feels impossibly steep.&quot;
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}