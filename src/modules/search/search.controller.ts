import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../shared/catchAsync'

const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const queryParam = String(req.query.query || '')

  // Simulate search logic
  const results = [
    { id: 1, name: 'iPhone 13', stock: 3 },
    { id: 2, name: 'MacBook Pro', stock: 5 },
  ].filter(product => product.name.toLowerCase().includes(queryParam.toLowerCase()));

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Search results fetched successfully',
    results,
  })
})

export const SearchController = { searchProducts }