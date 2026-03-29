"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const order_model_1 = require("../order/order.model");
const product_model_1 = require("../product/product.model");
const getInsights = (0, catchAsync_1.default)(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const totalOrdersToday = await order_model_1.Order.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const pendingOrders = await order_model_1.Order.countDocuments({ status: 'Pending' });
    const completedOrders = await order_model_1.Order.countDocuments({ status: { $in: ['Delivered', 'Shipped', 'Confirmed'] } });
    const lowStockItemsCount = await product_model_1.Product.countDocuments({ $expr: { $lt: ['$stockQuantity', '$minStockThreshold'] } });
    const revenueOrders = await order_model_1.Order.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).select('totalPrice');
    const revenueToday = revenueOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const topProducts = await product_model_1.Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name stockQuantity minStockThreshold');
    const productSummary = topProducts.map(p => ({
        name: p.name,
        stock: p.stockQuantity,
        threshold: p.minStockThreshold
    }));
    const insights = {
        totalOrdersToday,
        pendingOrders,
        completedOrders,
        lowStockItemsCount,
        revenueToday,
        productSummary
    };
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Dashboard insights fetched successfully', insights });
});
exports.DashboardController = { getInsights };
