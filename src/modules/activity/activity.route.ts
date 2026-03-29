import { Router } from 'express'
import { ActivityController } from './activity.controller'

const router = Router()

router.get('/recent', ActivityController.getRecentActivities)

export const ActivityRoutes = router