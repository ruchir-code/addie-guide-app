import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import { Zap, ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from 'lucide-react'
import topics from '../data/transfer.json'

const COLOR = {
  color: '#7C3AED',
  light: '#F5F3FF',
  border: '#DDD6FE',
  dark: '#5B21B6',
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

function TransferTypeCard({ type }) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden mb-3">
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{ backgroundColor: type.color }}
      >
        <span className="font-extrabold text-white text-sm">{type.type}</span>
      </div>
      <div className="bg-white px-4 py-4 space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">{type.description}</p>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1.5">Examples</p>
          <ul className="space-y-1.5">
            {type.examples.map((ex, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: type.color }} />
                {ex}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1.5">Design Strategies</p>
          <ul className="space-y-1.5">
            {type.designStrategies.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: type.color }} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-lg border px-3 py-2.5"
          style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
        >
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">When It Fails</p>
          <p className="text-sm text-red-900 leading-relaxed">{type.whenItFails}</p>
        </div>
      </div>
    </div>
  )
}

function ConditionCard({ condition }) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden mb-3">
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{ backgroundColor: condition.color }}
      >
        <span className="font-extrabold text-white text-sm">{condition.name}</span>
      </div>
      <div className="bg-white px-4 py-4 space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">{condition.description}</p>

        <div
          className="rounded-lg border px-3 py-2.5"
          style={{ backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}
        >
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Design Application</p>
          <p className="text-sm text-emerald-900 leading-relaxed">{condition.designApplication}</p>
        </div>

        <div
          className="rounded-lg border px-3 py-2.5"
          style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
        >
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Evidence</p>
          <p className="text-sm text-indigo-900 leading-relaxed">{condition.evidence}</p>
        </div>
      </div>
    </div>
  )
}

function TransferPhaseCard({ phase }) {
  const phaseColors = {
    'Before Training': { bg: '#FEF2F2', border: '#FECACA', label: '#DC2626' },
    'During Training': { bg: '#FFF7ED', border: '#FED7AA', label: '#EA580C' },
    'After Training':  { bg: '#ECFDF5', border: '#A7F3D0', label: '#059669' },
  }
  const pc = phaseColors[phase.phase] || phaseColors['Before Training']

  return (
    <div className="rounded-xl border overflow-hidden mb-4">
      <div className="px-4 py-3" style={{ backgroundColor: phase.color }}>
        <p className="text-sm font-extrabold text-white">{phase.phase}</p>
        <p className="text-xs text-white/75 mt-0.5 leading-snug">{phase.rationale}</p>
      </div>
      <div className="bg-white px-4 py-4 space-y-4">
        {phase.actions.map((action, i) => (
          <div key={i} className="rounded-lg border overflow-hidden" style={{ borderColor: pc.border }}>
            <div className="px-3 py-2" style={{ backgroundColor: pc.bg }}>
              <p className="text-sm font-bold" style={{ color: pc.label }}>{action.action}</p>
            </div>
            <div className="px-3 py-3 space-y-2">
              <p className="text-sm text-gray-700 leading-relaxed">{action.description}</p>
              <div
                className="rounded-lg border px-3 py-2"
                style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
              >
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">How To</p>
                <p className="text-sm text-gray-700 leading-relaxed">{action.howTo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopicCard({ topic }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      id={`tl-${topic.slug}`}
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
            <span className="text-xs font-black text-white/50 tabular-nums w-6">{topic.number}</span>
            <span className="font-extrabold text-white text-sm tracking-wide">{topic.name}</span>
            <span
              className="hidden sm:inline-flex text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
            >
              {topic.theorists.join(' · ')}
            </span>
          </div>
          <div className="text-white/70">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        <div className="px-5 py-3 flex items-start gap-3">
          <Zap size={15} className="shrink-0 mt-0.5" style={{ color: COLOR.color }} />
          <div>
            <p className="text-sm text-gray-700 font-medium leading-snug">{topic.tagline}</p>
            <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{topic.theorists.join(' · ')}</p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5">
          <Section title="What It Is" color={COLOR.color}>
            <p className="text-sm text-gray-700 leading-relaxed">{topic.whatItIs}</p>
          </Section>

          {topic.types && (
            <Section title="Transfer Types" color={COLOR.color}>
              {topic.types.map((t) => (
                <TransferTypeCard key={t.type} type={t} />
              ))}
            </Section>
          )}

          {topic.conditions && (
            <Section title="Conditions for Transfer" color={COLOR.color}>
              {topic.conditions.map((c) => (
                <ConditionCard key={c.name} condition={c} />
              ))}
            </Section>
          )}

          {topic.phases && (
            <Section title="Transfer Design Strategies" color={COLOR.color}>
              {topic.phases.map((p) => (
                <TransferPhaseCard key={p.phase} phase={p} />
              ))}
            </Section>
          )}

          <Section title="Common Misconceptions" color={COLOR.color}>
            <div className="space-y-3">
              {topic.commonMisconceptions.map((item, i) => (
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

          <Section title="When to Use" color={COLOR.color}>
            <ul className="space-y-2">
              {topic.whenToUse.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: COLOR.color }} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {topic.relatedTerms?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Related Concepts</p>
              <div className="flex flex-wrap gap-2">
                {topic.relatedTerms.map((term) => (
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
            className="mt-2 flex items-center gap-1.5 text-xs font-medium"
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

export default function TransferPage() {
  return (
    <div>
      <SEOHead
        title="Transfer of Learning"
        description="Near and far transfer, conditions for transfer, and evidence-based design strategies. What every instructional designer should know about making training stick."
        path="/transfer"
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
            <Zap size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Transfer of Learning
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Training that doesn't transfer is just activity. These frameworks help you design
            learning that actually changes what people do on the job.
          </p>
        </div>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-6">
        {topics.map((t) => (
          <a
            key={t.id}
            href={`#tl-${t.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 border"
            style={{
              backgroundColor: `${COLOR.color}15`,
              color: COLOR.dark,
              borderColor: `${COLOR.color}40`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR.color }} />
            {t.name}
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
          <strong>How to use this section:</strong> Click any card to expand the full reference.
          Start with Near vs. Far Transfer to understand what type of transfer your program needs.
          Use Conditions for Transfer to select the right learning strategies. Apply Designing for
          Transfer to build a before/during/after ecosystem around your training event.
        </p>
      </div>

      {/* Topic cards */}
      <div className="space-y-4">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  )
}
