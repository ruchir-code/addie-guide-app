import { RotateCcw, ClipboardList, Printer } from 'lucide-react'
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

  function handlePrint() {
    const title = `${phase.charAt(0).toUpperCase() + phase.slice(1)} Phase – Checklist`
    const rows = visibleItems
      .map(
        (item) =>
          `<tr style="border-bottom:1px solid #eee"><td style="padding:8px 4px;font-size:14px">${checked[item.id] ? '☑' : '☐'} ${item.text}</td></tr>`
      )
      .join('')
    const html = `<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:system-ui,sans-serif;padding:2rem;max-width:640px}h1{font-size:1.15rem;margin-bottom:.25rem}p{font-size:13px;color:#666;margin-bottom:1rem}table{width:100%;border-collapse:collapse}@media print{@page{margin:1.5cm}}</style></head><body><h1>${title}</h1><p>${completedCount}/${visibleItems.length} complete</p><table>${rows}</table></body></html>`
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    win.print()
  }

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
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Print checklist"
          >
            <Printer size={13} />
            Print
          </button>
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
