import { Request, Response } from 'express'
import catchAsync from '../../shared/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { Order } from '../order/order.model'
import { Product } from '../product/product.model'

const getInsights = catchAsync(async (req: Request, res: Response) => {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

  const totalOrdersToday = await Order.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
  const pendingOrders = await Order.countDocuments({ status: 'Pending' })
  const completedOrders = await Order.countDocuments({ status: { $in: ['Delivered', 'Shipped', 'Confirmed'] } })
  const lowStockItems = await Product.countDocuments({ $expr: { $lt: ['$stockQuantity', '$minStockThreshold'] } })
  const revenueOrders = await Order.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).select('totalPrice')
  const revenueToday = revenueOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0)

  const insights = {
    totalOrdersToday,
    pendingOrders,
    completedOrders,
    lowStockItems,
    revenueToday,
  }

  res.status(StatusCodes.OK).json({ success: true, message: 'Dashboard insights fetched successfully', insights })
})

export const DashboardController = { getInsights }