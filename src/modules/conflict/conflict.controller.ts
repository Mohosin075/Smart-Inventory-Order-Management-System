import { Request, Response } from 'express'
import catchAsync from '../../shared/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { ConflictServices } from './conflict.service'

const detectConflicts = catchAsync(async (req: Request, res: Response) => {
  const conflicts = await ConflictServices.detectConflicts(req.body)
  res.status(StatusCodes.OK).json({ success: true, message: 'Conflict detection completed', conflicts })
})

export const ConflictController = { detectConflicts }