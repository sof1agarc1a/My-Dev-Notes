import { Router } from 'express'
import { validate } from '../middleware/validate'
import { CreatePostDto, UpdatePostDto } from '../dtos/post.dto'
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/post.controller'
import sectionRoutes from './section.routes'

const router = Router()

router.get('/', getAllPosts)
router.post('/', validate(CreatePostDto), createPost)
router.get('/:id', getPostById)
router.put('/:id', validate(UpdatePostDto), updatePost)
router.delete('/:id', deletePost)

router.use('/:postId/sections', sectionRoutes)

export default router