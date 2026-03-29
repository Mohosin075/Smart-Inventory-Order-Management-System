import { Router } from 'express'
import { OrderController } from './order.controller'

const router = Router()

router.post('/create', OrderController.createOrder)
router.patch('/update-status', OrderController.updateOrderStatus)
router.get('/', OrderController.listOrders)
router.get('/:id', OrderController.getOrder)
router.delete('/:id', OrderController.cancelOrder)

export const OrderRoutes = router