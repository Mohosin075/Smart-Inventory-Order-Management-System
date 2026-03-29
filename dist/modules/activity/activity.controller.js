"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const activity_service_1 = require("./activity.service");
const getRecentActivities = (0, catchAsync_1.default)(async (req, res) => {
    const limit = Number(req.query.limit || 10);
    const activities = await activity_service_1.ActivityServices.getRecentActivities(limit);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Recent activities fetched successfully', activities });
});
exports.ActivityController = { getRecentActivities };
