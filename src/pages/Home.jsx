import { Link } from 'react-router-dom'
import {
  Search,
  Layers,
  Code2,
  PlayCircle,
  BarChart2,
  ChevronRight,
  ArrowRight,
  Target,
  FileText,
  BookOpen,
  Brain,
} from 'lucide-react'
import { PHASES as PHASE_DATA } from '../utils/colors'

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
    desc: '8 copy-ready ID templates organised by ADDIE phase',
    icon: FileText,
    style: { backgroundColor: '#FFF7ED', borderColor: '#EA580C', color: '#9A3412' },
    iconBg: '#EA580C',
  },
  {
    to: '/glossary',
    label: 'Glossary',
    desc: '60+ plain-English definitions for ID terms',
    icon: BookOpen,
    style: { backgroundColor: '#ECFDF5', borderColor: '#059669', color: '#065F46' },
    iconBg: '#059669',
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
]

export default function Home() {
  return (
    <div>
      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #2D1B69 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: '#7C3AED' }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15 blur-2xl"
          style={{ backgroundColor: '#2563EB' }}
        />

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7C3AED' }}>
            Instructional Design Reference
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
            ADDIE Guide
          </h1>
          <p className="text-base mb-6 max-w-lg" style={{ color: '#94A3B8' }}>
            Your practical, practitioner-first reference for all five phases of
            the ADDIE instructional design model.
          </p>

          {/* Phase chips */}
          <div className="flex flex-wrap gap-2">
            {PHASES.map((p) => (
              <Link
                key={p.slug}
                to={`/${p.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105"
                style={{ backgroundColor: `${p.color}25`, color: p.color, border: `1px solid ${p.color}50` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Phase Cards ─────────────────────────────────────────────── */}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
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
