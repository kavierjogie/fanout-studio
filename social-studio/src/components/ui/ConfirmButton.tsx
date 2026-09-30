import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'

// Two-step destructive action: the first click arms it, the second confirms. Disarms itself after a few seconds.
export default function ConfirmButton({
  label,
  confirmLabel = 'Confirm delete',
  onConfirm,
  className = ''
}: {
  label: string
  confirmLabel?: string
  onConfirm: () => void
  className?: string
}) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(t)
  }, [armed])

  if (armed) {
    return (
      <span className={`flex items-center gap-1.5 ${className}`}>
        <button
          autoFocus
          onClick={() => {
            setArmed(false)
            onConfirm()
          }}
          className="rounded-lg border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/25"
        >
          {confirmLabel}
        </button>
        <button
          onClick={() => setArmed(false)}
          className="rounded-lg px-2 py-1 text-xs font-medium text-mist-400 transition-colors hover:text-mist-100"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setArmed(true)}
      className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-mist-400 transition-colors hover:bg-red-500/10 hover:text-red-300 ${className}`}
    >
      <Trash2 size={13} />
      {label}
    </button>
  )
}
