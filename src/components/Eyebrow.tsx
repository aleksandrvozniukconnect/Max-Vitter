import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

type Props = {
  children: ReactNode
  /** Where the label sits, so it scales from that edge. */
  align?: 'center' | 'left'
  /** Extra content kept next to the label (not scaled). */
  after?: ReactNode
}

const MAX_SCALE = 4

/**
 * A section label that arrives large and shrinks to its normal size while the
 * section scrolls into full view, like the logo in the header.
 */
export function Eyebrow({ children, align = 'center', after }: Props) {
  const reduce = useReducedMotion()
  const box = useRef<HTMLParagraphElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  const [peak, setPeak] = useState(MAX_SCALE)
  const { scrollYProgress } = useScroll({ target: box, offset: ['start 100%', 'start 30%'] })
  const scale = useTransform(scrollYProgress, [0, 1], [peak, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.15, 1, 1])

  useEffect(() => {
    const fit = () => {
      const label = text.current
      const host = box.current
      if (!label || !host) return
      // Keep the enlarged label inside its column.
      const room = host.clientWidth / Math.max(1, label.offsetWidth)
      setPeak(Math.max(1, Math.min(MAX_SCALE, room * 0.92)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [children])

  return (
    <p className="eyebrow" ref={box} style={{ textAlign: align }}>
      <motion.span
        ref={text}
        style={{
          display: 'inline-block',
          transformOrigin: align === 'left' ? '0% 50%' : '50% 50%',
          ...(reduce ? {} : { scale, opacity }),
        }}
      >
        {children}
        {after}
      </motion.span>
    </p>
  )
}
