import type { ReactNode } from 'react'
import type { StepKey } from '../content/site'

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function MetronomeIcon() {
  return (
    <Icon>
      <path d="M14 34h12l-3-26h-6z" />
      <path d="M20 26l7-13" />
      <circle cx="25.5" cy="15.5" r="1.5" />
    </Icon>
  )
}

const stationIcons: Record<StepKey, ReactNode> = {
  consult: (
    <>
      <path d="M9 5h15l6 6v24H9z" />
      <path d="M24 5v6h6M13 16h10M13 20h6" />
      <circle cx="22" cy="26" r="4" />
      <path d="M25 29l4 4" />
    </>
  ),
  design: (
    <>
      <path d="M7 33V9l24 24z" />
      <path d="M12 28v-7l7 7z" />
      <path d="M7 14h3M7 19h3M7 24h3" />
    </>
  ),
  confirm: (
    <>
      <path d="M8 5h17v30H8z" />
      <path d="M12 11h9M12 15h9M12 19h5" />
      <path d="M22 30l10-10 2 2-10 10h-2z" />
    </>
  ),
  manufacture: (
    <>
      <circle cx="20" cy="20" r="8" />
      <circle cx="20" cy="20" r="2" />
      <path d="M20 6v4M20 30v4M6 20h4M30 20h4M10 10l3 3M27 27l3 3M30 10l-3 3M13 27l-3 3" />
    </>
  ),
  deliver: (
    <>
      <path d="M5 13l15-7 15 7v15l-15 7-15-7z" />
      <path d="M5 13l15 7 15-7M20 20v15" />
      <path d="M11 16.5v6M29 16.5v6" />
    </>
  ),
  support: (
    <>
      <path d="M4 7h17a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4z" />
      <path d="M23 9h4v5h-4M27 11.5h8" />
      <path d="M9 16l-2 11h7l1.5-11M6 27h9v3H6z" />
      <g transform="translate(18 18) scale(0.85)" strokeWidth="1.2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </g>
    </>
  ),
}

export function StationIcon({ step }: { step: StepKey }) {
  return <Icon>{stationIcons[step]}</Icon>
}

export function TrafficLight({ go }: { go: boolean }) {
  return (
    <svg viewBox="0 0 16 40" width="14" height="36" aria-hidden="true">
      <rect x="1" y="1" width="14" height="38" rx="3" fill="var(--ink)" />
      <circle cx="8" cy="10" r="4" fill={go ? '#3a3d44' : 'var(--stop)'} />
      <circle cx="8" cy="20" r="4" fill="#3a3d44" />
      <circle cx="8" cy="30" r="4" fill={go ? 'var(--go)' : '#3a3d44'} />
    </svg>
  )
}
