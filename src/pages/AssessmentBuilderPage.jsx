import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import {
  ClipboardCheck,
  BookOpen,
  GraduationCap,
  Briefcase,
  Users,
  List,
  ToggleLeft,
  Pencil,
  GitBranch,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react'
import CopyButton from '../components/ui/CopyButton'

const CYAN = { color: '#0891B2', light: '#ECFEFF', border: '#A5F3FC', dark: '#164E63' }

const BLOOM_LEVELS = [
  { id: 'remember',   label: 'Remember',   color: '#D97706', num: 1 },
  { id: 'understand', label: 'Understand',  color: '#EA580C', num: 2 },
  { id: 'apply',      label: 'Apply',       color: '#059669', num: 3 },
  { id: 'analyze',    label: 'Analyze',     color: '#2563EB', num: 4 },
  { id: 'evaluate',   label: 'Evaluate',    color: '#7C3AED', num: 5 },
  { id: 'create',     label: 'Create',      color: '#E11D48', num: 6 },
]

const PURPOSES = [
  { id: 'knowledge-check', label: 'Knowledge Check',  icon: BookOpen,      desc: 'Quick pulse during or after instruction' },
  { id: 'final-assess',    label: 'Final Assessment', icon: GraduationCap, desc: 'Summative measure at end of module or course' },
  { id: 'performance',     label: 'Performance Task', icon: Briefcase,     desc: 'Demonstrate skill in a realistic context' },
  { id: 'scenario',        label: 'Scenario / Case',  icon: Users,         desc: 'Apply judgment to a complex situation' },
]

const FORMATS = [
  {
    id: 'mc',
    label: 'Multiple Choice',
    icon: List,
    desc: 'One correct answer from 3–5 distractors',
    goodFor: ['remember', 'understand', 'apply'],
    okFor: ['analyze'],
    poorFor: ['evaluate', 'create'],
  },
  {
    id: 'tf',
    label: 'True / False',
    icon: ToggleLeft,
    desc: 'Binary correct/incorrect statement',
    goodFor: ['remember'],
    okFor: ['understand'],
    poorFor: ['apply', 'analyze', 'evaluate', 'create'],
  },
  {
    id: 'short-answer',
    label: 'Short Answer',
    icon: Pencil,
    desc: 'Open-ended written response, 1–3 sentences',
    goodFor: ['understand', 'apply', 'analyze'],
    okFor: ['evaluate', 'create'],
    poorFor: ['remember'],
  },
  {
    id: 'scenario',
    label: 'Scenario / Decision',
    icon: GitBranch,
    desc: 'Branching case with multiple decision points',
    goodFor: ['apply', 'analyze', 'evaluate'],
    okFor: ['create'],
    poorFor: ['remember', 'understand'],
  },
  {
    id: 'checklist',
    label: 'Observation Checklist',
    icon: Eye,
    desc: 'Observed performance rated against criteria',
    goodFor: ['apply', 'evaluate', 'create'],
    okFor: ['analyze'],
    poorFor: ['remember', 'understand'],
  },
]

// ── Helpers ──────────────────────────────────────────────────

function parseObjective(text) {
  if (!text.trim()) return null
  // ABCD format: "Given [condition], [audience] will [verb] [behavior]"
  const m = text.match(/given\s+(.+?),\s*(.+?)\s+will\s+(?:be able to\s+)?(\w+)\s+(.+)/i)
  if (m) return { condition: m[1].trim(), audience: m[2].trim(), verb: m[3].trim(), behavior: m[4].trim() }
  // Simpler: "[audience] will [verb] [behavior]"
  const m2 = text.match(/(.+?)\s+will\s+(?:be able to\s+)?(\w+)\s+(.+)/i)
  if (m2) return { condition: null, audience: m2[1].trim(), verb: m2[2].trim(), behavior: m2[3].trim() }
  return { condition: null, audience: null, verb: null, behavior: text.trim() }
}

function getAlignment(bloomLevel, formatId) {
  if (!bloomLevel || !formatId) return null
  const fmt = FORMATS.find(f => f.id === formatId)
  if (!fmt) return null
  if (fmt.goodFor.includes(bloomLevel)) return { status: 'good', label: 'Strong alignment',                    color: '#059669', bg: '#ECFDF5' }
  if (fmt.okFor.includes(bloomLevel))   return { status: 'ok',   label: 'Acceptable alignment',               color: '#D97706', bg: '#FFFBEB' }
  return                                       { status: 'poor',  label: 'Weak alignment — consider a different format', color: '#DC2626', bg: '#FEF2F2' }
}

function generateTemplate(objectiveText, parsed, bloomLevel, purposeId, formatId) {
  const bloom   = BLOOM_LEVELS.find(b => b.id === bloomLevel)
  const purpose = PURPOSES.find(p => p.id === purposeId)
  const format  = FORMATS.find(f => f.id === formatId)
  const p = parsed || {}
  const verb      = p.verb      || '[action verb]'
  const behavior  = p.behavior  || '[behavior from objective]'
  const condition = p.condition || null
  const audience  = p.audience  || 'the learner'
  const aud       = audience.charAt(0).toUpperCase() + audience.slice(1)

  const header = [
    `ASSESSMENT ITEM`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Objective:  ${objectiveText || '[paste objective above]'}`,
    `Bloom's:    ${bloom?.label || '—'} (Level ${bloom?.num || '—'})`,
    `Purpose:    ${purpose?.label || '—'}`,
    `Format:     ${format?.label || '—'}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
  ].join('\n')

  let body = ''

  if (formatId === 'mc') {
    body = [
      `STEM`,
      `${condition ? `Context: ${condition}\n` : ''}Which of the following best demonstrates the ability to ${verb} ${behavior}?`,
      ``,
      `A. [Correct answer — directly aligned to the objective]`,
      `B. [Distractor — plausible but incorrect; addresses a common misconception]`,
      `C. [Distractor — partially correct or out of scope]`,
      `D. [Distractor — clearly wrong but not absurd]`,
      ``,
      `Correct answer: A`,
      ``,
      `DESIGNER NOTES`,
      `• All distractors should be homogeneous in length and structure`,
      `• Avoid "all of the above" or "none of the above"`,
      `• Stem should pose a clear problem, not just ask for a definition`,
    ].join('\n')
  } else if (formatId === 'tf') {
    body = [
      `STATEMENT`,
      `[A precise declarative statement about ${behavior}.]`,
      ``,
      `◯ True     ◯ False`,
      ``,
      `Correct answer: [True / False]`,
      ``,
      `DESIGNER NOTES`,
      `• Statement must be unambiguously true or false — avoid hedging language`,
      `• Test one idea per statement`,
      `• Avoid negatives or double negatives in the statement`,
    ].join('\n')
  } else if (formatId === 'short-answer') {
    body = [
      `PROMPT`,
      `${condition ? `Given the following situation: ${condition}\n\n` : ''}Explain how you would ${verb} ${behavior}. Include [specific criteria, e.g., 2–3 key steps / supporting rationale / a concrete example].`,
      ``,
      `SCORING GUIDE`,
      `3 pts (Full):    Accurately addresses [criterion 1] AND [criterion 2] AND [criterion 3]`,
      `2 pts (Partial): Addresses two of the three criteria`,
      `1 pt  (Minimal): Demonstrates basic understanding with one correct element`,
      `0 pts:           Off-topic, incorrect, or blank`,
      ``,
      `DESIGNER NOTES`,
      `• Define criteria before writing the prompt, not after`,
      `• Specify length expectations to calibrate learner responses`,
      `• Criteria should map directly to the objective's performance standards`,
    ].join('\n')
  } else if (formatId === 'scenario') {
    body = [
      `SCENARIO SETUP`,
      `${aud} is facing the following situation:`,
      `[2–3 sentence realistic context that requires ${verb}ing ${behavior}${condition ? ` — include: ${condition}` : ''}]`,
      ``,
      `DECISION POINT 1`,
      `What should ${audience} do first?`,
      `A. [Correct first action — aligned to objective]`,
      `B. [Common first mistake — skips a step or misapplies a rule]`,
      `C. [Partially correct — starts well but misses a key consideration]`,
      ``,
      `→ If A: [Positive consequence — what happens next; advance to Decision Point 2]`,
      `→ If B: [Realistic negative consequence — redirect with explanation]`,
      `→ If C: [Partial feedback — nudge toward correct thinking]`,
      ``,
      `DECISION POINT 2`,
      `[Follow-on decision based on the first correct choice]`,
      `A. [Option 1]`,
      `B. [Option 2]`,
      `C. [Option 3]`,
      ``,
      `DESIGNER NOTES`,
      `• Each distractor should reflect a realistic error, not an absurd one`,
      `• Consequences should show the natural result of each decision`,
      `• Avoid "gotcha" branching — the goal is learning through experience`,
    ].join('\n')
  } else if (formatId === 'checklist') {
    body = [
      `PERFORMANCE CONTEXT`,
      `Observe ${audience} as they ${verb} ${behavior}${condition ? `, given: ${condition}` : ''}.`,
      ``,
      `OBSERVATION CHECKLIST`,
      `Rate each criterion:  ✓ Met  |  ✗ Not met  |  N/A`,
      ``,
      `□  1. [Observable criterion 1 — specific, measurable behaviour]`,
      `□  2. [Observable criterion 2]`,
      `□  3. [Observable criterion 3]`,
      `□  4. [Observable criterion 4 — includes quality or accuracy standard]`,
      `□  5. [Observable criterion 5]`,
      ``,
      `SCORING`,
      `Pass threshold: _____ of _____ criteria met  (suggested: 4 of 5)`,
      ``,
      `EVALUATOR NOTES`,
      `[Space for qualitative observations and context]`,
      ``,
      `DESIGNER NOTES`,
      `• Each criterion should describe what the evaluator sees, not what they infer`,
      `• Use "learner demonstrates…" or "learner correctly…" language`,
      `• Avoid vague criteria like "understands" or "knows"`,
    ].join('\n')
  }

  return header + body
}

// ── Step header ──────────────────────────────────────────────

function StepHeader({ num, label, done }) {
  return (
      <div className="flex items-center gap-3 mb-4">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
        style={{
          backgroundColor: done ? CYAN.color : '#E2E8F0',
          color: done ? '#fff' : '#64748B',
        }}
      >
        {done ? <CheckCircle2 size={14} /> : num}
      </div>
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{label}</h2>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────

export default function AssessmentBuilderPage() {
  const [objectiveText, setObjectiveText] = useState('')
  const [bloomLevel, setBloomLevel]       = useState(null)
  const [purposeId, setPurposeId]         = useState(null)
  const [formatId, setFormatId]           = useState(null)

  const parsed    = objectiveText.trim() ? parseObjective(objectiveText) : null
  const alignment = getAlignment(bloomLevel, formatId)
  const isComplete = objectiveText.trim() && bloomLevel && purposeId && formatId
  const template   = isComplete
    ? generateTemplate(objectiveText.trim(), parsed, bloomLevel, purposeId, formatId)
    : null

  const stepsDone = [
    !!objectiveText.trim(),
    !!bloomLevel,
    !!purposeId,
    !!formatId,
  ]
  const anyStarted = stepsDone.some(Boolean)

  return (
    <div>
      <SEOHead
        title="Assessment Builder"
        description="Build Bloom's-aligned assessments in 4 steps: match your objective, cognitive level, assessment purpose, and item format. Free tool for IDs."
        path="/assessment-builder"
      />
      {/* ── Banner ──────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0C4A6E 0%, #075985 60%, #0369A1 100%)' }}
      >
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: '#0891B2' }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15 blur-2xl"
          style={{ backgroundColor: '#0EA5E9' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(8,145,178,0.4)' }}
            >
              <ClipboardCheck size={20} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Assessment Builder
            </h1>
          </div>
          <p className="text-base max-w-xl" style={{ color: '#BAE6FD' }}>
            Paste a learning objective, select the Bloom's level and question format, and get a
            pre-populated assessment item template — with alignment checking built in.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Step 1: Objective ────────────────────────────── */}
        <div
          className="bg-white rounded-xl border border-gray-200 p-5"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <StepHeader num="1" label="Paste Your Learning Objective" done={!!objectiveText.trim()} />
          <textarea
            value={objectiveText}
            onChange={(e) => setObjectiveText(e.target.value)}
            placeholder="e.g. Given a real customer complaint, the learner will apply active listening techniques to de-escalate the situation within 3 minutes."
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />
          <p className="mt-2 text-xs text-gray-400">
            Tip: ABCD format works best —{' '}
            <span className="font-medium text-gray-500">
              Given [condition], [audience] will [verb] [behavior].
            </span>
          </p>
          {/* Parsed preview */}
          {parsed && (
            <div
              className="mt-3 rounded-lg px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3"
              style={{ backgroundColor: CYAN.light, border: `1px solid ${CYAN.border}` }}
            >
              {[
                { label: 'Condition', val: parsed.condition },
                { label: 'Audience',  val: parsed.audience },
                { label: 'Verb',      val: parsed.verb },
                { label: 'Behavior',  val: parsed.behavior },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: CYAN.dark }}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-600 leading-snug">
                    {val || <span className="italic text-gray-400">not detected</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Step 2: Bloom's level ─────────────────────────── */}
        <div
          className="bg-white rounded-xl border border-gray-200 p-5"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <StepHeader num="2" label="Select Bloom's Cognitive Level" done={!!bloomLevel} />
          <div className="flex flex-wrap gap-2">
            {BLOOM_LEVELS.map((b) => (
              <button
                key={b.id}
                onClick={() => setBloomLevel(bloomLevel === b.id ? null : b.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all hover:-translate-y-0.5"
                style={
                  bloomLevel === b.id
                    ? { backgroundColor: b.color, borderColor: b.color, color: '#fff' }
                    : { backgroundColor: `${b.color}12`, borderColor: `${b.color}35`, color: b.color }
                }
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{
                    backgroundColor: bloomLevel === b.id ? 'rgba(255,255,255,0.25)' : `${b.color}22`,
                  }}
                >
                  {b.num}
                </span>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 3: Purpose ──────────────────────────────── */}
        <div
          className="bg-white rounded-xl border border-gray-200 p-5"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <StepHeader num="3" label="Select Assessment Purpose" done={!!purposeId} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PURPOSES.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => setPurposeId(purposeId === id ? null : id)}
                className="rounded-lg border-2 p-3 text-left transition-all hover:-translate-y-0.5"
                style={
                  purposeId === id
                    ? { borderColor: CYAN.color, backgroundColor: CYAN.light }
                    : { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }
                }
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: purposeId === id ? CYAN.color : '#CBD5E1' }}
                >
                  <Icon size={14} className="text-white" />
                </div>
                <p className="text-xs font-bold text-gray-700 mb-0.5">{label}</p>
                <p className="text-xs text-gray-400 leading-snug">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 4: Format ────────────────────────────────── */}
        <div
          className="bg-white rounded-xl border border-gray-200 p-5"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <StepHeader num="4" label="Select Question Format" done={!!formatId} />
          {!bloomLevel && (
            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
              <Info size={12} /> Select a Bloom's level above to see alignment indicators for each format.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FORMATS.map(({ id, label, icon: Icon, desc }) => {
              const align = bloomLevel ? getAlignment(bloomLevel, id) : null
              return (
                <button
                  key={id}
                  onClick={() => setFormatId(formatId === id ? null : id)}
                  className="rounded-lg border-2 p-3 text-left transition-all hover:-translate-y-0.5"
                  style={
                    formatId === id
                      ? { borderColor: CYAN.color, backgroundColor: CYAN.light }
                      : { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }
                  }
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: formatId === id ? CYAN.color : '#CBD5E1' }}
                      >
                        <Icon size={14} className="text-white" />
                      </div>
                      <p className="text-xs font-bold text-gray-700">{label}</p>
                    </div>
                    {align && (
                      <span
                        className="text-xs font-black px-1.5 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: align.bg, color: align.color }}
                      >
                        {align.status === 'good' ? '✓' : align.status === 'ok' ? '~' : '✗'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-snug">{desc}</p>
                  {align && (
                    <p className="text-xs mt-1.5 font-semibold" style={{ color: align.color }}>
                      {align.label}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Output panel ──────────────────────────────────── */}
        {isComplete && template && (
          <div
            className="rounded-xl border-2 p-5"
            style={{ borderColor: CYAN.border, backgroundColor: CYAN.light }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} style={{ color: CYAN.color }} />
                <h2 className="font-bold text-gray-800">Generated Template</h2>
              </div>
              <CopyButton text={template} />
            </div>

            {/* Alignment callout */}
            {alignment && (
              <div
                className="rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2 text-sm font-medium"
                style={{
                  backgroundColor: alignment.bg,
                  color: alignment.color,
                  border: `1px solid ${alignment.color}40`,
                }}
              >
                {alignment.status === 'good' && <CheckCircle2 size={15} />}
                {alignment.status === 'ok'   && <AlertTriangle size={15} />}
                {alignment.status === 'poor' && <XCircle size={15} />}
                {alignment.label}
              </div>
            )}

            <pre className="text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-4 border border-gray-200 overflow-x-auto">
              {template}
            </pre>
          </div>
        )}

        {/* ── Progress hint (shown when partially complete) ── */}
        {!isComplete && anyStarted && (
          <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center">
            <p className="text-sm text-gray-400 mb-3">
              Complete all four steps to generate your assessment template.
            </p>
            <div className="flex justify-center flex-wrap gap-2">
              {["Objective", "Bloom's", 'Purpose', 'Format'].map((s, i) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: stepsDone[i] ? '#ECFDF5' : '#F1F5F9',
                    color: stepsDone[i] ? '#059669' : '#94A3B8',
                  }}
                >
                  {stepsDone[i] ? '✓' : '○'} {s}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
