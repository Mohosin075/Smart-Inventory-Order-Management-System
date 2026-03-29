import { Request, Response } from 'express'
import catchAsync from '../../shared/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { OrderServices } from './order.service'

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { customerName, products } = req.body
  const created = await OrderServices.createOrder(customerName, products)
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Order created successfully', order: created })
})

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId, status } = req.body
  const updated = await OrderServices.updateOrderStatus(orderId, status)
  res.status(StatusCodes.OK).json({ success: true, message: `Order #${orderId} status updated to ${status}`, order: updated })
})

const listOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.listOrders(req.query)
  res.status(StatusCodes.OK).json({ success: true, data: result.data, meta: result.meta })
})

const getOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await OrderServices.getOrder(req.params.id)
  res.status(StatusCodes.OK).json({ success: true, data: order })
})

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await OrderServices.cancelOrder(req.params.id)
  res.status(StatusCodes.OK).json({ success: true, message: 'Order cancelled', data: order })
})

export const OrderController = { createOrder, updateOrderStatus, listOrders, getOrder, cancelOrder }