import { useEffect } from 'react'
import { X } from 'lucide-react'
import NavLinks from './NavLinks'
import LevelToggle from '../ui/LevelToggle'

export default function MobileDrawer({ isOpen, onClose }) {
  // Lock body scroll when drawer is open
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
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="text-xl font-black tracking-tight text-gray-900">
            ADDIE<span className="text-indigo-600">.</span>
            <span className="text-xs font-medium text-gray-400 ml-1">Guide</span>
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
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
