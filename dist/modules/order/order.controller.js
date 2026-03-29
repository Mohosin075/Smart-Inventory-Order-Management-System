"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const order_service_1 = require("./order.service");
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { customerName, products } = req.body;
    const created = await order_service_1.OrderServices.createOrder(customerName, products);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, message: 'Order created successfully', order: created });
});
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { orderId, status } = req.body;
    const updated = await order_service_1.OrderServices.updateOrderStatus(orderId, status);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: `Order #${orderId} status updated to ${status}`, order: updated });
});
const listOrders = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderServices.listOrders(req.query);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: result.data, meta: result.meta });
});
const getOrder = (0, catchAsync_1.default)(async (req, res) => {
    const order = await order_service_1.OrderServices.getOrder(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: order });
});
const cancelOrder = (0, catchAsync_1.default)(async (req, res) => {
    const order = await order_service_1.OrderServices.cancelOrder(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Order cancelled', data: order });
});
exports.OrderController = { createOrder, updateOrderStatus, listOrders, getOrder, cancelOrder };
