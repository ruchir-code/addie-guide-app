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

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
        {title}
      </h2>
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

  return (
    <div>
      {/* Phase header */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
          style={{ backgroundColor: `${data.color}18`, color: data.color }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          {data.label} Phase
        </div>
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ color: data.color }}
        >
          {data.label}
        </h1>
        <p className="text-gray-500 text-lg">{data.tagline}</p>
        <div
          className="mt-4 h-1 rounded-full w-16"
          style={{ backgroundColor: data.color }}
        />
      </div>

      {/* What It Is */}
      <Section title="What It Is">
        <p className="text-gray-700 leading-relaxed">{data.whatItIs[contentLevel]}</p>
      </Section>

      {/* Why It Matters */}
      <Section title="Why It Matters">
        <p className="text-gray-700 leading-relaxed">{data.whyItMatters[contentLevel]}</p>
      </Section>

      {/* Key Questions */}
      <Section title="Key Questions to Ask">
        <ul className="space-y-2">
          {data.keyQuestions.map((q, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: data.color }}
              >
                {i + 1}
              </span>
              <span className="text-gray-700 text-sm leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Outputs */}
      <Section title="Key Outputs">
        <ul className="space-y-1.5">
          {data.outputs.map((output, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: data.color }}
              />
              {output}
            </li>
          ))}
        </ul>
      </Section>

      {/* Common Mistakes */}
      <Section title="Common Mistakes">
        <div className="space-y-3">
          {data.commonMistakes.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-100 overflow-hidden"
            >
              <div className="flex items-start gap-2 px-4 py-3 bg-red-50">
                <span className="text-red-500 font-bold text-sm shrink-0">✗</span>
                <p className="text-sm font-semibold text-red-800">{item.mistake}</p>
              </div>
              <div className="flex items-start gap-2 px-4 py-3 bg-green-50">
                <span className="text-green-500 font-bold text-sm shrink-0">✓</span>
                <p className="text-sm text-green-800">{item.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Checklist */}
      <Checklist phase={phase} items={checklist} color={data.color} />
    </div>
  )
}
