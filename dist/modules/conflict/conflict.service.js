"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictServices = void 0;
const order_model_1 = require("../order/order.model");
const product_model_1 = require("../product/product.model");
const mongoose_1 = require("mongoose");
const detectConflicts = async (payload) => {
    const { productId, orderId, products } = payload;
    const conflicts = [];
    if (Array.isArray(products)) {
        const ids = products.map((p) => String(p.productId));
        if (new Set(ids).size !== ids.length)
            conflicts.push('This product is already added to the order.');
    }
    if (productId && mongoose_1.Types.ObjectId.isValid(productId)) {
        const product = await product_model_1.Product.findById(productId);
        if (!product)
            conflicts.push('This product does not exist.');
        else if (product.status !== 'Active')
            conflicts.push('This product is currently unavailable.');
    }
    if (orderId && mongoose_1.Types.ObjectId.isValid(orderId) && productId && mongoose_1.Types.ObjectId.isValid(productId)) {
        const order = await order_model_1.Order.findById(orderId);
        if (order) {
            const present = order.products.find((p) => String(p.product) === String(productId));
            if (present)
                conflicts.push('This product is already added to the order.');
        }
    }
    return conflicts;
};
exports.ConflictServices = { detectConflicts };
