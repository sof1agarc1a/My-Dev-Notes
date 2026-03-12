import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { CreateGroupInput, UpdateGroupInput } from '../dtos/group.dto'

export async function getAllGroups(_req: Request, res: Response, next: NextFunction) {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true },
        },
      },
    })
    res.json(groups)
  } catch (err) {
    next(err)
  }
}

export async function createGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as CreateGroupInput
    const group = await prisma.group.create({
      data: { name: body.name },
      include: {
        posts: { select: { id: true, title: true } },
      },
    })
    res.status(201).json(group)
  } catch (err) {
    next(err)
  }
}

export async function updateGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const body = req.body as UpdateGroupInput
    const existing = await prisma.group.findUnique({ where: { id } })
    if (!existing) throw new AppError(404, 'Group not found')

    const group = await prisma.group.update({
      where: { id },
      data: { name: body.name },
      include: {
        posts: { select: { id: true, title: true } },
      },
    })
    res.json(group)
  } catch (err) {
    next(err)
  }
}

export async function deleteGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    const existing = await prisma.group.findUnique({ where: { id } })
    if (!existing) throw new AppError(404, 'Group not found')

    await prisma.post.updateMany({ where: { groupId: id }, data: { groupId: null } })
    await prisma.group.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
