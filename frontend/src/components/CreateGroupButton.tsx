'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const CreateGroupButton = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      return
    }
    setLoading(true)
    try {
      await api.groups.create({ name: name.trim() })
      setName('')
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (open) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-1 px-2">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false) } }}
          placeholder="Group name..."
          className="flex-1 min-w-0 h-auto bg-transparent text-[13px] text-sidebar-foreground placeholder:text-sidebar-foreground/40 border-0 border-b border-sidebar-foreground/30 rounded-none px-0 py-0.5 shadow-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          variant="ghost"
          size="xs"
          disabled={loading || !name.trim()}
          className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-transparent shrink-0"
        >
          Add
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => { setOpen(false); setName('') }}
          className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-transparent shrink-0"
        >
          Cancel
        </Button>
      </form>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setOpen(true)}
      className="flex items-center gap-1.5 px-2 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-transparent"
    >
      <Plus size={14} />
      New group
    </Button>
  )
}
