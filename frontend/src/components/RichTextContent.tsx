'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn, parseContent } from '@/lib/utils'

interface RichTextContentProps {
  content: string
  label?: string
  className?: string
}

export const RichTextContent = ({
  content,
  label = 'Content',
  className,
}: RichTextContentProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: parseContent(content),
    editable: false,
    editorProps: {
      attributes: { 'aria-label': label },
    },
  })

  return <EditorContent editor={editor} className={cn('rich-text', className)} />
}
