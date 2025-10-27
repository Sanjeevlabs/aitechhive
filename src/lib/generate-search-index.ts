import fs from 'fs'
import path from 'path'
import { loadGlossary, validateUniqueSlugs } from './glossary-parser'

/**
 * Generate search index JSON file at build time
 */
export function generateSearchIndex(): void {
  try {
    const glossaryData = loadGlossary()
    
    // Validate unique slugs
    validateUniqueSlugs(glossaryData.terms)
    
    // Create search index with all necessary fields
    const searchIndex = glossaryData.terms.map(term => ({
      title: term.title,
      slug: term.slug,
      description: term.description,
      category: term.category,
      url: term.url
    }))
    
    // Write to public directory for client-side access
    const outputPath = path.join(process.cwd(), 'public', 'glossary-index.json')
    fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2))
    
    console.log(`✓ Generated glossary search index with ${searchIndex.length} terms`)
    console.log(`✓ Categories: ${glossaryData.categories.map(c => c.name).join(', ')}`)
  } catch (error) {
    console.error('Error generating search index:', error)
    throw error
  }
}

// Run if executed directly
if (require.main === module) {
  generateSearchIndex()
}
