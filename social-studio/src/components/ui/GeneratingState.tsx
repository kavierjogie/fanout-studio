import { useEffect, useRef } from 'react'

// Skeleton of the draft that is on its way; scrolls itself into view so the feedback is never below the fold
export default function GeneratingState({ title, description }: { title: string; description: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest' })
  }, [])

  return (
    <div ref={ref} role="status" className="card-surface mt-6 scroll-mb-6 animate-rise rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-signal-purple/30 border-t-signal-purple" />
        <div>
          <p className="font-display text-sm font-semibold text-mist-100">{title}</p>
          <p className="mt-0.5 text-xs text-mist-400">{description}</p>
        </div>
      </div>
      <div className="mt-5 space-y-2.5" aria-hidden="true">
        {['w-11/12', 'w-full', 'w-4/5', 'w-2/3'].map((w) => (
          <div key={w} className={`skeleton h-3 ${w}`} />
        ))}
      </div>
    </div>
  )
}
