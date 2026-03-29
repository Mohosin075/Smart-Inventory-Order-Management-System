import { Product } from '../product/product.model'
import { Restock } from '../restock/restock.model'
import { Activity } from '../activity/activity.model'
import { StatusCodes } from 'http-status-codes'

const handleStockDeduction = async (productId: string, quantity: number) => {
  const q = Number(quantity || 0)
  if (!productId || q <= 0) throw { status: StatusCodes.BAD_REQUEST, message: 'productId and positive quantity required' }
  const product = await Product.findById(productId)
  if (!product) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  if (q > product.stockQuantity) throw { status: StatusCodes.BAD_REQUEST, message: `Only ${product.stockQuantity} items available in stock` }
  const updated = await Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: -q } }, { new: true })
  if (updated) {
    if (updated.stockQuantity <= 0) { updated.status = 'Out of Stock'; await updated.save() }
    if (updated.stockQuantity < (updated.minStockThreshold || 5)) {
      const exists = await Restock.findOne({ product: updated._id })
      if (!exists) {
        const priority = updated.stockQuantity < 2 ? 'High' : 'Medium'
        await Restock.create({ product: updated._id, priority })
        await Activity.create({ action: `Product ${updated.name} added to restock queue`, metadata: { productId: updated._id } })
      }
    }
  }
  return updated
}

const handleStockRestock = async (productId: string, quantity: number) => {
  const q = Number(quantity || 0)
  if (!productId || q <= 0) throw { status: StatusCodes.BAD_REQUEST, message: 'productId and positive quantity required' }
  const updated = await Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: q }, $set: { status: 'Active' } }, { new: true })
  if (!updated) throw { status: StatusCodes.NOT_FOUND, message: 'Product not found' }
  await Restock.deleteMany({ product: updated._id })
  await Activity.create({ action: `Product ${updated.name} restocked by ${q}`, metadata: { productId: updated._id, quantity: q } })
  return updated
}

export const StockServices = { handleStockDeduction, handleStockRestock }
