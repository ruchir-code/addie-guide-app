import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import Sidebar from './Sidebar'
import MobileDrawer from './MobileDrawer'
import GlobalSearch from '../ui/GlobalSearch'

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const keyHandler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    const searchHandler = () => setSearchOpen(true)
    document.addEventListener('keydown', keyHandler)
    document.addEventListener('addie:open-search', searchHandler)
    return () => {
      document.removeEventListener('keydown', keyHandler)
      document.removeEventListener('addie:open-search', searchHandler)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onOpenSearch={() => setSearchOpen(true)} />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

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
          <span className="flex-1 text-lg font-black tracking-tight text-white">
            ADDIE<span style={{ color: '#7C3AED' }}>.</span>
            <span className="text-xs font-medium ml-1" style={{ color: '#475569' }}>Guide</span>
          </span>
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: '#94A3B8' }}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-4xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
