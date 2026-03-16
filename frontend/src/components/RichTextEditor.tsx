'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
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
  title: string
  children: React.ReactNode
}

const ToolbarButton = ({ onClick, active, title, children }: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={onClick}
    title={title}
    className={cn(
      'h-7 w-7 rounded-md',
      active ? 'bg-foreground text-background hover:bg-foreground/90 hover:text-background' : ''
    )}
  >
    {children}
  </Button>
)

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write something...',
  className,
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder }),
    ],
    content: parseContent(value),
    onUpdate: ({ editor: e }) => {
      onChange(e.isEmpty ? '' : JSON.stringify(e.getJSON()))
    },
    editorProps: {
      attributes: { class: 'outline-none' },
    },
  })

  return (
    <div className={cn('relative', className)}>
      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-0.5 bg-popover border border-border rounded-lg shadow-md p-1 z-50"
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold size={13} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic size={13} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon size={13} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={13} />
          </ToolbarButton>
          <div className="w-px h-4 bg-border mx-0.5" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={13} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={13} />
          </ToolbarButton>
          <div className="w-px h-4 bg-border mx-0.5" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet list"
          >
            <List size={13} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Ordered list"
          >
            <ListOrdered size={13} />
          </ToolbarButton>
        </BubbleMenu>
      )}
      <div className="min-h-25 cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
