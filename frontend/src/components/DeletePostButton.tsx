'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export const DeletePostButton = ({ postId }: { postId: number }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) {
      return
    }
    setLoading(true)
    try {
      await api.posts.delete(postId)
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="h-9 w-9 rounded-full"
    >
      <Trash2 size={15} />
    </Button>
  )
}
