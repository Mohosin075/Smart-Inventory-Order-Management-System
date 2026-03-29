"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const category_model_1 = require("./category.model");
const product_model_1 = require("./product.model");
const createCategory = async (name) => {
    if (!name)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Category name is required' };
    const existing = await category_model_1.Category.findOne({ name });
    if (existing)
        throw { status: http_status_codes_1.StatusCodes.CONFLICT, message: 'Category already exists' };
    return category_model_1.Category.create({ name });
};
const createProduct = async (payload) => {
    const { name, category: categoryId, price = 0, stockQuantity = 0, minStockThreshold = 5 } = payload;
    if (!name)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Product name is required' };
    let category = undefined;
    if (categoryId) {
        category = await category_model_1.Category.findById(categoryId);
        if (!category)
            throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Invalid category id' };
    }
    return product_model_1.Product.create({ name, category: category ? category._id : undefined, price, stockQuantity, minStockThreshold, status: stockQuantity > 0 ? 'Active' : 'Out of Stock' });
};
const listProducts = async (opts) => {
    const page = Math.max(Number(opts.page || 1), 1);
    const limit = Math.max(Number(opts.limit || 20), 1);
    const filter = {};
    if (opts.search)
        filter.$or = [{ name: { $regex: opts.search, $options: 'i' } }];
    const total = await product_model_1.Product.countDocuments(filter);
    const data = await product_model_1.Product.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
    return { data, meta: { page, limit, total } };
};
const getProduct = async (id) => {
    const product = await product_model_1.Product.findById(id);
    if (!product)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Product not found' };
    return product;
};
const updateProduct = async (id, payload) => {
    const updated = await product_model_1.Product.findByIdAndUpdate(id, { $set: payload }, { new: true });
    if (!updated)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Product not found' };
    return updated;
};
const restockProduct = async (id, quantity) => {
    const q = Number(quantity || 0);
    if (q <= 0)
        throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Invalid quantity' };
    const updated = await product_model_1.Product.findByIdAndUpdate(id, { $inc: { stockQuantity: q }, $set: { status: 'Active' } }, { new: true });
    if (!updated)
        throw { status: http_status_codes_1.StatusCodes.NOT_FOUND, message: 'Product not found' };
    // remove from restock
    const { Restock } = await Promise.resolve().then(() => __importStar(require('../restock/restock.model')));
    await Restock.deleteMany({ product: updated._id });
    const { Activity } = await Promise.resolve().then(() => __importStar(require('../activity/activity.model')));
    await Activity.create({ action: `Product ${updated.name} restocked by ${q}`, metadata: { productId: updated._id, quantity: q } });
    return updated;
};
exports.ProductServices = { createCategory, createProduct, listProducts, getProduct, updateProduct, restockProduct };
