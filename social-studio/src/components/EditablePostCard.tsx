import { useState, useRef, useEffect } from 'react'
import { Copy, Check, Download, RefreshCw, AlertCircle, Trash2, Eye, Pencil, Image as ImageIcon } from 'lucide-react'
import Card from './ui/Card'
import PlatformIcon from './PlatformIcon'
import RefinePiece from './RefinePiece'
import { platformMeta } from '../data/platforms'
import { Platform, GeneratedPiece } from '../types'

interface EditablePostCardProps {
  topic: string
  platform: Platform
  tone: string
  content: string
  imageUrl?: string
  imagePrompt?: string
  imageGenerating?: boolean
  imageError?: string
  existingPieces?: GeneratedPiece[]
  onUpdate: (newContent: string) => void
  onUpdateImage?: (newFields: Partial<GeneratedPiece>) => void
  onDelete?: () => void
  showHeaderLabel?: boolean
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
        <span className="text-mist-400 font-mono text-[11px] uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="text-mist-400 hover:text-mist-100 flex items-center gap-1 text-[11px] transition-colors"
        >
          {copied ? 'Copied!' : 'Copy code'}
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

export default function EditablePostCard({
  topic,
  platform,
  tone,
  content,
  imageUrl,
  imagePrompt,
  imageGenerating = false,
  imageError,
  existingPieces,
  onUpdate,
  onUpdateImage,
  onDelete,
  showHeaderLabel = false
}: EditablePostCardProps) {
  const [copied, setCopied] = useState(false)
  const [isEditingCode, setIsEditingCode] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const meta = platformMeta(platform)
  const limit = meta?.charLimit
  const currentLength = content.length

  let isApproaching = false
  let isExceeded = false
  let statusText = 'Within limit'
  let statusColorClass = 'text-emerald-400'
  let barColorClass = 'bg-emerald-500'

  if (limit) {
    isExceeded = currentLength > limit
    isApproaching = !isExceeded && currentLength >= limit * 0.85

    if (isExceeded) {
      statusText = `Limit exceeded by ${currentLength - limit} character${currentLength - limit === 1 ? '' : 's'}`
      statusColorClass = 'text-red-400'
      barColorClass = 'bg-red-500'
    } else if (isApproaching) {
      statusText = `Approaching limit (${limit - currentLength} left)`
      statusColorClass = 'text-amber-400'
      barColorClass = 'bg-amber-500'
    } else {
      statusText = 'Within limit'
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
    adjustHeight()
    window.addEventListener('resize', adjustHeight)
    return () => window.removeEventListener('resize', adjustHeight)
  }, [content, isEditingCode])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
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
      console.error('Failed to download image, opening in new tab instead', err)
      window.open(imageUrl, '_blank')
    }
  }

  const handleRegenerateImage = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onUpdateImage) return
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

  const isImagePlatform = ['instagram', 'linkedin', 'blog', 'x', 'promo'].includes(platform)
  const parsedCode = platform === 'code' ? parseCodeSnippet(content) : null
  const showCodePreview = platform === 'code' && parsedCode && parsedCode.code && !isEditingCode

  return (
    <Card className="mt-4 flex flex-col gap-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-3 select-none">
        {showHeaderLabel ? (
          <span className="flex items-center gap-2 text-sm font-medium text-mist-100">
            <PlatformIcon platform={platform} size={14} />
            {meta?.label || platform}
          </span>
        ) : (
          <span className="flex items-center gap-2 text-xs font-mono text-mist-400 uppercase tracking-wider">
            Generated draft
          </span>
        )}
        <div className="flex items-center">
          {platform === 'code' && (
            <button
              onClick={() => setIsEditingCode(!isEditingCode)}
              className="flex items-center gap-1.5 text-xs font-medium text-mist-400 hover:text-mist-100 transition-colors mr-4"
            >
              {isEditingCode ? <Eye size={13} /> : <Pencil size={13} />}
              {isEditingCode ? 'Preview snippet' : 'Edit markdown'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium text-mist-300 hover:text-mist-100 transition-colors"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="ml-4 flex items-center gap-1.5 text-xs font-medium text-mist-400 hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Editable Content OR Code Preview */}
      {showCodePreview ? (
        <div 
          onClick={() => setIsEditingCode(true)}
          className="cursor-pointer space-y-2 hover:bg-white/[0.005] p-2 -m-2 rounded-lg transition-colors group/terminal relative"
        >
          {parsedCode.explanation && (
            <p className="text-sm leading-relaxed text-mist-100 font-body">{parsedCode.explanation}</p>
          )}
          <CodeTerminal code={parsedCode.code} language={parsedCode.language} />
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
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onUpdate(e.target.value)}
          aria-label={`${meta?.label || platform} draft`}
          placeholder="Edit generated draft..."
          className="w-full bg-transparent border border-white/5 hover:border-white/10 focus:border-white/20 rounded-lg p-2 resize-none overflow-hidden outline-none focus:ring-0 font-body text-sm leading-relaxed text-mist-100 placeholder:text-mist-400/50 hover:bg-white/[0.01] focus:bg-white/[0.02] transition-colors"
        />
      )}

      {/* Image Preview Area */}
      {(isImagePlatform || imageUrl || imageGenerating || imageError) && (
        <div className="mt-3 border-t border-white/5 pt-3">
          <p className="text-xs font-semibold text-mist-300 flex items-center gap-1.5 mb-2 select-none">
            <ImageIcon size={13} />
            AI visual asset
          </p>
          
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
              <button
                onClick={handleRegenerateImage}
                className="shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white bg-red-500/25 hover:bg-red-500/40 transition-all"
              >
                <RefreshCw size={12} />
                Retry image
              </button>
            </div>
          ) : imageUrl ? (
            <div className="relative group/img rounded-xl border border-white/10 overflow-hidden bg-black/20">
              <img
                src={imageUrl}
                alt={imagePrompt || 'Generated concept'}
                className="w-full max-h-[360px] object-cover transition-transform duration-500 group-hover/img:scale-[1.01]"
              />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/50 opacity-0 group-hover/img:opacity-100 group-focus-within/img:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 select-none">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleRegenerateImage}
                    className="flex items-center gap-1 rounded-lg bg-black/70 hover:bg-black/90 border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-mist-100 transition-colors"
                  >
                    <RefreshCw size={12} />
                    Regenerate
                  </button>
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
                    <p className="font-mono text-[11px] uppercase tracking-wider text-signal-purple mb-0.5">Visual prompt</p>
                    <p className="text-xs text-mist-300 line-clamp-2 leading-relaxed">{imagePrompt}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[16/9] rounded-xl border border-dashed border-white/15 bg-white/[0.01] flex flex-col items-center justify-center select-none group/placeholder">
              <span className="text-xs text-mist-400">No image generated yet</span>
              <button
                onClick={handleRegenerateImage}
                className="mt-2 flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/10 group-hover/placeholder:border-white/20 px-3 py-1.5 text-xs font-semibold text-mist-300 transition-colors"
              >
                <RefreshCw size={11} className="group-hover/placeholder:rotate-180 transition-transform duration-500" />
                Generate AI image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Character Count & Progress Visuals */}
      <div className="mt-2 border-t border-white/5 pt-3 select-none">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="font-mono text-xs text-mist-400">
            {limit ? (
              <>
                <span className={isExceeded ? 'text-red-400 font-semibold' : isApproaching ? 'text-amber-400' : 'text-mist-100'}>
                  {currentLength.toLocaleString()}
                </span>
                <span className="text-mist-400/60"> / {limit.toLocaleString()} characters</span>
              </>
            ) : (
              <span>{currentLength.toLocaleString()} characters</span>
            )}
          </span>
          {limit && (
            <span className={`text-xs font-semibold ${statusColorClass} flex items-center gap-1`}>
              {statusText}
            </span>
          )}
        </div>

        {limit && (
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${barColorClass}`}
              style={{ width: `${(Math.min(currentLength, limit) / limit) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* AI Refinement Tools */}
      <RefinePiece
        topic={topic}
        platform={platform}
        tone={tone}
        content={content}
        existingPieces={existingPieces}
        onSuccess={onUpdate}
      />
    </Card>
  )
}
