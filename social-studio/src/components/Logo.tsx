import { useId } from 'react'

// Brand mark: three post cards fanned out — one idea, every platform.
// Same geometry as public/favicon.svg, minus the tile. `cutout` should match the surface behind it.
export function LogoMark({ size = 28, cutout = '#0B0712' }: { size?: number; cutout?: string }) {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="3.5 4.5 25 25" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset=".55" stopColor="#EC4899" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <g transform="translate(0 1.5)">
        <g stroke={cutout} strokeWidth="1.6">
          <rect x="10.5" y="6.5" width="11" height="15" rx="2.75" fill="#8B5CF6" transform="rotate(-22 16 27)" />
          <rect x="10.5" y="6.5" width="11" height="15" rx="2.75" fill="#F97316" transform="rotate(22 16 27)" />
          <rect x="10.5" y="6.5" width="11" height="15" rx="2.75" fill={`url(#${id})`} />
        </g>
        <path d="M13.5 16.5h5M13.5 19h3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export default function Logo({ size = 28, tagline = false }: { size?: number; tagline?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <div>
        <p className="font-display text-[15px] font-semibold leading-none tracking-tight text-mist-100">Fanout</p>
        {tagline && <p className="mt-1 text-[11px] leading-none text-mist-400">One idea, fanned out</p>}
      </div>
    </div>
  )
}
