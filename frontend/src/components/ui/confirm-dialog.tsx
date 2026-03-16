'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'
import { Save, Trash2 } from 'lucide-react'
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
  showDeleteIcon?: boolean
  showCancel?: boolean
  onSave?: () => void
  saveLabel?: string
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = 'Delete',
  loading = false,
  showDeleteIcon = true,
  showCancel = true,
  onSave,
  saveLabel = 'Save',
}: Props) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop
          className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0"
          onClick={() => onOpenChange(false)}
        />
        <AlertDialog.Popup className="fixed left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-50 bg-background rounded-lg p-6 shadow-xl w-full max-w-md transition-[opacity,transform,translate,scale] duration-100 ease-out data-starting-style:opacity-0 data-starting-style:[translate:-50%_calc(-50%+6px)] data-starting-style:scale-90 data-ending-style:opacity-0 data-ending-style:[translate:-50%_calc(-50%+6px)] data-ending-style:scale-90">
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
            {showCancel && (
              <AlertDialog.Close
                render={
                  <Button variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                }
              />
            )}
            <Button variant="destructive" onClick={onConfirm} disabled={loading}>
              {showDeleteIcon && <Trash2 size={14} />}
              {confirmLabel}
            </Button>
            {onSave && (
              <Button
                className="bg-brand hover:bg-brand-hover text-brand-foreground"
                onClick={onSave}
                disabled={loading}
              >
                <Save size={14} />
                {saveLabel}
              </Button>
            )}
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
