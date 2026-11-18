import { useRef, useState } from 'react'
import { RotateCcw, Type, X } from 'lucide-react'

// Optional reading preferences. Off by default; each one is a data attribute on <html> read by src/index.css.
export interface ReadingPrefs {
  font: 'default' | 'Arial' | 'Verdana' | 'Atkinson Hyperlegible'
  size: number // percent of the browser's own text size
  line: 'default' | 'comfortable' | 'spacious'
  letter: boolean
  word: boolean
  narrow: boolean
  para: boolean
  surface: 'theme' | 'dim' | 'warm'
  motion: boolean // true = reduce motion (on top of the system setting, which is always respected)
}

const DEFAULTS: ReadingPrefs = { font: 'default', size: 100, line: 'default', letter: false, word: false, narrow: false, para: false, surface: 'theme', motion: false }
const KEY = 'fanout.reading.v1'
const LINE = { comfortable: '1.7', spacious: '1.9' }

const load = (): ReadingPrefs => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return DEFAULTS
  }
}

const apply = (p: ReadingPrefs) => {
  const root = document.documentElement
  const set = (name: string, on: boolean, value = '') => (on ? root.setAttribute(`data-rp-${name}`, value) : root.removeAttribute(`data-rp-${name}`))
  set('font', p.font !== 'default')
  root.style.setProperty('--rp-font', `"${p.font}", system-ui, sans-serif`)
  set('size', p.size !== 100)
  root.style.setProperty('--rp-size', `${p.size}%`)
  set('line', p.line !== 'default')
  root.style.setProperty('--rp-line', p.line === 'default' ? '' : LINE[p.line])
  set('letter', p.letter)
  set('word', p.word)
  set('width', p.narrow)
  set('para', p.para)
  set('surface', p.surface !== 'theme', p.surface)
  set('motion', p.motion)
}

// Apply saved preferences before the first paint so the app never flashes the defaults
apply(load())

function Choice<T extends string>({ legend, name, value, options, onChange }: { legend: string; name: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <fieldset className="mt-4">
      <legend className="mb-1.5 text-sm font-semibold text-mist-100">{legend}</legend>
      <div className="flex flex-col gap-1">
        {options.map(([v, label]) => (
          <label key={v} className="flex min-h-[32px] cursor-pointer items-center gap-2.5 text-sm text-mist-300">
            <input type="radio" name={name} checked={value === v} onChange={() => onChange(v)} className="h-4 w-4 accent-accent" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm text-mist-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-accent" />
      <span>
        {label}
        {hint && <span className="block text-xs text-mist-400">{hint}</span>}
      </span>
    </label>
  )
}

export default function ReadingPreferences() {
  const [prefs, setPrefs] = useState(load)
  const dialog = useRef<HTMLDialogElement>(null)
  const update = (patch: Partial<ReadingPrefs>) => {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    apply(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable: preferences last for this visit only */
    }
  }
  const isDefault = JSON.stringify(prefs) === JSON.stringify(DEFAULTS)

  return (
    <>
      <button
        onClick={() => dialog.current?.showModal()}
        className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-mist-300 hover:bg-white/[0.03] hover:text-mist-100"
      >
        <Type size={15} aria-hidden="true" />
        Reading preferences
        {!isDefault && <span className="ml-auto text-xs text-mist-400">On</span>}
      </button>

      {/* Native modal dialog: focus moves in, Esc closes, focus returns to the button */}
      <dialog ref={dialog} className="rp-dialog" aria-labelledby="rp-title" onClick={(e) => e.target === dialog.current && dialog.current.close()}>
        <div className="flex h-full flex-col overflow-y-auto px-5 py-5">
          <div className="flex items-center justify-between">
            <h2 id="rp-title" className="font-display text-2xl text-mist-100">Reading preferences</h2>
            <button onClick={() => dialog.current?.close()} className="-mr-2 rounded-lg p-2 text-mist-300 hover:bg-white/5 hover:text-mist-100" aria-label="Close reading preferences">
              <X size={18} />
            </button>
          </div>
          <p className="mt-1 text-sm text-mist-400">Optional. Changes show straight away and are saved in this browser.</p>

          <Choice legend="Reading font" name="rp-font" value={prefs.font} onChange={(font) => update({ font })} options={[['default', 'Fanout default (Barlow)'], ['Arial', 'Arial'], ['Verdana', 'Verdana'], ['Atkinson Hyperlegible', 'Atkinson Hyperlegible']]} />

          <label htmlFor="rp-size" className="mt-4 block text-sm font-semibold text-mist-100">Text size: {prefs.size}%</label>
          <input id="rp-size" type="range" min={90} max={150} step={10} value={prefs.size} onChange={(e) => update({ size: +e.target.value })} className="mt-2 w-full accent-accent" />

          <Choice legend="Line spacing" name="rp-line" value={prefs.line} onChange={(line) => update({ line })} options={[['default', 'Default'], ['comfortable', 'Comfortable'], ['spacious', 'Spacious']]} />

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-mist-100">Spacing and layout</legend>
            <Toggle label="Slightly wider letter spacing" checked={prefs.letter} onChange={(letter) => update({ letter })} />
            <Toggle label="Wider word spacing" checked={prefs.word} onChange={(word) => update({ word })} />
            <Toggle label="Narrower reading width" hint="Shorter lines in drafts and descriptions" checked={prefs.narrow} onChange={(narrow) => update({ narrow })} />
            <Toggle label="More space between paragraphs" checked={prefs.para} onChange={(para) => update({ para })} />
          </fieldset>

          <Choice legend="Background" name="rp-surface" value={prefs.surface} onChange={(surface) => update({ surface })} options={[['theme', 'Fanout graphite'], ['dim', 'Dimmer, less glare'], ['warm', 'Warm grey']]} />

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-mist-100">Motion</legend>
            <Toggle label="Reduce motion" hint="Your device's reduced-motion setting is always followed too" checked={prefs.motion} onChange={(motion) => update({ motion })} />
          </fieldset>

          <button
            onClick={() => update(DEFAULTS)}
            disabled={isDefault}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-ink-600 px-4 py-2.5 text-sm font-medium text-mist-100 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw size={14} aria-hidden="true" /> Reset to default
          </button>
        </div>
      </dialog>
    </>
  )
}
