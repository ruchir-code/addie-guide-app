import { useState } from 'react'
import bloomVerbs from '../data/bloom-verbs.json'
import CopyButton from '../components/ui/CopyButton'

const BLOOM_LEVELS = Object.entries(bloomVerbs).map(([key, val]) => ({
  key,
  ...val,
}))

const BLOOM_COLORS = {
  remember:   { bg: '#FFFBEB', border: '#D97706', text: '#78350F' },
  understand: { bg: '#FFF7ED', border: '#EA580C', text: '#7C2D12' },
  apply:      { bg: '#ECFDF5', border: '#059669', text: '#064E3B' },
  analyze:    { bg: '#EFF6FF', border: '#2563EB', text: '#1E3A8A' },
  evaluate:   { bg: '#F5F3FF', border: '#7C3AED', text: '#4C1D95' },
  create:     { bg: '#FFF1F2', border: '#E11D48', text: '#881337' },
}

const EMPTY = { audience: '', bloomLevel: 'apply', verb: '', behavior: '', condition: '', degree: '' }

export default function ObjectivesPage() {
  const [form, setForm] = useState(EMPTY)

  const selectedLevel = bloomVerbs[form.bloomLevel]
  const colors = BLOOM_COLORS[form.bloomLevel] || {}

  function set(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'bloomLevel' ? { verb: '' } : {}),
    }))
  }

  const parts = [
    form.condition && `Given ${form.condition},`,
    form.audience,
    form.verb && form.behavior
      ? `will be able to ${form.verb.toLowerCase()} ${form.behavior}`
      : form.verb
      ? `will be able to ${form.verb.toLowerCase()} [behavior]`
      : form.behavior
      ? `will be able to [verb] ${form.behavior}`
      : '',
    form.degree && `to ${form.degree}`,
  ]
    .filter(Boolean)
    .join(' ')

  const isPreviewReady = form.audience && form.verb && form.behavior

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Learning Objectives Builder
        </h1>
        <p className="text-gray-500 text-base max-w-xl">
          Write measurable ABCD-format objectives. Pick a Bloom's level, choose a
          verb, and fill in the blanks. Copy your objective when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          {/* Bloom's Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bloom's Taxonomy Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BLOOM_LEVELS.map((level) => {
                const c = BLOOM_COLORS[level.key] || {}
                const isActive = form.bloomLevel === level.key
                return (
                  <button
                    key={level.key}
                    onClick={() => set('bloomLevel', level.key)}
                    className="text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all"
                    style={
                      isActive
                        ? {
                            backgroundColor: c.bg,
                            borderColor: c.border,
                            color: c.text,
                          }
                        : {
                            backgroundColor: '#f9fafb',
                            borderColor: '#e5e7eb',
                            color: '#6b7280',
                          }
                    }
                  >
                    <div className="font-bold">{level.label}</div>
                    <div className="text-xs opacity-70 font-normal mt-0.5 leading-tight">
                      {level.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Verb picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Verb{' '}
              <span className="font-normal text-gray-400">
                (B — Behavior starts here)
              </span>
            </label>
            <div
              className="p-3 rounded-lg border"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: colors.text }}>
                {selectedLevel?.label} verbs:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedLevel?.verbs.map((verb) => (
                  <button
                    key={verb}
                    onClick={() => set('verb', verb)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-all border"
                    style={
                      form.verb === verb
                        ? { backgroundColor: colors.border, color: '#fff', borderColor: colors.border }
                        : { backgroundColor: '#fff', color: colors.text, borderColor: colors.border }
                    }
                  >
                    {verb}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Or type your own verb..."
              value={form.verb}
              onChange={(e) => set('verb', e.target.value)}
              className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* A — Audience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Audience{' '}
              <span className="font-normal text-gray-400">(A)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., new customer service representatives"
              value={form.audience}
              onChange={(e) => set('audience', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* B — Behavior (rest of it) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Behavior{' '}
              <span className="font-normal text-gray-400">
                (B — what they do after the verb)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., the four-step de-escalation process"
              value={form.behavior}
              onChange={(e) => set('behavior', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* C — Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Condition{' '}
              <span className="font-normal text-gray-400">
                (C — context or constraints)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., a live customer complaint call without manager support"
              value={form.condition}
              onChange={(e) => set('condition', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              Optional but recommended. Starts with "Given…"
            </p>
          </div>

          {/* D — Degree */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Degree{' '}
              <span className="font-normal text-gray-400">
                (D — standard for success)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., 100% compliance with company protocol on 3 consecutive attempts"
              value={form.degree}
              onChange={(e) => set('degree', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              Optional but important. Starts with "to…"
            </p>
          </div>

          <button
            onClick={() => setForm(EMPTY)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear all fields
          </button>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-8 self-start">
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">
                Live Preview
              </span>
              {isPreviewReady && <CopyButton text={parts} />}
            </div>

            <div className="px-4 py-5">
              {isPreviewReady ? (
                <p className="text-gray-800 leading-relaxed font-medium text-sm">
                  {parts}
                </p>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  Fill in Audience, Verb, and Behavior to see your objective here.
                </p>
              )}

              {/* ABCD breakdown */}
              {isPreviewReady && (
                <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    ABCD Breakdown
                  </p>
                  {[
                    { label: 'A — Audience', value: form.audience },
                    {
                      label: 'B — Behavior',
                      value: form.verb
                        ? `${form.verb} ${form.behavior}`
                        : form.behavior,
                    },
                    {
                      label: 'C — Condition',
                      value: form.condition
                        ? `Given ${form.condition}`
                        : '—',
                    },
                    {
                      label: 'D — Degree',
                      value: form.degree ? `To ${form.degree}` : '—',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-2 text-xs">
                      <span className="w-32 shrink-0 font-semibold text-gray-500">
                        {label}
                      </span>
                      <span className="text-gray-700">{value || '—'}</span>
                    </div>
                  ))}

                  <div className="flex gap-2 text-xs pt-1">
                    <span className="w-32 shrink-0 font-semibold text-gray-500">
                      Bloom's Level
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: colors.text }}
                    >
                      {selectedLevel?.label} — {selectedLevel?.description}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: '#EDE9FE', borderColor: '#8B5CF6' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B21B6' }}>
              Quick Tips
            </p>
            <ul className="space-y-1.5 text-xs" style={{ color: '#4C1D95' }}>
              <li>• Most job tasks need <strong>Apply</strong> or <strong>Analyze</strong> level objectives</li>
              <li>• Avoid vague verbs: understand, know, appreciate, learn</li>
              <li>• If you can't observe it, it's not a good objective</li>
              <li>• One objective = one observable behavior</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
