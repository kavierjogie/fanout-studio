import { useEffect, useRef, useState } from 'react'
import { Menu, Sparkles } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import CreateContent from './components/CreateContent'
import TransformContent from './components/TransformContent'
import PromptLibrary from './components/PromptLibrary'
import RecentContent from './components/RecentContent'
import ContentCalendar from './components/ContentCalendar'
import { ContentItem, PromptTemplate, View } from './types'
import { loadContent, saveContent } from './lib/storage'
import { deleteImages } from './lib/generator'

export type { View }

const VIEWS: View[] = ['dashboard', 'create', 'transform', 'library', 'recent', 'calendar']
const viewFromHash = (): View => {
  const hash = location.hash.slice(1) as View
  return VIEWS.includes(hash) ? hash : 'dashboard'
}
// The URL hash is the source of truth for the view, so Back, Forward and refresh work
const setView = (v: View) => {
  location.hash = v
}

export default function App() {
  const [view, setViewState] = useState<View>(viewFromHash)
  useEffect(() => {
    const onHashChange = () => setViewState(viewFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const [items, setItems] = useState<ContentItem[]>(() => loadContent())
  const [activeTransformItem, setActiveTransformItem] = useState<ContentItem | null>(null)
  const [prefillPrompt, setPrefillPrompt] = useState<PromptTemplate | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Every create/update/delete flows through `items`: diff it to remove Blob images nothing references anymore
  const prevItems = useRef(items)
  useEffect(() => {
    saveContent(items)
    const inUse = new Set(items.flatMap((i) => i.pieces.map((p) => p.imageUrl)))
    const orphaned = prevItems.current.flatMap((i) => i.pieces.map((p) => p.imageUrl)).filter((u): u is string => !!u && !inUse.has(u))
    if (orphaned.length) deleteImages([...new Set(orphaned)])
    prevItems.current = items
  }, [items])

  const handleSave = (item: ContentItem) => {
    setItems((cur) => [...cur, item])
  }

  const handleUpdate = (item: ContentItem) => {
    setItems((cur) => cur.map((i) => (i.id === item.id ? item : i)))
    setActiveTransformItem(item)
  }

  const handleDelete = (id: string) => {
    setItems((cur) => cur.filter((i) => i.id !== id))
  }

  const handleSchedule = (id: string, date: string) => {
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, scheduledFor: date } : i)))
  }

  const goToTransform = (item: ContentItem) => {
    setActiveTransformItem(item)
    setView('transform')
  }

  const usePrompt = (prompt: PromptTemplate) => {
    setPrefillPrompt(prompt)
    setView('create')
  }

  return (
    <div className="flex min-h-screen bg-ink-950 text-mist-100">
      <Sidebar view={view} setView={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/8 bg-ink-950/90 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-grad-hero">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-display text-sm font-semibold text-mist-100">Studio</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-mist-300" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          {view === 'dashboard' && <Dashboard items={items} setView={setView} />}
          {view === 'create' && (
            <CreateContent
              onSave={handleSave}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              prefillPrompt={prefillPrompt || undefined}
              onClearPrompt={() => setPrefillPrompt(null)}
              goToTransform={goToTransform}
            />
          )}
          {view === 'transform' && (
            <TransformContent items={items} activeItem={activeTransformItem} onUpdate={handleUpdate} />
          )}
          {view === 'library' && <PromptLibrary onUse={usePrompt} />}
          {view === 'recent' && (
            <RecentContent items={items} onDelete={handleDelete} onTransform={goToTransform} onUpdate={handleUpdate} />
          )}
          {view === 'calendar' && (
            <ContentCalendar items={items} onSchedule={handleSchedule} onUpdate={handleUpdate} />
          )}
        </main>
      </div>
    </div>
  )
}
