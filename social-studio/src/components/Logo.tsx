// Brand mark: three post cards fanned out — one idea, every platform.
// Same geometry as public/favicon.svg, minus the tile. `cutout` should match the surface behind it.
// Wayfinder colours: white lead card, amber and grey behind it.
export function LogoMark({ size = 28, cutout = '#111214' }: { size?: number; cutout?: string }) {
  return (
    <svg width={size} height={size} viewBox="3.5 4.5 25 25" aria-hidden="true" className="shrink-0">
      <g transform="translate(0 1.5)">
        <g stroke={cutout} strokeWidth="1.6">
          <rect x="10.5" y="6.5" width="11" height="15" rx="2" fill="#FFC94A" transform="rotate(-22 16 27)" />
          <rect x="10.5" y="6.5" width="11" height="15" rx="2" fill="#C2C3C0" transform="rotate(22 16 27)" />
          <rect x="10.5" y="6.5" width="11" height="15" rx="2" fill="#F4F4F2" />
        </g>
        <path d="M13.5 16.5h5M13.5 19h3" stroke="#111214" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export default function Logo({ size = 28, tagline = false }: { size?: number; tagline?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <div>
        <p className="font-display text-[24px] leading-none text-mist-100">Fanout</p>
        {tagline && <p className="mt-1 text-xs leading-none text-mist-400">One idea, fanned out</p>}
      </div>
    </div>
  )
}
