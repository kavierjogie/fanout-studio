import { PromptCategory, PromptTemplate } from '../types'

export const PROMPTS: PromptTemplate[] = [
  {
    id: 'p1',
    name: 'Announce a launch',
    description: 'Introduce a new product, feature, or service with clear excitement.',
    category: 'Marketing',
    template: 'Announce the launch of {topic}. Lead with the problem it solves, then the reveal.'
  },
  {
    id: 'p2',
    name: 'Share a customer win',
    description: 'Turn a result or testimonial into shareable proof.',
    category: 'Marketing',
    template: 'Share a customer win related to {topic}. Use a specific, believable result.'
  },
  {
    id: 'p3',
    name: 'Behind the scenes',
    description: 'Show the process or people behind the work.',
    category: 'Content Creation',
    template: 'Give a behind-the-scenes look at {topic}. Focus on one honest, specific detail.'
  },
  {
    id: 'p4',
    name: 'Myth vs. reality',
    description: 'Correct a common misconception in your space.',
    category: 'Content Creation',
    template: 'Bust a common myth about {topic}. Present the myth, then the reality.'
  },
  {
    id: 'p5',
    name: 'Founder story',
    description: 'Connect a business decision to the reasoning behind it.',
    category: 'Business',
    template: 'Tell the story behind {topic} from the founder\'s point of view.'
  },
  {
    id: 'p6',
    name: 'Lessons learned',
    description: 'Turn a setback or milestone into a practical takeaway.',
    category: 'Business',
    template: 'Share a lesson learned from {topic}. Keep it specific and useful.'
  },
  {
    id: 'p7',
    name: 'Quick tip',
    description: 'One actionable tip your audience can use today.',
    category: 'Social Media',
    template: 'Share one quick, actionable tip about {topic}.'
  },
  {
    id: 'p8',
    name: 'This or that',
    description: 'A light, opinion-based post that invites replies.',
    category: 'Social Media',
    template: 'Frame {topic} as a this-or-that choice for the audience to weigh in on.'
  },
  {
    id: 'p9',
    name: 'Ask a question',
    description: 'Open a conversation instead of making a statement.',
    category: 'Engagement',
    template: 'Ask the audience an open question about {topic} that invites real answers.'
  },
  {
    id: 'p10',
    name: 'Poll-style post',
    description: 'A simple choice that\'s easy to respond to.',
    category: 'Engagement',
    template: 'Turn {topic} into a two-option poll the audience can vote on.'
  },
  {
    id: 'p11',
    name: 'Limited-time offer',
    description: 'Create urgency around a specific promotion.',
    category: 'Advertising',
    template: 'Write promotional copy for a limited-time offer on {topic}.'
  },
  {
    id: 'p12',
    name: 'Feature highlight',
    description: 'Spotlight one feature and the outcome it enables.',
    category: 'Advertising',
    template: 'Highlight one specific feature of {topic} and the outcome it enables.'
  },
  {
    id: 'p13',
    name: 'Brand values post',
    description: 'State what the brand stands for, in plain language.',
    category: 'Branding',
    template: 'Write a post that communicates the values behind {topic}.'
  },
  {
    id: 'p14',
    name: 'Visual identity note',
    description: 'Explain a design or brand choice and why it was made.',
    category: 'Branding',
    template: 'Explain the thinking behind a brand or design choice in {topic}.'
  }
]

export const CATEGORIES = Array.from(new Set(PROMPTS.map((p) => p.category)))

export const categoryAccent = (cat: PromptCategory) => {
  if (['Marketing', 'Business', 'Branding'].includes(cat)) return 'purple' as const
  if (['Social Media', 'Engagement'].includes(cat)) return 'pink' as const
  return 'orange' as const
}
