import { Activity } from './activity.model'

const getRecentActivities = async (limit = 10) => {
  return Activity.find().sort({ createdAt: -1 }).limit(limit)
}

export const ActivityServices = { getRecentActivities }
