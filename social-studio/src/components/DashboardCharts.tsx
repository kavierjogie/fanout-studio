import { ReactNode, useState, useMemo } from 'react'
import { Lightbulb, Layers, LayoutGrid, Clock, LucideIcon } from 'lucide-react'
import Card from './ui/Card'
import PlatformIcon from './PlatformIcon'
import { ContentItem, Platform } from '../types'
import { PLATFORMS } from '../data/platforms'

const BRAND_COLORS: Record<Platform, string> = {
  blog: '#8B5CF6',
  linkedin: '#0A66C2',
  instagram: '#E1306C',
  tiktok: '#25F4EE',
  x: '#FFFFFF',
  promo: '#10B981',
  hashtags: '#F59E0B',
  calendar: '#F97316',
  code: '#06B6D4'
}

const DONUT_R = 32
const DONUT_C = 2 * Math.PI * DONUT_R

const localDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const shortDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  children
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
  hint: string
  children?: ReactNode
}) {
  return (
    <Card className="!p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs text-mist-400">
            <Icon size={13} className="shrink-0 text-signal-purple" />
            <span className="truncate">{label}</span>
          </p>
          <p className="mt-2 font-display text-2xl font-semibold leading-none text-mist-100">{value}</p>
        </div>
        {children}
      </div>
      <p className="mt-2.5 truncate text-xs text-mist-400">{hint}</p>
    </Card>
  )
}

function ChartCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card className="flex h-full flex-col">
      <h3 className="font-display text-sm font-semibold text-mist-100">{title}</h3>
      <p className="mt-0.5 text-xs text-mist-400">{description}</p>
      <div className="mt-5 flex flex-1 flex-col justify-center">{children}</div>
    </Card>
  )
}

const ChartEmpty = ({ children }: { children: ReactNode }) => (
  <p className="py-8 text-center text-xs text-mist-400">{children}</p>
)

export default function DashboardCharts({ items }: { items: ContentItem[] }) {
  const [hoveredSlice, setHoveredSlice] = useState<Platform | null>(null)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const today = localDate(new Date())

  // Headline numbers
  const totalIdeas = items.length
  const totalPieces = items.reduce((sum, item) => sum + item.pieces.length, 0)
  const ideasThisWeek = items.filter((i) => Date.now() - i.createdAt < 7 * 24 * 3600000).length
  const upcoming = items
    .filter((i) => i.scheduledFor && i.scheduledFor >= today)
    .sort((a, b) => (a.scheduledFor ?? '').localeCompare(b.scheduledFor ?? ''))

  // Per-format counts and average length, used by the donut and the length bars
  const formats = useMemo(() => {
    const stats = new Map<Platform, { count: number; words: number }>()
    items.forEach((item) =>
      item.pieces.forEach((piece) => {
        const s = stats.get(piece.platform) ?? { count: 0, words: 0 }
        s.count += 1
        s.words += piece.content.split(/\s+/).filter(Boolean).length
        stats.set(piece.platform, s)
      })
    )
    return PLATFORMS.filter((p) => stats.has(p.id)).map((p) => {
      const s = stats.get(p.id)!
      return { id: p.id, label: p.shortLabel, count: s.count, avgWords: Math.round(s.words / s.count), color: BRAND_COLORS[p.id] }
    })
  }, [items])

  const donutSlices = useMemo(() => {
    let start = 0
    return formats.map((f) => {
      const share = f.count / totalPieces
      const slice = { ...f, share, length: share * DONUT_C, start }
      start += slice.length
      return slice
    })
  }, [formats, totalPieces])
  const activeSlice = donutSlices.find((s) => s.id === hoveredSlice) ?? null

  const byLength = formats.slice().sort((a, b) => b.avgWords - a.avgWords)
  const maxWords = Math.max(...byLength.map((f) => f.avgWords), 1)

  // Seven-day window centred on today: what was created, and what is scheduled to go out
  const week = useMemo(() => {
    return [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
      const d = new Date()
      d.setDate(d.getDate() + offset)
      const date = localDate(d)
      return {
        isToday: offset === 0,
        dayLabel: offset === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' }),
        dateLabel: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        created: items.filter((i) => localDate(new Date(i.createdAt)) === date).length,
        scheduled: items.filter((i) => i.scheduledFor === date).length
      }
    })
  }, [items])
  const weekMax = Math.max(2, ...week.map((d) => Math.max(d.created, d.scheduled)))
  const weekAxisMax = weekMax + (weekMax % 2) // even, so the midpoint label is a whole number
  const step = 285 / 7

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat
          icon={Lightbulb}
          label="Ideas created"
          value={totalIdeas}
          hint={totalIdeas ? `${ideasThisWeek} in the last 7 days` : 'Create your first idea'}
        />
        <Stat
          icon={Layers}
          label="Drafts generated"
          value={totalPieces}
          hint={totalIdeas ? `${(totalPieces / totalIdeas).toFixed(1)} per idea on average` : 'No drafts yet'}
        />
        <Stat
          icon={LayoutGrid}
          label="Formats used"
          value={
            <>
              {formats.length}
              <span className="ml-1 font-body text-sm font-normal text-mist-400">/ {PLATFORMS.length}</span>
            </>
          }
          hint={formats.length === PLATFORMS.length ? 'Every format covered' : `${PLATFORMS.length - formats.length} still to try`}
        >
          <svg viewBox="0 0 36 36" className="hidden h-9 w-9 shrink-0 -rotate-90 sm:block" aria-hidden="true">
            <circle cx="18" cy="18" r="14" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />
            <circle
              cx="18"
              cy="18"
              r="14"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={87.96}
              strokeDashoffset={87.96 - (formats.length / PLATFORMS.length) * 87.96}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
          </svg>
        </Stat>
        <Stat
          icon={Clock}
          label="Scheduled"
          value={upcoming.length}
          hint={upcoming[0]?.scheduledFor ? `Next goes out ${shortDate(upcoming[0].scheduledFor)}` : 'Nothing scheduled yet'}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Format mix" description="Share of drafts by format.">
          {totalPieces === 0 ? (
            <ChartEmpty>Generate a draft to see your format mix.</ChartEmpty>
          ) : (
            <div className="flex items-center gap-5">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                  {donutSlices.map((slice) => (
                    <circle
                      key={slice.id}
                      cx="50"
                      cy="50"
                      r={DONUT_R}
                      stroke={slice.color}
                      strokeWidth={hoveredSlice === slice.id ? 11 : 8}
                      // 1-unit gap between slices so neighbouring colours stay distinct
                      strokeDasharray={`${Math.max(slice.length - 1, 0.5)} ${DONUT_C}`}
                      strokeDashoffset={-slice.start}
                      fill="none"
                      opacity={hoveredSlice && hoveredSlice !== slice.id ? 0.35 : 1}
                      className="transition-opacity duration-200 ease-out"
                      onMouseEnter={() => setHoveredSlice(slice.id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  ))}
                </svg>
                <div className="pointer-events-none absolute flex flex-col items-center text-center">
                  <span className="font-display text-lg font-semibold leading-none text-mist-100">
                    {activeSlice ? `${Math.round(activeSlice.share * 100)}%` : totalPieces}
                  </span>
                  <span className="mt-1 text-[11px] text-mist-400">{activeSlice ? activeSlice.label : 'drafts'}</span>
                </div>
              </div>

              <ul className="min-w-0 flex-1 space-y-0.5">
                {donutSlices.map((slice) => (
                  <li
                    key={slice.id}
                    className={`flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs transition-colors ${
                      hoveredSlice === slice.id ? 'bg-white/5 text-mist-100' : 'text-mist-300'
                    }`}
                    onMouseEnter={() => setHoveredSlice(slice.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                      <span className="truncate">{slice.label}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-mist-400">{slice.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ChartCard>

        <ChartCard title="This week" description="Ideas created and posts scheduled, day by day.">
          <div className="relative">
            <svg
              viewBox="0 0 320 120"
              className="h-auto w-full"
              role="img"
              aria-label={`This week: ${week.map((d) => `${d.dayLabel} ${d.created} created, ${d.scheduled} scheduled`).join('; ')}`}
            >
              {[0, 0.5, 1].map((r) => (
                <line
                  key={r}
                  x1="25"
                  x2="310"
                  y1={95 - r * 80}
                  y2={95 - r * 80}
                  stroke={r === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}
                  strokeDasharray={r === 0 ? undefined : '2 3'}
                />
              ))}
              {[0, 0.5, 1].map((r) => (
                <text key={r} x="18" y={98 - r * 80} fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="end">
                  {weekAxisMax * r}
                </text>
              ))}

              {week.map((d, idx) => {
                const xCenter = 25 + idx * step + step / 2
                const hovered = hoveredDay === idx
                const bar = (value: number, x: number, fill: string) =>
                  value > 0 && (
                    <rect
                      x={x}
                      y={95 - (value / weekAxisMax) * 80}
                      width="10"
                      height={(value / weekAxisMax) * 80}
                      fill={fill}
                      rx="2"
                      className="transition-[height,y] duration-300"
                    />
                  )
                return (
                  <g key={idx} onMouseEnter={() => setHoveredDay(idx)} onMouseLeave={() => setHoveredDay(null)}>
                    <rect
                      x={25 + idx * step + 2}
                      y="10"
                      width={step - 4}
                      height="86"
                      rx="4"
                      fill={hovered ? 'rgba(255,255,255,0.04)' : 'transparent'}
                    />
                    {bar(d.created, xCenter - 11, '#8B5CF6')}
                    {bar(d.scheduled, xCenter + 1, '#F97316')}
                    <text
                      x={xCenter}
                      y="111"
                      fill={d.isToday || hovered ? '#EFE9F7' : 'rgba(255,255,255,0.55)'}
                      fontSize="9"
                      fontWeight={d.isToday ? 600 : 400}
                      textAnchor="middle"
                    >
                      {d.dayLabel}
                    </text>
                  </g>
                )
              })}
            </svg>

            {hoveredDay !== null && (
              <div
                className="pointer-events-none absolute top-0 z-10 min-w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-ink-800 p-2 text-[11px] shadow-2xl"
                style={{ left: `${((25 + hoveredDay * step + step / 2) / 320) * 100}%` }}
              >
                <p className="font-semibold text-mist-100">{week[hoveredDay].dateLabel}</p>
                <p className="mt-1 flex items-center gap-1.5 text-mist-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal-purple" />
                  {week[hoveredDay].created} created
                </p>
                <p className="flex items-center gap-1.5 text-mist-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal-orange" />
                  {week[hoveredDay].scheduled} scheduled
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-center gap-4 text-[11px] text-mist-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-signal-purple" /> Created
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-signal-orange" /> Scheduled
            </span>
          </div>
        </ChartCard>

        <div className="md:col-span-2 lg:col-span-1">
          <ChartCard title="Draft length" description="Average words per draft, by format.">
            {byLength.length === 0 ? (
              <ChartEmpty>Length stats appear once you have drafts.</ChartEmpty>
            ) : (
              <ul className="space-y-3">
                {byLength.map((f) => (
                  <li key={f.id} title={`${f.count} draft${f.count === 1 ? '' : 's'}`}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                      <span className="flex min-w-0 items-center gap-1.5 font-medium text-mist-300">
                        <PlatformIcon platform={f.id} size={12} />
                        <span className="truncate">{f.label}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-mist-400">{f.avgWords} words</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full transition-[width] duration-500 ease-out"
                        style={{ width: `${Math.max(4, (f.avgWords / maxWords) * 100)}%`, backgroundColor: f.color }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
