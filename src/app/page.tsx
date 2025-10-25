'use client'

import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Schedule } from '@/components/sections/Schedule'
import { Problem } from '@/components/sections/Problem'
import { WhoThisIsFor } from '@/components/sections/WhoThisIsFor'
import { WhatYouLearn } from '@/components/sections/WhatYouLearn'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Team } from '@/components/sections/Team'
import { Footer } from '@/components/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen relative z-10">
        <Hero />
        <Schedule />
        <Problem />
        <WhoThisIsFor />
        <WhatYouLearn />
        <FinalCTA />
        <Team />
        <Footer />
        <ScrollToTop />
      </main>
    </>
  )
}