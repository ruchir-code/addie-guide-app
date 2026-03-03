import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import NavLinks from './NavLinks'
import LevelToggle from '../ui/LevelToggle'

export default function Sidebar({ onOpenSearch }) {
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 overflow-y-auto"
      style={{ backgroundColor: '#0F172A', borderRight: '1px solid #1E293B' }}
    >
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: '1px solid #1E293B' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-white">
            ADDIE<span style={{ color: '#7C3AED' }}>.</span>
          </span>
          <span className="text-xs font-medium mt-0.5" style={{ color: '#475569' }}>Guide</span>
        </Link>
        <button
          onClick={onOpenSearch}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
          style={{ color: '#64748B' }}
          aria-label="Search (⌘K)"
          title="Search (⌘K)"
        >
          <Search size={15} />
        </button>
      </div>

      <div className="flex-1 px-2 py-4">
        <NavLinks />
      </div>

      <LevelToggle />
    </aside>
  )
}
