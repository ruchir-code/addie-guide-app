// ─── Central color constants — edit here, applies everywhere ───────────────

export const PHASE_COLORS = {
  analysis:  { color: '#DC2626', light: '#FEF2F2', border: '#DC2626' },
  design:    { color: '#EA580C', light: '#FFF7ED', border: '#EA580C' },
  develop:   { color: '#059669', light: '#ECFDF5', border: '#059669' },
  implement: { color: '#9333EA', light: '#F5F3FF', border: '#9333EA' },
  evaluate:  { color: '#2563EB', light: '#EFF6FF', border: '#2563EB' },
}

// Ordered list for pages that iterate over phases
export const PHASES = [
  {
    slug: 'analysis',
    label: 'Analysis',
    ...PHASE_COLORS.analysis,
    number: '01',
    tagline: 'Understand the problem before you design the solution.',
    keyActivity: 'Needs assessment, audience analysis, gap identification',
  },
  {
    slug: 'design',
    label: 'Design',
    ...PHASE_COLORS.design,
    number: '02',
    tagline: 'Blueprint the learning experience before building anything.',
    keyActivity: 'Learning objectives, instructional strategy, assessment design',
  },
  {
    slug: 'develop',
    label: 'Develop',
    ...PHASE_COLORS.develop,
    number: '03',
    tagline: 'Build the actual learning assets — according to the blueprint.',
    keyActivity: 'E-learning authoring, media production, SME reviews',
  },
  {
    slug: 'implement',
    label: 'Implement',
    ...PHASE_COLORS.implement,
    number: '04',
    tagline: 'Deploy training and support learners through the experience.',
    keyActivity: 'LMS setup, learner communication, facilitation, pilot',
  },
  {
    slug: 'evaluate',
    label: 'Evaluate',
    ...PHASE_COLORS.evaluate,
    number: '05',
    tagline: 'Measure whether training worked — and improve it.',
    keyActivity: 'Kirkpatrick levels, behavior change, ROI, iteration',
  },
]

// Theories / Foundations section (teal)
export const THEORIES_COLOR = {
  color:  '#0D9488',
  light:  '#F0FDFA',
  border: '#99F6E4',
  dark:   '#0F766E',
}

// UI accent (violet)
export const ACCENT = {
  primary:  '#7C3AED',
  light:    '#EDE9FE',
  border:   '#8B5CF6',
  hover:    '#6D28D9',
}

// Dark sidebar palette
export const SIDEBAR = {
  bg:           '#0F172A',
  activeBg:     '#1E293B',
  hoverBg:      '#1E293B',
  text:         '#94A3B8',
  activeText:   '#F8FAFC',
  sectionLabel: '#475569',
  border:       '#1E293B',
}
