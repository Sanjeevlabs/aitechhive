'use client'

import { motion } from 'framer-motion'

const offerings = [
  {
    title: "Governance Models",
    description: "Mental models for AI deployment in regulated environments",
    icon: "🎯",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    title: "Case Studies", 
    description: "How real systems get approved and scaled",
    icon: "📊",
    gradient: "from-green-500 to-teal-500"
  },
  {
    title: "Enterprise Tools",
    description: "Workflow deep dives built for production AI",
    icon: "⚙️",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Honest Insights",
    description: "What works and fails in UK/EU BFSI",
    icon: "💡",
    gradient: "from-yellow-500 to-orange-500"
  }
]

export function WhatYouLearn() {
  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-50/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-50/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
        >
          What You&apos;ll Find
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden">
                {/* Gradient backgrounds */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10`} />
                <div className="absolute inset-0 bg-gradient-to-tl from-white/40 via-white/10 to-transparent opacity-90" />
                
                <div className="relative z-10">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">
                      {item.icon}
                    </div>
                    
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}