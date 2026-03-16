import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { CreateBlockInput, UpdateBlockInput, ReorderBlocksInput } from '../dtos/block.dto'

export async function createBlock(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.postId)
    const body = req.body as CreateBlockInput

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      throw new AppError(404, 'Post not found')
    }

    const last = await prisma.block.findFirst({
      where: { postId },
      orderBy: { order: 'desc' },
    })

    const order = last ? last.order + 1.0 : 1.0

    const block = await prisma.block.create({
      data: {
        postId,
        type: body.type,
        content: body.content ?? '',
        codeLanguage: body.codeLanguage ?? null,
        imageUrl: body.imageUrl ?? null,
        order,
      },
    })

    res.status(201).json(block)
  } catch (err) {
    next(err)
  }
}

export async function updateBlock(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.postId)
    const id = Number(req.params.id)
    const body = req.body as UpdateBlockInput

    const existing = await prisma.block.findFirst({ where: { id, postId } })
    if (!existing) {
      throw new AppError(404, 'Block not found')
    }

    const block = await prisma.block.update({
      where: { id },
      data: {
        ...(body.content !== undefined && { content: body.content }),
        ...(body.codeLanguage !== undefined && { codeLanguage: body.codeLanguage }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      },
    })

    res.json(block)
  } catch (err) {
    next(err)
  }
}

export async function deleteBlock(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.postId)
    const id = Number(req.params.id)

    const existing = await prisma.block.findFirst({ where: { id, postId } })
    if (!existing) {
      throw new AppError(404, 'Block not found')
    }

    await prisma.block.delete({ where: { id } })

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function reorderBlocks(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.postId)
    const body = req.body as ReorderBlocksInput

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      throw new AppError(404, 'Post not found')
    }

    await prisma.$transaction(
      body.blockIds.map((blockId, index) =>
        prisma.block.update({
          where: { id: blockId },
          data: { order: (index + 1) * 1.0 },
        })
      )
    )

    const blocks = await prisma.block.findMany({
      where: { postId },
      orderBy: { order: 'asc' },
    })

    res.json(blocks)
  } catch (err) {
    next(err)
  }
}
