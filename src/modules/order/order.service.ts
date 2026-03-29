import { StatusCodes } from 'http-status-codes'
import { Product } from '../product/product.model'
import { Order } from './order.model'
import { Restock } from '../restock/restock.model'
import { Activity } from '../activity/activity.model'
import { Types } from 'mongoose'

const createOrder = async (customerName: string, products: any[]) => {
  if (!customerName || !Array.isArray(products) || products.length === 0) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid order payload' }
  const ids = products.map(p => String(p.productId))
  if (new Set(ids).size !== ids.length) throw { status: StatusCodes.BAD_REQUEST, message: 'Duplicate products in order are not allowed' }

  const orderProducts: any[] = []
  let totalPrice = 0

  for (const p of products) {
    const productId = p.productId
    const quantity = Number(p.quantity || 0)
    if (!Types.ObjectId.isValid(productId) || quantity <= 0) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid product entry' }
    const product = await Product.findById(productId)
    if (!product) throw { status: StatusCodes.BAD_REQUEST, message: `Product ${productId} not found` }
    if (product.status !== 'Active') throw { status: StatusCodes.BAD_REQUEST, message: `Product ${product.name} is currently unavailable` }
    if (quantity > product.stockQuantity) throw { status: StatusCodes.BAD_REQUEST, message: `Only ${product.stockQuantity} items available in stock for ${product.name}` }
    totalPrice += product.price * quantity
    orderProducts.push({ product: product._id, quantity, price: product.price })
  }

  const created = await Order.create({ customerName, products: orderProducts, totalPrice })

  for (const op of orderProducts) {
    const updated = await Product.findByIdAndUpdate(op.product, { $inc: { stockQuantity: -op.quantity } }, { new: true })
    if (updated) {
      if (updated.stockQuantity <= 0) { updated.status = 'Out of Stock'; await updated.save() }
      if (updated.stockQuantity < (updated.minStockThreshold || 5)) {
        const exists = await Restock.findOne({ product: updated._id })
        if (!exists) {
          const priority = updated.stockQuantity < 2 ? 'High' : 'Medium'
          await Restock.create({ product: updated._id, priority })
        }
      }
    }
  }

  await Activity.create({ action: `Order #${created._id} created`, metadata: { orderId: created._id } })
  return created
}

const updateOrderStatus = async (orderId: string, status: string) => {
  if (!orderId || !status) throw { status: StatusCodes.BAD_REQUEST, message: 'orderId and status are required' }
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
  if (!order) throw { status: StatusCodes.NOT_FOUND, message: 'Order not found' }
  await Activity.create({ action: `Order #${order._id} status updated to ${status}`, metadata: { orderId: order._id, status } })
  return order
}

const listOrders = async (opts: any) => {
  const p = Math.max(Number(opts.page || 1), 1)
  const l = Math.max(Number(opts.limit || 20), 1)
  const filter: any = {}
  if (opts.status) filter.status = opts.status
  if (opts.search) filter.customerName = { $regex: opts.search, $options: 'i' }
  if (opts.from || opts.to) { filter.createdAt = {}; if (opts.from) filter.createdAt.$gte = new Date(opts.from); if (opts.to) filter.createdAt.$lte = new Date(opts.to) }
  const total = await Order.countDocuments(filter)
  const data = await Order.find(filter).skip((p - 1) * l).limit(l).sort({ createdAt: -1 })
  return { data, meta: { page: p, limit: l, total } }
}

const getOrder = async (id: string) => {
  const order = await Order.findById(id).populate('products.product')
  if (!order) throw { status: StatusCodes.NOT_FOUND, message: 'Order not found' }
  return order
}

const cancelOrder = async (id: string) => {
  const order = await Order.findById(id)
  if (!order) throw { status: StatusCodes.NOT_FOUND, message: 'Order not found' }
  if (order.status === 'Cancelled') throw { status: StatusCodes.BAD_REQUEST, message: 'Order already cancelled' }
  order.status = 'Cancelled'
  await order.save()
  for (const p of (order as any).products) { await Product.findByIdAndUpdate(p.product, { $inc: { stockQuantity: p.quantity } }) }
  await Activity.create({ action: `Order #${order._id} cancelled`, metadata: { orderId: order._id } })
  return order
}

export const OrderServices = { createOrder, updateOrderStatus, listOrders, getOrder, cancelOrder }
