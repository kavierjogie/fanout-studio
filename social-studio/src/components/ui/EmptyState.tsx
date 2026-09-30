import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children
}: {
  icon: LucideIcon
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-purple/12 text-signal-purple">
        <Icon size={20} />
      </span>
      <p className="mt-4 font-display text-base font-semibold text-mist-100">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-mist-400">{description}</p>
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  )
}
