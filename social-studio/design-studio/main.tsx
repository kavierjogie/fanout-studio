// Design Preview Studio — dev-only, isolated from production styling (imports nothing from src/ styles).
import React, { CSSProperties, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  LayoutGrid, PenLine, Repeat, BookMarked, Clock, CalendarDays, Copy, Wand2, CalendarPlus, Search,
  Linkedin, Instagram, Music2, Twitter, FileText, Megaphone, Hash, Code2, Menu, X, Trash2, Check, ExternalLink, Star
} from 'lucide-react'
import { CONCEPTS, Concept, DESIGN_LANGUAGE, PLATFORM_LIST, RECOMMENDED, REFS, RESEARCH, TERRITORIES } from './data'

// ---------- contrast (WCAG 2.2) ----------
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}
export const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
// [label, fg key, bg key, minimum] — 4.5 for text, 3 for UI components / large text
const PAIRS = [
  ['Body text / page', 'text', 'bg', 4.5],
  ['Body text / card', 'text', 'surface', 4.5],
  ['Secondary / page', 'text2', 'bg', 4.5],
  ['Secondary / card', 'text2', 'surface', 4.5],
  ['Meta text / page', 'text3', 'bg', 4.5],
  ['Meta text / card', 'text3', 'surface', 4.5],
  ['Button label / accent', 'onAccent', 'accent', 4.5],
  ['Accent (focus, UI) / page', 'accent', 'bg', 3],
  ['Accent text / card', 'accent', 'surface', 4.5],
  ['Border / page', 'line', 'bg', 1.2]
] as const

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
const PIcon = ({ id, size = 14 }: { id: string; size?: number }) => {
  const I = PICON[id]
  const color = PLATFORM_LIST.find((p) => p.id === id)?.color
  return <I size={size} style={{ color }} aria-hidden="true" />
}

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

const DRAFT = `We switched to a four-day work week six months ago.

Output didn't drop. Meetings did — by 38%.

The trick wasn't the extra day off. It was deciding, as a team, what we'd stop doing to earn it.

What would your team cut first?`

const RECENT = [
  { topic: 'Why we switched to a 4-day work week', p: ['linkedin', 'instagram', 'x', 'blog'], when: '2h ago', sched: true },
  { topic: 'Announce the launch of our spring menu', p: ['instagram', 'tiktok', 'promo'], when: 'Yesterday', sched: false },
  { topic: 'Myth vs. reality: remote onboarding', p: ['linkedin', 'hashtags'], when: 'Mon', sched: true }
]

function MockApp({ c, screen, setScreen }: { c: Concept; screen: Screen; setScreen?: (s: Screen) => void }) {
  const [drawer, setDrawer] = useState(false)
  return (
    <div className="m" style={themeStyle(c)} data-card={c.card} data-nav={c.nav} data-pattern={c.pattern} data-label={c.label}>
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
          <nav className="m-nav">
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
          <p className="m-lede">Start with a single idea and generate every platform-ready format from it — no separate tools, no starting over.</p>
          <div className="m-row">
            <button className="m-btn primary"><PenLine size={15} /> Create content</button>
            <button className="m-btn"><BookMarked size={15} /> Browse prompt library</button>
          </div>
        </div>
        <FanDiagram c={c} />
      </section>
      <div className="m-stats">
        {[['Ideas created', '4', '4 in the last 7 days'], ['Drafts generated', '11', '2.8 per idea on average'], ['Formats used', '7 / 9', '2 still to try'], ['Scheduled', '2', 'Next goes out Nov 21']].map(([l, v, s]) => (
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
          <button key={r.topic} className="m-card m-row-card">
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
  return (
    <svg className="m-fan" viewBox="0 0 300 200" role="img" aria-label="One idea fanned out to LinkedIn, Instagram, TikTok and X">
      {outs.map((_, i) => (
        <path key={i} className="m-fan-line" d={`M70 100 C150 100 150 ${35 + i * 43} 220 ${35 + i * 43}`} fill="none" stroke={c.palette.accent} strokeWidth="1.5" strokeDasharray="4 4" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
      <circle cx="56" cy="100" r="30" fill={c.palette.surface2} stroke={c.palette.accent} strokeWidth="1.5" />
      <text x="56" y="104" textAnchor="middle" fill={c.palette.text} fontSize="10" style={{ fontFamily: 'var(--f-mono)' }}>YOUR IDEA</text>
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
        <textarea id="topic" className="m-field" rows={2} defaultValue="Why we switched to a 4-day work week" />
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
    <article className="m-card m-draft">
      <div className="m-draft-head">
        <span className="m-glyph"><PIcon id="linkedin" size={14} /></span>
        <span><span className="m-strong">LinkedIn post</span><span className="m-meta">Natural · just now</span></span>
        <span className="m-badge">Draft</span>
      </div>
      <div className="m-draft-body">{DRAFT}</div>
      <div className="m-draft-foot">
        <span className="m-count"><span className="m-meter"><span style={{ width: '9%' }} /></span>262 / 3,000</span>
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
        <div className="m-search"><Search size={14} /><input className="m-field bare" placeholder="Search topics and drafts" /></div>
        <div className="m-seg" role="radiogroup" aria-label="Filter">
          {['All', 'Scheduled', 'Unscheduled'].map((t, i) => <button key={t} role="radio" aria-checked={i === 0} className="m-seg-item">{t}</button>)}
        </div>
      </div>
      <div className="m-grid2">
        {RECENT.concat(RECENT.slice(0, 1).map((r) => ({ ...r, topic: 'Behind the scenes: packing day', when: 'Nov 9', sched: false }))).map((r) => (
          <div key={r.topic} className="m-card m-recent">
            <div className="m-glyphs">{r.p.map((p) => <span key={p} className="m-glyph"><PIcon id={p} size={12} /></span>)}</div>
            <p className="m-h3">{r.topic}</p>
            <p className="m-meta">{r.p.length} formats · {r.when}</p>
            <div className="m-row">
              {r.sched ? <span className="m-badge accent"><Check size={11} /> Scheduled</span> : <span className="m-badge">Unscheduled</span>}
              <span className="m-spacer" />
              <button className="m-icon-btn" aria-label="Transform"><Repeat size={14} /></button>
              <button className="m-icon-btn danger" aria-label="Delete"><Trash2 size={14} /></button>
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
            {sched[d] && <span className="m-cal-post"><PIcon id={sched[d][0]} size={10} /> <span>{sched[d][1]}</span></span>}
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
      <h1 className="m-h1 sm">Buttons, fields & states</h1>
      <div className="m-card m-sheet">
        <p className="m-label">Buttons — live (hover, Tab for focus, press)</p>
        <div className="m-row wrap">
          <button className="m-btn primary">Primary</button>
          <button className="m-btn">Secondary</button>
          <button className="m-btn ghost">Ghost</button>
          <button className="m-btn danger-o"><Trash2 size={13} /> Delete</button>
          <button className="m-btn primary" disabled>Disabled</button>
        </div>
        <p className="m-label">Forced states — rest / hover / focus / active</p>
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
        <p className="m-label">Fields</p>
        <div className="m-grid2 tight">
          <input className="m-field" placeholder="Placeholder" />
          <input className="m-field is-focus" defaultValue="Focused field" />
          <select className="m-field" defaultValue="Bold"><option>Natural</option><option>Bold</option></select>
          <input className="m-field" disabled defaultValue="Disabled" />
        </div>
        <p className="m-label">Badges, toggle, tabs</p>
        <div className="m-row wrap">
          <span className="m-badge">Draft</span>
          <span className="m-badge accent">Scheduled</span>
          <span className="m-badge warn">Over limit</span>
          <button className="m-toggle" role="switch" aria-checked={on} onClick={() => setOn(!on)}><span /></button>
          <span className="m-meta">Auto-generate images</span>
        </div>
        <div className="m-tabs" role="tablist">
          {['LinkedIn', 'Instagram', 'X'].map((t, i) => <button key={t} role="tab" aria-selected={i === 0} className="m-tab">{t}</button>)}
        </div>
        <p className="m-label">Overlays</p>
        <div className="m-row wrap">
          <button className="m-btn" onClick={() => setModal(true)}>Open modal</button>
          <button className="m-btn" onClick={() => { setToast(true); setTimeout(() => setToast(false), 2400) }}>Show toast</button>
          <span className="m-tip-wrap"><button className="m-icon-btn" aria-describedby="tip"><Copy size={14} /></button><span id="tip" role="tooltip" className="m-tip">Copy to clipboard</span></span>
        </div>
        <div className="m-skel" /><div className="m-skel short" />
      </div>
      {modal && (
        <div className="m-scrim" onClick={() => setModal(false)}>
          <div className="m-card m-modal" role="dialog" aria-modal="true" aria-label="Schedule post" onClick={(e) => e.stopPropagation()}>
            <h3 className="m-h3">Schedule this post</h3>
            <p className="m-meta">LinkedIn post · Why we switched to a 4-day work week</p>
            <input className="m-field" type="date" defaultValue="2026-11-21" />
            <div className="m-row end"><button className="m-btn ghost" onClick={() => setModal(false)}>Cancel</button><button className="m-btn primary" onClick={() => setModal(false)}>Add to calendar</button></div>
          </div>
        </div>
      )}
      {toast && <div className="m-toast"><Check size={14} /> Added to calendar <button className="m-link">Undo</button></div>}
    </>
  )
}

// ---------- studio panels ----------
const Swatches = ({ c }: { c: Concept }) => (
  <div className="s-swatches">
    {Object.entries(c.palette).map(([k, v]) => (
      <button key={k} className="s-swatch" onClick={() => navigator.clipboard?.writeText(v)} title="Copy HEX">
        <span style={{ background: v }} />
        <b>{k}</b>
        <code>{v}</code>
      </button>
    ))}
  </div>
)

function ConceptDetail({ c }: { c: Concept }) {
  const rows: [string, string][] = [
    ['Philosophy', c.philosophy],
    ['Inspiration', `${c.refs.join(', ')} — ${c.influence}`],
    ['Typography', `Display: ${c.fonts.display} ${c.fonts.displayWeight}${c.fonts.displayCase === 'upper' ? ' (uppercase)' : ''} · Body: ${c.fonts.body} · Mono: ${c.fonts.mono}`],
    ['Backgrounds & surfaces', c.surfaces],
    ['Cards & components', c.cards],
    ['Navigation', c.navigation],
    ['Iconography', c.icons],
    ['Motion & interaction', c.motion],
    ['What makes it distinctive', c.distinctive],
    ['Disadvantages / usability', c.concerns]
  ]
  const fails = PAIRS.filter(([, f, b, min]) => ratio(c.palette[f], c.palette[b]) < min)
  return (
    <div className="s-detail">
      <div className="s-detail-head">
        <div>
          <h2>{c.name} {c.id === RECOMMENDED && <span className="s-rec"><Star size={12} /> Recommended</span>}</h2>
          <p className="s-muted">{c.tagline}</p>
        </div>
        <span className={`s-pill ${fails.length ? 'bad' : 'ok'}`}>{fails.length ? `${fails.length} contrast issue${fails.length > 1 ? 's' : ''}` : 'WCAG AA pass'}</span>
      </div>
      <Swatches c={c} />
      <div className="s-type" style={themeStyle(c)}>
        <div style={{ fontFamily: 'var(--f-display)', fontWeight: c.fonts.displayWeight, textTransform: c.fonts.displayCase === 'upper' ? 'uppercase' : 'none', fontSize: 34, lineHeight: 1.05, color: 'var(--text)' }}>Publish everywhere.</div>
        <div style={{ fontFamily: 'var(--f-body)', fontSize: 15, color: 'var(--text2)' }}>The trick wasn't the extra day off. It was deciding what we'd stop doing.</div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--text3)', letterSpacing: '.04em' }}>262 / 3,000 · LINKEDIN · NOV 21</div>
      </div>
      <dl className="s-dl">{rows.map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>
    </div>
  )
}

function ResearchTab() {
  return (
    <div className="s-wrap">
      <h1>Research: 10 products in Fanout's category</h1>
      <p className="s-muted">Social scheduling, AI writing and content-repurposing tools. Each homepage was visited on 18 Nov 2026; colours and fonts below were measured from the live DOM (above the fold only — logged-in product UIs were not accessible). Screenshots are reference only.</p>
      <div className="s-table-wrap">
        <table className="s-table">
          <thead><tr><th>Product</th><th>Design style</th><th>Observed</th><th>What works well</th><th>What we can learn</th><th>Don't copy</th></tr></thead>
          <tbody>
            {RESEARCH.map((r) => (
              <tr key={r.name}>
                <td><a href={r.url} target="_blank" rel="noreferrer">{r.name} <ExternalLink size={11} /></a>{r.img && <img src={`./refs/${r.img}`} alt={`${r.name} homepage, above the fold`} loading="lazy" />}</td>
                <td>{r.style}</td><td>{r.observed}</td><td>{r.works}</td><td>{r.learn}</td><td>{r.avoid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Synthesis</h2>
      <div className="s-cards">
        <div className="s-box"><h3>Common patterns</h3><p>Platform logos as the colour source; real product UI as hero; one primary CTA colour; geometric sans everywhere.</p></div>
        <div className="s-box"><h3>Emerging trends</h3><p>AI writing tools moving away from purple (Jasper → serif + red-orange); warm off-whites and tinted inks (Buffer, Later); product-as-hero (Typefully, Planable).</p></div>
        <div className="s-box"><h3>Features users expect</h3><p>Platform-faithful previews, char limits, calendar with post previews, format chips, copy/schedule actions on each draft.</p></div>
        <div className="s-box"><h3>Opportunity</h3><p>Nobody in the category owns an editorial or "signal-routing" identity on dark. Fanout's fan mark and pipeline diagram are already on-concept.</p></div>
        <div className="s-box"><h3>Keep</h3><p>Brand-coloured platform glyphs, left sidebar nav, numbered Create steps, dark theme, undo toasts.</p></div>
        <div className="s-box"><h3>Avoid</h3><p>{DESIGN_LANGUAGE.avoid}</p></div>
      </div>
    </div>
  )
}

function BoardTab() {
  const [sec, setSec] = useState<string>('All')
  const [ter, setTer] = useState<string>('All')
  const sections = ['All', 'Aesthetic', 'Colour', 'Typography', 'Layout', 'Components', 'Imagery', 'Interaction']
  const list = REFS.filter((r) => (sec === 'All' || r.section === sec) && (ter === 'All' || r.territory === ter))
  return (
    <div className="s-wrap">
      <h1>Inspiration board</h1>
      <p className="s-muted">Genuine screenshots captured from each live site. Nothing here is AI-generated. Linear was also visited but its hero is animated and captured blank, so it's cited without an image.</p>
      <h2>Aesthetic territories</h2>
      <div className="s-cards three">
        {TERRITORIES.map((t) => (
          <button key={t.id} className={`s-box s-ter ${ter === t.id ? 'on' : ''}`} onClick={() => setTer(ter === t.id ? 'All' : t.id)}>
            <h3>{t.id}</h3><p>{t.blurb}</p><p className="s-muted">Refs: {t.refs.join(', ')}</p>
          </button>
        ))}
      </div>
      <div className="s-filters">{sections.map((s) => <button key={s} className={`s-chip ${sec === s ? 'on' : ''}`} onClick={() => setSec(s)}>{s}</button>)}</div>
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
            </figcaption>
          </figure>
        ))}
        {!list.length && <p className="s-muted">No references match this filter.</p>}
      </div>
      <h2>Extracted design language</h2>
      <div className="s-cards">
        <div className="s-box"><h3>Personality</h3><p className="s-words">{DESIGN_LANGUAGE.words.map((w) => <span key={w}>{w}</span>)}</p></div>
        {(['typography', 'colour', 'layout', 'components', 'imagery', 'motion'] as const).map((k) => (
          <div key={k} className="s-box"><h3>{k[0].toUpperCase() + k.slice(1)}</h3><p>{DESIGN_LANGUAGE[k]}</p></div>
        ))}
        <div className="s-box"><h3>Avoid</h3><p>{DESIGN_LANGUAGE.avoid}</p></div>
      </div>
    </div>
  )
}

const SCREENS: Screen[] = ['dashboard', 'create', 'recent', 'calendar', 'components']

function ConceptsTab({ idx, setIdx }: { idx: number; setIdx: (n: number) => void }) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [screen, setScreen] = useState<Screen>('dashboard')
  const c = CONCEPTS[idx]
  return (
    <div className="s-concepts">
      <div className="s-rail" role="listbox" aria-label="Design concepts">
        {CONCEPTS.map((k, i) => (
          <button key={k.id} role="option" aria-selected={i === idx} className="s-rail-item" onClick={() => setIdx(i)}>
            <span className="s-dots">{[k.palette.bg, k.palette.surface2, k.palette.text, k.palette.accent, k.palette.accent2].map((v, j) => <i key={j} style={{ background: v }} />)}</span>
            <span><b>{i + 1}. {k.name}</b>{k.id === RECOMMENDED && <Star size={11} className="s-star" />}<small>{k.tagline}</small></span>
          </button>
        ))}
        <p className="s-hint">← → to switch concepts</p>
      </div>
      <div className="s-stage">
        <div className="s-toolbar">
          <div className="s-seg">{SCREENS.map((s) => <button key={s} className={screen === s ? 'on' : ''} onClick={() => setScreen(s)}>{s}</button>)}</div>
          <div className="s-seg">{(['desktop', 'mobile'] as const).map((d) => <button key={d} className={device === d ? 'on' : ''} onClick={() => setDevice(d)}>{d}</button>)}</div>
        </div>
        <div className={`s-device ${device}`}>
          <div className="s-device-bar"><i /><i /><i /><span>fanout.app/#{screen}</span></div>
          <MockApp c={c} screen={screen} setScreen={setScreen} />
        </div>
        <ConceptDetail c={c} />
      </div>
    </div>
  )
}

function CompareTab() {
  const [a, setA] = useState(RECOMMENDED)
  const [b, setB] = useState('switchboard')
  const [screen, setScreen] = useState<Screen>('create')
  const pick = (v: string, set: (s: string) => void) => (
    <select className="s-select" value={v} onChange={(e) => set(e.target.value)}>{CONCEPTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
  )
  return (
    <div className="s-wrap wide">
      <div className="s-toolbar">
        <div className="s-row">{pick(a, setA)} <span className="s-muted">vs</span> {pick(b, setB)}</div>
        <div className="s-seg">{SCREENS.map((s) => <button key={s} className={screen === s ? 'on' : ''} onClick={() => setScreen(s)}>{s}</button>)}</div>
      </div>
      <div className="s-compare">
        {[a, b].map((id, i) => {
          const c = CONCEPTS.find((x) => x.id === id)!
          return (
            <div key={i}>
              <p className="s-cmp-title"><b>{c.name}</b> <span className="s-muted">{c.tagline}</span></p>
              <div className="s-device desktop"><MockApp c={c} screen={screen} /></div>
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
      <h1>Accessibility: contrast ratios (WCAG 2.2 AA)</h1>
      <p className="s-muted">Computed live from each palette. Text needs 4.5:1; focus rings and UI component boundaries need 3:1 (accent / page). Border/page is informational — hairline borders are decorative and every input also has a label and a 3:1 focus ring.</p>
      <div className="s-table-wrap">
        <table className="s-table a11y">
          <thead><tr><th>Pair</th>{CONCEPTS.map((c) => <th key={c.id}>{c.name}</th>)}</tr></thead>
          <tbody>
            {PAIRS.map(([label, f, b, min]) => (
              <tr key={label}>
                <td>{label} <span className="s-muted">≥{min}</span></td>
                {CONCEPTS.map((c) => {
                  const r = ratio(c.palette[f], c.palette[b])
                  const ok = r >= min
                  return <td key={c.id} className={ok ? 'ok' : 'bad'}><span className="s-chipc" style={{ background: c.palette[b], color: c.palette[f] }}>Aa</span> {r.toFixed(2)}{ok ? '' : ' ✕'}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Notes for every concept</h2>
      <div className="s-cards">
        <div className="s-box"><h3>Focus</h3><p>2px accent outline, 2px offset on every interactive element (see Components screen). All accents clear 3:1 against the page.</p></div>
        <div className="s-box"><h3>Platform colours</h3><p>LinkedIn #0A66C2 is only ~3:1 on dark — used on icons (non-text, decorative next to a text label), never as text.</p></div>
        <div className="s-box"><h3>Destructive actions</h3><p>Red-accent concepts (Proof Sheet, Dispatch secondary) use an outlined button with a trash icon and an Undo toast so "delete" never looks like the primary action.</p></div>
        <div className="s-box"><h3>Motion</h3><p>All fan-out / fade animations are disabled under prefers-reduced-motion (already the app's convention).</p></div>
      </div>
    </div>
  )
}

function RecTab({ go }: { go: () => void }) {
  const c = CONCEPTS.find((x) => x.id === RECOMMENDED)!
  return (
    <div className="s-wrap">
      <h1>Recommendation: {c.name}</h1>
      <div className="s-device desktop"><MockApp c={c} screen="create" /></div>
      <div className="s-cards">
        <div className="s-box"><h3>Why it fits</h3><p>Users spend most of their time reading and editing generated drafts. An editorial system — a serif for titles, a highly legible sans set in a 68ch column, mono for counts and dates — is built for exactly that. It says "writing and publishing", not "AI toy".</p></div>
        <div className="s-box"><h3>Research influence</h3><p>Jasper showed an AI writing product gains credibility from a serif and from dropping purple; Are.na's lettered structure becomes numbered Create steps; Later shows type alone can carry the brand; Buffer's tinted ink informs the warm charcoal.</p></div>
        <div className="s-box"><h3>UX gains</h3><p>One accent with one meaning (next action / live). Hairline rules instead of glows lower visual noise. Mono metadata makes char limits and schedule dates scannable.</p></div>
        <div className="s-box"><h3>Why it's more distinctive</h3><p>Today's purple→pink→orange gradient and violet glow are the single most common AI-tool look (Canva, Copy.ai CTA). No competitor occupies a warm editorial dark theme.</p></div>
        <div className="s-box"><h3>Trade-offs</h3><p>Instrument Serif is display-only (≥24px). Vermilion primary needs a separate destructive style. Close cousin of Jasper's serif + red-orange, so we keep the accent redder, the base dark and avoid their layout.</p></div>
        <div className="s-box"><h3>Runner-up</h3><p><b>Switchboard</b> — expresses the "one input, many outputs" idea most literally and is very ownable, but its mono-heavy hardware look is a bigger usability bet.</p></div>
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
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (tab !== 'Concepts' || (e.target as HTMLElement).closest('input,textarea,select')) return
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % CONCEPTS.length)
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + CONCEPTS.length) % CONCEPTS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tab])
  return (
    <div className="s-app">
      <header className="s-head">
        <b>Fanout · Design Preview Studio</b>
        <span className="s-dev">dev only</span>
        <nav className="s-tabs">{TABS.map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
      </header>
      {tab === 'Research' && <ResearchTab />}
      {tab === 'Inspiration board' && <BoardTab />}
      {tab === 'Concepts' && <ConceptsTab idx={idx} setIdx={setIdx} />}
      {tab === 'Compare' && <CompareTab />}
      {tab === 'Accessibility' && <A11yTab />}
      {tab === 'Recommendation' && <RecTab go={() => setTab('Concepts')} />}
    </div>
  )
}

// Warm every concept's fonts up front so switching concepts doesn't flash the serif fallback
CONCEPTS.forEach((c) => [`${c.fonts.displayWeight} 16px "${c.fonts.display}"`, `400 16px "${c.fonts.body}"`, `400 16px "${c.fonts.mono}"`].forEach((f) => document.fonts.load(f)))

ReactDOM.createRoot(document.getElementById('root')!).render(<Studio />)
