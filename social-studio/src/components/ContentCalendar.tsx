import { useMemo, useState, useRef, useEffect } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import PlatformIcon from './PlatformIcon'
import EditablePostCard from './EditablePostCard'
import Collapse from './ui/Collapse'
import EmptyState from './ui/EmptyState'
import { ContentItem, GeneratedPiece, Platform } from '../types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Local YYYY-MM-DD, the format stored in `scheduledFor`
const isoDate = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

export default function ContentCalendar({
  items,
  onSchedule,
  onUpdate,
  onCreate
}: {
  items: ContentItem[]
  onSchedule: (id: string, date: string) => void
  onUpdate?: (item: ContentItem) => void
  onCreate: () => void
}) {
  const [pendingId, setPendingId] = useState<string>('')
  const [pendingDate, setPendingDate] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const now = new Date()
  const today = isoDate(now.getFullYear(), now.getMonth(), now.getDate())
  const [month, setMonth] = useState({ y: now.getFullYear(), m: now.getMonth() })

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
  const countByDate = new Map(grouped.map(([date, entries]) => [date, entries.length]))

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

  // Month grid: leading blanks up to the first weekday, then one cell per day
  const firstWeekday = new Date(month.y, month.m, 1).getDay()
  const daysInMonth = new Date(month.y, month.m + 1, 0).getDate()
  const monthLabel = new Date(month.y, month.m, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const shiftMonth = (delta: number) => {
    const d = new Date(month.y, month.m + delta, 1)
    setMonth({ y: d.getFullYear(), m: d.getMonth() })
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-purple">Content calendar</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">Plan when it goes out</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">Schedule pieces you've already created against a date.</p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nothing to schedule yet"
          description="Create some content first, then come back to build out your calendar."
        >
          <Button intent="primary" onClick={onCreate}>
            <Sparkles size={15} />
            Create content
          </Button>
        </EmptyState>
      ) : (
        <>
          <Card className="relative z-10 mb-4 sm:!p-6">
            <p className="mb-3 font-display text-sm font-semibold text-mist-100">Schedule a piece</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div ref={containerRef} className="relative flex-1">
                <input
                  type="text"
                  placeholder={unscheduled.length ? 'Choose content…' : 'Everything is already scheduled'}
                  aria-label="Content to schedule"
                  value={searchQuery}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPendingId('')
                    setIsOpen(true)
                  }}
                  className="field"
                />
                  <div data-open={isOpen} className="popover absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-ink-900 p-1.5 shadow-2xl">
                    {filtered.length === 0 ? (
                      <div className="px-4 py-2.5 text-sm text-mist-400">
                        {unscheduled.length ? 'No matching content found' : 'Nothing left to schedule'}
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
                min={today}
                onChange={(e) => setPendingDate(e.target.value)}
                className="field sm:!w-44"
              />
              <Button intent="primary" className="shrink-0" onClick={handleAdd} disabled={!pendingId || !pendingDate}>
                <CalendarDays size={14} />
                Add to calendar
              </Button>
            </div>
          </Card>

          <Card className="mb-8 !p-4 sm:!p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-sm font-semibold text-mist-100" aria-live="polite">{monthLabel}</p>
              <div className="flex items-center gap-1">
                {(month.y !== now.getFullYear() || month.m !== now.getMonth()) && (
                  <button
                    onClick={() => setMonth({ y: now.getFullYear(), m: now.getMonth() })}
                    className="mr-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-mist-300 hover:bg-white/5 hover:text-mist-100"
                  >
                    Today
                  </button>
                )}
                <button onClick={() => shiftMonth(-1)} aria-label="Previous month" className="rounded-lg p-2 text-mist-300 hover:bg-white/5 hover:text-mist-100">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => shiftMonth(1)} aria-label="Next month" className="rounded-lg p-2 text-mist-300 hover:bg-white/5 hover:text-mist-100">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {WEEKDAYS.map((d) => (
                <p key={d} className="pb-1 text-center text-[11px] font-medium uppercase tracking-wider text-mist-400">
                  {d}
                </p>
              ))}
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <span key={`blank-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = isoDate(month.y, month.m, i + 1)
                const count = countByDate.get(date) ?? 0
                const isPast = date < today
                const selected = pendingDate === date
                return (
                  <button
                    key={date}
                    disabled={isPast}
                    aria-pressed={selected}
                    aria-label={`${new Date(date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}${
                      count ? `, ${count} scheduled` : ''
                    }`}
                    onClick={() => setPendingDate(selected ? '' : date)}
                    className={`flex h-12 flex-col items-start justify-between rounded-lg border p-1.5 text-left text-xs transition-colors sm:h-16 sm:p-2 ${
                      selected
                        ? 'border-signal-purple bg-signal-purple/20 text-mist-100'
                        : date === today
                          ? 'border-signal-purple/50 bg-white/[0.03] text-mist-100'
                          : 'border-transparent bg-white/[0.03] text-mist-300'
                    } ${isPast ? 'opacity-50' : 'hover:border-white/20 hover:bg-white/[0.07]'}`}
                  >
                    <span className={date === today ? 'font-semibold text-violet-300' : ''}>{i + 1}</span>
                    {count > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-signal-orange/20 px-1.5 text-[11px] font-medium leading-4 text-orange-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-signal-orange" />
                        {count}
                        <span className="hidden sm:inline">{count === 1 ? 'post' : 'posts'}</span>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-xs text-mist-400">Pick a day to fill in the date above.</p>
          </Card>

          <h2 className="mb-3 font-display text-lg font-semibold text-mist-100">Scheduled</h2>
          {grouped.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Nothing scheduled yet"
              description="Choose a piece and a date above to add your first post to the calendar."
            />
          ) : (
            <div className="space-y-5">
              {grouped.map(([date, entries]) => (
                <div key={date}>
                  <p className={`mb-2 text-sm font-medium ${date < today ? 'text-mist-400' : 'text-mist-300'}`}>
                    {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    {date === today && <span className="ml-2 text-xs text-violet-300">Today</span>}
                    {date < today && <span className="ml-2 text-xs">Past</span>}
                  </p>
                  <div className="space-y-2">
                    {entries.map((i) => {
                      const isExpanded = expandedItemId === i.id
                      return (
                        <Card key={i.id} className="!p-0 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setExpandedItemId(isExpanded ? null : i.id)}
                            aria-expanded={isExpanded}
                            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-white/[0.03] transition-colors duration-150 sm:px-5"
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
                            <div className="border-t border-white/8 bg-black/20 px-3 pb-4 sm:px-5">
                              <div>
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
                              <div className="mt-4 flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => onSchedule(i.id, '')}
                                  className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-mist-400 hover:bg-white/5 hover:text-mist-100 transition-colors"
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
