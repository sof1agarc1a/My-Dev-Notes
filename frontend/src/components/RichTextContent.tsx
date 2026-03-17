'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn, parseContent } from '@/lib/utils'

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
