import { ReactNode } from 'react'

type Accent = 'accent' | 'muted' | 'ochre' | 'neutral'

const accentClasses: Record<Accent, string> = {
  accent: 'bg-accent/15 text-accent-soft border-accent/30',
  muted: 'bg-mist-300/10 text-mist-100 border-mist-300/30',
  ochre: 'bg-ochre/15 text-ochre border-ochre/30',
  neutral: 'bg-white/5 text-mist-300 border-white/10'
}

export default function Badge({ children, accent = 'neutral' }: { children: ReactNode; accent?: Accent }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-mono tracking-wide ${accentClasses[accent]}`}>
      {children}
    </span>
  )
}
