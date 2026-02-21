import { PHASE_COLORS } from '../../utils/colors'

export default function PhaseBadge({ phase, label }) {
  const p = PHASE_COLORS[phase]
  const colors = p
    ? { bg: p.light, text: p.color, border: p.color }
    : { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border"
      style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
    >
      {label || phase}
    </span>
  )
}
