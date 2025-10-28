'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface GlossaryTerm {
  title: string
  slug: string
  description: string
  category: string
  url: string
}

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLetter, setSelectedLetter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Load glossary index
  useEffect(() => {
    fetch('/glossary-index.json')
      .then(res => res.json())
      .then(data => {
        setTerms(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading glossary:', error)
        setLoading(false)
      })
  }, [])

  // Category mapping to consolidate into broader categories
  const categoryMapping: Record<string, string> = {
    'AI Governance': 'Governance & Compliance',
    'Regulation & Compliance': 'Governance & Compliance',
    'AI Ethics': 'Governance & Compliance',
    'Model Validation': 'Governance & Compliance',
    'Risk Management': 'Governance & Compliance',
    
    'Technical Concepts': 'Core AI & ML',
    'Neural Networks & Deep Learning': 'Core AI & ML',
    'Machine Learning': 'Core AI & ML',
    'Classical Machine Learning': 'Core AI & ML',
    'Training Techniques': 'Core AI & ML',
    'Optimization Algorithms': 'Core AI & ML',
    'Advanced ML Techniques': 'Core AI & ML',
    
    'Large Language Models': 'Generative AI & NLP',
    'Generative AI': 'Generative AI & NLP',
    'Natural Language Understanding': 'Generative AI & NLP',
    'Advanced NLP': 'Generative AI & NLP',
    
    'Computer Vision': 'Computer Vision & Multimodal',
    'Multimodal AI': 'Computer Vision & Multimodal',
    'Speech & Audio': 'Computer Vision & Multimodal',
    
    'Reinforcement Learning': 'Specialized ML',
    'Time Series & Forecasting': 'Specialized ML',
    'Recommendation Systems': 'Specialized ML',
    'Feature Engineering': 'Specialized ML',
    'Model Evaluation': 'Specialized ML',
    
    'Deployment & Operations': 'MLOps & Infrastructure',
    'ML Operations Best Practices': 'MLOps & Infrastructure',
    'Cloud & Infrastructure': 'MLOps & Infrastructure',
    'Edge AI & Mobile': 'MLOps & Infrastructure',
    'Performance Optimization': 'MLOps & Infrastructure',
    'Production ML Challenges': 'MLOps & Infrastructure',
    
    'AI Frameworks & Tools': 'Tools & Platforms',
    'Data Processing': 'Tools & Platforms',
    'Data Science Tools': 'Tools & Platforms',
    'AutoML': 'Tools & Platforms',
    
    'Privacy & Security': 'Security & Safety',
    'AI Safety & Alignment': 'Security & Safety',
    'Explainability & Interpretability': 'Security & Safety',
    'Explainable AI Techniques': 'Security & Safety',
    
    'Healthcare AI': 'Industry Applications',
    'Financial AI': 'Industry Applications',
    'Industry Applications': 'Industry Applications',
    'Specialized Domains': 'Industry Applications',
    'Business & Strategy': 'Industry Applications',
    
    'Robotics & Autonomous Systems': 'Emerging Technologies',
    'Emerging Technologies': 'Emerging Technologies',
    'Emerging AI Paradigms': 'Emerging Technologies',
    'Research & Development': 'Emerging Technologies',
    'Knowledge Representation': 'Emerging Technologies',
    'Statistical Methods': 'Emerging Technologies',
  }

  // Extract unique categories with mapping applied
  const categories = useMemo(() => {
    const mappedCategories = terms.map(t => categoryMapping[t.category] || t.category)
    const uniqueCategories = Array.from(new Set(mappedCategories))
    return uniqueCategories.sort()
  }, [terms])

  // Alphabet navigation
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(terms, {
      keys: ['title', 'description', 'category'],
      threshold: 0.3,
      includeScore: true
    })
  }, [terms])

  // Filter and search terms
  const filteredTerms = useMemo(() => {
    let result = terms

    // Apply search
    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map(r => r.item)
    }

    // Apply category filter with mapping
    if (selectedCategory !== 'all') {
      result = result.filter(t => {
        const mappedCategory = categoryMapping[t.category] || t.category
        return mappedCategory === selectedCategory
      })
    }

    // Apply letter filter
    if (selectedLetter !== 'all') {
      result = result.filter(t => t.title.charAt(0).toUpperCase() === selectedLetter)
    }

    // Sort alphabetically
    return result.sort((a, b) => a.title.localeCompare(b.title))
  }, [terms, searchQuery, selectedCategory, selectedLetter, fuse])

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {}
    filteredTerms.forEach(term => {
      const letter = term.title.charAt(0).toUpperCase()
      if (!groups[letter]) {
        groups[letter] = []
      }
      groups[letter].push(term)
    })
    return groups
  }, [filteredTerms])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading glossary...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F4' }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: '#EDEAE6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              Jargon Buster
            </h1>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: '#6B6B6B' }}>
              Essential terms and definitions for AI governance, deployment, and regulation in financial services
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5" style={{ color: '#6B6B6B' }} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms, descriptions, or categories..."
              className="block w-full pl-10 pr-3 py-3 border rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ 
                borderColor: '#EDEAE6',
                color: '#2B2B2B',
                '--tw-ring-color': '#D4AF37'
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-8 overflow-x-hidden">
          <div className="flex flex-wrap gap-2 justify-center max-w-full">
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
              style={selectedCategory === 'all' 
                ? { backgroundColor: '#2B2B2B', color: '#F9F7F4' }
                : { backgroundColor: '#EDEAE6', color: '#2B2B2B' }
              }
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
                style={selectedCategory === category
                  ? { backgroundColor: '#2B2B2B', color: '#F9F7F4' }
                  : { backgroundColor: '#EDEAE6', color: '#2B2B2B' }
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* A-Z Navigation */}
        <div className="mb-8 border-t border-b py-4 overflow-x-hidden" style={{ borderColor: '#EDEAE6' }}>
          <div className="flex flex-wrap gap-1 justify-center max-w-full">
            <button
              onClick={() => setSelectedLetter('all')}
              className="px-3 py-1 text-sm font-medium rounded transition-colors whitespace-nowrap"
              style={selectedLetter === 'all'
                ? { backgroundColor: '#2B2B2B', color: '#F9F7F4' }
                : { color: '#6B6B6B' }
              }
            >
              All
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className="px-3 py-1 text-sm font-medium rounded transition-colors whitespace-nowrap"
                style={selectedLetter === letter
                  ? { backgroundColor: '#2B2B2B', color: '#F9F7F4' }
                  : { color: '#6B6B6B' }
                }
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center" style={{ color: '#6B6B6B' }}>
          {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} found
        </div>

        {/* Terms List */}
        {Object.keys(groupedTerms).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#6B6B6B' }}>No terms found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTerms)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, letterTerms]) => (
                <div key={letter} id={`letter-${letter}`}>
                  <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ color: '#2B2B2B', borderColor: '#EDEAE6' }}>
                    {letter}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {letterTerms.map(term => (
                      <Link
                        key={term.slug}
                        href={`/glossary/${term.slug}`}
                        className="block p-6 bg-white rounded-lg border transition-all hover:shadow-lg"
                        style={{ borderColor: '#EDEAE6' }}
                      >
                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#2B2B2B' }}>
                          {term.title}
                        </h3>
                        <p className="text-sm mb-3 line-clamp-3" style={{ color: '#6B6B6B' }}>
                          {term.description}
                        </p>
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#EDEAE6', color: '#2B2B2B' }}>
                          {categoryMapping[term.category] || term.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Back to Home Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 font-medium rounded-lg transition-colors"
            style={{ backgroundColor: '#2B2B2B', color: '#F9F7F4' }}
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
