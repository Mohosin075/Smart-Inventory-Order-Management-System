"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityServices = void 0;
const activity_model_1 = require("./activity.model");
const getRecentActivities = async (limit = 10) => {
    return activity_model_1.Activity.find().sort({ createdAt: -1 }).limit(limit);
};
exports.ActivityServices = { getRecentActivities };
