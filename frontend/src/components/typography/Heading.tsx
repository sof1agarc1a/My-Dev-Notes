import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel
  size?: HeadingSize
}

const sizeClasses: Record<HeadingSize, string> = {
  xs: 'text-xl font-semibold leading-tight',
  sm: 'text-2xl font-semibold leading-snug',
  md: 'text-3xl font-semibold leading-snug',
  lg: 'text-5xl font-bold leading-tight',
  xl: 'text-6xl font-bold leading-tight tracking-tight',
}

export const Heading = ({
  as: Tag = 'h2',
  size = 'md',
  className,
  children,
  ...props
}: HeadingProps) => {
  return (
    <Tag className={cn(sizeClasses[size], className)} {...props}>
      {children}
    </Tag>
  )
}
