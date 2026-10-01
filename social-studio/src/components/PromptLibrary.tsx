import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { PROMPTS, CATEGORIES, categoryAccent } from '../data/prompts'
import { PromptCategory, PromptTemplate } from '../types'

export default function PromptLibrary({ onUse }: { onUse: (prompt: PromptTemplate) => void }) {
  const [filter, setFilter] = useState<PromptCategory | 'All'>('All')

  const visible = filter === 'All' ? PROMPTS : PROMPTS.filter((p) => p.category === filter)

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-purple">Prompt library</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">
          Ready-made starting points
        </h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Browse prompts by category, then drop one into the create flow and make it your own.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {(['All', ...CATEGORIES] as (PromptCategory | 'All')[]).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === c
                ? 'border-signal-purple/50 bg-signal-purple/15 text-violet-200'
                : 'border-white/10 bg-white/[0.03] text-mist-300 hover:bg-white/10 hover:text-mist-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((prompt) => (
          <Card key={prompt.id} className="group flex flex-col justify-between transition-colors hover:border-signal-purple/30">
            <div>
              <Badge accent={categoryAccent(prompt.category)}>{prompt.category}</Badge>
              <h3 className="mt-3 font-display text-base font-semibold text-mist-100">{prompt.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mist-400">{prompt.description}</p>
              <p className="mt-3 rounded-lg bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-mist-300">
                {prompt.template.split('{topic}')[0]}
                <span className="rounded bg-signal-purple/20 px-1 font-medium text-violet-200">your topic</span>
                {prompt.template.split('{topic}')[1]}
              </p>
            </div>
            <Button
              intent="ghost"
              className="mt-5 w-full group-hover:border-signal-purple/40 group-hover:bg-signal-purple/15"
              onClick={() => onUse(prompt)}
              aria-label={`Use prompt: ${prompt.name}`}
            >
              Use this prompt
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
