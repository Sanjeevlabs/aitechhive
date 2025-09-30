'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    step: "1",
    title: "Subscribe to Our Newsletter",
    description: "Join our community via our Beehiiv newsletter for weekly AI insights delivered straight to your inbox.",
    icon: "📧"
  },
  {
    step: "2", 
    title: "Receive Weekly AI Topics",
    description: "Get one focused, easy-to-understand AI topic each week, designed to build your knowledge progressively.",
    icon: "🧠"
  },
  {
    step: "3",
    title: "Build Knowledge & Confidence", 
    description: "Transform your understanding into career opportunities and confident conversations about AI.",
    icon: "🚀"
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-neutral-50 dark:bg-neutral-900 transition-theme">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-16"
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
              className="text-center group"
            >
              <div className="bg-background p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-6 mx-auto">
                  <span className="text-xl font-semibold text-foreground">{item.step}</span>
                </div>
                
                <div className="text-3xl mb-6">{item.icon}</div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {item.title}
                </h3>
                
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}