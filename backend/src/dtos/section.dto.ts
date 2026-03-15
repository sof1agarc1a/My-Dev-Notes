import { z } from 'zod'

export const CreateSectionDto = z.object({
  headline: z.string().min(1, 'Headline is required').max(255),
  content: z.string().min(1, 'Content is required'),
  code: z.string().nullable().optional(),
  codeLanguage: z.string().max(50).nullable().optional(),
})

export const UpdateSectionDto = z.object({
  headline: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  code: z.string().nullable().optional(),
  codeLanguage: z.string().max(50).nullable().optional(),
})

export const ReorderSectionsDto = z.object({
  sectionIds: z.array(z.number().int().positive()),
})

export type CreateSectionInput = z.infer<typeof CreateSectionDto>
export type UpdateSectionInput = z.infer<typeof UpdateSectionDto>
export type ReorderSectionsInput = z.infer<typeof ReorderSectionsDto>