'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const headlines = [
  "Finally Understand AI",
  "AI Explained Simply",
  "Master AI Without the Jargon",
  "Decode AI, One Topic at a Time", 
  "Your AI Learning Journey Starts Here"
]

export default function Home() {
  const [currentHeadline, setCurrentHeadline] = useState(0)

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {/* Logo placeholder */}
            <motion.div
              variants={fadeInUp}
              className="mb-12"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">TechHive</h3>
            </motion.div>

            {/* Main headline with rotation */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
              key={headlines[currentHeadline]}
            >
              {headlines[currentHeadline]}
            </motion.h1>

            {/* Headline switcher buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {headlines.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeadline(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentHeadline ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Get simple explanations and in-depth topics that transform complex AI concepts into clear, actionable knowledge.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="space-y-6"
            >
              <a
                href="https://newsletter.aitechhive.com"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform"
              >
                Start Learning for Free
              </a>

              <p className="text-gray-500 text-sm">
                Join 500+ curious minds learning AI every week
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section - "The Wall of Jargon" */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Tired of the Wall of Jargon?
            </h2>
            <div className="text-lg md:text-xl text-gray-600 space-y-4 max-w-3xl mx-auto">
              <p>
                You&apos;re excited about AI, but every article feels like it&apos;s written for PhD researchers. 
                Dense technical papers, confusing acronyms, and explanations that assume you already know everything.
              </p>
              <p>
                The frustration is real: you want to understand AI&apos;s potential, but the learning curve feels impossibly steep.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section - "Your AI Translator" */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Clarity is Here
            </h2>
            <div className="text-lg md:text-xl text-gray-600 space-y-4 max-w-3xl mx-auto">
              <p>
                AI Tech Hive translates complex AI concepts into clear, digestible insights. 
                We start with simple breakdowns that anyone can understand, then offer deep dives for those ready to go further.
              </p>
              <p>
                Every week, you&apos;ll receive one focused topic that builds your AI knowledge systematically, 
                from foundational concepts to cutting-edge developments.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            What You&apos;ll Learn
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Master the Basics",
                description: "Understand fundamental AI concepts like machine learning, neural networks, and algorithms without the complexity.",
                icon: "🎯"
              },
              {
                title: "See Real-World Impact", 
                description: "Discover how AI is transforming industries from healthcare to finance, with concrete examples and case studies.",
                icon: "🌍"
              },
              {
                title: "Stay Current",
                description: "Keep up with the latest AI developments, tools, and breakthroughs that matter to your career and interests.",
                icon: "⚡"
              },
              {
                title: "Build Career Confidence",
                description: "Gain the knowledge to speak intelligently about AI in professional settings and identify opportunities.",
                icon: "💼"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm"
              >
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Decode AI?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join thousands of learners who&apos;ve transformed their understanding of AI
            </p>
            <a
              href="https://newsletter.aitechhive.com"
              className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform"
            >
              Start Learning for Free
            </a>
            <p className="text-sm opacity-75 mt-6">
              No spam, ever. Just pure knowledge.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p>&copy; 2024 AI Tech Hive. All rights reserved.</p>
      </footer>
    </main>
  )
}