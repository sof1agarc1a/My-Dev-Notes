const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

export type BlockType = 'heading' | 'text' | 'image' | 'code' | 'divider'

export interface Block {
  id: number
  postId: number
  type: BlockType
  content: string
  codeLanguage: string | null
  imageUrl: string | null
  order: number
}

export interface Post {
  id: number
  title: string
  topicId: number | null
  blocks: Block[]
  createdAt: string
  updatedAt: string
  _count?: { blocks: number }
}

export interface Topic {
  id: number
  name: string
  posts: Pick<Post, 'id' | 'title'>[]
  createdAt: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }
  return res.json()
}

export const api = {
  posts: {
    list: () => request<Post[]>('/posts'),
    get: (id: number) => request<Post>(`/posts/${id}`),
    create: (data: {
      title: string
      topicId?: number | null
      blocks?: {
        type: BlockType
        content: string
        codeLanguage?: string | null
        imageUrl?: string | null
      }[]
    }) => request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { title: string; topicId?: number | null }) =>
      request<Post>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<void>(`/posts/${id}`, { method: 'DELETE' }),
    reorder: (ids: number[]) =>
      request<void>('/posts/reorder', { method: 'PATCH', body: JSON.stringify({ ids }) }),
  },
  topics: {
    list: () => request<Topic[]>('/topics'),
    create: (data: { name: string }) =>
      request<Topic>('/topics', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { name: string }) =>
      request<Topic>(`/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<void>(`/topics/${id}`, { method: 'DELETE' }),
    reorder: (ids: number[]) =>
      request<void>('/topics/reorder', { method: 'PATCH', body: JSON.stringify({ ids }) }),
  },
  blocks: {
    create: (
      postId: number,
      data: { type: BlockType; content?: string; codeLanguage?: string | null; imageUrl?: string | null }
    ) => request<Block>(`/posts/${postId}/blocks`, { method: 'POST', body: JSON.stringify(data) }),
    update: (
      postId: number,
      id: number,
      data: { content?: string; codeLanguage?: string | null; imageUrl?: string | null }
    ) =>
      request<Block>(`/posts/${postId}/blocks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (postId: number, id: number) =>
      request<void>(`/posts/${postId}/blocks/${id}`, { method: 'DELETE' }),
    reorder: (postId: number, blockIds: number[]) =>
      request<Block[]>(`/posts/${postId}/blocks/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ blockIds }),
      }),
  },
}
