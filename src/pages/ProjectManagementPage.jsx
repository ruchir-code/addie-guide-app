import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GanttChart, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info,
} from 'lucide-react'
import SEOHead from '../components/SEOHead'
import CopyButton from '../components/ui/CopyButton'

const ACCENT        = '#059669'
const ACCENT_LIGHT  = '#ECFDF5'
const ACCENT_BORDER = '#6EE7B7'

// ─── UI helpers ────────────────────────────────────────────────────────────────

function SectionHeading({ label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1 h-5 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
      <h2 className="text-lg font-extrabold text-gray-900">{label}</h2>
    </div>
  )
}

function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 bg-white">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-bold text-gray-900">{title}</span>
        {open
          ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
          : <ChevronDown size={16} className="text-gray-400 shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-3 text-sm text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

function Callout({ type = 'tip', children }) {
  const config = {
    tip:     { bg: '#F0FDF4', border: '#86EFAC', Icon: CheckCircle,  iconColor: '#15803D', label: 'Practitioner Tip' },
    warning: { bg: '#FFFBEB', border: '#FDE68A', Icon: AlertTriangle, iconColor: '#B45309', label: 'Watch Out' },
    info:    { bg: ACCENT_LIGHT, border: ACCENT_BORDER, Icon: Info,  iconColor: ACCENT,    label: 'Note' },
  }[type]
  const { Icon } = config
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: config.bg, borderColor: config.border }}>
      <Icon size={16} className="shrink-0 mt-0.5" style={{ color: config.iconColor }} />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: config.iconColor }}>{config.label}</p>
        <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

function NumberedItem({ n, title, children }) {
  return (
    <div className="flex gap-3">
      <span
        className="shrink-0 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center mt-0.5"
        style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT, border: `1px solid ${ACCENT_BORDER}` }}
      >
        {n}
      </span>
      <div>
        {title && <p className="font-semibold text-gray-800 mb-0.5">{title}</p>}
        <p className="text-gray-600">{children}</p>
      </div>
    </div>
  )
}

// ─── Chapman Alliance development time data ────────────────────────────────────

const CHAPMAN_DATA = [
  {
    level: 'Instructor-Led Training (ILT)',
    desc: 'Classroom-based; includes materials, handouts, PowerPoint',
    low: '22:1', avg: '43:1', high: '82:1',
    rowBg: '#F8FAFC',
  },
  {
    level: 'Level 1 eLearning — Basic',
    desc: 'Content pages, text, graphics, simple audio/video, assessments; includes PowerPoint-to-eLearning',
    low: '49:1', avg: '79:1', high: '125:1',
    rowBg: '#FFFFFF',
  },
  {
    level: 'Level 2 eLearning — Interactive',
    desc: 'Level 1 plus 25%+ interactive exercises, liberal use of multimedia (audio, video, animations)',
    low: '127:1', avg: '184:1', high: '267:1',
    rowBg: '#F8FAFC',
  },
  {
    level: 'Level 3 eLearning — Advanced',
    desc: 'Highly interactive simulations or games, avatars, custom interactions, award-winning caliber',
    low: '217:1', avg: '490:1', high: '716:1',
    rowBg: '#FFFFFF',
  },
]

// ─── Scope quick-reference ─────────────────────────────────────────────────────

const SCOPE_QUICK_REF = `ID PROJECT SCOPE — KICKOFF CHECKLIST

WHAT ARE WE BUILDING?
□ Training topic / performance objective
□ Delivery format (eLearning, ILT, VILT, job aid, blended)
□ Content level (awareness, role-based, certification)
□ Estimated finished seat time / duration

WHO IS THE AUDIENCE?
□ Role(s), experience level, prior training
□ Technical access (LMS, devices, network constraints)
□ Language / accessibility requirements

WHAT ARE THE CONSTRAINTS?
□ Hard deadline and any immovable milestones
□ SME availability (hours per week, review turnaround)
□ Number of review cycles included
□ Technical/tool constraints (authoring tool, LMS, SCORM version)

WHO APPROVES WHAT?
□ Primary stakeholder / decision-maker
□ SME(s) responsible for content accuracy
□ Final sign-off authority

WHAT IS OUT OF SCOPE?
□ Translation / localization
□ Accessibility certification (VPAT)
□ Post-launch maintenance or version updates
□ LMS administration or upload`

export default function ProjectManagementPage() {
  return (
    <div>
      <SEOHead
        title="Project Management for IDs"
        description="How to scope, estimate, and manage instructional design projects. Covers development time ratios, kickoff meetings, stakeholder expectations, version control, and when to say no."
        path="/project-management"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #059669 100%)' }}
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <GanttChart size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Project Management for IDs
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            ID programs teach design. They don't teach how to scope a project, set realistic timelines,
            or have the "something has to give" conversation. This guide covers the career-critical
            project skills that separate working IDs from struggling ones.
          </p>
        </div>
      </div>

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <div className="mb-8 space-y-3 text-gray-700 text-sm leading-relaxed">
        <p>
          Most ID projects don't fail because the design was bad. They fail because the scope was
          never clearly defined, the timeline was never realistic, or the ID said yes to everything
          and delivered nothing well. Project management is the skill gap that shows up most
          consistently in early-career IDs — and it's almost never taught.
        </p>
        <p>
          The sections below cover the practical mechanics: how to run a kickoff, how to estimate
          development time using research-backed ratios, how to write a scope document, and how to
          manage the inevitable moment when a stakeholder wants more than the timeline allows.
        </p>
      </div>

      {/* ── Section 1: Project Lifecycle ──────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="The ID Project Lifecycle" />

        <AccordionSection title="How ADDIE phases map to a real project" defaultOpen={true}>
          <p>
            ADDIE is a design process, not a project plan. In practice, each phase has a project
            management layer on top of it — stakeholder touchpoints, formal approvals, and handoffs
            that ADDIE doesn't describe. Here's how the two map together:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden mt-2">
              <thead>
                <tr style={{ backgroundColor: ACCENT_LIGHT }}>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>ADDIE Phase</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Project Activity</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Key Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { phase: 'Analysis', activity: 'Kickoff meeting, stakeholder interviews, TNA, audience analysis', output: 'Scope document + needs analysis report' },
                  { phase: 'Design',   activity: 'IDD / design doc, storyboard outline, SME identification', output: 'Approved design document' },
                  { phase: 'Develop',  activity: 'Content development, SME reviews, alpha → beta → sign-off cycle', output: 'Approved course files (SCORM or source)' },
                  { phase: 'Implement', activity: 'LMS upload, pilot run, technical QA, learner communication', output: 'Course live and tracked' },
                  { phase: 'Evaluate', activity: 'Level 1–2 data collection, post-launch debrief, lessons learned', output: 'Evaluation report' },
                ].map(({ phase, activity, output }) => (
                  <tr key={phase} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{phase}</td>
                    <td className="px-4 py-3 text-gray-600">{activity}</td>
                    <td className="px-4 py-3 text-gray-600">{output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout type="tip">
            The most commonly skipped phase in real projects is Evaluate — not because IDs don't
            value it, but because there's no contractual or organizational pressure to do it.
            Build Level 1 data collection into your implementation plan from the start, not as an afterthought.
          </Callout>
        </AccordionSection>

        <AccordionSection title="Typical time allocations across phases">
          <p>
            There's no universal split — complexity, content type, and team size all affect it —
            but as a planning baseline, experienced IDs tend to allocate time roughly like this:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li><strong>Analysis: 10–20%</strong> — Often underbudgeted. Rushing this phase is the most common cause of mid-project scope disasters.</li>
            <li><strong>Design: 15–20%</strong> — The IDD and storyboard outline. Time here saves multiples in Develop.</li>
            <li><strong>Develop: 50–60%</strong> — The majority of the clock. Includes SME review cycles, which are notoriously hard to schedule.</li>
            <li><strong>Implement: 5–10%</strong> — Longer than expected if LMS coordination is involved.</li>
            <li><strong>Evaluate: 5–10%</strong> — If it happens. Plan for it explicitly or it won't.</li>
          </ul>
        </AccordionSection>
      </div>

      {/* ── Section 2: Scoping ────────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Scoping a Project: What to Nail Down First" />

        <AccordionSection title="The first meeting is the most important one">
          <p>
            The first stakeholder meeting sets the entire trajectory of a project. Go in with a
            structured agenda, not just a conversation. You're trying to establish scope, constraints,
            and decision-making authority — all of which become expensive to resolve later.
          </p>
          <p>The five questions you must answer before leaving:</p>
          <div className="space-y-2 mt-1">
            <NumberedItem n={1} title="What is the performance problem?">
              Not "we need training on X" — but what specifically are people doing or not doing?
              What's the observable gap? If the stakeholder can't answer this, the project scope isn't ready.
            </NumberedItem>
            <NumberedItem n={2} title="Who is the audience and how will they access the training?">
              Role, experience level, device access, network constraints, language, and any accessibility
              requirements. These answers drive format decisions more than content does.
            </NumberedItem>
            <NumberedItem n={3} title="What is the hard deadline and why?">
              Distinguish real deadlines (regulatory compliance date, product launch) from arbitrary ones
              ("we'd like it by Q3"). The nature of the deadline determines how much negotiating room you have.
            </NumberedItem>
            <NumberedItem n={4} title="Who is the SME and how available are they?">
              Get a name, a role, and an honest availability estimate. "Whenever you need them" is not
              an availability answer. Low SME availability is the single biggest predictor of timeline slippage.
            </NumberedItem>
            <NumberedItem n={5} title="Who has final approval authority?">
              Establish this clearly. If the person in the room can't approve deliverables, find out
              who can — and get them involved before, not after, the first review cycle.
            </NumberedItem>
          </div>
          <Callout type="warning">
            Scope creep almost always starts in the first meeting. Stakeholders say "and we'd also like..."
            Document everything, but explicitly label requests that fall outside the agreed scope.
            "That's a great idea — that would be a separate phase or project" is a complete sentence.
          </Callout>
        </AccordionSection>

        <AccordionSection title="Writing a project scope document">
          <p>
            A scope document doesn't need to be long. Its only job is to create shared, written
            agreement on what you're delivering, by when, and what's excluded. A one-page document
            prevents 10 hours of mid-project renegotiation.
          </p>
          <p>A solid scope document includes:</p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li><strong>Project description</strong> — topic, audience, delivery format, estimated seat time</li>
            <li><strong>Objectives</strong> — 2–4 high-level learning outcomes</li>
            <li><strong>Deliverables</strong> — exactly what you're producing (storyboard, SCORM file, facilitator guide, etc.)</li>
            <li><strong>Timeline</strong> — key milestones with dates, including review cycles</li>
            <li><strong>Review cycle terms</strong> — number of review rounds included, expected turnaround time from reviewers</li>
            <li><strong>Out of scope</strong> — explicitly list what's NOT included (translation, accessibility cert, maintenance)</li>
            <li><strong>Assumptions</strong> — what you're counting on (SME availability, content provided by X date, LMS access by Y date)</li>
            <li><strong>Change process</strong> — how changes to scope are requested and authorized</li>
          </ul>
          <p>
            Cross-link: use the{' '}
            <Link to="/templates" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              Template Library
            </Link>
            {' '}for a copy-ready Project Scope Statement template.
          </p>
        </AccordionSection>
      </div>

      {/* ── Section 3: Development Time Estimation ────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Estimating Development Time" />

        <AccordionSection title="The Chapman Alliance ratios: what the research actually says" defaultOpen={false}>
          <p>
            The most rigorous published data on ID development time comes from Chapman (2010),
            a research study covering development ratios across formats and complexity levels.
            The ratio represents <strong>development hours required per one finished hour of instruction</strong>.
          </p>
          <div className="rounded-xl border border-gray-200 overflow-hidden mt-3 mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: ACCENT_LIGHT }}>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Format</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Description</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Low</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Avg</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>High</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CHAPMAN_DATA.map(({ level, desc, low, avg, high, rowBg }) => (
                  <tr key={level} style={{ backgroundColor: rowBg }}>
                    <td className="px-4 py-3 font-bold text-gray-900 align-top whitespace-nowrap">{level}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs align-top">{desc}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700 align-top">{low}</td>
                    <td className="px-4 py-3 text-center font-bold align-top" style={{ color: ACCENT }}>{avg}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700 align-top">{high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400">
            Source: Chapman, B. (2010). <em>How Long Does it Take to Create Learning? [Research Study]</em>. Chapman Alliance LLC.
            Level 3 high-end projects can exceed 2,000:1 for very advanced simulations and games.
          </p>
          <Callout type="info">
            <strong>How to use these numbers:</strong> Estimate your finished seat time first (e.g., 30 minutes of
            eLearning), then multiply by the ratio that matches your complexity level to get total development
            hours. A 30-minute Level 2 interactive course at average complexity = 30 min × 184 = 92 hours of
            development. Translate to a calendar timeline by accounting for SME review cycles, which often
            add 2–4 weeks regardless of development hours.
          </Callout>
        </AccordionSection>

        <AccordionSection title="When the ratios break down — and what to do">
          <p>
            The Chapman ratios are averages. Several conditions push real projects outside these ranges:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li><strong>New content area:</strong> If there's no existing content to build from and the SME relationship requires significant relationship-building, add 20–30% to estimates</li>
            <li><strong>High review cycle friction:</strong> Stakeholders who rewrite instead of review can double the Develop phase. Each pass through legal, compliance, or accessibility review adds calendar time regardless of hours</li>
            <li><strong>Custom media production:</strong> Original video, voiceover, or custom illustration is not captured in the ratios and must be estimated separately</li>
            <li><strong>Branching / non-linear design:</strong> A course with 5 decision branches doesn't take 5× longer, but it takes significantly more than a linear course — each branch requires its own review and QA pass</li>
            <li><strong>Solo ID vs. team:</strong> The ratios don't account for project management overhead. Solo IDs should add 15–20% for coordination and communication tasks</li>
          </ul>
          <Callout type="tip">
            Present estimates as ranges, not point estimates. "This project will take 80–120 development
            hours depending on SME review turnaround and the complexity of the branching" is a more honest
            and defensible estimate than "it will take 90 hours."
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Section 4: Stakeholder Expectations ──────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Managing Stakeholder Expectations When Timelines Shift" />

        <AccordionSection title="The 'something has to give' conversation">
          <p>
            When a project is running behind — or when a stakeholder adds scope mid-project — you
            have three levers: <strong>time, scope, or quality</strong>. You can't add to one without
            taking from another. This conversation is uncomfortable but necessary, and it goes better
            when you frame it as a decision the stakeholder needs to make, not a problem you're
            reporting.
          </p>
          <p>The conversation structure:</p>
          <div className="space-y-2 mt-1">
            <NumberedItem n={1} title="State the situation factually">
              "We're currently tracking two weeks behind the original milestone due to [specific cause —
              SME unavailability, late content delivery, additional review round]. The current delivery
              date of [X] is at risk."
            </NumberedItem>
            <NumberedItem n={2} title="Present the options, not a recommendation">
              "We have three paths: extend the timeline by two weeks, reduce scope by removing [specific
              element], or proceed on schedule with a reduced review cycle. I want to make sure you're
              the one making this call."
            </NumberedItem>
            <NumberedItem n={3} title="Get a decision in writing">
              Whatever they decide, send a confirmation email the same day. "Per our conversation, we've
              agreed to [option]. The revised delivery date is [X]." This protects both parties.
            </NumberedItem>
          </div>
          <Callout type="warning">
            "We'll figure it out" is not a decision. If you leave a conversation without a documented
            resolution, the original timeline remains the official expectation — and you'll be held to it.
          </Callout>
        </AccordionSection>

        <AccordionSection title="Proactive vs. reactive communication">
          <p>
            Stakeholders consistently rate early, proactive communication about delays better than
            late notification — even when the delay is the same. Tell people early, tell them
            specifically, and tell them what you're doing about it.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li>Send weekly status updates for projects longer than 3 weeks — even when everything is on track. No news is not reassuring to stakeholders.</li>
            <li>Flag risks before they become delays. "We're still waiting on the compliance review — if it doesn't arrive by Thursday, we'll need to push the delivery date" gives people time to act.</li>
            <li>Be specific about causes when things slip. "We're delayed" is worse than "the SME review took 10 days instead of 5 — here's the adjusted plan."</li>
            <li>Distinguish between calendar slippage and work slippage. A delay caused by a stakeholder's slow review cycle is different from a delay caused by your work pace.</li>
          </ul>
        </AccordionSection>
      </div>

      {/* ── Section 5: Version Control ────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Version Control for Course Files" />

        <AccordionSection title="Naming conventions and folder structure">
          <p>
            Course files get messy fast — especially once review cycles start. A consistent naming
            convention from day one costs nothing and saves hours of confusion later.
          </p>
          <p><strong>Recommended file naming pattern:</strong></p>
          <div className="font-mono text-xs bg-gray-900 text-green-400 rounded-lg p-4 leading-relaxed">
            [ProjectCode]_[Deliverable]_v[version]_[YYYYMMDD]<br />
            <br />
            Examples:<br />
            APEX_CyberAware_Storyboard_v1.0_20260301.pptx<br />
            APEX_CyberAware_Storyboard_v1.1_SMEreview_20260308.pptx<br />
            APEX_CyberAware_Storyboard_v2.0_APPROVED_20260315.pptx<br />
          </div>
          <p><strong>Recommended folder structure:</strong></p>
          <div className="font-mono text-xs bg-gray-900 text-green-400 rounded-lg p-4 leading-relaxed">
            /[ProjectName]/<br />
            &nbsp;&nbsp;/01_Admin/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← scope doc, kickoff notes, emails<br />
            &nbsp;&nbsp;/02_Analysis/ &nbsp;&nbsp;&nbsp;&nbsp;← TNA, audience analysis, job task analysis<br />
            &nbsp;&nbsp;/03_Design/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← IDD, storyboard versions<br />
            &nbsp;&nbsp;/04_Development/ &nbsp;← source files (Storyline, Captivate, etc.)<br />
            &nbsp;&nbsp;/05_Review/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← reviewer feedback, marked-up files<br />
            &nbsp;&nbsp;/06_Final/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← approved source + published output<br />
            &nbsp;&nbsp;/07_Assets/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← images, audio, video, fonts<br />
          </div>
          <Callout type="tip">
            Never work from a file named "FINAL" or "FINAL_v2" or "FINAL_FINAL." Use version numbers
            and dates. Mark truly approved files with "APPROVED" rather than "FINAL" — it's clearer
            about what the label means.
          </Callout>
        </AccordionSection>

        <AccordionSection title="What to track across review cycles">
          <p>
            Maintain a simple review log for every project. It doesn't need to be sophisticated —
            a shared spreadsheet works. Track:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li><strong>Review round number</strong> and date sent</li>
            <li><strong>Reviewer name(s)</strong> and role</li>
            <li><strong>Date feedback received</strong> (vs. date requested)</li>
            <li><strong>Number of comments / change requests</strong></li>
            <li><strong>Changes made</strong> vs. <strong>changes deferred</strong> with rationale</li>
            <li><strong>Date approved</strong> and by whom</li>
          </ul>
          <p>
            This log becomes your paper trail if disputes arise about what was approved or when.
            It also lets you identify patterns — if one reviewer consistently takes twice as long
            as agreed, that's a scope risk for future projects with the same client.
          </p>
        </AccordionSection>
      </div>

      {/* ── Section 6: Kickoff Meeting ────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="The Project Kickoff Meeting" />

        <AccordionSection title="What to cover and what to get in writing">
          <p>
            The kickoff meeting is not an introduction — it's a working session. By the end of it,
            you should have enough information to write a scope document and start the analysis phase.
            Don't leave without covering these:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li><strong>Project background:</strong> What triggered this training request? What has been tried before?</li>
            <li><strong>Performance gap:</strong> What specifically should learners do differently after the training?</li>
            <li><strong>Audience details:</strong> Who are the learners, how many, what's their technical access?</li>
            <li><strong>Format preference:</strong> Is there a preferred or required delivery format? Why?</li>
            <li><strong>Timeline:</strong> What's the deadline, how fixed is it, and are there intermediate milestones?</li>
            <li><strong>Review process:</strong> Who reviews, in what order, how many rounds, what's the expected turnaround?</li>
            <li><strong>Existing content:</strong> What source material exists? Who owns it and when can you access it?</li>
            <li><strong>Success criteria:</strong> How will you and the stakeholder know this project succeeded?</li>
          </ul>
          <Callout type="tip">
            Send the kickoff agenda at least 24 hours in advance with a note that attendees should come
            prepared to answer these questions. Stakeholders who arrive unprepared add 2–3 follow-up
            meetings to your project. Prepare them with specific questions, not a vague "we'll discuss the project."
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Section 7: When to Say No ─────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="When to Say No (or 'Not Without Additional Resources')" />

        <AccordionSection title="How to push back without damaging the relationship">
          <p>
            Saying yes to everything and delivering something poor is worse for the relationship than
            saying no clearly and early. The key is framing the refusal around constraints and trade-offs,
            not personal capacity or willingness.
          </p>
          <p>Situations that warrant a direct pushback — and how to frame them:</p>
          <div className="space-y-3 mt-2">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <p className="font-semibold text-gray-800 mb-1">Situation: Unrealistic deadline</p>
              <p className="text-xs text-gray-500 mb-2">❌ "I don't have time for that."</p>
              <p className="text-xs text-gray-700">✓ "Based on the scope and the Chapman research benchmarks for this type of content, this project requires approximately [X] development hours. To deliver by [date], I'd need to either reduce the scope to [specific elements] or bring in additional resources. Which approach works better for you?"</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <p className="font-semibold text-gray-800 mb-1">Situation: Mid-project scope addition</p>
              <p className="text-xs text-gray-500 mb-2">❌ "That's not what we agreed to."</p>
              <p className="text-xs text-gray-700">✓ "I can absolutely add that. Adding [X] would push the delivery date by approximately [time], or we could remove [Y] from the current scope to keep the timeline. Would you like me to put that trade-off in writing so we can get approval?"</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <p className="font-semibold text-gray-800 mb-1">Situation: Skipping the design phase</p>
              <p className="text-xs text-gray-500 mb-2">❌ "We need to do a design doc first."</p>
              <p className="text-xs text-gray-700">✓ "If we skip the design document and go straight to development, we risk rebuilding content after it's built when the stakeholder reviews it. In my experience, that costs more time than the design phase saves. I can do a streamlined two-page design brief instead of a full IDD — that gives us alignment without slowing us down significantly."</p>
            </div>
          </div>
          <Callout type="info">
            The goal of every pushback is to give the stakeholder a real choice, not to win an argument.
            When they understand the trade-offs and make an informed decision, they own the outcome.
            When you just say no, they experience it as obstruction.
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Scope Quick Reference ─────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Project Scope — Kickoff Checklist" />
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Copy and use in your first stakeholder meeting</p>
            <CopyButton text={SCOPE_QUICK_REF} />
          </div>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">
            {SCOPE_QUICK_REF}
          </pre>
        </div>
      </div>
    </div>
  )
}
