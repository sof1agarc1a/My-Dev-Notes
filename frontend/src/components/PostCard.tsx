import Link from 'next/link'
import { Post } from '@/lib/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Heading } from '@/components/typography/Heading'
import { Text } from '@/components/typography/Text'

interface PostCardProps {
  post: Post
}

export const PostCard = ({ post }: PostCardProps) => {
  const sectionCount = post._count?.sections ?? post.sections?.length ?? 0
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <Heading as="h2" size="sm">
            {post.title}
          </Heading>
        </CardHeader>
        
        <CardContent>
          <Text as="span" size="xs" className="text-muted-foreground">
            {sectionCount} {sectionCount === 1 ? 'section' : 'sections'} · {date}
          </Text>
        </CardContent>
      </Card>
    </Link>
  )
}