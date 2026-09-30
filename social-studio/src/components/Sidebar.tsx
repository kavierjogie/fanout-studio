import { LayoutGrid, Sparkles, Repeat, BookMarked, Clock, CalendarDays, X } from 'lucide-react'
import { useEffect } from 'react'
import { View } from '../types'

const items: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'create', label: 'Create content', icon: Sparkles },
  { id: 'transform', label: 'Transform content', icon: Repeat },
  { id: 'library', label: 'Prompt library', icon: BookMarked },
  { id: 'recent', label: 'Recent content', icon: Clock },
  { id: 'calendar', label: 'Content calendar', icon: CalendarDays }
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
        className={`fixed lg:sticky top-0 z-40 flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-white/8 bg-ink-950 px-4 py-6 transition-[transform,visibility] duration-200 lg:visible lg:w-64 lg:translate-x-0 lg:transition-none ${
          open ? 'translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-grad-hero">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold leading-none text-mist-100">Studio</p>
              <p className="mt-1 text-[11px] text-mist-400">Content, everywhere</p>
            </div>
          </div>
          <button className="-mr-1 rounded-lg p-2 text-mist-400 hover:bg-white/5 hover:text-mist-100 lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {items.map(({ id, label, icon: Icon }) => {
            const active = view === id
            return (
              <button
                key={id}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  setView(id)
                  onClose()
                }}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? 'bg-white/8 font-medium text-mist-100'
                    : 'text-mist-300 hover:bg-white/5 hover:text-mist-100'
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    active ? 'bg-signal-purpleDeep' : 'bg-white/5 group-hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-white' : 'text-mist-300'} />
                </span>
                {label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto px-3 pt-8 text-xs leading-relaxed text-mist-400">
          <p className="flex items-center gap-2 text-mist-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Saved in this browser
          </p>
          <p className="mt-1.5">Text by Groq · Images by FLUX.1</p>
        </div>
      </aside>
    </>
  )
}
