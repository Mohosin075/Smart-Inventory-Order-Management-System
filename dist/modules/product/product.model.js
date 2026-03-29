"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: false },
    price: { type: Number, required: true, default: 0 },
    stockQuantity: { type: Number, required: true, default: 0 },
    minStockThreshold: { type: Number, required: true, default: 5 },
    status: { type: String, enum: ['Active', 'Out of Stock'], default: 'Active' },
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)('Product', ProductSchema);
