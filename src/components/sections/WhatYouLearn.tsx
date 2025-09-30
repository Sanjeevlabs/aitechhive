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
    <section className="py-20 px-4 bg-background transition-theme">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-16"
        >
          What You&apos;ll Learn
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {learningTopics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-500 group-hover:scale-[1.02] relative overflow-hidden">
                {/* Enhanced animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-700`} />
                
                {/* Glass shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className="text-4xl flex-shrink-0"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {item.icon}
                    </motion.div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
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
          className="text-center mt-16"
        >
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-700 inline-block">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
              Ready to transform your AI understanding?
            </p>
            <p className="text-primary-600 dark:text-primary-400 font-semibold">
              Start your journey with our daily newsletter
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}