import { Link } from 'react-router-dom'
import {
  Search,
  Layers,
  Code2,
  PlayCircle,
  BarChart2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { PHASES as PHASE_DATA } from '../utils/colors'

const ICON_MAP = { analysis: Search, design: Layers, develop: Code2, implement: PlayCircle, evaluate: BarChart2 }

const PHASES = PHASE_DATA.map((p) => ({ ...p, icon: ICON_MAP[p.slug] }))

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          ADDIE Guide
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Your practical reference for the five phases of instructional design.
          Pick a phase to dive in, or use the tools below.
        </p>
      </div>

      {/* Phase Cards */}
      <div className="flex flex-col gap-3 mb-10">
        {PHASES.map((phase) => {
          const Icon = phase.icon
          return (
            <Link
              key={phase.slug}
              to={`/${phase.slug}`}
              className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-150"
              style={{ borderLeftWidth: 4, borderLeftColor: phase.color }}
            >
              {/* Number bubble */}
              <span
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0"
                style={{ backgroundColor: phase.light, color: phase.color }}
              >
                {phase.number}
              </span>

              {/* Icon (mobile) */}
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 sm:hidden"
                style={{ backgroundColor: phase.light }}
              >
                <Icon size={20} style={{ color: phase.color }} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-base" style={{ color: phase.color }}>
                    {phase.label}
                  </span>
                  <Icon size={15} className="hidden sm:block" style={{ color: phase.color }} />
                </div>
                <p className="text-sm text-gray-500 truncate">{phase.tagline}</p>
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block truncate">
                  {phase.keyActivity}
                </p>
              </div>

              <ChevronRight
                size={18}
                className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors"
              />
            </Link>
          )
        })}
      </div>

      {/* Flow bar */}
      <div className="mb-10 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {PHASES.map((phase, idx) => (
            <div key={phase.slug} className="flex items-center">
              <Link
                to={`/${phase.slug}`}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ backgroundColor: phase.light }}
              >
                <span className="text-xs font-bold" style={{ color: phase.color }}>
                  {phase.label}
                </span>
              </Link>
              {idx < PHASES.length - 1 && (
                <ArrowRight size={14} className="text-gray-300 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            to: '/objectives',
            label: 'Objectives Builder',
            desc: "Write ABCD-format objectives with Bloom's verb lists",
            style: { backgroundColor: '#EDE9FE', borderColor: '#8B5CF6', color: '#5B21B6' },
          },
          {
            to: '/templates',
            label: 'Template Library',
            desc: '8 copy-ready ID templates organised by ADDIE phase',
            style: { backgroundColor: '#FFF7ED', borderColor: '#EA580C', color: '#9A3412' },
          },
          {
            to: '/glossary',
            label: 'Glossary',
            desc: '60+ plain-English definitions for ID terms',
            style: { backgroundColor: '#ECFDF5', borderColor: '#059669', color: '#065F46' },
          },
        ].map(({ to, label, desc, style }) => (
          <Link
            key={to}
            to={to}
            className="group p-4 rounded-xl border hover:shadow-md transition-all duration-150"
            style={style}
          >
            <div className="font-semibold text-sm mb-1 flex items-center justify-between">
              {label}
              <ChevronRight size={15} className="opacity-40 group-hover:opacity-80 transition-opacity" />
            </div>
            <p className="text-xs opacity-70">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
