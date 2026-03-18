'use client'

import Link from 'next/link'
import { FileText, Plus, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { GripVertical } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { SidebarNavLink } from '@/components/SidebarNavLink'
import { DeleteTopicButton } from '@/components/DeleteTopicButton'
import { Text } from '@/components/typography/Text'

interface SidebarPost {
  id: number
  title: string
}

interface SidebarTopic {
  id: number
  name: string
  posts: SidebarPost[]
}

interface SidebarContentProps {
  initialTopics: SidebarTopic[]
  ungrouped: SidebarPost[]
}

export const SidebarContent = ({ initialTopics, ungrouped }: SidebarContentProps) => {
  const [topics, setTopics] = useState(initialTopics)
  const [collapsedTopics, setCollapsedTopics] = useState<Set<number>>(new Set())
  const [ungroupedCollapsed, setUngroupedCollapsed] = useState(false)

  useEffect(() => {
    setTopics(initialTopics)
  }, [initialTopics])

  const toggleTopic = (topicId: number) => {
    setCollapsedTopics((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
      } else {
        next.add(topicId)
      }
      return next
    })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    const { type, source, destination } = result

    if (type === 'TOPIC') {
      const reordered = [...topics]
      const [moved] = reordered.splice(source.index, 1)
      reordered.splice(destination.index, 0, moved)
      setTopics(reordered)
      api.topics.reorder(reordered.map((topic) => topic.id))
      return
    }

    if (type === 'POST') {
      const sourceTopicId = Number(source.droppableId.replace('posts-', ''))
      const destTopicId = Number(destination.droppableId.replace('posts-', ''))

      if (sourceTopicId === destTopicId) {
        const updatedTopics = topics.map((topic) => {
          if (topic.id !== sourceTopicId) {
            return topic
          }
          const posts = [...topic.posts]
          const [moved] = posts.splice(source.index, 1)
          posts.splice(destination.index, 0, moved)
          api.posts.reorder(posts.map((post) => post.id))
          return { ...topic, posts }
        })
        setTopics(updatedTopics)
      } else {
        const sourceTopic = topics.find((topic) => topic.id === sourceTopicId)
        if (!sourceTopic) {
          return
        }
        const movedPost = sourceTopic.posts[source.index]
        const updatedTopics = topics.map((topic) => {
          if (topic.id === sourceTopicId) {
            const posts = [...topic.posts]
            posts.splice(source.index, 1)
            return { ...topic, posts }
          }
          if (topic.id === destTopicId) {
            const posts = [...topic.posts]
            posts.splice(destination.index, 0, movedPost)
            api.posts.reorder(posts.map((post) => post.id))
            return { ...topic, posts }
          }
          return topic
        })
        setTopics(updatedTopics)
        api.posts.update(movedPost.id, { title: movedPost.title, topicId: destTopicId })
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="topics" type="TOPIC">
        {(topicsProvided) => (
          <div
            ref={topicsProvided.innerRef}
            {...topicsProvided.droppableProps}
            className="flex flex-col gap-2"
          >
            {topics.map((topic, topicIndex) => {
              const { id: topicId, posts, name } = topic
              return (
                <Draggable key={topicId} draggableId={`topic-${topicId}`} index={topicIndex}>
                  {(topicDraggable) => (
                    <div
                      ref={topicDraggable.innerRef}
                      {...topicDraggable.draggableProps}
                      className="group/topic"
                    >
                      <div className="flex items-center justify-between px-2 py-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            {...topicDraggable.dragHandleProps}
                            aria-label={`Drag to reorder ${name}`}
                            className="text-sidebar-foreground/0 group-hover/topic:text-sidebar-foreground/40 hover:text-sidebar-foreground/70! cursor-grab active:cursor-grabbing transition-colors shrink-0 -ml-1"
                          >
                            <GripVertical size={14} />
                          </div>
                          <Button
                            variant="transparent"
                            size="md"
                            onClick={() => toggleTopic(topicId)}
                            className="justify-start p-0 active:translate-y-0"
                          >
                            <ChevronRight
                              className={`text-sidebar-foreground/60 transition-transform duration-200 ease-in-out ${collapsedTopics.has(topicId) ? '' : 'rotate-90'}`}
                            />
                            <Text
                              as="p"
                              size="xs"
                              variant="tag"
                              className="text-sidebar-foreground/60 truncate"
                            >
                              {name}
                            </Text>
                          </Button>
                        </div>
                        <DeleteTopicButton topicId={topicId} />
                      </div>

                      <div
                        className={`transition-opacity duration-200 ease-in-out ${collapsedTopics.has(topicId) ? 'opacity-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100'}`}
                      >
                        <Droppable droppableId={`posts-${topicId}`} type="POST">
                          {(postsProvided) => (
                            <div
                              ref={postsProvided.innerRef}
                              {...postsProvided.droppableProps}
                              className="flex flex-col gap-0.5"
                            >
                              {posts.length === 0 ? (
                                <Text as="p" size="sm" color="muted" className="pl-8 py-1.5 italic">
                                  No pages yet
                                </Text>
                              ) : (
                                posts.map(({ id: postId, title: postTitle }, postIndex) => (
                                  <Draggable
                                    key={postId}
                                    draggableId={`post-${postId}`}
                                    index={postIndex}
                                  >
                                    {(postDraggable) => (
                                      <div
                                        ref={postDraggable.innerRef}
                                        {...postDraggable.draggableProps}
                                        className="group/post flex items-center gap-2"
                                      >
                                        <div
                                          {...postDraggable.dragHandleProps}
                                          aria-label={`Drag to reorder ${postTitle}`}
                                          className="text-sidebar-foreground/0 group-hover/post:text-sidebar-foreground/30 hover:text-sidebar-foreground/60! cursor-grab active:cursor-grabbing transition-colors shrink-0 pl-2"
                                        >
                                          <GripVertical size={13} />
                                        </div>
                                        <SidebarNavLink
                                          href={`/posts/${postId}`}
                                          className="flex-1 min-w-0 -ml-1.5"
                                        >
                                          <FileText size={15} className="shrink-0 opacity-70" />
                                          <Text as="span" size="sm" className="truncate">
                                            {postTitle}
                                          </Text>
                                        </SidebarNavLink>
                                      </div>
                                    )}
                                  </Draggable>
                                ))
                              )}
                              {postsProvided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        <Link
                          href={`/posts/new?topicId=${topicId}`}
                          aria-label={`New page in ${name}`}
                          className="mt-1 opacity-0 group-hover/topic:opacity-100 transition-opacity flex items-center gap-1.5 pl-8 pr-2 py-1 text-xs text-muted-foreground hover:text-sidebar-foreground"
                        >
                          <Plus size={14} />
                          New page
                        </Link>
                      </div>
                    </div>
                  )}
                </Draggable>
              )
            })}
            {topicsProvided.placeholder}
          </div>
        )}
      </Droppable>

      {topics.length === 0 && ungrouped.length === 0 && (
        <Text as="p" size="sm" color="muted" className="ml-2 px-2 py-1 italic">
          No topics added yet
        </Text>
      )}

      {ungrouped.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-3.5 shrink-0 -ml-1" />
              <Button
                variant="transparent"
                size="md"
                onClick={() => setUngroupedCollapsed((prev) => !prev)}
                className="justify-start p-0 active:translate-y-0"
              >
                <ChevronRight
                  className={`text-sidebar-foreground/60 transition-transform duration-200 ease-in-out ${ungroupedCollapsed ? '' : 'rotate-90'}`}
                />
                <Text
                  as="p"
                  size="xs"
                  variant="tag"
                  className="text-sidebar-foreground/60 truncate"
                >
                  Ungrouped pages
                </Text>
              </Button>
            </div>
          </div>

          <div
            className={`px-6 pt-1 transition-opacity duration-200 ease-in-out ${ungroupedCollapsed ? 'opacity-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100'}`}
          >
            <div className="flex flex-col gap-0.5">
              {ungrouped.map((post) => (
                <SidebarNavLink key={post.id} href={`/posts/${post.id}`}>
                  <FileText size={15} className="shrink-0 opacity-70" />
                  <Text as="span" size="sm" className="truncate">
                    {post.title}
                  </Text>
                </SidebarNavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  )
}
