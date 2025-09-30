'use client'

import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function Problem() {
  return (
    <section className="py-20 px-4 bg-secondary dark:bg-secondary transition-theme">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-6">
            <ExclamationTriangleIcon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-8">
            Tired of the Wall of Jargon?
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 space-y-6 max-w-3xl mx-auto leading-relaxed"
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
            className="text-xl md:text-2xl font-medium text-foreground italic bg-background p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm"
          >
            &quot;The frustration is real: you want to understand AI&apos;s potential, but the learning curve feels impossibly steep.&quot;
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}