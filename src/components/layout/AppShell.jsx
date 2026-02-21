import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import MobileDrawer from './MobileDrawer'

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-40"
          style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #1E293B' }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: '#94A3B8' }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="text-lg font-black tracking-tight text-white">
            ADDIE<span style={{ color: '#7C3AED' }}>.</span>
            <span className="text-xs font-medium ml-1" style={{ color: '#475569' }}>Guide</span>
          </span>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-4xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
