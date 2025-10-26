'use client'

import { motion } from 'framer-motion'
import { UserGroupIcon } from '@heroicons/react/24/outline'

export function WhoThisIsFor() {
  const targetAudience = [
    "BFSI professionals adopting AI responsibly",
    "Engineers moving into model-risk & governance",
    "Leaders understanding AI controls and sign-off"
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-yellow-50/40 via-amber-50/30 to-orange-50/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-amber-300/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-14 h-14 bg-purple-50 rounded-xl mb-6 shadow-sm border border-purple-100"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <UserGroupIcon className="h-7 w-7 text-purple-600" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
            Who This Is For
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4"
        >
          {targetAudience.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden h-full">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-indigo-50/20 to-purple-50/30 opacity-50" />
                
                <div className="relative z-10 text-center">
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
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
