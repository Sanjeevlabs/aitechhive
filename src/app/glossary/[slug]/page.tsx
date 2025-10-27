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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-slate-500 hover:text-slate-700">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-slate-400 mx-2">/</span>
              </li>
              <li>
                <Link href="/glossary" className="text-slate-500 hover:text-slate-700">
                  Glossary
                </Link>
              </li>
              <li>
                <span className="text-slate-400 mx-2">/</span>
              </li>
              <li className="text-slate-900 font-medium" aria-current="page">
                {term.title}
              </li>
            </ol>
          </nav>
          
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {term.category}
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {term.title}
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Definition</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {term.description}
                </p>
              </div>
              
              {/* Navigation Links */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <Link
                  href="/glossary"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
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
              <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  More in {term.category}
                </h3>
                <ul className="space-y-3">
                  {categoryTerms.map(relatedTerm => (
                    <li key={relatedTerm.slug}>
                      <Link
                        href={`/glossary/${relatedTerm.slug}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {relatedTerm.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {category && category.terms.length > 6 && (
                  <Link
                    href="/glossary"
                    className="inline-block mt-4 text-sm text-slate-600 hover:text-slate-900"
                  >
                    View all {category.terms.length} terms →
                  </Link>
                )}
              </div>
            )}
            
            {/* All Categories */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                All Categories
              </h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <Link
                      href="/glossary"
                      className={`block text-sm ${
                        cat.name === term.category
                          ? 'text-blue-600 font-medium'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
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
