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
  Network,
  ClipboardCheck,
  ListChecks,
  Users2,
  TrendingUp,
  Briefcase,
  Zap,
  Bot,
  GitBranch,
  User,
  Building2,
} from 'lucide-react'
import { PHASES } from '../../utils/colors'

const PHASE_LINKS = PHASES.map((p) => ({
  to: `/${p.slug}`,
  label: p.label,
  color: p.color,
  icon: { analysis: Search, design: Layers, develop: Code2, implement: PlayCircle, evaluate: BarChart2 }[p.slug],
}))

const TOOL_LINKS = [
  { to: '/objectives',          label: 'Outcomes & Objectives',   icon: Target },
  { to: '/templates',           label: 'Template Library',        icon: FileText },
  { to: '/glossary',            label: 'Glossary',                icon: BookOpen },
  { to: '/media-guide',         label: 'Media & Format Guide',    icon: Monitor },
  { to: '/assessment-builder',  label: 'Assessment Builder',      icon: ClipboardCheck },
  { to: '/scenario-guide',      label: 'Scenario Writing',        icon: GitBranch },
  { to: '/quiz',                label: 'ID Self-Assessment',      icon: ListChecks },
  { to: '/sme-guide',          label: 'SME Management',          icon: Users2 },
]

const CONTEXT_LINKS = [
  { to: '/federal-id', label: 'Federal / Gov ID', icon: Building2, color: '#1D4ED8' },
]

const FOUNDATION_LINKS = [
  { to: '/theories',                label: 'Learning Theories',        icon: Brain,         color: '#0D9488' },
  { to: '/bloom',                   label: "Bloom's Taxonomy",         icon: GraduationCap, color: '#D97706' },
  { to: '/models',                  label: 'Instructional Models',     icon: Network,       color: '#4338CA' },
  { to: '/evaluation-frameworks',   label: 'Evaluation Frameworks',    icon: TrendingUp,    color: '#0369A1' },
  { to: '/performance-consulting',  label: 'Performance Consulting',   icon: Briefcase,     color: '#C2410C' },
  { to: '/transfer',                label: 'Transfer of Learning',     icon: Zap,           color: '#7C3AED' },
  { to: '/ai-in-id',               label: 'AI in ID',                 icon: Bot,           color: '#6366F1' },
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

      <p
        className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider"
        style={{ color: '#475569' }}
      >
        Contexts
      </p>

      {CONTEXT_LINKS.map(({ to, label, icon: Icon, color }) => (
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

      <div className="mt-4 pt-3" style={{ borderTop: '1px solid #1E293B' }}>
        <NavLink
          to="/about"
          className={navClass}
          style={navStyle}
          onClick={onNavigate}
        >
          <User size={18} className="shrink-0" style={{ color: '#64748B' }} />
          <span>About</span>
        </NavLink>
      </div>
    </nav>
  )
}
