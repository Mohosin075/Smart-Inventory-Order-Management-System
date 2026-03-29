import { Router } from 'express'
import { ConflictController } from './conflict.controller'

const router = Router()

router.post('/detect', ConflictController.detectConflicts)

export const ConflictRoutes = router