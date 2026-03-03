import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Layers,
  Code2,
  PlayCircle,
  BarChart2,
  Target,
  FileText,
  BookOpen,
  Brain,
  GraduationCap,
  Monitor,
} from 'lucide-react'
import { PHASES } from '../../utils/colors'

const PHASE_LINKS = PHASES.map((p) => ({
  to: `/${p.slug}`,
  label: p.label,
  color: p.color,
  icon: { analysis: Search, design: Layers, develop: Code2, implement: PlayCircle, evaluate: BarChart2 }[p.slug],
}))

const TOOL_LINKS = [
  { to: '/objectives',  label: 'Outcomes & Objectives', icon: Target },
  { to: '/templates',   label: 'Template Library',      icon: FileText },
  { to: '/glossary',    label: 'Glossary',              icon: BookOpen },
  { to: '/media-guide', label: 'Media & Format Guide',  icon: Monitor },
]

const FOUNDATION_LINKS = [
  { to: '/theories', label: 'Learning Theories',  icon: Brain,          color: '#0D9488' },
  { to: '/bloom',    label: "Bloom's Taxonomy",   icon: GraduationCap,  color: '#0D9488' },
]

export default function NavLinks({ onNavigate }) {
  const base = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150'

  function navClass({ isActive }) {
    return `${base} ${isActive
      ? 'text-white'
      : 'hover:text-white'
    }`
  }

  function navStyle({ isActive }) {
    return isActive
      ? { backgroundColor: '#1E293B', color: '#F8FAFC' }
      : { color: '#94A3B8' }
  }

  return (
    <nav className="flex flex-col gap-0.5">
      <NavLink
        to="/"
        end
        className={navClass}
        style={navStyle}
        onClick={onNavigate}
      >
        <LayoutDashboard size={18} className="shrink-0" style={{ color: '#64748B' }} />
        <span>Home</span>
      </NavLink>

      <p
        className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider"
        style={{ color: '#475569' }}
      >
        Phases
      </p>

      {PHASE_LINKS.map(({ to, label, color, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={navClass}
          style={navStyle}
          onClick={onNavigate}
        >
          <Icon size={18} className="shrink-0" style={{ color }} />
          <span>{label}</span>
        </NavLink>
      ))}

      <p
        className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider"
        style={{ color: '#475569' }}
      >
        Tools
      </p>

      {TOOL_LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={navClass}
          style={navStyle}
          onClick={onNavigate}
        >
          <Icon size={18} className="shrink-0" style={{ color: '#64748B' }} />
          <span>{label}</span>
        </NavLink>
      ))}

      <p
        className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider"
        style={{ color: '#475569' }}
      >
        Foundations
      </p>

      {FOUNDATION_LINKS.map(({ to, label, icon: Icon, color }) => (
        <NavLink
          key={to}
          to={to}
          className={navClass}
          style={navStyle}
          onClick={onNavigate}
        >
          <Icon size={18} className="shrink-0" style={{ color }} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
