import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import { Brain, ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from 'lucide-react'
import theories from '../data/theories.json'

const TEAL = {
  color: '#0D9488',
  light: '#F0FDFA',
  border: '#99F6E4',
  dark: '#0F766E',
}

function Section({ title, color, children }) {
  return (
      <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1 h-5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function BloomsCallout({ text }) {
  return (
    <div
      className="rounded-lg border px-4 py-3 mt-1"
      style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
    >
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
        Bloom's Connection
      </p>
      <p className="text-sm text-blue-900 leading-relaxed">{text}</p>
    </div>
  )
}

function TheoryCard({ theory }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      id={`theory-${theory.slug}`}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-shadow duration-150"
      style={{ boxShadow: expanded ? `0 4px 20px ${TEAL.color}20` : undefined }}
    >
      {/* Clickable header */}
      <button
        className="w-full text-left focus:outline-none"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        {/* Coloured band */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ backgroundColor: TEAL.color }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-white/50 tabular-nums w-6">
              {theory.number}
            </span>
            <span className="font-extrabold text-white text-sm tracking-wide">
              {theory.name}
            </span>
            <span
              className="hidden sm:inline-flex text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
            >
              {theory.theorists.join(' · ')}
            </span>
          </div>
          <div className="text-white/70">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* Summary row */}
        <div className="px-5 py-3 flex items-start gap-3">
          <Brain size={15} className="shrink-0 mt-0.5" style={{ color: TEAL.color }} />
          <div>
            <p className="text-sm text-gray-700 font-medium leading-snug">{theory.tagline}</p>
            <p className="text-xs text-gray-400 mt-0.5 sm:hidden">
              {theory.theorists.join(' · ')}
            </p>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5">

          {/* What It Is */}
          <Section title="What It Is" color={TEAL.color}>
            <p className="text-sm text-gray-700 leading-relaxed">{theory.whatItIs}</p>
          </Section>

          {/* Why It Matters for ID */}
          <Section title="Why It Matters for Instructional Design" color={TEAL.color}>
            <p className="text-sm text-gray-700 leading-relaxed">{theory.whyItMattersForID}</p>
          </Section>

          {/* Core Principles */}
          <Section title="Core Principles" color={TEAL.color}>
            <ol className="space-y-2">
              {theory.corePrinciples.map((principle, i) => {
                const colon = principle.indexOf(':')
                const boldPart = colon > -1 ? principle.slice(0, colon) : null
                const rest = colon > -1 ? principle.slice(colon + 1).trim() : principle
                return (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                      style={{ backgroundColor: TEAL.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">
                      {boldPart && (
                        <span className="font-semibold text-gray-900">{boldPart}: </span>
                      )}
                      {rest}
                    </span>
                  </li>
                )
              })}
            </ol>
          </Section>

          {/* How to Apply */}
          <Section title="How to Apply It in Your Designs" color={TEAL.color}>
            <ul className="space-y-2">
              {theory.howToApply.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: TEAL.color }} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Common Misconceptions */}
          <Section title="Common Misconceptions" color={TEAL.color}>
            <div className="space-y-3">
              {theory.commonMisconceptions.map((item, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border-b border-red-100">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 bg-red-600">
                      ✗
                    </span>
                    <p className="text-sm font-semibold text-red-900">{item.misconception}</p>
                  </div>
                  <div className="flex items-start gap-3 px-4 py-3 bg-emerald-50">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 bg-emerald-600">
                      ✓
                    </span>
                    <p className="text-sm text-emerald-900">{item.reality}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Bloom's Connection */}
          {theory.bloomsConnection && (
            <Section title="Bloom's Connection" color={TEAL.color}>
              <BloomsCallout text={theory.bloomsConnection} />
            </Section>
          )}

          {/* Related Terms */}
          {theory.relatedTerms && theory.relatedTerms.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Related Concepts
              </p>
              <div className="flex flex-wrap gap-2">
                {theory.relatedTerms.map((term) => (
                  <span
                    key={term}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: TEAL.light,
                      borderColor: TEAL.border,
                      color: TEAL.dark,
                    }}
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collapse button */}
          <button
            onClick={() => setExpanded(false)}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: TEAL.color }}
          >
            <ChevronUp size={13} />
            Collapse
          </button>
        </div>
      )}
    </div>
  )
}

export default function TheoriesPage() {
  return (
    <div>
      <SEOHead
        title="Learning Theories"
        description="Practitioner-focused summaries of behaviorism, cognitivism, constructivism, and 4 more learning theories every instructional designer should know."
        path="/theories"
      />
      {/* ── Header banner ────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ backgroundColor: TEAL.color }}
      >
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />
        <div
          className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Learning Theories
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            The theoretical frameworks behind every design decision. Know these and you'll know
            <em> why</em> the methods work — not just what to do.
          </p>
        </div>
      </div>

      {/* ── Quick-nav chips ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {theories.map((t) => (
          <a
            key={t.id}
            href={`#theory-${t.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 border"
            style={{
              backgroundColor: `${TEAL.color}15`,
              color: TEAL.dark,
              borderColor: `${TEAL.color}40`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: TEAL.color }}
            />
            {t.name}
          </a>
        ))}
      </div>

      {/* ── Intro callout ────────────────────────────────────────────── */}
      <div
        className="rounded-xl border px-4 py-4 mb-8 flex items-start gap-3"
        style={{ backgroundColor: TEAL.light, borderColor: TEAL.border }}
      >
        <Lightbulb size={18} className="shrink-0 mt-0.5" style={{ color: TEAL.dark }} />
        <p className="text-sm leading-relaxed" style={{ color: TEAL.dark }}>
          <strong>How to use this section:</strong> Click any theory card to expand the full
          reference. Each entry covers what the theory says, why it matters for ID practice, the core
          principles, how to apply it in your designs, common misconceptions, and where it fits
          within Bloom's Taxonomy. These are not academic exercises — they are the reasoning
          behind your design choices.
        </p>
      </div>

      {/* ── Theory cards ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        {theories.map((theory) => (
          <TheoryCard key={theory.id} theory={theory} />
        ))}
      </div>
    </div>
  )
}
