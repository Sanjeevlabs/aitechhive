'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { Solution } from '@/components/sections/Solution'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { WhatYouLearn } from '@/components/sections/WhatYouLearn'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <ThemeToggle />
      <main className="min-h-screen relative z-10">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <WhatYouLearn />
        <FinalCTA />
        <Footer />
      </main>
    </>
  )
}