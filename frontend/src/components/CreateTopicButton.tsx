'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const CreateTopicButton = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setName('')
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      return
    }
    setLoading(true)
    try {
      await api.topics.create({ name: name.trim() })
      setName('')
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (open) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-1 px-2 h-9">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Topic name..."
          className="flex-1 min-w-0 h-auto bg-transparent text-[13px] text-sidebar-foreground placeholder:text-sidebar-foreground/40 border-0 border-b border-sidebar-foreground/30 rounded-none px-0 py-0.5 shadow-none focus-visible:ring-0"
        />
        <Button variant="destructive" size="xs" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="xs" disabled={loading || !name.trim()}>
          Add
        </Button>
      </form>
    )
  }

  return (
    <Button isWide variant="primary" size="md" onClick={() => setOpen(true)}>
      <Plus />
      New topic
    </Button>
  )
}
