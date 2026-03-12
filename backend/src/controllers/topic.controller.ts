import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { CreateTopicInput, UpdateTopicInput } from '../dtos/topic.dto'

export async function getAllTopics(_req: Request, res: Response, next: NextFunction) {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
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
    const topic = await prisma.topic.create({
      data: { name: body.name },
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
