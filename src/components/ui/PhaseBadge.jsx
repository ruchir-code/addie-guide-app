const PHASE_COLORS = {
  analysis:  { bg: '#fdf3f2', text: '#E74C3C', border: '#E74C3C' },
  design:    { bg: '#fef6ee', text: '#E67E22', border: '#E67E22' },
  develop:   { bg: '#f0faf3', text: '#27AE60', border: '#27AE60' },
  implement: { bg: '#f5f0fa', text: '#8E44AD', border: '#8E44AD' },
  evaluate:  { bg: '#eef6fc', text: '#2980B9', border: '#2980B9' },
}

export default function PhaseBadge({ phase, label }) {
  const colors = PHASE_COLORS[phase] || { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border"
      style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
    >
      {label || phase}
    </span>
  )
}
