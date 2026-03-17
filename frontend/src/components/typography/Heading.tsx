import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type HeadingColor = 'foreground' | 'muted' | 'destructive'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel
  size?: HeadingSize
  color?: HeadingColor
}

const sizeClasses: Record<HeadingSize, string> = {
  xs: 'text-xl font-semibold leading-tight',
  sm: 'text-2xl font-semibold leading-snug',
  md: 'text-3xl font-semibold leading-snug',
  lg: 'text-5xl font-bold leading-tight',
  xl: 'text-6xl font-bold leading-tight tracking-tight',
}

const colorClasses: Record<HeadingColor, string> = {
  foreground: 'text-foreground',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
}

export const Heading = ({
  as: Tag = 'h2',
  size = 'md',
  color = 'foreground',
  className,
  children,
  ...props
}: HeadingProps) => {
  return (
    <Tag className={cn(sizeClasses[size], colorClasses[color], className)} {...props}>
      {children}
    </Tag>
  )
}
