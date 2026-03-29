import { Request, Response } from 'express'
import catchAsync from '../../shared/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { ActivityServices } from './activity.service'

const getRecentActivities = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit || 10)
  const activities = await ActivityServices.getRecentActivities(limit)
  res.status(StatusCodes.OK).json({ success: true, message: 'Recent activities fetched successfully', activities })
})

export const ActivityController = { getRecentActivities }