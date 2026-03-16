import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { CreateSectionInput, UpdateSectionInput, ReorderSectionsInput } from '../dtos/section.dto'

export async function createSection(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.postId)
    const body = req.body as CreateSectionInput

    const post = await prisma.post.findUnique({ where: { id: postId } })

    if (!post) {
      throw new AppError(404, 'Post not found')
    }

    const last = await prisma.section.findFirst({
      where: { postId },
      orderBy: { order: 'desc' },
    })

    const order = last ? last.order + 1.0 : 1.0

    const section = await prisma.section.create({
      data: {
        headline: body.headline,
        content: body.content,
        code: body.code ?? null,
        codeLanguage: body.codeLanguage ?? null,
        imageUrl: body.imageUrl ?? null,
        order,
        postId,
      },
    })

    res.status(201).json(section)
  } catch (err) {
    next(err)
  }
}

export async function updateSection(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.postId)
    const id = Number(req.params.id)
    const body = req.body as UpdateSectionInput

    const existing = await prisma.section.findFirst({ where: { id, postId } })
    if (!existing) {
      throw new AppError(404, 'Section not found')
    }

    const section = await prisma.section.update({
      where: { id },
      data: {
        ...(body.headline !== undefined && { headline: body.headline }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.code !== undefined && { code: body.code }),
        ...(body.codeLanguage !== undefined && { codeLanguage: body.codeLanguage }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      },
    })

    res.json(section)
  } catch (err) {
    next(err)
  }
}

export async function deleteSection(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.postId)
    const id = Number(req.params.id)

    const existing = await prisma.section.findFirst({ where: { id, postId } })
    if (!existing) {
      throw new AppError(404, 'Section not found')
    }

    await prisma.section.delete({ where: { id } })

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function reorderSections(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.postId)
    const body = req.body as ReorderSectionsInput

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      throw new AppError(404, 'Post not found')
    }

    const updates = body.sectionIds.map((sectionId, index) =>
      prisma.section.update({
        where: { id: sectionId },
        data: { order: (index + 1) * 1.0 },
      })
    )

    await prisma.$transaction(updates)

    const sections = await prisma.section.findMany({
      where: { postId },
      orderBy: { order: 'asc' },
    })

    res.json(sections)
  } catch (err) {
    next(err)
  }
}
