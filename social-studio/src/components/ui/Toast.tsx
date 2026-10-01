import { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type ToastAction = { label: string; onClick: () => void }
type ToastItem = { id: number; message: string; action?: ToastAction }

let push: (message: string, action?: ToastAction) => void = () => {}

// Fire-and-forget feedback; <Toaster /> is mounted once in App. Pass an action (e.g. Undo) to make it actionable.
export const toast = (message: string, action?: ToastAction) => push(message, action)

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    push = (message, action) => {
      setItems((cur) => [...cur.slice(-2), { id: Date.now() + Math.random(), message, action }])
    }
    return () => {
      push = () => {}
    }
  }, [])

  const remove = (id: number) => setItems((cur) => cur.filter((t) => t.id !== id))

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4">
      {items.map((t) => (
        <Toast key={t.id} item={t} onDone={() => remove(t.id)} />
      ))}
    </div>
  )
}

function Toast({ item, onDone }: { item: ToastItem; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const [paused, setPaused] = useState(false)
  // Time left survives pauses, so hovering to reach Undo never cuts the toast short
  const remaining = useRef(item.action ? 6000 : 3200)

  // Removed on a timer matching animate-sink, not animationend, so a missing animation can't strand it
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(onDone, 200)
    return () => clearTimeout(t)
  }, [leaving])

  useEffect(() => {
    if (paused || leaving) return
    const start = Date.now()
    const t = setTimeout(() => setLeaving(true), remaining.current)
    return () => {
      clearTimeout(t)
      remaining.current -= Date.now() - start
    }
  }, [paused, leaving])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`pointer-events-auto flex items-center gap-2 rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-sm text-mist-100 shadow-2xl ${
        leaving ? 'animate-sink' : 'animate-rise'
      }`}
    >
      <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
      {item.message}
      {item.action && (
        <button
          onClick={() => {
            item.action!.onClick()
            setLeaving(true)
          }}
          className="-my-1 -mr-2 ml-2 rounded-lg px-2.5 py-1 text-sm font-semibold text-violet-300 transition-colors hover:bg-white/5 hover:text-violet-200"
        >
          {item.action.label}
        </button>
      )}
    </div>
  )
}
