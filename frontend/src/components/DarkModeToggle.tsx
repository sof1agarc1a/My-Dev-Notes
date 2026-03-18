'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const DarkModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="group"
    >
      <Sun className="dark:hidden transition-transform duration-300 group-hover:rotate-180" />
      <Moon className="hidden dark:block text-moon transition-transform duration-300 group-hover:-rotate-100" />
    </Button>
  )
}
