import { PlatformMeta } from '../types'

export const PLATFORMS: PlatformMeta[] = [
  {
    id: 'blog',
    label: 'Blog article',
    shortLabel: 'Blog',
    accent: 'purple',
    description: 'Long-form piece with a headline and structured sections.'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn post',
    shortLabel: 'LinkedIn',
    accent: 'purple',
    charLimit: 3000,
    description: 'Professional framing with a takeaway and a discussion prompt.'
  },
  {
    id: 'instagram',
    label: 'Instagram caption',
    shortLabel: 'Instagram',
    accent: 'pink',
    charLimit: 2200,
    description: 'Warm, visual-first caption with a hook and hashtags.'
  },
  {
    id: 'tiktok',
    label: 'TikTok script',
    shortLabel: 'TikTok',
    accent: 'pink',
    description: 'Shot-by-shot script with on-screen text and a hook line.'
  },
  {
    id: 'x',
    label: 'X post',
    shortLabel: 'X',
    accent: 'pink',
    charLimit: 280,
    description: 'Sharp, single-thought post built for replies and reposts.'
  },
  {
    id: 'promo',
    label: 'Promotional copy',
    shortLabel: 'Promo',
    accent: 'orange',
    description: 'Conversion-focused copy for an offer, launch, or CTA.'
  },
  {
    id: 'hashtags',
    label: 'Hashtag set',
    shortLabel: 'Hashtags',
    accent: 'orange',
    description: 'A ready-to-paste set of reach and niche hashtags.'
  },
  {
    id: 'calendar',
    label: 'Content calendar',
    shortLabel: 'Calendar',
    accent: 'orange',
    description: 'A structured weekly content plan with topics and formats.'
  },
  {
    id: 'code',
    label: 'Code snippet',
    shortLabel: 'Code',
    accent: 'purple',
    description: 'A clean, value-packed code snippet with a brief explanation.'
  }
]

export const platformMeta = (id: string) =>
  PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]
