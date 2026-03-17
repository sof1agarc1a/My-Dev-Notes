'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const DarkModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="group h-8 w-8 rounded-full text-sidebar-foreground/50 hover:text-sidebar-foreground"
    >
      <Sun
        size={15}
        className="dark:hidden transition-transform duration-300 group-hover:rotate-180"
      />
      <Moon
        size={15}
        className="hidden dark:block text-moon transition-transform duration-300 group-hover:-rotate-100"
      />
    </Button>
  )
}
