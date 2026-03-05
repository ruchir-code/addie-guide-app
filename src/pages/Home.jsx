import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import {
  Search,
  Layers,
  Code2,
  PlayCircle,
  BarChart2,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Target,
  FileText,
  BookOpen,
  Brain,
  GraduationCap,
  Monitor,
  Network,
  ClipboardCheck,
  ListChecks,
  GitBranch,
  Users2,
  TrendingUp,
  Briefcase,
  Zap,
  Bot,
} from 'lucide-react'
import { PHASES as PHASE_DATA } from '../utils/colors'

// Each ADDIE letter maps to its phase colour
const HERO_LETTERS = [
  { letter: 'A', color: '#DC2626' },
  { letter: 'D', color: '#EA580C' },
  { letter: 'D', color: '#059669' },
  { letter: 'I', color: '#9333EA' },
  { letter: 'E', color: '#2563EB' },
]

const HERO_STATS = [
  { value: '5',   label: 'Full Phases',     sub: 'Checklists, deep-dives & case studies' },
  { value: '86+', label: 'Glossary Terms',  sub: 'Plain-English ID definitions' },
  { value: '14',  label: 'Templates',       sub: 'Copy-ready, zero formatting needed' },
  { value: '8',   label: 'Tools & Guides',   sub: 'Objectives, quizzes, scenario guide & more' },
]

const ICON_MAP = {
  analysis: Search,
  design: Layers,
  develop: Code2,
  implement: PlayCircle,
  evaluate: BarChart2,
}

const PHASES = PHASE_DATA.map((p) => ({ ...p, icon: ICON_MAP[p.slug] }))

const TOOLS = [
  {
    to: '/objectives',
    label: 'Outcomes & Objectives',
    desc: "Build your CLO → TLO → ELO hierarchy with Bloom's verbs and coverage mapping",
    icon: Target,
    style: { backgroundColor: '#EDE9FE', borderColor: '#8B5CF6', color: '#5B21B6' },
    iconBg: '#7C3AED',
  },
  {
    to: '/templates',
    label: 'Template Library',
    desc: '14 copy-ready ID templates organised by ADDIE phase',
    icon: FileText,
    style: { backgroundColor: '#FFF7ED', borderColor: '#EA580C', color: '#9A3412' },
    iconBg: '#EA580C',
  },
  {
    to: '/glossary',
    label: 'Glossary',
    desc: '86+ plain-English definitions for ID terms',
    icon: BookOpen,
    style: { backgroundColor: '#ECFDF5', borderColor: '#059669', color: '#065F46' },
    iconBg: '#059669',
  },
  {
    to: '/media-guide',
    label: 'Media & Format Guide',
    desc: 'Eight delivery formats with a decision guide — e-learning, ILT, VILT, job aids, and more',
    icon: Monitor,
    style: { backgroundColor: '#FFFBEB', borderColor: '#D97706', color: '#78350F' },
    iconBg: '#D97706',
  },
  {
    to: '/assessment-builder',
    label: 'Assessment Builder',
    desc: 'Paste an objective, select Bloom\'s level and format, generate a pre-populated assessment template',
    icon: ClipboardCheck,
    style: { backgroundColor: '#ECFEFF', borderColor: '#0891B2', color: '#164E63' },
    iconBg: '#0891B2',
  },
  {
    to: '/scenario-guide',
    label: 'Scenario Writing Guide',
    desc: 'Four scenario types, writing triggers and decision points, common mistakes, and a Scenario Starter Tool',
    icon: GitBranch,
    style: { backgroundColor: '#FFF1EE', borderColor: '#FDBA74', color: '#7C2D12' },
    iconBg: '#C2410C',
  },
  {
    to: '/quiz',
    label: 'ID Self-Assessment',
    desc: 'Two quizzes: identify which ADDIE phase needs work, or benchmark your level from Beginner to Senior ID',
    icon: ListChecks,
    style: { backgroundColor: '#F5F3FF', borderColor: '#C4B5FD', color: '#4C1D95' },
    iconBg: '#7C3AED',
  },
  {
    to: '/sme-guide',
    label: 'SME Management Guide',
    desc: 'Discovery interviews, extracting tacit knowledge, review cycles, scope creep, and navigating difficult SMEs',
    icon: Users2,
    style: { backgroundColor: '#FFF1F2', borderColor: '#FECDD3', color: '#881337' },
    iconBg: '#BE185D',
  },
]

const FOUNDATIONS = [
  {
    to: '/theories',
    label: 'Learning Theories',
    desc: 'Behaviorism, Cognitivism, Constructivism, Andragogy, CLT, and more — the science behind design decisions',
    icon: Brain,
    style: { backgroundColor: '#F0FDFA', borderColor: '#5EEAD4', color: '#0F766E' },
    iconBg: '#0D9488',
  },
  {
    to: '/bloom',
    label: "Bloom's Taxonomy",
    desc: 'All six cognitive levels with verbs, example objectives, assessments, and activities — plus a copyable quick-reference table',
    icon: GraduationCap,
    style: { backgroundColor: '#F0FDFA', borderColor: '#5EEAD4', color: '#0F766E' },
    iconBg: '#0D9488',
  },
  {
    to: '/models',
    label: 'Instructional Models',
    desc: 'ADDIE, SAM, Dick & Carey, Rapid Prototyping, and Agile ID — compared side by side with a decision guide',
    icon: Network,
    style: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', color: '#312E81' },
    iconBg: '#4338CA',
  },
  {
    to: '/evaluation-frameworks',
    label: 'Evaluation Frameworks',
    desc: 'Kirkpatrick, Phillips ROI, and CIPP — the frameworks for measuring training effectiveness and business impact',
    icon: TrendingUp,
    style: { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', color: '#075985' },
    iconBg: '#0369A1',
  },
  {
    to: '/performance-consulting',
    label: 'Performance Consulting',
    desc: 'Training vs. non-training solutions, root cause analysis, and Gilbert\'s Behavior Engineering Model',
    icon: Briefcase,
    style: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA', color: '#9A3412' },
    iconBg: '#C2410C',
  },
  {
    to: '/transfer',
    label: 'Transfer of Learning',
    desc: 'Near/far transfer, conditions for transfer, and before/during/after design strategies for lasting on-the-job performance',
    icon: Zap,
    style: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', color: '#5B21B6' },
    iconBg: '#7C3AED',
  },
  {
    to: '/ai-in-id',
    label: 'AI in Instructional Design',
    desc: 'AI at each ADDIE phase — practical prompts, ethical guardrails, and what not to outsource to a language model',
    icon: Bot,
    style: { backgroundColor: '#EEF2FF', borderColor: '#A5B4FC', color: '#312E81' },
    iconBg: '#6366F1',
  },
]

export default function Home() {
  return (
    <div>
      <SEOHead
        description="A free practitioner-first reference for instructional designers. Covers the full ADDIE process, Bloom's Taxonomy, learning theories, objectives builder, and ID tools — all in one place."
        path="/"
      />
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl mb-8 relative overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(140deg, #080D1A 0%, #0F172A 25%, #1A1040 55%, #1E1B4B 80%, #0D1324 100%)',
          padding: '3rem 2.5rem 2.75rem',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#7C3AED' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#2563EB' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#059669' }}
        />

        <div className="relative z-10 flex flex-col gap-8">
          {/* Overline */}
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#7C3AED' }}>
            Instructional Design Reference
          </p>

          {/* ADDIE wordmark + subtitle */}
          <div>
            <div className="flex items-baseline">
              {HERO_LETTERS.map(({ letter, color }, i) => (
                <span
                  key={i}
                  className="font-black leading-none"
                  style={{ color, fontSize: 'clamp(3.25rem, 8.5vw, 5.75rem)' }}
                >
                  {letter}
                </span>
              ))}
              <span
                className="font-black leading-none"
                style={{ color: '#7C3AED', fontSize: 'clamp(3.25rem, 8.5vw, 5.75rem)' }}
              >
                .
              </span>
              <span
                className="font-bold self-end mb-1.5 ml-3"
                style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(1rem, 2.2vw, 1.5rem)' }}
              >
                Guide
              </span>
            </div>
            <p
              className="mt-4 text-sm sm:text-base leading-relaxed max-w-lg"
              style={{ color: '#64748B' }}
            >
              Your complete, practitioner-first reference for every phase of
              instructional design — from needs assessment to evaluation.
            </p>
          </div>

          {/* Phase flow — connected nodes */}
          <div className="flex items-start">
            {PHASES.map((phase, idx) => {
              const Icon = phase.icon
              return (
                <Fragment key={phase.slug}>
                  <Link
                    to={`/${phase.slug}`}
                    className="flex flex-col items-center gap-2 group shrink-0"
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:brightness-110"
                      style={{
                        backgroundColor: phase.color,
                        boxShadow: `0 0 0 3px ${phase.color}25, 0 4px 18px ${phase.color}35`,
                      }}
                    >
                      <Icon size={17} className="text-white" />
                    </div>
                    <span
                      className="text-xs font-bold hidden sm:block text-center"
                      style={{ color: `${phase.color}BB` }}
                    >
                      {phase.label}
                    </span>
                  </Link>
                  {idx < PHASES.length - 1 && (
                    <div
                      className="flex-1 h-px mt-[22px] mx-2"
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    />
                  )}
                </Fragment>
              )
            })}
          </div>

          {/* Stats / benefits */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HERO_STATS.map(({ value, label, sub }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p className="text-2xl font-black text-white leading-none mb-1">{value}</p>
                <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</p>
                <p className="text-xs mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                document.getElementById('guide-content')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:bg-white/10 active:scale-95"
              style={{ border: '1px solid rgba(255,255,255,0.18)' }}
            >
              Explore the Guide
              <ChevronDown size={15} />
            </button>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('addie:open-search'))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#7C3AED' }}
            >
              <Search size={15} />
              Search anything
              <kbd
                className="ml-1 font-mono text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* ── Phase Cards ─────────────────────────────────────────────── */}
      <div id="guide-content" />
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
        Phases
      </h2>
      <div className="flex flex-col gap-3 mb-10">
        {PHASES.map((phase) => {
          const Icon = phase.icon
          return (
            <Link
              key={phase.slug}
              to={`/${phase.slug}`}
              className="group rounded-xl overflow-hidden border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 24px ${phase.color}30`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
              }}
            >
              {/* Coloured top band */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ backgroundColor: phase.color }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white/60 tabular-nums">
                    {phase.number}
                  </span>
                  <Icon size={16} className="text-white/80" />
                  <span className="font-extrabold text-white text-sm tracking-wide">
                    {phase.label}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                />
              </div>

              {/* Card body */}
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-700">{phase.tagline}</p>
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                  {phase.keyActivity}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Flow bar ────────────────────────────────────────────────── */}
      <div className="mb-10 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {PHASES.map((phase, idx) => (
            <div key={phase.slug} className="flex items-center">
              <Link
                to={`/${phase.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                style={{ backgroundColor: phase.light }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: phase.color }} />
                <span className="text-xs font-bold" style={{ color: phase.color }}>
                  {phase.label}
                </span>
              </Link>
              {idx < PHASES.length - 1 && (
                <ArrowRight size={13} className="text-gray-300 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tool quick links ─────────────────────────────────────────── */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
        Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {TOOLS.map(({ to, label, desc, icon: Icon, style, iconBg }) => (
          <Link
            key={to}
            to={to}
            className="group p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={style}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: iconBg }}
              >
                <Icon size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm">{label}</span>
            </div>
            <p className="text-xs opacity-70 leading-relaxed">{desc}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
              Open <ChevronRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Foundations ─────────────────────────────────────────────── */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
        Foundations
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {FOUNDATIONS.map(({ to, label, desc, icon: Icon, style, iconBg }) => (
          <Link
            key={to}
            to={to}
            className="group p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={style}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: iconBg }}
              >
                <Icon size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm">{label}</span>
            </div>
            <p className="text-xs opacity-70 leading-relaxed">{desc}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
              Open <ChevronRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
