import { useState } from 'react'
import { BarChart3, ChevronDown, ChevronUp, Code2, Terminal, AlertCircle, ArrowRight } from 'lucide-react'
import analyticsData from '../data/vercel-analytics.json'

const COLOR = '#000000'
const LIGHT = '#F8FAFC'
const BORDER = '#E2E8F0'
const DARK = '#0F172A'

function CodeBlock({ code, language, filename, label }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
      {(filename || label) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Code2 size={14} className="text-gray-500" />
            <span className="text-xs font-mono text-gray-700">
              {filename || label}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs font-medium px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            style={{ color: COLOR }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
          <code className="font-mono text-gray-800">{code}</code>
        </pre>
      </div>
    </div>
  )
}

function CodeBlockTabs({ codeBlocks }) {
  const [activeTab, setActiveTab] = useState(0)

  if (!codeBlocks || codeBlocks.length === 0) return null

  return (
    <div className="my-4">
      {codeBlocks.length > 1 && (
        <div className="flex gap-1 mb-2 border-b border-gray-200">
          {codeBlocks.map((block, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className="px-3 py-2 text-xs font-medium rounded-t-lg transition-colors"
              style={{
                backgroundColor: activeTab === index ? COLOR : 'transparent',
                color: activeTab === index ? 'white' : '#64748B',
                borderBottom: activeTab === index ? `2px solid ${COLOR}` : 'none',
              }}
            >
              {block.label || block.filename || `Option ${index + 1}`}
            </button>
          ))}
        </div>
      )}
      <CodeBlock {...codeBlocks[activeTab]} />
    </div>
  )
}

function NoteBox({ text }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 my-4">
      <div className="flex items-start gap-2">
        <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            💡 Note
          </p>
          <p className="text-sm text-blue-900 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}

function FrameworkSection({ framework }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-shadow duration-150"
      style={{ boxShadow: expanded ? `0 4px 20px ${COLOR}20` : undefined }}
    >
      <button
        className="w-full text-left focus:outline-none"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ backgroundColor: COLOR }}
        >
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-white text-sm tracking-wide">
              {framework.name}
            </span>
          </div>
          <div className="text-white/70">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        <div className="px-5 py-3 flex items-start gap-3">
          <Code2 size={15} className="shrink-0 mt-0.5" style={{ color: COLOR }} />
          <p className="text-sm text-gray-700 font-medium leading-snug">
            {framework.description}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-4">
          <div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {framework.instructions}
            </p>
            {framework.note && <NoteBox text={framework.note} />}
            <CodeBlockTabs codeBlocks={framework.codeBlocks} />
          </div>

          {framework.additionalNote && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {framework.additionalNote}
              </p>
              {framework.additionalCodeBlocks && (
                <CodeBlockTabs codeBlocks={framework.additionalCodeBlocks} />
              )}
            </div>
          )}

          <button
            onClick={() => setExpanded(false)}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: COLOR }}
          >
            <ChevronUp size={13} />
            Collapse
          </button>
        </div>
      )}
    </div>
  )
}

function Section({ section }) {
  if (section.type === 'frameworks') {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full" style={{ backgroundColor: COLOR }} />
          {section.title}
        </h2>
        <div className="space-y-4">
          {section.frameworks.map((framework) => (
            <FrameworkSection key={framework.id} framework={framework} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full" style={{ backgroundColor: COLOR }} />
        {section.title}
      </h2>

      {section.description && (
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {section.description}
        </p>
      )}

      {section.content && (
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {section.content}
        </p>
      )}

      {section.note && <NoteBox text={section.note} />}

      {section.codeBlocks && <CodeBlockTabs codeBlocks={section.codeBlocks} />}

      {section.additionalText && (
        <p className="text-sm text-gray-700 leading-relaxed mt-3 mb-3">
          {section.additionalText}
        </p>
      )}

      {section.type === 'list' && section.items && (
        <ul className="space-y-2 mt-3">
          {section.items.map((item, i) => {
            if (typeof item === 'string') {
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <ArrowRight size={14} className="shrink-0 mt-0.5" style={{ color: COLOR }} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              )
            }
            
            if (item.type === 'text') {
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <ArrowRight size={14} className="shrink-0 mt-0.5" style={{ color: COLOR }} />
                  <span className="leading-relaxed">{item.content}</span>
                </li>
              )
            }

            if (item.type === 'subsection') {
              return (
                <li key={i} className="mt-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  )}
                  {item.codeBlocks && <CodeBlockTabs codeBlocks={item.codeBlocks} />}
                </li>
              )
            }

            return null
          })}
        </ul>
      )}
    </div>
  )
}

export default function VercelAnalyticsPage() {
  return (
    <div>
      {/* Header banner */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ backgroundColor: COLOR }}
      >
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />
        <div
          className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={20} className="text-white/80" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
              Analytics
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
            {analyticsData.title}
          </h1>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            {analyticsData.description}
          </p>
        </div>
      </div>

      {/* Select framework callout */}
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-4 mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          📚 Framework-Specific Instructions
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Select your framework below to view instructions on using Vercel Web Analytics in your project.
          Each framework has its own implementation method and best practices.
        </p>
      </div>

      {/* Content sections */}
      {analyticsData.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          For more information, visit the{' '}
          <a
            href="https://vercel.com/docs/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
            style={{ color: COLOR }}
          >
            official Vercel Analytics documentation
          </a>
        </p>
      </div>
    </div>
  )
}
