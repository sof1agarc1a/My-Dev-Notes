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
}

function newSection(): SectionDraft {
  return { id: crypto.randomUUID(), headline: '', content: '', code: '', codeLanguage: 'typescript' }
}

export const PostForm = ({ post, topics = [], initialTopicId = null }: PostFormProps) => {
  const router = useRouter()
  const initialSectionId = useId()
  const [title, setTitle] = useState(post?.title ?? '')
  const [topicId, setTopicId] = useState<number | null>(post?.topicId ?? initialTopicId)
  const [sections, setSections] = useState<SectionDraft[]>(
    post?.sections?.length
      ? post.sections.map((section) => ({ id: String(section.id), headline: section.headline, content: section.content, code: section.code ?? '', codeLanguage: section.codeLanguage ?? 'typescript' }))
      : [{ id: initialSectionId, headline: '', content: '', code: '', codeLanguage: 'typescript' }]
  )
  const [loading, setLoading] = useState(false)
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const filledSections = sections.filter((section) => section.headline.trim() || section.content.trim())

    setLoading(true)
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

        router.push(`/posts/${post.id}`)
        router.refresh()
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <Input
        type="text"
        placeholder="Page title..."
        value={title}
        onChange={handleTitleChange}
        className="border-none bg-transparent px-0 text-[32px] font-bold tracking-tight text-foreground shadow-none placeholder:text-foreground/20 focus-visible:ring-0 h-auto"
      />

      {topics.length > 0 && (
        <div className="flex items-center gap-6">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
            Topic
          </label>
          <Select
            value={topicId !== null ? String(topicId) : ''}
            onValueChange={(val) => setTopicId(val ? Number(val) : null)}
          >
            <SelectTrigger className="h-11 min-w-44 px-4">
              <Text as="span" size="sm" className={`flex-1 text-left leading-none ${selectedTopicName ? '' : 'text-muted-foreground'}`}>
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

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Text as="p" size="xs" className="font-semibold text-muted-foreground uppercase tracking-widest">
            Sections
          </Text>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSections((prev) => [...prev, newSection()])}
            className="text-md text-muted-foreground hover:text-foreground gap-2"
          >
            <PlusCircle size={18} />
            Add section
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-3"
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
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {error && <Text as="p" size="sm" className="text-destructive">{error}</Text>}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className={!post ? 'bg-[oklch(0.875_0.14_44)] hover:bg-[oklch(0.855_0.16_44)] text-foreground' : ''}
        >
          {post ? (
            <>
              <Save size={15} />
              {loading ? 'Saving...' : 'Save changes'}
            </>
          ) : (
            <>
              <FilePlus size={15} />
              {loading ? 'Creating...' : 'Create page'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
