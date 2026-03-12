import { z } from 'zod'

export const CreateTopicDto = z.object({
  name: z.string().min(1, 'Name is required').max(255),
})

export const UpdateTopicDto = z.object({
  name: z.string().min(1).max(255),
})

export type CreateTopicInput = z.infer<typeof CreateTopicDto>
export type UpdateTopicInput = z.infer<typeof UpdateTopicDto>
