'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/typography/Heading'
import { Text } from '@/components/typography/Text'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  confirmLabel?: string
  loading?: boolean
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = 'Delete',
  loading = false,
}: Props) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background rounded-lg p-6 shadow-xl w-full max-w-sm">
          <AlertDialog.Title render={<div />}>
            <Heading as="h2" size="sm">
              {title}
            </Heading>
          </AlertDialog.Title>
          <AlertDialog.Description render={<div className="mt-2" />}>
            <Text as="p" size="sm" className="text-muted-foreground">
              {description}
            </Text>
          </AlertDialog.Description>
          <div className="flex justify-end gap-2 mt-6">
            <AlertDialog.Close
              render={
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              }
            />
            <Button variant="destructive" onClick={onConfirm} disabled={loading}>
              {loading ? 'Deleting...' : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
