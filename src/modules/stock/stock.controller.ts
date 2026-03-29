import { Request, Response } from 'express'
import catchAsync from '../../shared/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { StockServices } from './stock.service'

const handleStockDeduction = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body
  const updated = await StockServices.handleStockDeduction(productId, Number(quantity))
  res.status(StatusCodes.OK).json({ success: true, message: 'Stock deducted successfully', updatedStock: updated?.stockQuantity })
})

const handleStockRestock = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body
  const updated = await StockServices.handleStockRestock(productId, Number(quantity))
  res.status(StatusCodes.OK).json({ success: true, message: 'Product restocked', data: updated })
})

export const StockController = { handleStockDeduction, handleStockRestock }