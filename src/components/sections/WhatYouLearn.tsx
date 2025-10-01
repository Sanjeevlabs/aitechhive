'use client'

import { motion } from 'framer-motion'

const learningTopics = [
  {
    title: "Master the Basics",
    description: "Understand fundamental AI concepts like machine learning, neural networks, and algorithms without the complexity.",
    icon: "🎯",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    title: "See Real-World Impact", 
    description: "Discover how AI is transforming industries from healthcare to finance, with concrete examples and case studies.",
    icon: "🌍",
    gradient: "from-green-500 to-teal-500"
  },
  {
    title: "Stay Current",
    description: "Keep up with the latest AI developments, tools, and breakthroughs that matter to your career and interests.",
    icon: "⚡",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    title: "Build Career Confidence",
    description: "Gain the knowledge to speak intelligently about AI in professional settings and identify opportunities.",
    icon: "💼",
    gradient: "from-purple-500 to-pink-500"
  }
]

export function WhatYouLearn() {
  return (
    <section className="py-24 px-4 bg-background transition-theme">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-center text-foreground mb-20"
        >
          What You&apos;ll Learn
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-10">
          {learningTopics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="glass-card p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.03] relative overflow-hidden">
                {/* Enhanced animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-700`} />
                
                {/* Glass shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
                
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
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors tracking-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg md:text-xl font-light">
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

        {/* Bottom CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="glass-card p-10 rounded-3xl inline-block shadow-lg">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-3">
              Ready to transform your AI understanding?
            </p>
            <p className="text-accent dark:text-accent text-lg md:text-xl font-semibold">
              Start your journey with our daily newsletter
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}