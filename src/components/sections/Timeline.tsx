'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { wednesdayTopics, sundayTopics } from '@/lib/curriculumData'
import { useRef, useState } from 'react'

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeWeek, setActiveWeek] = useState(1)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0])

  return (
    <section ref={containerRef} className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl animate-parallax-float" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          style={{ opacity, y }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-center text-foreground mb-6"
          >
            Your Learning Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto"
          >
            17 weeks of structured learning, twice a week
          </motion.p>
        </motion.div>

        {/* Timeline Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
            <span className="text-lg font-medium text-gray-700">Wednesday - Tools & Skills</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-lg font-medium text-gray-700">Sunday - Core Concepts</span>
          </div>
        </motion.div>

        {/* Horizontal Scrollable Timeline */}
        <div className="relative">
          <div className="overflow-x-auto pb-8 timeline-scroll">
            <div className="min-w-max px-4">
              {/* Parallel Tracks Container */}
              <div className="relative" style={{ minWidth: `${wednesdayTopics.length * 280}px` }}>
                {/* Center connecting line */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 -translate-y-1/2 z-0" />
                
                {/* Wednesday Track (Top) */}
                <div className="mb-32">
                  <div className="flex gap-6 relative">
                    {wednesdayTopics.map((topic, index) => (
                      <motion.div
                        key={topic.week}
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.05,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex-shrink-0 w-64 relative"
                        onMouseEnter={() => setActiveWeek(topic.week)}
                      >
                        {/* Vertical connector to center line */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full h-12 w-0.5 bg-gradient-to-b from-blue-400 to-gray-300 z-0" />
                        
                        {/* Topic Card */}
                        <div className={`glass-card p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer ${
                          activeWeek === topic.week ? 'scale-105 ring-2 ring-blue-400' : 'hover:scale-105'
                        }`}>
                          {/* Gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-indigo-100/30 to-cyan-100/40 opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            {/* Week badge */}
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mb-3 shadow-md">
                              <span className="text-white text-sm font-bold">W{topic.week}</span>
                            </div>
                            
                            {/* Date */}
                            <div className="text-sm text-blue-600 font-semibold mb-2">{topic.date}</div>
                            
                            {/* Topic */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                              {topic.topic}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Sunday Track (Bottom) */}
                <div className="mt-12">
                  <div className="flex gap-6 relative">
                    {sundayTopics.map((topic, index) => (
                      <motion.div
                        key={topic.week}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.05,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex-shrink-0 w-64 relative"
                        onMouseEnter={() => setActiveWeek(topic.week)}
                      >
                        {/* Vertical connector to center line */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full h-12 w-0.5 bg-gradient-to-t from-purple-400 to-gray-300 z-0" />
                        
                        {/* Topic Card */}
                        <div className={`glass-card p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer ${
                          activeWeek === topic.week ? 'scale-105 ring-2 ring-purple-400' : 'hover:scale-105'
                        }`}>
                          {/* Gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-pink-100/30 to-red-100/40 opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            {/* Week badge */}
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-3 shadow-md">
                              <span className="text-white text-sm font-bold">W{topic.week}</span>
                            </div>
                            
                            {/* Date */}
                            <div className="text-sm text-purple-600 font-semibold mb-2">{topic.date}</div>
                            
                            {/* Topic */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                              {topic.topic}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicators */}
          <div className="flex justify-center mt-8 gap-2">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-400"
            >
              ← Scroll to explore →
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .timeline-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .timeline-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .timeline-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #2563eb, #7c3aed);
        }
      `}</style>
    </section>
  )
}
