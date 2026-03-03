import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bloomVerbs from '../data/bloom-verbs.json'
import CopyButton from '../components/ui/CopyButton'
import {
  BookOpen, Target, Layers, Map, Plus, Trash2,
  AlertTriangle, CheckCircle, ChevronRight, Download,
} from 'lucide-react'

// ─── Constants ─────────────────────────────────────────────────────────────────

const BLOOM_LEVELS = Object.entries(bloomVerbs).map(([key, val]) => ({ key, ...val }))

const BLOOM_COLORS = {
  remember:   { bg: '#FFFBEB', border: '#D97706', text: '#78350F' },
  understand: { bg: '#FFF7ED', border: '#EA580C', text: '#7C2D12' },
  apply:      { bg: '#ECFDF5', border: '#059669', text: '#064E3B' },
  analyze:    { bg: '#EFF6FF', border: '#2563EB', text: '#1E3A8A' },
  evaluate:   { bg: '#F5F3FF', border: '#7C3AED', text: '#4C1D95' },
  create:     { bg: '#FFF1F2', border: '#E11D48', text: '#881337' },
}

const TABS = [
  { key: 'clo', label: 'CLO', subtitle: 'Course Learning Outcomes', icon: BookOpen },
  { key: 'tlo', label: 'TLO', subtitle: 'Terminal Learning Objectives', icon: Target },
  { key: 'elo', label: 'ELO', subtitle: 'Enabling Learning Objectives', icon: Layers },
  { key: 'map', label: 'Map', subtitle: 'Coverage Overview', icon: Map },
]

// ─── ID generator ──────────────────────────────────────────────────────────────

let _uid = 0
function uid() { return String(++_uid) }

// ─── LocalStorage persistence ───────────────────────────────────────────────

const LS_KEY = 'addie_objectives_v1'

const _initialData = (() => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!Array.isArray(data?.clos)) return null
    const allIds = [...data.clos, ...(data.tlos || []), ...(data.elos || [])]
      .map(o => parseInt(o.id, 10))
      .filter(n => !isNaN(n))
    if (allIds.length) _uid = Math.max(...allIds)
    return data
  } catch { return null }
})()

// ─── Factory functions ─────────────────────────────────────────────────────────

function createCLO() {
  return { id: uid(), audience: '', bloomLevel: 'apply', verb: '', behavior: '', condition: '', degree: '', version: 0 }
}

function createTLO() {
  return { id: uid(), cloId: null, bloomLevel: 'apply', verb: '', contentFocus: '', measurableStandard: '', needsReview: false }
}

function createELO() {
  return { id: uid(), tloId: null, bloomLevel: 'remember', verb: '', skillFocus: '', standard: '', needsReview: false }
}

// ─── Text builders ─────────────────────────────────────────────────────────────

function buildCLOText(clo) {
  return [
    clo.condition && `Given ${clo.condition},`,
    clo.audience,
    clo.verb && clo.behavior
      ? `will be able to ${clo.verb.toLowerCase()} ${clo.behavior}`
      : clo.verb
      ? `will be able to ${clo.verb.toLowerCase()} [behavior]`
      : clo.behavior
      ? `will be able to [verb] ${clo.behavior}`
      : '',
    clo.degree && `to ${clo.degree}`,
  ].filter(Boolean).join(' ')
}

function buildTLOText(tlo) {
  const core = [tlo.verb, tlo.contentFocus].filter(Boolean).join(' ')
  if (!core) return ''
  return tlo.measurableStandard ? `${core}, ${tlo.measurableStandard}` : core
}

function buildELOText(elo) {
  const core = [elo.verb, elo.skillFocus].filter(Boolean).join(' ')
  if (!core) return ''
  return elo.standard ? `${core}, ${elo.standard}` : core
}

function buildMarkdownText(clos, tlos, elos) {
  const lines = ['# Course Outcomes & Objectives', '']

  clos.forEach((clo, ci) => {
    lines.push(`## COURSE LEARNING OUTCOME ${ci + 1}`)
    lines.push(buildCLOText(clo) || '*(incomplete)*')
    lines.push('')
    const cloTLOs = tlos.filter(t => t.cloId === clo.id)
    if (cloTLOs.length === 0) {
      lines.push('*No TLOs mapped to this CLO.*')
      lines.push('')
    } else {
      cloTLOs.forEach((tlo, tli) => {
        lines.push(`### Terminal Learning Objective ${ci + 1}.${tli + 1}`)
        lines.push(buildTLOText(tlo) || '*(incomplete)*')
        lines.push('')
        const tloELOs = elos.filter(e => e.tloId === tlo.id)
        if (tloELOs.length === 0) {
          lines.push('*No ELOs mapped to this TLO.*')
          lines.push('')
        } else {
          tloELOs.forEach((elo, eli) => {
            lines.push(`#### Enabling Learning Objective ${ci + 1}.${tli + 1}.${eli + 1}`)
            lines.push(buildELOText(elo) || '*(incomplete)*')
            lines.push('')
          })
        }
      })
    }
  })

  const unmappedTLOs = tlos.filter(t => !t.cloId || !clos.find(c => c.id === t.cloId))
  if (unmappedTLOs.length) {
    lines.push('---', '## ⚠️ Unmapped TLOs')
    unmappedTLOs.forEach(tlo => {
      lines.push(`- TLO ${tlos.indexOf(tlo) + 1}: ${buildTLOText(tlo) || '*(incomplete)*'}`)
    })
    lines.push('')
  }

  const unmappedELOs = elos.filter(e => !e.tloId || !tlos.find(t => t.id === e.tloId))
  if (unmappedELOs.length) {
    lines.push('---', '## ⚠️ Unmapped ELOs')
    unmappedELOs.forEach(elo => {
      lines.push(`- ELO ${elos.indexOf(elo) + 1}: ${buildELOText(elo) || '*(incomplete)*'}`)
    })
    lines.push('')
  }

  return lines.join('\n')
}

function clip(text, max = 55) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

// ─── Shared UI components ──────────────────────────────────────────────────────

function BloomPicker({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-700">
          Bloom's Taxonomy Level
        </label>
        <Link
          to="/bloom"
          className="text-xs font-medium text-teal-700 hover:text-teal-900 hover:underline transition-colors"
          style={{ color: '#0D9488' }}
        >
          Learn more →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {BLOOM_LEVELS.map(({ key, label, description }) => {
          const c = BLOOM_COLORS[key] || {}
          const active = value === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all"
              style={
                active
                  ? { backgroundColor: c.bg, borderColor: c.border, color: c.text }
                  : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#6b7280' }
              }
            >
              <div className="font-bold">{label}</div>
              <div className="opacity-70 font-normal mt-0.5 leading-tight">{description}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function VerbPicker({ bloomLevel, verb, onChange }) {
  const level = bloomVerbs[bloomLevel]
  const c = BLOOM_COLORS[bloomLevel] || {}
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Verb</label>
      <div className="p-3 rounded-lg border" style={{ backgroundColor: c.bg, borderColor: c.border }}>
        <p className="text-xs font-medium mb-2" style={{ color: c.text }}>{level?.label} verbs:</p>
        <div className="flex flex-wrap gap-1.5">
          {level?.verbs.map((v) => (
            <button
              key={v}
              onClick={() => onChange(v)}
              className="px-2.5 py-1 rounded-md text-xs font-medium transition-all border"
              style={
                verb === v
                  ? { backgroundColor: c.border, color: '#fff', borderColor: c.border }
                  : { backgroundColor: '#fff', color: c.text, borderColor: c.border }
              }
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        placeholder="Or type your own verb…"
        value={verb}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  )
}

function ReviewBanner({ onAcknowledge }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-300 bg-amber-50 mb-4">
      <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-amber-800">Linked item has changed</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Review this objective to confirm it still aligns with the updated item above it in the chain.
        </p>
      </div>
      <button
        onClick={onAcknowledge}
        className="text-xs font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap shrink-0"
      >
        Mark reviewed
      </button>
    </div>
  )
}

function CoverageAlert({ message }) {
  return (
    <div className="mb-4 p-4 rounded-lg border border-amber-300 bg-amber-50 flex items-start gap-2">
      <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
      <p className="text-sm text-amber-800">{message}</p>
    </div>
  )
}

// ─── CLO Tab ───────────────────────────────────────────────────────────────────

function CLOTab({ clos, onUpdate, onAdd, onRemove }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Course Learning Outcomes (CLO)</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            CLOs describe what learners will achieve by the end of the course. Use ABCD format:
            {' '}<strong>Audience</strong>, <strong>Behavior</strong> (verb + task), <strong>Condition</strong>,
            and <strong>Degree</strong>.
          </p>
        </div>
        <button
          onClick={onAdd}
          disabled={clos.length >= 7}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 ml-4"
        >
          <Plus size={14} /> Add CLO
        </button>
      </div>

      {clos.length >= 7 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          Maximum of 7 CLOs reached. Well-designed courses typically have 3–7.
        </p>
      )}

      <div className="space-y-6">
        {clos.map((clo, idx) => (
          <CLOCard
            key={clo.id}
            clo={clo}
            index={idx}
            canRemove={clos.length > 1}
            onUpdate={(field, value) => onUpdate(clo.id, field, value)}
            onRemove={() => onRemove(clo.id)}
          />
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: '#EDE9FE', borderColor: '#8B5CF6' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B21B6' }}>CLO Tips</p>
        <ul className="space-y-1.5 text-xs" style={{ color: '#4C1D95' }}>
          <li>• Most courses have <strong>3–7 CLOs</strong> — comprehensive but achievable</li>
          <li>• CLOs should target <strong>Apply level or higher</strong> on Bloom's taxonomy</li>
          <li>• Each CLO should be distinct — avoid overlap between outcomes</li>
          <li>• Every TLO you build should map back to at least one CLO</li>
        </ul>
      </div>
    </div>
  )
}

function CLOCard({ clo, index, canRemove, onUpdate, onRemove }) {
  const c = BLOOM_COLORS[clo.bloomLevel] || {}
  const text = buildCLOText(clo)
  const isReady = !!(clo.audience && clo.verb && clo.behavior)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-bold text-gray-700">CLO {index + 1}</span>
        <div className="flex items-center gap-2">
          {isReady && <CopyButton text={text} />}
          {canRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Remove this CLO"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <BloomPicker value={clo.bloomLevel} onChange={(v) => onUpdate('bloomLevel', v)} />
          <VerbPicker bloomLevel={clo.bloomLevel} verb={clo.verb} onChange={(v) => onUpdate('verb', v)} />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Audience <span className="font-normal text-gray-400">(A)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., undergraduate marketing students"
              value={clo.audience}
              onChange={(e) => onUpdate('audience', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Behavior <span className="font-normal text-gray-400">(B — what they do after the verb)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., a comprehensive digital marketing campaign"
              value={clo.behavior}
              onChange={(e) => onUpdate('behavior', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Condition <span className="font-normal text-gray-400">(C — context or constraints)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., a real client brief with a limited budget"
              value={clo.condition}
              onChange={(e) => onUpdate('condition', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="mt-1 text-xs text-gray-400">Optional but recommended. Starts with "Given…"</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Degree <span className="font-normal text-gray-400">(D — standard for success)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 100% compliance with brand guidelines across all deliverables"
              value={clo.degree}
              onChange={(e) => onUpdate('degree', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="mt-1 text-xs text-gray-400">Optional but important. Starts with "to…"</p>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">Live Preview</span>
            </div>
            <div className="px-4 py-5">
              {isReady ? (
                <>
                  <p className="text-gray-800 leading-relaxed font-medium text-sm">{text}</p>
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      ABCD Breakdown
                    </p>
                    {[
                      { label: 'A — Audience', value: clo.audience },
                      { label: 'B — Behavior', value: `${clo.verb} ${clo.behavior}`.trim() },
                      { label: 'C — Condition', value: clo.condition ? `Given ${clo.condition}` : '—' },
                      { label: 'D — Degree', value: clo.degree ? `To ${clo.degree}` : '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-2 text-xs">
                        <span className="w-32 shrink-0 font-semibold text-gray-500">{label}</span>
                        <span className="text-gray-700">{value || '—'}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 text-xs pt-1">
                      <span className="w-32 shrink-0 font-semibold text-gray-500">Bloom's Level</span>
                      <span className="font-semibold" style={{ color: c.text }}>
                        {bloomVerbs[clo.bloomLevel]?.label} — {bloomVerbs[clo.bloomLevel]?.description}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  Fill in Audience, Verb, and Behavior to see your CLO here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TLO Tab ───────────────────────────────────────────────────────────────────

function TLOTab({ tlos, clos, onUpdate, onAdd, onRemove, onAcknowledge }) {
  const hasBuiltCLOs = clos.some(c => buildCLOText(c))
  const mappedCloIds = new Set(tlos.map(t => t.cloId).filter(Boolean))
  const uncoveredCLOs = clos.filter(c => !mappedCloIds.has(c.id))
  const unmappedTLOs = tlos.filter(t => !t.cloId)

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Terminal Learning Objectives (TLO)</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            TLOs connect lesson content to CLOs, defining what learners will do at the end of a unit or lesson.
            Format: <strong>Verb + lesson content focus + measurable standard.</strong>
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors shrink-0 ml-4"
        >
          <Plus size={14} /> Add TLO
        </button>
      </div>

      {!hasBuiltCLOs && (
        <CoverageAlert message="Build at least one CLO first — TLOs should map back to your CLOs to ensure full course coverage." />
      )}
      {hasBuiltCLOs && uncoveredCLOs.length > 0 && tlos.length > 0 && (
        <CoverageAlert
          message={`Coverage gap: ${uncoveredCLOs.map(c => `CLO ${clos.indexOf(c) + 1}`).join(', ')} ${uncoveredCLOs.length === 1 ? 'has' : 'have'} no TLOs mapped yet.`}
        />
      )}
      {tlos.length > 0 && unmappedTLOs.length > 0 && (
        <CoverageAlert
          message={`${unmappedTLOs.length} TLO${unmappedTLOs.length > 1 ? 's are' : ' is'} not linked to any CLO yet.`}
        />
      )}

      {tlos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Target size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No TLOs yet</p>
          <p className="text-gray-400 text-sm mt-1">Add a TLO to connect lesson content to your CLOs.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tlos.map((tlo, idx) => (
            <TLOCard
              key={tlo.id}
              tlo={tlo}
              index={idx}
              clos={clos}
              onUpdate={(field, value) => onUpdate(tlo.id, field, value)}
              onRemove={() => onRemove(tlo.id)}
              onAcknowledge={() => onAcknowledge(tlo.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: '#EDE9FE', borderColor: '#8B5CF6' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B21B6' }}>TLO Tips</p>
        <ul className="space-y-1.5 text-xs" style={{ color: '#4C1D95' }}>
          <li>• Each TLO should link to <strong>at least one CLO</strong></li>
          <li>• TLOs are more specific than CLOs — they describe performance at the unit/lesson level</li>
          <li>• The measurable standard should include the <strong>delivery format + performance criteria</strong> (e.g., rubric score, time limit)</li>
          <li>• A TLO should be achievable within a single lesson or unit</li>
        </ul>
      </div>
    </div>
  )
}

function TLOCard({ tlo, index, clos, onUpdate, onRemove, onAcknowledge }) {
  const c = BLOOM_COLORS[tlo.bloomLevel] || {}
  const text = buildTLOText(tlo)
  const isReady = !!(tlo.verb && tlo.contentFocus)
  const linkedCLO = clos.find(cl => cl.id === tlo.cloId)
  const linkedCLOIdx = linkedCLO ? clos.indexOf(linkedCLO) : -1

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">TLO {index + 1}</span>
          {linkedCLO ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
              → CLO {linkedCLOIdx + 1}
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
              Unmapped
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isReady && <CopyButton text={text} />}
          <button
            onClick={onRemove}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Remove this TLO"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          {tlo.needsReview && <ReviewBanner onAcknowledge={onAcknowledge} />}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Maps to CLO</label>
            <select
              value={tlo.cloId ?? ''}
              onChange={(e) => onUpdate('cloId', e.target.value || null)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="">— Select a CLO —</option>
              {clos.map((cl, i) => {
                const t = buildCLOText(cl)
                return (
                  <option key={cl.id} value={cl.id}>
                    CLO {i + 1}{t ? `: ${clip(t)}` : ' (incomplete)'}
                  </option>
                )
              })}
            </select>
          </div>

          <BloomPicker value={tlo.bloomLevel} onChange={(v) => onUpdate('bloomLevel', v)} />
          <VerbPicker bloomLevel={tlo.bloomLevel} verb={tlo.verb} onChange={(v) => onUpdate('verb', v)} />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Lesson Content Focus
            </label>
            <textarea
              placeholder="e.g., a full digital marketing campaign for a new sustainable fashion brand, including a social media content calendar, influencer outreach plan, and performance metrics dashboard"
              value={tlo.contentFocus}
              onChange={(e) => onUpdate('contentFocus', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-400">What learners will do — the specific task and subject matter</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Measurable Standard
            </label>
            <textarea
              placeholder="e.g., delivering all materials in a professional 20-slide presentation that earns at least 90% on the course rubric for creativity, feasibility, and data accuracy"
              value={tlo.measurableStandard}
              onChange={(e) => onUpdate('measurableStandard', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-400">Delivery format + performance criteria (rubric score, time limit, accuracy threshold, etc.)</p>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">Live Preview</span>
            </div>
            <div className="px-4 py-5">
              {isReady ? (
                <>
                  <p className="text-gray-800 leading-relaxed font-medium text-sm">{text}</p>
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Breakdown</p>
                    {[
                      { label: 'Verb', value: tlo.verb || '—' },
                      { label: 'Content Focus', value: tlo.contentFocus || '—' },
                      { label: 'Standard', value: tlo.measurableStandard || '—' },
                      { label: "Bloom's Level", value: bloomVerbs[tlo.bloomLevel]?.label },
                      { label: 'Maps to', value: linkedCLO ? `CLO ${linkedCLOIdx + 1}` : '⚠️ Unmapped' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-2 text-xs">
                        <span className="w-28 shrink-0 font-semibold text-gray-500">{label}</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  Add a Verb and Lesson Content Focus to preview your TLO.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ELO Tab ───────────────────────────────────────────────────────────────────

function ELOTab({ elos, tlos, onUpdate, onAdd, onRemove, onAcknowledge }) {
  const hasBuiltTLOs = tlos.some(t => buildTLOText(t))
  const mappedTloIds = new Set(elos.map(e => e.tloId).filter(Boolean))
  const uncoveredTLOs = tlos.filter(t => !mappedTloIds.has(t.id))
  const unmappedELOs = elos.filter(e => !e.tloId)

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Enabling Learning Objectives (ELO)</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            ELOs are the granular skills and knowledge learners need to achieve each TLO.
            They define the specific, teachable components of lesson content.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors shrink-0 ml-4"
        >
          <Plus size={14} /> Add ELO
        </button>
      </div>

      {!hasBuiltTLOs && (
        <CoverageAlert message="Build at least one TLO first — ELOs should map back to your TLOs." />
      )}
      {hasBuiltTLOs && uncoveredTLOs.length > 0 && elos.length > 0 && (
        <CoverageAlert
          message={`Coverage gap: ${uncoveredTLOs.map(t => `TLO ${tlos.indexOf(t) + 1}`).join(', ')} ${uncoveredTLOs.length === 1 ? 'has' : 'have'} no ELOs mapped yet.`}
        />
      )}
      {elos.length > 0 && unmappedELOs.length > 0 && (
        <CoverageAlert
          message={`${unmappedELOs.length} ELO${unmappedELOs.length > 1 ? 's are' : ' is'} not linked to any TLO yet.`}
        />
      )}

      {elos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Layers size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No ELOs yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Add ELOs to define the specific skills and knowledge that enable each TLO.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {elos.map((elo, idx) => (
            <ELOCard
              key={elo.id}
              elo={elo}
              index={idx}
              tlos={tlos}
              onUpdate={(field, value) => onUpdate(elo.id, field, value)}
              onRemove={() => onRemove(elo.id)}
              onAcknowledge={() => onAcknowledge(elo.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: '#EDE9FE', borderColor: '#8B5CF6' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B21B6' }}>ELO Tips</p>
        <ul className="space-y-1.5 text-xs" style={{ color: '#4C1D95' }}>
          <li>• ELOs typically target <strong>Remember, Understand, or Apply</strong> — foundational Bloom's levels</li>
          <li>• Each TLO usually requires <strong>3–5 ELOs</strong> that together enable it</li>
          <li>• ELOs define what gets <strong>taught, practiced, and assessed</strong> in the lesson</li>
          <li>• One ELO = one specific, observable skill or piece of knowledge</li>
        </ul>
      </div>
    </div>
  )
}

function ELOCard({ elo, index, tlos, onUpdate, onRemove, onAcknowledge }) {
  const text = buildELOText(elo)
  const isReady = !!(elo.verb && elo.skillFocus)
  const linkedTLO = tlos.find(t => t.id === elo.tloId)
  const linkedTLOIdx = linkedTLO ? tlos.indexOf(linkedTLO) : -1

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">ELO {index + 1}</span>
          {linkedTLO ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              → TLO {linkedTLOIdx + 1}
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
              Unmapped
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isReady && <CopyButton text={text} />}
          <button
            onClick={onRemove}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Remove this ELO"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          {elo.needsReview && <ReviewBanner onAcknowledge={onAcknowledge} />}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Maps to TLO</label>
            <select
              value={elo.tloId ?? ''}
              onChange={(e) => onUpdate('tloId', e.target.value || null)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="">— Select a TLO —</option>
              {tlos.map((t, i) => {
                const txt = buildTLOText(t)
                return (
                  <option key={t.id} value={t.id}>
                    TLO {i + 1}{txt ? `: ${clip(txt)}` : ' (incomplete)'}
                  </option>
                )
              })}
            </select>
          </div>

          <BloomPicker value={elo.bloomLevel} onChange={(v) => onUpdate('bloomLevel', v)} />
          <VerbPicker bloomLevel={elo.bloomLevel} verb={elo.verb} onChange={(v) => onUpdate('verb', v)} />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Skill / Knowledge Focus
            </label>
            <textarea
              placeholder="e.g., the three core principles of sustainable supply chain management"
              value={elo.skillFocus}
              onChange={(e) => onUpdate('skillFocus', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-400">The specific skill or piece of knowledge this ELO addresses</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Measurable Standard <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 90% accuracy on a 10-question assessment"
              value={elo.standard}
              onChange={(e) => onUpdate('standard', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">Live Preview</span>
            </div>
            <div className="px-4 py-5">
              {isReady ? (
                <>
                  <p className="text-gray-800 leading-relaxed font-medium text-sm">{text}</p>
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Breakdown</p>
                    {[
                      { label: 'Verb', value: elo.verb || '—' },
                      { label: 'Skill Focus', value: elo.skillFocus || '—' },
                      { label: 'Standard', value: elo.standard || '—' },
                      { label: "Bloom's Level", value: bloomVerbs[elo.bloomLevel]?.label },
                      { label: 'Maps to', value: linkedTLO ? `TLO ${linkedTLOIdx + 1}` : '⚠️ Unmapped' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-2 text-xs">
                        <span className="w-28 shrink-0 font-semibold text-gray-500">{label}</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  Add a Verb and Skill Focus to preview your ELO.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Export Markdown Button ────────────────────────────────────────────────────

function ExportMDButton({ clos, tlos, elos }) {
  function handleExport() {
    const md = buildMarkdownText(clos, tlos, elos)
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'objectives.md'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
    >
      <Download size={14} />
      Export .md
    </button>
  )
}

// ─── Mapping Tab ───────────────────────────────────────────────────────────────

function MappingTab({ clos, tlos, elos }) {
  function buildFullText() {
    const lines = ['COURSE OUTCOMES & OBJECTIVES HIERARCHY', '']

    clos.forEach((clo, ci) => {
      lines.push(`CLO ${ci + 1}: ${buildCLOText(clo) || '(incomplete)'}`)
      const cloTLOs = tlos.filter(t => t.cloId === clo.id)
      if (cloTLOs.length === 0) {
        lines.push('  └── (No TLOs mapped)')
      } else {
        cloTLOs.forEach(tlo => {
          const ti = tlos.indexOf(tlo)
          lines.push(`  └── TLO ${ti + 1}: ${buildTLOText(tlo) || '(incomplete)'}`)
          const tloELOs = elos.filter(e => e.tloId === tlo.id)
          if (tloELOs.length === 0) {
            lines.push('       └── (No ELOs mapped)')
          } else {
            tloELOs.forEach(elo => {
              const ei = elos.indexOf(elo)
              lines.push(`       └── ELO ${ei + 1}: ${buildELOText(elo) || '(incomplete)'}`)
            })
          }
        })
      }
      lines.push('')
    })

    const unmappedTLOs = tlos.filter(t => !t.cloId || !clos.find(c => c.id === t.cloId))
    if (unmappedTLOs.length > 0) {
      lines.push('⚠️ UNMAPPED TLOs (not linked to any CLO):')
      unmappedTLOs.forEach(tlo => {
        lines.push(`  TLO ${tlos.indexOf(tlo) + 1}: ${buildTLOText(tlo) || '(incomplete)'}`)
      })
      lines.push('')
    }

    const unmappedELOs = elos.filter(e => !e.tloId || !tlos.find(t => t.id === e.tloId))
    if (unmappedELOs.length > 0) {
      lines.push('⚠️ UNMAPPED ELOs (not linked to any TLO):')
      unmappedELOs.forEach(elo => {
        lines.push(`  ELO ${elos.indexOf(elo) + 1}: ${buildELOText(elo) || '(incomplete)'}`)
      })
    }

    return lines.join('\n')
  }

  const mappedCloIds = new Set(tlos.map(t => t.cloId).filter(Boolean))
  const mappedTloIds = new Set(elos.map(e => e.tloId).filter(Boolean))
  const cloGaps = clos.filter(c => !mappedCloIds.has(c.id)).length
  const tloGaps = tlos.filter(t => !t.cloId).length
  const eloGaps = elos.filter(e => !e.tloId).length

  const stats = [
    { label: 'CLOs', count: clos.length, gaps: cloGaps, color: '#7C3AED', note: 'without TLOs' },
    { label: 'TLOs', count: tlos.length, gaps: tloGaps, color: '#2563EB', note: 'without CLO' },
    { label: 'ELOs', count: elos.length, gaps: eloGaps, color: '#059669', note: 'without TLO' },
  ]

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Coverage Map</h2>
          <p className="text-sm text-gray-500 mt-1">
            Full CLO → TLO → ELO hierarchy and coverage status. Copy the complete hierarchy for use in course documentation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={buildFullText()} />
          <ExportMDButton clos={clos} tlos={tlos} elos={elos} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, count, gaps, color, note }) => (
          <div key={label} className="border border-gray-200 rounded-xl p-4 bg-white text-center">
            <p className="text-2xl font-extrabold" style={{ color }}>{count}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
            {gaps > 0 && (
              <p className="text-xs text-amber-600 mt-1">⚠️ {gaps} {note}</p>
            )}
            {gaps === 0 && count > 0 && (
              <p className="text-xs text-green-600 mt-1">✓ All mapped</p>
            )}
            {count === 0 && (
              <p className="text-xs text-gray-400 mt-1">None built yet</p>
            )}
          </div>
        ))}
      </div>

      {/* Hierarchy Tree */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-semibold text-gray-700">Hierarchy Tree</span>
        </div>
        <div className="p-4 space-y-5">
          {clos.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">
              No CLOs built yet. Start in the CLO tab.
            </p>
          ) : (
            clos.map((clo, ci) => {
              const cloText = buildCLOText(clo)
              const cloTLOs = tlos.filter(t => t.cloId === clo.id)
              const cloCovered = cloTLOs.length > 0

              return (
                <div key={clo.id}>
                  {/* CLO row */}
                  <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                    cloCovered ? 'border-violet-200 bg-violet-50' : 'border-amber-200 bg-amber-50'
                  }`}>
                    {cloCovered
                      ? <CheckCircle size={14} className="text-violet-500 mt-0.5 shrink-0" />
                      : <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    }
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-500 mb-0.5">CLO {ci + 1}</p>
                      <p className="text-sm text-gray-800 leading-snug">
                        {cloText || <em className="text-gray-400">Incomplete — fill in the CLO tab</em>}
                      </p>
                    </div>
                  </div>

                  {/* TLOs for this CLO */}
                  <div className="ml-6 mt-2 space-y-2">
                    {cloTLOs.length === 0 ? (
                      <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-amber-200 bg-amber-50">
                        <ChevronRight size={12} className="text-amber-400 shrink-0" />
                        <p className="text-xs text-amber-600">No TLOs mapped to CLO {ci + 1}</p>
                      </div>
                    ) : (
                      cloTLOs.map(tlo => {
                        const ti = tlos.indexOf(tlo)
                        const tloText = buildTLOText(tlo)
                        const tloELOs = elos.filter(e => e.tloId === tlo.id)
                        const tloCovered = tloELOs.length > 0

                        return (
                          <div key={tlo.id}>
                            <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                              tloCovered ? 'border-blue-200 bg-blue-50' : 'border-amber-200 bg-amber-50'
                            }`}>
                              <ChevronRight size={12} className="text-blue-400 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-500 mb-0.5">TLO {ti + 1}</p>
                                <p className="text-sm text-gray-800 leading-snug">
                                  {tloText || <em className="text-gray-400">Incomplete — fill in the TLO tab</em>}
                                </p>
                                {tlo.needsReview && (
                                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                    <AlertTriangle size={10} /> Linked CLO has changed — review needed
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* ELOs for this TLO */}
                            <div className="ml-6 mt-2 space-y-2">
                              {tloELOs.length === 0 ? (
                                <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-amber-200 bg-amber-50">
                                  <ChevronRight size={12} className="text-amber-400 shrink-0" />
                                  <p className="text-xs text-amber-600">No ELOs mapped to TLO {ti + 1}</p>
                                </div>
                              ) : (
                                tloELOs.map(elo => {
                                  const ei = elos.indexOf(elo)
                                  const eloText = buildELOText(elo)
                                  return (
                                    <div
                                      key={elo.id}
                                      className={`flex items-start gap-2 p-3 rounded-lg border ${
                                        eloText ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
                                      }`}
                                    >
                                      <ChevronRight size={12} className="text-green-500 mt-0.5 shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-500 mb-0.5">ELO {ei + 1}</p>
                                        <p className="text-sm text-gray-800 leading-snug">
                                          {eloText || <em className="text-gray-400">Incomplete — fill in the ELO tab</em>}
                                        </p>
                                        {elo.needsReview && (
                                          <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                            <AlertTriangle size={10} /> Linked TLO has changed — review needed
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Unmapped TLOs */}
          {(() => {
            const unmapped = tlos.filter(t => !t.cloId || !clos.find(c => c.id === t.cloId))
            if (!unmapped.length) return null
            return (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
                  <AlertTriangle size={12} /> Unmapped TLOs (not linked to any CLO)
                </p>
                <div className="space-y-2">
                  {unmapped.map(tlo => {
                    const ti = tlos.indexOf(tlo)
                    return (
                      <div key={tlo.id} className="flex items-start gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50">
                        <span className="text-xs font-bold text-gray-600 shrink-0">TLO {ti + 1}</span>
                        <span className="text-sm text-gray-700">
                          {buildTLOText(tlo) || <em className="text-gray-400">Incomplete</em>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Unmapped ELOs */}
          {(() => {
            const unmapped = elos.filter(e => !e.tloId || !tlos.find(t => t.id === e.tloId))
            if (!unmapped.length) return null
            return (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
                  <AlertTriangle size={12} /> Unmapped ELOs (not linked to any TLO)
                </p>
                <div className="space-y-2">
                  {unmapped.map(elo => {
                    const ei = elos.indexOf(elo)
                    return (
                      <div key={elo.id} className="flex items-start gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50">
                        <span className="text-xs font-bold text-gray-600 shrink-0">ELO {ei + 1}</span>
                        <span className="text-sm text-gray-700">
                          {buildELOText(elo) || <em className="text-gray-400">Incomplete</em>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ObjectivesPage() {
  const [activeTab, setActiveTab] = useState('clo')
  const [clos, setClos] = useState(() => _initialData?.clos ?? [createCLO()])
  const [tlos, setTlos] = useState(() => _initialData?.tlos ?? [])
  const [elos, setElos] = useState(() => _initialData?.elos ?? [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ clos, tlos, elos }))
  }, [clos, tlos, elos])

  // ── CLO operations ──────────────────────────────────────────────────────────

  function updateCLO(id, field, value) {
    setClos(prev => prev.map(c => {
      if (c.id !== id) return c
      const updated = { ...c, [field]: value, version: c.version + 1 }
      if (field === 'bloomLevel') updated.verb = ''
      return updated
    }))
    // Flag all TLOs linked to this CLO as needing review
    setTlos(prev => prev.map(t => t.cloId === id ? { ...t, needsReview: true } : t))
  }

  function addCLO() {
    if (clos.length >= 7) return
    setClos(prev => [...prev, createCLO()])
  }

  function removeCLO(id) {
    if (clos.length <= 1) return
    setClos(prev => prev.filter(c => c.id !== id))
    // Unlink TLOs that were mapped to this CLO
    setTlos(prev => prev.map(t => t.cloId === id ? { ...t, cloId: null } : t))
  }

  // ── TLO operations ──────────────────────────────────────────────────────────

  function updateTLO(id, field, value) {
    setTlos(prev => prev.map(t => {
      if (t.id !== id) return t
      const updated = { ...t, [field]: value }
      if (field === 'bloomLevel') updated.verb = ''
      return updated
    }))
    // Flag linked ELOs for review when TLO content changes
    if (['verb', 'contentFocus', 'measurableStandard'].includes(field)) {
      setElos(prev => prev.map(e => e.tloId === id ? { ...e, needsReview: true } : e))
    }
  }

  function addTLO() {
    setTlos(prev => [...prev, createTLO()])
  }

  function removeTLO(id) {
    setTlos(prev => prev.filter(t => t.id !== id))
    // Unlink ELOs that were mapped to this TLO
    setElos(prev => prev.map(e => e.tloId === id ? { ...e, tloId: null } : e))
  }

  function acknowledgeTLO(id) {
    setTlos(prev => prev.map(t => t.id === id ? { ...t, needsReview: false } : t))
  }

  // ── ELO operations ──────────────────────────────────────────────────────────

  function updateELO(id, field, value) {
    setElos(prev => prev.map(e => {
      if (e.id !== id) return e
      const updated = { ...e, [field]: value }
      if (field === 'bloomLevel') updated.verb = ''
      return updated
    }))
  }

  function addELO() {
    setElos(prev => [...prev, createELO()])
  }

  function removeELO(id) {
    setElos(prev => prev.filter(e => e.id !== id))
  }

  function acknowledgeELO(id) {
    setElos(prev => prev.map(e => e.id === id ? { ...e, needsReview: false } : e))
  }

  // ── Tab issue badges ────────────────────────────────────────────────────────

  const tloIssues = tlos.filter(t => t.needsReview || !t.cloId).length
  const eloIssues = elos.filter(e => e.needsReview || !e.tloId).length

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Outcomes &amp; Objectives Builder
        </h1>
        <p className="text-gray-500 text-base max-w-2xl">
          Design a complete learning hierarchy. Start with Course Learning Outcomes (CLO), build Terminal
          Learning Objectives (TLO) that map to them, then break each TLO into Enabling Learning Objectives (ELO).
        </p>
      </div>

      {/* Chain indicator */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 font-semibold text-xs">CLO</span>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">TLO</span>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">ELO</span>
        <span className="text-xs text-gray-400 ml-1">
          Build left to right — each level maps back to the one above it.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map(({ key, label, subtitle, icon: Icon }) => {
          const active = activeTab === key
          const issues = key === 'tlo' ? tloIssues : key === 'elo' ? eloIssues : 0
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                active
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
              <span className="hidden sm:inline text-xs font-normal opacity-60">{subtitle}</span>
              {issues > 0 && (
                <span className="absolute top-2 right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'clo' && (
        <CLOTab clos={clos} onUpdate={updateCLO} onAdd={addCLO} onRemove={removeCLO} />
      )}
      {activeTab === 'tlo' && (
        <TLOTab
          tlos={tlos} clos={clos}
          onUpdate={updateTLO} onAdd={addTLO} onRemove={removeTLO}
          onAcknowledge={acknowledgeTLO}
        />
      )}
      {activeTab === 'elo' && (
        <ELOTab
          elos={elos} tlos={tlos}
          onUpdate={updateELO} onAdd={addELO} onRemove={removeELO}
          onAcknowledge={acknowledgeELO}
        />
      )}
      {activeTab === 'map' && (
        <MappingTab clos={clos} tlos={tlos} elos={elos} />
      )}
    </div>
  )
}
