import { api } from '@/lib/api'
import { PostForm } from '@/components/PostForm'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ topicId?: string }>
}

export default async function NewPostPage({ searchParams }: Props) {
  const { topicId } = await searchParams
  const topics = await api.topics.list().catch(() => [])

  return (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-24">
      <PostForm
        key={topicId ?? 'none'}
        topics={topics}
        initialTopicId={topicId ? Number(topicId) : null}
      />
    </div>
  )
}
