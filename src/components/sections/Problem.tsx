'use client'

import { motion } from 'framer-motion'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export function Problem() {
  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-blue-50/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-indigo-50/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
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
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight" style={{ color: '#D4AF37' }}>
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
            <div className="glass-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-indigo-50/10 to-blue-50/20" />
              
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
}