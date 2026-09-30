import { Sparkles, Repeat, BookMarked, Clock, CalendarDays, ArrowRight } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import PlatformIcon from './PlatformIcon'
import PipelineSignature from './PipelineSignature'
import DashboardCharts from './DashboardCharts'
import { ContentItem, View } from '../types'

export default function Dashboard({
  items,
  setView
}: {
  items: ContentItem[]
  setView: (v: View) => void
}) {
  const recent = items.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-purple">Studio</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-mist-50 sm:text-4xl">
          Create once. <span className="text-gradient-hero">Publish everywhere.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-mist-400">
          Start with a single idea and generate every platform-ready format from it — no separate tools, no starting over.
        </p>
      </header>

      <PipelineSignature />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button intent="ai" onClick={() => setView('create')}>
          <Sparkles size={15} />
          Create content
        </Button>
        <Button intent="ghost" onClick={() => setView('library')}>
          <BookMarked size={15} />
          Browse prompt library
        </Button>
      </div>

      <div className="mt-10">
        <DashboardCharts items={items} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button onClick={() => setView('transform')} className="text-left">
          <Card className="h-full transition-colors hover:border-signal-pink/30">
            <Repeat size={18} className="text-signal-pink" />
            <p className="mt-3 font-display text-sm font-semibold text-mist-50">Transform content</p>
            <p className="mt-1 text-xs text-mist-400">Expand something you've made into new formats.</p>
          </Card>
        </button>
        <button onClick={() => setView('recent')} className="text-left">
          <Card className="h-full transition-colors hover:border-signal-purple/30">
            <Clock size={18} className="text-signal-purple" />
            <p className="mt-3 font-display text-sm font-semibold text-mist-50">Recent content</p>
            <p className="mt-1 text-xs text-mist-400">Pick up where you left off.</p>
          </Card>
        </button>
        <button onClick={() => setView('calendar')} className="text-left">
          <Card className="h-full transition-colors hover:border-signal-orange/30">
            <CalendarDays size={18} className="text-signal-orange" />
            <p className="mt-3 font-display text-sm font-semibold text-mist-50">Content calendar</p>
            <p className="mt-1 text-xs text-mist-400">See what's scheduled and what's next.</p>
          </Card>
        </button>
      </div>

      {recent.length > 0 && (
        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-mist-50">Pick up where you left off</h2>
            <button onClick={() => setView('recent')} className="flex items-center gap-1 text-xs text-mist-400 hover:text-mist-100">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recent.map((item) => (
              <button key={item.id} onClick={() => setView('recent')} className="block w-full text-left">
                <Card className="flex items-center justify-between gap-4 transition-colors hover:border-signal-purple/30">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-mist-100">{item.topic}</p>
                    <p className="mt-0.5 text-xs text-mist-400">{item.pieces.length} formats</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {item.pieces.slice(0, 4).map((p) => (
                      <span key={p.platform} className="rounded-md bg-white/5 p-1.5 text-mist-300">
                        <PlatformIcon platform={p.platform} size={12} />
                      </span>
                    ))}
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
