import { useParams, Navigate } from 'react-router-dom'
import { useLevel } from '../context/LevelContext'
import Checklist from '../components/checklist/Checklist'

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

export default function PhasePage() {
  const { phase } = useParams()
  const { level } = useLevel()

  const entry = PHASE_DATA[phase]
  if (!entry) return <Navigate to="/" replace />

  const { data, checklist } = entry
  const contentLevel = level === 'advanced' ? 'advanced' : 'beginner'
  const number = PHASE_NUMBERS[phase] || ''

  return (
    <div>
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

        <div className="relative z-10">
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
      </div>

      {/* ── What It Is ─────────────────────────────────────────────── */}
      <Section title="What It Is" color={data.color}>
        <p className="text-gray-700 leading-relaxed">{data.whatItIs[contentLevel]}</p>
      </Section>

      {/* ── Why It Matters ─────────────────────────────────────────── */}
      <Section title="Why It Matters" color={data.color}>
        <p className="text-gray-700 leading-relaxed">{data.whyItMatters[contentLevel]}</p>
      </Section>

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

      {/* ── Checklist ──────────────────────────────────────────────── */}
      <Checklist phase={phase} items={checklist} color={data.color} />
    </div>
  )
}
