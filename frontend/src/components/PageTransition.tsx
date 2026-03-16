'use client'

import { usePathname } from 'next/navigation'

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <div key={pathname} className="animate-page-fade-in h-full">
      {children}
    </div>
  )
}
