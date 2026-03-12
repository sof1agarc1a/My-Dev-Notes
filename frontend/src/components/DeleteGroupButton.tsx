'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const DeleteGroupButton = ({ groupId }: { groupId: number }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this group? Pages inside will become ungrouped.')) {
      return
    }
    setLoading(true)
    try {
      await api.groups.delete(groupId)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleDelete}
      disabled={loading}
      className="opacity-0 group-hover/group:opacity-100 transition-opacity text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-transparent"
    >
      <X size={14} />
    </Button>
  )
}
