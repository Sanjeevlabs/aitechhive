'use client'

import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Timeline } from '@/components/sections/Timeline'
import { Problem } from '@/components/sections/Problem'
import { WhoThisIsFor } from '@/components/sections/WhoThisIsFor'
import { WhatYouLearn } from '@/components/sections/WhatYouLearn'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Team } from '@/components/sections/Team'
import { Footer } from '@/components/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  return (
    <main className="min-h-screen relative z-10">
      <Header />
      <ThemeToggle />
      <Hero />
      <Timeline />
      <Problem />
      <WhoThisIsFor />
      <WhatYouLearn />
      <Team />
      <FinalCTA />
      <Footer />
      <ScrollToTop />
    </main>
  )
}