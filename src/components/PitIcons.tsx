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

export function CarIcon() {
  return (
    <Icon>
      <path d="M3 25h6l4-5h11l5 5h8" />
      <path d="M13 20l2-5h6" />
      <circle cx="10" cy="27" r="3" />
      <circle cx="30" cy="27" r="3" />
      <path d="M3 21v6M37 22v5" />
    </Icon>
  )
}

export function CabinetIcon() {
  return (
    <Icon>
      <rect x="8" y="6" width="24" height="26" rx="1" />
      <path d="M20 6v26M17 18v4M23 18v4M10 32v2M30 32v2" />
    </Icon>
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
      <rect x="4" y="16" width="32" height="9" rx="1" />
      <rect x="16" y="18" width="8" height="5" rx="2.5" />
      <path d="M8 16v-3M32 16v-3M20 30v4M16 34h8" />
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
