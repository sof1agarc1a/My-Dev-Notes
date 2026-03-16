'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Post, Topic, api } from '@/lib/api'
import { PostView } from '@/components/PostView'
import { PostForm } from '@/components/PostForm'

interface PostPageContentProps {
  post: Post
  topics: Topic[]
}

export const PostPageContent = ({ post: initialPost, topics }: PostPageContentProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(() => searchParams.get('edit') === 'true')
  const [currentPost, setCurrentPost] = useState(initialPost)

  const enterEdit = () => {
    setIsEditing(true)
    router.replace(`?edit=true`)
  }

  const exitEdit = () => {
    setIsEditing(false)
    router.replace(`?`)
  }

  const handleEditSuccess = async () => {
    try {
      const updatedPost = await api.posts.get(currentPost.id)
      setCurrentPost(updatedPost)
    } catch {
      // fall through with existing data
    }
    exitEdit()
    router.refresh()
  }

  return isEditing ? (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-48">
      <PostForm
        post={currentPost}
        topics={topics}
        onSuccess={handleEditSuccess}
        onCancel={exitEdit}
      />
    </div>
  ) : (
    <PostView post={currentPost} topics={topics} onEdit={enterEdit} />
  )
}
