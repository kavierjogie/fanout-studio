import { ReactNode } from 'react'

// Animates height both ways; `invisible` keeps closed content out of the tab order
export default function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out ${
        open ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}
