import { useState, useMemo, useEffect } from 'react'
import { ChevronDown, Repeat, Search, X, Clock, Sparkles } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import PlatformIcon from './PlatformIcon'
import { PLATFORMS } from '../data/platforms'
import { ContentItem, Platform } from '../types'
import EditablePostCard from './EditablePostCard'
import Collapse from './ui/Collapse'
import DeleteButton from './ui/DeleteButton'
import EmptyState from './ui/EmptyState'

export default function RecentContent({
  items,
  focusItemId,
  onDelete,
  onTransform,
  onUpdate,
  onCreate
}: {
  items: ContentItem[]
  focusItemId?: string | null
  onDelete: (id: string) => void
  onTransform: (item: ContentItem) => void
  onUpdate: (item: ContentItem) => void
  onCreate: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [limit, setLimit] = useState(8)
  // Arriving from the dashboard opens the chosen item straight away
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(focusItemId ? { [focusItemId]: true } : {})
  useEffect(() => {
    if (focusItemId) document.getElementById(`item-${focusItemId}`)?.scrollIntoView({ block: 'start' })
  }, [focusItemId])

  // Toggle platform selection
  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
    setLimit(8) // Reset limit on filter change
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedPlatforms([])
    setLimit(8)
  }

  // Filter items based on search query and platform tags
  const filteredItems = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter(item => {
        // Search query filter (case-insensitive on topic)
        const matchesSearch = searchQuery
          ? item.topic.toLowerCase().includes(searchQuery.toLowerCase())
          : true

        // Platform filter: must contain at least one of the selected platforms in pieces
        const matchesPlatform = selectedPlatforms.length > 0
          ? item.pieces.some(piece => selectedPlatforms.includes(piece.platform))
          : true

        return matchesSearch && matchesPlatform
      })
  }, [items, searchQuery, selectedPlatforms])

  // Get current visible items based on limit
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, limit)
  }, [filteredItems, limit])

  // Group items by date buckets
  const groupedItems = useMemo(() => {
    const groups: Record<string, ContentItem[]> = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Older': []
    }

    const today = new Date()
    const dToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const oneDay = 24 * 60 * 60 * 1000

    visibleItems.forEach(item => {
      const date = new Date(item.createdAt)
      const dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
      const diffDays = Math.round((dToday - dDate) / oneDay)

      if (diffDays <= 0) {
        groups['Today'].push(item)
      } else if (diffDays === 1) {
        groups['Yesterday'].push(item)
      } else if (diffDays < 7) {
        groups['This Week'].push(item)
      } else {
        groups['Older'].push(item)
      }
    })

    // Filter out empty groups but keep ordering: Today -> Yesterday -> This Week -> Older
    return Object.entries(groups).filter(([_, itemsInGroup]) => itemsInGroup.length > 0)
  }, [visibleItems])

  // Toggle single item expanded state
  const toggleItemOpen = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Expand all currently visible items
  const expandAll = () => {
    const nextOpen: Record<string, boolean> = {}
    visibleItems.forEach(item => {
      nextOpen[item.id] = true
    })
    setOpenIds(nextOpen)
  }

  // Collapse all items
  const collapseAll = () => {
    setOpenIds({})
  }

  const hasActiveFilters = searchQuery !== '' || selectedPlatforms.length > 0

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-purple">Recent content</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">Everything you've made</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Revisit past ideas, copy content again, or transform them into a format you haven't tried yet.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Nothing here yet"
          description="Everything you generate is saved here automatically, ready to edit, copy or transform."
        >
          <Button intent="primary" onClick={onCreate}>
            <Sparkles size={15} />
            Create content
          </Button>
        </EmptyState>
      ) : (
      <>
      <Card className="mb-6 space-y-4 !p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-400" />
            <input
              type="text"
              placeholder="Search by topic..."
              aria-label="Search by topic"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setLimit(8) // Reset pagination on search
              }}
              className="field !pl-10 !pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-mist-400 hover:bg-white/10 hover:text-mist-100"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Expand/Collapse Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={expandAll}
              disabled={visibleItems.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-medium text-mist-300 transition hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              disabled={visibleItems.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-medium text-mist-300 transition hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Platform filter tags */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
          <span className="mr-1 text-xs text-mist-400">Filter</span>

          {PLATFORMS.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id)
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                aria-pressed={isSelected}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition duration-150 ${
                  isSelected
                    ? `platform-active-${platform.id}`
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/10 text-mist-300'
                }`}
              >
                <PlatformIcon platform={platform.id} size={12} />
                {platform.shortLabel}
              </button>
            )
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs font-medium text-signal-purple hover:text-violet-300"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matches"
          description="Nothing matches your search and filters. Try a different topic or clear the filters."
        >
          <Button intent="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-8">
          {/* Render by Groups */}
          {groupedItems.map(([groupName, groupItems]) => (
            <div key={groupName} className="space-y-3">
              <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist-400">
                {groupName}
                <span className="rounded-full bg-white/8 px-1.5 py-0.5 font-mono text-[11px] font-medium text-mist-300">{groupItems.length}</span>
              </h2>
              
              <div className="space-y-3">
                {groupItems.map((item) => {
                  const open = !!openIds[item.id]
                  return (
                    <Card key={item.id} id={`item-${item.id}`} className="!p-0 overflow-hidden scroll-mt-20 lg:scroll-mt-6">
                      <button
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-white/[0.03] transition-colors duration-150 sm:px-5"
                        onClick={() => toggleItemOpen(item.id)}
                        aria-expanded={open}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-display text-sm font-medium text-mist-100">{item.topic}</p>
                          <p className="mt-1 text-xs text-mist-400">
                            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            {' · '}
                            {item.pieces.length} format{item.pieces.length === 1 ? '' : 's'}
                            {item.scheduledFor && ' · scheduled'}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <div className="hidden gap-1 sm:flex">
                            {item.pieces.slice(0, 4).map((p) => (
                              <span key={p.platform} className="rounded-md bg-white/5 p-1.5 text-mist-300">
                                <PlatformIcon platform={p.platform} size={12} />
                              </span>
                            ))}
                          </div>
                          <ChevronDown size={16} className={`text-mist-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      <Collapse open={open}>
                        <div className="border-t border-white/8 bg-black/20 px-3 pb-4 sm:px-5">
                          <div>
                            {item.pieces.map((p) => (
                              <EditablePostCard
                                key={p.platform}
                                platform={p.platform}
                                content={p.content}
                                imageUrl={p.imageUrl}
                                imagePrompt={p.imagePrompt}
                                imageGenerating={p.imageGenerating}
                                imageError={p.imageError}
                                topic={item.topic}
                                tone={item.tone}
                                existingPieces={item.pieces}
                                showHeaderLabel
                                onUpdate={(newContent) => {
                                  const updatedPieces = item.pieces.map((piece) =>
                                    piece.platform === p.platform ? { ...piece, content: newContent } : piece
                                  )
                                  const updatedItem = { ...item, pieces: updatedPieces }
                                  onUpdate(updatedItem)
                                }}
                                onUpdateImage={(newFields) => {
                                  const updatedPieces = item.pieces.map((piece) =>
                                    piece.platform === p.platform ? { ...piece, ...newFields } : piece
                                  )
                                  const updatedItem = { ...item, pieces: updatedPieces }
                                  onUpdate(updatedItem)
                                }}
                              />
                            ))}
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              onClick={() => onTransform(item)}
                              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-violet-300 hover:bg-signal-purple/10 transition-colors"
                            >
                              <Repeat size={13} />
                              Transform further
                            </button>
                            <DeleteButton label="Delete post" onDelete={() => onDelete(item.id)} />
                          </div>
                        </div>
                      </Collapse>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Paginated/Lazy Loading Button */}
          {filteredItems.length > limit && (
            <div className="pt-4 flex justify-center">
              <Button
                intent="ghost"
                onClick={() => setLimit(prev => prev + 8)}
                className="w-full max-w-xs border border-white/10 hover:border-signal-purple/30 hover:bg-signal-purple/5 transition text-mist-300"
              >
                Load more ({filteredItems.length - limit} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  )
}
