import { useState } from 'react'
import SEOHead from '../components/SEOHead'
import {
  Bot,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Search,
  Layers,
  Code2,
  PlayCircle,
  BarChart2,
  Sparkles,
} from 'lucide-react'
import CopyButton from '../components/ui/CopyButton'

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#6366F1'

const PHASES = [
  {
    id: 'analysis',
    label: 'Analysis',
    icon: Search,
    color: '#4F46E5',
    bg: '#EEF2FF',
    border: '#C7D2FE',
    text: '#312E81',
    useCases: [
      'Synthesize SME interview transcripts into key themes and performance gaps',
      'Draft learner persona descriptions from role and demographic data',
      'Generate needs analysis survey and interview questions',
      'Identify potential root causes from described performance symptoms',
      'Summarize long policy or technical documents into learner-relevant highlights',
    ],
    caution:
      'AI cannot observe learners, conduct live interviews, or access your LMS data. It works only with what you provide — the quality of your input determines the quality of its output.',
    promptExample: {
      label: 'Needs Analysis Question Generator',
      prompt: `You are an instructional designer conducting a needs analysis for a [ROLE] audience at a [ORGANIZATION TYPE]. The training topic is [TOPIC].

Generate 10 needs analysis interview questions that will help me understand:
1. Current performance gaps and their root causes
2. The job context and environment where learning must transfer
3. Learner motivations, prior knowledge, and potential barriers
4. Stakeholder expectations and success criteria

Format each question with a brief rationale explaining what it is designed to reveal.`,
    },
  },
  {
    id: 'design',
    label: 'Design',
    icon: Layers,
    color: '#0D9488',
    bg: '#F0FDFA',
    border: '#99F6E4',
    text: '#134E4A',
    useCases: [
      "Draft measurable learning objectives at a Bloom's level you specify",
      'Generate course outlines or module structures from a topic brief',
      "Map existing content topics to ADDIE phases or Bloom's taxonomy levels",
      'Suggest assessment types appropriate for specific learning objectives',
      'Create content chunking strategies from large topic lists',
    ],
    caution:
      "AI-generated objectives often default to lower Bloom's levels (Remember/Understand). Always review verbs and elevate them to match the actual performance requirement of the job.",
    promptExample: {
      label: 'Learning Objectives Generator',
      prompt: `You are an instructional designer. Write 5 learning objectives for a course on [TOPIC] for a [ROLE] audience.

Requirements:
- Target [BLOOM'S LEVEL] cognitive level (e.g., Apply — Level 3)
- Use the ABCD format: Audience, Behavior (action verb), Condition, Degree
- Make each objective observable and measurable
- Avoid vague verbs like "understand," "learn," or "know"

After writing the objectives, briefly explain the verb choice for each and why it matches the target Bloom's level.`,
    },
  },
  {
    id: 'develop',
    label: 'Develop',
    icon: Code2,
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    text: '#4C1D95',
    useCases: [
      'Draft e-learning scripts or facilitator guides from an outline',
      'Generate scenario-based learning cases with decision branches',
      'Write multiple-choice and scenario-based questions from content you provide',
      'Suggest visuals, analogies, or examples to explain abstract concepts',
      'Create knowledge check questions aligned to specific objectives',
    ],
    caution:
      'AI-generated content requires SME review before use. It can produce plausible-sounding but factually incorrect information — especially in technical, legal, medical, or regulatory content.',
    promptExample: {
      label: 'Scenario Builder',
      prompt: `You are an instructional designer creating a scenario-based learning activity for [ROLE] learners.

Topic: [TOPIC]
Objective: By the end of this scenario, learners will be able to [OBJECTIVE].
Setting: [WORKPLACE SETTING / CONTEXT]

Create a branching scenario with:
- A realistic workplace situation presenting a meaningful decision point
- 3 response options: one best practice, one common mistake, one plausible but suboptimal choice
- Consequences for each choice that show why it does or doesn't work
- A debrief that connects the decision back to the learning objective

Write in second person ("you") to immerse the learner.`,
    },
  },
  {
    id: 'implement',
    label: 'Implement',
    icon: PlayCircle,
    color: '#0369A1',
    bg: '#F0F9FF',
    border: '#BAE6FD',
    text: '#0C4A6E',
    useCases: [
      'Draft facilitator guides from an existing course outline',
      'Write learner communication emails for launch, reminders, and completions',
      'Generate learner FAQs from course content',
      'Create quick-reference job aids from process documentation',
      'Develop pilot testing plans and feedback collection instruments',
    ],
    caution:
      'Communications and job aids drafted by AI need review for organizational tone, voice, and accuracy before sending or publishing. Never send AI-drafted external communications without human review.',
    promptExample: {
      label: 'Job Aid Generator',
      prompt: `You are an instructional designer creating a job aid for [ROLE] learners.

Process: [BRIEF DESCRIPTION]
Use context: Learners will reference this [AT THEIR DESK / IN THE FIELD / DURING A CALL] when they need to [SPECIFIC TASK].

Create a concise job aid with:
- A clear, action-oriented title
- Step-by-step instructions using imperative verbs ("Click," "Enter," "Verify")
- Decision points noted where the process varies by condition
- Common errors to avoid in a sidebar or callout
- Format suitable for a single printed page or small screen

Keep language at a 7th–8th grade reading level.`,
    },
  },
  {
    id: 'evaluate',
    label: 'Evaluate',
    icon: BarChart2,
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    text: '#064E3B',
    useCases: [
      'Analyze open-ended survey responses for common themes and sentiment',
      'Draft Kirkpatrick Level 1–4 evaluation plans for a training program',
      'Generate evaluation survey questions for post-training assessments',
      'Write evaluation narrative summaries for stakeholder reports',
      'Suggest data collection methods appropriate for each evaluation level',
    ],
    caution:
      'AI can analyze text data you paste into it, but it cannot access your LMS reports, attendance records, or performance dashboards. You must bring the data — AI provides the analysis.',
    promptExample: {
      label: 'Evaluation Plan Builder',
      prompt: `You are an instructional designer creating a training evaluation plan using the Kirkpatrick Model.

Training program: [TITLE]
Audience: [ROLE]
Learning objectives: [LIST OBJECTIVES]
Business goal this training supports: [GOAL]

Create an evaluation plan covering all four Kirkpatrick levels:
- Level 1 (Reaction): What you will measure and how (survey, pulse check, etc.)
- Level 2 (Learning): How you will assess knowledge or skill acquisition
- Level 3 (Behavior): How you will measure on-the-job transfer at 30/60/90 days
- Level 4 (Results): How you will connect training outcomes to business results

For each level, specify: what you measure, how you measure it, and when.`,
    },
  },
]

const PROMPT_PATTERNS = [
  {
    id: 'role-context',
    label: 'Role + Context Frame',
    color: '#6366F1',
    bg: '#EEF2FF',
    description:
      'Always open by telling the AI who it is and what your context is. This single technique improves output quality more than any other prompt change.',
    template: `You are an experienced instructional designer with expertise in [DOMAIN].

I am building a [TYPE OF TRAINING] for [AUDIENCE DESCRIPTION] at a [ORGANIZATION TYPE].
The training topic is: [TOPIC]
The performance gap is: [WHAT LEARNERS CURRENTLY DO vs. WHAT THEY SHOULD DO]

[YOUR SPECIFIC REQUEST]`,
  },
  {
    id: 'sme-prep',
    label: 'SME Interview Prep',
    color: '#0D9488',
    bg: '#F0FDFA',
    description:
      'Generate targeted interview questions before meeting a subject matter expert. Paste the output into your interview guide.',
    template: `You are an instructional designer preparing to interview a subject matter expert on [TOPIC] for a training program targeting [AUDIENCE].

The SME is a [ROLE / TITLE] with [X] years of experience in [FIELD].
I have [TIME LIMIT] for the interview.

Generate 8–10 interview questions designed to:
1. Reveal the critical tasks and decisions learners must perform
2. Surface the most common mistakes or misconceptions
3. Describe what expert performance looks and sounds like
4. Uncover examples, stories, or analogies I can use in training

Prioritize questions that surface tacit knowledge — the things experts do automatically that novices don't know to do.`,
  },
  {
    id: 'mcq-generator',
    label: 'MCQ Generator',
    color: '#7C3AED',
    bg: '#F5F3FF',
    description:
      'Generate multiple-choice questions with plausible distractors aligned to a specific learning objective.',
    template: `Generate [NUMBER] multiple-choice questions to assess the following learning objective:

Objective: [PASTE OBJECTIVE]
Bloom's level: [LEVEL, e.g., Apply — Level 3]
Audience: [ROLE]
Content area: [TOPIC]

For each question:
- Write a scenario-based stem that presents a realistic situation (avoid "which of the following" where possible)
- Provide 4 answer options: 1 correct answer, 3 plausible distractors based on common mistakes or misconceptions
- Add an answer key note explaining why the correct answer is right and why each distractor is wrong

Avoid trick questions. Test application and judgment, not memorization.`,
  },
  {
    id: 'content-simplifier',
    label: 'Content Simplifier',
    color: '#0369A1',
    bg: '#F0F9FF',
    description:
      'Translate dense technical, legal, or policy content into learner-friendly language without losing accuracy.',
    template: `Rewrite the following content for a [ROLE] audience with [novice / intermediate / experienced] background in this topic.

Original content:
[PASTE CONTENT HERE]

Requirements:
- Target a 7th–8th grade reading level
- Use active voice and imperative verbs where appropriate
- Break complex processes into numbered steps
- Replace jargon with plain language (define any terms you must retain)
- Add one concrete example to illustrate the main point
- Flag any content that should be reviewed by a SME for accuracy before use`,
  },
  {
    id: 'storyboard-script',
    label: 'Storyboard Script',
    color: '#DC2626',
    bg: '#FFF1F2',
    description:
      'Generate e-learning module scripts formatted for storyboard layout, including on-screen text, narration, and visual notes.',
    template: `Write an e-learning storyboard script for Module [NUMBER]: [MODULE TITLE]

Learning objectives:
[LIST OBJECTIVES]

Audience: [ROLE] with [PRIOR KNOWLEDGE LEVEL] background
Tone: [Professional / Conversational / Instructional]
Target screen time: [X] minutes
Narration: [On-screen narrator / Voiceover only / Text only]

For each screen include:
- Screen number and title
- On-screen text (30–40 words maximum per screen)
- Narration script (if applicable)
- Visual or graphic description for the developer
- Interactivity notes (click to reveal, drag-and-drop, etc.)

Open with a hook screen that establishes relevance: why does this matter to this learner, today?`,
  },
  {
    id: 'feedback-analyzer',
    label: 'Feedback Analyzer',
    color: '#059669',
    bg: '#ECFDF5',
    description:
      'Identify themes and actionable insights from learner feedback, pilot test comments, or evaluation survey responses.',
    template: `I have [NUMBER] learner feedback responses from a [post-training survey / pilot test / end-of-course evaluation].

Training: [TITLE]
Audience: [ROLE]

Responses:
[PASTE FEEDBACK HERE]

Please:
1. Identify the 3–5 most common themes (positive and constructive)
2. Flag any items requiring immediate attention (accuracy errors, technical issues, strong negative reactions)
3. Summarize overall learner sentiment
4. Recommend 3 concrete improvements based on the feedback
5. Pull 2–3 representative quotes useful for a stakeholder report`,
  },
]

const ETHICAL_CONSIDERATIONS = [
  {
    id: 'accuracy',
    icon: AlertTriangle,
    color: '#DC2626',
    bg: '#FFF1F2',
    label: 'Accuracy and Hallucination',
    body: 'AI models generate plausible text, not verified facts. All AI-generated content — especially technical, legal, regulatory, clinical, or policy content — must be reviewed by a qualified SME before use. AI will produce incorrect information confidently and without warning.',
  },
  {
    id: 'privacy',
    icon: Shield,
    color: '#0369A1',
    bg: '#F0F9FF',
    label: 'Data Privacy',
    body: 'Do not include personally identifiable information (PII), proprietary business data, classified information, or confidential personnel records in AI prompts. Treat every prompt as if it could be logged or reviewed by a third party.',
  },
  {
    id: 'bias',
    icon: AlertTriangle,
    color: '#D97706',
    bg: '#FFFBEB',
    label: 'Bias in Generated Content',
    body: 'AI models reflect biases present in their training data. Review all generated scenarios, personas, and examples for cultural, gender, ability, and socioeconomic bias. DEI review of AI-generated content is not optional.',
  },
  {
    id: 'copyright',
    icon: AlertTriangle,
    color: '#7C3AED',
    bg: '#F5F3FF',
    label: 'Copyright and Attribution',
    body: "Do not use AI to reproduce or closely paraphrase copyrighted materials. Your substantial original edits to AI output may be copyrightable; raw AI output generally is not (per U.S. Copyright Office guidance, 2023). Consult legal counsel for contract or government work.",
  },
  {
    id: 'transparency',
    icon: CheckCircle2,
    color: '#059669',
    bg: '#ECFDF5',
    label: 'Transparency with Stakeholders',
    body: "Be transparent with your organization and clients about when and how you use AI. Many organizations are actively developing AI use policies. Know your organization's stance before using AI on client, federal, or regulated-industry projects.",
  },
  {
    id: 'tool-not-replacement',
    icon: Bot,
    color: '#6366F1',
    bg: '#EEF2FF',
    label: 'AI as Tool, Not Replacement',
    body: 'AI accelerates ID work — it does not replace instructional design expertise. Needs analysis, learning strategy, stakeholder management, and contextual judgment are distinctly human skills. AI produces raw material; you provide the craft, the judgment, and the accountability.',
  },
]

const QUICK_REF_TEXT = `AI IN INSTRUCTIONAL DESIGN — QUICK REFERENCE
==============================================

CORE PRINCIPLE
--------------
AI is a capable junior assistant. You provide the judgment, the context, and the accountability.
AI accelerates the work — it does not replace instructional design expertise.

AI BY ADDIE PHASE
-----------------
Analysis:   Synthesize transcripts | Generate survey/interview questions | Draft personas
Design:     Draft objectives (verify the verb level) | Generate outlines | Map to Bloom's
Develop:    Write scripts | Build scenarios | Generate MCQs | Suggest visuals/analogies
Implement:  Draft facilitator guides | Write communications | Create job aids
Evaluate:   Analyze feedback | Draft evaluation plans | Write stakeholder reports

PROMPT ESSENTIALS
-----------------
1. Role frame:    "You are an experienced instructional designer with expertise in [X]."
2. Context:       Audience, organization type, topic, performance gap
3. Constraints:   Bloom's level, format, word count, reading level
4. Review cue:    "Flag anything that should be verified by a SME before use."

ETHICAL GUARDRAILS
------------------
✓  SME review required for all factual or domain-specific content
✓  No PII, proprietary data, or classified information in prompts
✓  Review all output for cultural, gender, and ability bias
✓  Be transparent with stakeholders about AI use
✗  Do not use AI to skip or shortcut needs analysis
✗  Do not publish AI content without human review and SME sign-off`

// ─── Phase accordion card ─────────────────────────────────────────────────────

function PhaseCard({ phase }) {
  const [open, setOpen] = useState(false)
  const Icon = phase.icon

  return (
    <div
      className="border rounded-xl overflow-hidden bg-white transition-shadow duration-150"
      style={{
        borderColor: open ? phase.color : '#E5E7EB',
        boxShadow: open ? `0 4px 20px ${phase.color}22` : undefined,
      }}
    >
      <button
        className="w-full text-left focus:outline-none"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ backgroundColor: phase.color }}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className="text-white/80 shrink-0" />
            <span className="font-extrabold text-white text-base tracking-wide">
              {phase.label} Phase
            </span>
          </div>
          <div className="text-white/70">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        <div
          className="px-5 py-3 border-b text-sm"
          style={{
            backgroundColor: phase.bg,
            borderColor: `${phase.color}30`,
            color: phase.text,
          }}
        >
          {phase.useCases[0]} and {phase.useCases.length - 1} more...
        </div>
      </button>

      {open && (
        <div className="px-5 py-5 space-y-5">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              What AI can help with
            </p>
            <ul className="space-y-1.5">
              {phase.useCases.map((uc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2
                    size={14}
                    className="shrink-0 mt-0.5"
                    style={{ color: phase.color }}
                  />
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm"
            style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
          >
            <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
            <p className="text-amber-800 leading-relaxed">
              <strong>Caution: </strong>
              {phase.caution}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Starter Prompt — {phase.promptExample.label}
              </p>
              <CopyButton text={phase.promptExample.prompt} />
            </div>
            <div
              className="rounded-lg border px-4 py-3 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto"
              style={{
                backgroundColor: phase.bg,
                borderColor: `${phase.color}30`,
                color: phase.text,
              }}
            >
              {phase.promptExample.prompt}
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronUp size={13} />
            Collapse
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Prompt pattern card ──────────────────────────────────────────────────────

function PromptCard({ pattern }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="border rounded-xl overflow-hidden bg-white"
      style={{ borderColor: open ? pattern.color : '#E5E7EB' }}
    >
      <button
        className="w-full text-left px-5 py-4 flex items-center justify-between"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: pattern.color }}
          />
          <span className="font-semibold text-sm text-gray-900">{pattern.label}</span>
        </div>
        <div style={{ color: '#9CA3AF' }}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {open && (
        <div
          className="border-t px-5 py-4 space-y-3"
          style={{ borderColor: `${pattern.color}20`, backgroundColor: pattern.bg }}
        >
          <p className="text-sm text-gray-700 leading-relaxed">{pattern.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Template</p>
            <CopyButton text={pattern.template} />
          </div>
          <pre
            className="text-xs font-mono leading-relaxed whitespace-pre-wrap"
            style={{ color: pattern.color }}
          >
            {pattern.template}
          </pre>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AiInIDPage() {
  return (
    <div>
      <SEOHead
        title="AI in Instructional Design"
        description="How instructional designers use AI at each ADDIE phase — practical prompt patterns, use cases, and ethical guardrails for IDs working with AI tools."
        path="/ai-in-id"
      />

      {/* Header banner */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #6366F1 0%, #7C3AED 40%, #0D9488 70%, #0369A1 100%)',
        }}
      >
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#fff' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Bot size={20} className="text-white/80" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              AI in Instructional Design
            </h1>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>
            Practical guidance for using AI at each ADDIE phase — what it does well, where it
            fails, and how to prompt it effectively.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="mb-8 space-y-3 text-gray-700 text-sm leading-relaxed">
        <p>
          AI language models have become genuinely useful tools for instructional designers — not
          because they understand learning theory, but because they are fast, tireless drafters of
          text. They can help you move from a blank page to a working draft in minutes for almost
          any ID deliverable: objectives, scripts, scenarios, assessment items, job aids,
          facilitator guides, and evaluation plans.
        </p>
        <p>
          What AI cannot do is replace the judgment that makes instructional design valuable. It
          cannot conduct a needs analysis, build trust with a skeptical SME, read a room during
          facilitation, or determine whether a training intervention is even the right solution to a
          performance gap. It does not know your learners, your organization, or your context —
          unless you tell it. Your expertise frames the problem; AI helps you execute faster.
        </p>
        <p>
          This guide covers AI use at each ADDIE phase, six prompt patterns you can copy
          immediately, and the ethical guardrails every ID working with AI should follow.
        </p>
      </div>

      {/* Core principle callout */}
      <div
        className="rounded-xl border px-5 py-5 mb-8"
        style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={15} style={{ color: ACCENT }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
            Core Principle
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'AI is a drafting tool',
              body: 'Use it to accelerate the production of content, questions, and documents — not to replace analysis or strategy.',
            },
            {
              label: 'You provide the context',
              body: 'AI knows nothing about your learners, organization, or performance gap unless you include that information in your prompt.',
            },
            {
              label: 'SME review is non-negotiable',
              body: 'All AI-generated content that contains domain knowledge must be verified by a subject matter expert before use.',
            },
          ].map(({ label, body }) => (
            <div key={label} className="flex flex-col gap-1">
              <p className="text-sm font-bold text-indigo-900">{label}</p>
              <p className="text-sm text-indigo-800 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI at each ADDIE phase */}
      <div className="flex items-center gap-3 mb-3">
        <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          AI at Each ADDIE Phase
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Click a phase to see use cases and a copyable starter prompt.
      </p>
      <div className="space-y-3 mb-10">
        {PHASES.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>

      {/* Prompt patterns */}
      <div className="flex items-center gap-3 mb-3">
        <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Prompt Patterns</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Six ready-to-copy prompt templates for common ID tasks. Replace bracketed placeholders with
        your specifics.
      </p>
      <div className="space-y-2 mb-10">
        {PROMPT_PATTERNS.map((p) => (
          <PromptCard key={p.id} pattern={p} />
        ))}
      </div>

      {/* Ethical considerations */}
      <div className="flex items-center gap-3 mb-3">
        <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Ethical Considerations
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Responsible AI use in instructional design requires attention to accuracy, privacy, bias,
        and transparency. These are not optional.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {ETHICAL_CONSIDERATIONS.map(({ id, icon: Icon, color, bg, label, body }) => (
          <div
            key={id}
            className="rounded-xl border p-4"
            style={{ backgroundColor: bg, borderColor: `${color}30` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} className="shrink-0" style={{ color }} />
              <p className="text-sm font-bold" style={{ color }}>
                {label}
              </p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Quick reference */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Quick Reference
            </h2>
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
