export function pickActiveCase<K extends string>(
  keys: readonly K[],
  ratios: Partial<Record<K, number>>,
  fallback: K,
): K {
  let best = fallback
  let bestRatio = -1
  for (const key of keys) {
    const ratio = ratios[key] ?? 0
    if (ratio > bestRatio) {
      bestRatio = ratio
      best = key
    }
  }
  return best
}

export function nextItem<T>(items: readonly T[], index: number): T | null {
  if (index < 0 || index >= items.length - 1) return null
  return items[index + 1] ?? null
}
