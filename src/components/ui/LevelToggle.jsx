import { useLevel } from '../../context/LevelContext'

export default function LevelToggle() {
  const { level, toggle } = useLevel()
  const isAdvanced = level === 'advanced'

  return (
    <div
      className="flex flex-col gap-1 px-3 py-3"
      style={{ borderTop: '1px solid #1E293B' }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: '#475569' }}
      >
        Content Level
      </span>
      <button
        onClick={toggle}
        className="flex items-center gap-2 w-full"
        aria-label={`Switch to ${isAdvanced ? 'Beginner' : 'Intermediate'} mode`}
      >
        <div
          className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
          style={{ backgroundColor: isAdvanced ? '#7C3AED' : '#334155' }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
              isAdvanced ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
        <span className="text-sm font-medium" style={{ color: '#CBD5E1' }}>
          {isAdvanced ? 'Intermediate' : 'Beginner'}
        </span>
      </button>
    </div>
  )
}
