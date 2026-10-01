import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Logo from './components/Logo'
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

const IMAGE_CLEANUP_MS = 30_000

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
  const liveItems = useRef(items)
  useEffect(() => {
    saveContent(items)
    liveItems.current = items
    const imagesOf = (list: ContentItem[]) => list.flatMap((i) => i.pieces.map((p) => p.imageUrl))
    const inUse = new Set(imagesOf(items))
    const orphaned = [...new Set(imagesOf(prevItems.current))].filter((u): u is string => !!u && !inUse.has(u))
    // Deferred past the Undo window, then re-checked so an undone delete keeps its images.
    // ponytail: undo after IMAGE_CLEANUP_MS (toast hovered that long) restores a post whose images are gone
    if (orphaned.length) {
      setTimeout(() => {
        const live = new Set(imagesOf(liveItems.current))
        deleteImages(orphaned.filter((u) => !live.has(u)))
      }, IMAGE_CLEANUP_MS)
    }
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
    const index = items.findIndex((i) => i.id === id)
    const removed = items[index]
    if (!removed) return
    setItems((cur) => cur.filter((i) => i.id !== id))
    toast('Post deleted', {
      label: 'Undo',
      onClick: () => setItems((cur) => (cur.some((i) => i.id === id) ? cur : [...cur.slice(0, index), removed, ...cur.slice(index)]))
    })
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
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-ink-950/70 px-5 py-3 backdrop-blur-xl backdrop-saturate-150 lg:hidden">
          <Logo size={26} />
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
