import type { ReactNode } from 'react'
import type { AudienceKey } from '../content/site'

function Icon({ children, size = 40 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
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

/** Checkered flag: one contract, one schedule, one finish. */
const developers = (
  <>
    <path d="M9 5v30" />
    <path d="M9 8h22v15H9z" />
    <g fill="currentColor" stroke="none">
      <rect x="9" y="8" width="5.5" height="5" />
      <rect x="20" y="8" width="5.5" height="5" />
      <rect x="14.5" y="13" width="5.5" height="5" />
      <rect x="25.5" y="13" width="5.5" height="5" />
      <rect x="9" y="18" width="5.5" height="5" />
      <rect x="20" y="18" width="5.5" height="5" />
    </g>
  </>
)

/** Drawing sheet with a joint detail and a dimension line: approved drawings and tolerances. */
const designers = (
  <>
    <path d="M8 5h17l7 7v23H8z" />
    <path d="M25 5v7h7" />
    <circle cx="19" cy="20" r="4" />
    <path d="M19 14v12M13 20h12" />
    <path d="M12 31h16M12 29v4M28 29v4" />
  </>
)

export function AudienceIcon({ audience }: { audience: AudienceKey }) {
  return <Icon>{audience === 'developers' ? developers : designers}</Icon>
}

/** Pencil: our own designer. */
export function DesignerIcon() {
  return (
    <Icon size={28}>
      <path d="M8 32l2-8L26 8l6 6-16 16z" />
      <path d="M22 12l6 6M10 24l6 6" />
      <path d="M8 32l5-1" />
    </Icon>
  )
}
