import { useState, useEffect, useRef } from 'react'
import { Sparkles, Copy, Check, ChevronDown, Repeat, Plus } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Collapse from './ui/Collapse'
import ErrorAlert from './ui/ErrorAlert'
import GeneratingState from './ui/GeneratingState'
import { toast } from './ui/Toast'
import PlatformIcon from './PlatformIcon'
import { PLATFORMS } from '../data/platforms'
import { Platform, ContentItem, GeneratedPiece, PromptTemplate } from '../types'
import { transformContent } from '../lib/generator'
import { uid } from '../lib/storage'
import RefinePiece from './RefinePiece'
import EditablePostCard from './EditablePostCard'
import TemplatePicker from './TemplatePicker'


const TONES = [
  { id: 'default', label: 'Natural' },
  { id: 'bold', label: 'Bold' },
  { id: 'playful', label: 'Playful' },
  { id: 'formal', label: 'Formal' }
]

export default function CreateContent({
  onSave,
  onUpdate,
  onDelete,
  prefillPrompt,
  onClearPrompt,
  goToTransform
}: {
  onSave: (item: ContentItem) => void
  onUpdate?: (item: ContentItem) => void
  onDelete?: (id: string) => void
  prefillPrompt?: PromptTemplate
  onClearPrompt?: () => void
  goToTransform: (item: ContentItem) => void
}) {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(prefillPrompt ?? null)
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('default')
  const [selected, setSelected] = useState<Platform[]>(['linkedin', 'instagram'])
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [result, setResult] = useState<ContentItem | null>(null)
  // Latest result for async callbacks, so a late image/refine/add can't resurrect a deleted draft
  const resultRef = useRef(result)
  resultRef.current = result
  const [activeTab, setActiveTab] = useState<Platform | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // New results render below the form, so bring them into view when they arrive
  const resultsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (result) resultsRef.current?.scrollIntoView({ block: 'start' })
  }, [result?.id])

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [addingPlatform, setAddingPlatform] = useState<Platform | null>(null)
  const [addDropdownOpen, setAddDropdownOpen] = useState(false)
  const addDropdownRef = useRef<HTMLDivElement>(null)
  const mobileAddDropdownRef = useRef<HTMLDivElement>(null) // the mobile and desktop "Add" menus are both mounted

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (![addDropdownRef, mobileAddDropdownRef].some((r) => r.current?.contains(event.target as Node))) {
        setAddDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Loading & Error States
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (prefillPrompt) {
      setSelectedPrompt(prefillPrompt)
      setTopic('') // reset input to fill the template variable
    }
  }, [prefillPrompt])

  const togglePlatform = (p: Platform) => {
    setSelected((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))
  }

  const canGenerate = topic.trim().length > 0 && selected.length > 0 && !generating

  const compiledPrompt = selectedPrompt
    ? selectedPrompt.template.replace('{topic}', topic.trim() || '[topic]')
    : topic.trim()

  const handleGenerate = async () => {
    if (!canGenerate) return
    setGenerating(true)
    setError(null)
    setResult(null)

    try {
      const finalPrompt = selectedPrompt
        ? selectedPrompt.template.replace('{topic}', topic.trim())
        : topic.trim()

      const pieces = await transformContent(finalPrompt, selected, tone)
      
      const item: ContentItem = {
        id: uid(),
        topic: finalPrompt,
        tone,
        createdAt: Date.now(),
        sourcePlatform: selected[0],
        pieces
      }
      
      setResult(item)
      setActiveTab(pieces[0]?.platform ?? null)
      onSave(item)
      toast(`${pieces.length} draft${pieces.length === 1 ? '' : 's'} ready`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during content generation.')
    } finally {
      setGenerating(false)
    }
  }

  const existingPlatforms = new Set(result?.pieces.map((p) => p.platform) ?? [])
  const availablePlatforms = PLATFORMS.filter((p) => !existingPlatforms.has(p.id))

  const handleAddPlatform = async (p: Platform) => {
    if (!result || addingPlatform) return
    setAddDropdownOpen(false)
    setAddingPlatform(p)
    setActiveTab(p)
    setError(null)

    try {
      const newPieces = await transformContent(result.topic, [p], result.tone, result.pieces)
      const latest = resultRef.current
      if (newPieces.length > 0 && latest?.id === result.id) {
        commit({ ...latest, pieces: [...latest.pieces, ...newPieces] })
        toast(`${PLATFORMS.find((x) => x.id === p)?.label ?? 'Draft'} added`)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during platform addition.')
      setActiveTab(result.pieces[0]?.platform ?? null)
    } finally {
      setAddingPlatform(null)
    }
  }

  const commit = (item: ContentItem) => {
    resultRef.current = item
    setResult(item)
    if (onUpdate) onUpdate(item)
  }

  const updatePiece = (platform: Platform, fields: Partial<GeneratedPiece>) => {
    const latest = resultRef.current
    if (!latest?.pieces.some((p) => p.platform === platform)) return // draft was deleted meanwhile
    commit({ ...latest, pieces: latest.pieces.map((p) => (p.platform === platform ? { ...p, ...fields } : p)) })
  }

  const handleDeletePiece = (platform: Platform) => {
    const latest = resultRef.current
    if (!latest) return
    const index = latest.pieces.findIndex((p) => p.platform === platform)
    const removed = latest.pieces[index]
    const remaining = latest.pieces.filter((p) => p.platform !== platform)
    // No confirm step: deletes are instant and undoable from the toast
    if (remaining.length === 0) {
      resultRef.current = null
      setResult(null)
      setActiveTab(null)
      if (onDelete) onDelete(latest.id)
      return
    }
    commit({ ...latest, pieces: remaining })
    setActiveTab(remaining[0].platform)
    toast('Draft deleted', {
      label: 'Undo',
      onClick: () => {
        const cur = resultRef.current
        if (!removed || cur?.id !== latest.id || cur.pieces.some((p) => p.platform === platform)) return
        commit({ ...cur, pieces: [...cur.pieces.slice(0, index), removed, ...cur.pieces.slice(index)] })
        setActiveTab(platform)
      }
    })
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

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-purple">Create content</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">
          Turn one idea into platform-ready content
        </h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Describe what you want to create, choose where it's going, and generate every version at once.
        </p>
      </header>

      <Card
        className="shadow-[0_24px_60px_-30px_rgba(139,92,246,0.35)] sm:!p-7"
        // Inline so it layers over card-surface's background shorthand
        style={{ backgroundImage: 'radial-gradient(120% 80% at 0% 0%, rgba(139,92,246,0.10) 0%, transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
      >
        {/* Locked while generating so the inputs always match the drafts being written */}
        <fieldset disabled={generating} className="min-w-0 space-y-8 transition-opacity disabled:opacity-60">
        <TemplatePicker
          selected={selectedPrompt}
          onSelect={(p) => {
            setSelectedPrompt(p)
            if (p) document.getElementById('topic')?.focus()
            else if (onClearPrompt) onClearPrompt()
          }}
        />

        {/* Topic Input */}
        <div>
          <label htmlFor="topic" className="flex items-center gap-2 font-display text-sm font-semibold text-mist-100">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-signal-purpleDeep text-[11px] text-white">1</span>
            {selectedPrompt ? 'What should this template be about?' : "What's your topic or idea?"}
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={selectedPrompt ? "e.g. why companies must offer a 4-day work week" : "e.g. Why we switched to a 4-day work week"}
            rows={3}
className="field mt-3 resize-none !py-3 leading-relaxed"
          />
          {selectedPrompt && (
            <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs text-mist-400">
              <p className="font-mono text-[11px] uppercase tracking-wider text-signal-purple">Compiled prompt preview</p>
              <p className="mt-1 italic">"{compiledPrompt}"</p>
            </div>
          )}
        </div>

        {/* Platforms */}
        <div>
          <p className="flex items-center gap-2 font-display text-sm font-semibold text-mist-100">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-signal-purpleDeep text-[11px] text-white">2</span>
            Which platforms?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const active = selected.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${
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
        </div>

        {/* Advanced Settings */}
        <div>
          <button
            onClick={() => setAdvancedOpen((v) => !v)}
            aria-expanded={advancedOpen}
            className="flex items-center gap-1.5 text-xs font-medium text-mist-400 hover:text-mist-100"
          >
            Advanced settings
            <ChevronDown size={14} className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          </button>
          <Collapse open={advancedOpen}>
            <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <p className="mb-2.5 text-xs font-medium text-mist-300">Tone of voice</p>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    aria-pressed={tone === t.id}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      tone === t.id
                        ? 'border-signal-purple/40 bg-signal-purple/15 text-violet-200'
                        : 'border-white/10 text-mist-400 hover:text-mist-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Collapse>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/8 pt-6">
          <Button intent="primary" onClick={handleGenerate} disabled={!canGenerate}>
            {generating ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Sparkles size={15} />
            )}
            {generating ? 'Generating' : selected.length > 1 ? `Generate ${selected.length} drafts` : 'Generate draft'}
          </Button>
          {!canGenerate && !generating && (
            <span className="text-xs text-mist-400">
              {topic.trim() ? 'Choose at least one platform' : 'Add a topic to get started'}
            </span>
          )}
        </div>
        </fieldset>
      </Card>

      {generating && (
        <GeneratingState
          title={`Writing ${selected.length} draft${selected.length === 1 ? '' : 's'}`}
          description="Tailoring your idea to each platform. This usually takes a few seconds."
        />
      )}

      {/* Error Alert */}
      {error && <ErrorAlert title="Couldn't generate your content" message={error} onDismiss={() => setError(null)} />}

      {/* Results View */}
      {result && (
        <div ref={resultsRef} className="mt-8 scroll-mt-20 animate-rise lg:scroll-mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-mist-100">Your drafts</h2>
              <p className="mt-0.5 text-xs text-mist-400">Saved automatically. Edit, refine, or copy each one.</p>
            </div>
            <Button intent="ghost" onClick={() => goToTransform(result)}>
              <Repeat size={14} />
              Transform into other formats
            </Button>
          </div>

          {/* Mobile dropdown selector */}
          <div className="flex gap-2 sm:hidden mb-6 w-full">
            <div className="relative flex-1" ref={dropdownRef} onKeyDown={(e) => e.key === 'Escape' && setDropdownOpen(false)}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                className={`w-full flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition shadow-sm ${
                  activeTab ? `platform-active-${activeTab}` : 'border-white/10 bg-white/[0.03] text-mist-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {activeTab && <PlatformIcon platform={activeTab} size={15} />}
                  <span className="font-semibold">
                    {activeTab ? (PLATFORMS.find((p) => p.id === activeTab)?.label || activeTab) : 'Select platform'}
                    {addingPlatform && activeTab === addingPlatform && ' (Generating...)'}
                  </span>
                </div>
                {addingPlatform && activeTab === addingPlatform ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

                <div data-open={dropdownOpen} className="popover absolute left-0 right-0 z-30 origin-top mt-2 rounded-xl border border-white/10 bg-ink-950 p-1.5 shadow-xl">
                  {result.pieces.map((piece) => {
                    const isSelected = activeTab === piece.platform;
                    return (
                      <button
                        key={piece.platform}
                        type="button"
                        onClick={() => {
                          setActiveTab(piece.platform)
                          setDropdownOpen(false)
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                          isSelected
                            ? `platform-active-${piece.platform}`
                            : 'text-mist-400 hover:text-mist-100 hover:bg-white/5'
                        }`}
                      >
                        <PlatformIcon platform={piece.platform} size={14} />
                        <span>
                          {PLATFORMS.find((p) => p.id === piece.platform)?.label || piece.platform}
                        </span>
                      </button>
                    )
                  })}
                  {addingPlatform && (
                    <div className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-mist-400/50 bg-white/[0.01]">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-mist-400/20 border-t-mist-400 mr-2"></div>
                      <PlatformIcon platform={addingPlatform} size={14} />
                      <span className="ml-1">
                        Generating {PLATFORMS.find((p) => p.id === addingPlatform)?.label || addingPlatform}...
                      </span>
                    </div>
                  )}
                </div>
            </div>

            {availablePlatforms.length > 0 && !addingPlatform && (
              <div className="relative" ref={mobileAddDropdownRef} onKeyDown={(e) => e.key === 'Escape' && setAddDropdownOpen(false)}>
                <button
                  type="button"
                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                  aria-expanded={addDropdownOpen}
                  className="h-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 hover:border-white/40 px-4 text-sm font-semibold text-mist-400 hover:text-mist-300 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
                  <div data-open={addDropdownOpen} className="popover absolute right-0 mt-2 origin-top-right z-30 w-56 rounded-xl border border-white/10 bg-ink-950 p-1.5 shadow-xl">
                    {availablePlatforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleAddPlatform(p.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-mist-400 hover:text-mist-100 hover:bg-white/5 transition-colors"
                      >
                        <PlatformIcon platform={p.id} size={14} />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
              </div>
            )}
          </div>

          {/* Desktop tabs selector */}
          <div className="hidden sm:flex flex-wrap gap-2 border-b border-white/8 pb-3 items-center">
            {result.pieces.map((piece) => (
              <button
                key={piece.platform}
                onClick={() => setActiveTab(piece.platform)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === piece.platform
                    ? `platform-active-${piece.platform}`
                    : 'text-mist-400 hover:text-mist-100'
                }`}
              >
                <PlatformIcon platform={piece.platform} size={13} />
                {PLATFORMS.find((p) => p.id === piece.platform)?.label || piece.platform}
              </button>
            ))}

            {addingPlatform && (
              <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.01] px-3 py-1.5 text-xs font-medium text-mist-400/70 animate-pulse">
                <div className="h-3 w-3 animate-spin rounded-full border border-mist-400/30 border-t-mist-400"></div>
                <PlatformIcon platform={addingPlatform} size={13} />
                <span>Generating {PLATFORMS.find((p) => p.id === addingPlatform)?.label || addingPlatform}...</span>
              </div>
            )}

            {availablePlatforms.length > 0 && !addingPlatform && (
              <div className="relative" ref={addDropdownRef} onKeyDown={(e) => e.key === 'Escape' && setAddDropdownOpen(false)}>
                <button
                  type="button"
                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                  aria-expanded={addDropdownOpen}
                  className="flex items-center gap-1 border border-dashed border-white/20 hover:border-white/40 rounded-lg px-3 py-1.5 text-xs font-medium text-mist-400 hover:text-mist-300 transition-colors"
                >
                  <Plus size={12} />
                  <span>Add platform</span>
                </button>
                  <div data-open={addDropdownOpen} className="popover absolute left-0 mt-2 origin-top-left z-30 w-56 rounded-xl border border-white/10 bg-ink-950 p-1.5 shadow-xl">
                    {availablePlatforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleAddPlatform(p.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-mist-400 hover:text-mist-100 hover:bg-white/5 transition-colors"
                      >
                        <PlatformIcon platform={p.id} size={14} />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
              </div>
            )}
          </div>

          {result.pieces
            .filter((piece) => piece.platform === activeTab)
            .map((piece) => (
              <EditablePostCard
                key={piece.platform}
                topic={result.topic}
                platform={piece.platform}
                tone={result.tone}
                content={piece.content}
                imageUrl={piece.imageUrl}
                imagePrompt={piece.imagePrompt}
                imageGenerating={piece.imageGenerating}
                imageError={piece.imageError}
                existingPieces={result.pieces}
                showHeaderLabel={false}
                onUpdate={(newContent) => updatePiece(piece.platform, { content: newContent })}
                onUpdateImage={(newFields) => updatePiece(piece.platform, newFields)}
                onDelete={addingPlatform ? undefined : () => handleDeletePiece(piece.platform)}
              />
            ))}

          {addingPlatform && activeTab === addingPlatform && (
            <GeneratingState
              title={`Drafting ${PLATFORMS.find((p) => p.id === addingPlatform)?.label || addingPlatform}`}
              description="Adapting your idea for this platform."
            />
          )}
        </div>
      )}
    </div>
  )
}
