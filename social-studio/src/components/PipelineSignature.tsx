import { Platform } from '../types'
import PlatformIcon from './PlatformIcon'

interface PipelineSignatureProps {
  selectedPlatforms?: Platform[]
  onTogglePlatform?: (platform: Platform) => void
  isGenerating?: boolean
  className?: string
}

const targets = [
  { id: 'linkedin' as Platform, label: 'LinkedIn', y: 40, color: '#0A66C2' },
  { id: 'instagram' as Platform, label: 'Instagram', y: 100, color: '#E1306C' },
  { id: 'tiktok' as Platform, label: 'TikTok', y: 160, color: '#25F4EE' },
  { id: 'x' as Platform, label: 'X', y: 220, color: '#FFFFFF' }
]

export default function PipelineSignature({
  selectedPlatforms,
  onTogglePlatform,
  isGenerating = false,
  className = ''
}: PipelineSignatureProps) {
  return (
    <div className={className}>
      <svg viewBox="14 8 436 244" className="w-full h-auto" role="img" aria-label="One idea transforming into four platform-ready formats">
        {/* source node */}
        <g className={isGenerating ? "animate-pulse" : ""} style={{ transformOrigin: '60px 130px' }}>
          <circle cx="60" cy="130" r="34" fill="#26221D" stroke="#FF5A3C" strokeWidth={isGenerating ? 2.5 : 1.5} className="transition duration-300" />
          {isGenerating && (
            <circle cx="60" cy="130" r="42" fill="none" stroke="#FF5A3C" strokeWidth="1.5" opacity="0.4" className="animate-ping" style={{ transformOrigin: '60px 130px', animationDuration: '1.5s' }} />
          )}
          <text x="60" y="126" textAnchor="middle" fontSize="11" fill="#F3ECDF" fontFamily="IBM Plex Mono, monospace" fontWeight="500" letterSpacing="0.08em" className="select-none pointer-events-none">
            YOUR
          </text>
          <text x="60" y="140" textAnchor="middle" fontSize="11" fill="#F3ECDF" fontFamily="IBM Plex Mono, monospace" fontWeight="500" letterSpacing="0.08em" className="select-none pointer-events-none">
            IDEA
          </text>
        </g>

        {/* dynamic platform lines and nodes */}
        {targets.map((t, i) => {
          const isActive = selectedPlatforms ? selectedPlatforms.includes(t.id) : true
          const strokeColor = isActive ? t.color : '#3A342C'
          const labelColor = isActive ? '#F3ECDF' : '#4A4339'
          const iconColor = isActive ? t.color : '#4A4339'
          const pathOpacity = isActive ? (isGenerating ? 0.95 : 0.65) : 0.15
          const nodeOpacity = isActive ? 1.0 : 0.35

          return (
            <g
              key={t.id}
              onClick={() => onTogglePlatform?.(t.id)}
              className={`transition duration-300 ${onTogglePlatform ? 'cursor-pointer select-none group' : ''}`}
            >
              {/* connecting line */}
              <path
                d={`M94,130 C220,130 220,${t.y} 330,${t.y}`}
                fill="none"
                stroke="#FF5A3C"
                strokeWidth={isActive ? (isGenerating ? 2.5 : 1.5) : 1}
                strokeDasharray={isActive ? (isGenerating ? "4 4" : "6 6") : undefined}
                className={isActive && isGenerating ? "animate-flow-fast" : ""}
                opacity={pathOpacity}
                style={{ transition: 'all 0.3s' }}
              />

              {/* flow pulse dot along path */}
              {isActive && (
                <g transform={`translate(330, ${t.y})`}>
                  <circle
                    cx="-40"
                    cy="0"
                    r="3"
                    fill={t.color}
                    className={isGenerating ? "animate-pulseDot" : ""}
                    style={{
                      transformOrigin: `-40px 0px`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                </g>
              )}

              {/* platform node group (circle & icon) */}
              <g
                transform={`translate(330, ${t.y})`}
                className="transition-transform duration-300 group-hover:scale-110"
                style={{ transformOrigin: '0px 0px' }}
              >
                {/* glow ripple ring when generating */}
                {isActive && isGenerating && (
                  <circle
                    r="28"
                    fill="none"
                    stroke={t.color}
                    strokeWidth="1.5"
                    opacity="0.5"
                    className="animate-ping"
                    style={{
                      transformOrigin: '0px 0px',
                      animationDuration: '1.5s',
                      animationDelay: `${i * 0.25}s`
                    }}
                  />
                )}
                <circle
                  r="22"
                  fill="#1C1915"
                  stroke={strokeColor}
                  strokeWidth={isActive ? 1.5 : 1}
                  opacity={nodeOpacity}
                  className="transition duration-300 group-hover:stroke-accent-soft"
                />
                <foreignObject
                  x="-11"
                  y="-11"
                  width="22"
                  height="22"
                  opacity={nodeOpacity}
                  className="transition duration-300 pointer-events-none"
                >
                  <div style={{ color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22 }}>
                    <PlatformIcon platform={t.id} size={14} className="transition-colors duration-300 group-hover:text-accent-soft" />
                  </div>
                </foreignObject>
              </g>

              {/* platform label text */}
              <text
                x="362"
                y={t.y + 4}
                fontSize="13"
                fill={labelColor}
                fontFamily="Inter Tight, sans-serif"
                fontWeight={isActive ? "600" : "400"}
                className="transition duration-300 select-none group-hover:fill-mist-100"
              >
                {t.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
