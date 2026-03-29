import { Router } from 'express'
import { DashboardController } from './dashboard.controller'

const router = Router()

router.get('/insights', DashboardController.getInsights)

export const DashboardRoutes = router