import { StatusCodes } from 'http-status-codes'
import { Category } from './category.model'
import { Product } from './product.model'

const createCategory = async (name: string) => {
  if (!name) throw { status: StatusCodes.BAD_REQUEST, message: 'Category name is required' }
  const existing = await Category.findOne({ name })
  if (existing) throw { status: StatusCodes.CONFLICT, message: 'Category already exists' }
  return Category.create({ name })
}

const createProduct = async (payload: any) => {
  const { name, category: categoryId, price = 0, stockQuantity = 0, minStockThreshold = 5 } = payload
  if (!name) throw { status: StatusCodes.BAD_REQUEST, message: 'Product name is required' }
  let category = undefined
  if (categoryId) {
    category = await Category.findById(categoryId)
    if (!category) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid category id' }
  }
  return Product.create({ name, category: category ? category._id : undefined, price, stockQuantity, minStockThreshold, status: stockQuantity > 0 ? 'Active' : 'Out of Stock' })
}

const listProducts = async (opts: { page?: number; limit?: number; search?: string }) => {
  const page = Math.max(Number(opts.page || 1), 1)
  const limit = Math.max(Number(opts.limit || 20), 1)
  const filter: any = {}
  if (opts.search) filter.$or = [{ name: { $regex: opts.search, $options: 'i' } }]
  const total = await Product.countDocuments(filter)
  const data = await Product.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })
  return { data, meta: { page, limit, total } }
}

const getProduct = async (id: string) => {
  const product = await Product.findById(id)
  if (!product) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  return product
}

const updateProduct = async (id: string, payload: any) => {
  const updated = await Product.findByIdAndUpdate(id, { $set: payload }, { new: true })
  if (!updated) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  return updated
}

const restockProduct = async (id: string, quantity: number) => {
  const q = Number(quantity || 0)
  if (q <= 0) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid quantity' }
  const updated = await Product.findByIdAndUpdate(id, { $inc: { stockQuantity: q }, $set: { status: 'Active' } }, { new: true })
  if (!updated) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  // remove from restock
  const { Restock } = await import('../restock/restock.model')
  await Restock.deleteMany({ product: updated._id })
  const { Activity } = await import('../activity/activity.model')
  await Activity.create({ action: `Product ${updated.name} restocked by ${q}`, metadata: { productId: updated._id, quantity: q } })
  return updated
}

export const ProductServices = { createCategory, createProduct, listProducts, getProduct, updateProduct, restockProduct }
