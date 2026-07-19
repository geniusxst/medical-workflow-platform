import type { LucideIcon } from 'lucide-react'

interface IconProps {
  icon: LucideIcon
  size?: number
  className?: string
  style?: React.CSSProperties
  strokeWidth?: number
}

/**
 * Unified icon wrapper around lucide-react.
 */
export default function Icon({ icon: LucideComp, size = 16, className, style, strokeWidth = 2 }: IconProps) {
  return <LucideComp size={size} className={className} style={style} strokeWidth={strokeWidth} />
}
