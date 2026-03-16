/* eslint-disable react-hooks/refs */
'use client'

import { Controller, Control, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Text } from '@/components/typography/Text'
import { RichTextEditor } from '@/components/RichTextEditor'
import { GripVertical, Trash2, Code, AlignLeft, ImageIcon, Loader2 } from 'lucide-react'
import { CodeBlock } from '@/components/CodeBlock'
import { useUploadThing } from '@/lib/uploadthing'
import { DraggableProvided } from '@hello-pangea/dnd'
import Image from 'next/image'

interface FormValues {
  title: string
  topicId: number | null
  sections: {
    sectionId: string
    headline: string
    content: string
    code: string
    codeLanguage: string
    imageUrl: string
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
}: SectionFormItemProps) => {
  const codeValue = useWatch({ control, name: `sections.${index}.code` })
  const codeLanguageValue = useWatch({ control, name: `sections.${index}.codeLanguage` })
  const imageUrlValue = useWatch({ control, name: `sections.${index}.imageUrl` })

  const { startUpload, isUploading } = useUploadThing('sectionImage')

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    const result = await startUpload([file])
    if (result?.[0]) {
      onChange(result[0].ufsUrl)
    }
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="relative group/section mb-12"
    >
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

      <div className="flex items-center gap-2 mb-4 mt-[-35.75px]">
        <AlignLeft size={14} className="text-muted-foreground" />
        <Text
          as="span"
          size="xs"
          className="font-semibold text-muted-foreground uppercase tracking-widest"
        >
          Content
        </Text>
      </div>

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
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              className="text-base leading-6.5 text-foreground/75 hover:ring-1 hover:ring-inset hover:ring-border focus-within:ring-1 focus-within:ring-inset focus-within:ring-ring px-3 py-2 rounded-lg -ml-3 w-[calc(100%+1.5rem)] -mt-2"
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
              className="font-mono text-sm resize-none leading-6 bg-[#f6f8fa] border border-border rounded-lg focus-visible:ring-0 focus-visible:border-foreground/40"
              spellCheck={false}
            />
          )}
        />
        {codeValue && <CodeBlock code={codeValue} codeLanguage={codeLanguageValue ?? null} />}

        <div className="flex h-12 items-center gap-2 mt-8">
          <ImageIcon size={14} className="text-muted-foreground" />
          <Text
            as="span"
            size="xs"
            className="font-semibold text-muted-foreground uppercase tracking-widest"
          >
            Image
          </Text>
        </div>

        <Controller
          control={control}
          name={`sections.${index}.imageUrl`}
          render={({ field }) => (
            <div>
              {imageUrlValue ? (
                <div className="relative w-full group/image mt-1 rounded-lg border border-border overflow-hidden">
                  <Image
                    src={imageUrlValue}
                    alt="Section image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => field.onChange('')}
                    className="w-9 h-9 rounded-full absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              ) : (
                <label className="mt-1 flex items-center justify-center gap-2 w-full border border-dashed border-border rounded-lg px-4 py-6 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground/60 transition-colors cursor-pointer">
                  {isUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                  <Text as="span" size="sm">
                    {isUploading ? 'Uploading...' : 'Click to upload image'}
                  </Text>
                  <Input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={isUploading}
                    onChange={(e) => handleImageUpload(e, field.onChange)}
                  />
                </label>
              )}
            </div>
          )}
        />
      </div>
    </div>
  )
}
