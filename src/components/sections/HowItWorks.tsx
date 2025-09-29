'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    step: "1",
    title: "Subscribe to Our Newsletter",
    description: "Join our community via our Beehiiv newsletter for weekly AI insights delivered straight to your inbox.",
    icon: "📧",
    color: "from-blue-500 to-cyan-500"
  },
  {
    step: "2", 
    title: "Receive Weekly AI Topics",
    description: "Get one focused, easy-to-understand AI topic each week, designed to build your knowledge progressively.",
    icon: "🧠",
    color: "from-purple-500 to-pink-500"
  },
  {
    step: "3",
    title: "Build Knowledge & Confidence", 
    description: "Transform your understanding into career opportunities and confident conversations about AI.",
    icon: "🚀",
    color: "from-green-500 to-emerald-500"
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-theme">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16"
        >
          How It Works
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Enhanced background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Glass shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
              
              <div className="relative z-10">
                <motion.div 
                  className="text-6xl mb-4"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -8, 8, 0],
                    transition: { duration: 0.6, type: "spring", stiffness: 200 }
                  }}
                >
                  {item.icon}
                </motion.div>
                
                <motion.div 
                  className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-4`}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.3, type: "spring", stiffness: 300 }
                  }}
                >
                  {item.step}
                </motion.div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection lines for desktop */}
        <div className="hidden md:block relative -mt-32 mb-16">
          <div className="absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary-300 to-accent-300 dark:from-primary-600 dark:to-accent-600" />
          <div className="absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-accent-300 to-green-300 dark:from-accent-600 dark:to-green-600" />
        </div>
      </div>
    </section>
  )
}