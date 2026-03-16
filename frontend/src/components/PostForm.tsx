'use client'

import { useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { api, Post, Topic } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SectionFormItem } from '@/components/SectionFormItem'
import { Text } from '@/components/typography/Text'
import { PlusCircle, FilePlus, Save } from 'lucide-react'

interface PostFormProps {
  post?: Post
  topics?: Topic[]
  initialTopicId?: number | null
  onSuccess?: () => void
  onCancel?: () => void
}

interface SectionDraft {
  sectionId: string
  headline: string
  content: string
  code: string
  codeLanguage: string
}

interface FormValues {
  title: string
  topicId: number | null
  sections: SectionDraft[]
}

function newSection(): SectionDraft {
  return {
    sectionId: crypto.randomUUID(),
    headline: '',
    content: '',
    code: '',
    codeLanguage: 'typescript',
  }
}

export const PostForm = ({
  post,
  topics = [],
  initialTopicId = null,
  onSuccess,
  onCancel,
}: PostFormProps) => {
  const router = useRouter()
  const initialSectionId = useId()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: post?.title ?? '',
      topicId: post?.topicId ?? initialTopicId,
      sections: post?.sections?.length
        ? post.sections.map((section) => ({
            sectionId: String(section.id),
            headline: section.headline,
            content: section.content,
            code: section.code ?? '',
            codeLanguage: section.codeLanguage ?? 'typescript',
          }))
        : [{ ...newSection(), sectionId: initialSectionId }],
    },
  })

  const { fields, append, remove, move } = useFieldArray({ control, name: 'sections' })

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    move(result.source.index, result.destination.index)
  }

  const onSubmit = async (values: FormValues) => {
    const filledSections = values.sections.filter(
      (section) => section.headline.trim() || section.content.trim() || section.code?.trim()
    )

    try {
      if (post) {
        await api.posts.update(post.id, { title: values.title, topicId: values.topicId })

        const existingIds = new Set(post.sections.map((section) => String(section.id)))
        const toCreate = filledSections.filter((section) => !existingIds.has(section.sectionId))
        const toUpdate = filledSections.filter((section) => existingIds.has(section.sectionId))
        const toDelete = post.sections.filter(
          (section) => !filledSections.find((draft) => draft.sectionId === String(section.id))
        )

        const createdSections = await Promise.all(
          toCreate.map((s) =>
            api.sections.create(post.id, {
              headline: s.headline,
              content: s.content,
              code: s.code || null,
              codeLanguage: s.codeLanguage || null,
            })
          )
        )

        await Promise.all([
          ...toDelete.map((s) => api.sections.delete(post.id, s.id)),
          ...toUpdate.map((s) =>
            api.sections.update(post.id, Number(s.sectionId), {
              headline: s.headline || undefined,
              content: s.content || undefined,
              code: s.code || null,
              codeLanguage: s.codeLanguage || null,
            })
          ),
        ])

        const createdIdMap = new Map(
          toCreate.map((draft, i) => [draft.sectionId, createdSections[i].id])
        )
        const orderedIds = filledSections
          .map((section) =>
            existingIds.has(section.sectionId)
              ? Number(section.sectionId)
              : (createdIdMap.get(section.sectionId) ?? null)
          )
          .filter((id): id is number => id !== null)

        await api.sections.reorder(post.id, orderedIds)

        if (onSuccess) {
          onSuccess()
        } else {
          router.push(`/posts/${post.id}`)
          router.refresh()
        }
      } else {
        const created = await api.posts.create({
          title: values.title,
          topicId: values.topicId,
          sections: filledSections.map((s) => ({
            headline: s.headline,
            content: s.content,
            code: s.code || null,
            codeLanguage: s.codeLanguage || null,
          })),
        })
        router.push(`/posts/${created.id}`)
        router.refresh()
      }
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : 'Something went wrong' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex items-start justify-between gap-6 mb-29">
        <div className="min-w-0 flex-1">
          {topics.length > 0 && (
            <div className="flex items-center gap-3">
              <Text as="span" size="sm" className="text-muted-foreground shrink-0">
                Topic ·
              </Text>
              <Controller
                control={control}
                name="topicId"
                render={({ field }) => (
                  <Select
                    value={field.value !== null ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                  >
                    <SelectTrigger className="h-auto border-none shadow-none px-0 py-0 gap-1 focus:ring-0 w-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Text
                        as="span"
                        size="sm"
                        className={
                          field.value !== null ? 'text-foreground' : 'text-muted-foreground'
                        }
                      >
                        {field.value !== null
                          ? (topics.find((topic) => topic.id === field.value)?.name ??
                            'Select topic')
                          : 'Select topic'}
                      </Text>
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={String(topic.id)}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <Input
            type="text"
            placeholder="Page title..."
            autoFocus={!post}
            {...register('title')}
            className="border-none rounded-none bg-transparent mt-4 px-0 py-0 text-6xl font-bold leading-tight tracking-tight text-foreground shadow-none placeholder:text-foreground/20 focus-visible:ring-0 h-auto"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => (onCancel ? onCancel() : router.back())}
            className="text-foreground bg-muted hover:bg-muted/70"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || isSubmitting}
            className="bg-brand hover:bg-brand-hover text-foreground gap-1.5 disabled:opacity-40"
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

      {errors.root && (
        <Text as="p" size="sm" className="text-destructive mb-6">
          {errors.root.message}
        </Text>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-12"
            >
              {fields.map((field, index) => (
                <Draggable key={field.sectionId} draggableId={field.sectionId} index={index}>
                  {(draggableProvided) => (
                    <SectionFormItem
                      control={control}
                      index={index}
                      provided={draggableProvided}
                      onRemove={() => remove(index)}
                      canRemove={true}
                      isLast={index === fields.length - 1}
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
        onClick={() => append(newSection())}
        className="mt-12 self-start text-md gap-2"
      >
        <PlusCircle size={18} />
        Add section
      </Button>
    </form>
  )
}
