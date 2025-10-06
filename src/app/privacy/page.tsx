'use client'

import { motion } from 'framer-motion'
import { Footer } from '@/components/sections/Footer'
import Link from 'next/link'

export default function PrivacyPage() {
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

      {/* Privacy Policy Content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-600 mb-12">
              Last updated: October 2025
            </p>

            <div className="glass-card p-8 md:p-12 rounded-3xl shadow-xl space-y-8 text-slate-700">
              <p className="text-lg leading-relaxed">
                At Aitechhive, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard data when you interact with our website, newsletter, and community platforms.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  1. Information We Collect
                </h2>
                <p className="mb-4 leading-relaxed">
                  We may collect the following types of information:
                </p>
                <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                  <li>Personal details such as your name, email address, and LinkedIn profile information when you sign up for our newsletter or community.</li>
                  <li>Usage data such as browser type, pages visited, and time spent on our site (collected via cookies or analytics tools).</li>
                  <li>Voluntary submissions, such as feedback, survey responses, or comments on community posts.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="mb-4 leading-relaxed">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                  <li>Send newsletters, updates, and educational content about AI and technology.</li>
                  <li>Improve the content and user experience of Aitechhive.</li>
                  <li>Communicate with you regarding upcoming events, projects, or opportunities to collaborate.</li>
                  <li>Analyze site traffic and engagement to enhance our community learning experience.</li>
                </ul>
                <p className="mt-4 font-semibold">
                  We will never sell or rent your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  3. Data Protection and Security
                </h2>
                <p className="mb-4 leading-relaxed">
                  We use industry-standard encryption and security measures to protect your data. Access to your personal information is limited to authorized personnel only.
                </p>
                <p className="leading-relaxed">
                  While we take all reasonable steps to secure your information, no method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  4. Third-Party Services
                </h2>
                <p className="mb-4 leading-relaxed">
                  Aitechhive may use trusted third-party platforms such as Beehiiv (for newsletters), Google Analytics, and LinkedIn Lead Gen Forms.
                </p>
                <p className="leading-relaxed">
                  These services may collect limited data under their own privacy policies. We recommend reviewing their respective policies for more information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  5. Your Rights
                </h2>
                <p className="mb-4 leading-relaxed">
                  You can unsubscribe from our emails at any time using the "Unsubscribe" link in our messages.
                </p>
                <p className="mb-4 leading-relaxed">
                  You may also contact us to:
                </p>
                <ul className="list-disc pl-6 space-y-2 leading-relaxed mb-4">
                  <li>Request access to the personal data we hold about you.</li>
                  <li>Request correction or deletion of your information.</li>
                </ul>
                <p className="leading-relaxed">
                  To make such requests, email us at:{' '}
                  <a href="mailto:privacy@aitechhive.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    privacy@aitechhive.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  6. Policy Updates
                </h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Updates will be posted on this page with a revised "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Contact
                </h2>
                <p className="leading-relaxed">
                  For any questions about this Privacy Policy or how your information is used, contact:
                </p>
                <p className="mt-4 text-lg">
                  📧{' '}
                  <a href="mailto:privacy@aitechhive.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    privacy@aitechhive.com
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
