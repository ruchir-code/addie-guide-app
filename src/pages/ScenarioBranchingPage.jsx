import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  GitFork, Plus, Trash2, ChevronDown, ChevronUp,
  Wand2, AlertCircle, Loader2, RotateCcw,
} from 'lucide-react'
import SEOHead from '../components/SEOHead'
import CopyButton from '../components/ui/CopyButton'

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT        = '#0891B2'
const ACCENT_LIGHT  = '#ECFEFF'
const ACCENT_BORDER = '#67E8F9'
const AI_MODEL      = 'claude-haiku-4-5'

const NODE_CFG = {
  start:   { bg: '#ECFDF5', border: '#059669', text: '#065F46', label: 'Start'           },
  decision:{ bg: '#EFF6FF', border: '#2563EB', text: '#1E3A8A', label: 'Decision Point'  },
  good:    { bg: '#DCFCE7', border: '#16A34A', text: '#14532D', label: 'Good Outcome'    },
  bad:     { bg: '#FEE2E2', border: '#DC2626', text: '#7F1D1D', label: 'Bad Outcome'     },
  neutral: { bg: '#FEF3C7', border: '#D97706', text: '#78350F', label: 'Neutral Outcome' },
}

function getNodeCfg(node) {
  if (node.type === 'start')    return NODE_CFG.start
  if (node.type === 'decision') return NODE_CFG.decision
  return NODE_CFG[node.endingType] || NODE_CFG.neutral
}

// SVG layout constants — H_GAP widened to 120 to accommodate choice boxes
const NODE_W   = 190
const NODE_H   = 88
const H_GAP    = 120
const LEAF_H   = 120
const PAD      = 24
const CHOICE_W = 110   // choice-label box width

// ─── ID generation ────────────────────────────────────────────────────────────
function makeId() {
  return 'n' + Math.random().toString(36).slice(2, 8)
}

// ─── Tree utilities ───────────────────────────────────────────────────────────
function makeNode(type = 'decision', text = '', choiceText = '', endingType = null) {
  return { id: makeId(), type, text, choiceText, endingType, children: [] }
}

function countLeaves(node) {
  if (!node.children || node.children.length === 0) return 1
  return node.children.reduce((s, c) => s + countLeaves(c), 0)
}

function countNodes(node) {
  return 1 + (node.children || []).reduce((s, c) => s + countNodes(c), 0)
}

function mapTree(node, id, updater) {
  if (node.id === id) return updater(node)
  return { ...node, children: (node.children || []).map(c => mapTree(c, id, updater)) }
}

function updateNode(tree, id, fields) {
  return mapTree(tree, id, n => ({ ...n, ...fields }))
}

function addChild(tree, parentId, child) {
  return mapTree(tree, parentId, n => ({ ...n, children: [...(n.children || []), child] }))
}

function deleteNode(tree, id) {
  function strip(node) {
    return { ...node, children: (node.children || []).filter(c => c.id !== id).map(strip) }
  }
  return strip(tree)
}

function flattenTree(node, depth = 0) {
  return [{ node, depth }, ...(node.children || []).flatMap(c => flattenTree(c, depth + 1))]
}

// ─── SVG layout ───────────────────────────────────────────────────────────────
function layoutTree(root) {
  const positions = {}
  function assign(node, depth, yStart) {
    const leaves = countLeaves(node)
    const y = yStart + (leaves * LEAF_H) / 2 - NODE_H / 2
    const x = PAD + depth * (NODE_W + H_GAP)
    positions[node.id] = { x, y, node }
    let childY = yStart
    for (const child of (node.children || [])) {
      assign(child, depth + 1, childY)
      childY += countLeaves(child) * LEAF_H
    }
  }
  assign(root, 0, PAD)
  return positions
}

function maxDepth(node) {
  if (!node.children || node.children.length === 0) return 0
  return 1 + Math.max(...node.children.map(maxDepth))
}

function svgDims(root) {
  return {
    w: PAD * 2 + (maxDepth(root) + 1) * (NODE_W + H_GAP),
    h: PAD * 2 + countLeaves(root) * LEAF_H,
  }
}

// Split choice text into at most two lines, max 16 chars each
function splitChoiceText(text) {
  if (!text) return { line1: '', line2: '' }
  const MAX1 = 16
  const MAX2 = 18
  if (text.length <= MAX1) return { line1: text, line2: '' }
  // Break at last space before MAX1 chars
  const breakAt = text.lastIndexOf(' ', MAX1)
  const split = breakAt > 2 ? breakAt : MAX1
  const line1     = text.slice(0, split).trim()
  const remaining = text.slice(split).trim()
  const line2     = remaining.length > MAX2 ? remaining.slice(0, MAX2 - 1) + '…' : remaining
  return { line1, line2 }
}

// ─── Export helpers ───────────────────────────────────────────────────────────
function toTextOutline(node, indent = 0) {
  const pad  = '  '.repeat(indent)
  const cfg  = getNodeCfg(node)
  const tag  = `[${cfg.label.toUpperCase()}]`
  const lines = []
  if (node.choiceText) lines.push(`${pad}→ ${node.choiceText}`)
  const cp = node.choiceText ? '  '.repeat(indent + 1) : pad
  lines.push(`${cp}${tag} ${node.text || '(empty)'}`)
  for (const child of (node.children || [])) {
    lines.push(...toTextOutline(child, node.choiceText ? indent + 1 : indent))
  }
  return lines
}

function toMarkdown(node, depth = 2) {
  const cfg  = getNodeCfg(node)
  const h    = '#'.repeat(Math.min(depth, 6))
  const lines = []
  if (node.type === 'start') {
    lines.push(`## Scenario\n\n**${node.text || '(empty)'}**\n`)
  } else {
    const emoji = node.type === 'outcome'
      ? (node.endingType === 'good' ? '✅' : node.endingType === 'bad' ? '❌' : '⚠️')
      : '❓'
    lines.push(`${h} ${emoji} ${node.choiceText || cfg.label}\n\n${node.text || '(empty)'}\n`)
  }
  for (const child of (node.children || [])) lines.push(toMarkdown(child, depth + 1))
  return lines.join('\n')
}

// ─── AI generation ────────────────────────────────────────────────────────────
async function generateScenario(description, apiKey, model) {
  const systemPrompt = `You are an instructional design assistant specializing in branching scenarios for e-learning. Generate a realistic, practitioner-quality branching scenario tree as JSON.

Rules:
- Root node: type "start" (exactly one; choiceText must be an empty string ""; endingType must be null)
- Branch nodes: type "decision" (pose a dilemma or question; must have 2–4 children)
- Leaf nodes: type "outcome" (show the consequence; children must be an empty array [])
- Every outcome node must have endingType set to "good", "bad", or "neutral"
- Every non-root node must have choiceText: the option the learner selects to reach this node (5–12 words, action-oriented)
- text: the narrative shown at each node (2–3 specific, realistic sentences using the user's context)
- Aim for 2–4 levels of depth; 2–3 branches per decision point
- IDs must be unique strings like "n1", "n2", "n3" etc.
- Return ONLY valid JSON. No markdown code fences, no explanation text.`

  const userPrompt = `Generate a branching scenario tree for this concept:\n\n"${description}"`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: model,
      max_tokens: model.includes('sonnet') ? 4096 : 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data  = await response.json()
  const raw   = data.content?.[0]?.text || ''
  const clean = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
  // Use bracket-depth tracking to extract exactly the outermost JSON object,
  // regardless of any trailing explanation text the model appends
  const start = clean.indexOf('{')
  if (start === -1) throw new Error('AI did not return a valid scenario structure. Please try again.')
  let depth = 0
  let end = -1
  for (let i = start; i < clean.length; i++) {
    if (clean[i] === '{') depth++
    else if (clean[i] === '}') { depth--; if (depth === 0) { end = i; break } }
  }
  if (end === -1) throw new Error('AI returned an incomplete JSON structure. Please try again.')
  return JSON.parse(clean.slice(start, end + 1))
}

// ─── StartModeSelector ────────────────────────────────────────────────────────
function StartModeSelector({ onStart, apiKey, setApiKey }) {
  const [showAI, setShowAI]    = useState(false)
  const [description, setDesc] = useState('')
  const [model, setModel]      = useState(AI_MODEL)
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState(null)

  async function handleGenerate() {
    if (!description.trim()) { setError('Please describe your scenario first.'); return }
    if (!apiKey.trim())      { setError('Please enter your Anthropic API key.'); return }
    setLoading(true)
    setError(null)
    try {
      localStorage.setItem('addie-anthropic-key', apiKey)
      const tree = await generateScenario(description, apiKey, model)
      onStart(tree)
    } catch (e) {
      setError(e.message || 'Something went wrong. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        How do you want to start?
      </p>
      <div className="grid md:grid-cols-2 gap-4">

        {/* Build manually */}
        <button
          onClick={() => onStart(null)}
          className="text-left p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-cyan-400 hover:shadow-md transition-all group"
        >
          <p className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-cyan-700">
            Build manually
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Start with a blank structure and build your own decision points, choices, and outcomes step by step.
          </p>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            Free · No account needed
          </span>
        </button>

        {/* Draft with AI */}
        <div
          className={`rounded-xl border-2 transition-all ${
            showAI ? 'border-cyan-400 shadow-md' : 'border-gray-200 bg-white hover:border-cyan-400 hover:shadow-md'
          }`}
        >
          <button
            onClick={() => setShowAI(v => !v)}
            className="w-full text-left p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                  <Wand2 size={15} style={{ color: ACCENT }} />
                  Draft with AI
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Describe your scenario in plain English and AI will draft a starting branch structure for you to edit.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="font-semibold text-gray-600">What this requires:</p>
                  <p>• A free Anthropic account</p>
                  <p>• Your own API key</p>
                  <p className="text-gray-400 italic">
                    (stored only in your browser — never sent to our servers)
                  </p>
                  <p>
                    Get a key at{' '}
                    <a
                      href="https://console.anthropic.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-cyan-700 transition-colors"
                      style={{ color: ACCENT }}
                      onClick={e => e.stopPropagation()}
                    >
                      console.anthropic.com
                    </a>
                    {' '}— takes about 3 minutes.
                  </p>
                </div>
              </div>
              <ChevronDown
                size={15}
                className={`text-gray-400 shrink-0 mt-1 transition-transform ${showAI ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {showAI && (
            <div className="px-5 pb-5 space-y-3 border-t border-cyan-100">
              <div className="pt-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Describe your scenario
                </label>
                <textarea
                  value={description}
                  onChange={e => setDesc(e.target.value)}
                  rows={4}
                  placeholder="e.g. A compliance scenario for federal contractors who discover a procurement irregularity. The scenario should explore ethical decision-making, reporting obligations under FAR, and consequences of inaction — with realistic characters and a government contract context..."
                  className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent leading-relaxed"
                />
                <p className="text-xs text-gray-400 mt-1">
                  The more specific your description, the more useful the draft.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Anthropic API key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Saved to your browser only. Never transmitted to addieguide.com.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Model
                </label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
                  {[
                    { id: 'claude-haiku-4-5',  label: 'Haiku 4.5',  note: 'Fast & affordable' },
                    { id: 'claude-sonnet-4-5', label: 'Sonnet 4.5', note: 'Higher quality' },
                  ].map(({ id, label, note }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setModel(id)}
                      className="flex-1 py-2 px-3 text-center transition-colors"
                      style={model === id
                        ? { backgroundColor: ACCENT, color: 'white' }
                        : { backgroundColor: 'white', color: '#6B7280' }
                      }
                    >
                      <span className="block">{label}</span>
                      <span className="block text-[10px] mt-0.5 opacity-75">{note}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-700 space-y-1">
                    <p>{error}</p>
                    {error.toLowerCase().includes('credit') && (
                      <p>
                        Check your{' '}
                        <a
                          href="https://console.anthropic.com/settings/billing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold hover:opacity-80"
                        >
                          Anthropic billing page
                        </a>
                        {' '}— a payment method must be on file and credits must be purchased (not trial credits) to reach API Tier 1.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                style={{ backgroundColor: ACCENT }}
              >
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Generating structure…</>
                  : <><Wand2 size={14} /> Generate starting structure</>
                }
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ─── NodeEditorCard — collapsible ─────────────────────────────────────────────
function NodeEditorCard({ node, depth, isRoot, onUpdate, onAddDecision, onAddOutcome, onDelete }) {
  const cfg    = getNodeCfg(node)
  const indent = Math.min(depth * 14, 56)

  // Open by default only if the node has no content yet (newly created nodes)
  const [open, setOpen] = useState(!node.text)

  const preview = node.text
    ? (node.text.length > 55 ? node.text.slice(0, 55) + '…' : node.text)
    : node.type === 'start'    ? 'Add opening situation…'
    : node.type === 'decision' ? 'Add decision prompt…'
    :                            'Add outcome description…'

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white mb-1.5 shadow-sm overflow-hidden"
      style={{ marginLeft: indent, borderLeftColor: cfg.border, borderLeftWidth: 3 }}
    >
      {/* Always-visible header row — click to expand/collapse */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
      >
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shrink-0"
          style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
        >
          {cfg.label}
        </span>
        <span className="text-xs text-gray-500 flex-1 min-w-0 truncate">{preview}</span>
        <div className="flex items-center gap-1 shrink-0">
          {!isRoot && (
            <span
              role="button"
              onClick={e => { e.stopPropagation(); onDelete() }}
              className="p-0.5 text-gray-300 hover:text-red-400 transition-colors rounded cursor-pointer"
              title="Delete this node and all its children"
            >
              <Trash2 size={11} />
            </span>
          )}
          {open
            ? <ChevronUp size={13} className="text-gray-400 shrink-0" />
            : <ChevronDown size={13} className="text-gray-400 shrink-0" />}
        </div>
      </button>

      {/* Expandable form fields */}
      {open && (
        <div className="px-3 pb-3 border-t border-gray-100 space-y-2 pt-2">

          {/* Learner's choice text — not shown for root */}
          {!isRoot && (
            <div>
              <label className="block text-[10px] text-gray-400 font-medium mb-1">
                Learner's choice to reach this point
              </label>
              <input
                type="text"
                value={node.choiceText || ''}
                onChange={e => onUpdate({ choiceText: e.target.value })}
                placeholder="e.g. Report it to the supervisor immediately"
                className="w-full text-xs border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Main node text */}
          <div>
            <label className="block text-[10px] text-gray-400 font-medium mb-1">
              {node.type === 'start'    ? 'Opening situation'           :
               node.type === 'decision' ? 'Situation / decision prompt' :
                                          'Consequence of this choice'  }
            </label>
            <textarea
              value={node.text || ''}
              onChange={e => onUpdate({ text: e.target.value })}
              rows={2}
              placeholder={
                node.type === 'start'
                  ? 'Describe the situation the learner encounters at the start…'
                  : node.type === 'decision'
                  ? 'Describe the dilemma the learner now faces…'
                  : 'Describe what happens as a result of this choice…'
              }
              className="w-full text-xs border border-gray-200 rounded-md px-2.5 py-1.5 resize-none focus:outline-none focus:ring-1 leading-relaxed"
            />
          </div>

          {/* Outcome type selector */}
          {node.type === 'outcome' && (
            <div>
              <label className="block text-[10px] text-gray-400 font-medium mb-1">Outcome type</label>
              <div className="flex gap-1.5">
                {['good', 'neutral', 'bad'].map(et => (
                  <button
                    key={et}
                    onClick={() => onUpdate({ endingType: et })}
                    className="flex-1 text-[10px] py-1 px-2 rounded border font-semibold transition-all"
                    style={
                      node.endingType === et
                        ? { backgroundColor: NODE_CFG[et].bg, borderColor: NODE_CFG[et].border, color: NODE_CFG[et].text }
                        : { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#9CA3AF' }
                    }
                  >
                    {et === 'good' ? '✓ Good' : et === 'bad' ? '✗ Bad' : '~ Neutral'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add child buttons — only for decision / start nodes */}
          {node.type !== 'outcome' && (
            <div className="flex gap-2 pt-0.5">
              <button
                onClick={onAddDecision}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
              >
                <Plus size={10} /> Decision point
              </button>
              <button
                onClick={onAddOutcome}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-green-200 text-green-600 hover:bg-green-50 transition-colors font-medium"
              >
                <Plus size={10} /> Outcome
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── EditorPanel ──────────────────────────────────────────────────────────────
function EditorPanel({ tree, onTreeChange }) {
  const flat = flattenTree(tree)

  return (
    <div className="overflow-y-auto pr-1" style={{ maxHeight: 580 }}>
      {flat.map(({ node, depth }) => (
        <NodeEditorCard
          key={node.id}
          node={node}
          depth={depth}
          isRoot={depth === 0}
          onUpdate={fields => onTreeChange(updateNode(tree, node.id, fields))}
          onAddDecision={() => onTreeChange(addChild(tree, node.id, makeNode('decision', '', '')))}
          onAddOutcome={()  => onTreeChange(addChild(tree, node.id, makeNode('outcome',  '', '', 'neutral')))}
          onDelete={()      => onTreeChange(deleteNode(tree, node.id))}
        />
      ))}
    </div>
  )
}

// ─── DiagramPanel (SVG) ───────────────────────────────────────────────────────
function DiagramPanel({ tree }) {
  const positions = layoutTree(tree)
  const { w, h }  = svgDims(tree)

  // Collect edges with pre-computed midpoints
  const edges = []
  Object.values(positions).forEach(({ x, y, node }) => {
    ;(node.children || []).forEach(child => {
      const cp = positions[child.id]
      if (!cp) return
      const x1   = x + NODE_W
      const y1   = y + NODE_H / 2
      const x2   = cp.x
      const y2   = cp.y + NODE_H / 2
      const mx   = (x1 + x2) / 2   // bezier midpoint x (proven: t=0.5 lands here)
      const midY = (y1 + y2) / 2   // bezier midpoint y
      edges.push({ key: `${node.id}-${child.id}`, x1, y1, x2, y2, mx, midY, child })
    })
  })

  return (
    <div
      className="overflow-auto rounded-xl border border-gray-200 bg-gray-50"
      style={{ maxHeight: 580 }}
    >
      <svg
        width={Math.max(w, 300)}
        height={Math.max(h, 260)}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1 ── Edge paths (drawn first, behind everything) */}
        {edges.map(({ key, x1, y1, x2, y2, mx }) => (
          <path
            key={`path-${key}`}
            d={`M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth={1.5}
          />
        ))}

        {/* 2 ── Choice-label boxes (on top of edges, behind nodes) */}
        {edges.map(({ key, mx, midY, child }) => {
          if (!child.choiceText) return null
          const { line1, line2 } = splitChoiceText(child.choiceText)
          const boxH = line2 ? 32 : 22
          const boxX = mx - CHOICE_W / 2
          const boxY = midY - boxH / 2

          return (
            <g key={`choice-${key}`}>
              {/* White pill with dashed border — visually distinct from nodes */}
              <rect
                x={boxX} y={boxY}
                width={CHOICE_W} height={boxH}
                rx={4}
                fill="white"
                stroke="#94A3B8"
                strokeWidth={1}
                strokeDasharray="3 2"
              />
              {/* Choice text — up to 2 lines */}
              <text
                textAnchor="middle"
                fontSize={8.5}
                fill="#334155"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                <tspan x={mx} y={midY + (line2 ? -7 : 4)}>{line1}</tspan>
                {line2 && <tspan x={mx} dy="13">{line2}</tspan>}
              </text>
            </g>
          )
        })}

        {/* 3 ── Nodes (drawn last, always on top) */}
        {Object.values(positions).map(({ x, y, node }) => {
          const cfg = getNodeCfg(node)
          const display = node.text
            || (node.type === 'start'    ? 'Opening situation'
              : node.type === 'decision' ? 'Decision point'
              :                            cfg.label)
          const truncated = display.length > 70 ? display.slice(0, 70) + '…' : display

          return (
            <g key={node.id}>
              {/* Node box */}
              <rect
                x={x} y={y}
                width={NODE_W} height={NODE_H}
                rx={8}
                fill={cfg.bg}
                stroke={cfg.border}
                strokeWidth={1.5}
              />
              {/* Type label */}
              <text
                x={x + 9} y={y + 16}
                fontSize={8}
                fontWeight="bold"
                fill={cfg.text}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {cfg.label.toUpperCase()}
              </text>
              {/* Node content — foreignObject for proper text wrapping */}
              <foreignObject x={x + 7} y={y + 22} width={NODE_W - 14} height={NODE_H - 28}>
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    fontSize: 10,
                    color: cfg.text,
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    maxHeight: NODE_H - 28,
                  }}
                >
                  {truncated}
                </div>
              </foreignObject>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── ExportPanel ──────────────────────────────────────────────────────────────
function ExportPanel({ tree }) {
  const [open, setOpen] = useState(false)
  const textOutline = toTextOutline(tree).join('\n')
  const markdown    = toMarkdown(tree)

  return (
    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 text-sm">Export scenario</span>
        {open
          ? <ChevronUp size={15} className="text-gray-400" />
          : <ChevronDown size={15} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-5">
          {/* Text outline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-gray-700">Text outline</p>
                <p className="text-xs text-gray-400">Paste into Word, Notion, or your storyboard document</p>
              </div>
              <CopyButton text={textOutline} />
            </div>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto overflow-y-auto whitespace-pre font-mono leading-relaxed max-h-52">
              {textOutline}
            </pre>
          </div>

          {/* Markdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-gray-700">Markdown</p>
                <p className="text-xs text-gray-400">For use in Notion, Confluence, or course scripts</p>
              </div>
              <CopyButton text={markdown} />
            </div>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto overflow-y-auto whitespace-pre font-mono leading-relaxed max-h-52">
              {markdown}
            </pre>
          </div>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors"
          >
            Print / save as PDF →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ScenarioBranchingPage() {
  const [tree, setTree] = useState(() => {
    try {
      const saved = localStorage.getItem('addie-scenario-tree')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('addie-anthropic-key') || ''
  )

  // Persist tree to localStorage on every change
  useEffect(() => {
    if (tree) {
      localStorage.setItem('addie-scenario-tree', JSON.stringify(tree))
    } else {
      localStorage.removeItem('addie-scenario-tree')
    }
  }, [tree])

  function handleStart(generatedTree) {
    if (generatedTree) {
      setTree(generatedTree)
    } else {
      setTree(makeNode('start', '', ''))
    }
  }

  function handleClear() {
    if (window.confirm('Clear this scenario and start over?')) {
      setTree(null)
    }
  }

  const totalNodes    = tree ? countNodes(tree)  : 0
  const totalOutcomes = tree
    ? flattenTree(tree).filter(({ node }) => node.type === 'outcome').length
    : 0

  return (
    <>
      <SEOHead
        title="Scenario Builder — ADDIE Guide"
        description="Design branching scenarios for e-learning. Map decision points, choices, and consequences — build manually or use AI to draft a starting structure from your description."
      />

      {/* Hero banner */}
      <div
        className="rounded-2xl p-6 mb-6 flex items-start gap-4"
        style={{
          background: `linear-gradient(135deg, ${ACCENT_LIGHT} 0%, #F0F9FF 100%)`,
          border: `1px solid ${ACCENT_BORDER}`,
        }}
      >
        <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: ACCENT }}>
          <GitFork size={22} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">
            Scenario Builder
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Map out the decision points, learner choices, and consequences of your branching scenario.
            Build the structure manually, or describe your idea in plain English and let AI draft a starting tree for you to refine.{' '}
            <Link
              to="/scenario-guide"
              className="underline font-medium hover:opacity-80 transition-opacity"
              style={{ color: ACCENT }}
            >
              New to scenario writing? Start here →
            </Link>
          </p>
        </div>
      </div>

      {/* Device recommendation */}
      <div className="flex items-center gap-2.5 mb-5 px-3.5 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
        <span className="text-base leading-none shrink-0">💻</span>
        <p>
          <span className="font-semibold">Best on a laptop or desktop.</span>{' '}
          The diagram panel needs room to breathe — phones and small tablets will make editing and reading the tree difficult.
        </p>
      </div>

      {/* Mode selector or builder */}
      {!tree ? (
        <StartModeSelector
          onStart={handleStart}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                <span className="font-semibold text-gray-800">{totalNodes}</span> nodes
              </span>
              <span>
                <span className="font-semibold text-gray-800">{totalOutcomes}</span> outcomes
              </span>
              <span>
                <span className="font-semibold text-gray-800">{countLeaves(tree)}</span> leaf branches
              </span>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw size={12} /> Clear &amp; start over
            </button>
          </div>

          {/* Split builder */}
          <div className="grid md:grid-cols-[42%_58%] gap-4 items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                Editor
              </p>
              <EditorPanel tree={tree} onTreeChange={setTree} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                Diagram
              </p>
              <DiagramPanel tree={tree} />
            </div>
          </div>

          {/* Export */}
          <ExportPanel tree={tree} />
        </>
      )}
    </>
  )
}
