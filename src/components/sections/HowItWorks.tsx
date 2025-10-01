'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    step: "1",
    title: "Subscribe to Our Newsletter",
    description: "Join our community via our Beehiiv newsletter for daily AI insights delivered straight to your inbox.",
    icon: "📧"
  },
  {
    step: "2", 
    title: "Receive Daily AI Topics",
    description: "Get one focused, easy-to-understand AI topic each day, designed to build your knowledge progressively.",
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
    <section className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900 transition-theme relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-center text-foreground mb-20"
        >
          How It Works
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="text-center group"
            >
              <div className="glass-card p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/10 to-accent-secondary/10 dark:from-accent/20 dark:to-accent-secondary/20 rounded-xl mb-8 mx-auto shadow-glow-sm">
                    <span className="text-2xl font-bold text-accent dark:text-accent">{item.step}</span>
                  </div>
                  
                  <div className="text-5xl mb-8 transform group-hover:scale-110 transition-transform duration-300 animate-float">{item.icon}</div>
                  
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-5">
                    {item.title}
                  </h3>
                  
                  <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}