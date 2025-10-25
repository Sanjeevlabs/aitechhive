'use client'

import { motion } from 'framer-motion'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export function Problem() {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-8 shadow-lg border border-blue-200 float-animation"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-8 tracking-tight">
            Why This Exists
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
            In regulated financial services, AI isn&apos;t just a model. It&apos;s a governance event. Every system must be explainable, auditable, and aligned with risk and compliance frameworks. This site documents how that actually happens — step by step.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="glass-card p-10 rounded-[2rem] shadow-2xl hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
              {/* Adobe Express-style gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-indigo-100/20 to-blue-100/30 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-200/10 via-transparent to-indigo-100/10 opacity-0 hover:opacity-100 transition-opacity duration-700" />
              
              <ul className="relative z-10 text-left text-lg md:text-xl space-y-4">
                <li className="flex items-start">
                  <span className="mr-3 text-blue-600 font-bold">•</span>
                  <span>Learn how banks structure AI governance and deployment</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-600 font-bold">•</span>
                  <span>See working-notes on monitoring, risk controls, audit readiness</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-600 font-bold">•</span>
                  <span>Access frameworks and insights shaped for UK/EU BFSI professionals</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}