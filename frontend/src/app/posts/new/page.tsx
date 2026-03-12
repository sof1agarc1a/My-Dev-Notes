import { api } from '@/lib/api'
import { PostForm } from '@/components/PostForm'
import { Text } from '@/components/typography/Text'

export default async function NewPostPage() {
  const groups = await api.groups.list().catch(() => [])

  return (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-24">
      <Text as="p" size="xs" className="font-semibold text-muted-foreground uppercase tracking-widest mb-6">
        New page
      </Text>
      <PostForm groups={groups} />
    </div>
  )
}
