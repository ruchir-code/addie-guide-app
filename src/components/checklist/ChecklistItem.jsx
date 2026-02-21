export default function ChecklistItem({ id, text, checked, onToggle }) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 py-2.5 px-3 rounded-lg cursor-pointer hover:bg-gray-50 group"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(id)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 cursor-pointer"
        style={{ accentColor: '#7C3AED' }}
      />
      <span
        className={`text-sm leading-snug transition-colors ${
          checked ? 'line-through text-gray-400' : 'text-gray-700'
        }`}
      >
        {text}
      </span>
    </label>
  )
}
