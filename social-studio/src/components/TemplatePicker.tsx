import { BookOpen, ArrowUpRight } from 'lucide-react'
import Badge from './ui/Badge'
import { PROMPTS, CATEGORIES, categoryAccent } from '../data/prompts'
import { PromptTemplate } from '../types'

// Quick pick only; full template details live in the Prompt Library
export default function TemplatePicker({
  selected,
  onSelect
}: {
  selected: PromptTemplate | null
  onSelect: (p: PromptTemplate | null) => void
}) {
  const [before, after] = selected?.template.split('{topic}') ?? []

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal-purple/15 text-signal-purple">
          <BookOpen size={15} />
        </span>
        <label htmlFor="prompt-template" className="font-display text-sm font-semibold text-mist-100">
          Start from a template
        </label>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-mist-400">Optional</span>
        <a
          href="#library"
          className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-mist-400 transition-colors hover:bg-white/5 hover:text-mist-100"
        >
          Browse library
          <ArrowUpRight size={13} />
        </a>
      </div>

      <select
        id="prompt-template"
        value={selected?.id ?? ''}
        onChange={(e) => onSelect(PROMPTS.find((p) => p.id === e.target.value) ?? null)}
        className={`field ${selected ? '!border-signal-purple/50 !bg-signal-purple/[0.06]' : ''}`}
      >
        <option value="">No template (write your own idea)</option>
        {CATEGORIES.map((category) => (
          <optgroup key={category} label={category}>
            {PROMPTS.filter((p) => p.category === category).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

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
