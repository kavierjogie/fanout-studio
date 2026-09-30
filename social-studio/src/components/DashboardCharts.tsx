import { useState, useMemo } from 'react'
import { Lightbulb, Layers, CheckCircle2, Clock, Info } from 'lucide-react'
import Card from './ui/Card'
import PlatformIcon from './PlatformIcon'
import { ContentItem, Platform } from '../types'
import { PLATFORMS } from '../data/platforms'

const BRAND_COLORS: Record<Platform, { stroke: string; fill: string; text: string }> = {
  blog: { stroke: '#8B5CF6', fill: 'rgba(139, 92, 246, 0.15)', text: '#C4B5FD' },
  linkedin: { stroke: '#0A66C2', fill: 'rgba(10, 102, 194, 0.15)', text: '#93C5FD' },
  instagram: { stroke: '#E1306C', fill: 'rgba(225, 48, 108, 0.15)', text: '#F472B6' },
  tiktok: { stroke: '#25F4EE', fill: 'rgba(37, 244, 238, 0.15)', text: '#25F4EE' },
  x: { stroke: '#FFFFFF', fill: 'rgba(255, 255, 255, 0.15)', text: '#FFFFFF' },
  promo: { stroke: '#10B981', fill: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7' },
  hashtags: { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.15)', text: '#FCD34D' },
  calendar: { stroke: '#F97316', fill: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74' },
  code: { stroke: '#06B6D4', fill: 'rgba(6, 182, 212, 0.15)', text: '#67E8F9' }
}

const DEFAULT_COLOR = { stroke: '#6B7280', fill: 'rgba(107, 114, 128, 0.15)', text: '#9CA3AF' }

export default function DashboardCharts({ items }: { items: ContentItem[] }) {
  // HOVER STATES
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState<Platform | null>(null)
  const [hoveredActivityIndex, setHoveredActivityIndex] = useState<number | null>(null)
  const [hoveredDepthPlatform, setHoveredDepthPlatform] = useState<Platform | null>(null)

  // 1. DATA COMPUTATION FOR METRICS
  const totalIdeas = items.length
  const totalPieces = useMemo(() => items.reduce((sum, item) => sum + item.pieces.length, 0), [items])

  const activePlatformsCount = useMemo(() => {
    const activeSet = new Set<Platform>()
    items.forEach((item) => {
      item.pieces.forEach((piece) => activeSet.add(piece.platform))
    })
    return activeSet.size
  }, [items])

  const scheduledCount = useMemo(() => items.filter((item) => item.scheduledFor).length, [items])

  const nextScheduledItem = useMemo(() => {
    const scheduled = items.filter((item) => item.scheduledFor)
    if (scheduled.length === 0) return null
    return scheduled.sort((a, b) => (a.scheduledFor ?? '').localeCompare(b.scheduledFor ?? ''))[0]
  }, [items])

  // 2. DONUT CHART (PLATFORM BREAKDOWN)
  const donutData = useMemo(() => {
    const counts: Record<string, number> = {}
    items.forEach((item) => {
      item.pieces.forEach((piece) => {
        counts[piece.platform] = (counts[piece.platform] || 0) + 1
      })
    })

    const dataList = PLATFORMS.map((p) => {
      const count = counts[p.id] || 0
      const color = BRAND_COLORS[p.id] || DEFAULT_COLOR
      return {
        id: p.id,
        label: p.label,
        count,
        color
      }
    })

    // Only include platforms that actually have posts generated, unless total is 0
    const filtered = dataList.filter((d) => d.count > 0)
    return filtered
  }, [items])

  // Calculations for Donut circles
  const donutCircumference = 201.06 // 2 * pi * r (r=32)
  const donutSlices = useMemo(() => {
    if (totalPieces === 0) return []
    let accumulatedLength = 0
    return donutData.map((d) => {
      const percentage = d.count / totalPieces
      const length = percentage * donutCircumference
      const offset = -accumulatedLength
      accumulatedLength += length
      return {
        ...d,
        length,
        offset,
        percentage
      }
    })
  }, [donutData, totalPieces])

  const hoveredSliceInfo = useMemo(() => {
    if (!hoveredDonutSlice) return null
    return donutSlices.find((s) => s.id === hoveredDonutSlice) || null
  }, [hoveredDonutSlice, donutSlices])

  // 3. ACTIVITY TIMELINE (BAR CHART OVER LAST 7 DAYS)
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const last7DaysData = useMemo(() => {
    const days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      d.setHours(0, 0, 0, 0)
      days.push(d)
    }

    return days.map((d) => {
      const dateStr = getLocalDateString(d)
      const createdCount = items.filter((item) => {
        const itemDate = new Date(item.createdAt)
        return getLocalDateString(itemDate) === dateStr
      }).length

      const scheduledCount = items.filter((item) => item.scheduledFor === dateStr).length

      return {
        dateStr,
        dayLabel: d.toLocaleDateString(undefined, { weekday: 'short' }), // e.g. "Mon"
        dateLabel: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), // e.g. "Aug 18"
        created: createdCount,
        scheduled: scheduledCount
      }
    })
  }, [items])

  const maxActivityValue = useMemo(() => {
    const maxVal = Math.max(...last7DaysData.map((d) => Math.max(d.created, d.scheduled)), 0)
    // Round to next multiple of 4, minimum of 4
    return Math.max(4, maxVal + ((4 - (maxVal % 4)) % 4))
  }, [last7DaysData])

  // 4. CONTENT DEPTH STATS (HORIZONTAL BARS)
  const depthStats = useMemo(() => {
    const stats: Record<string, { totalWords: number; totalChars: number; count: number }> = {}
    PLATFORMS.forEach((p) => {
      stats[p.id] = { totalWords: 0, totalChars: 0, count: 0 }
    })

    items.forEach((item) => {
      item.pieces.forEach((piece) => {
        const p = piece.platform
        if (!stats[p]) {
          stats[p] = { totalWords: 0, totalChars: 0, count: 0 }
        }
        const words = piece.content.split(/\s+/).filter(Boolean).length
        const chars = piece.content.length
        stats[p].totalWords += words
        stats[p].totalChars += chars
        stats[p].count += 1
      })
    })

    const list = PLATFORMS.map((p) => {
      const s = stats[p.id]
      const avgWords = s.count > 0 ? Math.round(s.totalWords / s.count) : 0
      const avgChars = s.count > 0 ? Math.round(s.totalChars / s.count) : 0
      return {
        id: p.id,
        label: p.label,
        avgWords,
        avgChars,
        count: s.count,
        color: BRAND_COLORS[p.id] || DEFAULT_COLOR
      }
    })

    // Filter out platforms with 0 count, or just sort all supported by word count
    return list.sort((a, b) => b.avgWords - a.avgWords)
  }, [items])

  const maxWords = useMemo(() => {
    const maxVal = Math.max(...depthStats.map((d) => d.avgWords), 0)
    return Math.max(100, maxVal)
  }, [depthStats])

  return (
    <div className="space-y-6">
      {/* ================= STATS SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Metric 1 */}
        <Card className="flex flex-col justify-between p-4 transition-all duration-300 hover:border-white/12">
          <div>
            <span className="flex items-center gap-1.5 text-xs text-mist-400">
              <Lightbulb size={13} className="text-signal-purple" /> Ideas created
            </span>
            <p className="mt-2 font-display text-2xl font-semibold text-mist-100">{totalIdeas}</p>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-signal-purple transition-all duration-500"
              style={{ width: `${Math.min(100, totalIdeas * 10)}%` }}
            />
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="flex flex-col justify-between p-4 transition-all duration-300 hover:border-white/12">
          <div>
            <span className="flex items-center gap-1.5 text-xs text-mist-400">
              <Layers size={13} className="text-signal-purple" /> Pieces generated
            </span>
            <p className="mt-2 font-display text-2xl font-semibold text-mist-100">{totalPieces}</p>
          </div>
          <div className="mt-3 flex gap-0.5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-sm transition-all duration-500 ${
                  idx < Math.ceil(totalPieces / 3) ? 'bg-signal-purple' : 'bg-white/5'
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="flex flex-col justify-between p-4 transition-all duration-300 hover:border-white/12">
          <div className="flex items-start justify-between">
            <div>
              <span className="flex items-center gap-1.5 text-xs text-mist-400">
                <CheckCircle2 size={13} className="text-emerald-400" /> Channels active
              </span>
              <p className="mt-2 font-display text-xl font-semibold text-mist-100">
                {activePlatformsCount} <span className="text-xs font-normal text-mist-400">/ {PLATFORMS.length}</span>
              </p>
            </div>
            <div className="relative mt-1 flex items-center justify-center">
              <svg className="h-9 w-9 -rotate-90">
                <circle cx="18" cy="18" r="14" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" fill="none" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray={87.96}
                  strokeDashoffset={87.96 - (activePlatformsCount / PLATFORMS.length) * 87.96}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-[11px] font-semibold text-emerald-400">
                {Math.round((activePlatformsCount / PLATFORMS.length) * 100)}%
              </span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-mist-400 truncate">
            {activePlatformsCount > 0 ? 'Good channel diversification' : 'No active channels yet'}
          </p>
        </Card>

        {/* Metric 4 */}
        <Card className="flex flex-col justify-between p-4 transition-all duration-300 hover:border-white/12">
          <div>
            <span className="flex items-center gap-1.5 text-xs text-mist-400">
              <Clock size={13} className="text-signal-purple" /> Scheduled queue
            </span>
            <p className="mt-2 font-display text-2xl font-semibold text-mist-100">{scheduledCount}</p>
          </div>
          <div className="mt-3 text-[11px] text-mist-400 truncate">
            {nextScheduledItem ? (
              <span>
                Next:{' '}
                <span className="text-signal-purple font-semibold">
                  {new Date(nextScheduledItem.scheduledFor + 'T00:00:00').toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </span>
            ) : (
              'No posts scheduled'
            )}
          </div>
        </Card>
      </div>

      {/* ================= MAIN INTERACTIVE CHARTS GRID ================= */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* CHART 1: DONUT CHART */}
        <Card className="relative flex flex-col justify-between border border-white/6 hover:border-white/10 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-mist-100">Format distribution</h3>
              <span title="Percentage breakdown of generated post types" className="cursor-help">
                <Info size={13} className="text-mist-400" />
              </span>
            </div>
            <p className="text-[11px] text-mist-400">Breakdown of generated content by platform format.</p>
          </div>

          <div className="my-6 flex items-center justify-center gap-4">
            {totalPieces === 0 ? (
              <div className="flex flex-col items-center justify-center py-6">
                <svg className="h-28 w-28 -rotate-90">
                  <circle cx="56" cy="56" r="32" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeDasharray="201.06" fill="none" />
                </svg>
                <p className="absolute text-center text-xs text-mist-400">No content</p>
              </div>
            ) : (
              <div className="relative flex h-28 w-28 items-center justify-center">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  {donutSlices.map((slice) => (
                    <circle
                      key={slice.id}
                      cx="50"
                      cy="50"
                      r="32"
                      stroke={slice.color.stroke}
                      strokeWidth={hoveredDonutSlice === slice.id ? 10 : 6}
                      strokeDasharray={donutCircumference}
                      strokeDashoffset={slice.offset}
                      fill="transparent"
                      className="cursor-pointer transition-all duration-300 ease-out hover:opacity-90"
                      style={{ transformOrigin: '50% 50%' }}
                      onMouseEnter={() => setHoveredDonutSlice(slice.id)}
                      onMouseLeave={() => setHoveredDonutSlice(null)}
                    />
                  ))}
                </svg>
                {/* Center text details */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  {hoveredSliceInfo ? (
                    <>
                      <PlatformIcon platform={hoveredSliceInfo.id} size={14} className="opacity-80" />
                      <span className="mt-0.5 text-xs font-semibold text-mist-100">{hoveredSliceInfo.count} posts</span>
                      <span className="text-[11px] font-medium text-mist-400">
                        {Math.round(hoveredSliceInfo.percentage * 100)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-display text-base font-bold text-mist-100">{totalPieces}</span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-mist-400">Pieces</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Custom Legend */}
            <div className="flex-1 space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {donutData.length === 0 ? (
                <p className="text-xs text-mist-400 italic">No formats created</p>
              ) : (
                donutSlices.map((slice) => (
                  <button
                    key={slice.id}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-xs transition-colors hover:bg-white/[0.04] ${
                      hoveredDonutSlice === slice.id ? 'bg-white/[0.04] text-mist-100' : 'text-mist-300'
                    }`}
                    onMouseEnter={() => setHoveredDonutSlice(slice.id)}
                    onMouseLeave={() => setHoveredDonutSlice(null)}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: slice.color.stroke }} />
                      <span className="truncate">{slice.label}</span>
                    </div>
                    <span className="font-mono font-medium text-[11px] ml-2 text-mist-400">
                      {slice.count} ({Math.round(slice.percentage * 100)}%)
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* CHART 2: ACTIVITY TIMELINE */}
        <Card className="relative flex flex-col justify-between border border-white/6 hover:border-white/10 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-mist-100">Activity timeline</h3>
              <span title="Posts created and scheduled over the last 7 days" className="cursor-help">
                <Info size={13} className="text-mist-400" />
              </span>
            </div>
            <p className="text-[11px] text-mist-400">Created vs. scheduled activity over the last 7 days.</p>
          </div>

          <div className="relative my-4 flex h-32 w-full flex-col justify-end">
            {/* SVG Content */}
            <svg viewBox="0 0 320 120" className="h-full w-full" style={{ overflow: 'visible' }}>
              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => (
                <line
                  key={idx}
                  x1="25"
                  y1={15 + (1.0 - r) * 80}
                  x2="310"
                  y2={15 + (1.0 - r) * 80}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              ))}

              {/* Y Axis Tick Labels */}
              <text x="18" y="20" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end">
                {maxActivityValue}
              </text>
              <text x="18" y="60" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end">
                {Math.round(maxActivityValue / 2)}
              </text>
              <text x="18" y="100" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end">
                0
              </text>

              {/* Bars */}
              {last7DaysData.map((d, idx) => {
                const step = 285 / 7
                const xCenter = 25 + idx * step + step / 2
                const createdHeight = (d.created / maxActivityValue) * 80
                const scheduledHeight = (d.scheduled / maxActivityValue) * 80

                const isHovered = hoveredActivityIndex === idx

                return (
                  <g key={idx}>
                    {/* Hover Column highlight */}
                    {isHovered && (
                      <rect
                        x={25 + idx * step + 2}
                        y="10"
                        width={step - 4}
                        height="90"
                        fill="rgba(255, 255, 255, 0.02)"
                        rx="4"
                      />
                    )}

                    {/* Bar 1: Created */}
                    <rect
                      x={xCenter - 7}
                      y={95 - createdHeight}
                      width="5"
                      height={Math.max(1, createdHeight)}
                      fill="#8B5CF6"
                      rx="1"
                      className="transition-all duration-300"
                    />

                    {/* Bar 2: Scheduled */}
                    <rect
                      x={xCenter + 2}
                      y={95 - scheduledHeight}
                      width="5"
                      height={Math.max(1, scheduledHeight)}
                      fill="#F97316"
                      rx="1"
                      className="transition-all duration-300"
                    />

                    {/* Invisible hover trigger zone */}
                    <rect
                      x={25 + idx * step}
                      y="10"
                      width={step}
                      height="90"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredActivityIndex(idx)}
                      onMouseLeave={() => setHoveredActivityIndex(null)}
                    />

                    {/* X Axis Label */}
                    <text
                      x={xCenter}
                      y="110"
                      fill={isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'}
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight={isHovered ? 'semibold' : 'normal'}
                      className="transition-all duration-200"
                    >
                      {d.dayLabel}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Custom Caret Tooltip */}
            {hoveredActivityIndex !== null && (
              <div
                className="absolute z-10 bg-ink-900 border border-white/10 rounded-lg p-2 shadow-2xl pointer-events-none text-left"
                style={{
                  left: `${25 + hoveredActivityIndex * (285 / 7) + (285 / 7) / 2}px`,
                  bottom: '108px',
                  transform: 'translateX(-50%)',
                  minWidth: '100px'
                }}
              >
                <p className="text-[11px] font-bold text-mist-100">{last7DaysData[hoveredActivityIndex].dateLabel}</p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-mist-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
                  <span>Created: {last7DaysData[hoveredActivityIndex].created}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-mist-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                  <span>Scheduled: {last7DaysData[hoveredActivityIndex].scheduled}</span>
                </div>
                <div className="absolute left-1/2 bottom-[-4px] h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-white/10 bg-ink-900" />
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-[11px] text-mist-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" /> Created
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#F97316]" /> Scheduled
            </span>
          </div>
        </Card>

        {/* CHART 3: CONTENT DEPTH (WORD COUNT BREAKDOWN) */}
        <Card className="relative flex flex-col justify-between border border-white/6 hover:border-white/10 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-mist-100">Content density</h3>
              <span title="Average generated word count per platform format" className="cursor-help">
                <Info size={13} className="text-mist-400" />
              </span>
            </div>
            <p className="text-[11px] text-mist-400">Avg. words generated per platform layout.</p>
          </div>

          <div className="my-3 space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {depthStats.length === 0 ? (
              <p className="text-xs text-mist-400 italic py-6 text-center">No content stats available</p>
            ) : (
              depthStats.map((stat) => {
                const barPercent = Math.min(100, (stat.avgWords / maxWords) * 100)
                const isHovered = hoveredDepthPlatform === stat.id

                return (
                  <div
                    key={stat.id}
                    className={`relative rounded-xl p-1.5 transition-all duration-200 ${
                      isHovered ? 'bg-white/[0.04]' : 'bg-transparent'
                    }`}
                    onMouseEnter={() => setHoveredDepthPlatform(stat.id)}
                    onMouseLeave={() => setHoveredDepthPlatform(null)}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <PlatformIcon platform={stat.id} size={12} />
                        <span className="font-medium text-mist-300 truncate">{stat.label}</span>
                      </div>
                      <span className="font-mono text-[11px] text-mist-400 font-semibold shrink-0">
                        {stat.avgWords} words
                      </span>
                    </div>

                    <div className="relative h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${barPercent}%`,
                          backgroundColor: stat.color.stroke,
                          boxShadow: isHovered ? `0 0 8px ${stat.color.stroke}` : 'none'
                        }}
                      />
                    </div>

                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div
                        className="absolute z-10 bg-ink-900 border border-white/10 rounded-lg p-2 shadow-2xl pointer-events-none text-left"
                        style={{
                          right: '12px',
                          top: '-40px',
                          minWidth: '120px'
                        }}
                      >
                        <p className="text-[11px] font-bold text-mist-100">{stat.label}</p>
                        <p className="text-[11px] text-mist-300">Avg. words: {stat.avgWords}</p>
                        <p className="text-[11px] text-mist-300">Avg. chars: {stat.avgChars}</p>
                        <p className="text-[11px] text-mist-300">Total drafts: {stat.count}</p>
                        <div className="absolute right-6 bottom-[-4px] h-2 w-2 rotate-45 border-r border-b border-white/10 bg-ink-900" />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
