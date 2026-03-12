import { api } from '@/lib/api'
import { PostForm } from '@/components/PostForm'
import { FilePlus } from 'lucide-react'
import { Text } from '@/components/typography/Text'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ topicId?: string }>
}

export default async function NewPostPage({ searchParams }: Props) {
  const { topicId } = await searchParams
  const topics = await api.topics.list().catch(() => [])

  return (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-24">
      <div className="flex items-center gap-2 mb-16">
        <FilePlus size={14} className="text-muted-foreground" />
        <Text as="p" size="xs" className="font-semibold text-muted-foreground uppercase tracking-widest leading-none">
          Add page
        </Text>
      </div>
      <PostForm key={topicId ?? 'none'} topics={topics} initialTopicId={topicId ? Number(topicId) : null} />
    </div>
  )
}
