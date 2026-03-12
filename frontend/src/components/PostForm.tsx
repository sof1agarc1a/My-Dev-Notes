'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { api, Post, Group } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionFormItem, SectionDraft } from '@/components/SectionFormItem'
import { Text } from '@/components/typography/Text'
import { PlusCircle } from 'lucide-react'

interface PostFormProps {
  post?: Post
  groups?: Group[]
}

function newSection(): SectionDraft {
  return { id: crypto.randomUUID(), headline: '', content: '' }
}

export const PostForm = ({ post, groups = [] }: PostFormProps) => {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title ?? '')
  const [groupId, setGroupId] = useState<number | null>(post?.groupId ?? null)
  const [sections, setSections] = useState<SectionDraft[]>(
    post?.sections?.length
      ? post.sections.map((s) => ({ id: String(s.id), headline: s.headline, content: s.content }))
      : [newSection()]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSectionChange = useCallback(
    (id: string, field: 'headline' | 'content', value: string) => {
      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    },
    []
  )

  const handleRemove = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
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
    if (sections.some((s) => !s.headline.trim() || !s.content.trim())) {
      setError('All sections must have a headline and content')
      return
    }

    setLoading(true)
    try {
      if (post) {
        await api.posts.update(post.id, { title, groupId })

        const existingIds = new Set(post.sections.map((s) => String(s.id)))
        const toCreate = sections.filter((s) => !existingIds.has(s.id))
        const toUpdate = sections.filter((s) => existingIds.has(s.id))
        const toDelete = post.sections.filter((s) => !sections.find((d) => d.id === String(s.id)))

        await Promise.all([
          ...toDelete.map((s) => api.sections.delete(post.id, s.id)),
          ...toCreate.map((s) =>
            api.sections.create(post.id, { headline: s.headline, content: s.content })
          ),
          ...toUpdate.map((s) =>
            api.sections.update(post.id, Number(s.id), {
              headline: s.headline,
              content: s.content,
            })
          ),
        ])

        const remainingIds = sections.filter((s) => existingIds.has(s.id)).map((s) => Number(s.id))
        if (remainingIds.length > 0) {
          await api.sections.reorder(post.id, remainingIds)
        }

        router.push(`/posts/${post.id}`)
        router.refresh()
      } else {
        const created = await api.posts.create({
          title,
          groupId,
          sections: sections.map((s) => ({ headline: s.headline, content: s.content })),
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
        onChange={(e) => setTitle(e.target.value)}
        className="border-none bg-transparent px-0 text-[32px] font-bold tracking-tight text-foreground shadow-none placeholder:text-foreground/20 focus-visible:ring-0 h-auto"
      />

      {groups.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
            Group
          </label>
          <select
            value={groupId ?? ''}
            onChange={(e) => setGroupId(e.target.value ? Number(e.target.value) : null)}
            className="bg-transparent text-sm text-foreground border border-border rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="">No group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
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
                        canRemove={sections.length > 1}
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

      <div className="flex gap-2 justify-end pt-2 border-t border-border">
        <Button type="button" variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : post ? 'Save changes' : 'Create page'}
        </Button>
      </div>
    </form>
  )
}
