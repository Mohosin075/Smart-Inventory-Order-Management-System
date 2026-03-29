import { Schema, model, Types } from 'mongoose'

export interface IRestock {
  product: Types.ObjectId
  priority: 'High' | 'Medium' | 'Low'
}

const RestockSchema = new Schema<IRestock>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  },
  { timestamps: true },
)

export const Restock = model<IRestock>('Restock', RestockSchema)
