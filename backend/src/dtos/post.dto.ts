import { z } from 'zod'

export const CreatePostDto = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  topicId: z.number().int().positive().nullable().optional(),
  sections: z
    .array(
      z.object({
        headline: z.string().max(255),
        content: z.string(),
        code: z.string().optional(),
        codeLanguage: z.string().max(50).optional(),
      })
    )
    .optional(),
})

export const UpdatePostDto = z.object({
  title: z.string().min(1).max(255),
  topicId: z.number().int().positive().nullable().optional(),
})

export const ReorderPostsDto = z.object({
  ids: z.array(z.number().int().positive()),
})

export type CreatePostInput = z.infer<typeof CreatePostDto>
export type UpdatePostInput = z.infer<typeof UpdatePostDto>
export type ReorderPostsInput = z.infer<typeof ReorderPostsDto>
