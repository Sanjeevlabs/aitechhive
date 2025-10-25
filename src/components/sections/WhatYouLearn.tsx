'use client'

import { motion } from 'framer-motion'

const offerings = [
  {
    title: "Clear Mental Models",
    description: "Clear mental models for AI governance and deployment in regulated environments",
    icon: "🎯",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    title: "Real System Case Studies", 
    description: "Case studies and working-notes on how real systems get approved and scaled",
    icon: "📊",
    gradient: "from-green-500 to-teal-500"
  },
  {
    title: "Enterprise Tool Deep Dives",
    description: "Tool-and-workflow deep dives built for enterprise AI—not hobby labs",
    icon: "⚙️",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Honest Reflections",
    description: "Honest reflections on what works, what fails, and what matters for UK/EU BFSI",
    icon: "💡",
    gradient: "from-yellow-500 to-orange-500"
  }
]

export function WhatYouLearn() {
  return (
    <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-20 w-36 h-36 bg-indigo-50/50 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-44 h-44 bg-pink-50/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-center text-foreground mb-20"
        >
          What You&apos;ll Find
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-10">
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="glass-card p-10 rounded-[2rem] shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:scale-[1.03] relative overflow-hidden">
                {/* Adobe Express-style gradient backgrounds */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-tl from-white/40 via-white/10 to-transparent opacity-90" />
                
                {/* Enhanced animated gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-700`} />
                
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-start space-x-5">
                    <motion.div
                      className="text-5xl flex-shrink-0"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {item.icon}
                    </motion.div>
                    
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 group-hover:text-gray-700 transition-colors tracking-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-lg md:text-xl font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtle glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-700`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}