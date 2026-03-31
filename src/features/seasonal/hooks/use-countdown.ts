import { useState, useEffect } from 'react'

function computeCountdown(targetDate: string): string | null {
  const target = new Date(targetDate).getTime()
  if (isNaN(target)) return null

  const now = Date.now()
  const diff = target - now

  if (diff <= 0) return 'Airing now'

  const totalMinutes = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function useCountdown(targetDate: string | null): string | null {
  const [countdown, setCountdown] = useState<string | null>(() => {
    if (!targetDate) return null
    return computeCountdown(targetDate)
  })

  useEffect(() => {
    if (!targetDate) {
      setCountdown(null)
      return
    }

    setCountdown(computeCountdown(targetDate))

    const interval = setInterval(() => {
      setCountdown(computeCountdown(targetDate))
    }, 60_000)

    return () => clearInterval(interval)
  }, [targetDate])

  return countdown
}
