import fs from 'fs'
import path from 'path'
import slugify from 'slugify'

export interface GlossaryTerm {
  title: string
  slug: string
  description: string
  category: string
  url: string
}

export interface GlossaryCategory {
  name: string
  slug: string
  terms: GlossaryTerm[]
}

export interface GlossaryData {
  terms: GlossaryTerm[]
  categories: GlossaryCategory[]
}

/**
 * Parse the glossary.md file and extract structured term data
 */
export function parseGlossary(content: string): GlossaryData {
  const lines = content.split('\n')
  const terms: GlossaryTerm[] = []
  const categoriesMap = new Map<string, GlossaryTerm[]>()
  
  let currentCategory = ''
  let currentTerm = ''
  let currentDescription = ''
  let currentUrl = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines and main title
    if (!line || line.startsWith('# AI & Banking Glossary') || line.startsWith('This glossary')) {
      continue
    }
    
    // Category header (## Category: ...)
    if (line.startsWith('## Category:')) {
      currentCategory = line.replace('## Category:', '').trim()
      if (!categoriesMap.has(currentCategory)) {
        categoriesMap.set(currentCategory, [])
      }
      continue
    }
    
    // Term header (### Term Name)
    if (line.startsWith('###')) {
      // Save previous term if exists
      if (currentTerm && currentDescription && currentCategory) {
        const termSlug = slugify(currentTerm, { lower: true, strict: true })
        const term: GlossaryTerm = {
          title: currentTerm,
          slug: termSlug,
          description: currentDescription.trim(),
          category: currentCategory,
          url: currentUrl || `/glossary/${termSlug}`
        }
        terms.push(term)
        categoriesMap.get(currentCategory)?.push(term)
      }
      
      // Start new term
      currentTerm = line.replace('###', '').trim()
      currentDescription = ''
      currentUrl = ''
      continue
    }
    
    // Description line
    if (line.startsWith('**Description:**')) {
      currentDescription = line.replace('**Description:**', '').trim()
      continue
    }
    
    // URL line
    if (line.startsWith('**URL:**')) {
      currentUrl = line.replace('**URL:**', '').trim()
      continue
    }
  }
  
  // Save last term
  if (currentTerm && currentDescription && currentCategory) {
    const termSlug = slugify(currentTerm, { lower: true, strict: true })
    const term: GlossaryTerm = {
      title: currentTerm,
      slug: termSlug,
      description: currentDescription.trim(),
      category: currentCategory,
      url: currentUrl || `/glossary/${termSlug}`
    }
    terms.push(term)
    categoriesMap.get(currentCategory)?.push(term)
  }
  
  // Convert categories map to array
  const categories: GlossaryCategory[] = Array.from(categoriesMap.entries()).map(([name, categoryTerms]) => ({
    name,
    slug: slugify(name, { lower: true, strict: true }),
    terms: categoryTerms
  }))
  
  return { terms, categories }
}

// Cache for glossary data to avoid redundant parsing during build
let glossaryCache: GlossaryData | null = null

/**
 * Load and parse the glossary from the markdown file
 * Uses caching to improve build performance
 */
export function loadGlossary(): GlossaryData {
  if (glossaryCache) {
    return glossaryCache
  }
  
  const glossaryPath = path.join(process.cwd(), 'content', 'glossary', 'glossary.md')
  const content = fs.readFileSync(glossaryPath, 'utf-8')
  glossaryCache = parseGlossary(content)
  return glossaryCache
}

/**
 * Validate that all slugs are unique
 */
export function validateUniqueSlugs(terms: GlossaryTerm[]): void {
  const slugs = new Set<string>()
  const duplicates = new Set<string>()
  
  for (const term of terms) {
    if (slugs.has(term.slug)) {
      duplicates.add(term.slug)
    }
    slugs.add(term.slug)
  }
  
  if (duplicates.size > 0) {
    throw new Error(`Duplicate slugs found: ${Array.from(duplicates).join(', ')}`)
  }
}

/**
 * Get a single term by slug
 */
export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  const { terms } = loadGlossary()
  return terms.find(term => term.slug === slug)
}

/**
 * Get all terms for a category
 */
export function getTermsByCategory(categorySlug: string): GlossaryTerm[] {
  const { categories } = loadGlossary()
  const category = categories.find(cat => cat.slug === categorySlug)
  return category?.terms || []
}
