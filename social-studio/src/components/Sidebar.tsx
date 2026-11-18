import { X } from 'lucide-react'
import { useEffect } from 'react'
import { View } from '../types'
import Logo from './Logo'
import ReadingPreferences from './ReadingPreferences'

const items: { id: View; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'create', label: 'Create content' },
  { id: 'transform', label: 'Transform content' },
  { id: 'library', label: 'Prompt library' },
  { id: 'recent', label: 'Recent content' },
  { id: 'calendar', label: 'Content calendar' }
]

export default function Sidebar({
  view,
  setView,
  open,
  onClose
}: {
  view: View
  setView: (v: View) => void
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-200 lg:hidden ${
          open ? '' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed lg:sticky top-0 z-40 flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-ink-700 bg-ink-950 px-4 py-6 transition-[transform,visibility] duration-200 lg:visible lg:w-64 lg:translate-x-0 lg:transition-none ${
          open ? 'translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Logo size={30} tagline />
          <button className="-mr-1 rounded-lg p-2 text-mist-400 hover:bg-white/5 hover:text-mist-100 lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Station line: each page is a stop; the current one is a filled station */}
        <nav aria-label="Main" className="relative mt-8 flex flex-col gap-1 before:absolute before:inset-y-4 before:left-[19px] before:w-0.5 before:bg-ink-700">
          {items.map(({ id, label }) => {
            const active = view === id
            return (
              <button
                key={id}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  setView(id)
                  onClose()
                }}
                className={`group relative flex items-center rounded py-2 pl-10 pr-3 text-left text-sm transition-colors ${
                  active ? 'bg-white/[0.06] font-semibold text-mist-100' : 'text-mist-300 hover:bg-white/[0.03] hover:text-mist-100'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-[14px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 ${
                    active ? 'border-accent bg-accent' : 'border-mist-400 bg-ink-950 group-hover:border-mist-300'
                  }`}
                />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-8">
          <ReadingPreferences />
        </div>
        <div className="px-3 pt-4 text-xs leading-relaxed text-mist-400">
          <p className="flex items-center gap-2 text-mist-300">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Saved in this browser
          </p>
          <p className="mt-1.5">Text by Groq · Images by FLUX.1</p>
        </div>
      </aside>
    </>
  )
}
