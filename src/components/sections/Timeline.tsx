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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-lg font-medium text-gray-700">Wednesday - Tools Kit</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
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
                        <div className={`p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer bg-white ${
                          activeWeek === topic.week ? 'scale-105 ring-2 ring-amber-400' : 'hover:scale-105'
                        }`}>
                          {/* Hover gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            {/* Week badge with wrench icon for Wednesday */}
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl mb-3 shadow-md">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
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
                        <div className={`p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer bg-white ${
                          activeWeek === topic.week ? 'scale-105 ring-2 ring-yellow-400' : 'hover:scale-105'
                        }`}>
                          {/* Hover gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            {/* Week badge with book icon for Sunday */}
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mb-3 shadow-md">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
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
