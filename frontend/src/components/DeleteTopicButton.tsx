'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export const DeleteTopicButton = ({ topicId }: { topicId: number }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await api.topics.delete(topicId)
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="transparent"
        size="icon-sm"
        onClick={() => setOpen(true)}
        className="mb-1 ml-2 opacity-0 group-hover/topic:opacity-60 transition-opacity"
      >
        <X size={14} />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete topic?"
        description="Pages inside will become ungrouped. This cannot be undone."
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  )
}
