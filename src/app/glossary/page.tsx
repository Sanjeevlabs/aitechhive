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

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(terms.map(t => t.category)))
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

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory)
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              AI & Banking Glossary
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
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
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms, descriptions, or categories..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* A-Z Navigation */}
        <div className="mb-8 border-t border-b border-slate-200 py-4">
          <div className="flex flex-wrap gap-1 justify-center">
            <button
              onClick={() => setSelectedLetter('all')}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                selectedLetter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  selectedLetter === letter
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center text-slate-600">
          {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} found
        </div>

        {/* Terms List */}
        {Object.keys(groupedTerms).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No terms found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTerms)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, letterTerms]) => (
                <div key={letter} id={`letter-${letter}`}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    {letter}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {letterTerms.map(term => (
                      <Link
                        key={term.slug}
                        href={`/glossary/${term.slug}`}
                        className="block p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all"
                      >
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {term.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                          {term.description}
                        </p>
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {term.category}
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
            className="inline-block px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
