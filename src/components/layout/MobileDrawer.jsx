import { useEffect } from 'react'
import { X } from 'lucide-react'
import NavLinks from './NavLinks'
import LevelToggle from '../ui/LevelToggle'

export default function MobileDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel — dark navy, matching desktop sidebar */}
      <div
        className="absolute left-0 top-0 h-full w-64 shadow-2xl flex flex-col"
        style={{ backgroundColor: '#0F172A' }}
      >
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: '1px solid #1E293B' }}
        >
          <span className="text-xl font-black tracking-tight text-white">
            ADDIE<span style={{ color: '#7C3AED' }}>.</span>
            <span className="text-xs font-medium ml-1" style={{ color: '#475569' }}>Guide</span>
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
            style={{ color: '#94A3B8' }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-2 py-4 overflow-y-auto">
          <NavLinks onNavigate={onClose} />
        </div>

        <LevelToggle />
      </div>
    </div>
  )
}
