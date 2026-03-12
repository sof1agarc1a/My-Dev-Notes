import { z } from 'zod'

export const CreatePostDto = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  topicId: z.number().int().positive().nullable().optional(),
  sections: z
    .array(
      z.object({
        headline: z.string().max(255),
        content: z.string(),
      })
    )
    .optional(),
})

export const UpdatePostDto = z.object({
  title: z.string().min(1).max(255),
  topicId: z.number().int().positive().nullable().optional(),
})

export type CreatePostInput = z.infer<typeof CreatePostDto>
export type UpdatePostInput = z.infer<typeof UpdatePostDto>
