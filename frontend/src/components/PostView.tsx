'use client'

import { useState } from 'react'
import hljs from 'highlight.js'
import createDOMPurify from 'dompurify'
import { Post, Topic } from '@/lib/api'
import { DeletePostButton } from '@/components/DeletePostButton'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/typography/Heading'
import { Text } from '@/components/typography/Text'
import { Pencil, Code, Copy, Check } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { RichTextContent } from '@/components/RichTextContent'

const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null

const highlightCode = (code: string, language: string | null): string => {
  try {
    return hljs.highlight(code, { language: language ?? 'plaintext' }).value
  } catch {
    return hljs.highlightAuto(code).value
  }
}

interface PostViewProps {
  post: Post
  topics: Topic[]
  onEdit: () => void
}

const CodeBlock = ({ code, codeLanguage }: { code: string; codeLanguage: string | null }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative mt-6 group/code">
      <div className="absolute top-2.5 right-3 flex items-center gap-2 z-10">
        <Code size={13} className="text-muted-foreground/50" />
        <Button variant="ghost" size="icon" onClick={handleCopy} className="h-9 w-9 rounded-full">
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </Button>
      </div>
      <pre className="rounded-lg overflow-x-auto text-sm leading-6 bg-[#f6f8fa]! border border-border">
        <code
          className={`language-${codeLanguage ?? 'plaintext'} hljs`}
          dangerouslySetInnerHTML={{
            __html:
              DOMPurify?.sanitize(highlightCode(code, codeLanguage)) ??
              highlightCode(code, codeLanguage),
          }}
        />
      </pre>
    </div>
  )
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
        {post.sections.map((section, index) => (
          <div key={section.id}>
            {index > 0 && <Separator className="mb-12" />}
            <Heading as="h2" size="md" className="text-foreground px-3 py-2 -mx-3 -mt-2 mb-4">
              {section.headline}
            </Heading>
            <RichTextContent
              content={section.content}
              className="text-base leading-6.5 text-foreground/75 px-3 py-2 -mx-3 -mt-2"
            />
            {section.code && <CodeBlock code={section.code} codeLanguage={section.codeLanguage} />}
          </div>
        ))}
      </div>
    </div>
  )
}
