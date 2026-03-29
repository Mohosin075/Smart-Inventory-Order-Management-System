import { Request, Response } from 'express'
import catchAsync from '../../shared/catchAsync'
import { StatusCodes } from 'http-status-codes'

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  // Minimal webhook handler stub — real logic (signature verification, events) should be implemented
  res.status(StatusCodes.OK).json({ success: true, message: 'Webhook received' })
})

export const SubscriptionController = { handleWebhook }
