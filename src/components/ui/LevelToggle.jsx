import { useLevel } from '../../context/LevelContext'

export default function LevelToggle() {
  const { level, toggle } = useLevel()
  const isAdvanced = level === 'advanced'

  return (
    <div className="flex flex-col gap-1 px-3 py-3 border-t border-gray-100">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Content Level
      </span>
      <button
        onClick={toggle}
        className="flex items-center gap-2 w-full"
        aria-label={`Switch to ${isAdvanced ? 'Beginner' : 'Advanced'} mode`}
      >
        <div
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
            isAdvanced ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
              isAdvanced ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {isAdvanced ? 'Advanced' : 'Beginner'}
        </span>
      </button>
    </div>
  )
}
