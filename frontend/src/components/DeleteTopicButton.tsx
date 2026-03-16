'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const DeleteTopicButton = ({ topicId }: { topicId: number }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this topic? Pages inside will become ungrouped.')) {
      return
    }
    setLoading(true)
    try {
      await api.topics.delete(topicId)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="transparent"
      size="icon-sm"
      onClick={handleDelete}
      disabled={loading}
      className="mb-1 ml-2 opacity-0 group-hover/topic:opacity-60 transition-opacity"
    >
      <X size={14} />
    </Button>
  )
}
