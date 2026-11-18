import { PlatformMeta } from '../types'

export const PLATFORMS: PlatformMeta[] = [
  {
    id: 'blog',
    label: 'Blog article',
    shortLabel: 'Blog',
    color: '#C2C3C0',
    description: 'Long-form piece with a headline and structured sections.'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn post',
    shortLabel: 'LinkedIn',
    color: '#0A66C2',
    charLimit: 3000,
    description: 'Professional framing with a takeaway and a discussion prompt.'
  },
  {
    id: 'instagram',
    label: 'Instagram caption',
    shortLabel: 'Instagram',
    color: '#E1306C',
    charLimit: 2200,
    description: 'Warm, visual-first caption with a hook and hashtags.'
  },
  {
    id: 'tiktok',
    label: 'TikTok script',
    shortLabel: 'TikTok',
    color: '#25F4EE',
    description: 'Shot-by-shot script with on-screen text and a hook line.'
  },
  {
    id: 'x',
    label: 'X post',
    shortLabel: 'X',
    color: '#FFFFFF',
    charLimit: 280,
    description: 'Sharp, single-thought post built for replies and reposts.'
  },
  {
    id: 'promo',
    label: 'Promotional copy',
    shortLabel: 'Promo',
    color: '#10B981',
    description: 'Conversion-focused copy for an offer, launch, or CTA.'
  },
  {
    id: 'hashtags',
    label: 'Hashtag set',
    shortLabel: 'Hashtags',
    color: '#F59E0B',
    description: 'A ready-to-paste set of reach and niche hashtags.'
  },
  {
    id: 'calendar',
    label: 'Content calendar',
    shortLabel: 'Calendar',
    color: '#F97316',
    description: 'A structured weekly content plan with topics and formats.'
  },
  {
    id: 'code',
    label: 'Code snippet',
    shortLabel: 'Code',
    color: '#06B6D4',
    description: 'A clean, value-packed code snippet with a brief explanation.'
  }
]

export const platformMeta = (id: string) =>
  PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]
