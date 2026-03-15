import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import { PostPageContent } from '@/components/PostPageContent'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const [post, topics] = await Promise.all([
    api.posts.get(Number(id)).catch(() => null),
    api.topics.list().catch(() => []),
  ])

  if (!post) {
    notFound()
  }

  return <PostPageContent post={post} topics={topics} />
}
