import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'
import { SidebarContent } from '@/components/SidebarContent'
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
      <div className="mx-5 pt-5 pb-3 border-b border-sidebar-border">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-foreground/90 text-background shrink-0">
            <BookOpen size={15} />
          </div>
          <Text as="span" size="lg" className="font-sans font-bold text-sidebar-foreground">My Notes</Text>
        </Link>
      </div>

      <div className="mx-5 pt-3 pb-3 border-b border-sidebar-border">
        <Link
          href="/posts/new"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[15px] font-medium text-sidebar-foreground bg-brand hover:bg-brand-hover transition-colors cursor-pointer w-full"
        >
          <Plus size={16} className="shrink-0" />
          <Text as="span" size="sm">New page</Text>
        </Link>
      </div>

      <div className="relative flex-1 min-h-0">
        <nav className="h-full overflow-y-auto scrollbar-hidden px-4 pl-2 pb-40 mt-6">
          <SidebarContent initialTopics={topics} ungrouped={ungrouped} />
        </nav>
      </div>
    </aside>
  )
}
