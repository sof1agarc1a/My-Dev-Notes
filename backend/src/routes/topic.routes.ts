import { Router } from 'express'
import { validate } from '../middleware/validate'
import { CreateTopicDto, UpdateTopicDto } from '../dtos/topic.dto'
import { getAllTopics, createTopic, updateTopic, deleteTopic } from '../controllers/topic.controller'

const router = Router()

router.get('/', getAllTopics)
router.post('/', validate(CreateTopicDto), createTopic)
router.put('/:id', validate(UpdateTopicDto), updateTopic)
router.delete('/:id', deleteTopic)

export default router
