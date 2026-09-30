import { useEffect, useRef } from 'react'
import { AlertCircle, X } from 'lucide-react'

export default function ErrorAlert({ title, message, onDismiss }: { title: string; message: string; onDismiss: () => void }) {
  // Errors appear below the form, so bring them into view
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest' })
  }, [])

  return (
    <div ref={ref} role="alert" className="mt-6 scroll-mb-6 flex items-start justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 animate-rise">
      <div className="flex gap-2.5">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-300" />
        <div>
          <p className="text-sm font-semibold text-red-300">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-mist-300">{message}</p>
        </div>
      </div>
      <button onClick={onDismiss} className="-m-1.5 rounded-lg p-1.5 text-mist-400 hover:bg-white/5 hover:text-mist-100" aria-label="Dismiss error">
        <X size={16} />
      </button>
    </div>
  )
}
