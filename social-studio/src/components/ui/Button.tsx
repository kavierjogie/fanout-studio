import { ButtonHTMLAttributes, ReactNode } from 'react'

type Intent = 'primary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  intent?: Intent
}

const intentClasses: Record<Intent, string> = {
  primary: 'bg-signal-purpleDeep text-white shadow-glow hover:brightness-110',
  ghost: 'bg-white/5 text-mist-100 border border-white/10 hover:bg-white/10'
}

export default function Button({ children, intent = 'ghost', className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${intentClasses[intent]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
