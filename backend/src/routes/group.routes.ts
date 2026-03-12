import { Router } from 'express'
import { validate } from '../middleware/validate'
import { CreateGroupDto, UpdateGroupDto } from '../dtos/group.dto'
import { getAllGroups, createGroup, updateGroup, deleteGroup } from '../controllers/group.controller'

const router = Router()

router.get('/', getAllGroups)
router.post('/', validate(CreateGroupDto), createGroup)
router.put('/:id', validate(UpdateGroupDto), updateGroup)
router.delete('/:id', deleteGroup)

export default router
