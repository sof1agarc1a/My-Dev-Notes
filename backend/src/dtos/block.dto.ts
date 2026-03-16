import { z } from 'zod'

const BlockTypeEnum = z.enum(['heading', 'text', 'image', 'code', 'divider'])

export const CreateBlockDto = z.object({
  type: BlockTypeEnum,
  content: z.string().default(''),
  codeLanguage: z.string().max(50).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
})

export const UpdateBlockDto = z.object({
  content: z.string().optional(),
  codeLanguage: z.string().max(50).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
})

export const ReorderBlocksDto = z.object({
  blockIds: z.array(z.number().int().positive()),
})

export type CreateBlockInput = z.infer<typeof CreateBlockDto>
export type UpdateBlockInput = z.infer<typeof UpdateBlockDto>
export type ReorderBlocksInput = z.infer<typeof ReorderBlocksDto>
