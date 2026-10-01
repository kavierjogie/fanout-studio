import { useState, useRef, useEffect } from 'react'
import { Copy, Check, Edit2, Save, X, Download, RefreshCw, AlertCircle } from 'lucide-react'
import PlatformIcon from './PlatformIcon'
import CodeRunner from './CodeRunner'
import { platformMeta } from '../data/platforms'
import { Platform, GeneratedPiece } from '../types'

interface RecentPostEditorProps {
  platform: Platform
  content: string
  imageUrl?: string
  imagePrompt?: string
  imageGenerating?: boolean
  imageError?: string
  topic?: string
  tone?: string
  onUpdate: (newContent: string) => void
  onUpdateImage?: (newFields: Partial<GeneratedPiece>) => void
}

interface ParsedCodeSnippet {
  explanation: string
  code: string
  language: string
  takeaways: string
}

function parseCodeSnippet(content: string): ParsedCodeSnippet {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/
  const match = codeBlockRegex.exec(content)
  
  if (match) {
    const language = match[1] || 'javascript'
    const code = match[2].trim()
    const index = match.index
    const explanation = content.substring(0, index).trim()
    const takeaways = content.substring(index + match[0].length).trim()
    return { explanation, code, language, takeaways }
  }
  
  return {
    explanation: content,
    code: '',
    language: '',
    takeaways: ''
  }
}

function highlightCode(line: string, language: string): React.ReactNode[] {
  if (!line) return [<span key="empty" className="text-transparent"> </span>]

  if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
    return [<span key="comment" className="text-mist-400/60 italic">{line}</span>]
  }

  const tokensRegex = /(["'`])(.*?)\1|\b(const|let|var|function|return|class|import|export|from|default|extends|if|else|for|while|do|switch|case|try|catch|finally|async|await|def|elif|print|in|is|not|and|or|void)\b|([0-9]+)/g

  const parts: { text: string; type: 'text' | 'keyword' | 'string' | 'number' }[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tokensRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: line.substring(lastIndex, match.index), type: 'text' })
    }

    if (match[1]) {
      parts.push({ text: match[0], type: 'string' })
    } else if (match[3]) {
      parts.push({ text: match[0], type: 'keyword' })
    } else if (match[4]) {
      parts.push({ text: match[0], type: 'number' })
    } else {
      parts.push({ text: match[0], type: 'text' })
    }
    lastIndex = tokensRegex.lastIndex
  }

  if (lastIndex < line.length) {
    parts.push({ text: line.substring(lastIndex), type: 'text' })
  }

  return parts.map((part, index) => {
    if (part.type === 'keyword') {
      return <span key={index} className="text-signal-pink font-semibold">{part.text}</span>
    }
    if (part.type === 'string') {
      return <span key={index} className="text-amber-300">{part.text}</span>
    }
    if (part.type === 'number') {
      return <span key={index} className="text-signal-orange">{part.text}</span>
    }
    return <span key={index}>{part.text}</span>
  })
}

function CodeTerminal({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  const lines = code.split('\n')

  return (
    <div className="rounded-xl border border-white/10 bg-ink-950/80 overflow-hidden font-mono text-xs my-3 shadow-2xl relative select-text">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/5 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/85"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/85"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/85"></span>
        </div>
        <span className="text-mist-400 font-mono text-[10px] uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="text-mist-400 hover:text-mist-100 flex items-center gap-1 text-[10px] transition-colors"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* Terminal Content */}
      <div className="p-4 overflow-x-auto max-h-[300px] flex leading-relaxed">
        {/* Line numbers */}
        <div className="text-mist-400/40 select-none text-right pr-4 border-r border-white/5 min-w-[2rem]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Code body */}
        <pre className="pl-4 text-mist-100 flex-1 whitespace-pre">
          <code>
            {lines.map((line, i) => (
              <div key={i}>{highlightCode(line, language)}</div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default function RecentPostEditor({
  platform,
  content,
  imageUrl,
  imagePrompt,
  imageGenerating = false,
  imageError,
  topic,
  tone,
  onUpdate,
  onUpdateImage
}: RecentPostEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const meta = platformMeta(platform)
  const limit = meta?.charLimit
  const currentLength = editedContent.length

  let isApproaching = false
  let isExceeded = false
  let statusText = '✓ Within limit'
  let statusColorClass = 'text-emerald-400'
  let barColorClass = 'bg-emerald-500'

  if (limit) {
    isExceeded = currentLength > limit
    isApproaching = !isExceeded && currentLength >= limit * 0.85

    if (isExceeded) {
      statusText = `❌ Limit exceeded by ${currentLength - limit} character${currentLength - limit === 1 ? '' : 's'}`
      statusColorClass = 'text-red-400'
      barColorClass = 'bg-red-500'
    } else if (isApproaching) {
      statusText = `⚠️ Approaching limit (${limit - currentLength} left)`
      statusColorClass = 'text-amber-400'
      barColorClass = 'bg-amber-500'
    } else {
      statusText = '✓ Within limit'
      statusColorClass = 'text-emerald-400'
      if (meta.accent === 'purple') {
        barColorClass = 'bg-signal-purple'
      } else if (meta.accent === 'pink') {
        barColorClass = 'bg-signal-pink'
      } else if (meta.accent === 'orange') {
        barColorClass = 'bg-signal-orange'
      }
    }
  }

  // Adjust height to fit the text content
  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    if (isEditing) {
      adjustHeight()
    }
  }, [isEditing, editedContent])

  // Sync state if content prop changes externally
  useEffect(() => {
    setEditedContent(content)
  }, [content])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleSave = () => {
    onUpdate(editedContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContent(content)
    setIsEditing(false)
  }

  const handleDownloadImage = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!imageUrl) return
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `${platform}-image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Failed to download image', err)
      window.open(imageUrl, '_blank')
    }
  }

  const handleRegenerateImage = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onUpdateImage || !topic || !tone) return
    onUpdateImage({ imageGenerating: true, imageError: undefined })
    try {
      const { generateImage } = await import('../lib/generator')
      const { prompt, url } = await generateImage(topic, tone)
      onUpdateImage({
        imageUrl: url,
        imagePrompt: prompt,
        imageGenerating: false
      })
    } catch (err: any) {
      console.error(err)
      onUpdateImage({
        imageGenerating: false,
        imageError: err.message || 'Failed to generate image.'
      })
    }
  }

  // A helper function to parse simple Markdown formatting (bold, italic, list items, headers)
  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-mist-400 italic">Empty draft</p>;
    
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-lg font-bold text-mist-100 mt-2 mb-1">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-base font-bold text-mist-100 mt-2 mb-1">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold text-mist-100 mt-2 mb-1">{line.slice(4)}</h3>;
      }
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = line.trim().slice(2);
        return (
          <ul key={idx} className="list-disc list-inside ml-2 text-mist-300">
            <li className="leading-relaxed text-sm inline-block">{parseInlineMarkdown(itemContent)}</li>
          </ul>
        );
      }
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        const [, num, itemContent] = numMatch;
        return (
          <ol key={idx} className="list-decimal list-inside ml-2 text-mist-300">
            <li className="leading-relaxed text-sm inline-block">{parseInlineMarkdown(itemContent)}</li>
          </ol>
        );
      }
      return (
        <p key={idx} className="min-h-[1.25rem] leading-relaxed text-sm text-mist-300 font-body">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  }

  const parseInlineMarkdown = (text: string) => {
    return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-mist-100">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  }

  const isImagePlatform = ['instagram', 'linkedin', 'blog', 'x', 'promo'].includes(platform)
  const parsedCode = platform === 'code' ? parseCodeSnippet(content) : null
  const showCodePreview = platform === 'code' && parsedCode && parsedCode.code && !isEditing

  return (
    <div className="border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] p-4 transition duration-200 group">
      {/* Header of the piece card */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3 select-none">
        <span className="flex items-center gap-2 text-xs font-semibold text-mist-300">
          <PlatformIcon platform={platform} size={13} />
          {meta?.label || platform}
        </span>
        <div className="flex items-center gap-3 font-medium">
          {!isEditing && platform === 'code' && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-[11px] text-mist-400 hover:text-mist-100 transition-colors"
            >
              ✍️ Edit Markdown
            </button>
          )}
          {!isEditing && platform !== 'code' && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-[11px] text-mist-400 hover:text-mist-100 transition-colors"
            >
              <Edit2 size={11} />
              Edit
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-mist-400 hover:text-mist-100 transition-colors"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor / Viewer Body */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder={`Write copy for ${meta?.label || platform}...`}
            className="w-full min-h-[100px] bg-white/[0.02] hover:bg-white/[0.03] border border-white/10 hover:border-white/15 focus:border-signal-purple/50 rounded-xl p-3 resize-none outline-none font-body text-sm leading-relaxed text-mist-100 placeholder:text-mist-400/30 transition focus:ring-0"
          />

          {/* Action buttons + character limit status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Character limit bar */}
            <div className="flex-1 min-w-[200px] select-none">
              <div className="flex justify-between items-center text-[10px] font-mono text-mist-400 mb-1">
                <span>
                  {limit ? (
                    <>
                      <span className={isExceeded ? 'text-red-400 font-semibold' : isApproaching ? 'text-amber-400' : 'text-mist-100'}>
                        {currentLength.toLocaleString()}
                      </span>
                      <span> / {limit.toLocaleString()}</span>
                    </>
                  ) : (
                    <span>{currentLength.toLocaleString()} characters</span>
                  )}
                </span>
                {limit && <span className={statusColorClass}>{statusText}</span>}
              </div>
              {limit && (
                <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${barColorClass}`}
                    style={{ width: `${(Math.min(currentLength, limit) / limit) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 select-none">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-mist-400 hover:text-mist-300 border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
              >
                <X size={12} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white bg-signal-purpleDeep hover:shadow-glow transition hover:scale-[1.02]"
              >
                <Save size={12} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : showCodePreview ? (
        <div 
          onClick={() => setIsEditing(true)}
          className="cursor-pointer space-y-2 hover:bg-white/[0.005] p-2.5 -m-2.5 rounded-lg transition-colors group/terminal relative"
        >
          {parsedCode.explanation && (
            <p className="text-sm leading-relaxed text-mist-100 font-body">{parsedCode.explanation}</p>
          )}
          <CodeTerminal code={parsedCode.code} language={parsedCode.language} />
          <CodeRunner code={parsedCode.code} language={parsedCode.language} />
          {parsedCode.takeaways && (
            <div className="text-sm leading-relaxed text-mist-300 mt-2">
              {parsedCode.takeaways.split('\n').map((line, i) => {
                if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                  return (
                    <div key={i} className="flex gap-2 items-start mt-1 pl-1">
                      <span className="text-signal-purple">•</span>
                      <span>{line.replace(/^[-*]\s*/, '')}</span>
                    </div>
                  )
                }
                return <p key={i} className="mt-1">{line}</p>
              })}
            </div>
          )}
          <div className="pointer-events-none absolute right-2 top-2 opacity-0 group-hover/terminal:opacity-40 transition-opacity text-[10px] text-mist-400 font-mono select-none bg-ink-950/80 px-1.5 py-0.5 rounded border border-white/5">
            ✍️ Click content to edit raw markdown
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="cursor-pointer relative overflow-hidden rounded-lg p-2.5 -m-2.5 space-y-1.5 hover:bg-white/[0.01] transition-colors duration-200 select-text"
        >
          {renderMarkdown(content)}
          <div className="pointer-events-none absolute right-2 bottom-2 opacity-0 group-hover:opacity-60 transition-opacity text-[9px] text-mist-400 font-mono flex items-center gap-1 bg-ink-950/80 px-1.5 py-0.5 rounded border border-white/5 select-none">
            ✍️ Click to edit
          </div>
        </div>
      )}

      {/* Image Preview Area */}
      {!isEditing && (isImagePlatform || imageUrl || imageGenerating || imageError) && (
        <div className="mt-4 border-t border-white/5 pt-3.5">
          <label className="text-[11px] font-semibold text-mist-300 flex items-center gap-1.5 mb-2 select-none">
            🎨 AI Visual Asset
          </label>
          
          {imageGenerating ? (
            <div className="w-full aspect-[16/9] rounded-xl border border-white/10 bg-white/[0.01] flex flex-col items-center justify-center relative overflow-hidden animate-pulse select-none">
              <div className="absolute inset-0 bg-grad-panel opacity-20 blur-xl"></div>
              <RefreshCw size={20} className="text-signal-purple animate-spin" />
              <span className="mt-2 text-xs text-mist-300 font-medium">Generating visual prompt & rendering...</span>
            </div>
          ) : imageError ? (
            <div className="w-full p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2 text-red-300 text-xs">
                <AlertCircle size={15} />
                <span>{imageError}</span>
              </div>
              {topic && tone && onUpdateImage && (
                <button
                  onClick={handleRegenerateImage}
                  className="shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white bg-red-500/25 hover:bg-red-500/40 transition"
                >
                  <RefreshCw size={12} />
                  Retry Image
                </button>
              )}
            </div>
          ) : imageUrl ? (
            <div className="relative group/img w-fit max-w-full mx-auto rounded-xl border border-white/10 overflow-hidden bg-black/20">
              <img
                src={imageUrl}
                alt={imagePrompt || 'Generated concept'}
                className="block w-auto h-auto max-w-full max-h-[min(70vh,640px)] transition-transform duration-500 group-hover/img:scale-[1.01]"
              />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/50 opacity-0 group-hover/img:opacity-100 group-focus-within/img:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 select-none">
                <div className="flex justify-end gap-2">
                  {topic && tone && onUpdateImage && (
                    <button
                      onClick={handleRegenerateImage}
                      className="flex items-center gap-1 rounded-lg bg-black/70 hover:bg-black/90 border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-mist-100 transition-colors"
                    >
                      <RefreshCw size={12} />
                      Regenerate
                    </button>
                  )}
                  <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-1 rounded-lg bg-signal-purple hover:bg-signal-purple/85 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors shadow-lg"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
                
                {imagePrompt && (
                  <div className="bg-black/50 backdrop-blur-sm border border-white/5 rounded-lg p-2.5">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-signal-purple mb-0.5">Visual Prompt</p>
                    <p className="text-xs text-mist-300 line-clamp-2 leading-relaxed">{imagePrompt}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            topic && tone && onUpdateImage && (
              <div 
                onClick={handleRegenerateImage}
                className="w-full aspect-[16/9] rounded-xl border border-dashed border-white/15 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col items-center justify-center transition-colors cursor-pointer select-none group/placeholder"
              >
                <span className="text-xs text-mist-400">No image generated yet</span>
                <button
                  className="mt-2 flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/10 group-hover/placeholder:border-white/20 px-3 py-1.5 text-xs font-semibold text-mist-300 transition-colors"
                >
                  <RefreshCw size={11} className="group-hover/placeholder:rotate-180 transition-transform duration-500" />
                  Generate AI Image
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
