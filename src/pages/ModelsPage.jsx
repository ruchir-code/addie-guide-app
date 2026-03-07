import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import { Link } from 'react-router-dom'
import {
  Network, GitBranch, RefreshCw, FileCheck, Box, Repeat,
  ChevronDown, ChevronUp, CheckCircle2, XCircle, ArrowRight, ExternalLink,
} from 'lucide-react'
import idModels from '../data/id-models.json'

// ─── Constants ──────────────────────────────────────────────────────────────

const INDIGO = { color: '#4338CA', light: '#EEF2FF', border: '#C7D2FE', dark: '#312E81' }

const ICON_MAP = { GitBranch, RefreshCw, FileCheck, Box, Repeat }

// Comparison table dimensions — what we display for each model
const COMPARE_DIMS = [
  { key: 'structure',           label: 'Structure' },
  { key: 'changeToleranceLevel', label: 'Change Tolerance' },
  { key: 'relativeSpeed',       label: 'Time to First Deliverable' },
  { key: 'documentationLevel',  label: 'Documentation Load' },
]

// Decision guide rows: context → recommended models
const DECISION_ROWS = [
  {
    context: 'Complex, high-stakes project — first time running it',
    recommend: ['addie', 'dick-carey'],
  },
  {
    context: 'Tight deadline, requirements likely to shift',
    recommend: ['sam', 'rapid-prototyping'],
  },
  {
    context: 'Formal certification or compliance mandate with audit trail',
    recommend: ['dick-carey', 'addie'],
  },
  {
    context: 'Stakeholders need to see something before they can give meaningful feedback',
    recommend: ['rapid-prototyping', 'sam'],
  },
  {
    context: 'Content changes frequently; tech-first organization',
    recommend: ['agile-id'],
  },
  {
    context: 'Standard L&D team, moderate complexity, typical timeline',
    recommend: ['addie'],
  },
]

// ─── Model Card ─────────────────────────────────────────────────────────────

function ModelCard({ model }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = ICON_MAP[model.icon] || GitBranch

  return (
      <div
      id={`model-${model.slug}`}
      className="rounded-xl border bg-white scroll-mt-4"
      style={{ borderColor: '#E2E8F0' }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: INDIGO.light }}
          >
            <Icon size={20} style={{ color: INDIGO.color }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-extrabold text-gray-900">{model.name}</p>
              {model.fullName !== model.name && (
                <p className="text-xs text-gray-400 font-normal">{model.fullName}</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{model.tagline}</p>
          </div>
        </div>
        <div className="shrink-0 ml-4">
          {expanded
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />
          }
        </div>
      </button>

      {/* Collapsed: quick stats + truncated what-it-is */}
      {!expanded && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
            {model.whatItIs}
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Structure', val: model.structure },
              { label: 'Change tolerance', val: model.changeToleranceLevel },
              { label: 'Speed', val: model.relativeSpeed },
              { label: 'Docs', val: model.documentationLevel },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">{label}:</span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: INDIGO.light, color: INDIGO.color }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded: full detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-5">

          {/* What it is */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">What it is</p>
            <p className="text-sm text-gray-700 leading-relaxed">{model.whatItIs}</p>
            <p className="text-xs text-gray-400 mt-2 italic">Origin: {model.origin}</p>
          </div>

          {/* Key phases / steps */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Key phases / steps
            </p>
            <div className="space-y-2">
              {model.phases.map((phase, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 text-xs font-black px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: INDIGO.light, color: INDIGO.color }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{phase.name}</span>
                    <span className="text-sm text-gray-500"> — {phase.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pros / Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> Pros
              </p>
              <ul className="space-y-1.5">
                {model.pros.map((p, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-green-500 font-bold">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1">
                <XCircle size={12} /> Cons
              </p>
              <ul className="space-y-1.5">
                {model.cons.map((c, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-red-500 font-bold">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* When to use / not */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p className="text-xs font-bold text-green-800 mb-1.5">Use when</p>
              <p className="text-sm text-green-900 leading-relaxed">{model.whenToUse}</p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-xs font-bold text-red-800 mb-1.5">Don't use when</p>
              <p className="text-sm text-red-900 leading-relaxed">{model.whenNotToUse}</p>
            </div>
          </div>

          {/* ADDIE connection link */}
          {model.addieConnection && (
            <div
              className="rounded-lg p-4 flex items-start gap-3"
              style={{ backgroundColor: INDIGO.light, border: `1px solid ${INDIGO.border}` }}
            >
              <ExternalLink size={14} style={{ color: INDIGO.color }} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: INDIGO.dark }}>
                  See ADDIE in practice
                </p>
                <p className="text-sm" style={{ color: INDIGO.color }}>
                  {model.addieConnection}{' '}
                  <Link to="/analysis" style={{ color: INDIGO.color }} className="underline font-medium">
                    Start with Analysis →
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Comparison Table ────────────────────────────────────────────────────────

function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: INDIGO.light }}>
            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 w-40">
              Dimension
            </th>
            {idModels.map(m => (
              <th
                key={m.slug}
                className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                style={{ color: INDIGO.color }}
              >
                {m.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_DIMS.map((dim, ri) => (
            <tr
              key={dim.key}
              className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-3 text-xs font-semibold text-gray-500 align-top">
                {dim.label}
              </td>
              {idModels.map(m => (
                <td key={m.slug} className="px-4 py-3 text-sm text-gray-700 align-top">
                  {m[dim.key]}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-white border-t border-gray-200">
            <td className="px-4 py-3 text-xs font-semibold text-gray-500 align-top">Best for</td>
            {idModels.map(m => (
              <td key={m.slug} className="px-4 py-3 text-sm text-gray-700 align-top">
                <a
                  href={`#model-${m.slug}`}
                  className="text-xs font-medium underline"
                  style={{ color: INDIGO.color }}
                >
                  See card above ↑
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ─── Decision Guide ─────────────────────────────────────────────────────────

function DecisionGuide() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: INDIGO.light }}>
            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Your situation
            </th>
            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: INDIGO.color }}>
              Consider
            </th>
          </tr>
        </thead>
        <tbody>
          {DECISION_ROWS.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 text-sm text-gray-700">{row.context}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {row.recommend.map(slug => {
                    const model = idModels.find(m => m.slug === slug)
                    if (!model) return null
                    return (
                      <a
                        key={slug}
                        href={`#model-${slug}`}
                        className="px-2.5 py-1 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-80"
                        style={{ backgroundColor: INDIGO.color }}
                      >
                        {model.name}
                      </a>
                    )
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ModelsPage() {
  return (
    <div>
      <SEOHead
        title="Instructional Design Models"
        description="Compare ADDIE, SAM, Agile ID, Dick & Carey, and Kemp. Myth-busting guidance for choosing the right ID model for your project."
        path="/models"
      />
      {/* Header banner */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #312E81 0%, #3730A3 50%, #4338CA 100%)' }}
      >
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: '#A5B4FC' }}
        />
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <Network size={18} className="text-indigo-300" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Instructional Models
            </h1>
          </div>
          <p className="text-sm max-w-xl" style={{ color: '#C7D2FE' }}>
            ADDIE, SAM, Dick &amp; Carey, Rapid Prototyping, and Agile ID — compared side by side
            so you can choose the right model for your project, not the one you always default to.
          </p>
        </div>
      </div>

      {/* Quick-nav chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {idModels.map(m => {
          const Icon = ICON_MAP[m.icon] || GitBranch
          return (
            <a
              key={m.slug}
              href={`#model-${m.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
              style={{ backgroundColor: INDIGO.light, color: INDIGO.dark, borderColor: INDIGO.border }}
            >
              <Icon size={11} />
              {m.name}
            </a>
          )
        })}
      </div>

      {/* Common misconception callout */}
      <div
        className="rounded-xl p-5 mb-8 border"
        style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
          Common misconception
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-red-500 font-black shrink-0 mt-0.5">✗</span>
            <span className="text-gray-500 italic">"ADDIE is outdated — modern teams should use Agile ID instead."</span>
          </p>
          <p className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-green-600 font-black shrink-0 mt-0.5">✓</span>
            <span>
              ADDIE remains the most widely used ID model because it works for the majority of
              projects. The "ADDIE is dead" narrative comes from tech organizations applying software
              Agile culture to L&amp;D contexts — valid in those contexts, but not universal. Every
              model in this guide is the right model for a specific set of conditions. Choose based
              on your project, not on what is trending.
            </span>
          </p>
        </div>
      </div>

      {/* Model cards */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ backgroundColor: INDIGO.color }}
          >
            1
          </span>
          The five models
        </h2>
        <div className="flex flex-col gap-4">
          {idModels.map(m => (
            <ModelCard key={m.slug} model={m} />
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ backgroundColor: INDIGO.color }}
          >
            2
          </span>
          Side-by-side comparison
        </h2>
        <ComparisonTable />
      </div>

      {/* Decision guide */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ backgroundColor: INDIGO.color }}
          >
            3
          </span>
          Which model should I use?
        </h2>
        <p className="text-xs text-gray-500 mb-3 ml-7">
          Match your project context to a starting recommendation — then read the full card.
        </p>
        <DecisionGuide />
      </div>

      {/* ADDIE deep-dive link */}
      <div
        className="rounded-xl p-5 flex items-start gap-4"
        style={{ backgroundColor: INDIGO.light, border: `1px solid ${INDIGO.border}` }}
      >
        <Network size={20} style={{ color: INDIGO.color }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: INDIGO.dark }}>
            Using ADDIE? This app covers it in depth.
          </p>
          <p className="text-sm text-gray-600 mb-3">
            Each of the five ADDIE phases has its own full reference page — checklists, common
            mistakes, key deliverables, and practical guidance.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { to: '/analysis',  label: 'Analysis',  color: '#DC2626' },
              { to: '/design',    label: 'Design',    color: '#EA580C' },
              { to: '/develop',   label: 'Develop',   color: '#059669' },
              { to: '/implement', label: 'Implement', color: '#9333EA' },
              { to: '/evaluate',  label: 'Evaluate',  color: '#2563EB' },
            ].map(({ to, label, color }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: color }}
              >
                {label} <ArrowRight size={11} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
