import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { PROMPTS, CATEGORIES } from '../data/prompts'
import { PromptCategory, PromptTemplate } from '../types'

const categoryAccent = (cat: PromptCategory) => {
  if (['Marketing', 'Business', 'Branding'].includes(cat)) return 'purple' as const
  if (['Social Media', 'Engagement'].includes(cat)) return 'pink' as const
  return 'orange' as const
}

export default function PromptLibrary({ onUse }: { onUse: (prompt: PromptTemplate) => void }) {
  const [filter, setFilter] = useState<PromptCategory | 'All'>('All')

  const visible = filter === 'All' ? PROMPTS : PROMPTS.filter((p) => p.category === filter)

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-purple">Prompt library</p>
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
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === c
                ? 'border-white/20 bg-white/10 text-mist-100'
                : 'border-white/10 text-mist-400 hover:text-mist-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((prompt) => (
          <Card key={prompt.id} className="flex flex-col justify-between">
            <div>
              <Badge accent={categoryAccent(prompt.category)}>{prompt.category}</Badge>
              <h3 className="mt-3 font-display text-base font-semibold text-mist-100">{prompt.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mist-400">{prompt.description}</p>
            </div>
            <Button intent="primary" className="mt-5 w-full" onClick={() => onUse(prompt)}>
              <Wand2 size={14} />
              Use prompt
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
