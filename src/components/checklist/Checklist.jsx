import { RotateCcw, ClipboardList } from 'lucide-react'
import { useChecklist } from '../../context/ChecklistContext'
import ChecklistItem from './ChecklistItem'
import CopyButton from '../ui/CopyButton'

export default function Checklist({ phase, items, color, level = 'beginner' }) {
  const { getChecklist, toggleItem, resetPhase } = useChecklist()
  const checked = getChecklist(phase)

  // Show items with no level tag (always) + items tagged for the current level
  const visibleItems = items.filter((item) => !item.level || item.level === level)
  const completedCount = visibleItems.filter((item) => !!checked[item.id]).length

  const copyText = visibleItems
    .map((item) => `[${checked[item.id] ? 'x' : ' '}] ${item.text}`)
    .join('\n')

  return (
    <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
        style={{ backgroundColor: `${color}10` }}
      >
        <div className="flex items-center gap-2">
          <ClipboardList size={16} style={{ color }} />
          <span className="font-semibold text-sm text-gray-800">
            Phase Checklist
          </span>
          <span className="text-xs text-gray-500">
            {completedCount}/{visibleItems.length} complete
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={copyText} />
          <button
            onClick={() => resetPhase(phase)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Reset checklist"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 transition-all duration-300"
          style={{
            width: `${visibleItems.length > 0 ? (completedCount / visibleItems.length) * 100 : 0}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50 px-1 py-1">
        {visibleItems.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            text={item.text}
            checked={!!checked[item.id]}
            onToggle={(id) => toggleItem(phase, id)}
            isAdvanced={!!item.level}
          />
        ))}
      </div>
    </div>
  )
}
