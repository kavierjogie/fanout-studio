import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Button from './ui/Button'
import { Platform, GeneratedPiece } from '../types'
import { regenerateForPlatform } from '../lib/generator'

interface RefinePieceProps {
  topic: string
  platform: Platform
  tone: string
  content: string
  existingPieces?: GeneratedPiece[]
  onSuccess: (newContent: string) => void
}

const SUGGESTIONS = [
  { label: 'Make it shorter', instruction: 'Make it shorter and more concise' },
  { label: 'Add emojis', instruction: 'Add more relevant emojis for visual texture and readability' },
  { label: 'Stronger hook', instruction: 'Change the hook to be much more engaging and scroll-stopping' },
  { label: 'More professional', instruction: 'Make the tone more professional and business-focused' }
]

export default function RefinePiece({
  topic,
  platform,
  tone,
  content,
  existingPieces,
  onSuccess
}: RefinePieceProps) {
  const [instruction, setInstruction] = useState('')
  const [refining, setRefining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefine = async (customInstruction?: string) => {
    const textToUse = customInstruction || instruction
    if (!textToUse.trim() || refining) return

    setRefining(true)
    setError(null)

    try {
      const revised = await regenerateForPlatform(
        topic,
        platform,
        tone,
        content,
        textToUse.trim(),
        existingPieces
      )
      onSuccess(revised)
      setInstruction('')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to refine content.')
    } finally {
      setRefining(false)
    }
  }

  return (
    <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-mist-300 flex items-center gap-1.5">
          <Sparkles size={12} className="text-signal-pink" />
          Refine post with AI
        </p>
        
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={refining}
              onClick={() => handleRefine(s.instruction)}
              className="rounded-lg bg-white/5 border border-white/5 px-2.5 py-1 text-xs text-mist-400 hover:text-mist-100 hover:border-white/10 transition-colors disabled:opacity-40"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            aria-label="Refine instruction"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={refining}
            placeholder="e.g., Make it punchier, write a hook, add a call-to-action..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-mist-50 placeholder:text-mist-400/50 focus:border-signal-pink/50 focus:outline-none disabled:opacity-40"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleRefine()
              }
            }}
          />
          <Button
            intent="social"
            onClick={() => handleRefine()}
            disabled={!instruction.trim() || refining}
            className="!px-3 !py-1 text-xs whitespace-nowrap"
          >
            {refining ? 'Refining...' : 'Rewrite'}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 font-mono">
          {error}
        </p>
      )}
    </div>
  )
}
