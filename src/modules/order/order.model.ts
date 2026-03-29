import { Schema, model, Types } from 'mongoose'

export interface IOrderProduct {
  product: Types.ObjectId
  quantity: number
  price: number
}

export interface IOrder {
  customerName: string
  products: IOrderProduct[]
  totalPrice: number
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
}

const OrderProductSchema = new Schema<IOrderProduct>({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
})

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    products: { type: [OrderProductSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true },
)

export const Order = model<IOrder>('Order', OrderSchema)
