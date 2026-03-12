import Link from 'next/link'
import { FileText, BookOpen, Plus } from 'lucide-react'
import { SidebarNavLink } from '@/components/SidebarNavLink'
import { CreateTopicButton } from '@/components/CreateTopicButton'
import { DeleteTopicButton } from '@/components/DeleteTopicButton'
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
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="mx-4 pt-5 pb-3 border-b border-sidebar-border">
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

      <div className="mx-4 pt-3 pb-3 border-b border-sidebar-border">
        <Link
          href="/posts/new"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[15px] font-medium text-sidebar-foreground bg-[oklch(0.875_0.14_44)] hover:bg-[oklch(0.855_0.16_44)] transition-colors cursor-pointer w-full"
        >
          <Plus size={16} className="shrink-0" />
          <Text as="span" size="sm">New page</Text>
        </Link>
      </div>

      <div className="relative flex-1 min-h-0">
        <nav className="h-full overflow-y-auto scrollbar-hidden px-4 pb-32 mt-6 flex flex-col gap-2">
        {topics.map((topic) => (
          <div key={topic.id} className="group/topic">
            <div className="flex items-center justify-between px-2 py-1 mb-0.5">
              <Text as="p" size="xs" className="font-semibold text-sidebar-foreground/60 uppercase tracking-widest truncate">
                {topic.name}
              </Text>
              <DeleteTopicButton topicId={topic.id} />
            </div>
            <div className="flex flex-col gap-0.5">
              {topic.posts.length === 0 ? (
                <Text as="p" size="sm" className="text-sidebar-foreground/40 px-2 py-1 italic">No pages yet</Text>
              ) : (
                topic.posts.map((post) => (
                  <SidebarNavLink key={post.id} href={`/posts/${post.id}`}>
                    <FileText size={15} className="shrink-0 opacity-70" />
                    <Text as="span" size="sm" className="truncate">{post.title}</Text>
                  </SidebarNavLink>
                ))
              )}
              <Link
                href={`/posts/new?topicId=${topic.id}`}
                className="opacity-0 group-hover/topic:opacity-100 transition-opacity flex items-center gap-1.5 px-2 py-1 text-[13px] text-sidebar-foreground/40 hover:text-sidebar-foreground"
              >
                <Plus size={13} />
                Add page
              </Link>
            </div>
          </div>
        ))}

        {ungrouped.length > 0 && (
          <div>
            {topics.length > 0 && (
              <div className="px-2 py-1 mb-0.5">
                <Text as="p" size="xs" className="font-semibold text-sidebar-foreground/50 uppercase tracking-widest">
                  Other
                </Text>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {ungrouped.map((post) => (
                <SidebarNavLink key={post.id} href={`/posts/${post.id}`}>
                  <FileText size={15} className="shrink-0 opacity-70" />
                  <Text as="span" size="sm" className="truncate">{post.title}</Text>
                </SidebarNavLink>
              ))}
            </div>
          </div>
        )}

        {topics.length === 0 && ungrouped.length === 0 && (
          <Text as="p" size="sm" className="text-sidebar-foreground/40 px-2 py-1">No pages yet</Text>
        )}

        <div className="pt-1 flex flex-col gap-0.5 items-start">
          <CreateTopicButton />
        </div>
        </nav>
      </div>
    </aside>
  )
}
