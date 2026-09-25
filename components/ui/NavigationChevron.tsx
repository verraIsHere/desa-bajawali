import { ChevronLeft, ChevronRight } from 'lucide-react'

type NavigationDirection = 'previous' | 'next'

type NavigationChevronProps = {
  direction: NavigationDirection
  className?: string
  size?: number
}

export function NavigationChevron({
  direction,
  className,
  size = 14,
}: NavigationChevronProps) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight

  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={2} />
}
