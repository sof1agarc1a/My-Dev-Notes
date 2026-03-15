'use client'

import { useState, useCallback, useId } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { api, Post, Topic } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SectionFormItem, SectionDraft } from '@/components/SectionFormItem'
import { Text } from '@/components/typography/Text'
import { PlusCircle, FilePlus, Save } from 'lucide-react'

interface PostFormProps {
  post?: Post
  topics?: Topic[]
  initialTopicId?: number | null
  onSuccess?: () => void
  onCancel?: () => void
}

function newSection(): SectionDraft {
  return { id: crypto.randomUUID(), headline: '', content: '', code: '', codeLanguage: 'typescript' }
}

export const PostForm = ({ post, topics = [], initialTopicId = null, onSuccess, onCancel }: PostFormProps) => {
  const router = useRouter()
  const initialSectionId = useId()
  const [title, setTitle] = useState(post?.title ?? '')
  const [topicId, setTopicId] = useState<number | null>(post?.topicId ?? initialTopicId)
  const [sections, setSections] = useState<SectionDraft[]>(
    post?.sections?.length
      ? post.sections.map((section) => ({ id: String(section.id), headline: section.headline, content: section.content, code: section.code ?? '', codeLanguage: section.codeLanguage ?? 'typescript' }))
      : [{ id: initialSectionId, headline: '', content: '', code: '', codeLanguage: 'typescript' }]
  )
  const [error, setError] = useState('')

  const selectedTopicName = topicId !== null
    ? (topics.find((topic) => topic.id === topicId)?.name ?? null)
    : null

  const handleSectionChange = useCallback(
    (id: string, field: 'headline' | 'content' | 'code' | 'codeLanguage', value: string) => {
      setSections((prev) => prev.map((section) => (section.id === id ? { ...section, [field]: value } : section)))
    },
    []
  )

  const handleRemove = useCallback((id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id))
  }, [])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    setSections((prev) => {
      const next = [...prev]
      const [moved] = next.splice(result.source.index, 1)
      next.splice(result.destination!.index, 0, moved)
      return next
    })
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const filledSections = sections.filter((section) => section.headline.trim() || section.content.trim())

    try {
      if (post) {
        await api.posts.update(post.id, { title, topicId })

        const existingIds = new Set(post.sections.map((section) => String(section.id)))
        const toCreate = filledSections.filter((section) => !existingIds.has(section.id))
        const toUpdate = filledSections.filter((section) => existingIds.has(section.id))
        const toDelete = post.sections.filter((section) => !filledSections.find((draft) => draft.id === String(section.id)))

        await Promise.all([
          ...toDelete.map((s) => api.sections.delete(post.id, s.id)),
          ...toCreate.map((s) =>
            api.sections.create(post.id, { headline: s.headline, content: s.content, code: s.code || null, codeLanguage: s.codeLanguage || null })
          ),
          ...toUpdate.map((s) =>
            api.sections.update(post.id, Number(s.id), {
              headline: s.headline,
              content: s.content,
              code: s.code || null,
              codeLanguage: s.codeLanguage || null,
            })
          ),
        ])

        const remainingIds = filledSections.filter((section) => existingIds.has(section.id)).map((section) => Number(section.id))
        if (remainingIds.length > 0) {
          await api.sections.reorder(post.id, remainingIds)
        }

        if (onSuccess) {
          onSuccess()
        } else {
          router.push(`/posts/${post.id}`)
          router.refresh()
        }
      } else {
        const created = await api.posts.create({
          title,
          topicId,
          sections: filledSections.map((s) => ({ headline: s.headline, content: s.content, code: s.code || null, codeLanguage: s.codeLanguage || null })),
        })
        router.push(`/posts/${created.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex items-start justify-between gap-6 mb-18">
        <div className="min-w-0 flex-1">
          {topics.length > 0 && (
            <div className="flex items-center gap-3">
              <Text as="span" size="sm" className="text-muted-foreground shrink-0">Topic ·</Text>
              <Select
                value={topicId !== null ? String(topicId) : ''}
                onValueChange={(val) => setTopicId(val ? Number(val) : null)}
              >
                <SelectTrigger className="h-auto border-none shadow-none px-0 py-0 gap-1 focus:ring-0 w-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Text as="span" size="sm" className={selectedTopicName ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedTopicName ?? 'Select topic'}
                  </Text>
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={String(topic.id)}>{topic.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Input
            type="text"
            placeholder="Page title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-none bg-transparent mt-4 px-0 py-0 text-6xl font-bold leading-tight tracking-tight text-foreground shadow-none placeholder:text-foreground/20 focus-visible:ring-0 h-auto"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onCancel ? onCancel() : router.back()}
            className="text-foreground bg-muted hover:bg-muted/70"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-brand hover:bg-brand-hover text-foreground gap-1.5"
          >
            {post ? (
              <>
                <Save size={14} />
                Save changes
              </>
            ) : (
              <>
                <FilePlus size={14} />
                Create page
              </>
            )}
          </Button>
        </div>
      </div>

      {error && <Text as="p" size="sm" className="text-destructive mb-6">{error}</Text>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-12"
            >
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(draggableProvided) => (
                    <SectionFormItem
                      section={section}
                      provided={draggableProvided}
                      onChange={handleSectionChange}
                      onRemove={handleRemove}
                      canRemove={true}
                      isLast={index === sections.length - 1}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        type="button"
        variant="ghost"
        onClick={() => setSections((prev) => [...prev, newSection()])}
        className="mt-12 self-start text-md text-foreground gap-2 bg-muted hover:bg-muted/70"
      >
        <PlusCircle size={18} />
        Add section
      </Button>
    </form>
  )
}
