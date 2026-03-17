import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'
import { SidebarContent } from '@/components/SidebarContent'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import { CreateTopicButton } from '@/components/CreateTopicButton'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/typography/Text'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

interface SidebarPost {
  id: number
  title: string
  topicId: number | null
}

interface SidebarTopic {
  id: number
  name: string
  posts: Pick<SidebarPost, 'id' | 'title'>[]
}

async function getData(): Promise<{ topics: SidebarTopic[]; ungrouped: SidebarPost[] }> {
  try {
    const [topicsRes, postsRes] = await Promise.all([
      fetch(`${API_URL}/topics`, { cache: 'no-store' }),
      fetch(`${API_URL}/posts`, { cache: 'no-store' }),
    ])
    const topics: SidebarTopic[] = topicsRes.ok ? await topicsRes.json() : []
    const posts: SidebarPost[] = postsRes.ok ? await postsRes.json() : []
    const assignedPostIds = new Set(topics.flatMap((topic) => topic.posts.map((post) => post.id)))
    const ungrouped = posts.filter((post) => !assignedPostIds.has(post.id))
    return { topics, ungrouped }
  } catch {
    return { topics: [], ungrouped: [] }
  }
}

export const Sidebar = async () => {
  const { topics, ungrouped } = await getData()

  return (
    <aside className="w-72 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="mx-5 pt-5 pb-3 border-b border-sidebar-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-foreground/90 text-background shrink-0">
            <BookOpen size={15} />
          </div>
          <Text as="span" size="lg" className="font-sans font-bold text-sidebar-foreground">
            My Dev Wiki
          </Text>
        </Link>
        <DarkModeToggle />
      </div>

      <div className="mx-5 pt-3 pb-3 border-b border-sidebar-border">
        <Button variant="primary" size="md" isWide render={<Link href="/posts/new" />}>
          <Plus />
          New page
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden">
        <nav className="pr-4 pl-2 py-8">
          <SidebarContent initialTopics={topics} ungrouped={ungrouped} />
        </nav>
      </div>

      <div className="mx-5 py-4 border-t border-sidebar-border pb-12">
        <CreateTopicButton />
      </div>
    </aside>
  )
}
