'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SidebarNavLinkProps {
  href: string
  children: React.ReactNode
}

export const SidebarNavLink = ({ href, children }: SidebarNavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[15px] transition-colors w-full',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
      )}
    >
      {children}
    </Link>
  )
}
