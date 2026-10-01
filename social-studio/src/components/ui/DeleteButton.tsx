import { Trash2 } from 'lucide-react'

// Deletes in one click; the toast that follows offers Undo instead of a confirm step up front
export default function DeleteButton({ label, onDelete, className = '' }: { label: string; onDelete: () => void; className?: string }) {
  return (
    <button
      onClick={onDelete}
      className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-mist-400 transition-colors hover:bg-red-500/10 hover:text-red-300 ${className}`}
    >
      <Trash2 size={13} />
      {label}
    </button>
  )
}
