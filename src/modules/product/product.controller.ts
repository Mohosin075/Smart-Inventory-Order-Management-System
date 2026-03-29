import { Request, Response } from 'express'
import catchAsync from '../../shared/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { ProductServices } from './product.service'

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body
  const category = await ProductServices.createCategory(name)
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Category created successfully', category })
})

const listCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await ProductServices.listCategories()
  res.status(StatusCodes.OK).json({ success: true, data: categories })
})


const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductServices.createProduct(req.body)
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Product created successfully', product })
})

const listProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.listProducts({ 
    page: req.query.page as any, 
    limit: req.query.limit as any, 
    search: req.query.search as any,
    categoryId: req.query.category as any
  })
  res.status(StatusCodes.OK).json({ success: true, data: result.data, meta: result.meta })
})

const getProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductServices.getProduct(req.params.id)
  res.status(StatusCodes.OK).json({ success: true, data: product })
})

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const updated = await ProductServices.updateProduct(req.params.id, req.body)
  res.status(StatusCodes.OK).json({ success: true, message: 'Product updated', data: updated })
})

const restockProduct = catchAsync(async (req: Request, res: Response) => {
  const updated = await ProductServices.restockProduct(req.params.id, req.body.quantity)
  res.status(StatusCodes.OK).json({ success: true, message: 'Product restocked', data: updated })
})

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductServices.deleteProduct(req.params.id)
  res.status(StatusCodes.OK).json({ success: true, message: 'Product deleted' })
})

export const ProductController = { 
  createCategory, 
  createProduct, 
  listProducts, 
  getProduct, 
  updateProduct, 
  restockProduct, 
  listCategories, 
  deleteProduct 
}