import { Router } from 'express'
import { StockController } from './stock.controller'

const router = Router()

router.post('/deduct', StockController.handleStockDeduction)
router.post('/restock', StockController.handleStockRestock)

export const StockRoutes = router