import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Copy, Check, AlertCircle } from 'lucide-react'

type Mode = 'html' | 'dom' | 'js'
interface LogLine { t: string; m: string }

const RUN_TIMEOUT_MS = 5000
const SETTLE_MS = 1500

// html: rendered as a page. dom: JS that touches document/window, runs in the page. js: plain JS, runs in a worker.
function runnableMode(language: string, code: string): Mode | null {
  const l = language.toLowerCase()
  if (l === 'html' || l === 'htm') return 'html'
  if (l === 'js' || l === 'javascript' || l === 'mjs') {
    return /\b(document|window|localStorage)\b/.test(code) ? 'dom' : 'js'
  }
  return null
}

// Everything runs in an iframe with sandbox="allow-scripts" (opaque origin: no app storage, cookies or parent DOM)
// and a CSP that blocks all network access. Plain JS additionally runs in a blob worker inside it, so the
// parent can drop the frame on timeout. ponytail: dom/html mode runs on the page's main thread — an infinite
// loop there can still freeze the tab; upgrade path is a watchdog worker or a separate-origin runner.
const CSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; worker-src blob:; child-src blob:">`

const FORMAT = `function(a){return Array.prototype.map.call(a,function(x){if(typeof x==='string')return x;try{return x===undefined?'undefined':JSON.stringify(x,null,2)}catch(e){return String(x)}}).join(' ')}`

const bridge = (id: number, doneOnLoad = true) =>
  `<script>(function(){var id=${id},f=${FORMAT};` +
  `var send=window.__send=function(t,m){parent.postMessage({run:id,t:t,m:m},'*')};` +
  `['log','info','warn','error','debug'].forEach(function(k){console[k]=function(){send(k,f(arguments))}});` +
  `addEventListener('error',function(e){send('fatal',e.message||'Script error')});` +
  `addEventListener('unhandledrejection',function(e){send('fatal',String((e.reason&&e.reason.message)||e.reason))});` +
  (doneOnLoad ? `addEventListener('load',function(){send('done')});` : '') +
  `})()</script>`

const WORKER_PRELUDE =
  `const f=${FORMAT};` +
  `for(const k of['log','info','warn','error','debug'])console[k]=(...a)=>postMessage({t:k,m:f(a)});` +
  `addEventListener('unhandledrejection',e=>postMessage({t:'fatal',m:String(e.reason?.message??e.reason)}));`

const jsString = (s: string) => JSON.stringify(s).replace(/</g, '\\u003c')

function buildDoc(mode: Mode, code: string, id: number): string {
  if (mode === 'html') {
    const head = CSP + bridge(id)
    if (/<head[^>]*>/i.test(code)) return code.replace(/<head[^>]*>/i, (m) => m + head)
    const doctype = /^\s*<!doctype[^>]*>/i.exec(code)
    return doctype ? doctype[0] + head + code.slice(doctype[0].length) : head + code
  }
  if (mode === 'dom') {
    return `${CSP}${bridge(id)}<body style="font-family:system-ui,sans-serif;margin:12px"><div id="root"></div><div id="app"></div><script>${code.replace(/<\/script/gi, '<\\/script')}</script></body>`
  }
  // Classic worker (module workers can't load from an opaque origin); the async wrapper allows top-level await.
  const workerSrc = `${WORKER_PRELUDE}(async()=>{\n${code}\n})().catch(e=>postMessage({t:'fatal',m:String(e)})).finally(()=>postMessage({t:'done'}))`
  return `${CSP}${bridge(id, false)}<script>
var send=window.__send,src=${jsString(workerSrc)};
var w=new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));
w.onmessage=function(e){send(e.data.t,e.data.m)};
w.onerror=function(e){e.preventDefault();send('fatal',(e.message||'Script error')+(e.lineno>1?' (line '+(e.lineno-1)+')':''));send('done')};
</script>`
}

interface Run { id: number; mode: Mode; doc: string | null }

export default function CodeRunner({ code, language }: { code: string; language: string }) {
  const mode = runnableMode(language, code)
  const [run, setRun] = useState<Run | null>(null)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const timers = useRef<number[]>([])
  const idRef = useRef(0)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const reset = () => {
    clearTimers()
    setRun(null)
    setLogs([])
    setError(null)
    setRunning(false)
  }

  // Edited or regenerated code invalidates any previous output.
  useEffect(() => {
    reset()
    return clearTimers
  }, [code, language])

  useEffect(() => {
    if (!run) return
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow || e.data?.run !== run.id) return
      const { t, m } = e.data
      if (t === 'fatal') {
        setError(String(m))
      } else if (t === 'done') {
        clearTimers()
        setRunning(false)
        if (run.mode === 'js') {
          // let timers/promises in the worker finish, then drop the frame (kills any leftover intervals)
          timers.current.push(window.setTimeout(() => setRun((r) => r && { ...r, doc: null }), SETTLE_MS))
        }
      } else {
        setLogs((l) => [...l, { t, m: String(m) }])
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [run])

  if (!mode) return null

  const start = () => {
    clearTimers()
    const id = ++idRef.current
    setLogs([])
    setError(null)
    setRunning(true)
    setRun({ id, mode, doc: buildDoc(mode, code, id) })
    timers.current.push(
      window.setTimeout(() => {
        setError(`Timed out after ${RUN_TIMEOUT_MS / 1000}s. The code may contain an infinite loop or never finish.`)
        setRun((r) => r && { ...r, doc: null })
        setRunning(false)
      }, RUN_TIMEOUT_MS)
    )
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  const btn = 'flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const preview = run && run.mode !== 'js'
  const finishedClean = run && !running && !error && logs.length === 0

  return (
    <div onClick={(e) => e.stopPropagation()} className="cursor-default space-y-3">
      <div className="flex flex-wrap items-center gap-2 select-none">
        <button
          onClick={start}
          disabled={running}
          className={`${btn} border-transparent bg-signal-purple hover:bg-signal-purple/85 text-white shadow-lg`}
        >
          <Play size={12} />
          {running ? 'Running…' : run ? 'Run Again' : 'Run Code'}
        </button>
        <button onClick={reset} disabled={!run} className={`${btn} bg-white/5 hover:bg-white/10 text-mist-300`}>
          <RotateCcw size={12} />
          Reset
        </button>
        <button onClick={copy} className={`${btn} bg-white/5 hover:bg-white/10 text-mist-300`}>
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy Code'}
        </button>
      </div>

      {run && (
        <div className="rounded-xl border border-white/10 bg-ink-950/80 overflow-hidden text-xs" role="region" aria-label="Code output">
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5 select-none">
            <span className="font-mono text-[11px] uppercase tracking-wider text-mist-400">Output</span>
            <span className={`text-[11px] ${running ? 'text-amber-300' : error ? 'text-red-400' : 'text-emerald-400'}`}>
              {running ? 'Running…' : error ? 'Failed' : 'Finished'}
            </span>
          </div>

          {run.doc && (
            <iframe
              ref={frameRef}
              key={run.id}
              title="Code output preview"
              sandbox="allow-scripts"
              srcDoc={run.doc}
              className={preview ? 'block w-full h-56 sm:h-72 bg-white' : 'hidden'}
            />
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 sm:p-4 bg-red-500/5 border-t border-red-500/20 text-red-300" role="alert">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <pre className="whitespace-pre-wrap break-words font-mono">{error}</pre>
            </div>
          )}

          {logs.length > 0 && (
            <div className="p-3 sm:p-4 font-mono leading-relaxed max-h-64 overflow-auto border-t border-white/5 first:border-t-0">
              {logs.map((l, i) => (
                <pre
                  key={i}
                  className={`whitespace-pre-wrap break-words ${l.t === 'error' ? 'text-red-300' : l.t === 'warn' ? 'text-amber-300' : 'text-mist-100'}`}
                >
                  {l.m}
                </pre>
              ))}
            </div>
          )}

          {finishedClean && run.mode === 'js' && (
            <p className="p-3 sm:p-4 text-mist-400">Ran successfully with no console output.</p>
          )}
        </div>
      )}
    </div>
  )
}
