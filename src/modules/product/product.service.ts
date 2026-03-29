import { StatusCodes } from 'http-status-codes'
import { Category } from './category.model'
import { Product } from './product.model'

const createCategory = async (name: string) => {
  if (!name) throw { status: StatusCodes.BAD_REQUEST, message: 'Category name is required' }
  // case-insensitive check
  const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
  if (existing) throw { status: StatusCodes.CONFLICT, message: 'Category already exists' }
  return Category.create({ name })
}

const listCategories = async () => {
  return Category.find().sort({ name: 1 })
}

const updateCategory = async (id: string, name: string) => {
  if (!name) throw { status: StatusCodes.BAD_REQUEST, message: 'Category name is required' }
  const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, _id: { $ne: id } })
  if (existing) throw { status: StatusCodes.CONFLICT, message: 'Category already exists' }
  const updated = await Category.findByIdAndUpdate(id, { name }, { new: true })
  if (!updated) throw { status: StatusCodes.NOT_FOUND, message: 'Category not found' }
  return updated
}

const deleteCategory = async (id: string) => {
  const category = await Category.findById(id)
  if (!category) throw { status: StatusCodes.NOT_FOUND, message: 'Category not found' }
  // nullify categories in linked products
  await Product.updateMany({ category: id }, { $unset: { category: 1 } })
  await Category.findByIdAndDelete(id)
  return { success: true }
}


const createProduct = async (payload: any) => {
  const { 
    name, 
    category, 
    categoryId, 
    price = 0, 
    stock, 
    stockQuantity, 
    threshold, 
    minStockThreshold 
  } = payload

  if (!name) throw { status: StatusCodes.BAD_REQUEST, message: 'Product name is required' }
  
  const targetCategoryId = categoryId || category
  const targetStock = stockQuantity !== undefined ? stockQuantity : (stock !== undefined ? Number(stock) : 0)
  const targetThreshold = minStockThreshold !== undefined ? minStockThreshold : (threshold !== undefined ? Number(threshold) : 5)

  let foundCategory = undefined
  if (targetCategoryId) {
    foundCategory = await Category.findById(targetCategoryId)
    if (!foundCategory) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid category id' }
  }

  return Product.create({ 
    name, 
    category: foundCategory ? foundCategory._id : undefined, 
    price: Number(price), 
    stockQuantity: targetStock, 
    minStockThreshold: targetThreshold, 
    status: targetStock > 0 ? 'Active' : 'Out of Stock' 
  })
}


const listProducts = async (opts: { page?: number; limit?: number; search?: string; categoryId?: string }) => {
  const page = Math.max(Number(opts.page || 1), 1)
  const limit = Math.max(Number(opts.limit || 20), 1)
  const filter: any = {}
  if (opts.search) filter.$or = [{ name: { $regex: opts.search, $options: 'i' } }]
  if (opts.categoryId) filter.category = opts.categoryId
  const total = await Product.countDocuments(filter)
  const data = await Product.find(filter).populate('category').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })

  return { data, meta: { page, limit, total } }
}

const getProduct = async (id: string) => {
  const product = await Product.findById(id).populate('category')

  if (!product) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  return product
}

const updateProduct = async (id: string, payload: any) => {
  const { stock, stockQuantity, threshold, minStockThreshold, ...rest } = payload
  
  const updateData: any = { ...rest }
  
  if (stockQuantity !== undefined) updateData.stockQuantity = Number(stockQuantity)
  else if (stock !== undefined) updateData.stockQuantity = Number(stock)
  
  if (minStockThreshold !== undefined) updateData.minStockThreshold = Number(minStockThreshold)
  else if (threshold !== undefined) updateData.minStockThreshold = Number(threshold)
  
  if (updateData.stockQuantity !== undefined) {
    updateData.status = updateData.stockQuantity > 0 ? 'Active' : 'Out of Stock'
  }

  const updated = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true })
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

const deleteProduct = async (id: string) => {
  const deleted = await Product.findByIdAndDelete(id)
  if (!deleted) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  // delete related restock entries
  const { Restock } = await import('../restock/restock.model')
  await Restock.deleteMany({ product: id })
  return deleted
}

export const ProductServices = { 
  createCategory, 
  createProduct, 
  listProducts, 
  getProduct, 
  updateProduct, 
  restockProduct, 
  listCategories, 
  deleteProduct,
  updateCategory,
  deleteCategory
}

