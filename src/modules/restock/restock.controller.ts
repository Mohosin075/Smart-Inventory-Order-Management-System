import { Request, Response } from 'express'
import catchAsync from '../../shared/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { RestockServices } from './restock.service'

const addToRestockQueue = catchAsync(async (req: Request, res: Response) => {
  const item = await RestockServices.addToRestockQueue(req.body.productId)
  res.status(StatusCodes.OK).json({ success: true, message: 'Added to restock queue', queueItem: item })
})

const listQueue = catchAsync(async (req: Request, res: Response) => {
  const items = await RestockServices.listQueue()
  res.status(StatusCodes.OK).json({ success: true, data: items })
})

const restockFromQueue = catchAsync(async (req: Request, res: Response) => {
  const product = await RestockServices.restockFromQueue(req.params.id, Number(req.body.quantity))
  res.status(StatusCodes.OK).json({ success: true, message: 'Product restocked', data: product })
})

const removeFromQueue = catchAsync(async (req: Request, res: Response) => {
  await RestockServices.removeFromQueue(req.params.id)
  res.status(StatusCodes.OK).json({ success: true, message: 'Removed from restock queue' })
})

export const RestockController = { addToRestockQueue, listQueue, restockFromQueue, removeFromQueue }

