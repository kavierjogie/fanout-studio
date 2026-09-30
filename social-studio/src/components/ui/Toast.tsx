import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type ToastItem = { id: number; message: string }

let push: (message: string) => void = () => {}

// Fire-and-forget success feedback; <Toaster /> is mounted once in App
export const toast = (message: string) => push(message)

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    push = (message) => {
      const id = Date.now() + Math.random()
      setItems((cur) => [...cur.slice(-2), { id, message }])
      setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), 3200)
    }
    return () => {
      push = () => {}
    }
  }, [])

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4">
      {items.map((t) => (
        <div
          key={t.id}
          className="flex animate-rise items-center gap-2 rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-sm text-mist-100 shadow-2xl"
        >
          <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
          {t.message}
        </div>
      ))}
    </div>
  )
}
