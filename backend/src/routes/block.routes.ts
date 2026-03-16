import { Router } from 'express'
import { validate } from '../middleware/validate'
import { CreateBlockDto, UpdateBlockDto, ReorderBlocksDto } from '../dtos/block.dto'
import {
  createBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
} from '../controllers/block.controller'

const router = Router({ mergeParams: true })

router.post('/', validate(CreateBlockDto), createBlock)
router.put('/reorder', validate(ReorderBlocksDto), reorderBlocks)
router.put('/:id', validate(UpdateBlockDto), updateBlock)
router.delete('/:id', deleteBlock)

export default router
