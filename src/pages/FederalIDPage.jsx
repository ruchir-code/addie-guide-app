import { useState } from 'react'
import { Building2, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import CopyButton from '../components/ui/CopyButton'

const ACCENT       = '#1D4ED8'
const ACCENT_LIGHT = '#EFF6FF'
const ACCENT_BORDER = '#BFDBFE'

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
    info:    { bg: ACCENT_LIGHT, border: ACCENT_BORDER, Icon: Info,  iconColor: ACCENT,    label: 'Context' },
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

// ─── Acronym data ───────────────────────────────────────────────────────────────

const ACRONYMS = [
  { acronym: 'ATO',   meaning: 'Authority to Operate',                note: 'Security authorization for an IT system to go live on a government network. Your LMS needs one.' },
  { acronym: 'CAC',   meaning: 'Common Access Card',                  note: 'DoD smart card used for authentication. PKI/CAC access affects how learners log in to the LMS.' },
  { acronym: 'CDRL',  meaning: 'Contract Data Requirements List',     note: 'The official list of deliverables required by a contract. Every IDD, TNA, and storyboard is a CDRL item.' },
  { acronym: 'COR',   meaning: "Contracting Officer's Representative", note: 'The government employee who manages day-to-day contract performance and accepts deliverables.' },
  { acronym: 'CUI',   meaning: 'Controlled Unclassified Information',  note: 'Sensitive but unclassified data with specific handling requirements. Common in security and HR training.' },
  { acronym: 'IDD',   meaning: 'Instructional Design Document',        note: 'Formal design blueprint — the government equivalent of a design spec or prototype brief.' },
  { acronym: 'LMS',   meaning: 'Learning Management System',           note: 'Platform for hosting and tracking training. Common in government: SABA, Cornerstone (CSOD), LMS365.' },
  { acronym: 'NIPR',  meaning: 'Non-classified Internet Protocol Router', note: 'The unclassified DoD network. Most training content is designed and hosted here.' },
  { acronym: 'PKI',   meaning: 'Public Key Infrastructure',            note: 'Certificate-based authentication. Determines how learners access systems — relevant for LMS login flows.' },
  { acronym: 'PWS',   meaning: 'Performance Work Statement',           note: 'Contract document describing required outcomes. Your training deliverables are defined here.' },
  { acronym: 'SCORM', meaning: 'Sharable Content Object Reference Model', note: 'Standard for packaging and tracking e-learning. Most government LMSes still require SCORM 1.2.' },
  { acronym: 'SIPR',  meaning: 'Secret Internet Protocol Router',      note: 'The DoD network for classified information. Courses on SIPR have different technical requirements.' },
  { acronym: 'SOW',   meaning: 'Statement of Work',                    note: 'Broader than a PWS — describes both what is delivered and how work is to be performed.' },
  { acronym: 'TNA',   meaning: 'Training Needs Analysis',              note: 'In federal contexts, often a formal written deliverable — not just a process step.' },
  { acronym: 'VPAT',  meaning: 'Voluntary Product Accessibility Template', note: 'Document certifying that a product meets Section 508/WCAG accessibility requirements.' },
  { acronym: 'xAPI',  meaning: 'Experience API (Tin Can API)',          note: 'Modern tracking standard supporting offline and mobile. Adoption in government LMSes is still limited.' },
]

const QUICK_REF = ACRONYMS
  .map(a => `${a.acronym} — ${a.meaning}\n  ${a.note}`)
  .join('\n\n')

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function FederalIDPage() {
  return (
    <div>
      <SEOHead
        title="Federal & Government ID Guide"
        description="Instructional design in federal agencies and DoD: Section 508, SCORM in government LMS, TNA as a deliverable, working with CORs, clearance-level content, and federal training types."
        path="/federal-id"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0C1B33 0%, #1E3A5F 50%, #2563EB 100%)' }}
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Federal &amp; Government ID
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Government ID has requirements that standard ID training doesn't cover. Contract deliverables,
            Section 508, LMS constraints, and clearance considerations — written from practitioner experience.
          </p>
        </div>
      </div>

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <div className="mb-8 space-y-3 text-gray-700 text-sm leading-relaxed">
        <p>
          Instructional design in federal agencies and DoD looks like corporate ID on the surface — the
          phases are the same, the tools are familiar, and the learners have the same cognitive constraints
          as anyone else. But the operating environment is different in ways no ID program covers: formal
          contract deliverables, legal accessibility mandates, LMS platforms running on restricted networks,
          and stakeholders who are contracting officers as much as subject matter experts.
        </p>
        <p>
          This guide covers the practical differences that matter for producing good training in a government
          context. Not theory — the things you need to know before your first deliverable review.
        </p>
      </div>

      {/* ── Section 1: ADDIE in Federal Context ───────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="ADDIE in the Federal Context" />

        <AccordionSection title="How the contract structure shapes your ADDIE process" defaultOpen={true}>
          <p>
            In federal contracting, ADDIE isn't just a process — it's a deliverable structure. Each phase
            typically produces a formal document that the government client reviews and approves before you
            move to the next phase. That approval is often a contract milestone, which means delays in sign-off
            affect the project timeline and potentially the budget.
          </p>
          <div className="space-y-2 mt-2">
            <NumberedItem n={1} title="Analysis → Training Needs Analysis (TNA)">
              A written document identifying the performance gap, causal analysis, target audience, and
              training recommendations. Delivered and approved before design begins.
            </NumberedItem>
            <NumberedItem n={2} title="Design → Instructional Design Document (IDD)">
              The formal design blueprint: objectives, content outline, instructional strategies, assessment
              plan, and media specifications. The IDD is what you refer back to when scope disputes arise.
            </NumberedItem>
            <NumberedItem n={3} title="Develop → Storyboards, then SCORM/course files">
              Storyboards are typically a CDRL item — the government reviews and approves them before
              development begins. This adds a formal review cycle that doesn't exist in most corporate ID.
            </NumberedItem>
            <NumberedItem n={4} title="Implement → LMS loading and UAT">
              Government LMS environments require coordination with the LMS admin team, often through
              formal ticket/request processes. Don't assume you can upload directly.
            </NumberedItem>
            <NumberedItem n={5} title="Evaluate → Evaluation report">
              Kirkpatrick Level 1–2 data is often required as a CDRL. Level 3–4 may be a separate
              contract action, or out of scope entirely.
            </NumberedItem>
          </div>
          <Callout type="warning">
            Changes after an approved deliverable are a scope change. Document verbal change requests in
            writing immediately — "per our discussion on [date], the program office requested..." This
            protects both you and the contracting officer.
          </Callout>
        </AccordionSection>

        <AccordionSection title="CDRLs and what they mean for your workflow">
          <p>
            A Contract Data Requirements List (CDRL) specifies every deliverable required by the contract —
            including the format, due date, number of review cycles, and acceptance criteria. Before you
            design a single slide, read the CDRLs.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li>Each CDRL item has a DI (Data Item) number and a Data Item Description (DID) that defines the format requirements</li>
            <li>Deliverables submitted outside the CDRL schedule may not be accepted — or may trigger a contract modification</li>
            <li>Review cycles are limited (usually 2–3 rounds); unlimited revisions are not part of government contracts</li>
            <li>If something isn't in the CDRL, you aren't contractually obligated to produce it — and producing it may set an unintended precedent</li>
          </ul>
          <Callout type="tip">
            Ask for the CDRLs and the PWS/SOW at kickoff. If they aren't provided, request them before
            agreeing to any deliverable timeline. These documents define the actual scope of your work.
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Section 2: Section 508 ─────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Section 508 Compliance" />

        <AccordionSection title="What Section 508 requires and why it's non-negotiable">
          <p>
            Section 508 of the Rehabilitation Act requires that all electronic content produced for or by
            the federal government be accessible to people with disabilities. For training, the current
            standard is WCAG 2.1 Level AA. This isn't a best practice — it's a legal requirement, and
            non-compliant deliverables can be rejected.
          </p>
          <p>
            The practical implications for e-learning:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li><strong>All images</strong> need descriptive alt text — not "image1.jpg," but what the image communicates</li>
            <li><strong>All video</strong> needs captions (synchronized) and a separate transcript for audio-only content</li>
            <li><strong>Color alone</strong> cannot convey meaning — a red/green answer indicator must also use text or an icon</li>
            <li><strong>Keyboard navigation</strong> must work for every interaction — tab order must be logical and all elements reachable</li>
            <li><strong>Focus indicators</strong> must be visible on all interactive elements for keyboard users</li>
            <li><strong>Screen reader compatibility</strong> — test with NVDA or JAWS, not just the authoring tool's preview</li>
            <li><strong>Sufficient color contrast</strong> — 4.5:1 ratio minimum for body text, 3:1 for large text</li>
            <li><strong>No content that flashes</strong> more than 3 times per second (seizure risk)</li>
          </ul>
        </AccordionSection>

        <AccordionSection title="VPATs, Trusted Tester, and the delivery process">
          <p>
            When you deliver a course, the government may require a Voluntary Product Accessibility Template
            (VPAT) — a completed self-assessment of how well your course meets each WCAG criterion. Some
            contracts specify this as a CDRL item.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li>The VPAT is not a third-party audit — it's your declaration of compliance. Accuracy matters because the government can test it.</li>
            <li>The <strong>DHS Trusted Tester</strong> program provides a formal methodology for testing 508 compliance in web-based content, including e-learning</li>
            <li>Some agencies require Trusted Tester certification on the project team — confirm this requirement at kickoff</li>
            <li>Authoring tool compliance varies: Articulate Storyline has stronger 508 support than many competitors, but "WCAG compliant" claims in marketing don't mean your course is automatically compliant</li>
          </ul>
          <Callout type="tip">
            Build 508 compliance into your storyboard and development process from the start. Retrofitting
            accessibility after a course is built costs 3–5x more time than building it in correctly.
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Section 3: SCORM vs. xAPI ──────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="SCORM vs. xAPI in Government LMS Environments" />

        <AccordionSection title="Why most government systems still run SCORM 1.2">
          <p>
            Government LMSes (SABA, Cornerstone on Demand/CSOD, LMS365, and various custom platforms)
            were often implemented years ago and haven't been modernized. The majority still require
            SCORM 1.2 — not SCORM 2004, not xAPI. Before you build anything, ask the LMS administrator
            which SCORM version and profile the system supports.
          </p>
          <p>
            SCORM 1.2 has real limitations you need to design around:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li><strong>255-character data field</strong> — quiz scores, bookmarking, and suspend data all share this field. Complex branching courses can hit the limit.</li>
            <li><strong>Completion vs. pass/fail</strong> — SCORM 1.2 tracks "lesson_status" as completed, incomplete, passed, or failed. Confirm which statuses the LMS acts on.</li>
            <li><strong>No offline tracking</strong> — users must be connected. This matters for deployments to users in low-bandwidth environments.</li>
            <li><strong>Single SCO limitation</strong> — if your course has multiple modules, confirm whether the LMS tracks at the package level or the module level.</li>
          </ul>
        </AccordionSection>

        <AccordionSection title="When xAPI is available and what it changes">
          <p>
            xAPI (Experience API / Tin Can) supports richer tracking — mobile learning, offline activity,
            simulations, and detailed performance data beyond pass/fail. If the government LMS supports
            xAPI and the contract requires this level of tracking, it's worth using. But confirm LRS
            (Learning Record Store) availability, because xAPI requires a separate data store.
          </p>
          <Callout type="info">
            <strong>What to ask before development:</strong> What LMS version is running? Is SCORM 1.2,
            SCORM 2004, or xAPI supported? What are the exact completion and scoring criteria? What is
            the maximum file size for uploaded packages? These answers shape your entire development approach.
          </Callout>
          <Callout type="warning">
            Never assume LMS compatibility. Authoring tool "publish to SCORM 1.2" settings vary in their
            output. Test a small pilot module in the actual government LMS before full development — not
            in the preview mode of your authoring tool.
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Section 4: TNA ─────────────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Training Needs Analysis as a Formal Deliverable" />

        <AccordionSection title="What a federal TNA document contains">
          <p>
            In the private sector, a needs analysis is a process — a set of interviews, surveys, and
            observations that inform design decisions. In federal contracting, it's often a formal written
            document that the government approves before you are authorized to proceed to design. That
            distinction matters.
          </p>
          <p>A complete federal TNA typically includes:</p>
          <div className="space-y-2 mt-2">
            <NumberedItem n={1} title="Purpose and scope statement">
              What specific performance problem is this TNA investigating? What is in and out of scope?
            </NumberedItem>
            <NumberedItem n={2} title="Methodology">
              How was data collected? Who was interviewed or surveyed? What job task analysis methods were used?
            </NumberedItem>
            <NumberedItem n={3} title="Target audience analysis">
              Who are the learners? Roles, experience levels, prior training, access to systems, and any special considerations (clearance level, shift work, remote access).
            </NumberedItem>
            <NumberedItem n={4} title="Current state vs. desired state">
              What is happening now, and what should be happening? Specific and observable — not "employees need better awareness" but "employees are not following the clean desk policy in X% of audits."
            </NumberedItem>
            <NumberedItem n={5} title="Causal analysis">
              Is this actually a training problem? Apply Gilbert's BEM or a similar framework to distinguish knowledge/skill gaps from process, resource, or incentive issues.
            </NumberedItem>
            <NumberedItem n={6} title="Recommendations with rationale">
              What training (or non-training) solutions are recommended? Why? What are the expected outcomes?
            </NumberedItem>
            <NumberedItem n={7} title="Appendices">
              Interview protocols, survey instruments, job task analysis worksheets, and any data referenced in the body.
            </NumberedItem>
          </div>
          <Callout type="tip">
            Get TNA approval in writing before starting design. If the program office changes direction
            after TNA sign-off, that is a scope change — document it as one.
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Section 5: Stakeholders ────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Working with CORs and Program Offices" />

        <AccordionSection title="Understanding your actual stakeholders in a federal contract">
          <p>
            In a government contract, you typically have three distinct stakeholder groups, and conflating
            them causes problems:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li><strong>Contracting Officer (KO):</strong> Has legal authority over the contract. You don't interact with the KO regularly, but their signature is what makes contract modifications official.</li>
            <li><strong>Contracting Officer's Representative (COR):</strong> Manages day-to-day performance. Reviews and accepts deliverables. Your primary point of contact for contract matters. Does not necessarily understand ID.</li>
            <li><strong>Program Office:</strong> The actual client — the people who own the training requirement and will use it. They have mission priorities that may conflict with L&D best practices. The SME usually comes from here.</li>
          </ul>
          <p>
            When the program office asks for something that isn't in the contract, it's the COR who has
            to authorize the change. Go directly to the COR — not the program office — when scope questions
            arise. The program office cannot unilaterally expand your contract.
          </p>
          <Callout type="warning">
            If the program office says "can you also add..." and it's not in the CDRLs, do not start the
            work. Document the request, advise the COR, and wait for authorization. Out-of-scope work
            done without a contract modification puts you in a difficult position.
          </Callout>
        </AccordionSection>

        <AccordionSection title="What to get in writing at kickoff">
          <p>
            The government kickoff meeting often feels informal, but it's your best opportunity to
            establish shared expectations before the first deliverable is due.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li>Confirm who the COR is and who on the program office has deliverable approval authority</li>
            <li>Establish the review timeline for each CDRL item — how many days does the government have to review?</li>
            <li>Clarify the number of review cycles included in the contract</li>
            <li>Identify the SMEs who will participate in the project and their availability</li>
            <li>Confirm LMS details: platform, version, upload process, testing environment access</li>
            <li>Ask about any existing course content, style guides, or branding requirements</li>
            <li>Confirm Section 508 requirements and whether a VPAT is a deliverable</li>
          </ul>
          <Callout type="tip">
            Follow up the kickoff meeting with a written summary ("per our kickoff discussion on [date]...").
            This becomes the shared reference document when timelines slip or priorities shift.
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Section 6: Clearance ───────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Clearance-Level Content Considerations" />

        <AccordionSection title="CUI, classification, and your training materials">
          <p>
            Most federal training content is Unclassified and lives on NIPR (the unclassified network).
            But even on NIPR, content may involve Controlled Unclassified Information (CUI) — data that
            isn't classified but has specific handling, marking, and access requirements under Executive
            Order 13556 and NIST SP 800-171.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li>CUI categories include law enforcement sensitive, privacy data (PII), export-controlled information, and pre-decisional data</li>
            <li>CUI training materials must be marked with the appropriate CUI designation header</li>
            <li>Distribution should be limited to personnel with a need-to-know, even if the content is unclassified</li>
            <li>Storing CUI on personal devices, personal cloud drives, or non-approved systems is a policy violation</li>
          </ul>
          <Callout type="warning">
            Never include classified information in a training course unless you are operating on the
            appropriate classified network (SIPR for Secret, JWICS for TS/SCI) and have explicit
            authorization from the security office. When in doubt, ask the Information System Security
            Officer (ISSO) before including any potentially sensitive content.
          </Callout>
        </AccordionSection>

        <AccordionSection title="Designing for NIPR vs. SIPR environments">
          <p>
            If a course must be hosted on SIPR (the Secret-level network), the technical requirements
            change significantly:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 ml-1">
            <li>External resources (CDN-hosted fonts, online images, third-party scripts) cannot be used — all assets must be self-contained</li>
            <li>Internet-dependent features (YouTube embeds, Google Fonts, external analytics) will not function on classified networks</li>
            <li>File transfer to SIPR requires approved processes — you cannot simply email or USB-transfer SCORM packages</li>
            <li>Testing on SIPR requires physical or VPN access to the classified network, which requires your own appropriate clearance</li>
            <li>SIPR LMS platforms may be different versions from their NIPR counterparts — confirm SCORM requirements separately</li>
          </ul>
        </AccordionSection>
      </div>

      {/* ── Section 7: Training Types ──────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Federal Training Types: Awareness, Role-Based, and Certification" />

        <AccordionSection title="The three categories and why they require different designs">
          <p>
            Federal agencies formally distinguish between three training types. The distinction matters
            for design, tracking, and record-keeping — and conflating them leads to courses that don't
            meet the actual requirement.
          </p>
          <div className="space-y-4 mt-2">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: ACCENT_LIGHT, borderColor: ACCENT_BORDER }}>
              <p className="font-bold text-gray-900 mb-1">Awareness Training</p>
              <p className="text-sm text-gray-600 mb-2">
                Broad exposure to a topic — typically mandatory, annual, and compliance-driven. Examples:
                cybersecurity awareness, insider threat, ethics, sexual harassment prevention.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                <li><strong>Design focus:</strong> Recognition, not mastery. The goal is that learners can identify situations and know where to report.</li>
                <li><strong>Length:</strong> Typically 30–60 minutes. Often legislatively mandated (e.g., FISMA requires annual cyber awareness).</li>
                <li><strong>Tracking:</strong> Completion-based. Pass/fail thresholds are usually minimal or absent.</li>
                <li><strong>Assessment:</strong> Short knowledge check to confirm completion, not to certify competency.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-amber-200" style={{ backgroundColor: '#FFFBEB' }}>
              <p className="font-bold text-gray-900 mb-1">Role-Based Training</p>
              <p className="text-sm text-gray-600 mb-2">
                Tied to a specific position, function, or system access. Required to perform a job duty
                or maintain a privilege. Examples: system administrator training, COR certification, ISSO training.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                <li><strong>Design focus:</strong> Skill building and application. Scenarios and practice are appropriate here.</li>
                <li><strong>Length:</strong> Varies widely — from 2 hours to multi-day programs.</li>
                <li><strong>Tracking:</strong> Completion and often a passing score on an assessment.</li>
                <li><strong>Record-keeping:</strong> Completion records may be tied to system access — if the training lapses, access is revoked.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-emerald-200" style={{ backgroundColor: '#F0FDF4' }}>
              <p className="font-bold text-gray-900 mb-1">Certification Training</p>
              <p className="text-sm text-gray-600 mb-2">
                Formal qualification required to perform specific duties. Examples: HAZMAT handling,
                weapons qualification, contracting officer warrants, certain IT security roles.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                <li><strong>Design focus:</strong> Demonstrated competency under defined conditions — often includes performance-based assessment, not just a multiple-choice test.</li>
                <li><strong>Tracking:</strong> Formal certificate issuance, expiration dates, and recertification cycles. Official records are maintained at the organizational level.</li>
                <li><strong>Legal implications:</strong> Certifications often carry regulatory or safety implications — accuracy and rigor of assessment design matter more here than anywhere else.</li>
              </ul>
            </div>
          </div>
          <Callout type="tip">
            Ask the program office upfront: "Is this awareness, role-based, or certification training?"
            The answer determines your assessment design, completion criteria, and record-keeping requirements
            — before you write a single objective.
          </Callout>
        </AccordionSection>
      </div>

      {/* ── Acronym Quick Reference ────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionHeading label="Acronym Quick Reference" />
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mb-3">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: ACCENT_LIGHT }}>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Acronym</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Meaning</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider hidden sm:table-cell" style={{ color: ACCENT }}>Context</th>
                <th className="px-4 py-3 text-right">
                  <CopyButton text={QUICK_REF} />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ACRONYMS.map(({ acronym, meaning, note }) => (
                <tr key={acronym} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{acronym}</td>
                  <td className="px-4 py-3 text-gray-700">{meaning}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{note}</td>
                  <td className="px-4 py-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
