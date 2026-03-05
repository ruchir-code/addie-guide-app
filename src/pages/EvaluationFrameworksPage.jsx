import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import { TrendingUp, ChevronDown, ChevronUp, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react'
import frameworks from '../data/evaluation-frameworks.json'

const COLOR = {
  color: '#0369A1',
  light: '#F0F9FF',
  border: '#BAE6FD',
  dark: '#075985',
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

function LevelCard({ level }) {
  return (
    <div className="rounded-xl border overflow-hidden mb-3">
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ backgroundColor: level.color }}
      >
        <span className="text-xs font-black text-white/60 tabular-nums w-5">
          {String(level.number).padStart(2, '0')}
        </span>
        <span className="font-extrabold text-white text-sm">{level.name}</span>
      </div>
      <div className="bg-white px-4 py-4 space-y-3">
        <p className="text-xs font-semibold italic text-gray-500">{level.question}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{level.description}</p>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1.5">Methods</p>
          <div className="flex flex-wrap gap-1.5">
            {level.methods.map((m, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full border font-medium"
                style={{ backgroundColor: COLOR.light, borderColor: COLOR.border, color: COLOR.dark }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg border px-3 py-2.5"
          style={{ backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}
        >
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Design Implication</p>
          <p className="text-sm text-emerald-900 leading-relaxed">{level.designImplication}</p>
        </div>

        <div
          className="rounded-lg border px-3 py-2.5"
          style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
        >
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Common Pitfall</p>
          <p className="text-sm text-red-900 leading-relaxed">{level.pitfall}</p>
        </div>
      </div>
    </div>
  )
}

function FrameworkCard({ fw }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      id={`fw-${fw.slug}`}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-shadow duration-150"
      style={{ boxShadow: expanded ? `0 4px 20px ${COLOR.color}20` : undefined }}
    >
      <button
        className="w-full text-left focus:outline-none"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ backgroundColor: COLOR.color }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-white/50 tabular-nums w-6">{fw.number}</span>
            <span className="font-extrabold text-white text-sm tracking-wide">{fw.name}</span>
            <span
              className="hidden sm:inline-flex text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
            >
              {fw.theorists.join(' · ')}
            </span>
          </div>
          <div className="text-white/70">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        <div className="px-5 py-3 flex items-start gap-3">
          <TrendingUp size={15} className="shrink-0 mt-0.5" style={{ color: COLOR.color }} />
          <div>
            <p className="text-sm text-gray-700 font-medium leading-snug">{fw.tagline}</p>
            <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{fw.theorists.join(' · ')}</p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5">
          <Section title="What It Is" color={COLOR.color}>
            <p className="text-sm text-gray-700 leading-relaxed">{fw.whatItIs}</p>
          </Section>

          <Section title="Evaluation Levels" color={COLOR.color}>
            {fw.levels.map((level) => (
              <LevelCard key={level.number} level={level} />
            ))}
          </Section>

          <Section title="When to Use" color={COLOR.color}>
            <ul className="space-y-2">
              {fw.whenToUse.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: COLOR.color }} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Common Misconceptions" color={COLOR.color}>
            <div className="space-y-3">
              {fw.commonMisconceptions.map((item, i) => (
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

          {fw.relatedTerms?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Related Concepts</p>
              <div className="flex flex-wrap gap-2">
                {fw.relatedTerms.map((term) => (
                  <span
                    key={term}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border"
                    style={{ backgroundColor: COLOR.light, borderColor: COLOR.border, color: COLOR.dark }}
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setExpanded(false)}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: COLOR.color }}
          >
            <ChevronUp size={13} />
            Collapse
          </button>
        </div>
      )}
    </div>
  )
}

export default function EvaluationFrameworksPage() {
  return (
    <div>
      <SEOHead
        title="Evaluation Frameworks"
        description="Practitioner guide to Kirkpatrick's 4 levels, Phillips ROI, and the CIPP model. Choose and apply training evaluation frameworks that fit your context."
        path="/evaluation-frameworks"
      />
      {/* Header */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ backgroundColor: COLOR.color }}
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={20} className="text-white/80" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Foundations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
            Evaluation Frameworks
          </h1>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            How do you know if training worked? These frameworks answer that question — from learner
            reaction all the way to financial return on investment.
          </p>
        </div>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-6">
        {frameworks.map((fw) => (
          <a
            key={fw.id}
            href={`#fw-${fw.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 border"
            style={{
              backgroundColor: `${COLOR.color}15`,
              color: COLOR.dark,
              borderColor: `${COLOR.color}40`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR.color }} />
            {fw.name}
          </a>
        ))}
      </div>

      {/* Intro callout */}
      <div
        className="rounded-xl border px-4 py-4 mb-8 flex items-start gap-3"
        style={{ backgroundColor: COLOR.light, borderColor: COLOR.border }}
      >
        <Lightbulb size={18} className="shrink-0 mt-0.5" style={{ color: COLOR.dark }} />
        <p className="text-sm leading-relaxed" style={{ color: COLOR.dark }}>
          <strong>How to use this section:</strong> Click any framework card to expand the full
          reference. Each entry covers what the framework measures, each evaluation level with its
          methods and design implications, when to use it, and the most common misconceptions. Use
          Kirkpatrick or Phillips for most programs; CIPP for complex multi-phase initiatives.
        </p>
      </div>

      {/* Framework cards */}
      <div className="space-y-4">
        {frameworks.map((fw) => (
          <FrameworkCard key={fw.id} fw={fw} />
        ))}
      </div>
    </div>
  )
}
