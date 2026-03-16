'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn } from '@/lib/utils'

function parseContent(value: string) {
  if (!value) {
    return null
  }
  try {
    return JSON.parse(value)
  } catch {
    return {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: value }] }],
    }
  }
}

interface RichTextContentProps {
  content: string
  className?: string
}

export const RichTextContent = ({ content, className }: RichTextContentProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: parseContent(content),
    editable: false,
  })

  return <EditorContent editor={editor} className={cn('rich-text', className)} />
}
