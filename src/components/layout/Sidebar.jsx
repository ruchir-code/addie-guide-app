import { Link } from 'react-router-dom'
import NavLinks from './NavLinks'
import LevelToggle from '../ui/LevelToggle'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 overflow-y-auto">
      <Link
        to="/"
        className="flex items-center gap-2 px-4 py-4 border-b border-gray-100"
      >
        <span className="text-xl font-black tracking-tight text-gray-900">
          ADDIE<span className="text-indigo-600">.</span>
        </span>
        <span className="text-xs font-medium text-gray-400 mt-0.5">Guide</span>
      </Link>

      <div className="flex-1 px-2 py-4">
        <NavLinks />
      </div>

      <LevelToggle />
    </aside>
  )
}
