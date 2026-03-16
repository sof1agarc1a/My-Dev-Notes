import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { CreatePostInput, UpdatePostInput, ReorderPostsInput } from '../dtos/post.dto'

export async function reorderPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids } = req.body as ReorderPostsInput
    await Promise.all(
      ids.map((id, index) => prisma.post.update({ where: { id }, data: { order: index + 1 } }))
    )
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function getAllPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { blocks: true } } },
    })
    res.json(posts)
  } catch (err) {
    next(err)
  }
}

export async function getPostById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)

    const post = await prisma.post.findUnique({
      where: { id },
      include: { blocks: { orderBy: { order: 'asc' } } },
    })

    if (!post) {
      throw new AppError(404, 'Post not found')
    }

    res.json(post)
  } catch (err) {
    next(err)
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as CreatePostInput

    const post = await prisma.post.create({
      data: {
        title: body.title,
        topicId: body.topicId ?? null,
        blocks: body.blocks
          ? {
              create: body.blocks.map((b, i) => ({
                type: b.type,
                content: b.content ?? '',
                codeLanguage: b.codeLanguage ?? null,
                imageUrl: b.imageUrl ?? null,
                order: (i + 1) * 1.0,
              })),
            }
          : undefined,
      },
      include: { blocks: { orderBy: { order: 'asc' } } },
    })

    res.status(201).json(post)
  } catch (err) {
    next(err)
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const body = req.body as UpdatePostInput

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError(404, 'Post not found')
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        ...(body.topicId !== undefined && { topicId: body.topicId }),
      },
      include: { blocks: { orderBy: { order: 'asc' } } },
    })

    res.json(post)
  } catch (err) {
    next(err)
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError(404, 'Post not found')
    }

    await prisma.post.delete({ where: { id } })

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
