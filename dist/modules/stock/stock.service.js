"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockServices = void 0;
const product_model_1 = require("../product/product.model");
const restock_model_1 = require("../restock/restock.model");
const activity_model_1 = require("../activity/activity.model");
const http_status_codes_1 = require("http-status-codes");
const handleStockDeduction = async (productId, quantity) => {
    const q = Number(quantity || 0);
    if (!productId || q <= 0)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'productId and positive quantity required' };
    const product = await product_model_1.Product.findById(productId);
    if (!product)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Product not found' };
    if (q > product.stockQuantity)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: `Only ${product.stockQuantity} items available in stock` };
    const updated = await product_model_1.Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: -q } }, { new: true });
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
                await activity_model_1.Activity.create({ action: `Product ${updated.name} added to restock queue`, metadata: { productId: updated._id } });
            }
        }
    }
    return updated;
};
const handleStockRestock = async (productId, quantity) => {
    const q = Number(quantity || 0);
    if (!productId || q <= 0)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'productId and positive quantity required' };
    const updated = await product_model_1.Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: q }, $set: { status: 'Active' } }, { new: true });
    if (!updated)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Product not found' };
    await restock_model_1.Restock.deleteMany({ product: updated._id });
    await activity_model_1.Activity.create({ action: `Product ${updated.name} restocked by ${q}`, metadata: { productId: updated._id, quantity: q } });
    return updated;
};
exports.StockServices = { handleStockDeduction, handleStockRestock };
