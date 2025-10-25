'use client'

import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

// Social media links configuration
const socialLinks = [
  { 
    name: 'LinkedIn', 
    url: 'https://linkedin.com/company/aitechhive',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  { 
    name: 'Threads', 
    url: 'https://threads.net/@aitechhive',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717-1.409 1.754-2.122 4.222-2.147 7.35.025 3.129.738 5.597 2.147 7.35 1.43 1.78 3.63 2.694 6.54 2.717 3.36-.02 5.655-1.291 6.816-3.776.823-1.76.871-3.624.144-5.546-.597-1.577-1.775-2.87-3.507-3.847-.46-.26-1.035-.425-1.709-.495-.578.028-1.07.186-1.446.476-.522.403-.775 1.045-.753 1.909.009.378.07.755.185 1.119.184.57.452 1.062.797 1.463.42.488.94.836 1.546 1.034.713.233 1.457.271 2.21.113 1.044-.218 1.912-.72 2.582-1.492.38-.436.675-.925.878-1.454.3-.786.45-1.644.448-2.553-.003-1.318-.333-2.53-1.013-3.71-.707-1.23-1.753-2.207-3.109-2.9-1.354-.694-2.954-1.046-4.759-1.049l-.02.001c-1.898.023-3.564.393-4.957 1.101-1.387.707-2.47 1.71-3.222 2.98-.785 1.329-1.176 2.878-1.192 4.734v.017c.016 1.857.407 3.407 1.192 4.736.752 1.27 1.835 2.273 3.222 2.98 1.393.708 3.059 1.078 4.957 1.1h.02c1.805-.003 3.405-.355 4.76-1.048 1.355-.693 2.401-1.67 3.108-2.9.68-1.18 1.01-2.392 1.013-3.71.002-.909-.148-1.767-.448-2.553a4.885 4.885 0 0 0-.878-1.454c-.67-.772-1.538-1.274-2.582-1.492-.753-.158-1.497-.12-2.21.113-.606.198-1.126.546-1.546 1.034-.345.401-.613.893-.797 1.463a5.046 5.046 0 0 0-.185 1.12c-.022.863.231 1.505.753 1.908.376.29.868.448 1.446.476.674-.07 1.249-.235 1.709-.495 1.732-.977 2.91-2.27 3.507-3.847.727-1.922.679-3.786-.144-5.546-1.161-2.485-3.456-3.756-6.816-3.776-2.91.023-5.11.937-6.54 2.717-1.409 1.753-2.122 4.221-2.147 7.35.025 3.128.738 5.596 2.147 7.35 1.43 1.781 3.63 2.695 6.54 2.717 4.406-.031 7.2-2.055 8.304-6.015l2.04.569c-.651 2.337-1.832 4.177-3.509 5.467-1.783 1.373-4.08 2.078-6.826 2.098z"/>
      </svg>
    )
  },
  { 
    name: 'X', 
    url: 'https://x.com/aitechhive',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  { 
    name: 'Reddit', 
    url: 'https://reddit.com/r/aitechhive',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    )
  }
]

export function Footer() {
  return (
    <footer className="py-16 px-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-slate-100 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <Logo size="sm" textColor="text-white" />
            <div className="text-base text-slate-200">
              <p>Making Enterprise AI Deployable.</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-base text-white font-semibold mb-2">
              © 2025 AITECHHIVE
            </p>
          </div>
        </motion.div>

        {/* Privacy and Terms Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="flex justify-center items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-slate-400 hover:text-white transition-colors duration-300 underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="/terms"
              className="text-sm text-slate-400 hover:text-white transition-colors duration-300 underline underline-offset-2"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="flex justify-center items-center gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Visit our ${social.name} page`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
        />
      </div>
    </footer>
  )
}