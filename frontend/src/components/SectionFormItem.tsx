/* eslint-disable react-hooks/refs */
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GripVertical, Trash2 } from 'lucide-react'
import { DraggableProvided } from '@hello-pangea/dnd'

export interface SectionDraft {
  id: string
  headline: string
  content: string
}

interface SectionFormItemProps {
  section: SectionDraft
  provided: DraggableProvided
  onChange: (id: string, field: 'headline' | 'content', value: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

export const SectionFormItem = ({
  section,
  provided,
  onChange,
  onRemove,
  canRemove,
}: SectionFormItemProps) => {
  'use no memo'
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="group relative flex gap-2 items-start pt-8 pb-12 border-b border-border last:border-b-0"
    >
      <div
        // eslint-disable-next-line react-hooks/refs
        {...(provided.dragHandleProps ?? {})}
        className="mt-1 text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors shrink-0"
      >
        <GripVertical size={16} />
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <Input
          type="text"
          placeholder="Section headline"
          value={section.headline}
          onChange={(event) => onChange(section.id, 'headline', event.target.value)}
          className="text-[16px] font-semibold text-foreground"
        />
        <Textarea
          placeholder="Write something..."
          value={section.content}
          onChange={(event) => onChange(section.id, 'content', event.target.value)}
          rows={8}
          className="text-base min-h-[160px] text-foreground/75 resize-none leading-7"
        />
      </div>

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(section.id)}
          className="h-9 w-9 shrink-0 mt-0.5 text-muted-foreground/0 group-hover:text-muted-foreground hover:text-destructive! transition-colors"
        >
          <Trash2 size={20} />
        </Button>
      )}
    </div>
  )
}
