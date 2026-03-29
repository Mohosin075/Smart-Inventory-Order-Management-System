import { Order } from '../order/order.model'
import { Product } from '../product/product.model'
import { Types } from 'mongoose'
import { StatusCodes } from 'http-status-codes'

const detectConflicts = async (payload: any) => {
  const { productId, orderId, products } = payload
  const conflicts: string[] = []
  if (Array.isArray(products)) {
    const ids = products.map((p: any) => String(p.productId))
    if (new Set(ids).size !== ids.length) conflicts.push('This product is already added to the order.')
  }
  if (productId && Types.ObjectId.isValid(productId)) {
    const product = await Product.findById(productId)
    if (!product) conflicts.push('This product does not exist.')
    else if (product.status !== 'Active') conflicts.push('This product is currently unavailable.')
  }
  if (orderId && Types.ObjectId.isValid(orderId) && productId && Types.ObjectId.isValid(productId)) {
    const order = await Order.findById(orderId)
    if (order) {
      const present = (order as any).products.find((p: any) => String(p.product) === String(productId))
      if (present) conflicts.push('This product is already added to the order.')
    }
  }
  return conflicts
}

export const ConflictServices = { detectConflicts }
