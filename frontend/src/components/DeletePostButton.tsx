'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export const DeletePostButton = ({ postId }: { postId: number }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await api.posts.delete(postId)
      setOpen(false)
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9 rounded-full"
      >
        <Trash2 size={15} /
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete post?"
        description="This cannot be undone."
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  )
}
const x = 1
