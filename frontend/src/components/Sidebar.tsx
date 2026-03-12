import Link from 'next/link'
import { FileText, BookOpen, Plus } from 'lucide-react'
import { SidebarNavLink } from '@/components/SidebarNavLink'
import { CreateGroupButton } from '@/components/CreateGroupButton'
import { DeleteGroupButton } from '@/components/DeleteGroupButton'
import { Text } from '@/components/typography/Text'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

interface SidebarPost {
  id: number
  title: string
  groupId: number | null
}

interface SidebarGroup {
  id: number
  name: string
  posts: Pick<SidebarPost, 'id' | 'title'>[]
}

async function getData(): Promise<{ groups: SidebarGroup[]; ungrouped: SidebarPost[] }> {
  try {
    const [groupsRes, postsRes] = await Promise.all([
      fetch(`${API_URL}/groups`, { cache: 'no-store' }),
      fetch(`${API_URL}/posts`, { cache: 'no-store' }),
    ])
    const groups: SidebarGroup[] = groupsRes.ok ? await groupsRes.json() : []
    const posts: SidebarPost[] = postsRes.ok ? await postsRes.json() : []
    const groupedIds = new Set(groups.flatMap((g) => g.posts.map((p) => p.id)))
    const ungrouped = posts.filter((p) => !groupedIds.has(p.id))
    return { groups, ungrouped }
  } catch {
    return { groups: [], ungrouped: [] }
  }
}

export const Sidebar = async () => {
  const { groups, ungrouped } = await getData()

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
          <Text as="span" size="lg" className="font-sans font-bold text-sidebar-foreground/50">My Notes</Text>
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
        <nav className="h-full overflow-y-auto scrollbar-hidden px-4 pb-32 mt-6 flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.id}>
            <div className="group/group flex items-center justify-between px-2 py-1 mb-0.5">
              <Text as="p" size="xs" className="font-semibold text-sidebar-foreground/60 uppercase tracking-widest truncate">
                {group.name}
              </Text>
              <DeleteGroupButton groupId={group.id} />
            </div>
            <div className="flex flex-col gap-0.5">
              {group.posts.length === 0 ? (
                <Text as="p" size="sm" className="text-sidebar-foreground/40 px-2 py-1 italic">No pages yet</Text>
              ) : (
                group.posts.map((post) => (
                  <SidebarNavLink key={post.id} href={`/posts/${post.id}`}>
                    <FileText size={15} className="shrink-0 opacity-70" />
                    <Text as="span" size="sm" className="truncate">{post.title}</Text>
                  </SidebarNavLink>
                ))
              )}
            </div>
          </div>
        ))}

        {ungrouped.length > 0 && (
          <div>
            {groups.length > 0 && (
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

        {groups.length === 0 && ungrouped.length === 0 && (
          <Text as="p" size="sm" className="text-sidebar-foreground/40 px-2 py-1">No pages yet</Text>
        )}

        <div className="pt-1">
          <CreateGroupButton />
        </div>
        </nav>
      </div>
    </aside>
  )
}
