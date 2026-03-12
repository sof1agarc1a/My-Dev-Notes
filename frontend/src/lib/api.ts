const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

export interface Section {
  id: number
  headline: string
  content: string
  order: number
  postId: number
}

export interface Post {
  id: number
  title: string
  topicId: number | null
  sections: Section[]
  createdAt: string
  updatedAt: string
  _count?: { sections: number }
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
    create: (data: { title: string; topicId?: number | null; sections?: { headline: string; content: string }[] }) =>
      request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { title: string; topicId?: number | null }) =>
      request<Post>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<void>(`/posts/${id}`, { method: 'DELETE' }),
  },
  topics: {
    list: () => request<Topic[]>('/topics'),
    create: (data: { name: string }) =>
      request<Topic>('/topics', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { name: string }) =>
      request<Topic>(`/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<void>(`/topics/${id}`, { method: 'DELETE' }),
  },
  sections: {
    create: (postId: number, data: { headline: string; content: string }) =>
      request<Section>(`/posts/${postId}/sections`, { method: 'POST', body: JSON.stringify(data) }),
    update: (postId: number, id: number, data: { headline?: string; content?: string }) =>
      request<Section>(`/posts/${postId}/sections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (postId: number, id: number) =>
      request<void>(`/posts/${postId}/sections/${id}`, { method: 'DELETE' }),
    reorder: (postId: number, sectionIds: number[]) =>
      request<Section[]>(`/posts/${postId}/sections/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ sectionIds }),
      }),
  },
}
