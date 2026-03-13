import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { CreateTopicInput, UpdateTopicInput, ReorderTopicsInput } from '../dtos/topic.dto'

export async function reorderTopics(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids } = req.body as ReorderTopicsInput
    await Promise.all(
      ids.map((id, index) => prisma.topic.update({ where: { id }, data: { order: index + 1 } }))
    )
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function getAllTopics(_req: Request, res: Response, next: NextFunction) {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { order: 'asc' },
      include: {
        posts: {
          orderBy: { order: 'asc' },
          select: { id: true, title: true },
        },
      },
    })
    res.json(topics)
  } catch (err) {
    next(err)
  }
}

export async function createTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as CreateTopicInput
    const last = await prisma.topic.findFirst({ orderBy: { order: 'desc' }, select: { order: true } })
    const topic = await prisma.topic.create({
      data: { name: body.name, order: (last?.order ?? 0) + 1 },
      include: {
        posts: { select: { id: true, title: true } },
      },
    })
    res.status(201).json(topic)
  } catch (err) {
    next(err)
  }
}

export async function updateTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const body = req.body as UpdateTopicInput
    const existing = await prisma.topic.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError(404, 'Topic not found')
    }

    const topic = await prisma.topic.update({
      where: { id },
      data: { name: body.name },
      include: {
        posts: { select: { id: true, title: true } },
      },
    })
    res.json(topic)
  } catch (err) {
    next(err)
  }
}

export async function deleteTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const existing = await prisma.topic.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError(404, 'Topic not found')
    }

    await prisma.post.updateMany({ where: { topicId: id }, data: { topicId: null } })
    await prisma.topic.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
