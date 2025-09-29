'use client'

import { motion } from 'framer-motion'
import { LightBulbIcon } from '@heroicons/react/24/outline'

export function Solution() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10 transition-theme">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <LightBulbIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Clarity is Here
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
            AI Tech Hive translates complex AI concepts into clear, digestible insights. 
            We start with simple breakdowns that anyone can understand, then offer deep dives for those ready to go further.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-xl border border-green-200/50 dark:border-green-800/50 shadow-xl hover:shadow-2xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-500 relative overflow-hidden group"
          >
            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/20 dark:via-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
            
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 relative z-10">
              Every week, you&apos;ll receive one focused topic that builds your AI knowledge systematically, 
              from foundational concepts to cutting-edge developments.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}