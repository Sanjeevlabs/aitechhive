import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { loadGlossary } from '@/lib/glossary-parser'

interface Props {
  params: {
    slug: string
  }
}

// Generate static paths for all glossary terms
export async function generateStaticParams() {
  const { terms } = loadGlossary()
  
  return terms.map(term => ({
    slug: term.slug,
  }))
}

// Generate metadata for each term page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { terms } = loadGlossary()
  const term = terms.find(t => t.slug === params.slug)
  
  if (!term) {
    return {
      title: 'Term Not Found | AITECHHIVE Glossary',
    }
  }
  
  return {
    title: `${term.title} | AITECHHIVE Glossary`,
    description: term.description,
    openGraph: {
      title: `${term.title} | AITECHHIVE Glossary`,
      description: term.description,
      url: `https://aitechhive.com/glossary/${term.slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://aitechhive.com/glossary/${term.slug}`,
    },
  }
}

export default function GlossaryTermPage({ params }: Props) {
  const { terms, categories } = loadGlossary()
  const term = terms.find(t => t.slug === params.slug)
  
  if (!term) {
    notFound()
  }
  
  // Get all terms in the same category
  const categoryTerms = terms
    .filter(t => t.category === term.category && t.slug !== term.slug)
    .slice(0, 5)
  
  // Get category info
  const category = categories.find(c => c.name === term.category)
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F4' }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: '#EDEAE6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="transition-colors" style={{ color: '#6B6B6B' }}>
                  Home
                </Link>
              </li>
              <li>
                <span style={{ color: '#EDEAE6' }} className="mx-2">/</span>
              </li>
              <li>
                <Link href="/glossary" className="transition-colors" style={{ color: '#6B6B6B' }}>
                  Glossary
                </Link>
              </li>
              <li>
                <span style={{ color: '#EDEAE6' }} className="mx-2">/</span>
              </li>
              <li className="font-medium" style={{ color: '#2B2B2B' }} aria-current="page">
                {term.title}
              </li>
            </ol>
          </nav>
          
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: '#EDEAE6', color: '#2B2B2B' }}>
              {term.category}
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
            {term.title}
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-8" style={{ borderColor: '#EDEAE6' }}>
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#2B2B2B' }}>Definition</h2>
                <p className="text-lg leading-relaxed" style={{ color: '#6B6B6B' }}>
                  {term.description}
                </p>
                
                {/* Official URL */}
                {term.officialUrl && (
                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F9F7F4' }}>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: '#2B2B2B' }}>
                      Official Resource
                    </h3>
                    <a
                      href={term.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:underline"
                      style={{ color: '#D4AF37' }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Learn more on external site
                    </a>
                  </div>
                )}
              </div>
              
              {/* Navigation Links */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: '#EDEAE6' }}>
                <Link
                  href="/glossary"
                  className="inline-flex items-center font-medium transition-colors"
                  style={{ color: '#D4AF37' }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Glossary
                </Link>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Terms in Same Category */}
            {categoryTerms.length > 0 && (
              <div className="bg-white rounded-lg border p-6 mb-6" style={{ borderColor: '#EDEAE6' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#2B2B2B' }}>
                  More in {term.category}
                </h3>
                <ul className="space-y-3">
                  {categoryTerms.map(relatedTerm => (
                    <li key={relatedTerm.slug}>
                      <Link
                        href={`/glossary/${relatedTerm.slug}`}
                        className="hover:underline transition-colors"
                        style={{ color: '#D4AF37' }}
                      >
                        {relatedTerm.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {category && category.terms.length > 6 && (
                  <Link
                    href="/glossary"
                    className="inline-block mt-4 text-sm transition-colors"
                    style={{ color: '#6B6B6B' }}
                  >
                    View all {category.terms.length} terms →
                  </Link>
                )}
              </div>
            )}
            
            {/* All Categories */}
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EDEAE6' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2B2B2B' }}>
                All Categories
              </h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <Link
                      href="/glossary"
                      className="block text-sm transition-colors"
                      style={cat.name === term.category
                        ? { color: '#D4AF37', fontWeight: 500 }
                        : { color: '#6B6B6B' }
                      }
                    >
                      {cat.name} ({cat.terms.length})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
