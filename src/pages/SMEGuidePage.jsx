import { useState } from 'react'
import {
  Users2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import CopyButton from '../components/ui/CopyButton'

const ACCENT       = '#BE185D'
const ACCENT_LIGHT = '#FFF1F2'
const ACCENT_BORDER = '#FECDD3'

// ── Reusable components ────────────────────────────────────────────────────────
function SectionHeading({ label }) {
  return (
    <div
      className="flex items-center gap-2 mb-4"
      style={{ borderLeft: `4px solid ${ACCENT}`, paddingLeft: '0.75rem' }}
    >
      <h2 className="text-lg font-bold text-gray-900">{label}</h2>
    </div>
  )
}

function AccordionSection({ title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <p className="font-bold text-gray-900 text-sm">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {open
          ? <ChevronUp size={17} className="shrink-0 text-gray-400" />
          : <ChevronDown size={17} className="shrink-0 text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100 text-sm text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

function QuestionList({ questions }) {
  return (
    <ul className="flex flex-col gap-2 mt-3">
      {questions.map((q, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span
            className="shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white mt-0.5"
            style={{ backgroundColor: ACCENT }}
          >
            {i + 1}
          </span>
          <span className="italic text-gray-700">"{q}"</span>
        </li>
      ))}
    </ul>
  )
}

function CalloutBox({ type, children }) {
  const styles = {
    tip: { bg: ACCENT_LIGHT, border: ACCENT_BORDER, color: ACCENT },
    warning: { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
    info: { bg: '#EFF6FF', border: '#BFDBFE', color: '#1E40AF' },
  }
  const s = styles[type] || styles.tip
  return (
    <div
      className="rounded-lg px-4 py-3 mt-4 text-sm"
      style={{ backgroundColor: s.bg, borderLeft: `3px solid ${s.color}` }}
    >
      {children}
    </div>
  )
}

// ── Page content data ──────────────────────────────────────────────────────────
const DISCOVERY_QUESTIONS = [
  "What does success look like for a new [role] at 30, 60, and 90 days?",
  "What mistakes do you see most often — and what does that look like in practice?",
  "Walk me through a recent situation where someone really struggled with this.",
  "What would you tell a brand-new hire on their first day that they won't find in any manual?",
  "What's something experienced people just know that newcomers always miss?",
  "If learners could only take away three things from this training, what should those be?",
]

const TACIT_TECHNIQUES = [
  {
    name: 'The Think-Aloud Protocol',
    prompt: '"Walk me through exactly what you would do, step by step."',
    why: "Surfaces procedural knowledge that experts execute automatically and rarely articulate.",
  },
  {
    name: 'The New Person Frame',
    prompt: '"Imagine you\'re training someone on their very first day. What do you tell them first?"',
    why: "Forces the SME to reconstruct what a novice doesn\'t know yet.",
  },
  {
    name: 'The Error Frame',
    prompt: '"What\'s the most common mistake you see? Show me what that looks like."',
    why: "Error analysis reveals the decision points where judgment matters most.",
  },
  {
    name: 'The Edge Case Probe',
    prompt: '"When does the normal approach break down? What do you do then?"',
    why: "Exposes conditional knowledge that only appears in non-standard situations.",
  },
  {
    name: 'The Contrast Question',
    prompt: '"What\'s the difference between someone who\'s really good at this and someone who\'s just OK?"',
    why: "Reveals performance standards the SME holds implicitly but has never written down.",
  },
]

const REVIEW_GATES = [
  {
    label: 'Alpha',
    focus: 'Content accuracy only',
    question: 'Is every fact correct? Is anything missing?',
    not: 'Design, flow, tone, or structure.',
    deliverable: 'Marked-up draft with factual corrections only.',
    color: '#0369A1',
    bg: '#EFF6FF',
  },
  {
    label: 'Beta',
    focus: 'Completeness + tone',
    question: 'Does this sound right? Would a new hire understand it?',
    not: 'New content additions or restructuring.',
    deliverable: 'Final content sign-off in writing.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    label: 'Sign-Off',
    focus: 'Formal approval',
    question: 'Do you confirm this content is accurate and ready for development?',
    not: 'Anything — this gate closes revision.',
    deliverable: 'Written or email confirmation on record.',
    color: '#059669',
    bg: '#ECFDF5',
  },
]

const SCOPE_RESPONSES = [
  {
    situation: '"Can we add a section on [topic]?"',
    response: '"That\'s worth capturing. Let me check if it connects directly to the performance objective — if it does, we\'ll include it. If not, I\'ll flag it for a follow-on module so it doesn\'t get lost."',
  },
  {
    situation: '"This needs to be at least 4 hours."',
    response: '"My concern with a 4-hour course is retention — longer content doesn\'t mean better learning. What are the 3 most critical behaviors you want learners to perform differently after this?"',
  },
  {
    situation: '"The old content should stay in there."',
    response: '"Let\'s look at it together. Anything that directly supports our objective stays. Anything that\'s been there historically — let\'s talk about whether it\'s still relevant to what people actually need to do."',
  },
  {
    situation: '"We need [stakeholder] to approve this too."',
    response: '"Happy to loop them in. Can you help me understand what they\'re approving — content accuracy, or something else? I want to make sure we\'re asking them the right question."',
  },
]

const RED_FLAGS = [
  {
    type: 'The Lecturer',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    description: 'Turns every question into a content download. Gives you 40 slides when you asked for 5 behaviors.',
    earlySign: 'The discovery interview becomes a one-hour monologue with no room for questions.',
    redirect: 'Interrupt gently and redirect: "That\'s really useful context — what I\'m trying to understand is what you\'d see someone doing differently after learning this. Can we anchor on a specific situation?"',
    prevention: 'Set a strict agenda at the start of every meeting. Send it in writing beforehand.',
  },
  {
    type: 'The Rewriter',
    color: '#9333EA',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    description: 'Returns your draft completely rewritten. Doesn\'t mark what\'s wrong — just replaces everything.',
    earlySign: 'First review comes back as a new document with your structure gone.',
    redirect: '"I need your help identifying anything that\'s factually incorrect or missing. The structure and language are intentional design decisions. Can you tell me specifically what\'s inaccurate so I can fix it?"',
    prevention: 'At Alpha review, be explicit: "Please mark only factual errors. You\'re not reviewing the writing style — that comes later."',
  },
  {
    type: 'The Absent SME',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    description: 'Misses review deadlines, doesn\'t respond to emails, always has something more urgent.',
    earlySign: 'Difficulty scheduling the initial discovery interview. Two reschedules before the first meeting.',
    redirect: '"I want to flag a timeline risk. We have [X] days until the launch date and I need your review completed by [Y]. If that\'s not workable, I\'d like to identify a backup reviewer now."',
    prevention: 'Name a backup SME at project kickoff. Get both names in writing in the project scope document.',
  },
]

const QUICK_REF = `SME MANAGEMENT QUICK REFERENCE
addieguide.com/sme-guide

DISCOVERY INTERVIEW CHECKLIST
□ Send agenda 24 hours before — set the frame
□ Lead with performance: "What does good look like on day 90?"
□ Get examples: "Walk me through the last time someone struggled"
□ Identify the tacit: "What do experienced people know intuitively?"
□ Close with priorities: "If learners remember one thing..."
□ Send written summary within 48 hours

TACIT KNOWLEDGE EXTRACTION
Think-Aloud: "Walk me through this step by step."
New Person Frame: "What do you tell someone on Day 1?"
Error Frame: "Show me what the most common mistake looks like."
Edge Case Probe: "When does the normal approach break down?"
Contrast Question: "What separates great from average performers?"

REVIEW CYCLE GATES
Alpha  → Content accuracy only (correct? complete?)
Beta   → Tone + completeness (would a new hire understand?)
Sign-Off → Written approval (protects both parties)

SCOPE CREEP RESPONSES
"Let's check this against the objective."
"What are the 3 most critical behaviors?"
"I'll flag that for a follow-up module."
"Longer doesn't always mean better retention."

ESCALATION ORDER
1. Direct conversation → document the risk verbally
2. Email confirmation → date, decision, and next step in writing
3. Loop in project sponsor → with full context
4. Formal escalation → through your manager or PM`

// ── Main export ────────────────────────────────────────────────────────────────
export default function SMEGuidePage() {
  return (
    <>
      <SEOHead
        title="SME Management Guide | ADDIE Guide"
        description="How to work with subject matter experts in instructional design — discovery interviews, extracting tacit knowledge, managing review cycles, handling scope creep, and navigating difficult SMEs."
      />

      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #9D174D 0%, #BE185D 35%, #DB2777 65%, #EC4899 100%)',
        }}
      >
        <div className="flex items-center gap-3 mb-3 animate-fade-in-up">
          <div className="p-2.5 rounded-xl bg-white/20">
            <Users2 size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black leading-tight">SME Management Guide</h1>
        </div>
        <p className="text-white/80 text-lg max-w-xl">
          Subject matter experts have the knowledge. You have the process. How well you manage that relationship determines whether the project succeeds.
        </p>
      </div>

      {/* Intro */}
      <div className="mb-8">
        <SectionHeading label="Why SME Relationships Determine Project Success" />
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Most ID projects don't fail because of bad instructional design. They fail because the ID
            didn't get the right information from the SME, couldn't manage the review process, or let
            scope creep go unaddressed until the project was undeliverable. The content is only as
            good as the relationship that produced it.
          </p>
          <p>
            SMEs are typically not trained to teach. They know their subject deeply, but they've
            often forgotten what it was like not to know it — a cognitive phenomenon called the
            "expert blind spot." Your job isn't to take their content and format it. It's to help
            them articulate what they know, focus on what learners actually need to perform, and
            protect the project from scope and timeline drift.
          </p>
          <p>
            Treat every SME as a partner, not a vendor of information. That reframe alone changes
            how you run interviews, structure reviews, and handle disagreements.
          </p>
        </div>
        <div
          className="mt-5 rounded-xl p-4 text-sm"
          style={{ backgroundColor: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}` }}
        >
          <p className="font-semibold mb-1" style={{ color: ACCENT }}>The core dynamic</p>
          <p className="text-gray-700">
            The SME is the subject expert. You are the learning architect. Neither role is subordinate —
            both are essential. When this is clear from the first meeting, most of the tension in SME
            relationships disappears.
          </p>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="mb-8">
        <SectionHeading label="Working with SMEs" />

        {/* Discovery Interview */}
        <AccordionSection
          title="The Discovery Interview"
          subtitle="How to structure it, what to ask, and what to record"
          defaultOpen={true}
        >
          <p className="mb-4">
            The discovery interview is your most important meeting. Before you design anything,
            you need to understand what good performance looks like on the job — in the SME's
            own words, with real examples. A bad discovery interview produces a course full of
            content the SME thinks is important but that learners will never use.
          </p>

          <p className="font-semibold text-gray-900 mb-2">How to structure it</p>
          <ol className="list-decimal list-inside space-y-1.5 mb-4 text-gray-700">
            <li>Send your agenda 24 hours in advance — set expectations about what you're asking</li>
            <li>Open with performance outcomes, not content ("What does good look like at day 90?")</li>
            <li>Get concrete examples ("Walk me through the last time a new person struggled")</li>
            <li>Surface tacit knowledge ("What do experienced people know that newcomers always miss?")</li>
            <li>Close with priorities ("If learners could only take away three things...")</li>
            <li>Send a written summary within 48 hours — this becomes your shared record</li>
          </ol>

          <p className="font-semibold text-gray-900 mb-1">Questions that consistently work</p>
          <QuestionList questions={DISCOVERY_QUESTIONS} />

          <p className="font-semibold text-gray-900 mt-5 mb-2">What to record</p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-700">
            <li>Exact language and terminology the SME uses — their words, not yours</li>
            <li>Stories and examples — these become your scenarios and case studies</li>
            <li>What "wrong" looks like — errors, failures, common misunderstandings</li>
            <li>Explicit priorities — what they say matters most</li>
            <li>Anything they say is "obvious" or "basic" — that's usually where the gap is</li>
          </ul>

          <CalloutBox type="info">
            <p className="font-semibold mb-1">Cross-reference: SME Interview Guide template</p>
            <p>
              Use the{' '}
              <Link to="/templates" className="underline font-medium" style={{ color: '#1E40AF' }}>
                Template Library
              </Link>
              {' '}SME Interview Guide to structure your notes and share a pre-read with the SME
              before your meeting.
            </p>
          </CalloutBox>
        </AccordionSection>

        {/* Tacit Knowledge */}
        <AccordionSection
          title="Extracting Tacit Knowledge"
          subtitle="What SMEs know but don't know they know"
        >
          <p className="mb-5">
            Tacit knowledge is the gap between what an expert knows and what they can articulate.
            It's the "just know it" territory — judgment calls, intuitions, and automatic behaviors
            that experts execute without thinking. It's also the most important knowledge for
            learners to develop, and the hardest to extract.
          </p>

          <p className="font-semibold text-gray-900 mb-3">Five techniques that work</p>
          <div className="flex flex-col gap-4">
            {TACIT_TECHNIQUES.map((t, i) => (
              <div
                key={i}
                className="rounded-xl p-4 border"
                style={{ backgroundColor: ACCENT_LIGHT, borderColor: ACCENT_BORDER }}
              >
                <p className="font-bold text-sm mb-1" style={{ color: ACCENT }}>{t.name}</p>
                <p className="italic text-gray-700 text-sm mb-2">{t.prompt}</p>
                <p className="text-xs text-gray-500">{t.why}</p>
              </div>
            ))}
          </div>

          <CalloutBox type="warning">
            <p className="font-semibold text-amber-800 mb-1">Watch for the content redirect</p>
            <p className="text-amber-900">
              SMEs instinctively answer performance questions with content. When you ask "What should
              new hires be able to do?", they'll often answer "They should understand..." Gently
              redirect: <em>"And what would you see them doing differently if they understood that?"</em>
            </p>
          </CalloutBox>
        </AccordionSection>

        {/* Review Cycles */}
        <AccordionSection
          title="Structuring Review Cycles"
          subtitle="Alpha → Beta → Sign-off — what each gate covers and why"
        >
          <p className="mb-5">
            Undefined review processes create the conditions for endless revision loops. The SME who
            kept quiet in Alpha shows up in Beta with structural changes. The stakeholder who signs
            off in week 8 wants revisions in week 12. A three-gate model prevents this by making
            explicit what each review covers — and what it doesn't.
          </p>

          <p className="font-semibold text-gray-900 mb-3">The three-gate model</p>
          <div className="flex flex-col gap-3 mb-5">
            {REVIEW_GATES.map((gate, i) => (
              <div key={i} className="flex items-start gap-0">
                {/* Step connector */}
                <div className="flex flex-col items-center shrink-0 mr-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: gate.color }}
                  >
                    {i + 1}
                  </div>
                  {i < REVIEW_GATES.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ backgroundColor: gate.color + '40', minHeight: '16px' }} />
                  )}
                </div>
                <div
                  className="flex-1 rounded-xl p-4 border mb-1"
                  style={{ backgroundColor: gate.bg, borderColor: gate.color + '40' }}
                >
                  <p className="font-bold text-sm mb-0.5" style={{ color: gate.color }}>
                    {gate.label} Review
                  </p>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{gate.focus}</p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-semibold">Ask:</span> {gate.question}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Not in scope:</span> {gate.not}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Deliverable:</span> {gate.deliverable}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <CalloutBox type="tip">
            <p className="font-semibold mb-1" style={{ color: ACCENT }}>Set expectations at kickoff</p>
            <p className="text-gray-700">
              Tell the SME at project kickoff that there will be exactly two reviews (Alpha and Beta)
              before sign-off. Naming the process upfront significantly reduces late-stage
              "one more change" requests — because the SME knows the windows have closed.
            </p>
          </CalloutBox>
        </AccordionSection>

        {/* Scope Creep */}
        <AccordionSection
          title="Pushing Back on Scope Creep"
          subtitle="Protecting the project without damaging the relationship"
        >
          <p className="mb-4">
            Scope creep in ID projects is almost always driven by good intentions — the SME wants
            the training to be comprehensive, the stakeholder wants everything covered. Your job is
            to redirect without dismissing. Never say no directly. Redirect to the objective.
          </p>

          <p className="font-semibold text-gray-900 mb-3">What to say when</p>
          <div className="flex flex-col gap-3">
            {SCOPE_RESPONSES.map((item, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                    When they say
                  </p>
                  <p className="text-sm font-medium text-gray-800 italic">{item.situation}</p>
                </div>
                <div className="px-4 py-2.5" style={{ backgroundColor: ACCENT_LIGHT }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: ACCENT }}>
                    You say
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.response}</p>
                </div>
              </div>
            ))}
          </div>

          <CalloutBox type="warning">
            <p className="font-semibold text-amber-800 mb-1">The principle behind all of these</p>
            <p className="text-amber-900">
              Every redirect anchors on the learning objective. If an addition genuinely serves the
              objective, it belongs. If it serves the SME's comfort with being thorough, it's scope
              creep. You're not saying the content isn't valuable — you're saying this course isn't
              the right home for it.
            </p>
          </CalloutBox>
        </AccordionSection>

        {/* Escalation */}
        <AccordionSection
          title="When the SME Becomes a Blocker"
          subtitle="Signs, escalation path, and what to document"
        >
          <p className="mb-4">
            Sometimes the problem isn't content — it's access. A SME who misses deadlines, gives
            vague feedback, or keeps adding new approvers can derail a project just as surely as bad
            content. The key rule: never surprise your stakeholder. Document everything and escalate
            early.
          </p>

          <p className="font-semibold text-gray-900 mb-2">Signs the SME is blocking progress</p>
          <ul className="list-disc list-inside space-y-1.5 mb-5 text-gray-700">
            <li>Two or more missed review deadlines with no proactive communication</li>
            <li>Feedback that says "this needs work" without specifying what</li>
            <li>Introducing new stakeholders who must approve content that was already signed off</li>
            <li>Rewriting content that passed Alpha review without a factual justification</li>
            <li>Going silent after receiving a draft</li>
          </ul>

          <p className="font-semibold text-gray-900 mb-3">Escalation path — in order</p>
          <div className="flex flex-col gap-2">
            {[
              {
                step: 1,
                label: 'Direct conversation',
                action: '"I want to flag a timeline concern. We have [X] days until launch and I need your review by [Y]. Can we commit to that date?"',
              },
              {
                step: 2,
                label: 'Email documentation',
                action: 'Send a written summary: missed deadline, new expected date, impact on launch if missed again. CC your project sponsor if appropriate.',
              },
              {
                step: 3,
                label: 'Loop in the project sponsor',
                action: '"I\'ve been keeping [sponsor] informed. At this stage I\'d like to formally loop them in so we can work out a path together."',
              },
              {
                step: 4,
                label: 'Formal escalation',
                action: 'Work with your manager or PM to notify the client. This is rare — if you\'ve documented steps 1–3, it rarely reaches here.',
              },
            ].map(({ step, label, action }) => (
              <div key={step} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200">
                <span
                  className="shrink-0 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed italic">"{action.replace(/^"|"$/g, '')}"</p>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>
      </div>

      {/* Red Flags */}
      <div className="mb-8">
        <SectionHeading label="Three SME Types to Watch For" />
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Most SME challenges fall into recognizable patterns. Identifying the type early lets you
          adjust your approach before the project gets off track.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {RED_FLAGS.map((rf) => (
            <div
              key={rf.type}
              className="rounded-xl p-5 border-2 flex flex-col gap-3"
              style={{ backgroundColor: rf.bg, borderColor: rf.border }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: rf.color }} />
                <p className="font-bold text-sm leading-snug" style={{ color: rf.color }}>
                  {rf.type}
                </p>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{rf.description}</p>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Early sign
                </p>
                <p className="text-xs text-gray-700 italic leading-relaxed">{rf.earlySign}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  How to redirect
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">{rf.redirect}</p>
              </div>
              <div
                className="rounded-lg p-2.5 text-xs"
                style={{ backgroundColor: 'white', border: `1px solid ${rf.border}` }}
              >
                <span className="font-semibold" style={{ color: rf.color }}>Prevention: </span>
                <span className="text-gray-600">{rf.prevention}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mb-8">
        <SectionHeading label="Quick Reference" />
        <div
          className="rounded-xl p-5 border"
          style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} style={{ color: ACCENT }} />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                SME Management Quick Reference
              </span>
            </div>
            <CopyButton text={QUICK_REF} />
          </div>
          <pre
            className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
            style={{ color: '#94A3B8' }}
          >
            {QUICK_REF}
          </pre>
        </div>
      </div>
    </>
  )
}
