'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarNavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export const SidebarNavLink = ({ href, children, className }: SidebarNavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Button
      variant="secondary"
      size="sm"
      render={<Link href={href} />}
      className={cn(
        'justify-start gap-2.5 mr-4',
        className,
        isActive
          ? 'bg-brand text-brand-foreground hover:bg-brand! hover:text-brand-foreground!'
          : ''
      )}
    >
      {children}
    </Button>
  )
}
