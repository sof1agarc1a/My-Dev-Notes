/* eslint-disable react-hooks/refs */
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/typography/Text'
import { GripVertical, Trash2, Code } from 'lucide-react'
import { DraggableProvided } from '@hello-pangea/dnd'

export interface SectionDraft {
  id: string
  headline: string
  content: string
  code: string
  codeLanguage: string
}

interface SectionFormItemProps {
  section: SectionDraft
  provided: DraggableProvided
  onChange: (id: string, field: 'headline' | 'content' | 'code' | 'codeLanguage', value: string) => void
  onRemove: (id: string) => void
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
  section,
  provided,
  onChange,
  onRemove,
  canRemove,
  isLast,
}: SectionFormItemProps) => {
  const selectedLanguageLabel = codeLanguages.find((lang) => lang.value === section.codeLanguage)?.label ?? 'TypeScript'

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="relative group/section"
    >
      <div
        {...(provided.dragHandleProps ?? {})}
        className="absolute -left-10 top-3 text-muted-foreground/0 group-hover/section:text-muted-foreground/40 hover:text-muted-foreground! cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical size={20} />
      </div>

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(section.id)}
          className="absolute -right-12 top-0 h-8 w-8 text-muted-foreground/0 group-hover/section:text-muted-foreground hover:text-destructive! transition-colors"
        >
          <Trash2 size={16} />
        </Button>
      )}

      <div className="flex flex-col">
        <Input
          type="text"
          placeholder="Section headline"
          value={section.headline}
          onChange={(e) => onChange(section.id, 'headline', e.target.value)}
          className="text-3xl font-semibold leading-snug bg-transparent border-none shadow-none ring-0 hover:ring-1 hover:ring-inset hover:ring-border focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring px-3 py-2 h-auto rounded-lg text-foreground -ml-3 w-[calc(100%+1.5rem)] -mt-2 mb-4"
        />

        <Textarea
          placeholder="Write something..."
          value={section.content}
          onChange={(e) => onChange(section.id, 'content', e.target.value)}
          className="text-base leading-7 text-foreground/75 bg-transparent border-none shadow-none ring-0 hover:ring-1 hover:ring-inset hover:ring-border focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring resize-none px-3 py-2 rounded-lg -ml-3 w-[calc(100%+1.5rem)] -mt-2 min-h-0"
        />

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <Code size={14} className="text-muted-foreground" />
            <Text as="span" size="xs" className="font-semibold text-muted-foreground uppercase tracking-widest">
              Code snippet
            </Text>
          </div>
          <Select
            value={section.codeLanguage || 'typescript'}
            onValueChange={(language) => onChange(section.id, 'codeLanguage', language ?? 'typescript')}
          >
            <SelectTrigger className="h-auto border-none shadow-none px-0 py-0 gap-1 focus:ring-0 w-auto">
              <Text as="span" size="xs">
                {selectedLanguageLabel}
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
        </div>

        <Textarea
          placeholder="Paste code here..."
          value={section.code}
          onChange={(e) => onChange(section.id, 'code', e.target.value)}
          rows={6}
          className="font-mono text-sm resize-none leading-6 bg-[#f6f8fa] border border-border rounded-lg"
          spellCheck={false}
        />
      </div>

      {!isLast && <Separator className="mt-12" />}
    </div>
  )
}
