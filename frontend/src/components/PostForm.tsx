'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { api, BlockType, Post, Topic } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Text } from '@/components/typography/Text'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { BlockFormItem, BlockDraft } from '@/components/BlockFormItem'
import {
  FilePlus,
  Heading,
  AlignLeft,
  Code,
  ImageIcon,
  Minus,
  Save,
  LayoutGrid,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface PostFormProps {
  post?: Post
  topics?: Topic[]
  initialTopicId?: number | null
  onSuccess?: () => Promise<void>
  onCancel?: () => void
}

interface FormValues {
  title: string
  topicId: number | null
  blocks: BlockDraft[]
}

function newBlock(type: BlockType): BlockDraft {
  return {
    blockId: crypto.randomUUID(),
    type,
    content: '',
    codeLanguage: 'typescript',
    imageUrl: '',
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
  const initialHeadingBlockId = useId()
  const initialTextBlockId = useId()
  const initialCodeBlockId = useId()

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
      blocks: post?.blocks?.length
        ? post.blocks.map((block) => ({
            blockId: String(block.id),
            type: block.type,
            content: block.content,
            codeLanguage: block.codeLanguage ?? 'typescript',
            imageUrl: block.imageUrl ?? '',
          }))
        : [
            { ...newBlock('heading'), blockId: initialHeadingBlockId },
            { ...newBlock('text'), blockId: initialTextBlockId },
            { ...newBlock('code'), blockId: initialCodeBlockId },
          ],
    },
  })

  const { fields, append, remove, move } = useFieldArray({ control, name: 'blocks' })

  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const pendingNavRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!isDirty) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    const handleLinkClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a')
      if (!anchor) {
        return
      }
      const href = anchor.getAttribute('href')
      if (!href || href === window.location.pathname) {
        return
      }
      event.stopPropagation()
      event.preventDefault()
      pendingNavRef.current = () => router.push(href)
      setShowDiscardDialog(true)
    }

    document.addEventListener('click', handleLinkClick, true)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleLinkClick, true)
    }
  }, [isDirty, router])

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscardDialog(true)
    } else if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  const handleDiscardConfirm = () => {
    setShowDiscardDialog(false)
    if (pendingNavRef.current) {
      const nav = pendingNavRef.current
      pendingNavRef.current = null
      nav()
    } else if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    move(result.source.index, result.destination.index)
  }

  const isBlockEmpty = (block: BlockDraft) => {
    if (block.type === 'divider') {
      return false
    }
    if (block.type === 'image') {
      return !block.imageUrl
    }
    return !block.content
  }

  const onSubmit = async (values: FormValues) => {
    try {
      if (post) {
        await api.posts.update(post.id, { title: values.title, topicId: values.topicId })

        const existingIds = new Set(post.blocks.map((block) => String(block.id)))
        const toCreate = values.blocks.filter(
          (block) => !existingIds.has(block.blockId) && !isBlockEmpty(block)
        )
        const toUpdate = values.blocks.filter(
          (block) => existingIds.has(block.blockId) && !isBlockEmpty(block)
        )
        const toDelete = post.blocks.filter(
          (block) =>
            !values.blocks.find((draft) => draft.blockId === String(block.id)) ||
            values.blocks.some((draft) => draft.blockId === String(block.id) && isBlockEmpty(draft))
        )

        const createdBlocks = await Promise.all(
          toCreate.map((block) =>
            api.blocks.create(post.id, {
              type: block.type,
              content: block.content,
              codeLanguage: block.codeLanguage || null,
              imageUrl: block.imageUrl || null,
            })
          )
        )

        await Promise.all([
          ...toDelete.map((block) => api.blocks.delete(post.id, block.id)),
          ...toUpdate.map((block) =>
            api.blocks.update(post.id, Number(block.blockId), {
              content: block.content,
              codeLanguage: block.codeLanguage || null,
              imageUrl: block.imageUrl || null,
            })
          ),
        ])

        const deletedIds = new Set(toDelete.map((block) => String(block.id)))
        const createdIdMap = new Map(
          toCreate.map((draft, i) => [draft.blockId, createdBlocks[i].id])
        )
        const orderedIds = values.blocks
          .filter((block) => !isBlockEmpty(block))
          .map((block) =>
            existingIds.has(block.blockId) && !deletedIds.has(block.blockId)
              ? Number(block.blockId)
              : (createdIdMap.get(block.blockId) ?? null)
          )
          .filter((id): id is number => id !== null)

        await api.blocks.reorder(post.id, orderedIds)

        if (onSuccess) {
          await onSuccess()
        } else {
          router.push(`/posts/${post.id}`)
          router.refresh()
        }
      } else {
        const created = await api.posts.create({
          title: values.title,
          topicId: values.topicId,
          blocks: values.blocks
            .filter((block) => !isBlockEmpty(block))
            .map((block) => ({
              type: block.type,
              content: block.content,
              codeLanguage: block.codeLanguage || null,
              imageUrl: block.imageUrl || null,
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex items-start justify-between gap-6 mb-21.5">
          <div className="min-w-0 flex-1">
            {topics.length > 0 && (
              <div className="flex items-center gap-3">
                <Text as="span" size="sm" color="muted" className="shrink-0">
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
                          color={field.value !== null ? 'foreground' : 'muted'}
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
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>

            <Button type="submit" variant="primary" size="sm" disabled={!isDirty || isSubmitting}>
              {post ? (
                <>
                  <Save />
                  Save changes
                </>
              ) : (
                <>
                  <FilePlus />
                  Create page
                </>
              )}
            </Button>
          </div>
        </div>

        {errors.root && (
          <Text as="p" size="sm" color="destructive" className="mb-6">
            {errors.root.message}
          </Text>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-10"
              >
                {fields.map((field, index) => (
                  <Draggable key={field.blockId} draggableId={field.blockId} index={index}>
                    {(draggableProvided) => (
                      <BlockFormItem
                        control={control}
                        index={index}
                        provided={draggableProvided}
                        onRemove={() => remove(index)}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex flex-col gap-3 mt-12">
          <Separator />

          <div className="flex items-center gap-1.5 mt-12">
            <LayoutGrid size={13} className="text-muted-foreground" />

            <Text as="span" size="xs" variant="tag">
              Add block
            </Text>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => append(newBlock('heading'))}>
              <Heading />
              Heading
            </Button>

            <Button variant="outline" size="sm" onClick={() => append(newBlock('text'))}>
              <AlignLeft />
              Content
            </Button>

            <Button variant="outline" size="sm" onClick={() => append(newBlock('code'))}>
              <Code />
              Code
            </Button>

            <Button variant="outline" size="sm" onClick={() => append(newBlock('image'))}>
              <ImageIcon />
              Image
            </Button>

            <Button variant="outline" size="sm" onClick={() => append(newBlock('divider'))}>
              <Minus />
              Divider
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        title="Unsaved changes"
        description="You have unsaved changes. Do you want to save before leaving?"
        confirmLabel="Leave without saving"
        showDeleteIcon={false}
        showCancel={false}
        onConfirm={handleDiscardConfirm}
        saveLabel="Save and continue"
        onSave={async () => {
          const pending = pendingNavRef.current
          pendingNavRef.current = null
          setShowDiscardDialog(false)
          await handleSubmit(onSubmit)()
          if (pending) {
            pending()
          }
        }}
      />
    </>
  )
}
