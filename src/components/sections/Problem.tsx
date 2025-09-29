'use client'

import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function Problem() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-800 dark:via-red-900/10 dark:to-orange-900/10 transition-theme">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Tired of the Wall of Jargon?
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 space-y-6 max-w-3xl mx-auto leading-relaxed"
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
            className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 italic bg-white/50 dark:bg-gray-800/50 p-8 rounded-xl border-l-4 border-orange-500 shadow-md"
          >
            &quot;The frustration is real: you want to understand AI&apos;s potential, but the learning curve feels impossibly steep.&quot;
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}