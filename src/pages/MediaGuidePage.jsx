import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import {
  Monitor, Users, Video, Zap, Film, FileText, Layers, Headphones,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, RotateCcw, ArrowRight,
} from 'lucide-react'
import mediaFormats from '../data/media-formats.json'

// ─── Constants ──────────────────────────────────────────────────────────────

const AMBER = { color: '#D97706', light: '#FFFBEB', border: '#FDE68A', dark: '#78350F' }

const ICON_MAP = { Monitor, Users, Video, Zap, Film, FileText, Layers, Headphones }

const BLOOM_CHIP_COLORS = {
  remember:   { bg: '#FFFBEB', text: '#92400E', border: '#D97706' },
  understand: { bg: '#FFF7ED', text: '#7C2D12', border: '#EA580C' },
  apply:      { bg: '#ECFDF5', text: '#064E3B', border: '#059669' },
  analyze:    { bg: '#EFF6FF', text: '#1E3A8A', border: '#2563EB' },
  evaluate:   { bg: '#F5F3FF', text: '#4C1D95', border: '#7C3AED' },
  create:     { bg: '#FFF1F2', text: '#881337', border: '#E11D48' },
}

// ─── Decision tree ──────────────────────────────────────────────────────────
//
// Each node has: question, hint, options[]
// Each option has: label, next (string key or null), result (slug[] when null)

const DECISION_TREE = {
  start: {
    question: "What is the learner's primary need?",
    hint: "Think about the job task — what actually happens at the moment of performance?",
    options: [
      { label: 'Build or practice a new skill', next: 'step2', result: null },
      { label: 'Reference information while doing the task', next: null, result: ['job-aid', 'microlearning'] },
      { label: 'Gain awareness or knowledge (no practice required)', next: 'step3', result: null },
    ],
  },
  step2: {
    question: 'How complex is the skill?',
    hint: "Procedural skills have right answers. Judgment skills require weighing options and coaching.",
    options: [
      { label: 'Procedural — predictable steps with a clear right answer', next: 'step2a', result: null },
      { label: 'Judgment-based — requires coaching, discussion, or nuanced feedback', next: 'step2b', result: null },
    ],
  },
  step2a: {
    question: 'Is consistent, scalable delivery important?',
    hint: "Think about audience size and whether learners are in different locations or time zones.",
    options: [
      { label: 'Yes — large or distributed audience', next: null, result: ['elearning', 'microlearning'] },
      { label: 'No — small group, live delivery is feasible', next: null, result: ['ilt', 'vilt', 'blended'] },
    ],
  },
  step2b: {
    question: 'Where is your audience located?',
    hint: "Judgment skills need live interaction — the question is which kind.",
    options: [
      { label: 'Remote / distributed', next: null, result: ['vilt', 'blended'] },
      { label: 'In-person / co-located', next: null, result: ['ilt', 'blended'] },
      { label: 'Mixed or varies by cohort', next: null, result: ['blended'] },
    ],
  },
  step3: {
    question: 'How much time and attention can learners give?',
    hint: "Awareness content can be delivered lightweight — but it will not build skills on its own.",
    options: [
      { label: 'Short — mobile-first, low time investment', next: null, result: ['microlearning', 'video', 'podcast'] },
      { label: 'Standard — they can sit through a full module', next: null, result: ['elearning', 'video'] },
    ],
  },
}

// ─── Decision Guide ─────────────────────────────────────────────────────────

function DecisionGuide({ onResult }) {
  const [currentKey, setCurrentKey] = useState('start')
  const [history, setHistory] = useState([])
  const [result, setResult] = useState(null)

  const node = DECISION_TREE[currentKey]

  function choose(option) {
    if (option.next) {
      setHistory(prev => [...prev, currentKey])
      setCurrentKey(option.next)
    } else {
      setResult(option.result)
      onResult(option.result)
    }
  }

  function back() {
    if (result) {
      setResult(null)
      onResult(null)
      return
    }
    if (history.length) {
      const prev = history[history.length - 1]
      setHistory(h => h.slice(0, -1))
      setCurrentKey(prev)
    }
  }

  function reset() {
    setCurrentKey('start')
    setHistory([])
    setResult(null)
    onResult(null)
  }

  if (result) {
    return (
      <div className="rounded-xl border-2 p-5" style={{ borderColor: AMBER.color, backgroundColor: AMBER.light }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold" style={{ color: AMBER.dark }}>
            Recommended formats for your situation
          </p>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs font-medium hover:opacity-80"
            style={{ color: AMBER.color }}
          >
            <RotateCcw size={12} /> Start over
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {result.map(slug => {
            const fmt = mediaFormats.find(f => f.slug === slug)
            if (!fmt) return null
            const Icon = ICON_MAP[fmt.icon] || Monitor
            return (
              <a
                key={slug}
                href={`#format-${slug}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: AMBER.color }}
              >
                <Icon size={13} />
                {fmt.name}
              </a>
            )
          })}
        </div>
        <p className="text-xs mb-2" style={{ color: AMBER.dark }}>
          These formats are highlighted below — expand any card for full guidance.
        </p>
        <button
          onClick={back}
          className="text-xs hover:underline"
          style={{ color: AMBER.color }}
        >
          ← Change last answer
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-5" style={{ borderColor: AMBER.border, backgroundColor: AMBER.light }}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: AMBER.color }}>
          Format Selector
        </p>
        {history.length > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs font-medium hover:opacity-80"
            style={{ color: AMBER.color }}
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      <p className="text-base font-bold text-gray-900 mb-1 mt-2">{node.question}</p>
      {node.hint && <p className="text-xs text-gray-500 mb-4">{node.hint}</p>}

      <div className="flex flex-col gap-2">
        {node.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => choose(opt)}
            className="text-left px-4 py-3 rounded-lg border border-amber-200 bg-white text-sm font-medium text-gray-700 hover:border-amber-400 hover:bg-amber-50 transition-colors flex items-center justify-between group"
          >
            <span>{opt.label}</span>
            <ArrowRight size={14} className="text-gray-400 group-hover:text-amber-600 shrink-0 ml-2" />
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <button
          onClick={back}
          className="mt-3 text-xs hover:underline"
          style={{ color: AMBER.color }}
        >
          ← Back
        </button>
      )}
    </div>
  )
}

// ─── Format Card ────────────────────────────────────────────────────────────

function FormatCard({ format, highlighted }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = ICON_MAP[format.icon] || Monitor

  return (
    <div
      id={`format-${format.slug}`}
      className="rounded-xl border bg-white transition-all duration-200 scroll-mt-4"
      style={highlighted
        ? { borderColor: AMBER.color, boxShadow: `0 0 0 2px ${AMBER.border}` }
        : { borderColor: '#E2E8F0' }
      }
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: highlighted ? AMBER.color : '#F1F5F9' }}
          >
            <Icon size={18} style={{ color: highlighted ? '#fff' : '#64748B' }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 text-sm">{format.name}</p>
              {highlighted && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: AMBER.color, color: '#fff' }}
                >
                  Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{format.tagline}</p>
          </div>
        </div>
        <div className="shrink-0 ml-3">
          {expanded
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />
          }
        </div>
      </button>

      {/* Collapsed preview — 3 use / 2 not-use bullets */}
      {!expanded && (
        <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-green-700 mb-1.5 flex items-center gap-1">
              <CheckCircle2 size={11} /> Use when
            </p>
            <ul className="space-y-1">
              {format.whenToUse.slice(0, 3).map((item, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0 text-green-500 font-bold">✓</span>{item}
                </li>
              ))}
              {format.whenToUse.length > 3 && (
                <li className="text-xs text-gray-400 italic">+{format.whenToUse.length - 3} more…</li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-red-700 mb-1.5 flex items-center gap-1">
              <XCircle size={11} /> Not when
            </p>
            <ul className="space-y-1">
              {format.whenNotToUse.slice(0, 2).map((item, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0 text-red-400 font-bold">✗</span>{item}
                </li>
              ))}
              {format.whenNotToUse.length > 2 && (
                <li className="text-xs text-gray-400 italic">+{format.whenNotToUse.length - 2} more…</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Expanded — full detail */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-5">

          {/* Use / Not-use */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> When to use
              </p>
              <ul className="space-y-1.5">
                {format.whenToUse.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-green-500 font-bold">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1">
                <XCircle size={12} /> When NOT to use
              </p>
              <ul className="space-y-1.5">
                {format.whenNotToUse.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-red-500 font-bold">✗</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bloom's levels */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Best-fit Bloom's levels
            </p>
            <div className="flex flex-wrap gap-1.5">
              {format.bloomsLevels.map(level => {
                const c = BLOOM_CHIP_COLORS[level]
                if (!c) return null
                return (
                  <span
                    key={level}
                    className="px-2 py-0.5 rounded-full text-xs font-semibold border"
                    style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Strengths / Limitations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Strengths</p>
              <ul className="space-y-1.5">
                {format.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5 font-bold" style={{ color: AMBER.color }}>●</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Limitations</p>
              <ul className="space-y-1.5">
                {format.limitations.map((l, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5 text-gray-400 font-bold">●</span>{l}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Designer note */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Designer note</p>
            <p className="text-sm text-gray-700 leading-relaxed">{format.designerNote}</p>
          </div>

          {/* Typical tools */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Common tools</p>
            <div className="flex flex-wrap gap-1.5">
              {format.typicalTools.map(tool => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function MediaGuidePage() {
  const [recommendedSlugs, setRecommendedSlugs] = useState(null)

  return (
    <div>
      <SEOHead
        title="Media & Format Selection Guide"
        description="Choose the right training delivery format. Compares e-learning, ILT, VILT, job aids, and 5 more formats with a Format Selector decision tool."
        path="/media-guide"
      />
      {/* Header banner */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)' }}
      >
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: '#FDE68A' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Monitor size={18} className="text-amber-300" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Media & Format Selection Guide
            </h1>
          </div>
          <p className="text-sm max-w-xl" style={{ color: '#FDE68A' }}>
            Eight delivery formats explained — when to use each one, when not to, and how to choose.
            Start with the Format Selector or browse all formats below.
          </p>
        </div>
      </div>

      {/* Quick-nav chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {mediaFormats.map(fmt => {
          const Icon = ICON_MAP[fmt.icon] || Monitor
          return (
            <a
              key={fmt.slug}
              href={`#format-${fmt.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
              style={{ backgroundColor: AMBER.light, color: AMBER.dark, borderColor: AMBER.border }}
            >
              <Icon size={11} />
              {fmt.name}
            </a>
          )
        })}
      </div>

      {/* Section 1: Decision guide */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ backgroundColor: AMBER.color }}
          >
            1
          </span>
          Use the Format Selector to find your best fit
        </h2>
        <DecisionGuide onResult={setRecommendedSlugs} />
      </div>

      {/* Section 2: All format cards */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ backgroundColor: AMBER.color }}
          >
            2
          </span>
          All delivery formats
        </h2>

        {recommendedSlugs && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-xs font-medium border"
            style={{ backgroundColor: AMBER.light, borderColor: AMBER.border, color: AMBER.dark }}
          >
            Showing {recommendedSlugs.length} recommended format{recommendedSlugs.length > 1 ? 's' : ''} highlighted — all 8 formats are listed below.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {mediaFormats.map(fmt => (
            <FormatCard
              key={fmt.slug}
              format={fmt}
              highlighted={recommendedSlugs?.includes(fmt.slug) ?? false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
