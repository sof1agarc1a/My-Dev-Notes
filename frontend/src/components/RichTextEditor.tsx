'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { useState } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading3,
  List,
  ListOrdered,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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

interface ToolbarButtonProps {
  onClick: () => void
  active: boolean
  disabled: boolean
  title: string
  children: React.ReactNode
}

const ToolbarButton = ({ onClick, active, disabled, title, children }: ToolbarButtonProps) => (
  <Button
    title={title}
    variant="secondary"
    size="icon"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      active ? 'bg-brand text-brand-foreground hover:bg-brand! hover:text-brand-foreground!' : ''
    )}
  >
    {children}
  </Button>
)

interface RichTextToolbarProps {
  editor: Editor | null
}

export const RichTextToolbar = ({ editor }: RichTextToolbarProps) => {
  const [hasSelection, setHasSelection] = useState(false)

  if (!editor) {
    return null
  }

  editor.on('selectionUpdate', ({ editor: e }) => {
    const { from, to } = e.state.selection
    setHasSelection(from !== to)
  })

  return (
    <div className="flex items-center gap-0.5 mr-4">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        disabled={!hasSelection}
        title="Bold"
      >
        <Bold size={11} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        disabled={!hasSelection}
        title="Italic"
      >
        <Italic size={11} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        disabled={!hasSelection}
        title="Underline"
      >
        <UnderlineIcon size={11} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        disabled={!hasSelection}
        title="Strikethrough"
      >
        <Strikethrough size={11} />
      </ToolbarButton>
      <div className="w-px h-3.5 bg-border mx-0.5" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        disabled={!hasSelection}
        title="Heading 3"
      >
        <Heading3 size={11} />
      </ToolbarButton>
      <div className="w-px h-3.5 bg-border mx-0.5" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        disabled={!hasSelection}
        title="Bullet list"
      >
        <List size={11} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        disabled={!hasSelection}
        title="Ordered list"
      >
        <ListOrdered size={11} />
      </ToolbarButton>
    </div>
  )
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  onEditorReady?: (editor: Editor) => void
  placeholder?: string
  className?: string
}

export const RichTextEditor = ({
  value,
  onChange,
  onEditorReady,
  placeholder = 'Write something...',
  className,
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder }),
      Underline,
    ],
    content: parseContent(value),
    onCreate: ({ editor: e }) => {
      onEditorReady?.(e)
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.isEmpty ? '' : JSON.stringify(e.getJSON()))
    },
    editorProps: {
      attributes: { class: 'outline-none' },
    },
  })

  return (
    <div className={cn('cursor-text', className)} onClick={() => editor?.commands.focus()}>
      <EditorContent editor={editor} />
    </div>
  )
}
