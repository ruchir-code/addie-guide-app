import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import { Briefcase, ChevronDown, ChevronUp, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react'
import topics from '../data/performance-consulting.json'

const COLOR = {
  color: '#C2410C',
  light: '#FFF7ED',
  border: '#FED7AA',
  dark: '#9A3412',
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

function DecisionFlow({ questions }) {
  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{ backgroundColor: `${COLOR.color}12` }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0"
              style={{ backgroundColor: COLOR.color }}
            >
              {i + 1}
            </span>
            <p className="text-sm font-semibold text-gray-800">{q.question}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            <div className="px-4 py-3 bg-emerald-50">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Yes →
              </p>
              <p className="text-sm text-emerald-900 leading-relaxed">{q.yesPath}</p>
            </div>
            <div className="px-4 py-3 bg-orange-50">
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
                No →
              </p>
              <p className="text-sm text-orange-900 leading-relaxed">{q.noPath}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function NonTrainingSolutions({ solutions }) {
  return (
    <div className="space-y-2">
      {solutions.map((s, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 px-4 py-3 bg-white">
          <ArrowRight size={14} className="shrink-0 mt-0.5" style={{ color: COLOR.color }} />
          <div>
            <p className="text-sm font-semibold text-gray-800">{s.cause}</p>
            <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{s.solution}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function RCATechniques({ techniques }) {
  return (
    <div className="space-y-4">
      {techniques.map((t, i) => (
        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
          <div
            className="px-4 py-2.5"
            style={{ backgroundColor: `${COLOR.color}12` }}
          >
            <p className="text-sm font-extrabold text-gray-800">{t.name}</p>
          </div>
          <div className="px-4 py-4 space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">{t.description}</p>

            {t.example && (
              <div
                className="rounded-lg border px-3 py-3"
                style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
              >
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                  Example: {t.example.problem}
                </p>
                <div className="space-y-1">
                  {t.example.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-amber-600 shrink-0 mt-0.5">
                        {j + 1}.
                      </span>
                      <p className={`text-sm leading-relaxed ${j === t.example.steps.length - 1 ? 'font-semibold text-amber-900' : 'text-amber-800'}`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {t.categories && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Six Branches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {t.categories.map((c, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium"
                      style={{ backgroundColor: COLOR.light, borderColor: COLOR.border, color: COLOR.dark }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div
              className="rounded-lg border px-3 py-2.5"
              style={{ backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}
            >
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Tip</p>
              <p className="text-sm text-emerald-900 leading-relaxed">{t.tip}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function BEMMatrix({ environmental, individual, keyInsight }) {
  const rowColor = (i) => ['#DC2626', '#EA580C', '#059669'][i]
  const indivColor = (i) => ['#2563EB', '#7C3AED', '#6B7280'][i]

  function FactorCard({ factor, color }) {
    return (
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: `${color}18` }}>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <p className="text-sm font-extrabold text-gray-800">{factor.factor}</p>
        </div>
        <div className="px-4 py-3 bg-white space-y-2">
          <p className="text-xs italic text-gray-500">{factor.question}</p>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Common signs</p>
            <ul className="space-y-1">
              {factor.examples.map((ex, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-lg border px-3 py-2"
            style={{ backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}
          >
            <p className="text-xs text-emerald-800 leading-relaxed">
              <span className="font-bold">Solution: </span>{factor.solution}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Environmental Factors (fix these first)
        </p>
        <div className="space-y-3">
          {environmental.map((f, i) => (
            <FactorCard key={f.factor} factor={f} color={rowColor(i)} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Individual Factors
        </p>
        <div className="space-y-3">
          {individual.map((f, i) => (
            <FactorCard key={f.factor} factor={f} color={indivColor(i)} />
          ))}
        </div>
      </div>
      <div
        className="rounded-xl border px-4 py-3"
        style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
      >
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
          Gilbert's Key Insight
        </p>
        <p className="text-sm text-indigo-900 leading-relaxed">{keyInsight}</p>
      </div>
    </div>
  )
}

function TopicCard({ topic }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      id={`pc-${topic.slug}`}
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
          <Briefcase size={15} className="shrink-0 mt-0.5" style={{ color: COLOR.color }} />
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

          {topic.decisionQuestions && (
            <Section title="Decision Questions" color={COLOR.color}>
              <DecisionFlow questions={topic.decisionQuestions} />
            </Section>
          )}

          {topic.nonTrainingSolutions && (
            <Section title="Non-Training Solutions" color={COLOR.color}>
              <NonTrainingSolutions solutions={topic.nonTrainingSolutions} />
            </Section>
          )}

          {topic.techniques && (
            <Section title="Techniques" color={COLOR.color}>
              <RCATechniques techniques={topic.techniques} />
            </Section>
          )}

          {topic.matrixEnvironmental && (
            <Section title="The BEM Matrix" color={COLOR.color}>
              <BEMMatrix
                environmental={topic.matrixEnvironmental}
                individual={topic.matrixIndividual}
                keyInsight={topic.keyInsight}
              />
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

export default function PerformanceConsultingPage() {
  return (
    <div>
      <SEOHead
        title="Performance Consulting"
        description="When training isn't the answer. Gilbert's BEM, root cause analysis, and non-training interventions for instructional designers."
        path="/performance-consulting"
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
            <Briefcase size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Performance Consulting
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Before designing a single slide, answer this: is this actually a training problem?
            The frameworks here help you diagnose root causes and recommend the right solution.
          </p>
        </div>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-6">
        {topics.map((t) => (
          <a
            key={t.id}
            href={`#pc-${t.slug}`}
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
          Start with Training vs. Non-Training to validate whether a learning solution is appropriate.
          Use Root Cause Analysis to diagnose the specific cause. Apply Gilbert's BEM to decide
          where to invest — training is only one of six performance factors.
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
