import { Schema, model } from 'mongoose'

export interface IActivity {
  action: string
  metadata?: any
}

const ActivitySchema = new Schema<IActivity>(
  {
    action: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
)

export const Activity = model<IActivity>('Activity', ActivitySchema)
