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
} from 'lucide-react'

const PHASE_LINKS = [
  { to: '/analysis',  label: 'Analysis',  color: '#E74C3C', icon: Search },
  { to: '/design',    label: 'Design',    color: '#E67E22', icon: Layers },
  { to: '/develop',   label: 'Develop',   color: '#27AE60', icon: Code2 },
  { to: '/implement', label: 'Implement', color: '#8E44AD', icon: PlayCircle },
  { to: '/evaluate',  label: 'Evaluate',  color: '#2980B9', icon: BarChart2 },
]

const TOOL_LINKS = [
  { to: '/objectives', label: 'Objectives Builder', icon: Target },
  { to: '/templates',  label: 'Template Library',   icon: FileText },
  { to: '/glossary',   label: 'Glossary',           icon: BookOpen },
]

export default function NavLinks({ onNavigate }) {
  const base =
    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150'
  const active = 'bg-gray-100 text-gray-900'
  const inactive = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'

  return (
    <nav className="flex flex-col gap-1">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        onClick={onNavigate}
      >
        <LayoutDashboard size={18} className="shrink-0 text-gray-400" />
        <span>Home</span>
      </NavLink>

      <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Phases
      </p>

      {PHASE_LINKS.map(({ to, label, color, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          onClick={onNavigate}
        >
          <Icon size={18} className="shrink-0" style={{ color }} />
          <span>{label}</span>
        </NavLink>
      ))}

      <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Tools
      </p>

      {TOOL_LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          onClick={onNavigate}
        >
          <Icon size={18} className="shrink-0 text-gray-400" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
