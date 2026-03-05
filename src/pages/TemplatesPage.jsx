import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import templates from '../data/templates.json'
import CopyButton from '../components/ui/CopyButton'
import PhaseBadge from '../components/ui/PhaseBadge'
import { PHASE_COLORS, PHASES } from '../utils/colors'

const PHASE_ORDER = ['analysis', 'design', 'develop', 'implement', 'evaluate']
const PHASE_LABELS = Object.fromEntries(PHASES.map((p) => [p.slug, p.label]))

function TemplateCard({ template }) {
  const [expanded, setExpanded] = useState(false)
  const color = PHASE_COLORS[template.phase]?.color

  return (
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-150">
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={15} style={{ color }} className="shrink-0" />
              <PhaseBadge phase={template.phase} label={PHASE_LABELS[template.phase]} />
            </div>
            <h3 className="font-bold text-gray-900 text-base">{template.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CopyButton text={template.content} />
            <button
              onClick={() => setExpanded((p) => !p)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              aria-expanded={expanded}
            >
              {expanded ? (
                <><ChevronUp size={13} /> Hide</>
              ) : (
                <><ChevronDown size={13} /> Preview</>
              )}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
            {template.content}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function TemplatesPage() {
  const [activePhase, setActivePhase] = useState('all')

  const filtered =
    activePhase === 'all'
      ? templates
      : templates.filter((t) => t.phase === activePhase)

  return (
    <div>
      <SEOHead
        title="Template Library"
        description="14 free instructional design templates: ADDIE project plans, lesson plans, storyboard templates, and more. Copy-ready for immediate use."
        path="/templates"
      />
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 55%, #0D9488 100%)' }}
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Template Library
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Copy-ready templates for every phase of ADDIE. Click Preview to see the
            full template, then copy it to your clipboard.
          </p>
        </div>
      </div>

      {/* Phase filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActivePhase('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            activePhase === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
          }`}
        >
          All ({templates.length})
        </button>
        {PHASE_ORDER.map((phase) => {
          const count = templates.filter((t) => t.phase === phase).length
          const color = PHASE_COLORS[phase]?.color
          const isActive = activePhase === phase
          return (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={
                isActive
                  ? { backgroundColor: color, color: '#fff', borderColor: color }
                  : { backgroundColor: '#fff', color: '#6b7280', borderColor: '#d1d5db' }
              }
            >
              {PHASE_LABELS[phase]} ({count})
            </button>
          )
        })}
      </div>

      {/* Template list */}
      <div className="space-y-4">
        {filtered.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}
