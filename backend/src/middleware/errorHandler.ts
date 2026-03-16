import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res) => {
  const isDev = process.env.NODE_ENV === 'development'

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      issues: err.issues.map((i) => ({
        path: i.path.map(String).join('.'),
        message: i.message,
      })),
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  console.error(err)

  res.status(500).json({
    error: 'Internal Server Error',
    ...(isDev && err instanceof Error ? { detail: err.message, stack: err.stack } : {}),
  })
}
