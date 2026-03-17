/* eslint-disable react-hooks/refs */
'use client'

import { Control, Controller, useWatch } from 'react-hook-form'
import { useState } from 'react'
import { DraggableProvided } from '@hello-pangea/dnd'
import {
  GripVertical,
  Trash2,
  ImageIcon,
  Loader2,
  Heading,
  AlignLeft,
  Code,
  Image as ImageBlockIcon,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Text } from '@/components/typography/Text'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { RichTextEditor, RichTextToolbar } from '@/components/RichTextEditor'
import { Editor } from '@tiptap/react'
import { CodeBlock } from '@/components/CodeBlock'
import { Separator } from '@/components/ui/separator'
import { useUploadThing } from '@/lib/uploadthing'
import imageCompression from 'browser-image-compression'
import { BlockType } from '@/lib/api'

export interface BlockDraft {
  blockId: string
  type: BlockType
  content: string
  codeLanguage: string
  imageUrl: string
}

interface FormValues {
  title: string
  topicId: number | null
  blocks: BlockDraft[]
}

interface BlockFormItemProps {
  control: Control<FormValues>
  index: number
  provided: DraggableProvided
  onRemove: () => void
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

export const BlockFormItem = ({ control, index, provided, onRemove }: BlockFormItemProps) => {
  const [richEditor, setRichEditor] = useState<Editor | null>(null)
  const type = useWatch({ control, name: `blocks.${index}.type` })
  const codeValue = useWatch({ control, name: `blocks.${index}.content` })
  const codeLanguageValue = useWatch({ control, name: `blocks.${index}.codeLanguage` })
  const imageUrlValue = useWatch({ control, name: `blocks.${index}.imageUrl` })

  const { startUpload, isUploading } = useUploadThing('blockImage')

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 })
    const result = await startUpload([compressed])
    if (result?.[0]) {
      onChange(result[0].ufsUrl)
    }
  }

  return (
    <div ref={provided.innerRef} {...provided.draggableProps} className="relative group/block">
      <div
        {...(provided.dragHandleProps ?? {})}
        className="absolute -left-10 top-2 text-muted-foreground/0 group-hover/block:text-muted-foreground/40 hover:text-muted-foreground! cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical size={20} />
      </div>

      <Button
        variant="destructive"
        size="icon"
        onClick={onRemove}
        className="absolute -right-14 top-0 opacity-0 group-hover/block:opacity-100 transition-opacity"
      >
        <Trash2 size={14} />
      </Button>

      {type === 'heading' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Heading size={13} className="text-muted-foreground" />
            <Text
              as="span"
              size="xs"
              className="text-muted-foreground font-semibold uppercase tracking-widest leading-none"
            >
              Heading
            </Text>
          </div>
          <Controller
            control={control}
            name={`blocks.${index}.content`}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Heading..."
                {...field}
                className="text-3xl font-semibold leading-snug bg-transparent border-none shadow-none ring-0 hover:ring-1 hover:ring-inset hover:ring-border focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring px-3 py-2 h-auto rounded-lg -ml-3 w-[calc(100%+1.5rem)]"
              />
            )}
          />
        </div>
      )}

      {type === 'text' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlignLeft size={13} className="text-muted-foreground" />
              <Text
                as="span"
                size="xs"
                className="text-muted-foreground font-semibold uppercase tracking-widest leading-none"
              >
                Content
              </Text>
            </div>
            <RichTextToolbar editor={richEditor} />
          </div>
          <Controller
            control={control}
            name={`blocks.${index}.content`}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                onEditorReady={setRichEditor}
                className="min-h-36 text-base leading-6.5 text-foreground/75 hover:ring-1 hover:ring-inset hover:ring-border focus-within:ring-1 focus-within:ring-inset focus-within:ring-ring px-3 py-2 rounded-lg -ml-3 w-[calc(100%+1.5rem)]"
              />
            )}
          />
        </div>
      )}

      {type === 'code' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-6">
            <div className="flex items-center gap-1.5">
              <Code size={13} className="text-muted-foreground" />
              <Text
                as="span"
                size="xs"
                className="text-muted-foreground font-semibold uppercase tracking-widest leading-none"
              >
                Code snippet
              </Text>
            </div>
            <Controller
              control={control}
              name={`blocks.${index}.codeLanguage`}
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
            name={`blocks.${index}.content`}
            render={({ field }) => (
              <Textarea
                placeholder="Paste code here..."
                {...field}
                rows={6}
                className="font-mono text-sm resize-none leading-6 bg-code-background border border-border rounded-lg focus-visible:ring-0 focus-visible:border-foreground/40"
                spellCheck={false}
              />
            )}
          />
          {codeValue && <CodeBlock code={codeValue} codeLanguage={codeLanguageValue ?? null} />}
        </div>
      )}

      {type === 'image' && (
        <Controller
          control={control}
          name={`blocks.${index}.imageUrl`}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <ImageBlockIcon size={13} className="text-muted-foreground" />
                <Text
                  as="span"
                  size="xs"
                  className="text-muted-foreground font-semibold uppercase tracking-widest leading-none"
                >
                  Image
                </Text>
              </div>
              {imageUrlValue ? (
                <div className="w-full rounded-lg border border-border overflow-hidden">
                  <Image
                    src={imageUrlValue}
                    alt="Block image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 w-full border border-dashed border-border rounded-lg px-4 py-6 text-muted-foreground hover:border-foreground/30 hover:text-foreground/60 transition-colors cursor-pointer">
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
      )}

      {type === 'divider' && <Separator className="my-2" />}
    </div>
  )
}
