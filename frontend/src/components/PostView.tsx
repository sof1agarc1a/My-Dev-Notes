'use client'

import { Post, Topic } from '@/lib/api'
import { DeletePostButton } from '@/components/DeletePostButton'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/typography/Heading'
import { Text } from '@/components/typography/Text'
import { Separator } from '@/components/ui/separator'
import { Pencil } from 'lucide-react'
import { RichTextContent } from '@/components/RichTextContent'
import { CodeBlock } from '@/components/CodeBlock'
import Image from 'next/image'

interface PostViewProps {
  post: Post
  topics: Topic[]
  onEdit: () => void
}

export const PostView = ({ post, topics, onEdit }: PostViewProps) => {
  const { updatedAt, topicId, title, id, blocks } = post

  const formattedUpdatedAt = new Date(updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const topicName =
    topicId !== null ? (topics.find((topic) => topic.id === topicId)?.name ?? null) : null

  return (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-24">
      <div className="flex items-start justify-between gap-6 mb-20">
        <div className="min-w-0">
          {topicName && (
            <div className="h-12 flex items-center">
              <Text as="p" size="sm" color="muted">
                {topicName}
              </Text>
            </div>
          )}
          <Heading as="h1" size="xl" className="mt-4">
            {title}
          </Heading>
          <Text as="p" size="sm" color="muted" className="mt-3">
            Last updated · {formattedUpdatedAt}
          </Text>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <Button variant="secondary" size="icon" aria-label="Edit post" onClick={onEdit}>
            <Pencil className="dark:text-brand" />
          </Button>

          <DeletePostButton postId={id} />
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {blocks.map((block) => {
          const { type, content, id: blockId, imageUrl, codeLanguage } = block
          if (type === 'heading' && content) {
            return (
              <Heading key={blockId} as="h2" size="md">
                {content}
              </Heading>
            )
          }
          if (type === 'text' && content) {
            return (
              <RichTextContent
                key={blockId}
                content={content}
                className="text-base leading-6.5 text-foreground/75"
              />
            )
          }
          if (type === 'code' && content) {
            return <CodeBlock key={blockId} code={content} codeLanguage={codeLanguage} />
          }
          if (type === 'image' && imageUrl) {
            return (
              <Image
                key={blockId}
                src={imageUrl}
                alt="Block image"
                width={0}
                height={0}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 75vw, 60vw"
                className="w-full h-auto rounded-lg border border-border"
              />
            )
          }
          if (type === 'divider') {
            return <Separator key={blockId} />
          }
          return null
        })}
      </div>
    </div>
  )
}
