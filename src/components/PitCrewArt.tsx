import { crewSpots, type CrewRole } from '../content/crew'

type Props = {
  roles: Record<CrewRole, string>
}

const RED = '#c4271d'
const RED_DARK = '#8e1a13'
const INK = '#111318'

/** A figure seen from above: shoulders, helmet and a tool arm. */
function Person({ x, y, facing }: { x: number; y: number; facing: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${facing})`} filter="url(#pc-sketch)">
      <ellipse cx="0" cy="2" rx="22" ry="12" fill={RED} stroke={INK} strokeWidth="2" />
      <path d="M-12 -4 L-24 -26 M12 -4 L24 -26" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M-12 -4 L-24 -26 M12 -4 L24 -26" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-6" r="10" fill={RED_DARK} stroke={INK} strokeWidth="2" />
      <path d="M-6 -9 Q0 -14 6 -9" fill="none" stroke="#f4efe9" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

export function PitCrewArt({ roles }: Props) {
  return (
    <svg viewBox="0 0 800 600" role="img" aria-label="" className="pitcrew-art" focusable="false">
      <defs>
        <filter id="pc-sketch" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
        </filter>
      </defs>
      <rect width="800" height="600" fill="#e8e1da" />
      {/* pit lane */}
      <g filter="url(#pc-sketch)">
        <rect x="205" y="0" width="390" height="600" fill="#cfc7bf" stroke={INK} strokeWidth="2" />
        <path d="M205 120 H595 M205 480 H595" stroke={INK} strokeWidth="1.5" strokeDasharray="10 8" opacity="0.5" />
        <path d="M400 30 V120" stroke={INK} strokeWidth="2" opacity="0.4" />
        <path d="M400 95 L388 75 M400 95 L412 75" stroke="#d9a21b" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* car, top view, nose up */}
      <g filter="url(#pc-sketch)" transform="translate(400 300)">
        <rect x="-70" y="-165" width="140" height="18" rx="3" fill={RED} stroke={INK} strokeWidth="2.5" />
        <rect x="-16" y="-148" width="32" height="70" fill={RED} stroke={INK} strokeWidth="2.5" />
        <path d="M-34 -80 L34 -80 L40 40 L26 110 L-26 110 L-40 40 Z" fill={RED} stroke={INK} strokeWidth="2.5" />
        <path d="M0 -60 V90" stroke="#f4efe9" strokeWidth="5" opacity="0.8" />
        <ellipse cx="0" cy="8" rx="13" ry="20" fill={INK} />
        <circle cx="0" cy="0" r="8" fill={RED_DARK} stroke="#f4efe9" strokeWidth="2" />
        <rect x="-96" y="-132" width="38" height="62" rx="8" fill={INK} />
        <rect x="58" y="-132" width="38" height="62" rx="8" fill={INK} />
        <rect x="-102" y="48" width="44" height="74" rx="9" fill={INK} />
        <rect x="58" y="48" width="44" height="74" rx="9" fill={INK} />
        <rect x="-62" y="122" width="124" height="28" rx="3" fill={RED} stroke={INK} strokeWidth="2.5" />
        <path d="M-52 150 L-34 150 M34 150 L52 150" stroke="#f4efe9" strokeWidth="3" />
      </g>
      {crewSpots.map((spot) => (
        <g key={spot.role}>
          <Person x={spot.x} y={spot.y} facing={spot.facing} />
          <g transform={`translate(${spot.tag === 'left' ? spot.x - 36 : spot.x + 36} ${spot.y + 5})`}>
            <text
              textAnchor={spot.tag === 'left' ? 'end' : 'start'}
              fontFamily="Oswald, 'Arial Narrow', sans-serif"
              fontSize="17"
              letterSpacing="0.04em"
              fill={INK}
            >
              {roles[spot.role].toLocaleUpperCase()}
            </text>
          </g>
        </g>
      ))}
    </svg>
  )
}
