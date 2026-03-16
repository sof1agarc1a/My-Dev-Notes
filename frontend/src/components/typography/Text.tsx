import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type TextTag = 'p' | 'span'
type TextSize = 'xs' | 'sm' | 'md' | 'lg'

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextTag
  size?: TextSize
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs leading-relaxed',
  sm: 'text-sm leading-relaxed',
  md: 'text-base leading-relaxed',
  lg: 'text-lg leading-relaxed',
}

export const Text = ({ as: Tag = 'p', size = 'md', className, children, ...props }: TextProps) => {
  return (
    <Tag className={cn(sizeClasses[size], className)} {...props}>
      {children}
    </Tag>
  )
}
