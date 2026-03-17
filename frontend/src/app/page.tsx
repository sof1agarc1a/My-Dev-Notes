import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/typography/Heading'
import { Text } from '@/components/typography/Text'
import { PenLine } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-start h-full text-center px-8 pt-[30vh]">
      <Heading as="h1" size="lg" className="mb-4">
        Welcome to My Notes
      </Heading>
      <Text as="p" size="lg" color="muted" className="mb-8 max-w-xs">
        Select a page from the sidebar, or create a new one to get started.
      </Text>
      <Link href="/posts/new">
        <Button variant="outline" size="lg">
          <PenLine />
          New page
        </Button>
      </Link>
    </div>
  )
}
