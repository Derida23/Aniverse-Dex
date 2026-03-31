import { useState } from 'react'

export function useSynopsisToggle(text: string | null, maxLines = 5) {
  const [expanded, setExpanded] = useState(false)
  const isLong =
    (text?.split('\n').length ?? 0) > maxLines || (text?.length ?? 0) > 300
  return { expanded, toggle: () => setExpanded(!expanded), isLong }
}
