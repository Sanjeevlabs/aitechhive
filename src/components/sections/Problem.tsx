'use client'

import { motion } from 'framer-motion'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { memo } from 'react'

export const Problem = memo(function Problem() {
  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-1 opacity-40" />
      
      {/* Subtle decorative gradient orbs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-200/40 via-cyan-200/30 to-teal-200/35 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-indigo-200/35 via-purple-200/30 to-blue-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl mb-6 shadow-sm border border-blue-100"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <DocumentTextIcon className="h-7 w-7 text-blue-600" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
            Why This Exists
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            In regulated financial services, AI isn&apos;t just a model—it&apos;s a governance event requiring explainability, auditability, and compliance alignment.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <div className="glass-card p-8 rounded-3xl shadow-xl hover-glass-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-blue-50/30" />
              
              {/* Glass reflection */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/50 to-transparent" />
              
              <ul className="relative z-10 text-left space-y-3 max-w-2xl mx-auto">
                <li className="flex items-start text-sm md:text-base text-gray-700">
                  <span className="mr-3 text-blue-600 font-semibold">→</span>
                  <span>AI governance and deployment frameworks</span>
                </li>
                <li className="flex items-start text-sm md:text-base text-gray-700">
                  <span className="mr-3 text-blue-600 font-semibold">→</span>
                  <span>Monitoring, risk controls, audit readiness</span>
                </li>
                <li className="flex items-start text-sm md:text-base text-gray-700">
                  <span className="mr-3 text-blue-600 font-semibold">→</span>
                  <span>UK/EU BFSI-focused insights</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})