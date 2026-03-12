import { Router } from 'express'
import { validate } from '../middleware/validate'
import { CreateSectionDto, UpdateSectionDto, ReorderSectionsDto } from '../dtos/section.dto'
import {
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from '../controllers/section.controller'

const router = Router({ mergeParams: true })

router.post('/', validate(CreateSectionDto), createSection)
router.put('/reorder', validate(ReorderSectionsDto), reorderSections)
router.put('/:id', validate(UpdateSectionDto), updateSection)
router.delete('/:id', deleteSection)

export default router