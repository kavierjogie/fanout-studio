import { useState } from 'react'
import { BookOpen, ArrowRight, Check, X, ChevronDown } from 'lucide-react'
import Badge from './ui/Badge'
import { PROMPTS, CATEGORIES, categoryAccent } from '../data/prompts'
import { PromptCategory, PromptTemplate } from '../types'

// Desktop grid shows this many until expanded; the phone carousel shows all
const COLLAPSED_COUNT = 6

function TemplateText({ template }: { template: string }) {
  const [before, after] = template.split('{topic}')
  return (
    <>
      {before}
      <span className="rounded bg-signal-purple/20 px-1 font-medium text-violet-200">your topic</span>
      {after}
    </>
  )
}

export default function TemplatePicker({
  selected,
  onSelect
}: {
  selected: PromptTemplate | null
  onSelect: (p: PromptTemplate | null) => void
}) {
  const [filter, setFilter] = useState<PromptCategory | 'All'>('All')
  const [showAll, setShowAll] = useState(false)

  const filtered = filter === 'All' ? PROMPTS : PROMPTS.filter((p) => p.category === filter)

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal-purple/15 text-signal-purple">
          <BookOpen size={15} />
        </span>
        <h2 className="font-display text-sm font-semibold text-mist-100">Start from a template</h2>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-mist-400">Optional</span>
      </div>

      {selected ? (
        <div className="relative overflow-hidden rounded-xl border border-signal-purple/40 bg-signal-purple/[0.07] p-4 shadow-glow animate-rise sm:p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-grad-hero" />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge accent={categoryAccent(selected.category)}>{selected.category}</Badge>
                <span className="flex items-center gap-1 text-[11px] font-medium text-violet-300">
                  <Check size={12} /> Selected
                </span>
              </div>
              <h3 className="mt-2.5 font-display text-base font-semibold text-mist-100">{selected.name}</h3>
              <p className="mt-1 text-sm text-mist-400">{selected.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-mist-300 transition-colors hover:border-white/20 hover:text-mist-100"
              >
                <X size={13} /> Clear template
              </button>
            </div>
          </div>
          <p className="mt-3 rounded-lg border border-white/5 bg-ink-950/60 px-3 py-2.5 text-xs leading-relaxed text-mist-300">
            <TemplateText template={selected.template} />
          </p>
        </div>
      ) : (
        <>
          {/* Scrolls sideways on phones instead of wrapping into several rows */}
          <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
            {(['All', ...CATEGORIES] as (PromptCategory | 'All')[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setFilter(c)
                  setShowAll(false)
                }}
                aria-pressed={filter === c}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === c
                    ? 'border-signal-purple/50 bg-signal-purple/15 text-violet-200'
                    : 'border-white/10 bg-white/[0.03] text-mist-400 hover:bg-white/[0.06] hover:text-mist-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Swipeable row on phones, grid from tablet up */}
          <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p)}
                aria-label={`Use template: ${p.name}`}
                className={`group relative flex w-[80%] shrink-0 snap-start flex-col overflow-hidden sm:w-auto ${!showAll && i >= COLLAPSED_COUNT ? 'sm:hidden' : ''} rounded-xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-signal-purple/40 hover:shadow-glow`}
              >
                <span className="absolute inset-x-0 top-0 h-px bg-grad-hero opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="flex items-center justify-between">
                  <Badge accent={categoryAccent(p.category)}>{p.category}</Badge>
                  <ArrowRight
                    size={14}
                    className="text-signal-purple opacity-0 transition -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </span>
                <span className="mt-3 font-display text-sm font-semibold text-mist-100">{p.name}</span>
                <span className="mt-1 text-xs leading-relaxed text-mist-400">{p.description}</span>
                <span className="mt-3 block flex-1 rounded-lg bg-ink-950/50 px-2.5 py-2 text-[11px] leading-relaxed text-mist-300 transition-colors group-hover:bg-ink-950/80">
                  <TemplateText template={p.template} />
                </span>
              </button>
            ))}
          </div>

          {filtered.length > COLLAPSED_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="mx-auto mt-4 hidden items-center sm:flex gap-1.5 text-xs font-medium text-mist-400 hover:text-mist-100"
            >
              {showAll ? 'Show fewer' : `Show all ${filtered.length} templates`}
              <ChevronDown size={14} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          )}
        </>
      )}
    </div>
  )
}
