import { z } from 'zod'

export const CreateTopicDto = z.object({
  name: z.string().min(1, 'Name is required').max(255),
})

export const UpdateTopicDto = z.object({
  name: z.string().min(1).max(255),
})

export const ReorderTopicsDto = z.object({
  ids: z.array(z.number().int().positive()),
})

export type CreateTopicInput = z.infer<typeof CreateTopicDto>
export type UpdateTopicInput = z.infer<typeof UpdateTopicDto>
export type ReorderTopicsInput = z.infer<typeof ReorderTopicsDto>
