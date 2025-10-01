'use client'

import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="py-16 px-4 bg-gray-900 dark:bg-black text-white transition-theme">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <Logo size="sm" />
            <div className="text-base text-gray-400">
              <p>Decode AI, One Topic at a Time</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-base text-gray-400 mb-2">
              @2025 AITECHHIVE
            </p>
            <p className="text-sm text-gray-500">
              Making AI accessible to everyone
            </p>
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
        />
      </div>
    </footer>
  )
}