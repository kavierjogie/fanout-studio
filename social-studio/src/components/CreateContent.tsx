import { useState, useEffect, useRef } from 'react'
import { Sparkles, Copy, Check, ChevronDown, Repeat, BookOpen, Plus } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import PlatformIcon from './PlatformIcon'
import { PLATFORMS } from '../data/platforms'
import { PROMPTS } from '../data/prompts'
import { Platform, ContentItem, GeneratedPiece, PromptTemplate } from '../types'
import { transformContent } from '../lib/generator'
import { uid } from '../lib/storage'
import RefinePiece from './RefinePiece'
import EditablePostCard from './EditablePostCard'


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

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [addingPlatform, setAddingPlatform] = useState<Platform | null>(null)
  const [addDropdownOpen, setAddDropdownOpen] = useState(false)
  const addDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
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
    const label = PLATFORMS.find((p) => p.id === platform)?.label || platform
    const remaining = latest.pieces.filter((p) => p.platform !== platform)
    if (remaining.length === 0) {
      if (!window.confirm(`Delete this ${label} draft? It's the last one, so the whole post will be removed.`)) return
      resultRef.current = null
      setResult(null)
      setActiveTab(null)
      if (onDelete) onDelete(latest.id)
      return
    }
    if (!window.confirm(`Delete this ${label} draft? This can't be undone.`)) return
    commit({ ...latest, pieces: remaining })
    setActiveTab(remaining[0].platform)
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
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-purple">Create content</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-mist-50 sm:text-3xl">
          Turn one idea into platform-ready content
        </h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Describe what you want to create, choose where it's going, and generate every version at once.
        </p>
      </header>

      <Card className="space-y-7">
        {/* Prompt Template Selector */}
        <div>
          <label className="flex items-center gap-2 font-display text-sm font-semibold text-mist-100 mb-2.5">
            <BookOpen size={16} className="text-signal-purple" />
            Prompt Library template
          </label>
          <select
            value={selectedPrompt?.id ?? ''}
            onChange={(e) => {
              const p = PROMPTS.find((x) => x.id === e.target.value) || null
              setSelectedPrompt(p)
              if (!p && onClearPrompt) onClearPrompt()
            }}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-mist-50 focus:border-signal-purple/50"
          >
            <option value="" className="bg-ink-900">Custom idea (No template)</option>
            {PROMPTS.map((p) => (
              <option key={p.id} value={p.id} className="bg-ink-900">
                [{p.category}] {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Template metadata if selected */}
        {selectedPrompt && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2 animate-rise">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-signal-purple">{selectedPrompt.category}</span>
              <button
                onClick={() => {
                  setSelectedPrompt(null)
                  if (onClearPrompt) onClearPrompt()
                }}
                className="text-[11px] text-mist-400 hover:text-mist-100"
              >
                Clear template
              </button>
            </div>
            <h4 className="text-sm font-semibold text-mist-50">{selectedPrompt.name}</h4>
            <p className="text-xs text-mist-400 leading-relaxed">{selectedPrompt.description}</p>
            <div className="text-xs text-mist-300 bg-white/5 p-2 rounded-lg font-mono">
              <span className="text-signal-pink">Template: </span>
              {selectedPrompt.template.split('{topic}')[0]}
              <span className="text-signal-orange font-bold font-sans">{"{topic}"}</span>
              {selectedPrompt.template.split('{topic}')[1]}
            </div>
          </div>
        )}

        {/* Topic Input */}
        <div>
          <label className="flex items-center gap-2 font-display text-sm font-semibold text-mist-100">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grad-ai text-[11px] text-white">1</span>
            {selectedPrompt ? 'Fill in the topic ({topic}):' : "What's your topic or idea?"}
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={selectedPrompt ? "e.g. why companies must offer a 4-day work week" : "e.g. Why we switched to a 4-day work week"}
            rows={3}
            className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-mist-50 placeholder:text-mist-400/60 focus:border-signal-purple/50"
          />
          {selectedPrompt && (
            <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs text-mist-400">
              <p className="font-mono text-[9px] uppercase tracking-wider text-signal-purple">Compiled Prompt Preview</p>
              <p className="mt-1 italic">"{compiledPrompt}"</p>
            </div>
          )}
        </div>

        {/* Platforms */}
        <div>
          <label className="flex items-center gap-2 font-display text-sm font-semibold text-mist-100">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grad-social text-[11px] text-white">2</span>
            Which platforms?
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const active = selected.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
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
            className="flex items-center gap-1.5 text-xs font-medium text-mist-400 hover:text-mist-100"
          >
            Advanced settings
            <ChevronDown size={14} className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          </button>
          {advancedOpen && (
            <div className="mt-4 animate-rise rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <p className="mb-2.5 text-xs font-medium text-mist-300">Tone of voice</p>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      tone === t.id
                        ? 'border-signal-orange/40 bg-signal-orange/15 text-orange-200'
                        : 'border-white/10 text-mist-400 hover:text-mist-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 border-t border-white/8 pt-6">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grad-action text-[11px] text-white">3</span>
          <Button intent="ai" onClick={handleGenerate} disabled={!canGenerate}>
            <Sparkles size={15} />
            {generating ? 'Generating...' : 'Generate content'}
          </Button>
          {!canGenerate && !generating && (
            <span className="text-xs text-mist-400">Add a topic and at least one platform</span>
          )}
        </div>
      </Card>

      {/* Loading Overlay */}
      {generating && (
        <div className="mt-6 flex flex-col items-center justify-center p-12 card-surface rounded-2xl animate-rise relative overflow-hidden">
          <div className="absolute inset-0 bg-grad-panel opacity-50 blur-xl"></div>
          <div className="relative flex flex-col items-center z-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-signal-purple/30 border-t-signal-purple"></div>
            <p className="mt-4 font-display text-base font-semibold text-mist-50 animate-pulse">Crafting your content...</p>
            <p className="mt-1 text-xs text-mist-400">AI is writing platform-optimized pieces</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mt-6 border border-red-500/30 bg-red-500/10 rounded-2xl p-5 text-sm animate-rise flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-red-300 flex items-center gap-1.5">
              ❌ Content Generation Failed
            </h4>
            <button onClick={() => setError(null)} className="text-mist-400 hover:text-mist-100" aria-label="Dismiss error">
              ✕
            </button>
          </div>
          <p className="text-xs text-red-200 leading-relaxed font-mono whitespace-pre-wrap">{error}</p>
          <p className="text-xs text-mist-400">
            Please check your network connection and try again. If the problem persists, the AI service may be temporarily unavailable.
          </p>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="mt-8 animate-rise">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-mist-50">Ready to publish</h2>
            <Button intent="action" onClick={() => goToTransform(result)}>
              <Repeat size={14} />
              Transform into other formats
            </Button>
          </div>

          {/* Mobile dropdown selector */}
          <div className="flex gap-2 sm:hidden mb-6 w-full">
            <div className="relative flex-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all shadow-sm ${
                  activeTab ? `platform-active-${activeTab}` : 'border-white/10 bg-white/[0.03] text-mist-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {activeTab && <PlatformIcon platform={activeTab} size={15} />}
                  <span className="font-semibold">
                    {activeTab ? (PLATFORMS.find((p) => p.id === activeTab)?.label || activeTab) : 'Select Platform'}
                    {addingPlatform && activeTab === addingPlatform && ' (Generating...)'}
                  </span>
                </div>
                {addingPlatform && activeTab === addingPlatform ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 right-0 z-30 mt-2 rounded-xl border border-white/10 bg-ink-950 p-1.5 shadow-xl animate-rise">
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
                    <div className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-mist-500/50 bg-white/[0.01]">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-mist-500/20 border-t-mist-500 mr-2"></div>
                      <PlatformIcon platform={addingPlatform} size={14} />
                      <span className="ml-1">
                        Generating {PLATFORMS.find((p) => p.id === addingPlatform)?.label || addingPlatform}...
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {availablePlatforms.length > 0 && !addingPlatform && (
              <div className="relative" ref={addDropdownRef}>
                <button
                  type="button"
                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                  className="h-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 hover:border-white/40 px-4 text-sm font-semibold text-mist-400 hover:text-mist-200 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
                {addDropdownOpen && (
                  <div className="absolute right-0 mt-2 z-30 w-56 rounded-xl border border-white/10 bg-ink-950 p-1.5 shadow-xl animate-rise">
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
                )}
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
              <div className="relative" ref={addDropdownRef}>
                <button
                  type="button"
                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                  className="flex items-center gap-1 border border-dashed border-white/20 hover:border-white/40 rounded-lg px-3 py-1.5 text-xs font-medium text-mist-400 hover:text-mist-200 transition-colors"
                >
                  <Plus size={12} />
                  <span>Add Platform</span>
                </button>
                {addDropdownOpen && (
                  <div className="absolute left-0 mt-2 z-30 w-56 rounded-xl border border-white/10 bg-ink-950 p-1.5 shadow-xl animate-rise">
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
                )}
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
            <div className="mt-4 flex flex-col items-center justify-center p-12 card-surface rounded-2xl animate-rise relative overflow-hidden">
              <div className="absolute inset-0 bg-grad-panel opacity-50 blur-xl animate-pulse"></div>
              <div className="relative flex flex-col items-center z-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-purple/30 border-t-signal-purple"></div>
                <p className="mt-4 font-display text-sm font-semibold text-mist-50 animate-pulse">
                  Drafting {PLATFORMS.find((p) => p.id === addingPlatform)?.label || addingPlatform} version...
                </p>
                <p className="mt-1 text-xs text-mist-400">AI is rewriting the topic for this platform</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
