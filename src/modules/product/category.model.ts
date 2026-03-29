import { Schema, model } from 'mongoose'

interface ICategory {
  name: string
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
)

export const Category = model<ICategory>('Category', CategorySchema)
