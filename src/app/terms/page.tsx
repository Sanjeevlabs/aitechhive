'use client'

import { motion } from 'framer-motion'
import { Footer } from '@/components/sections/Footer'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen relative z-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="py-8 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Terms of Service Content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-600 mb-12">
              Last updated: October 2025
            </p>

            <div className="glass-card p-8 md:p-12 rounded-3xl shadow-xl space-y-8 text-slate-700">
              <p className="text-lg leading-relaxed">
                Welcome to Aitechhive, an independent community and publication exploring the world of Artificial Intelligence, technology, and the future of learning.
                By accessing or using our website, newsletter, or community resources, you agree to these Terms of Service.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  1. Overview
                </h2>
                <p className="mb-4 leading-relaxed">
                  Aitechhive ("we," "our," or "us") operates the website{' '}
                  <a href="https://aitechhive.com/" className="text-blue-600 hover:text-blue-700 font-medium">
                    https://aitechhive.com/
                  </a>
                  {' '}and associated services including newsletters, learning content, and community initiatives.
                </p>
                <p className="mb-4 leading-relaxed">
                  These Terms apply to all visitors, subscribers, and contributors.
                </p>
                <p className="leading-relaxed font-semibold">
                  If you disagree with any part of these Terms, please discontinue use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  2. Use of Content
                </h2>
                <p className="mb-4 leading-relaxed">
                  All content shared via Aitechhive — including articles, newsletters, graphics, and educational material — is for informational and educational purposes only.
                </p>
                <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                  <li>You may share snippets or quotes with proper attribution and a link back to aitechhive.com.</li>
                  <li>You may not reproduce, sell, or distribute our content without written permission.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  3. Subscriptions and Communication
                </h2>
                <p className="mb-4 leading-relaxed">
                  When you subscribe to our newsletter or sign up through our LinkedIn lead form, you consent to receive periodic emails, updates, or community invites from Aitechhive.
                </p>
                <p className="mb-4 leading-relaxed">
                  You can unsubscribe anytime using the link in our emails.
                </p>
                <p className="leading-relaxed">
                  We strive to provide accurate, thoughtful information — but all opinions expressed are personal views for learning and discussion, not professional or financial advice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  4. Community Conduct
                </h2>
                <p className="mb-4 leading-relaxed">
                  Aitechhive encourages open, respectful learning.
                </p>
                <p className="mb-4 leading-relaxed">
                  You agree not to post, share, or transmit any material that is unlawful, harmful, or violates the rights of others.
                </p>
                <p className="leading-relaxed">
                  We reserve the right to remove or block users who engage in spam, harassment, or misuse of our platforms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  5. Intellectual Property
                </h2>
                <p className="mb-4 leading-relaxed">
                  All intellectual property, including text, visuals, branding, and logos, belongs to Aitechhive unless stated otherwise.
                </p>
                <p className="leading-relaxed">
                  You retain rights to any original content you create and share with us, but by sharing it, you grant Aitechhive a non-exclusive right to display or reference it (with attribution).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  6. Third-Party Links and Tools
                </h2>
                <p className="mb-4 leading-relaxed">
                  Our website and newsletters may contain links to external sites or tools (like Beehiiv, LinkedIn, or analytics platforms).
                </p>
                <p className="mb-4 leading-relaxed">
                  We are not responsible for the privacy, content, or security practices of those third parties.
                </p>
                <p className="leading-relaxed">
                  Use them at your discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="mb-4 leading-relaxed">
                  Aitechhive and its contributors will not be liable for any loss, damage, or consequences arising from the use or interpretation of our content.
                </p>
                <p className="leading-relaxed">
                  All materials are provided "as is," without warranties of any kind.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  8. Modifications
                </h2>
                <p className="mb-4 leading-relaxed">
                  We may update these Terms periodically to reflect changes in our services or legal requirements.
                </p>
                <p className="leading-relaxed">
                  Updated versions will be posted here with a revised "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  9. Contact
                </h2>
                <p className="leading-relaxed">
                  If you have questions or concerns about these Terms, please contact:
                </p>
                <p className="mt-4 text-lg">
                  📧{' '}
                  <a href="mailto:hello@aitechhive.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    hello@aitechhive.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
