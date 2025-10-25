'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ScheduleItem {
  week: number
  sunday: string
  wednesday: string
}

export function Schedule() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([])
  const [showLeftIndicator, setShowLeftIndicator] = useState(false)
  const [showRightIndicator, setShowRightIndicator] = useState(true)
  const sundayScrollRef = useRef<HTMLDivElement>(null)
  const wednesdayScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hardcoded schedule data from 24-week-plan.md content
    const scheduleItems: ScheduleItem[] = [
      { week: 1, sunday: 'AI Governance Frameworks in Banking', wednesday: 'Setting Up Development Environment' },
      { week: 2, sunday: 'Model Risk Management Fundamentals', wednesday: 'Version Control for ML Models' },
      { week: 3, sunday: 'Regulatory Landscape (UK/EU)', wednesday: 'Documentation Standards' },
      { week: 4, sunday: 'Enterprise AI Architecture Patterns', wednesday: 'Compliance Tracking Tools' },
      { week: 5, sunday: 'Data Governance in Regulated Environments', wednesday: 'Data Quality Assessment Tools' },
      { week: 6, sunday: 'Privacy-Preserving AI Techniques', wednesday: 'Privacy Tools and Libraries' },
      { week: 7, sunday: 'Data Lineage and Audit Trails', wednesday: 'Lineage Tracking Implementation' },
      { week: 8, sunday: 'Infrastructure Security Standards', wednesday: 'Security Scanning for AI Systems' },
      { week: 9, sunday: 'Model Development Lifecycle', wednesday: 'MLOps Pipeline Setup' },
      { week: 10, sunday: 'Testing and Validation Frameworks', wednesday: 'Automated Testing Frameworks' },
      { week: 11, sunday: 'Bias Detection and Mitigation', wednesday: 'Fairness Testing Tools' },
      { week: 12, sunday: 'Explainability Requirements', wednesday: 'Explainability Libraries' },
      { week: 13, sunday: 'Model Risk Assessment', wednesday: 'Risk Assessment Frameworks' },
      { week: 14, sunday: 'Monitoring and Alerting Strategies', wednesday: 'Monitoring Dashboard Setup' },
      { week: 15, sunday: 'Incident Response Planning', wednesday: 'Alert Management Tools' },
      { week: 16, sunday: 'Third-Party AI Risk', wednesday: 'Vendor Assessment Templates' },
      { week: 17, sunday: 'Production Deployment Standards', wednesday: 'CI/CD for ML Models' },
      { week: 18, sunday: 'Change Management Processes', wednesday: 'Configuration Management' },
      { week: 19, sunday: 'Performance Monitoring', wednesday: 'Performance Tracking Tools' },
      { week: 20, sunday: 'Operational Resilience', wednesday: 'Business Continuity Planning' },
      { week: 21, sunday: 'AI Ethics and Responsible AI', wednesday: 'Ethics Assessment Frameworks' },
      { week: 22, sunday: 'Stakeholder Communication', wednesday: 'Reporting Templates' },
      { week: 23, sunday: 'Regulatory Reporting', wednesday: 'Compliance Documentation' },
      { week: 24, sunday: 'Future Trends and Adaptations', wednesday: 'Emerging Technology Assessment' },
    ]
    setScheduleData(scheduleItems)
  }, [])

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = ref.current
    setShowLeftIndicator(scrollLeft > 0)
    setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    const scrollAmount = 400
    const scrollValue = direction === 'left' ? -scrollAmount : scrollAmount
    
    if (sundayScrollRef.current) {
      sundayScrollRef.current.scrollBy({ left: scrollValue, behavior: 'smooth' })
    }
    if (wednesdayScrollRef.current) {
      wednesdayScrollRef.current.scrollBy({ left: scrollValue, behavior: 'smooth' })
    }
  }

  // Synchronized scrolling
  const handleSundayScroll = () => {
    if (sundayScrollRef.current && wednesdayScrollRef.current) {
      wednesdayScrollRef.current.scrollLeft = sundayScrollRef.current.scrollLeft
      handleScroll(sundayScrollRef)
    }
  }

  const handleWednesdayScroll = () => {
    if (sundayScrollRef.current && wednesdayScrollRef.current) {
      sundayScrollRef.current.scrollLeft = wednesdayScrollRef.current.scrollLeft
      handleScroll(wednesdayScrollRef)
    }
  }

  return (
    <section id="schedule" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 max-w-4xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#D4AF37' }}>
            24-Week Learning Schedule
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            This schedule is a long-form exploration of how AI is deployed inside regulated financial institutions across the UK and EU. 
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
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
            <div>
              <div className="font-semibold" style={{ color: '#D4AF37' }}>Sunday</div>
              <div className="text-sm text-gray-600">Concepts Clarity</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#c49f27' }}></div>
            <div>
              <div className="font-semibold" style={{ color: '#c49f27' }}>Wednesday</div>
              <div className="text-sm text-gray-600">Tools Kit</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => scroll('left')}
            disabled={!showLeftIndicator}
            className="p-2 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: showLeftIndicator ? '#D4AF37' : '#e0e0e0',
              color: '#FFFFFF'
            }}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!showRightIndicator}
            className="p-2 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: showRightIndicator ? '#D4AF37' : '#e0e0e0',
              color: '#FFFFFF'
            }}
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="space-y-8">
          {/* Sunday Row */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
              <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>Sunday: Concepts Clarity</h3>
            </div>
            <div className="relative">
              <div
                ref={sundayScrollRef}
                onScroll={handleSundayScroll}
                className="flex gap-4 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D4AF37 #e0e0e0'
                }}
              >
                {scheduleData.map((item, index) => (
                  <div
                    key={`sunday-${index}`}
                    className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-2"
                    style={{ borderColor: '#D4AF37' }}
                  >
                    <div className="text-sm font-semibold mb-2" style={{ color: '#D4AF37' }}>
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
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#c49f27' }}></div>
              <h3 className="text-xl font-bold" style={{ color: '#c49f27' }}>Wednesday: Tools Kit</h3>
            </div>
            <div className="relative">
              <div
                ref={wednesdayScrollRef}
                onScroll={handleWednesdayScroll}
                className="flex gap-4 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#c49f27 #e0e0e0'
                }}
              >
                {scheduleData.map((item, index) => (
                  <div
                    key={`wednesday-${index}`}
                    className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-2"
                    style={{ borderColor: '#c49f27' }}
                  >
                    <div className="text-sm font-semibold mb-2" style={{ color: '#c49f27' }}>
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
