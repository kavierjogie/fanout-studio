import { ContentItem } from '../types'

const KEY = 'studio.content.v1'

const HOUR = 3600000
const DAY = 24 * HOUR

// Local YYYY-MM-DD, the format the calendar stores in `scheduledFor`
const dayFromNow = (days: number) => {
  const d = new Date(Date.now() + days * DAY)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Sample content shown on first load so the dashboard, library and calendar aren't empty
const SEED_DATA: ContentItem[] = [
  {
    id: 'seed-1',
    topic: 'Why we moved our team to a 4-day work week',
    tone: 'default',
    createdAt: Date.now() - 2 * HOUR,
    sourcePlatform: 'linkedin',
    scheduledFor: dayFromNow(2),
    pieces: [
      {
        platform: 'linkedin',
        content: 'Six months ago we closed the office on Fridays. Not as a perk, as an experiment.\n\nHere is what happened:\n\n→ Output per person stayed flat in month one, then rose 11% by month three.\n→ Meetings dropped by a third because nobody wanted to spend a shorter week in them.\n→ Two people who were quietly interviewing elsewhere told us they stopped.\n\nWhat surprised me most: the hard part was not the lost day. It was learning to say "that can wait until Monday" and mean it.\n\nWe are keeping it. If you are considering the same move, start by cutting meetings, not hours. The hours follow.\n\nWhat would your team do with one extra day a week?'
      },
      {
        platform: 'x',
        content: 'We moved to a 4-day week six months ago.\n\nOutput is up 11%. Meetings are down a third. Nobody wants to go back.\n\nThe trick was not working faster. It was deleting the work that did not matter.'
      },
      {
        platform: 'instagram',
        content: 'Fridays look a little different around here now. 🌿\n\nSix months into our 4-day work week, the team is more rested, more focused, and honestly a lot more fun to be around on Monday mornings.\n\nWe did not squeeze five days into four. We cut the meetings that should have been messages, and protected the deep work that actually moves things forward.\n\nWould a 4-day week work for your team? Tell us below. 👇\n\n#FourDayWeek #FutureOfWork #TeamCulture #WorkLifeBalance #SmallBusiness'
      }
    ]
  },
  {
    id: 'seed-2',
    topic: 'Launching dark mode for our mobile app',
    tone: 'bold',
    createdAt: Date.now() - 26 * HOUR,
    sourcePlatform: 'x',
    scheduledFor: dayFromNow(5),
    pieces: [
      {
        platform: 'x',
        content: 'Dark mode is live. 🌙\n\nYou asked 1,400 times. We counted.\n\nUpdate the app, flip the switch in Settings, and give your eyes the night off.'
      },
      {
        platform: 'promo',
        content: 'Your most requested feature is here.\n\nDark mode is now available on iOS and Android. Every screen has been redrawn for low light, with softer contrast, deeper blacks and battery savings of up to 20% on OLED displays.\n\nUpdate to version 4.2 today and switch it on under Settings → Appearance.\n\nYour eyes will thank you.'
      },
      {
        platform: 'hashtags',
        content: '#DarkMode #AppUpdate #ProductLaunch #MobileApp #UXDesign #UIDesign #NewFeature #iOS #Android #BuildInPublic'
      }
    ]
  },
  {
    id: 'seed-3',
    topic: 'Three lessons from our first 100 customers',
    tone: 'default',
    createdAt: Date.now() - 3 * DAY,
    sourcePlatform: 'blog',
    pieces: [
      {
        platform: 'blog',
        content: 'Three lessons from our first 100 customers\n\nReaching 100 paying customers took us fourteen months. Looking back, three lessons shaped almost every decision that worked.\n\n1. The first ten came from conversations, not campaigns\nWe spent weeks polishing a landing page nobody visited. Our first ten customers all came from direct messages to people who had complained about the problem in public. Find where your customers already talk, and join in.\n\n2. Churn told us more than signups\nEvery cancellation got a personal email asking one question: what were you hoping this would do? The answers rewrote our onboarding and cut churn in half.\n\n3. Pricing was a product decision\nWe doubled our price at customer 40 and conversion did not move. Support requests dropped, because the customers who stayed were the ones we could serve well.\n\nNone of this is new advice. It only became real once we had the numbers in front of us.'
      },
      {
        platform: 'linkedin',
        content: 'It took us 14 months to reach 100 paying customers.\n\nThree things I would tell myself at customer zero:\n\n1. Your first ten customers come from conversations, not campaigns.\n2. Read every cancellation. Churn is the most honest feedback you will get.\n3. Raise your price sooner. We doubled ours at customer 40 and conversion did not change.\n\nWhich of these did you learn the hard way?'
      },
      {
        platform: 'tiktok',
        content: 'HOOK (0-3s)\nOn-screen text: "100 customers. 3 lessons."\n"It took us fourteen months to get 100 customers. Here is what I wish I had known."\n\nSHOT 1 (3-10s)\nTalking to camera at desk.\n"One. Your first ten customers come from DMs, not ads."\n\nSHOT 2 (10-18s)\nScreen recording of an inbox.\n"Two. Email everyone who cancels. It cut our churn in half."\n\nSHOT 3 (18-25s)\nPricing page zoom.\n"Three. Raise your prices. We doubled ours and nothing broke."\n\nCTA (25-30s)\n"Follow for the next 100."'
      }
    ]
  },
  {
    id: 'seed-4',
    topic: 'Behind the scenes of our spring product shoot',
    tone: 'playful',
    createdAt: Date.now() - 5 * DAY,
    sourcePlatform: 'instagram',
    pieces: [
      {
        platform: 'instagram',
        content: 'What you see: one perfect product shot. ✨\nWhat you do not see: 214 outtakes, three coffee runs and a very patient studio dog. 🐶\n\nSwipe for the moments that did not make the final cut from our spring shoot.\n\nWhich one is your favourite? 👇\n\n#BehindTheScenes #ProductPhotography #SmallBusinessLife #StudioDay #SpringCollection'
      },
      {
        platform: 'x',
        content: 'Spring shoot stats:\n\n214 photos taken\n6 photos used\n3 coffee runs\n1 studio dog who stole the show\n\nBehind the scenes thread below 👇'
      }
    ]
  }
]

export function loadContent(): ContentItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      // Seed with sample data on first load
      localStorage.setItem(KEY, JSON.stringify(SEED_DATA))
      return SEED_DATA
    }
    return JSON.parse(raw) as ContentItem[]
  } catch {
    return []
  }
}

export function saveContent(items: ContentItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // storage unavailable — fail silently, app still works in-memory
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}
