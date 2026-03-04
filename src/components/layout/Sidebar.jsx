import { Link } from 'react-router-dom'
import NavLinks from './NavLinks'

export default function Sidebar() {
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 overflow-y-auto"
      style={{ backgroundColor: '#0F172A', borderRight: '1px solid #1E293B' }}
    >
      <Link
        to="/"
        className="flex items-center gap-2 px-4 py-4"
        style={{ borderBottom: '1px solid #1E293B' }}
      >
        <span className="text-xl font-black tracking-tight text-white">
          ADDIE<span style={{ color: '#7C3AED' }}>.</span>
        </span>
        <span className="text-xs font-medium mt-0.5" style={{ color: '#475569' }}>Guide</span>
      </Link>

      <div className="flex-1 px-2 py-4">
        <NavLinks />
      </div>
    </aside>
  )
}
