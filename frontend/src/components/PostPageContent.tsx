'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Post, Topic, api } from '@/lib/api'
import { PostView } from '@/components/PostView'
import { PostForm } from '@/components/PostForm'

interface PostPageContentProps {
  post: Post
  topics: Topic[]
}

export const PostPageContent = ({ post: initialPost, topics }: PostPageContentProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState(initialPost)

  const handleEditSuccess = async () => {
    try {
      const updatedPost = await api.posts.get(currentPost.id)
      setCurrentPost(updatedPost)
    } catch {
      // fall through with existing data
    }
    setIsEditing(false)
    router.refresh()
  }

  return isEditing ? (
    <div className="max-w-5xl mx-auto px-12 pt-16 pb-24">
      <PostForm
        post={currentPost}
        topics={topics}
        onSuccess={handleEditSuccess}
        onCancel={() => setIsEditing(false)}
      />
    </div>
  ) : (
    <PostView post={currentPost} topics={topics} onEdit={() => setIsEditing(true)} />
  )
}
