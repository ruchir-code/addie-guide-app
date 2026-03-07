import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import {
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wand2,
  ArrowRight,
} from 'lucide-react'
import CopyButton from '../components/ui/CopyButton'

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#EA580C'
const ACCENT_LIGHT = '#FFF7ED'
const ACCENT_BORDER = '#FED7AA'

const SCENARIO_TYPES = [
  {
    id: 'mini',
    label: 'Mini Scenario',
    tag: 'Single decision',
    color: '#0369A1',
    bg: '#F0F9FF',
    border: '#BAE6FD',
    description:
      'A brief situation followed by one decision point with 2–3 response options. No branching — the scenario ends after the choice and consequence.',
    bestFor: 'Compliance training, policy application, single-rule reinforcement, embedded knowledge checks.',
    example: '"A customer wants to return an item that is explicitly marked non-returnable. What do you do?"',
  },
  {
    id: 'branching',
    label: 'Branching Scenario',
    tag: 'Multi-decision',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    description:
      'A multi-step narrative where each decision leads to new consequences and new decision points. Choices accumulate — a bad early decision makes later options harder.',
    bestFor: 'Complex judgment skills, sales, customer service, negotiation, clinical or safety-critical decisions.',
    example: 'A 5-node scenario where a manager must navigate a performance issue without damaging the relationship or creating a legal exposure.',
  },
  {
    id: 'case-study',
    label: 'Case Study',
    tag: 'Narrative + reflection',
    color: '#0D9488',
    bg: '#F0FDFA',
    border: '#99F6E4',
    description:
      'A narrative describing a real or realistic situation — usually in third person — followed by analysis or discussion questions. The learner reflects, not reacts.',
    bestFor: 'ILT/VILT, leadership development, ethics training, after-action review, post-incident analysis.',
    example: 'A 400-word narrative about a project manager who missed signs of scope creep, followed by five reflection questions for group debrief.',
  },
  {
    id: 'roleplay',
    label: 'Role-Play Simulation',
    tag: 'Live practice',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    description:
      'A scripted or semi-scripted interaction where the learner plays a role — often in pairs or with a trained actor or facilitator standing in as the other party.',
    bestFor: 'ILT/VILT interpersonal skills: coaching conversations, difficult feedback, customer de-escalation, sales calls.',
    example: 'Learner plays a team lead. Facilitator plays a direct report who is defensive about performance feedback. Learner must reach an agreed action plan.',
  },
]

const COMMON_MISTAKES = [
  {
    wrong: 'Making the wrong answer obviously wrong',
    right: 'All options must be defensible to a novice',
    wrongExample: '"You could: A) Follow the procedure, B) Ignore the problem entirely, C) Ask a colleague." Options B is absurd — it reveals the answer before the learner decides.',
    rightExample: 'Write distractors that reflect real mistakes practitioners actually make. If the correct option is the only one that sounds professional, you\'ve written a knowledge check, not a scenario.',
  },
  {
    wrong: 'Scenarios with no real stakes',
    right: 'Something must be on the line for the decision to matter',
    wrongExample: '"You could file the report now or file it tomorrow." Unless there\'s a consequence to that choice, learners won\'t engage.',
    rightExample: 'Stakes can be relational, financial, legal, reputational, or safety-based. Name them explicitly in the trigger. "The client presents their final sign-off by 5 PM" is a stake.',
  },
  {
    wrong: 'Forcing the learner to fail before teaching anything',
    right: 'Teach through consequences — on every branch',
    wrongExample: 'Some branching scenarios lock learners into a wrong path before revealing the correct approach. This frustrates without instructing.',
    rightExample: 'Regardless of what the learner picks, the consequence should teach something. Option A shows why the right approach works. Option B shows what breaks down and why. All paths are educational.',
  },
  {
    wrong: 'Scenarios disconnected from the actual job',
    right: 'Ground every scenario in the learner\'s real work context',
    wrongExample: 'Generic scenarios about "an employee" in "a company" facing "a situation" train no one for anything specific.',
    rightExample: 'Name the role, the setting, the tool, the system, the type of customer. Learners immediately recognize whether a scenario is authentic — and dismiss it just as quickly if it isn\'t.',
  },
]

const QUICK_REF_TEXT = `SCENARIO WRITING — QUICK REFERENCE
====================================

A GOOD SCENARIO requires:
  ✓  A realistic, specific trigger situation
  ✓  Genuine decision points where all options are plausible
  ✓  Consequences that show natural outcomes (not "Wrong! Try again.")
  ✓  Real stakes — something meaningful must be at risk

FOUR TYPES
----------
Mini scenario        One decision, 2-3 options. Best for compliance and policy application.
Branching scenario   Multi-decision, consequences accumulate. Best for complex judgment skills.
Case study           Narrative + reflection questions. Best for ILT/VILT and leadership topics.
Role-play sim        Live practice with a partner or facilitator. Best for interpersonal skills.

TRIGGER CHECKLIST
-----------------
□ Names a specific role and real job context (not "an employee")
□ Something real is at stake (safety, relationship, compliance, customer outcome)
□ Realistic situation — things that actually happen in this job
□ Creates a genuine decision — not just a knowledge recall test

DECISION POINT RULES
--------------------
□ All options defensible to a novice without the training
□ Distractors reflect mistakes practitioners actually make
□ Correct option requires knowledge or judgment, not obvious instinct
□ No absurd wrong answers, no trick questions

CONSEQUENCE RULES
-----------------
□ Show outcomes — don't announce them ("That was incorrect!")
□ Natural consequences: what would realistically happen
□ Educational on every branch — all paths teach something

COMMON MISTAKES TO AVOID
------------------------
✗  Obvious distractors → Write wrong options that reflect real practitioner mistakes
✗  No real stakes → Name what's at risk in the trigger
✗  Forced failure → All branches should be educational, not punitive
✗  Generic context → Name the role, setting, system, and situation specifically`

// ─── Scenario Starter Tool ────────────────────────────────────────────────────

function ScenarioStarterTool() {
  const [topic, setTopic] = useState('')
  const [role, setRole] = useState('')
  const [context, setContext] = useState('')
  const [output, setOutput] = useState('')

  const canGenerate = topic.trim() && role.trim() && context.trim()

  function generate() {
    const t = topic.trim()
    const r = role.trim()
    const c = context.trim()

    const text = `SCENARIO STARTER
================
Topic / skill:   ${t}
Audience role:   ${r}
Job context:     ${c}

─────────────────────────────────────────────────────────

TRIGGER SITUATION
-----------------
You are a ${r} at ${c}. [Describe the time of day, what you were doing,
and what interrupts or presents itself.]

The situation involves ${t}. [Add one detail that raises the stakes —
a deadline, a relationship at risk, a compliance concern, or a visible
consequence for getting it wrong.]

You need to make a decision.

DECISION POINT
--------------
What do you do?

○  Option A (Best practice):
   [Describe the specific action a skilled ${r} would take in this
   ${t} situation. This option should require knowledge or judgment,
   not just instinct or common sense.]

○  Option B (Common mistake):
   [Describe the action most ${r}s are tempted to take. It should
   seem reasonable on the surface but reflect a misunderstanding,
   shortcut, or gap in knowledge about ${t}.]

○  Option C (Plausible but incomplete):
   [Describe an action that partially addresses the situation but
   misses a key element of ${t}. This is the "close, but not quite"
   distractor.]

CONSEQUENCES
------------
→  If Option A:
   [Show what goes right. What was protected, achieved, or avoided?
   Keep it specific to ${c}.]

→  If Option B:
   [Show what goes wrong — naturally, without editorializing.
   What breaks down? Who is affected? What does the ${r} have to
   deal with now?]

→  If Option C:
   [Show what was missed. Why wasn't partial action enough?
   What happens next that the ${r} could have prevented?]

DEBRIEF PROMPT
--------------
"In situations like this, [state the key principle about ${t}].
The most effective response was Option A because [reason]. Option B
is common because [why it appeals to someone without this training],
but it leads to [consequence]. The goal isn't [misconception] —
it's [correct framing]."

─────────────────────────────────────────────────────────
Next steps:
  1. Replace all bracketed text with specifics
  2. Read all three options aloud — they should all sound defensible
  3. Have a SME review for accuracy before piloting`

    setOutput(text)
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200'

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: ACCENT_BORDER }}>
      {/* Tool header */}
      <div
        className="px-5 py-4 flex flex-wrap items-center gap-3"
        style={{ backgroundColor: ACCENT_LIGHT, borderBottom: `1px solid ${ACCENT_BORDER}` }}
      >
        <Wand2 size={16} style={{ color: ACCENT }} />
        <p className="text-sm font-bold" style={{ color: ACCENT }}>
          Scenario Starter Tool
        </p>
        <span className="text-xs text-gray-500">
          Fill in three fields — get a structured draft to work from.
        </span>
      </div>

      {/* Inputs */}
      <div className="px-5 py-5 space-y-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Topic / skill being trained
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Handling a hostile customer"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Audience role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., New customer service rep"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Job context / setting
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Retail banking branch"
              className={inputClass}
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!canGenerate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
          style={{
            backgroundColor: canGenerate ? ACCENT : '#D1D5DB',
            cursor: canGenerate ? 'pointer' : 'not-allowed',
          }}
        >
          <Wand2 size={14} />
          Generate Scenario Starter
        </button>
      </div>

      {/* Output */}
      {output && (
        <div className="border-t" style={{ borderColor: ACCENT_BORDER }}>
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: ACCENT_LIGHT }}
          >
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
              Your scenario starter
            </p>
            <CopyButton text={output} />
          </div>
          <div className="px-5 py-4 bg-white overflow-x-auto">
            <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap text-gray-700">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{label}</h2>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScenarioGuidePage() {
  return (
    <div>
      <SEOHead
        title="Scenario Writing Guide"
        description="How to write effective scenario-based learning — trigger situations, decision points, consequences, and common mistakes. Includes a Scenario Starter Tool."
        path="/scenario-guide"
      />

      {/* Header banner */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #9A3412 0%, #C2410C 30%, #EA580C 60%, #D97706 100%)',
        }}
      >
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Scenario Writing Guide
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>
            How to write scenarios that actually change behavior — not just test whether learners
            can recognize the obvious answer.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="mb-8 space-y-3 text-gray-700 text-sm leading-relaxed">
        <p>
          Scenario-based learning is the most recommended design approach for behavioral and
          judgment skills — but most early IDs have no clear model for writing one. The result
          is scenarios that look like scenarios but function like dressed-up multiple-choice
          questions: a thin story wrapper around an obvious right answer and two implausible
          distractors.
        </p>
        <p>
          A well-written scenario forces a genuine decision. The learner faces a realistic
          situation, considers options that all seem plausible, chooses one, and lives with
          the consequences. That process — decision under uncertainty, followed by feedback
          from the outcome — is what produces learning that transfers to the job.
        </p>
      </div>

      {/* Good vs. Bad callout */}
      <div className="mb-10 rounded-xl border overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {/* Bad */}
          <div className="px-5 py-5 bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={15} className="text-red-600 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                Scenario that doesn't work
              </p>
            </div>
            <p className="text-sm text-gray-700 mb-3 italic leading-relaxed">
              "You are an employee. A customer approaches you with a complaint. What do you do?"
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>A) Ignore the customer</p>
              <p>B) Follow the customer service policy</p>
              <p>C) Walk away and find a manager</p>
            </div>
            <p className="text-xs text-red-700 mt-3 font-medium">
              No stakes. No real decision. Option A is absurd. This is a knowledge check with a story label on it.
            </p>
          </div>

          {/* Good */}
          <div className="px-5 py-5 bg-emerald-50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Scenario that works
              </p>
            </div>
            <p className="text-sm text-gray-700 mb-3 italic leading-relaxed">
              "It's 11:45 AM — 15 minutes before your break. A visibly frustrated customer slaps down a receipt. 'I've been overcharged three times this month. I want a full refund and I want to speak to someone who actually knows what they're doing.' Four customers are in line behind them."
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>A) Issue the refund immediately — resolve it before the line grows</p>
              <p>B) Pull up the transaction history first, then address both the overcharge and the refund</p>
              <p>C) Call your manager — this customer has escalated beyond normal territory</p>
            </div>
            <p className="text-xs text-emerald-700 mt-3 font-medium">
              Real stakes, specific context, three defensible options. All require judgment, not just knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Four types */}
      <div className="mb-10">
        <SectionHeading label="The Four Types of Scenarios" />
        <p className="text-sm text-gray-600 mb-5">
          Choose the type based on the complexity of the skill and the delivery format — not on what's
          easiest to build.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCENARIO_TYPES.map((type) => (
            <div
              key={type.id}
              className="rounded-xl border p-4"
              style={{ backgroundColor: type.bg, borderColor: type.border }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold" style={{ color: type.color }}>
                  {type.label}
                </p>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${type.color}18`, color: type.color }}
                >
                  {type.tag}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">{type.description}</p>
              <p className="text-xs text-gray-500 mb-2">
                <strong>Best for:</strong> {type.bestFor}
              </p>
              <p className="text-xs italic text-gray-600 leading-relaxed">{type.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Writing the trigger */}
      <div className="mb-10">
        <SectionHeading label="Writing the Trigger Situation" />
        <p className="text-sm text-gray-700 leading-relaxed mb-5">
          The trigger is the opening of the scenario — the situation that creates the decision.
          A good trigger meets four criteria. If any one is missing, the scenario won't work.
        </p>

        <div className="space-y-2 mb-5">
          {[
            {
              label: 'Specific',
              body: 'Names a real role in a real setting using real tools and systems. Not "an employee at a company" — "a claims adjuster at a federal health insurance agency reviewing a prior authorization denial."',
            },
            {
              label: 'Realistic',
              body: 'Describes something that actually happens in that job. Not a manufactured crisis, not an exaggerated edge case. Learners instantly recognize whether a scenario is authentic.',
            },
            {
              label: 'Stakes-present',
              body: 'Something real is at risk — a relationship, a compliance requirement, a customer outcome, a safety hazard, a deadline. Without stakes, the decision is weightless and learners don\'t engage.',
            },
            {
              label: 'Decision-requiring',
              body: 'Creates a genuine fork in the road. The learner must choose, and the options must have meaningfully different consequences. If all paths lead to the same outcome, there\'s no scenario.',
            },
          ].map(({ label, body }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-lg border px-4 py-3"
              style={{ borderColor: `${ACCENT}30`, backgroundColor: ACCENT_LIGHT }}
            >
              <ArrowRight size={14} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
              <div>
                <span className="text-sm font-bold text-gray-900">{label}: </span>
                <span className="text-sm text-gray-700 leading-relaxed">{body}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border px-4 py-3 text-sm text-gray-600 leading-relaxed"
          style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Trigger test
          </p>
          Read your trigger aloud to someone unfamiliar with the content. If they say "that seems unrealistic" or "I'm not sure what the decision is," rewrite it. The trigger should be immediately clear to anyone in the target role.
        </div>
      </div>

      {/* Writing decision points */}
      <div className="mb-10">
        <SectionHeading label="Writing Decision Points" />
        <p className="text-sm text-gray-700 leading-relaxed mb-5">
          The decision point presents the choices. The cardinal rule: every option must be
          defensible to someone who hasn't had the training. If a novice can eliminate an option
          on instinct, you haven't written a scenario — you've written a trick question with extra steps.
        </p>

        <div className="space-y-3 mb-5">
          {[
            {
              rule: 'Distractors reflect real mistakes',
              body: 'Wrong options should be things practitioners actually do — not absurd choices. Ask your SME: "What do people who get this wrong usually do?" Write those as your distractors.',
            },
            {
              rule: 'The correct option requires knowledge',
              body: 'If someone with zero training would choose Option A on instinct, Option A isn\'t testing anything. The correct choice should require the specific knowledge or judgment the training is building.',
            },
            {
              rule: 'No one option looks more professional',
              body: 'Read all three options and ask: does one sound more formal, more cautious, or more thorough than the others? If so, the format is revealing the answer before the learner decides.',
            },
          ].map(({ rule, body }) => (
            <div
              key={rule}
              className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}
            >
              <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <span className="font-bold text-gray-900">{rule}: </span>
                <span className="text-gray-700 leading-relaxed">{body}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <div className="px-4 py-4 bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={13} className="text-red-600" />
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Weak options</p>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p>A) Tag the equipment and report it properly</p>
                <p>B) Ignore the hazard and keep working</p>
                <p>C) Report it to whoever is nearby</p>
              </div>
              <p className="text-xs text-red-700 mt-2">B is obviously wrong. A reveals the answer in its wording.</p>
            </div>
            <div className="px-4 py-4 bg-emerald-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Strong options</p>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p>A) Tag the equipment, notify maintenance, and document in the safety log</p>
                <p>B) Tag the equipment and tell your supervisor verbally at the end of the shift</p>
                <p>C) Continue carefully until your shift ends, then report it</p>
              </div>
              <p className="text-xs text-emerald-700 mt-2">All three are things real workers do. The difference requires knowing the documentation requirement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Writing consequences */}
      <div className="mb-10">
        <SectionHeading label="Writing Consequences" />
        <p className="text-sm text-gray-700 leading-relaxed mb-5">
          After the learner chooses, show what happens. The consequence is where the learning
          actually occurs — and it's where most scenario writing falls apart.
        </p>

        <div className="space-y-3 mb-5">
          {[
            {
              rule: 'Show, don\'t announce',
              body: 'Avoid "Correct! Good job!" and "Incorrect. Try again." Describe what happens next — naturally, as it would in real life. The learner infers whether they were right from the outcome.',
            },
            {
              rule: 'Natural outcomes, not punishment',
              body: 'The consequence should be what would realistically happen if someone made that choice in that job — not an artificial penalty invented to make the wrong answer feel bad.',
            },
            {
              rule: 'Every branch teaches something',
              body: 'Don\'t reserve learning for the correct path. A learner who chooses wrong should still get insight into why the choice doesn\'t work and what the correct approach would have produced.',
            },
          ].map(({ rule, body }) => (
            <div
              key={rule}
              className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}
            >
              <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <span className="font-bold text-gray-900">{rule}: </span>
                <span className="text-gray-700 leading-relaxed">{body}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <div className="px-4 py-4 bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={13} className="text-red-600" />
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Weak consequence</p>
              </div>
              <p className="text-sm text-gray-600 italic">
                "Incorrect. You should have reported the hazard immediately and documented it in the safety log. Please review the safety reporting procedure and try again."
              </p>
            </div>
            <div className="px-4 py-4 bg-emerald-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Strong consequence</p>
              </div>
              <p className="text-sm text-gray-600 italic">
                "You report the issue verbally at the end of your shift, but your supervisor gets pulled into an emergency meeting. The next morning, a different crew uses the same equipment. A failure results in a minor injury. Because there's no documentation, the incident investigation has no starting point."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Common mistakes */}
      <div className="mb-10">
        <SectionHeading label="Common Mistakes" />
        <div className="space-y-4">
          {COMMON_MISTAKES.map(({ wrong, right, wrongExample, rightExample }) => (
            <div key={wrong} className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border-b border-red-100">
                <XCircle size={15} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-red-900">{wrong}</p>
              </div>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 italic leading-relaxed">{wrongExample}</p>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-emerald-900">{right}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-gray-500 italic leading-relaxed">{rightExample}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Starter Tool */}
      <div className="mb-10">
        <SectionHeading label="Scenario Starter Tool" />
        <p className="text-sm text-gray-600 mb-5">
          Enter your topic, audience role, and job context. The tool generates a structured draft
          with placeholders — your starting point, not a finished product. Replace every bracketed
          section with specifics and have a SME review before use.
        </p>
        <ScenarioStarterTool />
      </div>

      {/* Quick reference */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Quick Reference</h2>
          </div>
          <CopyButton text={QUICK_REF_TEXT} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 overflow-x-auto">
          <pre className="text-xs text-gray-700 font-mono leading-relaxed whitespace-pre">
            {QUICK_REF_TEXT}
          </pre>
        </div>
      </div>
    </div>
  )
}
