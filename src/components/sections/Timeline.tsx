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
    <section ref={containerRef} className="py-24 px-4 bg-gradient-to-br from-yellow-50/40 via-amber-50/30 to-orange-50/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-yellow-300/20 to-amber-300/20 rounded-full blur-3xl animate-parallax-float" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '2s' }} />
      
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent"
          >
            24-Week AI Deployment Learning Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            A structured, long-form learning-in-public approach for deploying AI in regulated financial institutions
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-base text-gray-500 max-w-2xl mx-auto mt-4"
          >
            <strong>Wednesday:</strong> Tools & hands-on enterprise workflows (3000–5000 words)<br />
            <strong>Sunday:</strong> Deep theory and reasoning relevant to regulated BFSI environments (3000–5000 words)
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
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-600 to-orange-500" />
            <span className="text-lg font-medium text-gray-700">Wednesday - Tools Kit</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600" />
            <span className="text-lg font-medium text-gray-700">Sunday - Concepts Clarity</span>
          </div>
        </motion.div>

        {/* Horizontal Scrollable Timeline */}
        <div className="relative">
          <div className="overflow-x-auto pb-8 timeline-scroll">
            <div className="min-w-max px-4">
              {/* Parallel Tracks Container */}
              <div className="relative" style={{ minWidth: `${wednesdayTopics.length * 280}px` }}>
                {/* Center connecting line */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 -translate-y-1/2 z-0" />
                
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
                        <div className="absolute left-1/2 -translate-x-1/2 top-full h-12 w-0.5 bg-gradient-to-b from-amber-400 to-amber-300 z-0" />
                        
                        {/* Topic Card */}
                        <div className={`glass-card p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer ${
                          activeWeek === topic.week ? 'scale-105 ring-2 ring-amber-400' : 'hover:scale-105'
                        }`}>
                          {/* Gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 via-orange-100/30 to-yellow-100/40 opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            {/* Week badge */}
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl mb-3 shadow-md">
                              <span className="text-white text-sm font-bold">W{topic.week}</span>
                            </div>
                            
                            {/* Phase */}
                            <div className="text-xs text-amber-600 font-semibold mb-2 uppercase tracking-wide">{topic.phase}</div>
                            
                            {/* Topic */}
                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                              {topic.topic}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-3">
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
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full h-12 w-0.5 bg-gradient-to-t from-yellow-400 to-amber-300 z-0" />
                        
                        {/* Topic Card */}
                        <div className={`glass-card p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer ${
                          activeWeek === topic.week ? 'scale-105 ring-2 ring-yellow-400' : 'hover:scale-105'
                        }`}>
                          {/* Gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/40 via-amber-100/30 to-orange-100/40 opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            {/* Week badge */}
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mb-3 shadow-md">
                              <span className="text-white text-sm font-bold">W{topic.week}</span>
                            </div>
                            
                            {/* Phase */}
                            <div className="text-xs text-yellow-600 font-semibold mb-2 uppercase tracking-wide">{topic.phase}</div>
                            
                            {/* Topic */}
                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-700 transition-colors">
                              {topic.topic}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-3">
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
              className="text-gray-400 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Scroll to explore all 24 weeks
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
          background: linear-gradient(to right, #f59e0b, #f97316);
          border-radius: 10px;
        }
        .timeline-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #d97706, #ea580c);
        }
      `}</style>
    </section>
  )
}
