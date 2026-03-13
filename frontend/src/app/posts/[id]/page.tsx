import Link from 'next/link'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import hljs from 'highlight.js'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DeletePostButton } from '@/components/DeletePostButton'
import { Heading } from '@/components/typography/Heading'
import { Text } from '@/components/typography/Text'
import { Pencil } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

const highlightCode = (code: string, language: string | null): string => {
  try {
    return hljs.highlight(code, { language: language ?? 'plaintext' }).value
  } catch {
    return hljs.highlightAuto(code).value
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  let post
  try {
    post = await api.posts.get(Number(id))
  } catch {
    notFound()
  }

  const updatedAt = new Date(post.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-24">
      <div className="flex items-start justify-between gap-6 mb-10">
        <div className="min-w-0">
          <Heading as="h1" size="xl" className="text-foreground">
            {post.title}
          </Heading>
          <Text as="p" size="sm" className="text-muted-foreground mt-3">
            Last updated {updatedAt} · {post.sections.length}{' '}
            {post.sections.length === 1 ? 'section' : 'sections'}
          </Text>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <Link href={`/posts/${post.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Pencil size={15} />
            </Button>
          </Link>
          <DeletePostButton postId={post.id} />
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {post.sections.map((section, index) => (
          <div key={section.id}>
            <Heading as="h2" size="md" className="text-foreground mb-4">{section.headline}</Heading>
            <Text as="p" size="md" className="text-foreground/75 leading-7 whitespace-pre-wrap">
              {section.content}
            </Text>
            {section.code && (
              <pre className="mt-6 rounded-lg overflow-x-auto text-sm leading-6 bg-[#f6f8fa]! border border-border">
                <code
                  className={`language-${section.codeLanguage ?? 'plaintext'} hljs`}
                  dangerouslySetInnerHTML={{ __html: highlightCode(section.code, section.codeLanguage) }}
                />
              </pre>
            )}
            {index < post.sections.length - 1 && <Separator className="mt-12" />}
          </div>
        ))}
      </div>
    </div>
  )
}
