/* eslint-disable react-hooks/refs */
'use client'

import { Controller, Control } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/typography/Text'
import { GripVertical, Trash2, Code } from 'lucide-react'
import { DraggableProvided } from '@hello-pangea/dnd'

interface FormValues {
  sections: {
    sectionId: string
    headline: string
    content: string
    code: string
    codeLanguage: string
  }[]
}

interface SectionFormItemProps {
  control: Control<FormValues>
  index: number
  provided: DraggableProvided
  onRemove: () => void
  canRemove: boolean
  isLast: boolean
}

const codeLanguages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'yaml', label: 'YAML' },
]

export const SectionFormItem = ({
  control,
  index,
  provided,
  onRemove,
  canRemove,
  isLast,
}: SectionFormItemProps) => {
  return (
    <div ref={provided.innerRef} {...provided.draggableProps} className="relative group/section">
      <div
        {...(provided.dragHandleProps ?? {})}
        className="absolute -left-10 top-3 text-muted-foreground/0 group-hover/section:text-muted-foreground/40 hover:text-muted-foreground! cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical size={20} />
      </div>

      {canRemove && (
        <Button
          variant="destructive"
          size="icon"
          onClick={onRemove}
          className="absolute -right-14 top-0 h-9 w-9 rounded-full invisible group-hover/section:visible"
        >
          <Trash2 size={16} />
        </Button>
      )}

      <div className="flex flex-col">
        <Controller
          control={control}
          name={`sections.${index}.headline`}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Section headline"
              {...field}
              className="text-3xl font-semibold leading-snug bg-transparent border-none shadow-none ring-0 hover:ring-1 hover:ring-inset hover:ring-border focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring px-3 py-2 h-auto rounded-lg text-foreground -ml-3 w-[calc(100%+1.5rem)] -mt-2 mb-4"
            />
          )}
        />

        <Controller
          control={control}
          name={`sections.${index}.content`}
          render={({ field }) => (
            <Textarea
              placeholder="Write something..."
              {...field}
              className="text-base leading-7 text-foreground/75 bg-transparent border-none shadow-none ring-0 hover:ring-1 hover:ring-inset hover:ring-border focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring resize-none px-3 py-2 rounded-lg -ml-3 w-[calc(100%+1.5rem)] -mt-2 min-h-0"
            />
          )}
        />

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <Code size={14} className="text-muted-foreground" />
            <Text
              as="span"
              size="xs"
              className="font-semibold text-muted-foreground uppercase tracking-widest"
            >
              Code snippet
            </Text>
          </div>
          <Controller
            control={control}
            name={`sections.${index}.codeLanguage`}
            render={({ field }) => (
              <Select value={field.value || 'typescript'} onValueChange={field.onChange}>
                <SelectTrigger className="h-auto border-none shadow-none px-0 py-0 gap-1 focus:ring-0 w-auto">
                  <Text as="span" size="xs">
                    {codeLanguages.find((lang) => lang.value === field.value)?.label ??
                      'TypeScript'}
                  </Text>
                </SelectTrigger>
                <SelectContent>
                  {codeLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <Controller
          control={control}
          name={`sections.${index}.code`}
          render={({ field }) => (
            <Textarea
              placeholder="Paste code here..."
              {...field}
              rows={6}
              className="font-mono text-sm resize-none leading-6 bg-[#f6f8fa] border border-border rounded-lg"
              spellCheck={false}
            />
          )}
        />
      </div>

      {!isLast && <Separator className="mt-12" />}
    </div>
  )
}
