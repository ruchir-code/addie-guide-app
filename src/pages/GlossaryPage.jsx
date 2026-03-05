import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ExternalLink, BookOpen } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import glossary from '../data/glossary.json'
import PhaseBadge from '../components/ui/PhaseBadge'
import { PHASE_COLORS, PHASES } from '../utils/colors'

const PHASE_SLUGS = ['analysis', 'design', 'develop', 'implement', 'evaluate']

const SORTED_GLOSSARY = [...glossary].sort((a, b) =>
  a.term.localeCompare(b.term)
)

function slugify(term) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')
}

function GlossaryTerm({ entry }) {
  const phaseSlug = entry.phaseLink?.replace('/', '') || ''
  const isPhase = PHASE_SLUGS.includes(phaseSlug)

  return (
    <div id={slugify(entry.term)} className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-1.5">
        <h3 className="font-bold text-gray-900 text-base">{entry.term}</h3>
        {entry.phaseLink && (
          <Link
            to={entry.phaseLink}
            className="shrink-0 flex items-center gap-1 transition-opacity hover:opacity-80"
            title={`Go to ${entry.phaseLabel}`}
          >
            {isPhase ? (
              <PhaseBadge phase={phaseSlug} label={entry.phaseLabel} />
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                {entry.phaseLabel}
                <ExternalLink size={11} />
              </span>
            )}
          </Link>
        )}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{entry.definition}</p>
    </div>
  )
}

export default function GlossaryPage() {
  const [query, setQuery] = useState('')
  const [activePhase, setActivePhase] = useState('all')

  const PHASE_FILTERS = [
    { key: 'all', label: 'All', color: null },
    ...PHASES.map((p) => ({ key: p.slug, label: p.label, color: p.color })),
  ]

  const filtered = useMemo(() => {
    let result = SORTED_GLOSSARY
    if (activePhase !== 'all') {
      result = result.filter((e) => {
        const slug = e.phaseLink?.replace('/', '') || ''
        return slug === activePhase
      })
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (e) =>
          e.term.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q)
      )
    }
    return result
  }, [query, activePhase])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach((entry) => {
      const letter = entry.term[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(entry)
    })
    return map
  }, [filtered])

  const letters = Object.keys(grouped).sort()

  return (
    <div>
      <SEOHead
        title="ID Glossary"
        description="86+ plain-English definitions for instructional design terms. From ADDIE to Zone of Proximal Development — the glossary practitioners actually use."
        path="/glossary"
      />
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #312E81 0%, #3730A3 55%, #4F46E5 100%)' }}
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Glossary
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            {glossary.length}+ plain-English definitions for instructional design terms.
            Each term links back to the relevant ADDIE phase.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          placeholder="Search terms or definitions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-white"
          style={{ '--tw-ring-color': '#7C3AED' }}
        />
      </div>

      {/* Phase filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PHASE_FILTERS.map(({ key, label, color }) => {
          const isActive = activePhase === key
          return (
            <button
              key={key}
              onClick={() => setActivePhase(key)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={
                isActive && color
                  ? { backgroundColor: color, color: '#fff', borderColor: color }
                  : isActive
                  ? { backgroundColor: '#111827', color: '#fff', borderColor: '#111827' }
                  : { backgroundColor: '#fff', color: '#6b7280', borderColor: '#d1d5db' }
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4">
        {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
        {query && ` matching "${query}"`}
      </p>

      {/* Terms */}
      {letters.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">
          No terms match your search.
        </p>
      ) : (
        letters.map((letter) => (
          <div key={letter} className="mb-6">
            <div className="sticky top-0 bg-gray-50 z-10 py-1 mb-2">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#7C3AED' }}>
                {letter}
              </span>
              <div className="border-b border-gray-100 mt-1" />
            </div>
            {grouped[letter].map((entry) => (
              <GlossaryTerm key={entry.id} entry={entry} />
            ))}
          </div>
        ))
      )}
    </div>
  )
}
