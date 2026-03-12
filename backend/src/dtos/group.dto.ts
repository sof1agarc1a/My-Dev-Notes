import { z } from 'zod'

export const CreateGroupDto = z.object({
  name: z.string().min(1, 'Name is required').max(255),
})

export const UpdateGroupDto = z.object({
  name: z.string().min(1).max(255),
})

export type CreateGroupInput = z.infer<typeof CreateGroupDto>
export type UpdateGroupInput = z.infer<typeof UpdateGroupDto>
