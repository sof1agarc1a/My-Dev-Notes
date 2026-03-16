import { Router } from 'express'
import { validate } from '../middleware/validate'
import { CreateTopicDto, UpdateTopicDto, ReorderTopicsDto } from '../dtos/topic.dto'
import {
  getAllTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  reorderTopics,
} from '../controllers/topic.controller'

const router = Router()

router.get('/', getAllTopics)
router.post('/', validate(CreateTopicDto), createTopic)
router.patch('/reorder', validate(ReorderTopicsDto), reorderTopics)
router.put('/:id', validate(UpdateTopicDto), updateTopic)
router.delete('/:id', deleteTopic)

export default router
