export type Platform =
  | 'linkedin'
  | 'instagram'
  | 'tiktok'
  | 'x'
  | 'blog'
  | 'hashtags'
  | 'promo'
  | 'calendar'
  | 'code'

export type PromptCategory =
  | 'Social Media'
  | 'Marketing'
  | 'Business'
  | 'Content Creation'
  | 'Advertising'
  | 'Engagement'
  | 'Branding'

export interface PromptTemplate {
  id: string
  name: string
  description: string
  category: PromptCategory
  template: string
}

export interface GeneratedPiece {
  platform: Platform
  content: string
  imageUrl?: string
  imagePrompt?: string
  imageGenerating?: boolean
  imageError?: string
}

export interface ContentItem {
  id: string
  topic: string
  tone: string
  createdAt: number
  sourcePlatform: Platform
  pieces: GeneratedPiece[]
  scheduledFor?: string
}

export type View = 'dashboard' | 'create' | 'transform' | 'library' | 'recent' | 'calendar'

export interface PlatformMeta {
  id: Platform
  label: string
  shortLabel: string
  accent: 'purple' | 'pink' | 'orange'
  charLimit?: number
  description: string
}
