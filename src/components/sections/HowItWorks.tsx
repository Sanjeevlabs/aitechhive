'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    step: "1",
    title: "Subscribe to Our Newsletter",
    description: "Join our community via our Beehiiv newsletter for bi-weekly AI insights delivered straight to your inbox.",
    icon: "📧"
  },
  {
    step: "2", 
    title: "Receive Bi-Weekly AI Topics",
    description: "Get focused AI topics twice a week: Wednesdays for tools & skills, Sundays for core concepts, building your knowledge progressively.",
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
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl animate-parallax-float" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-purple-100/40 rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '3s' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
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
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="glass-card p-10 rounded-[2rem] shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500 relative overflow-hidden group-hover:scale-[1.03]">
                {/* Adobe Express-style gradient backgrounds */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  index === 0 ? 'from-pink-100/40 via-orange-100/30 to-yellow-100/40' :
                  index === 1 ? 'from-blue-100/40 via-cyan-100/30 to-teal-100/40' :
                  'from-purple-100/40 via-pink-100/30 to-red-100/40'
                } opacity-90`} />
                <div className="absolute inset-0 bg-gradient-to-tl from-white/50 via-white/20 to-transparent opacity-90" />
                
                {/* Enhanced glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-8 mx-auto shadow-lg animate-soft-bounce">
                    <span className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">{item.step}</span>
                  </div>
                  
                  <div className="text-6xl mb-8 transform group-hover:scale-125 transition-all duration-500 animate-soft-bounce" style={{ animationDelay: `${0.2}s` }}>{item.icon}</div>
                  
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-5">
                    {item.title}
                  </h3>
                  
                  <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
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