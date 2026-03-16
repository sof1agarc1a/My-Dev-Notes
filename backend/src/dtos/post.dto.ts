import { z } from 'zod'

const BlockTypeEnum = z.enum(['heading', 'text', 'image', 'code', 'divider'])

export const CreatePostDto = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  topicId: z.number().int().positive().nullable().optional(),
  blocks: z
    .array(
      z.object({
        type: BlockTypeEnum,
        content: z.string().default(''),
        codeLanguage: z.string().max(50).nullable().optional(),
        imageUrl: z.string().nullable().optional(),
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
