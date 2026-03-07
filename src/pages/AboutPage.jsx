import SEOHead from '../components/SEOHead'
import { Info, Shield, Mail, ExternalLink, BookOpen, Award, Clock } from 'lucide-react'

// ── Editorial standards ──────────────────────────────────────────────────────
const EDITORIAL = [
  {
    label: 'No affiliate links',
    body: 'No product or tool on this site is recommended because someone paid for it. All recommendations reflect direct practitioner experience.',
  },
  {
    label: 'No vendor sponsorship',
    body: 'addieguide.com has no sponsors, no advertising, and no commercial relationships with any platform, tool, publisher, or training vendor.',
  },
  {
    label: 'AI-assisted, human-reviewed',
    body: 'AI tools assist in drafting and formatting. All content — especially foundational theory, research citations, and instructional guidance — is reviewed for accuracy before publishing. No AI output is published verbatim on topics where instructional accuracy is critical.',
  },
  {
    label: 'Practitioner-first sourcing',
    body: 'Content is written from the perspective of someone actively doing this work. Primary sources are cited on Foundations pages; practitioner experience is cited explicitly rather than presented as anonymous authority.',
  },
  {
    label: 'Plain English',
    body: 'Academic hedging is minimized. Technical terms follow plain-English explanations, not replace them. If a concept can be stated clearly, it is stated clearly.',
  },
]

// ── Credentials ───────────────────────────────────────────────────────────────
const CREDENTIALS = [
  { label: 'Senior Instructional Systems Designer', sub: 'Team Carney, Inc. / CDSE, DoD — Oct 2020–Present' },
  { label: 'M.A., Management & Human Resources', sub: 'Wayland Baptist University' },
  { label: 'Generative AI for Educators', sub: 'Google' },
  { label: 'Prompt Engineering for ChatGPT', sub: 'Vanderbilt University' },
  { label: 'SCRUM Master Accredited Certificate', sub: '' },
  { label: 'U.S. Army Veteran, Military Intelligence', sub: '1996–2004, including combat deployments' },
]

const MILITARY_HONORS = [
  {
    label: 'U.S. Army service awards and campaign medals',
    sub: 'Multiple decorations for service, including campaigns in Operation Enduring Freedom and Operation Iraqi Freedom',
  },
]

const CIVILIAN_HONORS = [
  { label: 'Achievement Medal for Civilian Service', sub: 'Department of the Army · Feb 2013' },
]

// ── Content changelog ─────────────────────────────────────────────────────────
const CHANGELOG = [
  { section: 'Scenario Builder',                     updated: 'March 2026' },
  { section: 'Project Management for IDs',          updated: 'March 2026' },
  { section: 'Federal & Government ID Guide',       updated: 'March 2026' },
  { section: 'SME Management Guide',                updated: 'March 2026' },
  { section: 'ID Self-Assessment Quiz',             updated: 'March 2026' },
  { section: 'Scenario Writing Guide',              updated: 'March 2026' },
  { section: 'AI in Instructional Design',         updated: 'March 2026' },
  { section: 'Evaluation Frameworks',              updated: 'March 2026' },
  { section: 'Performance Consulting',             updated: 'March 2026' },
  { section: 'Transfer of Learning',               updated: 'March 2026' },
  { section: 'ADDIE Phase Pages (all 5)',          updated: 'February 2026' },
  { section: 'Instructional Models',               updated: 'February 2026' },
  { section: 'Learning Theories',                  updated: 'February 2026' },
  { section: "Bloom's Taxonomy",                   updated: 'February 2026' },
  { section: 'Template Library (14 templates)',    updated: 'February 2026' },
  { section: 'Glossary (150+ terms)',               updated: 'March 2026' },
  { section: 'Assessment Builder',                 updated: 'February 2026' },
  { section: 'Media & Format Guide',               updated: 'January 2026' },
  { section: 'Objectives Builder',                 updated: 'January 2026' },
]

// ── Reusable section header ───────────────────────────────────────────────────
function SectionHeading({ icon: Icon, label, color = '#7C3AED' }) {
  return (
      <div className="flex items-center gap-3 mb-5">
      <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <Icon size={18} style={{ color }} className="shrink-0" />
      <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">{label}</h2>
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="border-t border-gray-100 my-10" />
}

export default function AboutPage() {
  return (
    <div>
      <SEOHead
        title="About"
        description="Who built addieguide.com, the practitioner experience behind the content, editorial standards, and how to suggest additions or report errors."
        path="/about"
      />

      {/* ── Header banner ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(140deg, #080D1A 0%, #0F172A 40%, #1A1040 70%, #1E1B4B 100%)',
        }}
      >
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: '#7C3AED' }} />
        <div className="absolute -right-4 -bottom-8 w-40 h-40 rounded-full opacity-5" style={{ backgroundColor: '#3B82F6' }} />
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <Info size={20} className="text-white/60" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">About</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
            addieguide.com
          </h1>
          <p className="text-base font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            A practitioner-first reference and tool platform for instructional designers. Built
            by someone who does this work, for the people who are learning how to do it well.
          </p>
        </div>
      </div>

      {/* ── What this site is ─────────────────────────────────────────────── */}
      <div className="mb-10">
        <SectionHeading icon={BookOpen} label="What addieguide.com is" />
        <div
          className="space-y-4 text-gray-700 leading-relaxed text-sm rounded-xl border px-5 py-5"
          style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}
        >
          <p>
            addieguide.com is a free reference and tools platform for beginning and intermediate
            instructional designers — the kind of resource I wished existed when I was starting out.
            It covers the full ADDIE process, Analysis through Evaluation, with checklists,
            content-level toggles for beginner and intermediate readers, and a running case study
            through a fictional organization called Meridian Manufacturing.
          </p>
          <p>
            The Foundations pages (Learning Theories, Bloom's Taxonomy, Instructional Models,
            Evaluation Frameworks, Performance Consulting, Transfer of Learning) exist because
            early IDs often know the steps of ADDIE without understanding why those steps work.
            The tools (Objectives Builder, Assessment Builder, Template Library, Media Guide,
            Glossary) exist because practitioners need to produce real deliverables under time
            pressure and don't always have a mentor nearby.
          </p>
          <p>
            The site is designed to be used during actual project work — not as a study guide,
            not as a course, but as something you have open in a browser tab while you're building.
          </p>
        </div>
      </div>

      <Divider />

      {/* ── Author bio ────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <SectionHeading icon={Award} label="Who built this" />

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            I'm <strong className="text-gray-900">Ruchir Bakshi</strong>, a Senior Instructional
            Systems Designer at Team Carney, Inc., supporting the Center for Development of
            Security Excellence (CDSE) at the Department of Defense.
          </p>
          <p>
            I've been in training and instructional design since 2005. Before that, eight years
            in the U.S. Army — Reserves out of Atlanta starting in 1996, then Military Intelligence
            on active deployment through 2004. The Army didn't teach me ADDIE. It taught me to
            care about what the training actually needs to do, and to have very little patience
            for anything that gets between a learner and that outcome.
          </p>
          <p>
            When I transitioned out, I spent four years at Fort Huachuca as a DoD Training Manager
            — a team of 15-plus contractors, two government civilians, and more than 2,000 students
            from across every U.S. military branch. Booz Allen Hamilton came next, designing HUMINT
            courses and training 500-plus soldiers. At CGI I delivered a classified CBT program
            through a federal government training advisory board — not something most ISDs get to
            put on a résumé. CACI pulled me from a pool of over 50 consultants for a sensitive
            sub-project on the Army's IPPS-A HR system. Then DTS, and Team Carney starting in 2020.
          </p>
          <p>
            Right now I support a three-person team at CDSE managing 22 active courses and five
            Post-Baccalaureate Certificate programs. Courses are always in some stage of
            development, update, or accreditation maintenance.
          </p>

          {/* AI section */}
          <div
            className="rounded-xl border px-5 py-5"
            style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4338CA' }}>
              On AI in instructional design
            </p>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#1E1B4B' }}>
              <p>
                I started experimenting with large language models, open-source local models,
                and RAG workflows before most people had heard of ChatGPT. I ran a personal AI
                lab on my own hardware, testing configurations across platforms — not to become
                an AI person, but to understand what these tools could actually do before
                trusting them with real work.
              </p>
              <p>
                The gap between using AI as a search bar and using it as a design accelerator
                comes down to knowing where it fails. Most practitioners who pick up AI tools
                take the first output and move on. In instructional design, that's a quality
                problem. A Bloom's-misaligned objective reads fine in generated prose. You won't
                catch it if you don't know what to look for — and if you miss it before it
                reaches the SME, you're rewriting it later.
              </p>
              <p>
                At CDSE I've built custom AI personas calibrated to the team's standards and
                course formatting conventions, a system prompt library covering the full ISD
                workflow from learning outcomes through ACE accreditation documentation, and
                a structured alignment review process that catches Bloom's-level mismatches
                before they reach the SME. Across actual projects, that has produced timeline
                reductions of 30 to 80 working days per course.
              </p>
              <p>
                I hold a Generative AI for Educators certification from Google and a Prompt
                Engineering for ChatGPT certification from Vanderbilt University. I've also
                written{' '}
                <em>Unleashing AI: Harness the Power of Artificial Intelligence in Instructional
                Design</em>, a practical guide for ISDs who want to apply AI in real production
                work. At CDSE, the platform is Ask Sage AI — the only GenAI platform with
                FedRAMP High, DoD IL5, IL6, and Top-Secret authorizations.
              </p>
            </div>
          </div>

          <p>
            Outside this work, I co-founded the Indian Classical Music School of Columbia
            (ICMSC) with my wife Dhara, who is the lead teacher and the reason it exists. I
            run the operations side: LMS, AV, and coordination. We also co-produce SwarMatters,
            a Hindustani classical music YouTube channel with over 17,000 subscribers. I write
            on Substack about Hindu and Indian American identity and veteran advocacy.
          </p>
        </div>
      </div>

      <Divider />

      {/* ── Credentials ───────────────────────────────────────────────────── */}
      <div className="mb-10">
        <SectionHeading icon={Award} label="Credentials" />

        <div className="space-y-2 mb-6">
          {CREDENTIALS.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 rounded-lg border"
              style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}
            >
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: '#7C3AED' }}
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                {c.sub && (
                  <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Military honors */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: '#DC2626' }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6B7280' }}>Military Honors</p>
        </div>
        <div className="space-y-2 mb-6">
          {MILITARY_HONORS.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 rounded-lg border"
              style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
            >
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: '#DC2626' }}
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                {c.sub && (
                  <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Civilian honor */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: '#B45309' }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6B7280' }}>Civilian Honor</p>
        </div>
        <div className="space-y-2">
          {CIVILIAN_HONORS.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 rounded-lg border"
              style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
            >
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: '#B45309' }}
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                {c.sub && (
                  <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── Editorial standards ───────────────────────────────────────────── */}
      <div className="mb-10">
        <SectionHeading icon={Shield} label="Editorial standards" color="#0369A1" />
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          addieguide.com is a practitioner resource, not a media property. These standards
          govern how content is developed and maintained.
        </p>
        <div className="space-y-3">
          {EDITORIAL.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border px-4 py-4"
              style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', borderLeftColor: '#7C3AED', borderLeftWidth: '3px' }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: '#5B21B6' }}>{item.label}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── Changelog ─────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <SectionHeading icon={Clock} label="Content changelog" color="#059669" />
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Last major content update per section. Ongoing refinements (wording, fixes) are
          not logged here.
        </p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#EDE9FE' }}>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Last updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CHANGELOG.map((row, i) => (
                <tr key={i} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-gray-700 font-medium">{row.section}</td>
                  <td className="px-4 py-2.5 text-gray-500">{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Divider />

      {/* ── Contact / contribute ──────────────────────────────────────────── */}
      <div className="mb-4">
        <SectionHeading icon={Mail} label="Suggest an addition or report an error" color="#C2410C" />
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          If you find an error, a gap, or a topic that should be covered, I want to know.
          This site improves because practitioners use it and tell me what's missing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="mailto:hello@rbakshi.com"
            className="flex items-center gap-3 px-4 py-4 rounded-xl border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#E2E8F0' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#EDE9FE' }}
            >
              <Mail size={16} style={{ color: '#7C3AED' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Content & feedback</p>
              <p className="text-xs text-gray-500">hello@rbakshi.com</p>
            </div>
            <ExternalLink size={13} className="ml-auto shrink-0 text-gray-300" />
          </a>
          <a
            href="mailto:ai@rbakshi.com"
            className="flex items-center gap-3 px-4 py-4 rounded-xl border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#E2E8F0' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#F0F9FF' }}
            >
              <Mail size={16} style={{ color: '#0369A1' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">AI tools & automation</p>
              <p className="text-xs text-gray-500">ai@rbakshi.com</p>
            </div>
            <ExternalLink size={13} className="ml-auto shrink-0 text-gray-300" />
          </a>
        </div>
      </div>

    </div>
  )
}
