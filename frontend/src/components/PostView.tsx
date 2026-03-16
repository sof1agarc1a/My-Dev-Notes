'use client'

import { Post, Topic } from '@/lib/api'
import { DeletePostButton } from '@/components/DeletePostButton'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/typography/Heading'
import { Text } from '@/components/typography/Text'
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
  const updatedAt = new Date(post.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const topicName =
    post.topicId !== null ? (topics.find((topic) => topic.id === post.topicId)?.name ?? null) : null

  return (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-24">
      <div className="flex items-start justify-between gap-6 mb-20.25">
        <div className="min-w-0">
          {topicName && (
            <div className="h-12 flex items-center">
              <Text as="p" size="sm" className="text-muted-foreground">
                {topicName}
              </Text>
            </div>
          )}
          <Heading as="h1" size="xl" className="text-foreground mt-4">
            {post.title}
          </Heading>
          <Text as="p" size="sm" className="text-muted-foreground mt-3">
            Last updated · {updatedAt}
          </Text>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-9 w-9 rounded-full">
            <Pencil size={15} />
          </Button>
          <DeletePostButton postId={post.id} />
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {post.sections.map((section) => (
          <div key={section.id}>
            {section.headline && (
              <Heading as="h2" size="md" className="text-foreground px-3 py-2 -mx-3 -mt-2 mb-4">
                {section.headline}
              </Heading>
            )}
            <RichTextContent
              content={section.content}
              className="text-base leading-6.5 text-foreground/75 px-3 py-2 -mx-3 -mt-2"
            />
            {section.code && <CodeBlock code={section.code} codeLanguage={section.codeLanguage} />}
            {section.imageUrl && (
              <div className="mt-6">
                <Image
                  src={section.imageUrl}
                  alt="Section image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded-lg border border-border"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
