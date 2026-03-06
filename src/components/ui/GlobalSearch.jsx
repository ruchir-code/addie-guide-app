import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, X,
  BookOpen, FileText, GraduationCap, Brain, Monitor, Network, ClipboardCheck, Target,
  TrendingUp, Briefcase, Zap, GitBranch, GitFork, ListChecks, Users2, GanttChart, Building2, Bot,
} from 'lucide-react'

import analysisData  from '../../data/phases/analysis.json'
import designData    from '../../data/phases/design.json'
import developData   from '../../data/phases/develop.json'
import implementData from '../../data/phases/implement.json'
import evaluateData  from '../../data/phases/evaluate.json'
import glossaryData  from '../../data/glossary.json'
import templatesData from '../../data/templates.json'

// ─── Build a deep searchable text block per phase ────────────────────────────
function buildPhase(data, slug, color) {
  const text = [
    data.tagline,
    data.whatItIs?.beginner,
    data.whatItIs?.advanced,
    data.whyItMatters?.beginner,
    data.whyItMatters?.advanced,
    ...(data.keyQuestions  || []),
    ...(data.outputs       || []),
    ...(data.commonMistakes || []).flatMap((m) => [m.mistake, m.fix]),
    ...(data.advancedInsights || []).map((i) => i.body),
  ].filter(Boolean).join(' ').toLowerCase()
  return { slug, label: data.label, tagline: data.tagline ?? '', color, text }
}

const PHASES = [
  buildPhase(analysisData,  'analysis',  '#DC2626'),
  buildPhase(designData,    'design',    '#EA580C'),
  buildPhase(developData,   'develop',   '#059669'),
  buildPhase(implementData, 'implement', '#9333EA'),
  buildPhase(evaluateData,  'evaluate',  '#2563EB'),
]

// ─── All navigable tool / foundation pages ───────────────────────────────────
const TOOLS = [
  { title: 'Outcomes & Objectives',     desc: "Build your CLO → TLO → ELO hierarchy with Bloom's verbs",                                    path: '/objectives',             icon: Target },
  { title: 'Assessment Builder',        desc: "Generate assessment templates aligned to Bloom's levels",                                      path: '/assessment-builder',     icon: ClipboardCheck },
  { title: 'Media & Format Guide',      desc: 'Decision guide for e-learning, ILT, VILT, job aids, and more',                                path: '/media-guide',            icon: Monitor },
  { title: "Bloom's Taxonomy",          desc: 'All six cognitive levels with verbs, objectives, and activities',                              path: '/bloom',                  icon: GraduationCap },
  { title: 'Learning Theories',         desc: 'Behaviorism, Cognitivism, Constructivism, Andragogy, CLT',                                    path: '/theories',               icon: Brain },
  { title: 'Instructional Models',      desc: 'ADDIE, SAM, Dick & Carey, Agile ID — compared side by side',                                  path: '/models',                 icon: Network },
  { title: 'Template Library',          desc: '14 copy-ready ID templates organised by ADDIE phase',                                         path: '/templates',              icon: FileText },
  { title: 'Glossary',                  desc: '150+ plain-English definitions for ID terms',                                                  path: '/glossary',               icon: BookOpen },
  { title: 'Evaluation Frameworks',     desc: 'Kirkpatrick, Phillips ROI, CIPP — measuring training effectiveness and impact',                path: '/evaluation-frameworks',  icon: TrendingUp },
  { title: 'Performance Consulting',    desc: "Training vs. non-training solutions, root cause analysis, Gilbert's BEM",                     path: '/performance-consulting', icon: Briefcase },
  { title: 'Transfer of Learning',      desc: 'Near/far transfer, conditions for transfer, before/during/after strategies',                   path: '/transfer',               icon: Zap },
  { title: 'Scenario Writing Guide',    desc: 'Write realistic branching scenarios and practice stories for ID',                              path: '/scenario-guide',         icon: GitBranch,  keywords: 'scenario branching push pull trigger consequence feedback context character decision tree story narrative' },
  { title: 'ID Self-Assessment Quiz',   desc: 'Test your instructional design knowledge across all ADDIE phases',                            path: '/quiz',                   icon: ListChecks, keywords: 'quiz test knowledge check self assessment competency practice questions answers score' },
  { title: 'SME Management Guide',      desc: 'Work effectively with subject matter experts to extract and validate content',                 path: '/sme-guide',              icon: Users2,     keywords: 'sme subject matter expert interview content extraction review stakeholder collaboration difficult elicit' },
  { title: 'Project Management',        desc: 'Timelines, estimates, and development-time ratios for ID projects',                           path: '/project-management',     icon: GanttChart, keywords: 'chapman alliance development time ratios hours estimate ilt elearning level 1 2 3 calculator budget scope kickoff RACI waterfall agile version control project plan timeline deliverables' },
  { title: 'AI in Instructional Design', desc: 'How to use AI tools effectively across the ID workflow',                                     path: '/ai-in-id',               icon: Bot,        keywords: 'AI ChatGPT artificial intelligence tools automation prompt scripting storyboard generation GPT LLM machine learning' },
  { title: 'Federal / Government ID',   desc: 'Instructional design in federal and government agency contexts',                              path: '/federal-id',             icon: Building2,  keywords: 'federal government Section 508 accessibility compliance clearance SCORM DoD military agency contracting regulations policy' },
  { title: 'Scenario Branching Builder', desc: 'Map decision points and consequences. Build manually or draft with AI.',                        path: '/scenario-branching',     icon: GitFork,    keywords: 'branching diagram tree decision consequence outcome flowchart map storyline storyboard AI draft generate BYOK scenario builder visual' },
]

// ─── Search ──────────────────────────────────────────────────────────────────
function runSearch(query) {
  if (!query.trim()) return { phases: [], tools: [], glossary: [], templates: [] }
  const q = query.toLowerCase()
  return {
    phases: PHASES.filter(
      (p) => p.label.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.text.includes(q)
    ),
    tools: TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        (t.keywords && t.keywords.toLowerCase().includes(q))
    ),
    glossary: glossaryData
      .filter((g) => g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q))
      .slice(0, 5),
    templates: templatesData
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.content?.toLowerCase().includes(q)
      )
      .slice(0, 4),
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function ResultGroup({ label, children }) {
  return (
    <div>
      <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      {children}
    </div>
  )
}

function ResultItem({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
    >
      {children}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = runSearch(query)
  const hasResults =
    results.phases.length + results.tools.length + results.glossary.length + results.templates.length > 0

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const go = (path) => { navigate(path); onClose() }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phases, tools, glossary, templates…"
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[26rem] overflow-y-auto">
          {!query.trim() && (
            <p className="text-xs text-gray-400 text-center py-10">
              Type to search across phases, tools, glossary, and templates
            </p>
          )}
          {query.trim() && !hasResults && (
            <p className="text-xs text-gray-400 text-center py-10">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.phases.length > 0 && (
            <ResultGroup label="Phases">
              {results.phases.map((p) => (
                <ResultItem key={p.slug} onClick={() => go(`/${p.slug}`)}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.tagline}</p>
                  </div>
                </ResultItem>
              ))}
            </ResultGroup>
          )}

          {results.tools.length > 0 && (
            <ResultGroup label="Tools & Guides">
              {results.tools.map((t) => {
                const Icon = t.icon
                return (
                  <ResultItem key={t.path} onClick={() => go(t.path)}>
                    <Icon size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t.title}</p>
                      <p className="text-xs text-gray-500 truncate">{t.desc}</p>
                    </div>
                  </ResultItem>
                )
              })}
            </ResultGroup>
          )}

          {results.glossary.length > 0 && (
            <ResultGroup label="Glossary">
              {results.glossary.map((g) => (
                <ResultItem key={g.id} onClick={() => go('/glossary')}>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{g.term}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {g.definition.length > 90 ? g.definition.slice(0, 90) + '…' : g.definition}
                    </p>
                  </div>
                </ResultItem>
              ))}
            </ResultGroup>
          )}

          {results.templates.length > 0 && (
            <ResultGroup label="Templates">
              {results.templates.map((t) => (
                <ResultItem key={t.id} onClick={() => go('/templates')}>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.description}</p>
                  </div>
                </ResultItem>
              ))}
            </ResultGroup>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-2">
          <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-500">Esc</kbd>
          <span className="text-xs text-gray-400">to close</span>
          <span className="text-gray-200 mx-1">·</span>
          <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-500">⌘K</kbd>
          <span className="text-xs text-gray-400">to open anywhere</span>
        </div>
      </div>
    </div>
  )
}
