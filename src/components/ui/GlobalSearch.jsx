import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'

import analysisData from '../../data/phases/analysis.json'
import designData from '../../data/phases/design.json'
import developData from '../../data/phases/develop.json'
import implementData from '../../data/phases/implement.json'
import evaluateData from '../../data/phases/evaluate.json'
import glossaryData from '../../data/glossary.json'
import templatesData from '../../data/templates.json'

const PHASES = [
  { slug: 'analysis',  label: analysisData.label,  tagline: analysisData.tagline,  color: analysisData.color },
  { slug: 'design',    label: designData.label,    tagline: designData.tagline,    color: designData.color },
  { slug: 'develop',   label: developData.label,   tagline: developData.tagline,   color: developData.color },
  { slug: 'implement', label: implementData.label, tagline: implementData.tagline, color: implementData.color },
  { slug: 'evaluate',  label: evaluateData.label,  tagline: evaluateData.tagline,  color: evaluateData.color },
]

function runSearch(query) {
  if (!query.trim()) return { phases: [], glossary: [], templates: [] }
  const q = query.toLowerCase()
  return {
    phases: PHASES.filter(
      (p) => p.label.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
    ),
    glossary: glossaryData
      .filter((g) => g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q))
      .slice(0, 6),
    templates: templatesData
      .filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      .slice(0, 5),
  }
}

function ResultGroup({ label, children }) {
  return (
    <div>
      <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      {children}
    </div>
  )
}

function ResultItem({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
    >
      {children}
    </button>
  )
}

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = runSearch(query)
  const hasResults =
    results.phases.length + results.glossary.length + results.templates.length > 0

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      // Small delay to ensure the element is visible before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const go = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phases, glossary, templates…"
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!query.trim() && (
            <p className="text-xs text-gray-400 text-center py-10">
              Type to search across phases, glossary, and templates
            </p>
          )}
          {query.trim() && !hasResults && (
            <p className="text-xs text-gray-400 text-center py-10">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.phases.length > 0 && (
            <ResultGroup label="Phases">
              {results.phases.map((p) => (
                <ResultItem key={p.slug} onClick={() => go(`/phase/${p.slug}`)}>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.tagline}</p>
                  </div>
                </ResultItem>
              ))}
            </ResultGroup>
          )}

          {results.glossary.length > 0 && (
            <ResultGroup label="Glossary">
              {results.glossary.map((g) => (
                <ResultItem key={g.id} onClick={() => go('/glossary')}>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{g.term}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {g.definition.length > 90 ? g.definition.slice(0, 90) + '…' : g.definition}
                    </p>
                  </div>
                </ResultItem>
              ))}
            </ResultGroup>
          )}

          {results.templates.length > 0 && (
            <ResultGroup label="Templates">
              {results.templates.map((t) => (
                <ResultItem key={t.id} onClick={() => go('/templates')}>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.description}</p>
                  </div>
                </ResultItem>
              ))}
            </ResultGroup>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-2">
          <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-500">Esc</kbd>
          <span className="text-xs text-gray-400">to close</span>
          <span className="text-gray-200 mx-1">·</span>
          <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-500">⌘K</kbd>
          <span className="text-xs text-gray-400">to open</span>
        </div>
      </div>
    </div>
  )
}
