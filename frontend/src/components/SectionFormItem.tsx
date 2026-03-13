/* eslint-disable react-hooks/refs */
'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Text } from '@/components/typography/Text'
import { GripVertical, Trash2, Code } from 'lucide-react'
import { DraggableProvided } from '@hello-pangea/dnd'
import hljs from 'highlight.js'

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
}

const CODE_LANGUAGES = [
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
}: SectionFormItemProps) => {
  'use no memo'

  const codePreviewRef = useRef<HTMLElement>(null)

  // Can this be made differently?
  useEffect(() => {
    if (codePreviewRef.current && section.code) {
      codePreviewRef.current.removeAttribute('data-highlighted')
      codePreviewRef.current.textContent = section.code
      hljs.highlightElement(codePreviewRef.current)
    }
  }, [section.code, section.codeLanguage])

  const selectedLanguageLabel = CODE_LANGUAGES.find((lang) => lang.value === section.codeLanguage)?.label ?? 'TypeScript'

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
          onChange={(e) => onChange(section.id, 'headline', e.target.value)}
          className="text-[16px] font-semibold text-foreground"
        />
        <Textarea
          placeholder="Write something..."
          value={section.content}
          onChange={(e) => onChange(section.id, 'content', e.target.value)}
          rows={8}
          className="text-base min-h-[160px] text-foreground/75 resize-none leading-7"
        />

        <div className="flex items-center justify-between mt-2">
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
            <SelectTrigger className="h-8 w-36 text-xs px-3">
              <Text as="span" size="xs" className="text-muted-foreground">
                {selectedLanguageLabel}
              </Text>
            </SelectTrigger>
            <SelectContent>
              {CODE_LANGUAGES.map((lang) => (
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
          className="font-mono text-sm resize-none leading-6 bg-muted/50"
          spellCheck={false}
        />

        {section.code && (
          <pre className="rounded-lg overflow-x-auto text-sm leading-6 bg-[#f6f8fa]! border border-border">
            <code ref={codePreviewRef} className={`language-${section.codeLanguage || 'typescript'}`} />
          </pre>
        )}
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
