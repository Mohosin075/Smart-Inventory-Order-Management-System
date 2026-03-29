"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const product_model_1 = require("../product/product.model");
const order_model_1 = require("./order.model");
const restock_model_1 = require("../restock/restock.model");
const activity_model_1 = require("../activity/activity.model");
const mongoose_1 = require("mongoose");
const createOrder = async (customerName, products) => {
    if (!customerName || !Array.isArray(products) || products.length === 0)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Invalid order payload' };
    const ids = products.map(p => String(p.productId));
    if (new Set(ids).size !== ids.length)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Duplicate products in order are not allowed' };
    const orderProducts = [];
    let totalPrice = 0;
    for (const p of products) {
        const productId = p.productId;
        const quantity = Number(p.quantity || 0);
        if (!mongoose_1.Types.ObjectId.isValid(productId) || quantity <= 0)
            throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Invalid product entry' };
        const product = await product_model_1.Product.findById(productId);
        if (!product)
            throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `Product ${productId} not found` };
        if (product.status !== 'Active')
            throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `Product ${product.name} is currently unavailable` };
        if (quantity > product.stockQuantity)
            throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `Only ${product.stockQuantity} items available in stock for ${product.name}` };
        totalPrice += product.price * quantity;
        orderProducts.push({ product: product._id, quantity, price: product.price });
    }
    const created = await order_model_1.Order.create({ customerName, products: orderProducts, totalPrice });
    for (const op of orderProducts) {
        const updated = await product_model_1.Product.findByIdAndUpdate(op.product, { $inc: { stockQuantity: -op.quantity } }, { new: true });
        if (updated) {
            if (updated.stockQuantity <= 0) {
                updated.status = 'Out of Stock';
                await updated.save();
            }
            if (updated.stockQuantity < (updated.minStockThreshold || 5)) {
                const exists = await restock_model_1.Restock.findOne({ product: updated._id });
                if (!exists) {
                    const priority = updated.stockQuantity < 2 ? 'High' : 'Medium';
                    await restock_model_1.Restock.create({ product: updated._id, priority });
                }
            }
        }
    }
    await activity_model_1.Activity.create({ action: `Order #${created._id} created`, metadata: { orderId: created._id } });
    return created;
};
const updateOrderStatus = async (orderId, status) => {
    if (!orderId || !status)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'orderId and status are required' };
    const order = await order_model_1.Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Order not found' };
    await activity_model_1.Activity.create({ action: `Order #${order._id} status updated to ${status}`, metadata: { orderId: order._id, status } });
    return order;
};
const listOrders = async (opts) => {
    const p = Math.max(Number(opts.page || 1), 1);
    const l = Math.max(Number(opts.limit || 20), 1);
    const filter = {};
    if (opts.status)
        filter.status = opts.status;
    if (opts.search)
        filter.customerName = { $regex: opts.search, $options: 'i' };
    if (opts.from || opts.to) {
        filter.createdAt = {};
        if (opts.from)
            filter.createdAt.$gte = new Date(opts.from);
        if (opts.to)
            filter.createdAt.$lte = new Date(opts.to);
    }
    const total = await order_model_1.Order.countDocuments(filter);
    const data = await order_model_1.Order.find(filter).skip((p - 1) * l).limit(l).sort({ createdAt: -1 });
    return { data, meta: { page: p, limit: l, total } };
};
const getOrder = async (id) => {
    const order = await order_model_1.Order.findById(id).populate('products.product');
    if (!order)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Order not found' };
    return order;
};
const cancelOrder = async (id) => {
    const order = await order_model_1.Order.findById(id);
    if (!order)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Order not found' };
    if (order.status === 'Cancelled')
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Order already cancelled' };
    order.status = 'Cancelled';
    await order.save();
    for (const p of order.products) {
        await product_model_1.Product.findByIdAndUpdate(p.product, { $inc: { stockQuantity: p.quantity } });
    }
    await activity_model_1.Activity.create({ action: `Order #${order._id} cancelled`, metadata: { orderId: order._id } });
    return order;
};
exports.OrderServices = { createOrder, updateOrderStatus, listOrders, getOrder, cancelOrder };
