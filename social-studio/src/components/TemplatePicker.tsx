import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { BookOpen, ArrowUpRight, Check, ChevronDown } from 'lucide-react'
import Badge from './ui/Badge'
import { PROMPTS, CATEGORIES, categoryAccent } from '../data/prompts'
import { PromptTemplate } from '../types'

// Menu order: "no template" first, then templates grouped by category
const OPTIONS: (PromptTemplate | null)[] = [null, ...CATEGORIES.flatMap((c) => PROMPTS.filter((p) => p.category === c))]
const optionId = (p: PromptTemplate | null) => `template-opt-${p?.id ?? 'none'}`

// Quick pick only; full template details live in the Prompt Library.
// Custom listbox because the native <select> menu can't be themed (renders white on Windows).
export default function TemplatePicker({
  selected,
  onSelect
}: {
  selected: PromptTemplate | null
  onSelect: (p: PromptTemplate | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedIndex = OPTIONS.findIndex((p) => p?.id === selected?.id)
  const [before, after] = selected?.template.split('{topic}') ?? []

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(optionId(OPTIONS[active]))?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const openMenu = () => {
    setActive(Math.max(selectedIndex, 0))
    setOpen(true)
  }

  const choose = (p: PromptTemplate | null) => {
    onSelect(p)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openMenu()
      }
      return
    }
    const last = OPTIONS.length - 1
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last
    }
    if (e.key in moves) {
      e.preventDefault()
      setActive(moves[e.key])
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(OPTIONS[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal-purple/15 text-signal-purple">
          <BookOpen size={15} />
        </span>
        <span id="template-label" className="font-display text-sm font-semibold text-mist-100">
          Start from a template
        </span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-mist-400">Optional</span>
        <a
          href="#library"
          className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-mist-400 transition-colors hover:bg-white/5 hover:text-mist-100"
        >
          Browse library
          <ArrowUpRight size={13} />
        </a>
      </div>

      <div ref={rootRef} className="relative">
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="template-listbox"
          aria-labelledby="template-label"
          aria-activedescendant={open ? optionId(OPTIONS[active]) : undefined}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
          className={`field flex items-center justify-between gap-3 text-left ${
            selected || open ? '!border-signal-purple/50 !bg-signal-purple/[0.06]' : ''
          }`}
        >
          <span className={`truncate ${selected ? 'text-mist-100' : 'text-mist-400'}`}>
            {selected ? selected.name : 'No template (write your own idea)'}
          </span>
          <ChevronDown size={16} className={`shrink-0 text-mist-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        <div
          id="template-listbox"
          role="listbox"
          aria-labelledby="template-label"
          data-open={open}
          className="popover absolute inset-x-0 z-30 mt-2 max-h-80 origin-top overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-ink-900 p-1.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]"
        >
          {OPTIONS.map((p, i) => {
            const isSelected = i === Math.max(selectedIndex, 0)
            const startsGroup = p && (i === 1 || OPTIONS[i - 1]?.category !== p.category)
            return (
              <div key={optionId(p)}>
                {startsGroup && (
                  <p
                    role="presentation"
                    className="mt-2 border-t border-white/5 px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-mist-400"
                  >
                    {p.category}
                  </p>
                )}
                <div
                  id={optionId(p)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseMove={() => active !== i && setActive(i)}
                  onMouseDown={(e) => e.preventDefault()} // keep focus on the trigger
                  onClick={() => choose(p)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    i === active ? 'bg-signal-purple/15 text-mist-100' : 'text-mist-300'
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate ${isSelected ? 'font-medium text-violet-200' : ''}`}>
                      {p ? p.name : 'No template'}
                    </span>
                    <span className="block truncate text-xs text-mist-400">
                      {p ? p.description : 'Write your own idea from scratch'}
                    </span>
                  </span>
                  {isSelected && <Check size={15} className="shrink-0 text-signal-purple" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <div key={selected.id} className="mt-2.5 flex items-start gap-2.5 rounded-xl border border-white/5 bg-ink-950/50 px-3 py-2.5 animate-rise">
          <Badge accent={categoryAccent(selected.category)}>{selected.category}</Badge>
          <p className="pt-0.5 text-xs leading-relaxed text-mist-300">
            {before}
            <span className="rounded bg-signal-purple/20 px-1 font-medium text-violet-200">your topic</span>
            {after}
          </p>
        </div>
      )}
    </div>
  )
}
