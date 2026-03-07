import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLevel } from '../context/LevelContext'
import Checklist from '../components/checklist/Checklist'

function InlineLevelToggle({ color }) {
  const { level, toggle } = useLevel()
  const isAdvanced = level === 'advanced'
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      aria-label={`Switch to ${isAdvanced ? 'Beginner' : 'Intermediate'} mode`}
    >
      <div
        className="relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
        style={{ backgroundColor: isAdvanced ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full shadow transition duration-200 ${
            isAdvanced ? 'translate-x-4' : 'translate-x-0 bg-white'
          }`}
          style={isAdvanced ? { backgroundColor: color } : {}}
        />
      </div>
      <span className="text-xs font-semibold text-white/90 whitespace-nowrap inline-block min-w-[5.5rem]">
        {isAdvanced ? 'Intermediate' : 'Beginner'}
      </span>
    </button>
  )
}

// Static imports so Vite bundles them at build time
import analysisData from '../data/phases/analysis.json'
import designData from '../data/phases/design.json'
import developData from '../data/phases/develop.json'
import implementData from '../data/phases/implement.json'
import evaluateData from '../data/phases/evaluate.json'

import analysisChecklist from '../data/checklists/analysis.json'
import designChecklist from '../data/checklists/design.json'
import developChecklist from '../data/checklists/develop.json'
import implementChecklist from '../data/checklists/implement.json'
import evaluateChecklist from '../data/checklists/evaluate.json'

const PHASE_DATA = {
  analysis:  { data: analysisData,  checklist: analysisChecklist },
  design:    { data: designData,    checklist: designChecklist },
  develop:   { data: developData,   checklist: developChecklist },
  implement: { data: implementData, checklist: implementChecklist },
  evaluate:  { data: evaluateData,  checklist: evaluateChecklist },
}

const PHASE_NUMBERS = {
  analysis: '01', design: '02', develop: '03', implement: '04', evaluate: '05',
}

// Visual config per insight type
const INSIGHT_CONFIG = {
  'rule-breaker': {
    label: 'When to break this rule',
    bg: '#FFFBEB', border: '#FDE68A', labelColor: '#92400E', labelBg: '#FEF3C7',
  },
  'tool-tip': {
    label: 'In the tools',
    bg: '#ECFEFF', border: '#A5F3FC', labelColor: '#164E63', labelBg: '#CFFAFE',
  },
  'edge-case': {
    label: 'Edge case',
    bg: '#F8FAFC', border: '#CBD5E1', labelColor: '#334155', labelBg: '#E2E8F0',
  },
  'model-link': {
    label: 'See also',
    bg: '#EEF2FF', border: '#C7D2FE', labelColor: '#312E81', labelBg: '#E0E7FF',
  },
}

function Section({ title, color, children }) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-1 h-6 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function CaseStudyCallout({ caseStudy }) {
  const [open, setOpen] = useState(false)
  if (!caseStudy) return null
  return (
    <div className="mb-8 rounded-xl border-2 overflow-hidden" style={{ borderColor: '#D97706' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ backgroundColor: '#FFFBEB' }}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap"
            style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
          >
            See This in Practice
          </span>
          <span className="text-sm font-semibold" style={{ color: '#78350F' }}>
            Meridian Manufacturing
          </span>
        </div>
        {open
          ? <ChevronUp size={15} style={{ color: '#D97706' }} className="shrink-0" />
          : <ChevronDown size={15} style={{ color: '#D97706' }} className="shrink-0" />
        }
      </button>
      {open && (
        <div className="px-4 py-5 bg-white space-y-4" style={{ borderTop: '1px solid #FDE68A' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>Situation</p>
            <p className="text-sm text-gray-700 leading-relaxed">{caseStudy.situation}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>Approach</p>
            <p className="text-sm text-gray-700 leading-relaxed">{caseStudy.approach}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>Outcome</p>
            <p className="text-sm text-gray-700 leading-relaxed">{caseStudy.outcome}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function AdvancedInsights({ insights }) {
  if (!insights?.length) return null
  return (
    <Section title="Intermediate Insights" color="#7C3AED">
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const cfg = INSIGHT_CONFIG[insight.type] || INSIGHT_CONFIG['edge-case']
          return (
            <div
              key={i}
              className="rounded-xl border p-4"
              style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5 whitespace-nowrap"
                  style={{ backgroundColor: cfg.labelBg, color: cfg.labelColor }}
                >
                  {cfg.label}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">{insight.heading}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.body}</p>
                  {insight.link && (
                    <Link
                      to={insight.link}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-semibold"
                      style={{ color: cfg.labelColor }}
                    >
                      View Instructional Models →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

const PHASE_SEO = {
  analysis:  { title: 'Analysis Phase',  description: 'Master the Analysis phase of ADDIE. Needs assessment, audience analysis, learning gap identification, and a full checklist for instructional designers.' },
  design:    { title: 'Design Phase',    description: 'Write learning objectives, sequence content, and select instructional strategies. ADDIE Design phase checklist and Meridian Manufacturing case study.' },
  develop:   { title: 'Develop Phase',   description: 'Build storyboards, prototypes, and course content. ADDIE Develop phase checklist and case study for instructional designers.' },
  implement: { title: 'Implement Phase', description: 'Facilitator prep, pilot testing, and rollout. ADDIE Implement phase checklist and launch planning for instructional designers.' },
  evaluate:  { title: 'Evaluate Phase',  description: 'Formative and summative evaluation, Kirkpatrick alignment, and continuous improvement. ADDIE Evaluate phase checklist for instructional designers.' },
}

export default function PhasePage() {
  const { phase } = useParams()
  const { level } = useLevel()

  const entry = PHASE_DATA[phase]
  if (!entry) return <Navigate to="/" replace />

  const { data, checklist } = entry
  const contentLevel = level === 'advanced' ? 'advanced' : 'beginner'
  const number = PHASE_NUMBERS[phase] || ''
  const seo = PHASE_SEO[phase] || {}

  return (
    <div>
      <SEOHead
        title={seo.title}
        description={seo.description}
        path={`/${phase}`}
      />
      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm mb-4">
        <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 font-medium">{data.label}</span>
      </nav>

      {/* ── Full-width coloured phase header ───────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ backgroundColor: data.color }}
      >
        {/* Decorative circle */}
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />
        <div
          className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />

        <div key={phase} className="relative z-10 animate-fade-in-up">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-5xl font-black text-white/20 leading-none block mb-1">
                {number}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                {data.label}
              </h1>
              <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {data.tagline}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Content Level
              </span>
              <InlineLevelToggle color={data.color} />
            </div>
          </div>
        </div>
      </div>

      {/* ── What It Is ─────────────────────────────────────────────── */}
      <Section title="What It Is" color={data.color}>
        <p className="text-gray-700 leading-relaxed">{data.whatItIs[contentLevel]}</p>
      </Section>

      {/* ── Why It Matters ─────────────────────────────────────────── */}
      <Section title="Why It Matters" color={data.color}>
        <p className="text-gray-700 leading-relaxed">{data.whyItMatters[contentLevel]}</p>
      </Section>

      {/* ── Case Study ──────────────────────────────────────────────── */}
      {data.caseStudy && <CaseStudyCallout caseStudy={data.caseStudy} />}

      {/* ── Key Questions ──────────────────────────────────────────── */}
      <Section title="Key Questions to Ask" color={data.color}>
        <ul className="space-y-2">
          {data.keyQuestions.map((q, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                style={{ backgroundColor: data.color }}
              >
                {i + 1}
              </span>
              <span className="text-gray-700 text-sm leading-relaxed pt-0.5">{q}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Key Outputs ────────────────────────────────────────────── */}
      <Section title="Key Outputs" color={data.color}>
        <ul className="space-y-2">
          {data.outputs.map((output, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span
                className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: data.color }}
              />
              {output}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Common Mistakes ────────────────────────────────────────── */}
      <Section title="Common Mistakes" color={data.color}>
        <div className="space-y-3">
          {data.commonMistakes.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 overflow-hidden"
            >
              <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border-b border-red-100">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                  style={{ backgroundColor: '#DC2626' }}
                >
                  ✗
                </span>
                <p className="text-sm font-semibold text-red-900">{item.mistake}</p>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 bg-emerald-50">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                  style={{ backgroundColor: '#059669' }}
                >
                  ✓
                </span>
                <p className="text-sm text-emerald-900">{item.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Intermediate Insights (advanced mode only) ─────────────── */}
      {contentLevel === 'advanced' && data.advancedInsights && (
        <AdvancedInsights insights={data.advancedInsights} />
      )}

      {/* ── Checklist ──────────────────────────────────────────────── */}
      <Checklist phase={phase} items={checklist} color={data.color} level={contentLevel} />
    </div>
  )
}
