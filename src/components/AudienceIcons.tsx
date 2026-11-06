import type { ReactNode } from 'react'

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
