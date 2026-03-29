"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestockServices = void 0;
const restock_model_1 = require("./restock.model");
const product_model_1 = require("../product/product.model");
const activity_model_1 = require("../activity/activity.model");
const http_status_codes_1 = require("http-status-codes");
const addToRestockQueue = async (productId) => {
    if (!productId)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'productId required' };
    const product = await product_model_1.Product.findById(productId);
    if (!product)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Product not found' };
    const priority = product.stockQuantity < 2 ? 'High' : product.stockQuantity < 5 ? 'Medium' : 'Low';
    const exists = await restock_model_1.Restock.findOne({ product: product._id });
    if (exists)
        return exists;
    const queueItem = await restock_model_1.Restock.create({ product: product._id, priority });
    await activity_model_1.Activity.create({ action: `Product ${product.name} added to restock queue`, metadata: { productId: product._id, priority } });
    return queueItem;
};
const listQueue = async () => {
    return restock_model_1.Restock.find().populate('product').sort({ 'product.stockQuantity': 1 });
};
const restockFromQueue = async (id, quantity) => {
    const q = Number(quantity || 0);
    if (q <= 0)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Invalid quantity' };
    const item = await restock_model_1.Restock.findById(id);
    if (!item)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Queue item not found' };
    const product = await product_model_1.Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: q }, $set: { status: 'Active' } }, { new: true });
    if (!product)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Product not found' };
    await restock_model_1.Restock.findByIdAndDelete(id);
    await activity_model_1.Activity.create({ action: `Product ${product.name} restocked from queue by ${q}`, metadata: { productId: product._id } });
    return product;
};
const removeFromQueue = async (id) => {
    const removed = await restock_model_1.Restock.findByIdAndDelete(id);
    if (!removed)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Queue item not found' };
    await activity_model_1.Activity.create({ action: `Restock queue item removed for product ${removed.product}`, metadata: { productId: removed.product } });
    return removed;
};
exports.RestockServices = { addToRestockQueue, listQueue, restockFromQueue, removeFromQueue };
