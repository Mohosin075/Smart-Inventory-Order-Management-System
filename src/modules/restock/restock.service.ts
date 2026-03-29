import { Restock } from './restock.model'
import { Product } from '../product/product.model'
import { Activity } from '../activity/activity.model'
import { StatusCodes } from 'http-status-codes'

const addToRestockQueue = async (productId: string) => {
  if (!productId) throw { status: StatusCodes.BAD_REQUEST, message: 'productId required' }
  const product = await Product.findById(productId)
  if (!product) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  const priority = product.stockQuantity < 2 ? 'High' : product.stockQuantity < 5 ? 'Medium' : 'Low'
  const exists = await Restock.findOne({ product: product._id })
  if (exists) return exists
  const queueItem = await Restock.create({ product: product._id, priority })
  await Activity.create({ action: `Product ${product.name} added to restock queue`, metadata: { productId: product._id, priority } })
  return queueItem
}

const listQueue = async () => {
  return Restock.find().populate('product').sort({ 'product.stockQuantity': 1 })
}

const restockFromQueue = async (id: string, quantity: number) => {
  const q = Number(quantity || 0)
  if (q <= 0) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid quantity' }
  const item = await Restock.findById(id)
  if (!item) throw { status: StatusCodes.NOT_FOUND, message: 'Queue item not found' }
  const product = await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: q }, $set: { status: 'Active' } }, { new: true })
  if (!product) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  await Restock.findByIdAndDelete(id)
  await Activity.create({ action: `Product ${product.name} restocked from queue by ${q}`, metadata: { productId: product._id } })
  return product
}

const removeFromQueue = async (id: string) => {
  const removed = await Restock.findByIdAndDelete(id)
  if (!removed) throw { status: StatusCodes.NOT_FOUND, message: 'Queue item not found' }
  await Activity.create({ action: `Restock queue item removed for product ${removed.product}`, metadata: { productId: removed.product } })
  return removed
}

export const RestockServices = { addToRestockQueue, listQueue, restockFromQueue, removeFromQueue }
