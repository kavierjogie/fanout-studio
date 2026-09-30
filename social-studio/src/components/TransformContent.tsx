import { useEffect, useState, useRef } from 'react'
import { Repeat, Copy, Check, ChevronDown, Search } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import ErrorAlert from './ui/ErrorAlert'
import PlatformIcon from './PlatformIcon'
import { PLATFORMS } from '../data/platforms'
import { ContentItem, Platform } from '../types'
import { transformContent } from '../lib/generator'
import RefinePiece from './RefinePiece'
import EditablePostCard from './EditablePostCard'


export default function TransformContent({
  items,
  activeItem,
  onUpdate
}: {
  items: ContentItem[]
  activeItem: ContentItem | null
  onUpdate: (item: ContentItem) => void
}) {
  const [selectedId, setSelectedId] = useState<string>(activeItem?.id ?? items[0]?.id ?? '')
  const [targets, setTargets] = useState<Platform[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  
  // Custom dropdown states
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Loading & Error states
  const [transforming, setTransforming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!dropdownOpen) {
      setSearchQuery('')
    }
  }, [dropdownOpen])

  const filteredItems = items.filter((item) =>
    item.topic.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (activeItem) setSelectedId(activeItem.id)
  }, [activeItem])

  const current = items.find((i) => i.id === selectedId) ?? null
  const existingPlatforms = new Set(current?.pieces.map((p) => p.platform) ?? [])
  const available = PLATFORMS.filter((p) => !existingPlatforms.has(p.id))

  const toggle = (p: Platform) => {
    if (transforming) return
    setTargets((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))
  }

  const handleTransform = async () => {
    if (!current || targets.length === 0 || transforming) return
    setTransforming(true)
    setError(null)

    try {
      // Perform context-aware transformation by passing current.pieces
      const newPieces = await transformContent(current.topic, targets, current.tone, current.pieces)
      const updated: ContentItem = { ...current, pieces: [...current.pieces, ...newPieces] }
      onUpdate(updated)
      setTargets([])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during content transformation.')
    } finally {
      setTransforming(false)
    }
  }

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    } catch {
      // clipboard unavailable
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-pink">Transform content</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-mist-50">Nothing to transform yet</h1>
        <p className="mt-3 text-sm text-mist-400">
          Create a piece of content first, then come back here to turn it into more formats.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-pink">Transform content</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-mist-50 sm:text-3xl">
          One idea, more platforms
        </h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Pick a piece you've already created and generate the formats it's still missing.
        </p>
      </header>

      <Card className="space-y-6">
        <div>
          <p id="source-label" className="mb-2 text-sm font-semibold text-mist-100">Source content</p>
          <div className="relative" ref={dropdownRef} onKeyDown={(e) => e.key === 'Escape' && setDropdownOpen(false)}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={transforming}
              aria-expanded={dropdownOpen}
              aria-labelledby="source-label"
              className="flex items-center justify-between w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-mist-50 focus:outline-none focus:border-signal-pink/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="truncate">{current?.topic ?? 'Select source content'}</span>
              <ChevronDown className={`ml-2 h-4 w-4 shrink-0 transition-transform text-mist-400 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

              <div data-open={dropdownOpen} className="popover absolute z-50 w-full mt-2 bg-ink-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
                  <Search className="h-4 w-4 text-mist-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    aria-label="Search content"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-mist-50 outline-none placeholder:text-mist-500"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                  {filteredItems.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-mist-400 text-center">
                      No matching content found
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(item.id)
                          setDropdownOpen(false)
                        }}
                        className={`flex items-center justify-between w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.05] ${
                          item.id === selectedId ? 'bg-white/[0.05] text-mist-50 font-medium' : 'text-mist-200'
                        }`}
                      >
                        <span className="truncate mr-4" title={item.topic}>{item.topic}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.pieces.map((piece) => (
                            <span
                              key={piece.platform}
                              className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-white/[0.05]"
                              title={PLATFORMS.find((pl) => pl.id === piece.platform)?.label || piece.platform}
                            >
                              <PlatformIcon platform={piece.platform} size={10} />
                            </span>
                          ))}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
          </div>
        </div>

        {current && (
          <>
            <div className="flex flex-wrap gap-1.5">
              {current.pieces.map((p) => (
                <span key={p.platform} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-mist-400">
                  <PlatformIcon platform={p.platform} size={12} />
                  {PLATFORMS.find((pl) => pl.id === p.platform)?.label || p.platform}
                </span>
              ))}
            </div>

            {available.length > 0 ? (
              <div>
                <p className="mb-2 text-sm font-semibold text-mist-100">Transform into</p>
                <div className="flex flex-wrap gap-2">
                  {available.map((p) => {
                    const active = targets.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggle(p.id)}
                        aria-pressed={active}
                        disabled={transforming}
                        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          active
                            ? `platform-active-${p.id}`
                            : 'border-white/10 bg-white/[0.03] text-mist-400 hover:text-mist-100'
                        }`}
                      >
                        <PlatformIcon platform={p.id} size={14} />
                        {p.label}
                      </button>
                    )
                  })}
                </div>
                <Button intent="action" className="mt-4" onClick={handleTransform} disabled={targets.length === 0 || transforming}>
                  <Repeat size={14} />
                  {transforming ? 'Transforming...' : 'Transform'}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-mist-400">This piece already exists in every supported format.</p>
            )}
          </>
        )}
      </Card>

      {/* Loading Overlay */}
      {transforming && (
        <div className="mt-6 flex flex-col items-center justify-center p-12 card-surface rounded-2xl animate-rise relative overflow-hidden">
          <div className="absolute inset-0 bg-grad-panel opacity-50 blur-xl"></div>
          <div className="relative flex flex-col items-center z-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-signal-pink/30 border-t-signal-pink"></div>
            <p className="mt-4 font-display text-base font-semibold text-mist-50 animate-pulse">Transforming your content...</p>
            <p className="mt-1 text-xs text-mist-400">AI is rewriting the topic for new platforms</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && <ErrorAlert title="Couldn't transform your content" message={error} onDismiss={() => setError(null)} />}

      {current && (
        <div className="mt-8 space-y-4">
          {current.pieces.map((piece) => (
            <EditablePostCard
              key={piece.platform}
              topic={current.topic}
              platform={piece.platform}
              tone={current.tone}
              content={piece.content}
              imageUrl={piece.imageUrl}
              imagePrompt={piece.imagePrompt}
              imageGenerating={piece.imageGenerating}
              imageError={piece.imageError}
              existingPieces={current.pieces}
              showHeaderLabel={true}
              onUpdate={(newContent) => {
                const updatedPieces = current.pieces.map((p) =>
                  p.platform === piece.platform ? { ...p, content: newContent } : p
                )
                const updatedItem = { ...current, pieces: updatedPieces }
                onUpdate(updatedItem)
              }}
              onUpdateImage={(newFields) => {
                const updatedPieces = current.pieces.map((p) =>
                  p.platform === piece.platform ? { ...p, ...newFields } : p
                )
                const updatedItem = { ...current, pieces: updatedPieces }
                onUpdate(updatedItem)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
