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
import { Toaster, toast } from './components/ui/Toast'

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
  const [focusItemId, setFocusItemId] = useState<string | null>(null) // item to open when landing on Recent content

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
    toast('Post deleted')
  }

  const handleSchedule = (id: string, date: string) => {
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, scheduledFor: date } : i)))
    toast(date ? 'Added to calendar' : 'Removed from calendar')
  }

  const openItem = (id: string) => {
    setFocusItemId(id)
    setView('recent')
  }

  const goToCreate = () => setView('create')

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
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/8 bg-ink-950/90 px-5 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-grad-hero">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-display text-sm font-semibold text-mist-100">Studio</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="-mr-2 rounded-lg p-2 text-mist-300 hover:bg-white/5 hover:text-mist-100" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </header>

        {/* Keyed by view so each page fades in on navigation */}
        <main key={view} className="flex-1 animate-rise px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          {view === 'dashboard' && <Dashboard items={items} setView={setView} onOpenItem={openItem} />}
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
            <TransformContent items={items} activeItem={activeTransformItem} onUpdate={handleUpdate} onCreate={goToCreate} />
          )}
          {view === 'library' && <PromptLibrary onUse={usePrompt} />}
          {view === 'recent' && (
            <RecentContent
              items={items}
              focusItemId={focusItemId}
              onDelete={handleDelete}
              onTransform={goToTransform}
              onUpdate={handleUpdate}
              onCreate={goToCreate}
            />
          )}
          {view === 'calendar' && (
            <ContentCalendar items={items} onSchedule={handleSchedule} onUpdate={handleUpdate} onCreate={goToCreate} />
          )}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
