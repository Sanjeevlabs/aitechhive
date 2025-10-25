'use client'

import { motion } from 'framer-motion'
import { UserGroupIcon } from '@heroicons/react/24/outline'

export function WhoThisIsFor() {
  const targetAudience = [
    "Professionals working inside banking, insurance, payments and consulting who need to adopt AI responsibly",
    "Engineers & data scientists moving into model-risk, AI delivery, or governance roles",
    "Leaders who need to understand not just models—but how AI must be controlled, signed off, and monitored"
  ]

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-20 w-36 h-36 bg-purple-50/50 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-44 h-44 bg-indigo-50/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-8 shadow-lg border border-purple-200 float-animation"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-8 tracking-tight">
            Who This Is For
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {targetAudience.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass-card p-8 rounded-2xl shadow-lg hover:shadow-[0_20px_60px_rgba(147,51,234,0.15)] transition-all duration-500 group-hover:scale-[1.02] relative overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-indigo-100/20 to-purple-100/30 opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-tl from-purple-200/10 via-transparent to-indigo-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 flex items-start space-x-4">
                  <span className="text-purple-600 font-bold text-2xl flex-shrink-0">•</span>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    {audience}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
