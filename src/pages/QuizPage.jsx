import { useState } from 'react'
import {
  Brain,
  BarChart2,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import CopyButton from '../components/ui/CopyButton'

const ACCENT = '#7C3AED'
const ACCENT_LIGHT = '#F5F3FF'

// ── Quiz A — Which ADDIE Phase Needs Work? ────────────────────────────────────
const QUIZ_A = {
  id: 'phase',
  title: 'Which ADDIE Phase Needs Work?',
  subtitle: '10 scenario questions',
  description:
    "Read each scenario and pick the answer that best describes what you would actually do — not what you think the right answer is.",
  questions: [
    {
      id: 1,
      phase: 'analysis',
      situation:
        'A manager emails you: "We need a cybersecurity awareness course. Can you have it ready in two weeks?" Your first move is to:',
      options: [
        { id: 'a', text: 'Schedule a discovery meeting to understand the actual performance gap before committing to a solution', correct: true },
        { id: 'b', text: 'Start outlining course content — two weeks is tight and you need to move fast', correct: false },
        { id: 'c', text: 'Ask the manager how long the course should be and what format they prefer', correct: false },
        { id: 'd', text: 'Search for existing cybersecurity modules you can adapt quickly', correct: false },
      ],
    },
    {
      id: 2,
      phase: 'analysis',
      situation:
        "You've been asked to improve a course that's been live for a year. Your first step is to:",
      options: [
        { id: 'a', text: 'Review completion rates, quiz scores, and gather feedback from learners and their managers', correct: true },
        { id: 'b', text: 'Update the visuals and add more current examples', correct: false },
        { id: 'c', text: 'Redesign the course structure so it flows better', correct: false },
        { id: 'd', text: 'Replace text-heavy slides with video and interactions', correct: false },
      ],
    },
    {
      id: 3,
      phase: 'design',
      situation:
        'A stakeholder asks you to design a course on "leadership principles." Before selecting your media and format, you:',
      options: [
        { id: 'a', text: 'Write specific, measurable learning objectives tied to observable performance outcomes', correct: true },
        { id: 'b', text: "Choose e-learning — it's flexible and scalable", correct: false },
        { id: 'c', text: 'Review how similar leadership content has been designed elsewhere', correct: false },
        { id: 'd', text: 'Ask the stakeholder what format they prefer', correct: false },
      ],
    },
    {
      id: 4,
      phase: 'design',
      situation:
        'An SME hands you this objective: "Learners will understand the importance of data privacy." You:',
      options: [
        { id: 'a', text: 'Rewrite it to specify what learners will do to demonstrate understanding — using a measurable action verb', correct: true },
        { id: 'b', text: '"Understand" is the real goal and learners will know what that means — keep it', correct: false },
        { id: 'c', text: 'Add it to the objectives list and build content that covers data privacy comprehensively', correct: false },
        { id: 'd', text: 'Ask the SME to rewrite it in their own words', correct: false },
      ],
    },
    {
      id: 5,
      phase: 'develop',
      situation:
        "You're building a course and your SME sends back a review with 15 new slides of background information they want added. You:",
      options: [
        { id: 'a', text: 'Evaluate each addition against the learning objectives — include only what supports the performance goal', correct: true },
        { id: 'b', text: "Add the slides — the SME knows the content and more context helps learners", correct: false },
        { id: 'c', text: "Add a 'Further Reading' section at the end so the course isn't bloated", correct: false },
        { id: 'd', text: "Ask the SME to trim it down, but don't explain why", correct: false },
      ],
    },
    {
      id: 6,
      phase: 'develop',
      situation:
        "You're writing a knowledge check. Which option best tests whether learners can apply the content — not just recall it?",
      options: [
        { id: 'a', text: '"A sales rep is about to lose a deal because the client doubts ROI. What should she do first?" [4 realistic options]', correct: true },
        { id: 'b', text: '"True or False: ROI stands for Return on Investment."', correct: false },
        { id: 'c', text: '"Which of the following is NOT a benefit of the product?" [with 3 obvious wrong answers]', correct: false },
        { id: 'd', text: '"List three steps in the sales process."', correct: false },
      ],
    },
    {
      id: 7,
      phase: 'implement',
      situation:
        "Your e-learning course has passed QA and is ready to publish. Before you launch to all 800 learners, you:",
      options: [
        { id: 'a', text: 'Run a small pilot with 10–15 learners to catch issues before full rollout', correct: true },
        { id: 'b', text: 'Publish it — QA already confirmed the course works', correct: false },
        { id: 'c', text: 'Email all learners and schedule an all-hands announcement', correct: false },
        { id: 'd', text: 'Send it to the manager for final approval', correct: false },
      ],
    },
    {
      id: 8,
      phase: 'implement',
      situation:
        "You're handing off an ILT program to a facilitator who wasn't involved in development. You:",
      options: [
        { id: 'a', text: 'Create a facilitator guide with session timing, discussion questions, debrief notes, and common learner questions', correct: true },
        { id: 'b', text: "Send them the slide deck — it's self-explanatory", correct: false },
        { id: 'c', text: 'Brief them verbally the day before the session', correct: false },
        { id: 'd', text: 'Attend the first session yourself to handle questions', correct: false },
      ],
    },
    {
      id: 9,
      phase: 'evaluate',
      situation:
        'Your course has been live for 30 days. Completion is at 88% and learners gave it 4.4 out of 5 stars. You:',
      options: [
        { id: 'a', text: 'Start gathering performance data — did the training actually change behavior on the job?', correct: true },
        { id: 'b', text: 'Move on to the next project — those numbers look good', correct: false },
        { id: 'c', text: 'Email the manager to let them know results look strong', correct: false },
        { id: 'd', text: 'Wait for the quarterly LMS report before drawing conclusions', correct: false },
      ],
    },
    {
      id: 10,
      phase: 'evaluate',
      situation:
        'A stakeholder says "We ran training last quarter and quiz scores went up 22%. That\'s a win, right?" You respond:',
      options: [
        { id: 'a', text: '"Good start — now we need to find out whether that knowledge is showing up as behavior change on the job"', correct: true },
        { id: 'b', text: '"Absolutely — that\'s exactly what we were hoping for"', correct: false },
        { id: 'c', text: '"Let\'s wait until end of year to see if it holds"', correct: false },
        { id: 'd', text: '"We should replicate this training for other teams"', correct: false },
      ],
    },
  ],
}

// ── Quiz B — Beginner, Practitioner, or Senior ID? ────────────────────────────
const QUIZ_B = {
  id: 'level',
  title: 'Beginner, Practitioner, or Senior ID?',
  subtitle: '15 questions',
  description:
    "Select the best answer for each question. This covers theory, practice, and judgment calls. Answer honestly — there's no benefit to guessing.",
  questions: [
    {
      id: 1,
      text: 'ADDIE is best described as:',
      options: [
        { id: 'a', text: 'A rigid, step-by-step production process', correct: false },
        { id: 'b', text: 'A flexible framework for systematically designing learning experiences', correct: true },
        { id: 'c', text: 'A project management methodology for training teams', correct: false },
        { id: 'd', text: 'A checklist developed by the U.S. military for compliance training', correct: false },
      ],
    },
    {
      id: 2,
      text: 'A well-written learning objective should include:',
      options: [
        { id: 'a', text: 'A topic, a content outline, and an estimated time to complete', correct: false },
        { id: 'b', text: 'An observable action, conditions, and a measurable standard', correct: true },
        { id: 'c', text: "A description of what the instructor will cover", correct: false },
        { id: 'd', text: "The Bloom's level, the content type, and the audience", correct: false },
      ],
    },
    {
      id: 3,
      text: "Bloom's Taxonomy organizes:",
      options: [
        { id: 'a', text: 'Types of instructional media', correct: false },
        { id: 'b', text: 'Levels of cognitive complexity from lower-order to higher-order thinking', correct: true },
        { id: 'c', text: 'Learning styles across visual, auditory, and kinesthetic learners', correct: false },
        { id: 'd', text: 'The sequence of activities in a typical instructional design process', correct: false },
      ],
    },
    {
      id: 4,
      text: 'A job aid is most effective when:',
      options: [
        { id: 'a', text: 'Learners need to memorize a complex procedure permanently', correct: false },
        { id: 'b', text: 'The task is high-frequency and must be performed from memory', correct: false },
        { id: 'c', text: 'The task is complex or infrequent and performance support at point of need is possible', correct: true },
        { id: 'd', text: 'Learners are resistant to traditional training formats', correct: false },
      ],
    },
    {
      id: 5,
      text: 'Formative evaluation happens:',
      options: [
        { id: 'a', text: 'After the course launches, to measure business impact', correct: false },
        { id: 'b', text: 'Before training, to assess learner readiness', correct: false },
        { id: 'c', text: 'During development, to improve the course before it goes live', correct: true },
        { id: 'd', text: 'At the end of training, to measure learner satisfaction', correct: false },
      ],
    },
    {
      id: 6,
      text: 'The difference between a terminal learning objective (TLO) and an enabling learning objective (ELO) is:',
      options: [
        { id: 'a', text: 'TLOs are written by the SME; ELOs are written by the ID', correct: false },
        { id: 'b', text: 'TLOs describe the overall performance outcome; ELOs are the sub-skills that support it', correct: true },
        { id: 'c', text: 'TLOs apply to knowledge; ELOs apply to skills', correct: false },
        { id: 'd', text: 'TLOs are assessed; ELOs are not', correct: false },
      ],
    },
    {
      id: 7,
      text: "A learner passes a knowledge quiz with 95% but can't perform the task on the job. This is most likely:",
      options: [
        { id: 'a', text: 'Low motivation or resistance to change', correct: false },
        { id: 'b', text: "Transfer failure — the learning didn't translate to on-the-job performance", correct: true },
        { id: 'c', text: 'A learning style mismatch with the course format', correct: false },
        { id: 'd', text: 'Cognitive overload from too many examples during training', correct: false },
      ],
    },
    {
      id: 8,
      text: 'Kirkpatrick Level 3 evaluation measures:',
      options: [
        { id: 'a', text: 'Learner satisfaction with the training experience', correct: false },
        { id: 'b', text: 'Knowledge or skill gained during training', correct: false },
        { id: 'c', text: 'Behavior change applied on the job after training', correct: true },
        { id: 'd', text: 'Business results attributable to the training program', correct: false },
      ],
    },
    {
      id: 9,
      text: 'Scenario-based learning is most appropriate for:',
      options: [
        { id: 'a', text: 'Memorizing compliance rules or regulatory definitions', correct: false },
        { id: 'b', text: 'Teaching procedural tasks with a fixed, repeatable sequence', correct: false },
        { id: 'c', text: 'Developing judgment, decision-making, and interpersonal skills', correct: true },
        { id: 'd', text: 'Orientation and onboarding for new employees', correct: false },
      ],
    },
    {
      id: 10,
      text: "Gilbert's Behavior Engineering Model (BEM) argues that poor performance is most often caused by:",
      options: [
        { id: 'a', text: 'Insufficient motivation and effort from the individual', correct: false },
        { id: 'b', text: 'Environmental factors (tools, information, incentives) as much as individual knowledge and skill', correct: true },
        { id: 'c', text: "Training gaps that weren't addressed in onboarding", correct: false },
        { id: 'd', text: 'Misalignment between learner preferences and the training format', correct: false },
      ],
    },
    {
      id: 11,
      text: 'A stakeholder requests a 3-hour e-learning course on leadership. Your first response should be to:',
      options: [
        { id: 'a', text: 'Build the course — the stakeholder has identified the need', correct: false },
        { id: 'b', text: 'Recommend a shorter course based on modern attention span research', correct: false },
        { id: 'c', text: 'Conduct a needs analysis to determine the actual performance gap before proposing a solution', correct: true },
        { id: 'd', text: 'Identify subject matter experts who can provide the content', correct: false },
      ],
    },
    {
      id: 12,
      text: "You discover that your quiz questions don't align with the stated learning objectives. You should:",
      options: [
        { id: 'a', text: 'Use the quiz questions — the SME wrote them and they know the content', correct: false },
        { id: 'b', text: 'Revise the objectives to match the questions', correct: false },
        { id: 'c', text: 'Align the assessment to the objectives and communicate the reasoning to the SME', correct: true },
        { id: 'd', text: 'Include both sets of questions to be comprehensive', correct: false },
      ],
    },
    {
      id: 13,
      text: 'A client reports quiz scores improved from 68% to 91% after your course. The most important follow-up question is:',
      options: [
        { id: 'a', text: '"Which questions did learners miss most often?"', correct: false },
        { id: 'b', text: '"Did on-the-job performance or business outcomes change?"', correct: true },
        { id: 'c', text: '"How satisfied were learners with the course experience?"', correct: false },
        { id: 'd', text: '"How long did learners spend in the course?"', correct: false },
      ],
    },
    {
      id: 14,
      text: 'Rapid prototyping is a better choice than a full ADDIE approach when:',
      options: [
        { id: 'a', text: "The client has a tight budget and can't afford a full process", correct: false },
        { id: 'b', text: 'The content is highly technical and requires heavy SME involvement', correct: false },
        { id: 'c', text: 'Requirements are uncertain and iterating on a prototype is faster than comprehensive upfront analysis', correct: true },
        { id: 'd', text: 'The ID is working solo without a team', correct: false },
      ],
    },
    {
      id: 15,
      text: 'The core difference between performance consulting and instructional design is:',
      options: [
        { id: 'a', text: 'Performance consulting is reserved for senior IDs with more experience', correct: false },
        { id: 'b', text: 'Performance consulting determines whether a performance gap exists and whether training is the right solution; ID designs the training if it is', correct: true },
        { id: 'c', text: 'Performance consulting focuses on soft skills; ID focuses on technical content', correct: false },
        { id: 'd', text: 'They are the same discipline with different job titles', correct: false },
      ],
    },
  ],
}

// ── Phase metadata for Quiz A results ─────────────────────────────────────────
const PHASE_META = {
  analysis: {
    label: 'Analysis',
    color: '#0369A1',
    bg: '#EFF6FF',
    route: '/analysis',
    description: 'Diagnosing the real performance gap before jumping to a solution.',
  },
  design: {
    label: 'Design',
    color: '#7C3AED',
    bg: '#F5F3FF',
    route: '/design',
    description: 'Setting measurable objectives and choosing the right instructional approach.',
  },
  develop: {
    label: 'Develop',
    color: '#0D9488',
    bg: '#F0FDFA',
    route: '/develop',
    description: 'Building content that serves learning objectives, not SME preferences.',
  },
  implement: {
    label: 'Implement',
    color: '#D97706',
    bg: '#FFFBEB',
    route: '/implement',
    description: 'Piloting, supporting facilitators, and launching with a rollout plan.',
  },
  evaluate: {
    label: 'Evaluate',
    color: '#DC2626',
    bg: '#FEF2F2',
    route: '/evaluate',
    description: 'Measuring behavior change and business impact — not just completion and smiles.',
  },
}

// ── Level results for Quiz B ───────────────────────────────────────────────────
const LEVEL_RESULTS = {
  beginner: {
    label: 'Beginner',
    color: '#0369A1',
    bg: '#EFF6FF',
    description:
      "You're building your foundation. Focus on understanding the ADDIE framework and core ID principles before diving into advanced techniques. Every expert started here.",
    readingList: [
      { label: 'ADDIE Phase Pages', route: '/analysis', note: 'Start with Analysis — the most commonly skipped phase' },
      { label: "Bloom's Taxonomy", route: '/bloom', note: 'Essential for writing objectives and choosing the right assessment type' },
      { label: 'Objectives Builder', route: '/objectives', note: 'Practice writing CLOs, TLOs, and ELOs with the interactive tool' },
      { label: 'Glossary', route: '/glossary', note: 'Build your ID vocabulary — 150+ terms, phase-tagged' },
      { label: 'Learning Theories', route: '/theories', note: 'Understand the research behind why design decisions work' },
    ],
  },
  practitioner: {
    label: 'Practitioner',
    color: '#7C3AED',
    bg: '#F5F3FF',
    description:
      "You have solid foundational knowledge. Now focus on depth — evaluation, scenario design, and applying theory to messy real-world projects. This is where most IDs plateau.",
    readingList: [
      { label: 'Evaluation Frameworks', route: '/evaluation-frameworks', note: 'Move beyond Level 1 — learn to measure what actually matters' },
      { label: 'Scenario Writing Guide', route: '/scenario-guide', note: 'Elevate your development work with scenario-based learning' },
      { label: 'Performance Consulting', route: '/performance-consulting', note: 'Learn to push back on training requests that won\'t solve the real problem' },
      { label: 'Media & Format Guide', route: '/media-guide', note: 'Make deliberate format decisions instead of defaulting to e-learning' },
      { label: 'Instructional Models', route: '/models', note: 'Know when to use ADDIE, SAM, Agile ID, and others' },
    ],
  },
  senior: {
    label: 'Senior ID',
    color: '#059669',
    bg: '#ECFDF5',
    description:
      "You're operating at an advanced level. Deepen your expertise in transfer, strategic consulting, and helping the IDs around you grow. Your value is your judgment, not your tools.",
    readingList: [
      { label: 'Transfer of Learning', route: '/transfer', note: 'Understand why most training doesn\'t transfer — and design against it' },
      { label: 'Performance Consulting', route: '/performance-consulting', note: 'Sharpen your skills as a strategic advisor, not just a course builder' },
      { label: 'AI in Instructional Design', route: '/ai-in-id', note: 'Use AI deliberately to scale your output without sacrificing quality' },
      { label: 'Evaluation Frameworks', route: '/evaluation-frameworks', note: 'Build the business case for L&D with ROI and outcome data' },
      { label: 'Instructional Models', route: '/models', note: 'Know when each model fits — and when to break the rules' },
    ],
  },
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function QuizSelector({ onSelect }) {
  const cards = [
    {
      id: 'phase',
      icon: BarChart2,
      title: 'Which ADDIE Phase Needs Work?',
      meta: '10 scenario questions',
      description: 'Identify which phase you tend to rush through or skip — and get targeted links to fix it.',
      color: '#4338CA',
      bg: '#EEF2FF',
      border: '#C7D2FE',
    },
    {
      id: 'level',
      icon: GraduationCap,
      title: 'Beginner, Practitioner, or Senior ID?',
      meta: '15 questions',
      description: 'Get an honest read on where you stand and a personalized reading list for what to tackle next.',
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
    },
  ]

  return (
    <div>
      <p className="text-gray-600 mb-8 text-sm leading-relaxed">
        Choose a quiz below. All results are calculated on your device — nothing is stored or tracked.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map(({ id, icon: Icon, title, meta, description, color, bg, border }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="text-left rounded-2xl border-2 p-6 hover:shadow-md transition-all duration-150 group"
            style={{ borderColor: border, backgroundColor: bg }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: color + '20' }}>
                <Icon size={22} style={{ color }} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
                {meta}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            <div
              className="mt-5 flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
              style={{ color }}
            >
              Start quiz <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function QuizRunner({ quiz, onComplete, onBack }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  const question = quiz.questions[currentQ]
  const total = quiz.questions.length
  const progress = (currentQ / total) * 100

  function handleSelect(optionId) {
    setSelected(optionId)
  }

  function handleNext() {
    const newAnswers = { ...answers, [question.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (currentQ + 1 === total) {
      onComplete(newAnswers)
    } else {
      setCurrentQ(currentQ + 1)
    }
  }

  function handlePrev() {
    if (currentQ === 0) {
      onBack()
      return
    }
    const prevQ = quiz.questions[currentQ - 1]
    setCurrentQ(currentQ - 1)
    setSelected(answers[prevQ.id] || null)
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-gray-500">Question {currentQ + 1} of {total}</span>
        <span className="font-semibold" style={{ color: ACCENT }}>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: ACCENT }}
        />
      </div>

      {/* Phase badge (Quiz A only) */}
      {question.phase && (
        <div
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-4"
          style={{
            backgroundColor: PHASE_META[question.phase].bg,
            color: PHASE_META[question.phase].color,
          }}
        >
          {PHASE_META[question.phase].label} Phase
        </div>
      )}

      {/* Question */}
      <p className="text-base font-semibold text-gray-900 mb-5 leading-relaxed">
        {question.situation || question.text}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-8">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-sm leading-relaxed"
              style={{
                borderColor: isSelected ? ACCENT : '#E2E8F0',
                backgroundColor: isSelected ? ACCENT_LIGHT : 'white',
                color: isSelected ? '#1E293B' : '#475569',
              }}
            >
              <span
                className="font-bold mr-2"
                style={{ color: isSelected ? ACCENT : '#94A3B8' }}
              >
                {opt.id.toUpperCase()}.
              </span>
              {opt.text}
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft size={16} />
          {currentQ === 0 ? 'Back to quizzes' : 'Previous'}
        </button>
        <button
          onClick={handleNext}
          disabled={!selected}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          {currentQ + 1 === total ? 'See results' : 'Next'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

function PhaseResults({ answers, onRetry }) {
  // Count wrong answers per phase
  const scores = { analysis: 0, design: 0, develop: 0, implement: 0, evaluate: 0 }
  QUIZ_A.questions.forEach((q) => {
    const correctId = q.options.find((o) => o.correct).id
    if (answers[q.id] !== correctId) {
      scores[q.phase]++
    }
  })

  const maxScore = Math.max(...Object.values(scores))
  const topPhases = Object.entries(scores)
    .filter(([, v]) => v === maxScore && v > 0)
    .map(([phase]) => phase)

  const shareText =
    topPhases.length > 0
      ? `I took the ADDIE Phase quiz on addieguide.com — my ${topPhases.map((p) => PHASE_META[p].label).join(' and ')} phase${topPhases.length > 1 ? 's need' : ' needs'} the most work. Take the quiz yourself at addieguide.com/quiz`
      : 'I took the ADDIE Phase quiz on addieguide.com and scored well across all phases. Take it yourself at addieguide.com/quiz'

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">Your Results</h3>
      <p className="text-sm text-gray-500 mb-6">Based on your answers to 10 scenario questions</p>

      {topPhases.length === 0 ? (
        <div
          className="rounded-xl p-5 mb-6 border-2"
          style={{ backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' }}
        >
          <p className="font-bold text-emerald-800 text-lg mb-1">Strong across all phases</p>
          <p className="text-emerald-700 text-sm">
            No single phase stood out as a weak spot. Keep auditing your own practice — the best IDs
            are the ones who catch their own blind spots early.
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 text-sm mb-5">
            {topPhases.length === 1
              ? `Your answers point to the ${PHASE_META[topPhases[0]].label} phase as the area to focus on.`
              : `Your answers suggest multiple phases need attention.`}
          </p>
          <div className="flex flex-col gap-4 mb-6">
            {topPhases.map((phase) => (
              <div
                key={phase}
                className="rounded-xl p-5 border-2"
                style={{
                  borderColor: PHASE_META[phase].color + '50',
                  backgroundColor: PHASE_META[phase].bg,
                }}
              >
                <h4 className="font-bold text-base mb-1" style={{ color: PHASE_META[phase].color }}>
                  {PHASE_META[phase].label} Phase
                </h4>
                <p className="text-sm text-gray-700 mb-3">{PHASE_META[phase].description}</p>
                <Link
                  to={PHASE_META[phase].route}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: PHASE_META[phase].color }}
                >
                  Go to {PHASE_META[phase].label} page <ExternalLink size={13} />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Phase breakdown bar chart */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">All phases</p>
        <div className="flex flex-col gap-2.5">
          {Object.entries(scores).map(([phase, score]) => (
            <div key={phase} className="flex items-center gap-3">
              <span
                className="text-sm font-medium w-24 shrink-0"
                style={{ color: PHASE_META[phase].color }}
              >
                {PHASE_META[phase].label}
              </span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(score / 2) * 100}%`,
                    backgroundColor: PHASE_META[phase].color,
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 w-20 text-right shrink-0">
                {score === 0 ? 'On track' : score === 1 ? 'Watch this' : 'Focus here'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Share + retry */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
        <CopyButton text={shareText} />
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <RotateCcw size={14} /> Try the other quiz
        </button>
      </div>
    </div>
  )
}

function LevelResults({ answers, onRetry }) {
  const correctCount = QUIZ_B.questions.filter((q) => {
    const correctId = q.options.find((o) => o.correct).id
    return answers[q.id] === correctId
  }).length

  const level = correctCount <= 5 ? 'beginner' : correctCount <= 10 ? 'practitioner' : 'senior'
  const result = LEVEL_RESULTS[level]

  const shareText = `I scored ${correctCount}/15 on the ADDIE Guide ID knowledge quiz — that puts me at ${result.label} level. Take it yourself at addieguide.com/quiz`

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">Your Results</h3>
      <p className="text-sm text-gray-500 mb-6">Based on your answers to 15 knowledge and judgment questions</p>

      {/* Level badge */}
      <div
        className="rounded-2xl p-6 mb-6 border-2"
        style={{ borderColor: result.color + '40', backgroundColor: result.bg }}
      >
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-black" style={{ color: result.color }}>
            {result.label}
          </span>
          <span className="text-2xl font-bold text-gray-400">
            {correctCount}
            <span className="text-base font-normal text-gray-400">/15</span>
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{result.description}</p>
      </div>

      {/* Reading list */}
      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Your recommended reading list:</h4>
      <div className="flex flex-col gap-2.5 mb-8">
        {result.readingList.map((item, i) => (
          <Link
            key={i}
            to={item.route}
            className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all group"
          >
            <span
              className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white mt-0.5"
              style={{ backgroundColor: result.color }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors text-sm">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.note}</p>
            </div>
            <ExternalLink
              size={14}
              className="ml-auto mt-0.5 text-gray-300 group-hover:text-violet-400 transition-colors shrink-0"
            />
          </Link>
        ))}
      </div>

      {/* Share + retry */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
        <CopyButton text={shareText} />
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <RotateCcw size={14} /> Try the other quiz
        </button>
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const [activeQuiz, setActiveQuiz] = useState(null) // null | 'phase' | 'level'
  const [results, setResults] = useState(null)       // null | { quizId, answers }

  function handleSelectQuiz(id) {
    setActiveQuiz(id)
    setResults(null)
  }

  function handleComplete(answers) {
    setResults({ quizId: activeQuiz, answers })
  }

  function handleRetry() {
    setActiveQuiz(null)
    setResults(null)
  }

  const quiz = activeQuiz === 'phase' ? QUIZ_A : QUIZ_B

  return (
    <>
      <SEOHead
        title="Self-Assessment Quiz | ADDIE Guide"
        description="Test your instructional design knowledge. Find out which ADDIE phase needs work or whether you're a Beginner, Practitioner, or Senior ID — with a personalized reading list."
      />

      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #4338CA 0%, #7C3AED 40%, #9333EA 70%, #C026D3 100%)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-white/20">
            <Brain size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black leading-tight">ID Knowledge Quiz</h1>
        </div>
        <p className="text-white/80 text-lg max-w-xl">
          Two quizzes to benchmark your skills and point you toward the right resources.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {/* Selector */}
        {!activeQuiz && !results && (
          <QuizSelector onSelect={handleSelectQuiz} />
        )}

        {/* Quiz in progress */}
        {activeQuiz && !results && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">{quiz.title}</h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{quiz.description}</p>
            </div>
            <QuizRunner
              quiz={quiz}
              onComplete={handleComplete}
              onBack={handleRetry}
            />
          </div>
        )}

        {/* Quiz A results */}
        {results?.quizId === 'phase' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <PhaseResults answers={results.answers} onRetry={handleRetry} />
          </div>
        )}

        {/* Quiz B results */}
        {results?.quizId === 'level' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <LevelResults answers={results.answers} onRetry={handleRetry} />
          </div>
        )}
      </div>
    </>
  )
}
