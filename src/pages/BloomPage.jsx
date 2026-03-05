import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import bloomLevels from '../data/bloom-levels.json'
import CopyButton from '../components/ui/CopyButton'

const TEAL = { color: '#0D9488', light: '#F0FDFA', border: '#99F6E4', dark: '#0F766E' }

// ─── Quick reference text (copyable) ───────────────────────────────────────────

const QUICK_REF_TEXT = `BLOOM'S TAXONOMY QUICK REFERENCE
==================================
Level | Name       | Cognitive Demand                         | Sample Verbs
------|------------|------------------------------------------|----------------------------------------------
  1   | Remember   | Retrieve facts and terms from memory     | Define, List, Recall, Identify, Name
  2   | Understand | Explain ideas in your own words          | Explain, Summarize, Describe, Classify
  3   | Apply      | Use knowledge to perform a task          | Demonstrate, Execute, Solve, Implement
  4   | Analyze    | Break down and find patterns/connections | Compare, Contrast, Examine, Distinguish
  5   | Evaluate   | Justify a decision or course of action   | Assess, Critique, Recommend, Justify
  6   | Create     | Produce new or original work             | Design, Develop, Construct, Formulate

DESIGN RULE OF THUMB
---------------------
If the job requires doing → aim for Apply (Level 3) at minimum.
If the job requires deciding or diagnosing → aim for Analyze (Level 4).
If the job requires recommending or judging → aim for Evaluate (Level 5).
Remember and Understand alone are almost never sufficient for performance change.`

// ─── Level card ────────────────────────────────────────────────────────────────

function LevelCard({ level }) {
  const [expanded, setExpanded] = useState(false)

  return (
      <div
      id={`level-${level.slug}`}
      className="border rounded-xl overflow-hidden bg-white transition-shadow duration-150"
      style={{
        borderColor: expanded ? level.color : '#E5E7EB',
        boxShadow: expanded ? `0 4px 20px ${level.color}25` : undefined,
      }}
    >
      {/* Header — always visible */}
      <button
        className="w-full text-left focus:outline-none"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ backgroundColor: level.color }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-white/30 tabular-nums leading-none w-6">
              {level.number}
            </span>
            <span className="font-extrabold text-white text-base tracking-wide">
              {level.name}
            </span>
          </div>
          <div className="text-white/70">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* Summary row */}
        <div
          className="px-5 py-3 border-b"
          style={{ backgroundColor: level.bg, borderColor: `${level.color}30` }}
        >
          <p className="text-sm font-medium leading-snug" style={{ color: level.text }}>
            {level.cognitiveDemand}
          </p>
          {/* Verb chips — compact preview */}
          <div className="flex flex-wrap gap-1 mt-2">
            {level.verbs.slice(0, 6).map((v) => (
              <span
                key={v}
                className="px-2 py-0.5 rounded text-xs font-semibold"
                style={{ backgroundColor: `${level.color}18`, color: level.color }}
              >
                {v}
              </span>
            ))}
            {level.verbs.length > 6 && (
              <span
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ color: '#9CA3AF' }}
              >
                +{level.verbs.length - 6} more
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 py-5 space-y-5">

          {/* All verbs */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Action Verbs
            </p>
            <div className="flex flex-wrap gap-1.5">
              {level.verbs.map((v) => (
                <span
                  key={v}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold border"
                  style={{
                    backgroundColor: level.bg,
                    borderColor: `${level.color}50`,
                    color: level.text,
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Example objective */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Example Objective
            </p>
            <div
              className="rounded-lg border-l-4 px-4 py-3 text-sm leading-relaxed italic"
              style={{
                borderLeftColor: level.color,
                backgroundColor: level.bg,
                color: level.text,
              }}
            >
              {level.exampleObjective}
            </div>
          </div>

          {/* Example assessment */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Example Assessment
            </p>
            <div className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: level.color }} />
              <p>{level.exampleAssessment}</p>
            </div>
          </div>

          {/* Example activity */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Example Instructional Activity
            </p>
            <div className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: level.color }} />
              <p>{level.exampleActivity}</p>
            </div>
          </div>

          {/* Designer note */}
          <div
            className="rounded-lg border px-4 py-3 text-sm"
            style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Design Note
            </p>
            <p className="text-gray-700 leading-relaxed">{level.designNote}</p>
          </div>

          {/* Link to Objectives Builder */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setExpanded(false)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronUp size={13} />
              Collapse
            </button>
            <Link
              to="/objectives"
              className="flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: level.color }}
            >
              Use this level in Objectives Builder
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BloomPage() {
  return (
    <div>
      <SEOHead
        title="Bloom's Taxonomy"
        description="All 6 levels of Bloom's Taxonomy with action verbs, assessment examples, and instructional design implications. The reference IDs actually use."
        path="/bloom"
      />
      {/* ── Header banner ────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #D97706 0%, #EA580C 30%, #059669 55%, #2563EB 75%, #7C3AED 90%, #E11D48 100%)',
        }}
      >
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Bloom's Taxonomy
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>
            Six levels of cognitive complexity. The level you target determines the verb you
            choose, the activity you design, and the assessment you write.
          </p>
        </div>
      </div>

      {/* ── Level quick-nav chips ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {bloomLevels.map((level) => (
          <a
            key={level.id}
            href={`#level-${level.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all hover:scale-105"
            style={{
              backgroundColor: level.bg,
              borderColor: `${level.color}50`,
              color: level.color,
            }}
          >
            <span className="font-black opacity-50">{level.number}</span>
            {level.name}
          </a>
        ))}
      </div>

      {/* ── Introduction ─────────────────────────────────────────────── */}
      <div className="mb-8 space-y-3 text-gray-700 text-sm leading-relaxed">
        <p>
          Bloom's Taxonomy — formally the <em>Revised Taxonomy of Educational Objectives</em> — is a
          hierarchical framework that classifies learning by cognitive complexity. It was originally
          developed by Benjamin Bloom in 1956 and revised by Anderson and Krathwohl in 2001. The
          revised version, which practitioners use today, uses action verbs rather than nouns and
          reorders the top two levels.
        </p>
        <p>
          For instructional designers, Bloom's serves three practical purposes: it helps you{' '}
          <strong>choose the right verb</strong> when writing objectives, it tells you{' '}
          <strong>what kind of activity or assessment</strong> aligns with your target level, and it
          prevents the most common design failure — writing objectives at Remember or Understand when
          the job requires Apply or higher.
        </p>
      </div>

      {/* ── The six levels ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">The Six Levels</h2>
        <span className="text-xs text-gray-400 font-medium">Click any level to expand</span>
      </div>
      <div className="space-y-3 mb-10">
        {bloomLevels.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>

      {/* ── Revised vs. Original ─────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: TEAL.color }} />
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Revised vs. Original Taxonomy
          </h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 font-bold text-gray-600">Level</th>
                <th className="text-left px-4 py-2.5 font-bold text-gray-600">
                  Original (1956, noun)
                </th>
                <th className="text-left px-4 py-2.5 font-bold text-gray-600">
                  Revised (2001, verb)
                </th>
                <th className="text-left px-4 py-2.5 font-bold text-gray-600">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['1', 'Knowledge', 'Remember', 'Renamed'],
                ['2', 'Comprehension', 'Understand', 'Renamed'],
                ['3', 'Application', 'Apply', 'Renamed'],
                ['4', 'Analysis', 'Analyze', 'Renamed'],
                ['5', 'Synthesis', 'Create', 'Renamed + moved to top'],
                ['6', 'Evaluation', 'Evaluate', 'Renamed + moved below Create'],
              ].map(([num, orig, rev, note]) => (
                <tr key={num} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-bold text-gray-400 tabular-nums">{num}</td>
                  <td className="px-4 py-2.5 text-gray-500 line-through">{orig}</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-800">{rev}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          The revised taxonomy also introduced a second dimension — the{' '}
          <em>Knowledge Dimension</em> (Factual, Conceptual, Procedural, Metacognitive) — but
          practitioners primarily use the cognitive process dimension shown above.
        </p>
      </section>

      {/* ── Decision guide ───────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: TEAL.color }} />
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            How to Choose the Right Level
          </h2>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Match the Bloom's level to what the job actually requires — not to what's easiest to teach
          or assess. Start by asking: what will learners be doing on the job? Then work backward to
          the level that matches that performance.
        </p>
        <div className="space-y-2">
          {[
            {
              condition: 'Learner needs to recall a term, fact, or rule verbatim',
              level: 'Remember (1)',
              color: '#D97706',
              bg: '#FFFBEB',
            },
            {
              condition: 'Learner needs to explain a concept or process to someone else',
              level: 'Understand (2)',
              color: '#EA580C',
              bg: '#FFF7ED',
            },
            {
              condition: 'Learner needs to follow a procedure, operate a tool, or handle a situation',
              level: 'Apply (3)',
              color: '#059669',
              bg: '#ECFDF5',
            },
            {
              condition: 'Learner needs to diagnose, troubleshoot, or compare options',
              level: 'Analyze (4)',
              color: '#2563EB',
              bg: '#EFF6FF',
            },
            {
              condition: 'Learner needs to make a judgment, recommend a course of action, or review others\' work',
              level: 'Evaluate (5)',
              color: '#7C3AED',
              bg: '#F5F3FF',
            },
            {
              condition: 'Learner needs to build something new — a plan, design, product, or curriculum',
              level: 'Create (6)',
              color: '#E11D48',
              bg: '#FFF1F2',
            },
          ].map(({ condition, level, color, bg }) => (
            <div
              key={level}
              className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm"
              style={{ borderColor: `${color}30`, backgroundColor: bg }}
            >
              <ArrowRight size={14} className="shrink-0" style={{ color }} />
              <span className="flex-1 text-gray-700">{condition}</span>
              <span
                className="shrink-0 font-bold text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: `${color}20`, color }}
              >
                → {level}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Common mistake ───────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: TEAL.color }} />
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Common Mistake</h2>
        </div>
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border-b border-red-100">
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 bg-red-600">
              ✗
            </span>
            <p className="text-sm font-semibold text-red-900">
              Training is designed at Remember or Understand, but the job requires Apply or higher.
            </p>
          </div>
          <div className="flex items-start gap-3 px-4 py-3 bg-emerald-50">
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 bg-emerald-600">
              ✓
            </span>
            <p className="text-sm text-emerald-900">
              Most workplace training should target Apply (Level 3) at minimum. If a learner's job
              involves doing, deciding, or judging — not just knowing — design to the level the job
              requires. Objectives that use verbs like "identify" or "describe" for skills that
              require "demonstrate" or "assess" on the job guarantee a transfer gap.
            </p>
          </div>
        </div>
        <div
          className="mt-3 rounded-lg border px-4 py-3 flex items-start gap-2"
          style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
        >
          <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
          <p className="text-xs text-amber-800">
            <strong>Rule of thumb:</strong> If your objective says "learners will be able to{' '}
            <em>understand</em> X," ask yourself — does the job actually require understanding, or
            does it require applying? "Understanding" rarely changes behavior on its own.
          </p>
        </div>
      </section>

      {/* ── Quick reference copyable card ────────────────────────────── */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: TEAL.color }} />
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Quick Reference
            </h2>
          </div>
          <CopyButton text={QUICK_REF_TEXT} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 overflow-x-auto">
          <pre className="text-xs text-gray-700 font-mono leading-relaxed whitespace-pre">
            {QUICK_REF_TEXT}
          </pre>
        </div>
      </section>
    </div>
  )
}
