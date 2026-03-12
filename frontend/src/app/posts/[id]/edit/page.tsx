import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import { PostForm } from '@/components/PostForm'
import { Text } from '@/components/typography/Text'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const [post, groups] = await Promise.all([
    api.posts.get(Number(id)).catch(() => null),
    api.groups.list().catch(() => []),
  ])

  if (!post) { notFound() }

  return (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-24">
      <Text as="p" size="xs" className="font-semibold text-muted-foreground uppercase tracking-widest mb-6">
        Editing
      </Text>
      <PostForm post={post} groups={groups} />
    </div>
  )
}
