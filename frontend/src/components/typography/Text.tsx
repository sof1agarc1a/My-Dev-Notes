import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type TextTag = 'p' | 'span'
type TextSize = 'xs' | 'sm' | 'md' | 'lg'
type TextColor = 'foreground' | 'muted' | 'destructive'

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextTag
  size?: TextSize
  variant?: 'tag'
  color?: TextColor
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs leading-relaxed',
  sm: 'text-sm leading-relaxed',
  md: 'text-base leading-relaxed',
  lg: 'text-lg leading-relaxed',
}

const colorClasses: Record<TextColor, string> = {
  foreground: 'text-foreground',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
}

export const Text = ({
  as: Tag = 'p',
  size = 'md',
  variant,
  color,
  className,
  children,
  ...props
}: TextProps) => {
  return (
    <Tag
      className={cn(
        sizeClasses[size],
        variant === 'tag' &&
          'font-semibold uppercase tracking-widest leading-none text-muted-foreground',
        color && colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
