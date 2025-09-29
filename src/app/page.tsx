'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
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
      <ThemeToggle />
      <main className="min-h-screen">
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