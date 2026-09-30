import { useMemo, useState, useRef, useEffect } from 'react'
import { CalendarDays, ChevronDown, X } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import PlatformIcon from './PlatformIcon'
import EditablePostCard from './EditablePostCard'
import Collapse from './ui/Collapse'
import { ContentItem, GeneratedPiece, Platform } from '../types'

export default function ContentCalendar({
  items,
  onSchedule,
  onUpdate
}: {
  items: ContentItem[]
  onSchedule: (id: string, date: string) => void
  onUpdate?: (item: ContentItem) => void
}) {
  const [pendingId, setPendingId] = useState<string>('')
  const [pendingDate, setPendingDate] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const grouped = useMemo(() => {
    const map = new Map<string, ContentItem[]>()
    items
      .filter((i) => i.scheduledFor)
      .forEach((i) => {
        const key = i.scheduledFor as string
        map.set(key, [...(map.get(key) ?? []), i])
      })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [items])

  const unscheduled = items.filter((i) => !i.scheduledFor)

  const filtered = useMemo(() => {
    const selectedItem = unscheduled.find((i) => i.id === pendingId)
    if (selectedItem && searchQuery === selectedItem.topic) {
      return unscheduled
    }
    return unscheduled.filter((item) =>
      item.topic.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [unscheduled, searchQuery, pendingId])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        const selectedItem = items.find((i) => i.id === pendingId)
        if (selectedItem) {
          setSearchQuery(selectedItem.topic)
        } else {
          setSearchQuery('')
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [pendingId, items])

  const updatePiece = (item: ContentItem, platform: Platform, fields: Partial<GeneratedPiece>) =>
    onUpdate?.({ ...item, pieces: item.pieces.map((p) => (p.platform === platform ? { ...p, ...fields } : p)) })

  const handleAdd = () => {
    if (!pendingId || !pendingDate) return
    onSchedule(pendingId, pendingDate)
    setPendingId('')
    setPendingDate('')
    setSearchQuery('')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-purple">Content calendar</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">Plan when it goes out</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">Schedule pieces you've already created against a date.</p>
      </header>

      {items.length === 0 ? (
        <Card className="text-center text-sm text-mist-400">
          Create some content first, then come back to build out your calendar.
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <p className="mb-3 text-sm font-semibold text-mist-100">Schedule a piece</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div ref={containerRef} className="relative flex-1">
                <input
                  type="text"
                  placeholder="Choose content…"
                  aria-label="Content to schedule"
                  value={searchQuery}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPendingId('')
                    setIsOpen(true)
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-mist-100 placeholder-mist-400 focus:border-signal-purple/50 focus:outline-none"
                />
                  <div data-open={isOpen} className="popover absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-ink-900 p-1.5 shadow-2xl">
                    {filtered.length === 0 ? (
                      <div className="px-4 py-2.5 text-sm text-mist-400">
                        No matching content found
                      </div>
                    ) : (
                      filtered.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setPendingId(item.id)
                            setSearchQuery(item.topic)
                            setIsOpen(false)
                          }}
                          className={`w-full text-left rounded-lg px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
                            pendingId === item.id
                              ? 'bg-white/10 text-mist-100 font-medium'
                              : 'text-mist-300 hover:text-mist-100'
                          }`}
                        >
                          {item.topic}
                        </button>
                      ))
                    )}
                  </div>
              </div>
              <input
                type="date"
                aria-label="Date"
                value={pendingDate}
                onChange={(e) => setPendingDate(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-mist-100 focus:border-signal-purple/50"
              />
              <Button intent="primary" onClick={handleAdd} disabled={!pendingId || !pendingDate}>
                <CalendarDays size={14} />
                Add to calendar
              </Button>
            </div>
          </Card>

          {grouped.length === 0 ? (
            <p className="text-sm text-mist-400">Nothing scheduled yet.</p>
          ) : (
            <div className="space-y-5">
              {grouped.map(([date, entries]) => (
                <div key={date}>
                  <p className="mb-2 font-display text-sm font-semibold text-mist-100">
                    {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <div className="space-y-2">
                    {entries.map((i) => {
                      const isExpanded = expandedItemId === i.id
                      return (
                        <Card key={i.id} className="!p-0 overflow-hidden border border-white/8 bg-white/[0.02]">
                          <button
                            type="button"
                            onClick={() => setExpandedItemId(isExpanded ? null : i.id)}
                            aria-expanded={isExpanded}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.01] transition-colors duration-150"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-display text-sm font-medium text-mist-100">{i.topic}</p>
                              <p className="mt-1 text-xs text-mist-400">
                                {i.pieces.length} format{i.pieces.length === 1 ? '' : 's'}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                              <div className="hidden gap-1 sm:flex">
                                {i.pieces.map((p) => (
                                  <span key={p.platform} className="rounded-md bg-white/5 p-1.5 text-mist-300">
                                    <PlatformIcon platform={p.platform} size={12} />
                                  </span>
                                ))}
                              </div>
                              <ChevronDown
                                size={16}
                                className={`text-mist-400 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>

                          <Collapse open={isExpanded}>
                            <div className="border-t border-white/8 px-5 py-4 bg-white/[0.005]">
                              <div className="space-y-4">
                                {i.pieces.map((p) => (
                                  <EditablePostCard
                                    key={p.platform}
                                    topic={i.topic}
                                    tone={i.tone}
                                    platform={p.platform}
                                    content={p.content}
                                    imageUrl={p.imageUrl}
                                    imagePrompt={p.imagePrompt}
                                    imageGenerating={p.imageGenerating}
                                    imageError={p.imageError}
                                    existingPieces={i.pieces}
                                    showHeaderLabel
                                    onUpdate={(content) => updatePiece(i, p.platform, { content })}
                                    onUpdateImage={(fields) => updatePiece(i, p.platform, fields)}
                                  />
                                ))}
                              </div>
                              <div className="mt-4 flex items-center justify-end border-t border-white/8 pt-4">
                                <button
                                  type="button"
                                  onClick={() => onSchedule(i.id, '')}
                                  className="flex items-center gap-1.5 text-xs font-medium text-mist-400 hover:text-mist-100 transition-colors"
                                >
                                  <X size={13} />
                                  Unschedule
                                </button>
                              </div>
                            </div>
                          </Collapse>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
