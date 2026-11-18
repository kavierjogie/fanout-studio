// Design Preview Studio — dev-only, isolated from production styling (imports nothing from src/ styles).
import React, { CSSProperties, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  LayoutGrid, PenLine, Repeat, BookMarked, Clock, CalendarDays, Copy, Wand2, CalendarPlus, Search,
  Linkedin, Instagram, Music2, Twitter, FileText, Megaphone, Hash, Code2, Menu, X, Trash2, Check, ExternalLink, Star, Type, RotateCcw
} from 'lucide-react'
import {
  BASELINE, CONCEPTS, Concept, DESIGN_LANGUAGE, EVIDENCE, Palette, PLATFORM_LIST, Rating, RECOMMENDED, REFS, RESEARCH, RUNNER_UP, TERRITORIES
} from './data'

const ALL = [BASELINE, ...CONCEPTS]
const byId = (id: string) => ALL.find((c) => c.id === id)!

// ---------- contrast (WCAG 2.2) ----------
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
// [label, fg key, bg key, minimum] — 4.5 for text, 3 for UI components
const PAIRS = [
  ['Body text / page', 'text', 'bg', 4.5],
  ['Body text / card', 'text', 'surface', 4.5],
  ['Secondary / card', 'text2', 'surface', 4.5],
  ['Meta text / page', 'text3', 'bg', 4.5],
  ['Meta text / card', 'text3', 'surface', 4.5],
  ['Button label / accent', 'onAccent', 'accent', 4.5],
  ['Accent (focus, UI) / page', 'accent', 'bg', 3],
  ['Accent text / card', 'accent', 'surface', 4.5]
] as const

// ---------- reading experience (preview only) ----------
interface RX {
  font: 'default' | 'Arial' | 'Verdana' | 'Atkinson Hyperlegible'
  size: number
  line: 'default' | 'comfortable' | 'spacious'
  letter: 'default' | 'wide'
  word: 'default' | 'wide'
  width: 'standard' | 'narrow'
  para: 'standard' | 'more'
  headings: 'default' | 'clear'
  surface: 'theme' | 'dim' | 'warm'
  motion: 'default' | 'reduce'
  sep: 'default' | 'clear'
}
const RX_DEFAULT: RX = { font: 'default', size: 100, line: 'default', letter: 'default', word: 'default', width: 'standard', para: 'standard', headings: 'default', surface: 'theme', motion: 'default', sep: 'default' }
const RX_KEY = 'fanout-studio-reading'
const loadRx = (): RX => {
  try { return { ...RX_DEFAULT, ...JSON.parse(localStorage.getItem(RX_KEY) || '{}') } } catch { return RX_DEFAULT }
}
const isDefault = (rx: RX) => JSON.stringify(rx) === JSON.stringify(RX_DEFAULT)

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [p(a), p(b)]
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
}
// Comfort surfaces: lift the darkest tones and soften pure white to cut glare/halation, keeping AA.
const surfacePalette = (p: Palette, s: RX['surface']): Palette => {
  if (s === 'dim') return { ...p, bg: mix(p.bg, '#2A2A2A', 0.5), surface: mix(p.surface, '#323232', 0.5), surface2: mix(p.surface2, '#3A3A3A', 0.5), text: mix(p.text, '#C8C8C8', 0.35), text2: mix(p.text2, '#BBBBBB', 0.2), text3: mix(p.text3, '#AFAFAF', 0.3) }
  if (s === 'warm') return { ...p, bg: '#23201B', surface: '#2B2722', surface2: '#35302A', line: '#4A443B', text: '#ECE4D6', text2: '#D2C8B7', text3: '#B0A592' }
  return p
}
const applyRx = (c: Concept, rx: RX | null): Concept => {
  if (!rx) return c
  const f = rx.font === 'default' ? null : rx.font
  return { ...c, palette: surfacePalette(c.palette, rx.surface), fonts: f ? { ...c.fonts, body: f, mono: f } : c.fonts }
}
const LH = { default: [1.5, 1.65], comfortable: [1.7, 1.8], spacious: [1.9, 2] }
const rxStyle = (rx: RX | null): CSSProperties =>
  rx
    ? ({
        '--zoom': rx.size / 100,
        '--lh': LH[rx.line][0],
        '--lh-read': LH[rx.line][1],
        '--ls': rx.letter === 'wide' ? '0.04em' : 'normal',
        '--ws': rx.word === 'wide' ? '0.16em' : 'normal',
        '--measure': rx.width === 'narrow' ? '56ch' : '68ch',
        '--page-w': rx.width === 'narrow' ? '720px' : '900px',
        '--pgap': rx.para === 'more' ? '1.5em' : '0.85em'
      }) as CSSProperties
    : {}

// ---------- theming ----------
const themeStyle = (c: Concept): CSSProperties =>
  ({
    '--bg': c.palette.bg,
    '--surface': c.palette.surface,
    '--surface2': c.palette.surface2,
    '--line': c.palette.line,
    '--text': c.palette.text,
    '--text2': c.palette.text2,
    '--text3': c.palette.text3,
    '--accent': c.palette.accent,
    '--on-accent': c.palette.onAccent,
    '--accent2': c.palette.accent2,
    '--f-display': `"${c.fonts.display}", serif`,
    '--f-body': `"${c.fonts.body}", system-ui, sans-serif`,
    '--f-mono': `"${c.fonts.mono}", ui-monospace, monospace`,
    '--d-weight': c.fonts.displayWeight,
    '--d-case': c.fonts.displayCase === 'upper' ? 'uppercase' : 'none',
    '--r': `${c.radius}px`,
    '--r-sm': `${Math.max(0, Math.round(c.radius * 0.6))}px`
  }) as CSSProperties

function LogoMark({ c, size = 26 }: { c: Concept; size?: number }) {
  const p = c.palette
  return (
    <svg width={size} height={size} viewBox="3.5 4.5 25 25" aria-hidden="true">
      <g transform="translate(0 1.5)" stroke={p.bg} strokeWidth="1.6">
        <rect x="10.5" y="6.5" width="11" height="15" rx={Math.min(2.75, c.radius / 3)} fill={p.accent2} transform="rotate(-22 16 27)" />
        <rect x="10.5" y="6.5" width="11" height="15" rx={Math.min(2.75, c.radius / 3)} fill={p.text2} transform="rotate(22 16 27)" />
        <rect x="10.5" y="6.5" width="11" height="15" rx={Math.min(2.75, c.radius / 3)} fill={p.accent} />
      </g>
      <path d="M13.5 18h5M13.5 20.5h3" stroke={p.onAccent} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const PICON: Record<string, typeof Linkedin> = {
  linkedin: Linkedin, instagram: Instagram, tiktok: Music2, x: Twitter, blog: FileText,
  promo: Megaphone, hashtags: Hash, calendar: CalendarDays, code: Code2
}
const pcolor = (id: string) => PLATFORM_LIST.find((p) => p.id === id)!.color
const PIcon = ({ id, size = 14 }: { id: string; size?: number }) => {
  const I = PICON[id]
  return <I size={size} style={{ color: pcolor(id) }} aria-hidden="true" />
}
const lane = (id: string) => ({ '--lane': pcolor(id) }) as CSSProperties

// ---------- the mock application ----------
type Screen = 'dashboard' | 'create' | 'recent' | 'calendar' | 'components'
const NAV: [Screen | 'transform' | 'library', string, typeof LayoutGrid][] = [
  ['dashboard', 'Dashboard', LayoutGrid],
  ['create', 'Create content', PenLine],
  ['transform', 'Transform content', Repeat],
  ['library', 'Prompt library', BookMarked],
  ['recent', 'Recent content', Clock],
  ['calendar', 'Content calendar', CalendarDays]
]

const DRAFT = [
  'We switched to a four-day work week six months ago.',
  'Output didn\'t drop. Meetings did, by 38%.',
  'The trick wasn\'t the extra day off. It was deciding, as a team, what we\'d stop doing to earn it.',
  'What would your team cut first?'
]

const RECENT = [
  { topic: 'Why we switched to a 4-day work week', p: ['linkedin', 'instagram', 'x', 'blog'], when: '2h ago', sched: true },
  { topic: 'Announce the launch of our spring menu', p: ['instagram', 'tiktok', 'promo'], when: 'Yesterday', sched: false },
  { topic: 'Myth vs. reality: remote onboarding', p: ['linkedin', 'hashtags'], when: 'Mon', sched: true }
]

function MockApp({ concept, rx, screen, setScreen }: { concept: Concept; rx: RX | null; screen: Screen; setScreen?: (s: Screen) => void }) {
  const [drawer, setDrawer] = useState(false)
  const c = applyRx(concept, rx)
  return (
    <div
      className="m"
      style={{ ...themeStyle(c), ...rxStyle(rx) }}
      data-card={c.card} data-nav={c.nav} data-pattern={rx?.sep === 'clear' ? 'none' : c.pattern} data-label={c.label}
      data-rx-font={rx && rx.font !== 'default' ? '' : undefined}
      data-rx-headings={rx?.headings === 'clear' ? '' : undefined}
      data-rx-motion={rx?.motion === 'reduce' ? '' : undefined}
      data-rx-sep={rx?.sep === 'clear' ? '' : undefined}
    >
      <div className="m-shell">
        <aside className={`m-side ${drawer ? 'open' : ''}`}>
          <div className="m-brand">
            <LogoMark c={c} size={28} />
            <div>
              <div className="m-word">Fanout</div>
              <div className="m-tag">One idea, fanned out</div>
            </div>
            <button className="m-icon-btn m-only-mobile" onClick={() => setDrawer(false)} aria-label="Close menu"><X size={16} /></button>
          </div>
          <nav className="m-nav" aria-label="Main">
            {NAV.map(([id, label, Icon], i) => (
              <button
                key={id}
                className="m-nav-item"
                aria-current={id === screen ? 'page' : undefined}
                onClick={() => { if (setScreen && id !== 'transform' && id !== 'library') setScreen(id as Screen); setDrawer(false) }}
              >
                <span className="m-nav-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="m-nav-ico"><Icon size={15} /></span>
                {label}
              </button>
            ))}
          </nav>
          <div className="m-side-foot"><span className="m-led" /> Saved in this browser<br /><span className="m-faint">Text by Groq · Images by FLUX.1</span></div>
        </aside>
        <div className="m-main">
          <header className="m-topbar">
            <div className="m-brand"><LogoMark c={c} size={24} /><div className="m-word">Fanout</div></div>
            <button className="m-icon-btn" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu size={18} /></button>
          </header>
          <div className="m-page" key={screen}>
            {screen === 'dashboard' && <Dashboard c={c} />}
            {screen === 'create' && <Create />}
            {screen === 'recent' && <Recent />}
            {screen === 'calendar' && <Calendar />}
            {screen === 'components' && <Components />}
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ c }: { c: Concept }) {
  return (
    <>
      <section className="m-hero">
        <div>
          <p className="m-label">Fanout</p>
          <h1 className="m-h1">Create once. <em>Publish everywhere.</em></h1>
          <p className="m-lede">Start with one idea and get a ready-to-post version for every platform. No separate tools, no starting over.</p>
          <div className="m-row">
            <button className="m-btn primary"><PenLine size={15} /> Create content</button>
            <button className="m-btn"><BookMarked size={15} /> Browse prompt library</button>
          </div>
        </div>
        <FanDiagram c={c} />
      </section>
      <div className="m-stats">
        {[['Ideas created', '4', '4 in the last 7 days'], ['Drafts generated', '11', '2.8 per idea on average'], ['Formats used', '7 of 9', '2 still to try'], ['Scheduled', '2', 'Next: Sat 21 Nov']].map(([l, v, s]) => (
          <div key={l} className="m-card m-stat">
            <p className="m-label">{l}</p>
            <p className="m-stat-v">{v}</p>
            <p className="m-meta">{s}</p>
          </div>
        ))}
      </div>
      <h2 className="m-h2">Pick up where you left off</h2>
      <div className="m-list">
        {RECENT.map((r) => (
          <button key={r.topic} className="m-card m-row-card" style={lane(r.p[0])}>
            <span>
              <span className="m-strong">{r.topic}</span>
              <span className="m-meta">{r.p.length} formats{r.sched ? ' · scheduled' : ''} · {r.when}</span>
            </span>
            <span className="m-glyphs">{r.p.map((p) => <span key={p} className="m-glyph"><PIcon id={p} size={12} /></span>)}</span>
          </button>
        ))}
      </div>
    </>
  )
}

function FanDiagram({ c }: { c: Concept }) {
  const outs = ['linkedin', 'instagram', 'tiktok', 'x']
  const byPlatform = c.card === 'lane'
  return (
    <svg className="m-fan" viewBox="0 0 300 200" role="img" aria-label="One idea fanned out to LinkedIn, Instagram, TikTok and X">
      {outs.map((p, i) => (
        <path key={p} className="m-fan-line" d={`M70 100 C150 100 150 ${35 + i * 43} 220 ${35 + i * 43}`} fill="none" stroke={byPlatform ? pcolor(p) : c.palette.accent} strokeWidth={byPlatform ? 3 : 1.5} strokeDasharray={byPlatform ? undefined : '4 4'} style={{ animationDelay: `${i * 80}ms` }} />
      ))}
      <circle cx="56" cy="100" r="30" fill={c.palette.surface2} stroke={c.palette.accent} strokeWidth="1.5" />
      <text x="56" y="104" textAnchor="middle" fill={c.palette.text} fontSize="10" style={{ fontFamily: 'var(--f-mono)' }}>Your idea</text>
      {outs.map((p, i) => (
        <g key={p} transform={`translate(222 ${35 + i * 43 - 12})`}>
          <rect width="24" height="24" rx={Math.min(12, c.radius)} fill={c.palette.surface2} stroke={c.palette.line} />
          <foreignObject x="5" y="5" width="14" height="14"><PIcon id={p} size={14} /></foreignObject>
          <text x="32" y="16" fill={c.palette.text2} fontSize="11" style={{ fontFamily: 'var(--f-body)' }}>{PLATFORM_LIST.find((x) => x.id === p)!.label.split(' ')[0]}</text>
        </g>
      ))}
    </svg>
  )
}

function Create() {
  const [sel, setSel] = useState(['linkedin', 'instagram', 'x'])
  const [tone, setTone] = useState('Natural')
  return (
    <>
      <p className="m-label">Create content</p>
      <h1 className="m-h1 sm">Turn one idea into platform-ready content</h1>
      <div className="m-card m-form">
        <div className="m-step"><span className="m-step-n">1</span><label className="m-strong" htmlFor="topic">What's your topic or idea?</label></div>
        <p className="m-hint" id="topic-hint">One sentence is enough. For example: "Launching our spring menu on Friday".</p>
        <textarea id="topic" aria-describedby="topic-hint" className="m-field" rows={2} defaultValue="Why we switched to a 4-day work week" />
        <div className="m-step"><span className="m-step-n">2</span><span className="m-strong">Which platforms?</span><span className="m-meta">{sel.length} selected</span></div>
        <div className="m-chips">
          {PLATFORM_LIST.map((p) => (
            <button key={p.id} className="m-chip" aria-pressed={sel.includes(p.id)} onClick={() => setSel((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]))}>
              <PIcon id={p.id} size={13} /> {p.label}
            </button>
          ))}
        </div>
        <div className="m-step"><span className="m-step-n">3</span><span className="m-strong">Tone</span></div>
        <div className="m-seg" role="radiogroup" aria-label="Tone">
          {['Natural', 'Bold', 'Playful', 'Formal'].map((t) => (
            <button key={t} role="radio" aria-checked={tone === t} className="m-seg-item" onClick={() => setTone(t)}>{t}</button>
          ))}
        </div>
        <div className="m-row end"><button className="m-btn primary"><PenLine size={15} /> Generate {sel.length} drafts</button></div>
      </div>
      <DraftCard />
    </>
  )
}

function DraftCard() {
  return (
    <article className="m-card m-draft" style={lane('linkedin')}>
      <div className="m-draft-head">
        <span className="m-glyph"><PIcon id="linkedin" size={14} /></span>
        <span><span className="m-strong">LinkedIn post</span><span className="m-meta">Natural tone · just now</span></span>
        <span className="m-badge">Draft</span>
      </div>
      <div className="m-draft-body">{DRAFT.map((p) => <p key={p}>{p}</p>)}</div>
      <div className="m-draft-foot">
        <span className="m-count"><span className="m-meter"><span style={{ width: '9%' }} /></span>262 of 3,000 characters</span>
        <span className="m-row">
          <button className="m-btn ghost sm"><Copy size={13} /> Copy</button>
          <button className="m-btn ghost sm"><Wand2 size={13} /> Refine</button>
          <button className="m-btn sm"><CalendarPlus size={13} /> Schedule</button>
        </span>
      </div>
    </article>
  )
}

function Recent() {
  return (
    <>
      <p className="m-label">Recent content</p>
      <h1 className="m-h1 sm">Everything you've made</h1>
      <div className="m-row wrap">
        <div className="m-search"><Search size={14} aria-hidden="true" /><input className="m-field bare" aria-label="Search topics and drafts" placeholder="Search topics and drafts" /></div>
        <div className="m-seg" role="radiogroup" aria-label="Filter">
          {['All', 'Scheduled', 'Unscheduled'].map((t, i) => <button key={t} role="radio" aria-checked={i === 0} className="m-seg-item">{t}</button>)}
        </div>
      </div>
      <div className="m-grid2">
        {RECENT.concat(RECENT.slice(0, 1).map((r) => ({ ...r, topic: 'Behind the scenes: packing day', when: 'Nov 9', sched: false }))).map((r) => (
          <div key={r.topic} className="m-card m-recent" style={lane(r.p[0])}>
            <div className="m-glyphs">{r.p.map((p) => <span key={p} className="m-glyph"><PIcon id={p} size={12} /></span>)}</div>
            <p className="m-h3">{r.topic}</p>
            <p className="m-meta">{r.p.length} formats · {r.when}</p>
            <div className="m-row">
              {r.sched ? <span className="m-badge accent"><Check size={11} /> Scheduled</span> : <span className="m-badge">Not scheduled</span>}
              <span className="m-spacer" />
              <button className="m-btn ghost sm"><Repeat size={13} /> Transform</button>
              <button className="m-icon-btn danger" aria-label={`Delete ${r.topic}`} title="Delete"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Calendar() {
  const days = Array.from({ length: 35 }, (_, i) => i - 6) // Nov 2026 starts on a Sunday; Mon-first grid
  const sched: Record<number, [string, string]> = { 3: ['linkedin', 'Four-day week: what we cut'], 11: ['instagram', 'Spring menu reveal'], 21: ['x', 'Remote onboarding myths'], 26: ['tiktok', 'Packing day BTS'] }
  return (
    <>
      <p className="m-label">Content calendar</p>
      <h1 className="m-h1 sm">November 2026</h1>
      <div className="m-cal">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="m-cal-h">{d}</div>)}
        {days.map((d) => (
          <div key={d} className={`m-cal-d ${d < 1 || d > 30 ? 'out' : ''} ${d === 18 ? 'today' : ''}`}>
            <span className="m-cal-n">{d < 1 ? 31 + d : d > 30 ? d - 30 : d}</span>
            {sched[d] && <span className="m-cal-post" style={lane(sched[d][0])}><PIcon id={sched[d][0]} size={10} /> <span>{sched[d][1]}</span></span>}
          </div>
        ))}
      </div>
    </>
  )
}

function Components() {
  const [modal, setModal] = useState(false)
  const [on, setOn] = useState(true)
  const [toast, setToast] = useState(false)
  return (
    <>
      <p className="m-label">Component sheet</p>
      <h1 className="m-h1 sm">Buttons, fields and states</h1>
      <div className="m-card m-sheet">
        <p className="m-label">Buttons: live (hover, Tab for focus, press)</p>
        <div className="m-row wrap">
          <button className="m-btn primary">Primary</button>
          <button className="m-btn">Secondary</button>
          <button className="m-btn ghost">Ghost</button>
          <button className="m-btn danger-o"><Trash2 size={13} /> Delete</button>
          <button className="m-btn primary" disabled>Disabled</button>
        </div>
        <p className="m-label">Forced states: rest, hover, focus, active</p>
        <div className="m-row wrap">
          <button className="m-btn primary">Rest</button>
          <button className="m-btn primary is-hover">Hover</button>
          <button className="m-btn primary is-focus">Focus</button>
          <button className="m-btn primary is-active">Active</button>
          <button className="m-chip">Chip</button>
          <button className="m-chip is-hover">Hover</button>
          <button className="m-chip is-focus">Focus</button>
          <button className="m-chip" aria-pressed="true">Selected</button>
        </div>
        <p className="m-label">Fields and validation</p>
        <div className="m-grid2 tight">
          <input className="m-field" aria-label="Example field" placeholder="Placeholder" />
          <input className="m-field is-focus" aria-label="Focused field" defaultValue="Focused field" />
          <select className="m-field" aria-label="Tone" defaultValue="Bold"><option>Natural</option><option>Bold</option></select>
          <input className="m-field" aria-label="Disabled field" disabled defaultValue="Disabled" />
        </div>
        <div className="m-error" role="alert"><b>Add a topic to generate drafts.</b> One sentence is enough, for example "Our new opening hours".</div>
        <p className="m-label">Badges, toggle, tabs</p>
        <div className="m-row wrap">
          <span className="m-badge">Draft</span>
          <span className="m-badge accent"><Check size={11} /> Scheduled</span>
          <span className="m-badge warn">Over limit by 40</span>
          <button className="m-toggle" role="switch" aria-checked={on} aria-label="Auto-generate images" onClick={() => setOn(!on)}><span /></button>
          <span className="m-meta">Auto-generate images</span>
        </div>
        <div className="m-tabs" role="tablist">
          {['LinkedIn', 'Instagram', 'X'].map((t, i) => <button key={t} role="tab" aria-selected={i === 0} className="m-tab">{t}</button>)}
        </div>
        <p className="m-label">Overlays</p>
        <div className="m-row wrap">
          <button className="m-btn" onClick={() => setModal(true)}>Open modal</button>
          <button className="m-btn" onClick={() => { setToast(true); setTimeout(() => setToast(false), 4000) }}>Show toast</button>
          <span className="m-tip-wrap"><button className="m-icon-btn" aria-label="Copy" aria-describedby="tip"><Copy size={14} /></button><span id="tip" role="tooltip" className="m-tip">Copy to clipboard</span></span>
        </div>
        <div className="m-skel" /><div className="m-skel short" />
      </div>
      {modal && (
        <div className="m-scrim" onClick={() => setModal(false)}>
          <div className="m-card m-modal" role="dialog" aria-modal="true" aria-labelledby="mdl-t" onClick={(e) => e.stopPropagation()}>
            <h3 className="m-h3" id="mdl-t">Schedule this post</h3>
            <p className="m-meta">LinkedIn post · Why we switched to a 4-day work week</p>
            <label className="m-strong" htmlFor="mdl-d">Publish date</label>
            <input id="mdl-d" className="m-field" type="date" defaultValue="2026-11-21" autoFocus />
            <div className="m-row end"><button className="m-btn ghost" onClick={() => setModal(false)}>Cancel</button><button className="m-btn primary" onClick={() => setModal(false)}>Add to calendar</button></div>
          </div>
        </div>
      )}
      {toast && <div className="m-toast" role="status"><Check size={14} /> Added to calendar for Sat 21 Nov <button className="m-link">Undo</button></div>}
    </>
  )
}

// ---------- reading experience panel ----------
function Radio<K extends keyof RX>({ rx, set, k, legend, opts }: { rx: RX; set: (r: RX) => void; k: K; legend: string; opts: [RX[K], string][] }) {
  return (
    <fieldset className="s-fs">
      <legend>{legend}</legend>
      {opts.map(([v, label]) => (
        <label key={String(v)} className="s-opt">
          <input type="radio" name={`rx-${k}`} checked={rx[k] === v} onChange={() => set({ ...rx, [k]: v })} /> {label}
        </label>
      ))}
    </fieldset>
  )
}

function ReadingPanel({ rx, set, close, sample }: { rx: RX; set: (r: RX) => void; close: () => void; sample: Concept }) {
  const p = applyRx(sample, rx).palette
  const r = ratio(p.text, p.bg)
  return (
    <aside className="s-rx" aria-labelledby="rx-title">
      <div className="s-rx-head">
        <h2 id="rx-title">Reading experience</h2>
        <button className="s-icon" onClick={close} aria-label="Close reading experience"><X size={16} /></button>
      </div>
      <p className="s-muted">Preview only. Changes apply to the mock app straight away and are saved in this browser. Nothing here changes production.</p>
      <div className="s-row wrap">
        <button className="s-btn" onClick={() => set({ ...rx, line: 'comfortable', letter: 'wide', word: 'wide', width: 'narrow', para: 'more', headings: 'clear', sep: 'clear' })}>Try comfortable spacing</button>
        <button className="s-btn" onClick={() => set(RX_DEFAULT)} disabled={isDefault(rx)}><RotateCcw size={13} /> Reset to default</button>
      </div>
      <h3>Typography</h3>
      <Radio rx={rx} set={set} k="font" legend="Reading font" opts={[['default', 'Concept default'], ['Arial', 'Arial'], ['Verdana', 'Verdana'], ['Atkinson Hyperlegible', 'Atkinson Hyperlegible']]} />
      <label className="s-fs" htmlFor="rx-size">
        <span className="s-legend">Text size: {rx.size}%</span>
        <input id="rx-size" type="range" min={90} max={150} step={10} value={rx.size} onChange={(e) => set({ ...rx, size: +e.target.value })} />
      </label>
      <h3>Spacing</h3>
      <Radio rx={rx} set={set} k="line" legend="Line spacing" opts={[['default', 'Default'], ['comfortable', 'Comfortable'], ['spacious', 'Spacious']]} />
      <Radio rx={rx} set={set} k="letter" legend="Letter spacing" opts={[['default', 'Default'], ['wide', 'Slightly wider']]} />
      <Radio rx={rx} set={set} k="word" legend="Word spacing" opts={[['default', 'Default'], ['wide', 'Wider']]} />
      <h3>Reading layout</h3>
      <Radio rx={rx} set={set} k="width" legend="Content width" opts={[['standard', 'Standard'], ['narrow', 'Narrower']]} />
      <Radio rx={rx} set={set} k="para" legend="Space between paragraphs" opts={[['standard', 'Standard'], ['more', 'More']]} />
      <Radio rx={rx} set={set} k="headings" legend="Headings" opts={[['default', 'Concept style'], ['clear', 'Clearer hierarchy (no caps, underlined sections)']]} />
      <h3>Visual comfort</h3>
      <Radio rx={rx} set={set} k="surface" legend="Background" opts={[['theme', 'Concept theme'], ['dim', 'Dimmer, less glare'], ['warm', 'Warm grey']]} />
      <p className="s-muted">Body text contrast in {sample.name}: <b className={r >= 4.5 ? 's-ok' : 's-bad'}>{r.toFixed(1)}:1</b> (AA needs 4.5)</p>
      <Radio rx={rx} set={set} k="sep" legend="Section separation" opts={[['default', 'Concept style'], ['clear', 'Clearer (no textures, stronger borders)']]} />
      <Radio rx={rx} set={set} k="motion" legend="Motion" opts={[['default', 'Follow system setting'], ['reduce', 'Reduce motion']]} />
    </aside>
  )
}

// ---------- studio panels ----------
const Swatches = ({ c }: { c: Concept }) => (
  <div className="s-swatches">
    {Object.entries(c.palette).map(([k, v]) => (
      <button key={k} className="s-swatch" onClick={() => navigator.clipboard?.writeText(v)} title="Copy HEX" aria-label={`${k} ${v}, copy HEX`}>
        <span style={{ background: v }} />
        <b>{k}</b>
        <code>{v}</code>
      </button>
    ))}
  </div>
)

const RLABEL: Record<Rating, string> = { good: 'Good', ok: 'OK', watch: 'Watch' }
const RKEYS = [['legibility', 'Body legibility'], ['distinction', 'Character distinction'], ['density', 'Information density'], ['navigation', 'Navigation predictability'], ['motion', 'Motion calm'], ['comfort', 'Visual comfort']] as const
const RatingTag = ({ r }: { r: Rating }) => <span className={`s-rate ${r}`}>{r === 'good' ? '●' : r === 'ok' ? '◐' : '○'} {RLABEL[r]}</span>

function ConceptDetail({ c }: { c: Concept }) {
  const rows: [string, string][] = [
    ['Philosophy', c.philosophy],
    ['Territory', c.territory],
    ['Inspiration', `${c.refs.join(', ')}. ${c.influence}`],
    ['Typography', `Display: ${c.fonts.display} ${c.fonts.displayWeight}${c.fonts.displayCase === 'upper' ? ' (uppercase)' : ''} · Body: ${c.fonts.body} · Mono: ${c.fonts.mono}`],
    ['Backgrounds & surfaces', c.surfaces],
    ['Cards & components', c.cards],
    ['Navigation', c.navigation],
    ['Iconography', c.icons],
    ['Motion & interaction', c.motion],
    ['What makes it distinctive', c.distinctive],
    ['Disadvantages / usability', c.concerns]
  ]
  const a = c.assess
  const fails = PAIRS.filter(([, f, b, min]) => ratio(c.palette[f], c.palette[b]) < min)
  return (
    <div className="s-detail">
      <div className="s-detail-head">
        <div>
          <h2>{c.name} {c.id === RECOMMENDED && <span className="s-rec"><Star size={12} /> Recommended</span>}</h2>
          <p className="s-muted">{c.tagline}</p>
        </div>
        <span className={`s-pill ${fails.length ? 'bad' : 'ok'}`}>{fails.length ? `${fails.length} contrast issue${fails.length > 1 ? 's' : ''}` : 'All text pairs pass WCAG AA'}</span>
      </div>
      <Swatches c={c} />
      <div className="s-type" style={themeStyle(c)}>
        <div style={{ fontFamily: 'var(--f-display)', fontWeight: c.fonts.displayWeight, textTransform: c.fonts.displayCase === 'upper' ? 'uppercase' : 'none', fontSize: 34, lineHeight: 1.05, color: 'var(--text)' }}>Publish everywhere.</div>
        <div style={{ fontFamily: 'var(--f-body)', fontSize: 15, color: 'var(--text2)' }}>The trick wasn't the extra day off. It was deciding what we'd stop doing.</div>
        <div style={{ fontFamily: 'var(--f-body)', fontSize: 22, color: 'var(--text)' }} aria-label="Character distinction specimen">Il1| O0 rn m bd pq 69</div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--text3)' }}>262 of 3,000 · LinkedIn · Sat 21 Nov</div>
      </div>
      <h3 className="s-h3">Dyslexia-friendly and cognitive assessment</h3>
      <p className="s-muted">Design-review judgement against BDA, COGA and WCAG guidance. Not yet tested with dyslexic users.</p>
      <div className="s-rates">{RKEYS.map(([k, l]) => <div key={k}><span>{l}</span><RatingTag r={a.ratings[k]} /></div>)}</div>
      <dl className="s-dl">
        {([['Typography & spacing', a.typography], ['Density & hierarchy', a.density], ['Navigation', a.navigation], ['Cognitive load', a.cognitive], ['Personalisation', a.personalisation], ['Limitations', a.limits]] as const).map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}
      </dl>
      <h3 className="s-h3">Concept details</h3>
      <dl className="s-dl">{rows.map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>
    </div>
  )
}

function ResearchTab() {
  return (
    <div className="s-wrap">
      <h1>Research: 10 products in Fanout's category</h1>
      <p className="s-muted">AI social writing, repurposing and scheduling tools. Each homepage was visited on 18 Nov 2026. Fonts and colours were read from the live DOM; screenshots were captured headless at 1280×800 (OpusClip in the in-app browser). Only public pages were seen; logged-in product UIs were not accessible.</p>
      <div className="s-table-wrap">
        <table className="s-table">
          <thead><tr><th>Product</th><th>Design style</th><th>Observed</th><th>What works well</th><th>Accessibility observations</th><th>What we can learn</th><th>Don't copy</th></tr></thead>
          <tbody>
            {RESEARCH.map((r) => (
              <tr key={r.name}>
                <td><a href={r.url} target="_blank" rel="noreferrer">{r.name} <ExternalLink size={11} aria-hidden="true" /></a>{r.img && <img src={`./refs/${r.img}`} alt={`${r.name} homepage, above the fold`} loading="lazy" />}</td>
                <td>{r.style}</td><td>{r.observed}</td><td>{r.works}</td><td>{r.a11y}</td><td>{r.learn}</td><td>{r.avoid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Synthesis</h2>
      <div className="s-cards">
        <div className="s-box"><h3>Common patterns</h3><p>Blue or violet primary buttons (Typefully, Taplio, Hypefury, Notion, Predis, OpusClip). Geometric sans everywhere. Gradient words in headlines. The real product UI as the hero.</p></div>
        <div className="s-box"><h3>Emerging trends</h3><p>Warm, saturated darks instead of grey (Descript). Serif or very heavy display for personality (Descript, Later). Input-first heroes: one box, then go (Taplio, OpusClip).</p></div>
        <div className="s-box"><h3>Features users expect</h3><p>Platform-faithful previews, character limits, a time-ordered queue, example prompts, calendar with post previews, copy and schedule on every draft.</p></div>
        <div className="s-box"><h3>Opportunity</h3><p>No competitor makes "one source → many outputs" visible in the interface itself. Nobody leads with reading comfort, even though drafting is mostly reading.</p></div>
        <div className="s-box"><h3>Keep</h3><p>Dark theme, left navigation, numbered Create steps, platform glyph colours, undo toasts, the fan mark.</p></div>
        <div className="s-box"><h3>Readability problems seen</h3><p>Text that animates on its own (OpusClip), body copy fading in (Raycast), uppercase headlines (beehiiv), gradient text (Taplio, Predis), 14px grey secondary text (Typefully, Predis), tiny uppercase eyebrows (Descript).</p></div>
        <div className="s-box"><h3>Accessibility patterns that work</h3><p>Icon + label everywhere (Notion). Example prompts under inputs (Taplio). Text size and contrast in the header (Braille Institute). Plain-language forms with hint text (GOV.UK).</p></div>
        <div className="s-box"><h3>Avoid</h3><p>{DESIGN_LANGUAGE.avoid}</p></div>
      </div>
    </div>
  )
}

function BoardTab() {
  const [sec, setSec] = useState<string>('All')
  const [ter, setTer] = useState<string>('All')
  const sections = ['All', 'Aesthetic', 'Colour', 'Typography', 'Layout', 'Components', 'Imagery', 'Interaction', 'Accessibility', 'Reading']
  const list = REFS.filter((r) => (sec === 'All' || r.section === sec) && (ter === 'All' || r.territory === ter))
  return (
    <div className="s-wrap">
      <h1>Inspiration board</h1>
      <p className="s-muted">{REFS.length} genuine screenshots captured from live sites on 18 Nov 2026. Nothing here is AI-generated. Two sources could not be captured: repurpose.io returned 403 Forbidden, and the BDA style-guide URL returned 404, so the BDA is cited in Evidence without an image.</p>
      <h2>Aesthetic territories</h2>
      <div className="s-cards three">
        {TERRITORIES.map((t) => (
          <button key={t.id} className={`s-box s-ter ${ter === t.id ? 'on' : ''}`} aria-pressed={ter === t.id} onClick={() => setTer(ter === t.id ? 'All' : t.id)}>
            <h3>{t.id}</h3><p>{t.blurb}</p><p><b>Readability:</b> {t.a11y}</p><p className="s-muted">Refs: {t.refs.join(', ')}</p>
          </button>
        ))}
      </div>
      <div className="s-filters" role="group" aria-label="Filter by section">{sections.map((s) => <button key={s} aria-pressed={sec === s} className={`s-chip ${sec === s ? 'on' : ''}`} onClick={() => setSec(s)}>{s}</button>)}</div>
      <div className="s-board">
        {list.map((r) => (
          <figure key={r.name + r.section} className="s-ref">
            {r.img && <img src={`./refs/${r.img}`} alt={`${r.name} screenshot`} loading="lazy" />}
            <figcaption>
              <div className="s-ref-h"><b>{r.name}</b><span className="s-tag">{r.section}</span></div>
              <a href={r.url} target="_blank" rel="noreferrer" className="s-muted">{r.url.replace(/^https?:\/\//, '')}</a>
              <p><b>Interesting:</b> {r.interesting}</p>
              <p><b>Adapt:</b> {r.adapt}</p>
              <p><b>Don't copy:</b> {r.avoid}</p>
              {r.a11y && <p><b>Accessibility:</b> {r.a11y}</p>}
            </figcaption>
          </figure>
        ))}
        {!list.length && <p className="s-muted">No references match this filter.</p>}
      </div>
      <h2>Extracted design language</h2>
      <div className="s-cards">
        <div className="s-box"><h3>Personality</h3><p className="s-words">{DESIGN_LANGUAGE.words.map((w) => <span key={w}>{w}</span>)}</p></div>
        {(['typography', 'colour', 'layout', 'components', 'imagery', 'motion', 'readability', 'personalisation'] as const).map((k) => (
          <div key={k} className="s-box"><h3>{k[0].toUpperCase() + k.slice(1)}</h3><p>{DESIGN_LANGUAGE[k]}</p></div>
        ))}
        <div className="s-box"><h3>Avoid</h3><p>{DESIGN_LANGUAGE.avoid}</p></div>
      </div>
    </div>
  )
}

const SCREENS: Screen[] = ['dashboard', 'create', 'recent', 'calendar', 'components']

function ConceptsTab({ idx, setIdx, rx }: { idx: number; setIdx: (n: number) => void; rx: RX }) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [screen, setScreen] = useState<Screen>('dashboard')
  const c = ALL[idx]
  return (
    <div className="s-concepts">
      <div className="s-rail" role="listbox" aria-label="Design concepts">
        {ALL.map((k, i) => (
          <button key={k.id} role="option" aria-selected={i === idx} className="s-rail-item" onClick={() => setIdx(i)}>
            <span className="s-dots" aria-hidden="true">{[k.palette.bg, k.palette.surface2, k.palette.text, k.palette.accent, k.palette.accent2].map((v, j) => <i key={j} style={{ background: v }} />)}</span>
            <span><b>{i === 0 ? 'Was' : `${i}.`} {k.name}</b>{k.id === RECOMMENDED && <Star size={11} className="s-star" aria-label="Recommended" />}<small>{k.tagline}</small></span>
          </button>
        ))}
        <p className="s-hint">← → to switch concepts</p>
      </div>
      <div className="s-stage">
        <div className="s-toolbar">
          <div className="s-seg" role="group" aria-label="Screen">{SCREENS.map((s) => <button key={s} aria-pressed={screen === s} className={screen === s ? 'on' : ''} onClick={() => setScreen(s)}>{s}</button>)}</div>
          <div className="s-seg" role="group" aria-label="Device">{(['desktop', 'mobile'] as const).map((d) => <button key={d} aria-pressed={device === d} className={device === d ? 'on' : ''} onClick={() => setDevice(d)}>{d}</button>)}</div>
        </div>
        <div className={`s-device ${device}`}>
          <div className="s-device-bar"><i /><i /><i /><span>fanout.app/#{screen}</span></div>
          <MockApp concept={c} rx={rx} screen={screen} setScreen={setScreen} />
        </div>
        <ConceptDetail c={c} />
      </div>
    </div>
  )
}

function CompareTab({ rx }: { rx: RX }) {
  const [a, setA] = useState(BASELINE.id)
  const [b, setB] = useState(RECOMMENDED)
  const [mode, setMode] = useState<'both' | 'right'>('both')
  const [screen, setScreen] = useState<Screen>('create')
  const pick = (v: string, set: (s: string) => void, label: string) => (
    <select className="s-select" aria-label={label} value={v} onChange={(e) => set(e.target.value)}>{ALL.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
  )
  return (
    <div className="s-wrap wide">
      <div className="s-toolbar">
        <div className="s-row wrap">{pick(a, setA, 'Left concept')} <span className="s-muted">vs</span> {pick(b, setB, 'Right concept')}
          <label className="s-row s-muted"><input type="checkbox" checked={mode === 'right'} onChange={(e) => setMode(e.target.checked ? 'right' : 'both')} /> Reading settings on the right only (pick the same concept twice to compare standard vs. enhanced)</label>
        </div>
        <div className="s-seg" role="group" aria-label="Screen">{SCREENS.map((s) => <button key={s} aria-pressed={screen === s} className={screen === s ? 'on' : ''} onClick={() => setScreen(s)}>{s}</button>)}</div>
      </div>
      <div className="s-compare">
        {[a, b].map((id, i) => {
          const c = byId(id)
          const withRx = mode === 'both' || i === 1
          return (
            <div key={i}>
              <p className="s-cmp-title"><b>{c.name}</b> <span className="s-muted">{c.tagline}{mode === 'right' ? (withRx ? ' · with reading settings' : ' · standard') : ''}</span></p>
              <div className="s-device desktop"><MockApp concept={c} rx={withRx ? rx : null} screen={screen} /></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function A11yTab() {
  return (
    <div className="s-wrap wide">
      <h1>Accessibility</h1>
      <h2>Contrast ratios (WCAG 2.2 AA)</h2>
      <p className="s-muted">Computed live from each palette. Text needs 4.5:1; focus rings and UI component boundaries need 3:1.</p>
      <div className="s-table-wrap">
        <table className="s-table a11y">
          <thead><tr><th>Pair</th>{ALL.map((c) => <th key={c.id}>{c.name}</th>)}</tr></thead>
          <tbody>
            {PAIRS.map(([label, f, b, min]) => (
              <tr key={label}>
                <td>{label} <span className="s-muted">≥{min}</span></td>
                {ALL.map((c) => {
                  const r = ratio(c.palette[f], c.palette[b])
                  const ok = r >= min
                  return <td key={c.id} className={ok ? 'ok' : 'bad'}><span className="s-chipc" style={{ background: c.palette[b], color: c.palette[f] }}>Aa</span> {r.toFixed(2)}{ok ? '' : ' ✕ fail'}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Dyslexia-friendly and cognitive review</h2>
      <p className="s-muted">Design-review judgement, not user testing. ● good · ◐ OK · ○ watch.</p>
      <div className="s-table-wrap">
        <table className="s-table a11y">
          <thead><tr><th>Aspect</th>{ALL.map((c) => <th key={c.id}>{c.name}</th>)}</tr></thead>
          <tbody>
            {RKEYS.map(([k, l]) => (
              <tr key={k}><td>{l}</td>{ALL.map((c) => <td key={c.id}><RatingTag r={c.assess.ratings[k]} /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Notes for every concept</h2>
      <div className="s-cards">
        <div className="s-box"><h3>Focus</h3><p>2px accent outline, 2px offset, on every interactive element (try Tab on the Components screen). Every accent clears 3:1 against its page.</p></div>
        <div className="s-box"><h3>Platform colours</h3><p>LinkedIn #0A66C2 is about 3.1:1 on these darks: fine for icons and lane lines next to a text label, never for text.</p></div>
        <div className="s-box"><h3>Text spacing (WCAG 1.4.12)</h3><p>Use "Try comfortable spacing" in the Reading panel: layouts must reflow without clipping. Checked at 150% text size in the mobile frame.</p></div>
        <div className="s-box"><h3>Very high contrast</h3><p>Most concepts sit at 15–19:1 for body text. That passes easily, but some readers find bright text on near-black uncomfortable, which is why the panel offers dimmer and warm-grey surfaces.</p></div>
        <div className="s-box"><h3>Motion</h3><p>Fan-out and fade animations stop under prefers-reduced-motion and under the panel's Reduce motion setting. No concept moves text while it is being read.</p></div>
        <div className="s-box"><h3>Errors and labels</h3><p>Components screen shows the error pattern: what went wrong and how to fix it, with an example. Icon-only buttons have accessible names and tooltips.</p></div>
      </div>
      <h2>Evidence behind the reading guidance</h2>
      <div className="s-cards">
        {EVIDENCE.map((e) => (
          <div key={e.url} className="s-box"><h3>{e.kind}</h3><p>{e.text}</p><a className="s-muted" href={e.url} target="_blank" rel="noreferrer">{e.url.replace(/^https?:\/\//, '')}</a></div>
        ))}
      </div>
    </div>
  )
}

function RecTab({ go, rx }: { go: () => void; rx: RX }) {
  const c = byId(RECOMMENDED)
  const ru = byId(RUNNER_UP)
  return (
    <div className="s-wrap">
      <h1>Recommendation: {c.name}</h1>
      <div className="s-device desktop"><MockApp concept={c} rx={rx} screen="create" /></div>
      <div className="s-cards">
        <div className="s-box"><h3>Why it fits</h3><p>Fanout's whole job is one idea going to many platforms. Wayfinder makes that the structure of the interface: the idea is a station, each platform is a coloured line, and every draft, calendar entry and recent item carries its line. Colour always means "which platform". Nothing else competes.</p></div>
        <div className="s-box"><h3>Research influence</h3><p>GOV.UK's signage-like clarity and plain labels; Hypefury's time-ordered queue; Typefully's draft columns; Raycast's restraint. The research showed blue and violet everywhere, so the UI stays monochrome and lets platform colours carry meaning.</p></div>
        <div className="s-box"><h3>UX gains</h3><p>Drafts are easier to find by platform at a glance. The station-line navigation shows where you are. No texture behind text, and no decorative second accent.</p></div>
        <div className="s-box"><h3>Readability</h3><p>Barlow body is an open, familiar grotesque with no uppercase body labels. Condensed type only for titles. Flat graphite surfaces at 17:1 body contrast, with dim and warm surfaces available. Reading preferences work without layout changes.</p></div>
        <div className="s-box"><h3>Why it's more distinctive</h3><p>Proof Sheet is distinctive but sits close to Descript and Jasper (serif + red). Wayfinder borrows from transit signage, which nobody in the category uses, and it grows straight out of Fanout's fan mark.</p></div>
        <div className="s-box"><h3>Trade-offs</h3><p>A white primary button is less "branded" than a colour. The brand depends on platform colours, so labels are always required next to them. Barlow Condensed is unsuitable for paragraphs.</p></div>
        <div className="s-box"><h3>Runner-up: {ru.name}</h3><p>The most readable concept by a margin, and the safest choice for dyslexic users. It loses on distinctiveness: it says "calm reading app" more than "Fanout".</p></div>
        <div className="s-box"><h3>Or keep Proof Sheet</h3><p>Keeping the live design is a valid choice. Its weakest points (11px uppercase mono labels, grain behind text, serif below 24px) could be fixed without a rebrand.</p></div>
      </div>
      <button className="s-cta" onClick={go}>Explore all 10 concepts →</button>
    </div>
  )
}

// ---------- shell ----------
const TABS = ['Research', 'Inspiration board', 'Concepts', 'Compare', 'Accessibility', 'Recommendation'] as const
type Tab = (typeof TABS)[number]

function Studio() {
  const [tab, setTab] = useState<Tab>('Concepts')
  const [idx, setIdx] = useState(ALL.findIndex((c) => c.id === RECOMMENDED))
  const [rx, setRxState] = useState<RX>(loadRx)
  const [panel, setPanel] = useState(false)
  const setRx = (r: RX) => {
    setRxState(r)
    try { localStorage.setItem(RX_KEY, JSON.stringify(r)) } catch { /* storage unavailable: settings last for this visit only */ }
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanel(false)
      if (tab !== 'Concepts' || (e.target as HTMLElement).closest('input,textarea,select')) return
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % ALL.length)
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + ALL.length) % ALL.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tab])
  return (
    <div className={`s-app ${panel ? 'with-rx' : ''}`}>
      <header className="s-head">
        <b>Fanout · Design Preview Studio</b>
        <span className="s-dev">dev only · round 2</span>
        <nav className="s-tabs" aria-label="Studio">{TABS.map((t) => <button key={t} aria-current={tab === t ? 'page' : undefined} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
        <button className={`s-btn ${isDefault(rx) ? '' : 'active'}`} aria-expanded={panel} onClick={() => setPanel(!panel)}><Type size={14} /> Reading{isDefault(rx) ? '' : ' (on)'}</button>
      </header>
      <main>
        {tab === 'Research' && <ResearchTab />}
        {tab === 'Inspiration board' && <BoardTab />}
        {tab === 'Concepts' && <ConceptsTab idx={idx} setIdx={setIdx} rx={rx} />}
        {tab === 'Compare' && <CompareTab rx={rx} />}
        {tab === 'Accessibility' && <A11yTab />}
        {tab === 'Recommendation' && <RecTab go={() => setTab('Concepts')} rx={rx} />}
      </main>
      {panel && <ReadingPanel rx={rx} set={setRx} close={() => setPanel(false)} sample={tab === 'Concepts' ? ALL[idx] : byId(RECOMMENDED)} />}
    </div>
  )
}

// Warm every concept's fonts up front so switching concepts doesn't flash the fallback
ALL.forEach((c) => [`${c.fonts.displayWeight} 16px "${c.fonts.display}"`, `400 16px "${c.fonts.body}"`, `400 16px "${c.fonts.mono}"`].forEach((f) => document.fonts.load(f)))
document.fonts.load('400 16px "Atkinson Hyperlegible"')

ReactDOM.createRoot(document.getElementById('root')!).render(<Studio />)
