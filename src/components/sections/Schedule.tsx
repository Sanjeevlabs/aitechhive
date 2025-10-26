'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface ScheduleItem {
  week: number
  phase: string
  sunday: string
  wednesday: string
}

export function Schedule() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([])
  const sundayScrollRef = useRef<HTMLDivElement>(null)
  const wednesdayScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    // Schedule data from 24-week-plan.md with phase groupings
    const scheduleItems: ScheduleItem[] = [
      // Week 1-4: Foundations
      { week: 1, phase: 'Foundations', sunday: 'AI Governance Frameworks in Banking', wednesday: 'Setting Up Development Environment' },
      { week: 2, phase: 'Foundations', sunday: 'Model Risk Management Fundamentals', wednesday: 'Version Control for ML Models' },
      { week: 3, phase: 'Foundations', sunday: 'Regulatory Landscape (UK/EU)', wednesday: 'Documentation Standards' },
      { week: 4, phase: 'Foundations', sunday: 'Enterprise AI Architecture Patterns', wednesday: 'Compliance Tracking Tools' },
      // Week 5-8: Data & Infrastructure
      { week: 5, phase: 'Data & Infrastructure', sunday: 'Data Governance in Regulated Environments', wednesday: 'Data Quality Assessment Tools' },
      { week: 6, phase: 'Data & Infrastructure', sunday: 'Privacy-Preserving AI Techniques', wednesday: 'Privacy Tools and Libraries' },
      { week: 7, phase: 'Data & Infrastructure', sunday: 'Data Lineage and Audit Trails', wednesday: 'Lineage Tracking Implementation' },
      { week: 8, phase: 'Data & Infrastructure', sunday: 'Infrastructure Security Standards', wednesday: 'Security Scanning for AI Systems' },
      // Week 9-12: Model Development
      { week: 9, phase: 'Model Development', sunday: 'Model Development Lifecycle', wednesday: 'MLOps Pipeline Setup' },
      { week: 10, phase: 'Model Development', sunday: 'Testing and Validation Frameworks', wednesday: 'Automated Testing Frameworks' },
      { week: 11, phase: 'Model Development', sunday: 'Bias Detection and Mitigation', wednesday: 'Fairness Testing Tools' },
      { week: 12, phase: 'Model Development', sunday: 'Explainability Requirements', wednesday: 'Explainability Libraries' },
      // Week 13-16: Risk Management
      { week: 13, phase: 'Risk Management', sunday: 'Model Risk Assessment', wednesday: 'Risk Assessment Frameworks' },
      { week: 14, phase: 'Risk Management', sunday: 'Monitoring and Alerting Strategies', wednesday: 'Monitoring Dashboard Setup' },
      { week: 15, phase: 'Risk Management', sunday: 'Incident Response Planning', wednesday: 'Alert Management Tools' },
      { week: 16, phase: 'Risk Management', sunday: 'Third-Party AI Risk', wednesday: 'Vendor Assessment Templates' },
      // Week 17-20: Deployment & Operations
      { week: 17, phase: 'Deployment & Operations', sunday: 'Production Deployment Standards', wednesday: 'CI/CD for ML Models' },
      { week: 18, phase: 'Deployment & Operations', sunday: 'Change Management Processes', wednesday: 'Configuration Management' },
      { week: 19, phase: 'Deployment & Operations', sunday: 'Performance Monitoring', wednesday: 'Performance Tracking Tools' },
      { week: 20, phase: 'Deployment & Operations', sunday: 'Operational Resilience', wednesday: 'Business Continuity Planning' },
      // Week 21-24: Governance & Future
      { week: 21, phase: 'Governance & Future', sunday: 'AI Ethics and Responsible AI', wednesday: 'Ethics Assessment Frameworks' },
      { week: 22, phase: 'Governance & Future', sunday: 'Stakeholder Communication', wednesday: 'Reporting Templates' },
      { week: 23, phase: 'Governance & Future', sunday: 'Regulatory Reporting', wednesday: 'Compliance Documentation' },
      { week: 24, phase: 'Governance & Future', sunday: 'Future Trends and Adaptations', wednesday: 'Emerging Technology Assessment' },
    ]
    setScheduleData(scheduleItems)
  }, [])

  // Initialize scroll button states after content loads
  useEffect(() => {
    const initializeScrollButtons = () => {
      if (sundayScrollRef.current) {
        updateScrollButtons(sundayScrollRef.current)
      }
    }
    
    // Wait for next frame to ensure content is rendered
    requestAnimationFrame(initializeScrollButtons)
  }, [scheduleData])

  // Check scroll position to update arrow visibility
  const updateScrollButtons = (element: HTMLDivElement) => {
    const { scrollLeft, scrollWidth, clientWidth } = element
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  // Synchronized scroll handler
  const handleScroll = (source: 'sunday' | 'wednesday') => {
    return (e: React.UIEvent<HTMLDivElement>) => {
      const scrollLeft = e.currentTarget.scrollLeft
      if (source === 'sunday' && wednesdayScrollRef.current) {
        wednesdayScrollRef.current.scrollLeft = scrollLeft
      } else if (source === 'wednesday' && sundayScrollRef.current) {
        sundayScrollRef.current.scrollLeft = scrollLeft
      }
      updateScrollButtons(e.currentTarget)
    }
  }

  // Scroll left/right by 400px
  const scroll = (direction: 'left' | 'right') => {
    const scrollAmount = direction === 'left' ? -400 : 400
    if (sundayScrollRef.current) {
      sundayScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
    if (wednesdayScrollRef.current) {
      wednesdayScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
    
    // Update button states after scroll completes (smooth scroll takes ~300ms)
    setTimeout(() => {
      if (sundayScrollRef.current) {
        updateScrollButtons(sundayScrollRef.current)
      }
    }, 350)
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-yellow-50/40 via-amber-50/30 to-orange-50/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-yellow-300/20 to-amber-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 max-w-4xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
            24-Week AI Deployment Learning Plan
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            This schedule is a long-form exploration of how AI is deployed inside regulated financial institutions. 
            These are working notes — evolving, iterative, and documented publicly as I learn.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-6 mb-12 max-w-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600"></div>
            <div>
              <div className="font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Sunday</div>
              <div className="text-sm text-gray-600">Concepts Clarity</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-600 to-orange-500"></div>
            <div>
              <div className="font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Wednesday</div>
              <div className="text-sm text-gray-600">Tools Kit</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll instruction and navigation arrows */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full transition-all duration-300 ${
              canScrollLeft
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 hover:scale-110 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Scroll horizontally to explore all 24 weeks
          </p>
          
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full transition-all duration-300 ${
              canScrollRight
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 hover:scale-110 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Schedule Grid */}
        <div className="space-y-10">
          {/* Sunday Row */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Sunday: Concepts Clarity</h3>
            </div>
            <div 
              ref={sundayScrollRef}
              onScroll={handleScroll('sunday')}
              className="relative overflow-x-auto pb-4 scrollbar-hide"
              style={{
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
              }}
            >
              <div className="flex gap-4 min-w-max">
                {scheduleData.map((item) => (
                  <div
                    key={`sunday-${item.week}`}
                    className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-2 border-orange-400"
                    style={{ 
                      scrollSnapAlign: 'start'
                    }}
                  >
                    <div className="text-xs font-semibold mb-1 text-orange-500 uppercase tracking-wide">
                      {item.phase}
                    </div>
                    <div className="text-sm font-semibold mb-2 text-orange-600">
                      Week {item.week}
                    </div>
                    <div className="text-gray-900 font-medium">
                      {item.sunday}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Wednesday Row */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-600 to-orange-500"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Wednesday: Tools Kit</h3>
            </div>
            <div 
              ref={wednesdayScrollRef}
              onScroll={handleScroll('wednesday')}
              className="relative overflow-x-auto pb-4 scrollbar-hide"
              style={{
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
              }}
            >
              <div className="flex gap-4 min-w-max">
                {scheduleData.map((item) => (
                  <div
                    key={`wednesday-${item.week}`}
                    className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-2 border-amber-400"
                    style={{ 
                      scrollSnapAlign: 'start'
                    }}
                  >
                    <div className="text-xs font-semibold mb-1 text-amber-500 uppercase tracking-wide">
                      {item.phase}
                    </div>
                    <div className="text-sm font-semibold mb-2 text-amber-600">
                      Week {item.week}
                    </div>
                    <div className="text-gray-900 font-medium">
                      {item.wednesday}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
