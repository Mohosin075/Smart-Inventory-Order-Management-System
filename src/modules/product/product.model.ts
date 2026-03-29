import { Schema, model, Types } from 'mongoose'

export interface IProduct {
  name: string
  category?: Types.ObjectId
  price: number
  stockQuantity: number
  minStockThreshold: number
  status: 'Active' | 'Out of Stock'
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    price: { type: Number, required: true, default: 0 },
    stockQuantity: { type: Number, required: true, default: 0 },
    minStockThreshold: { type: Number, required: true, default: 5 },
    status: { type: String, enum: ['Active', 'Out of Stock'], default: 'Active' },
  },
  { timestamps: true },
)

export const Product = model<IProduct>('Product', ProductSchema)
